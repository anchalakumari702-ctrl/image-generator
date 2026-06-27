#!/bin/bash

# Dragon AI Image - SSL Certificate Renewal Script
# Automatically renews Let's Encrypt certificates and restarts services

set -e

# Configuration
DOMAIN="${SSL_DOMAIN:-your-domain.com}"
EMAIL="${SSL_EMAIL:-admin@your-domain.com}"
CERT_DIR="/etc/letsencrypt/live/${DOMAIN}"
SSL_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)/ssl"
DOCKER_COMPOSE_FILE="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)/docker-compose.yml"
LOG_FILE="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)/logs/ssl-renewal.log"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Create log directory
mkdir -p "$(dirname "$LOG_FILE")"

# Logging function
log() {
    local level=$1
    shift
    local message="$@"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo -e "${timestamp} [${level}] ${message}" | tee -a "$LOG_FILE"
}

# Error handler
error_exit() {
    log "ERROR" "${RED}$1${NC}"
    exit 1
}

# Success message
success() {
    log "INFO" "${GREEN}$1${NC}"
}

# Warning message
warning() {
    log "WARN" "${YELLOW}$1${NC}"
}

# Check prerequisites
check_prerequisites() {
    log "INFO" "Checking prerequisites..."
    
    if ! command -v certbot &> /dev/null; then
        error_exit "Certbot is not installed. Install with: sudo apt-get install certbot python3-certbot-nginx"
    fi
    
    if ! command -v docker &> /dev/null; then
        error_exit "Docker is not installed"
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        error_exit "Docker Compose is not installed"
    fi
    
    success "All prerequisites met"
}

# Check certificate status
check_certificate() {
    log "INFO" "Checking certificate status..."
    
    if [ ! -f "$CERT_DIR/fullchain.pem" ]; then
        error_exit "Certificate not found at $CERT_DIR/fullchain.pem"
    fi
    
    # Get certificate expiration date
    local expiry=$(openssl x509 -in "$CERT_DIR/fullchain.pem" -noout -enddate | cut -d= -f2)
    log "INFO" "Certificate expires: $expiry"
    
    # Check if certificate expires within 30 days
    local expiry_epoch=$(date -d "$expiry" +%s)
    local current_epoch=$(date +%s)
    local days_left=$(( ($expiry_epoch - $current_epoch) / 86400 ))
    
    log "INFO" "Days until expiration: $days_left"
    
    if [ $days_left -lt 30 ]; then
        log "INFO" "Certificate will expire soon, proceeding with renewal"
        return 0
    else
        log "INFO" "Certificate is still valid for $days_left days, skipping renewal"
        return 1
    fi
}

# Renew certificate
renew_certificate() {
    log "INFO" "Renewing certificate..."
    
    # Stop Nginx to free port 80
    log "INFO" "Stopping Nginx..."
    cd "$DOCKER_COMPOSE_FILE" && docker-compose stop nginx || true
    
    sleep 5
    
    # Renew certificate
    if certbot renew --quiet --agree-tos --email "$EMAIL"; then
        success "Certificate renewed successfully"
    else
        error_exit "Certificate renewal failed"
    fi
}

# Copy certificates to SSL directory
copy_certificates() {
    log "INFO" "Copying certificates to SSL directory..."
    
    if ! cp "$CERT_DIR/fullchain.pem" "$SSL_DIR/cert.pem"; then
        error_exit "Failed to copy certificate"
    fi
    
    if ! cp "$CERT_DIR/privkey.pem" "$SSL_DIR/key.pem"; then
        error_exit "Failed to copy private key"
    fi
    
    # Set proper permissions
    chmod 600 "$SSL_DIR/key.pem"
    chmod 644 "$SSL_DIR/cert.pem"
    
    success "Certificates copied successfully"
}

# Restart services
restart_services() {
    log "INFO" "Restarting services..."
    
    cd "$(dirname "$DOCKER_COMPOSE_FILE")"
    
    if docker-compose restart nginx; then
        success "Nginx restarted successfully"
    else
        error_exit "Failed to restart Nginx"
    fi
    
    sleep 5
    
    # Verify service is running
    if docker-compose ps nginx | grep -q "Up"; then
        success "Nginx is running"
    else
        error_exit "Nginx failed to start"
    fi
}

# Send notification
send_notification() {
    local status=$1
    local message=$2
    
    if [ -z "$ALERT_EMAIL" ]; then
        return
    fi
    
    local subject="Dragon AI Image - SSL Certificate Renewal ${status}"
    local email_body="SSL Certificate Renewal Report

Status: ${status}
Message: ${message}
Timestamp: $(date '+%Y-%m-%d %H:%M:%S')
Domain: ${DOMAIN}
Certificate Path: ${CERT_DIR}

Server: $(hostname)
"
    
    if command -v mail &> /dev/null; then
        echo "$email_body" | mail -s "$subject" "$ALERT_EMAIL"
        log "INFO" "Notification sent to $ALERT_EMAIL"
    fi
}

# Main execution
main() {
    log "INFO" "========================================="
    log "INFO" "SSL Certificate Renewal Process Started"
    log "INFO" "========================================="
    
    check_prerequisites
    
    if check_certificate; then
        renew_certificate
        copy_certificates
        restart_services
        
        success "========================================="
        success "SSL Certificate Renewal Completed"
        success "========================================="
        
        send_notification "SUCCESS" "Certificate renewed and services restarted"
        exit 0
    else
        log "INFO" "Certificate renewal not needed at this time"
        exit 0
    fi
}

# Run main function
main "$@"
