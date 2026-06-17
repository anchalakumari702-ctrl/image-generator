#!/bin/bash

# Dragon AI Image - One-Click Setup Script
# This script automates the complete self-hosted deployment

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENV_FILE="$SCRIPT_DIR/.env"
DOCKER_COMPOSE_FILE="$SCRIPT_DIR/docker-compose.yml"
BACKUP_DIR="$SCRIPT_DIR/backups"
LOGS_DIR="$SCRIPT_DIR/logs"
SSL_DIR="$SCRIPT_DIR/ssl"
NGINX_CONF_DIR="$SCRIPT_DIR/nginx"

# Logging functions
print_header() {
    echo -e "\n${BLUE}=========================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}=========================================${NC}\n"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

# Check prerequisites
check_prerequisites() {
    print_header "Checking Prerequisites"
    
    local missing_tools=()
    
    # Check for required commands
    for cmd in docker docker-compose curl openssl; do
        if ! command -v "$cmd" &> /dev/null; then
            missing_tools+=("$cmd")
            print_error "$cmd is not installed"
        else
            print_success "$cmd is installed"
        fi
    done
    
    if [ ${#missing_tools[@]} -gt 0 ]; then
        print_error "Missing required tools: ${missing_tools[*]}"
        echo -e "\n${YELLOW}Installation instructions:${NC}"
        echo "Ubuntu/Debian: sudo apt-get install docker.io docker-compose curl openssl"
        echo "CentOS/RHEL: sudo yum install docker docker-compose curl openssl"
        exit 1
    fi
    
    # Check Docker daemon
    if ! docker ps > /dev/null 2>&1; then
        print_error "Docker daemon is not running"
        echo "Start Docker with: sudo systemctl start docker"
        exit 1
    fi
    
    print_success "All prerequisites are met"
}

# Create directory structure
create_directories() {
    print_header "Creating Directory Structure"
    
    mkdir -p "$BACKUP_DIR"
    mkdir -p "$LOGS_DIR"
    mkdir -p "$SSL_DIR"
    mkdir -p "$NGINX_CONF_DIR/conf.d"
    
    print_success "Directories created"
}

# Generate environment file
generate_env_file() {
    print_header "Generating Environment Configuration"
    
    if [ -f "$ENV_FILE" ]; then
        print_warning ".env file already exists"
        read -p "Do you want to regenerate it? (y/n) " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            print_info "Using existing .env file"
            return
        fi
    fi
    
    print_info "Creating .env file..."
    
    # Generate random passwords
    local mysql_root_password=$(openssl rand -base64 32)
    local mysql_password=$(openssl rand -base64 32)
    local jwt_secret=$(openssl rand -base64 64)
    
    cat > "$ENV_FILE" << EOF
# Dragon AI Image - Environment Configuration
# Generated on $(date)

# Node Environment
NODE_ENV=production

# Database Configuration
MYSQL_ROOT_PASSWORD=${mysql_root_password}
MYSQL_DATABASE=dragon_ai_image
MYSQL_USER=dragon_ai
MYSQL_PASSWORD=${mysql_password}
DATABASE_URL=mysql://dragon_ai:${mysql_password}@mysql:3306/dragon_ai_image

# JWT Configuration
JWT_SECRET=${jwt_secret}

# Firebase Configuration
VITE_APP_ID=your_firebase_app_id
VITE_APP_TITLE=Dragon AI Image
VITE_APP_LOGO=https://your-domain.com/logo.png

# Manus Built-in APIs (if using)
BUILT_IN_FORGE_API_URL=https://api.manus.im
BUILT_IN_FORGE_API_KEY=your_api_key
VITE_FRONTEND_FORGE_API_URL=https://api.manus.im
VITE_FRONTEND_FORGE_API_KEY=your_frontend_api_key

# Analytics
VITE_ANALYTICS_ENDPOINT=https://analytics.example.com
VITE_ANALYTICS_WEBSITE_ID=your_website_id

# Email Configuration (for alerts)
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_FROM=your-email@gmail.com
SMTP_PASSWORD=your-app-password
ALERT_EMAIL=admin@example.com

# Backup Configuration
RETENTION_DAYS=30

# Monitoring Configuration
APP_URL=https://your-domain.com
HEALTH_CHECK_INTERVAL=60
MAX_RETRIES=3

# SSL Configuration
SSL_DOMAIN=your-domain.com
SSL_EMAIL=admin@your-domain.com
EOF
    
    print_success ".env file created"
    print_warning "Please edit .env file and add your actual configuration values"
    print_info "Edit with: nano $ENV_FILE"
}

# Setup SSL certificates
setup_ssl() {
    print_header "Setting Up SSL Certificates"
    
    if [ -f "$SSL_DIR/cert.pem" ] && [ -f "$SSL_DIR/key.pem" ]; then
        print_warning "SSL certificates already exist"
        read -p "Do you want to regenerate them? (y/n) " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            print_info "Using existing SSL certificates"
            return
        fi
    fi
    
    print_info "Generating self-signed SSL certificates..."
    print_warning "For production, use Let's Encrypt certificates"
    
    openssl req -x509 -newkey rsa:4096 -keyout "$SSL_DIR/key.pem" -out "$SSL_DIR/cert.pem" \
        -days 365 -nodes -subj "/CN=localhost" 2>/dev/null
    
    chmod 600 "$SSL_DIR/key.pem"
    chmod 644 "$SSL_DIR/cert.pem"
    
    print_success "SSL certificates generated"
    print_info "Location: $SSL_DIR/"
    print_warning "For production, replace with Let's Encrypt certificates"
}

# Create Nginx configuration
create_nginx_config() {
    print_header "Creating Nginx Configuration"
    
    cat > "$NGINX_CONF_DIR/conf.d/default.conf" << 'EOF'
# Nginx configuration for Dragon AI Image
# This file is auto-generated by setup.sh

server {
    listen 80;
    server_name _;
    
    location /.well-known/acme-challenge/ {
        root /usr/share/nginx/html;
    }
    
    location / {
        return 301 https://$host$request_uri;
    }
}
EOF
    
    print_success "Nginx configuration created"
}

# Make scripts executable
make_scripts_executable() {
    print_header "Making Scripts Executable"
    
    chmod +x "$SCRIPT_DIR/scripts/backup.sh"
    chmod +x "$SCRIPT_DIR/scripts/monitor.sh"
    chmod +x "$SCRIPT_DIR/scripts/setup.sh"
    
    print_success "Scripts are now executable"
}

# Setup cron jobs
setup_cron_jobs() {
    print_header "Setting Up Cron Jobs"
    
    print_info "Adding daily backup job..."
    
    # Create cron job for daily backups
    local cron_job="0 2 * * * cd $SCRIPT_DIR && ./scripts/backup.sh >> $LOGS_DIR/backup.log 2>&1"
    
    # Check if job already exists
    if crontab -l 2>/dev/null | grep -q "backup.sh"; then
        print_warning "Backup cron job already exists"
    else
        (crontab -l 2>/dev/null; echo "$cron_job") | crontab -
        print_success "Daily backup job added (runs at 2 AM)"
    fi
}

# Build and start containers
build_and_start() {
    print_header "Building and Starting Containers"
    
    print_info "This may take a few minutes..."
    
    cd "$SCRIPT_DIR"
    
    # Load environment variables
    set -a
    source "$ENV_FILE"
    set +a
    
    # Build images
    print_info "Building Docker images..."
    if docker-compose build; then
        print_success "Docker images built successfully"
    else
        print_error "Failed to build Docker images"
        exit 1
    fi
    
    # Start containers
    print_info "Starting containers..."
    if docker-compose up -d; then
        print_success "Containers started successfully"
    else
        print_error "Failed to start containers"
        exit 1
    fi
    
    # Wait for services to be ready
    print_info "Waiting for services to be ready..."
    sleep 10
    
    # Check if services are running
    if docker-compose ps | grep -q "Up"; then
        print_success "All services are running"
    else
        print_error "Some services failed to start"
        docker-compose logs
        exit 1
    fi
}

# Start monitoring
start_monitoring() {
    print_header "Starting Monitoring"
    
    print_info "Starting health monitoring..."
    
    cd "$SCRIPT_DIR"
    
    if ./scripts/monitor.sh start; then
        print_success "Monitoring started"
    else
        print_warning "Failed to start monitoring"
    fi
}

# Display summary
display_summary() {
    print_header "Setup Complete!"
    
    echo -e "${GREEN}Dragon AI Image is now running!${NC}\n"
    
    echo "Next Steps:"
    echo "1. Edit configuration: nano $ENV_FILE"
    echo "2. Add your Firebase credentials"
    echo "3. Configure SSL certificates for production"
    echo "4. Set up your domain and DNS"
    echo "5. Configure email alerts"
    echo ""
    echo "Useful Commands:"
    echo "  View logs:        docker-compose logs -f app"
    echo "  Stop services:    docker-compose down"
    echo "  Restart services: docker-compose restart"
    echo "  Manual backup:    ./scripts/backup.sh"
    echo "  Check status:     docker-compose ps"
    echo ""
    echo "Documentation:"
    echo "  Installation Guide: ./docs/INSTALLATION.md"
    echo "  Configuration:      ./docs/CONFIGURATION.md"
    echo "  Backup & Recovery:  ./docs/BACKUP.md"
    echo ""
}

# Main setup process
main() {
    print_header "Dragon AI Image - Self-Hosted Setup"
    
    check_prerequisites
    create_directories
    generate_env_file
    setup_ssl
    create_nginx_config
    make_scripts_executable
    
    # Ask before building
    echo ""
    read -p "Ready to build and start containers? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        build_and_start
        setup_cron_jobs
        start_monitoring
        display_summary
    else
        print_info "Setup paused. Run again when ready."
    fi
}

# Run main function
main "$@"
