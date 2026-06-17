#!/bin/bash

# Dragon AI Image - Uptime Monitoring Script
# This script monitors application health and sends alerts

set -e

# Configuration
APP_URL="${APP_URL:-http://localhost:3000}"
HEALTH_CHECK_INTERVAL="${HEALTH_CHECK_INTERVAL:-60}"
MAX_RETRIES="${MAX_RETRIES:-3}"
ALERT_EMAIL="${ALERT_EMAIL}"
LOG_FILE="${LOG_FILE:-.}/logs/monitor.log"
PID_FILE="${PID_FILE:-.}/monitor.pid"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Create log directory if it doesn't exist
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

# Check application health
check_health() {
    local retry_count=0
    local http_code=0
    
    while [ $retry_count -lt $MAX_RETRIES ]; do
        http_code=$(curl -s -o /dev/null -w "%{http_code}" \
            --connect-timeout 5 \
            --max-time 10 \
            "$APP_URL/health" 2>/dev/null || echo "000")
        
        if [ "$http_code" = "200" ]; then
            return 0
        fi
        
        ((retry_count++))
        if [ $retry_count -lt $MAX_RETRIES ]; then
            sleep 2
        fi
    done
    
    return 1
}

# Check database connectivity
check_database() {
    if ! docker exec dragon-ai-mysql mysqladmin ping -h localhost > /dev/null 2>&1; then
        return 1
    fi
    return 0
}

# Check disk space
check_disk_space() {
    local usage=$(df / | awk 'NR==2 {print $5}' | sed 's/%//')
    
    if [ "$usage" -gt 90 ]; then
        warning "Disk usage is high: ${usage}%"
        return 1
    fi
    
    return 0
}

# Check memory usage
check_memory() {
    local usage=$(free | grep Mem | awk '{printf("%.0f", $3/$2 * 100)}')
    
    if [ "$usage" -gt 90 ]; then
        warning "Memory usage is high: ${usage}%"
        return 1
    fi
    
    return 0
}

# Check CPU usage
check_cpu() {
    local usage=$(top -bn1 | grep "Cpu(s)" | sed "s/.*, *\([0-9.]*\)%* id.*/\1/" | awk '{printf("%.0f", 100 - $1)}')
    
    if [ "$usage" -gt 90 ]; then
        warning "CPU usage is high: ${usage}%"
        return 1
    fi
    
    return 0
}

# Send alert email
send_alert() {
    local subject=$1
    local message=$2
    
    if [ -z "$ALERT_EMAIL" ]; then
        warning "Alert email not configured, skipping notification"
        return
    fi
    
    local email_body="Alert: ${subject}

Timestamp: $(date '+%Y-%m-%d %H:%M:%S')
Message: ${message}

Server: $(hostname)
App URL: ${APP_URL}

System Status:
- Disk Usage: $(df / | awk 'NR==2 {print $5}')
- Memory Usage: $(free | grep Mem | awk '{printf("%.0f", $3/$2 * 100)}')%
- CPU Usage: $(top -bn1 | grep "Cpu(s)" | sed "s/.*, *\([0-9.]*\)%* id.*/\1/" | awk '{printf("%.0f", 100 - $1)}')%
- Uptime: $(uptime)
"
    
    if command -v mail &> /dev/null; then
        echo "$email_body" | mail -s "$subject" "$ALERT_EMAIL"
        log "INFO" "Alert email sent to $ALERT_EMAIL"
    else
        warning "Mail command not found, email alert skipped"
    fi
}

# Restart application
restart_app() {
    log "INFO" "Attempting to restart application..."
    
    if docker-compose restart app; then
        success "Application restarted successfully"
        sleep 5
        return 0
    else
        error_exit "Failed to restart application"
    fi
}

# Daemonize function
daemonize() {
    if [ -f "$PID_FILE" ]; then
        local old_pid=$(cat "$PID_FILE")
        if ps -p "$old_pid" > /dev/null 2>&1; then
            error_exit "Monitor is already running (PID: $old_pid)"
        fi
    fi
    
    # Fork to background
    nohup "$0" --background > /dev/null 2>&1 &
    local pid=$!
    echo $pid > "$PID_FILE"
    success "Monitor started in background (PID: $pid)"
}

# Stop monitoring
stop_monitoring() {
    if [ -f "$PID_FILE" ]; then
        local pid=$(cat "$PID_FILE")
        if ps -p "$pid" > /dev/null 2>&1; then
            kill $pid
            rm "$PID_FILE"
            success "Monitor stopped"
        fi
    fi
}

# Main monitoring loop
monitor_loop() {
    local consecutive_failures=0
    local last_alert_time=0
    local alert_cooldown=3600  # 1 hour cooldown between alerts
    
    log "INFO" "========================================="
    log "INFO" "Dragon AI Image Monitoring Started"
    log "INFO" "========================================="
    log "INFO" "App URL: $APP_URL"
    log "INFO" "Health Check Interval: ${HEALTH_CHECK_INTERVAL}s"
    log "INFO" "========================================="
    
    while true; do
        local current_time=$(date +%s)
        local health_ok=true
        local status_message=""
        
        # Perform health checks
        if ! check_health; then
            health_ok=false
            ((consecutive_failures++))
            status_message="Application health check failed"
        else
            consecutive_failures=0
            status_message="Application is healthy"
        fi
        
        # Check system resources
        if ! check_disk_space; then
            health_ok=false
            status_message="${status_message}, Disk space critical"
        fi
        
        if ! check_memory; then
            health_ok=false
            status_message="${status_message}, Memory usage high"
        fi
        
        if ! check_cpu; then
            health_ok=false
            status_message="${status_message}, CPU usage high"
        fi
        
        # Check database
        if ! check_database; then
            health_ok=false
            status_message="${status_message}, Database connection failed"
        fi
        
        # Log status
        if [ "$health_ok" = true ]; then
            log "INFO" "✓ ${status_message}"
        else
            log "WARN" "✗ ${status_message}"
            
            # Send alert if cooldown has passed
            if [ $((current_time - last_alert_time)) -gt $alert_cooldown ]; then
                send_alert "Dragon AI Image Health Alert" "$status_message"
                last_alert_time=$current_time
            fi
            
            # Restart app after 3 consecutive failures
            if [ $consecutive_failures -ge 3 ]; then
                warning "Application failed ${consecutive_failures} times, attempting restart..."
                if restart_app; then
                    consecutive_failures=0
                else
                    send_alert "Dragon AI Image Critical Alert" "Application restart failed after ${consecutive_failures} failures"
                fi
            fi
        fi
        
        sleep "$HEALTH_CHECK_INTERVAL"
    done
}

# Parse command line arguments
case "${1:-start}" in
    start)
        daemonize
        ;;
    stop)
        stop_monitoring
        ;;
    foreground)
        monitor_loop
        ;;
    --background)
        monitor_loop
        ;;
    *)
        echo "Usage: $0 {start|stop|foreground}"
        exit 1
        ;;
esac
