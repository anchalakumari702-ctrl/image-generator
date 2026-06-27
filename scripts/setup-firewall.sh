#!/bin/bash

# Dragon AI Image - Firewall Configuration Script
# Sets up UFW firewall rules for production deployment

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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

# Check if running as root
check_root() {
    if [ "$EUID" -ne 0 ]; then
        print_error "This script must be run as root"
        echo "Run with: sudo bash scripts/setup-firewall.sh"
        exit 1
    fi
}

# Check if UFW is installed
check_ufw() {
    if ! command -v ufw &> /dev/null; then
        print_warning "UFW is not installed"
        read -p "Install UFW? (y/n) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            apt-get update
            apt-get install -y ufw
            print_success "UFW installed"
        else
            print_error "UFW is required for this script"
            exit 1
        fi
    fi
}

# Enable UFW
enable_ufw() {
    print_header "Enabling UFW Firewall"
    
    if ufw status | grep -q "Status: active"; then
        print_warning "UFW is already enabled"
        return
    fi
    
    # Set default policies
    ufw default deny incoming
    ufw default allow outgoing
    
    print_success "Default policies set"
}

# Configure firewall rules
configure_rules() {
    print_header "Configuring Firewall Rules"
    
    # Allow SSH (critical - don't lock yourself out!)
    print_info "Allowing SSH (port 22)..."
    ufw allow 22/tcp
    print_success "SSH allowed"
    
    # Allow HTTP
    print_info "Allowing HTTP (port 80)..."
    ufw allow 80/tcp
    print_success "HTTP allowed"
    
    # Allow HTTPS
    print_info "Allowing HTTPS (port 443)..."
    ufw allow 443/tcp
    print_success "HTTPS allowed"
    
    # Deny MySQL from outside (only internal access)
    print_info "Blocking MySQL (port 3306) from external access..."
    ufw deny 3306/tcp
    print_success "MySQL blocked externally"
    
    # Deny Node.js app port from outside (only via Nginx)
    print_info "Blocking Node.js port (3000) from external access..."
    ufw deny 3000/tcp
    print_success "Node.js port blocked externally"
}

# Enable UFW
activate_ufw() {
    print_header "Activating Firewall"
    
    print_warning "About to enable UFW. Make sure SSH is allowed!"
    read -p "Continue? (y/n) " -n 1 -r
    echo
    
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_info "Firewall activation cancelled"
        return
    fi
    
    ufw enable
    print_success "UFW firewall activated"
}

# Display firewall status
show_status() {
    print_header "Firewall Status"
    
    ufw status verbose
    
    print_info "\nCurrent Rules:"
    ufw show added
}

# Main execution
main() {
    print_header "Dragon AI Image - Firewall Configuration"
    
    check_root
    check_ufw
    enable_ufw
    configure_rules
    activate_ufw
    show_status
    
    print_header "Firewall Setup Complete!"
    
    echo "Summary:"
    echo "  ✓ SSH access allowed (port 22)"
    echo "  ✓ HTTP allowed (port 80)"
    echo "  ✓ HTTPS allowed (port 443)"
    echo "  ✓ MySQL blocked externally (port 3306)"
    echo "  ✓ Node.js blocked externally (port 3000)"
    echo ""
    echo "To view current rules: ufw status verbose"
    echo "To add more rules: ufw allow <port>/<protocol>"
    echo "To remove rules: ufw delete allow <port>/<protocol>"
    echo ""
}

# Run main function
main "$@"
