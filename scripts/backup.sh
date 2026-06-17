#!/bin/bash

# Dragon AI Image - Backup Script
# This script backs up the database and application files

set -e

# Configuration
BACKUP_DIR="${BACKUP_DIR:-.}/backups"
DB_CONTAINER="dragon-ai-mysql"
DB_NAME="${MYSQL_DATABASE:-dragon_ai_image}"
DB_USER="${MYSQL_USER:-dragon_ai}"
DB_PASSWORD="${MYSQL_PASSWORD}"
RETENTION_DAYS="${RETENTION_DAYS:-30}"
LOG_FILE="${BACKUP_DIR}/backup.log"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

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

# Check if Docker is running
check_docker() {
    if ! command -v docker &> /dev/null; then
        error_exit "Docker is not installed or not in PATH"
    fi
    
    if ! docker ps > /dev/null 2>&1; then
        error_exit "Docker daemon is not running"
    fi
}

# Backup database
backup_database() {
    log "INFO" "Starting database backup..."
    
    local backup_file="${BACKUP_DIR}/mysql_backup_$(date +%Y%m%d_%H%M%S).sql.gz"
    
    if ! docker exec "$DB_CONTAINER" mysqldump \
        -u"$DB_USER" \
        -p"$DB_PASSWORD" \
        "$DB_NAME" | gzip > "$backup_file"; then
        error_exit "Database backup failed"
    fi
    
    local file_size=$(du -h "$backup_file" | cut -f1)
    success "Database backup completed: ${backup_file} (${file_size})"
    
    echo "$backup_file"
}

# Backup application files
backup_application() {
    log "INFO" "Starting application backup..."
    
    local backup_file="${BACKUP_DIR}/app_backup_$(date +%Y%m%d_%H%M%S).tar.gz"
    
    # Backup important application directories
    if ! tar -czf "$backup_file" \
        --exclude=node_modules \
        --exclude=.git \
        --exclude=dist \
        --exclude=.manus-logs \
        --exclude=backups \
        --exclude=.env \
        . 2>/dev/null; then
        error_exit "Application backup failed"
    fi
    
    local file_size=$(du -h "$backup_file" | cut -f1)
    success "Application backup completed: ${backup_file} (${file_size})"
    
    echo "$backup_file"
}

# Clean old backups
cleanup_old_backups() {
    log "INFO" "Cleaning up backups older than ${RETENTION_DAYS} days..."
    
    local deleted_count=0
    while IFS= read -r file; do
        rm -f "$file"
        ((deleted_count++))
        log "INFO" "Deleted old backup: $file"
    done < <(find "$BACKUP_DIR" -type f -name "*.sql.gz" -o -name "*.tar.gz" | xargs -r find -mtime +"$RETENTION_DAYS" 2>/dev/null)
    
    if [ "$deleted_count" -gt 0 ]; then
        success "Deleted ${deleted_count} old backup(s)"
    fi
}

# Verify backup integrity
verify_backup() {
    local backup_file=$1
    
    log "INFO" "Verifying backup integrity: $backup_file"
    
    if ! gzip -t "$backup_file" 2>/dev/null; then
        error_exit "Backup file is corrupted: $backup_file"
    fi
    
    success "Backup integrity verified"
}

# Send email notification
send_email_notification() {
    local status=$1
    local message=$2
    local backup_files=$3
    
    if [ -z "$SMTP_SERVER" ] || [ -z "$SMTP_FROM" ] || [ -z "$SMTP_TO" ]; then
        warning "Email configuration not set, skipping notification"
        return
    fi
    
    local subject="Dragon AI Image Backup ${status} - $(date +%Y-%m-%d)"
    
    # Create email body
    local email_body="Backup Status: ${status}

Timestamp: $(date '+%Y-%m-%d %H:%M:%S')
Message: ${message}

Backup Files:
${backup_files}

Server: $(hostname)
"
    
    # Send email using mail command (requires postfix/sendmail)
    if command -v mail &> /dev/null; then
        echo "$email_body" | mail -s "$subject" "$SMTP_TO"
        log "INFO" "Email notification sent to $SMTP_TO"
    else
        warning "Mail command not found, email notification skipped"
    fi
}

# Main backup process
main() {
    log "INFO" "========================================="
    log "INFO" "Dragon AI Image Backup Process Started"
    log "INFO" "========================================="
    
    check_docker
    
    local db_backup=""
    local app_backup=""
    local backup_status="FAILED"
    local backup_message=""
    
    # Perform backups
    if db_backup=$(backup_database); then
        if app_backup=$(backup_application); then
            # Verify backups
            verify_backup "$db_backup"
            
            # Cleanup old backups
            cleanup_old_backups
            
            backup_status="SUCCESS"
            backup_message="All backups completed successfully"
            success "========================================="
            success "Backup Process Completed Successfully"
            success "========================================="
        else
            backup_message="Application backup failed"
        fi
    else
        backup_message="Database backup failed"
    fi
    
    # Send notification
    local backup_files="${db_backup}\n${app_backup}"
    send_email_notification "$backup_status" "$backup_message" "$backup_files"
    
    # Exit with appropriate code
    if [ "$backup_status" = "SUCCESS" ]; then
        exit 0
    else
        exit 1
    fi
}

# Run main function
main "$@"
