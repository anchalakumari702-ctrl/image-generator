# Dragon AI Image - Self-Hosted Deployment Guide

Complete guide for deploying Dragon AI Image on your own server using Docker.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Quick Start](#quick-start)
3. [System Requirements](#system-requirements)
4. [Installation Steps](#installation-steps)
5. [Configuration](#configuration)
6. [SSL/TLS Setup](#ssltls-setup)
7. [Backup & Recovery](#backup--recovery)
8. [Monitoring & Alerts](#monitoring--alerts)
9. [Troubleshooting](#troubleshooting)
10. [Security Best Practices](#security-best-practices)

---

## Prerequisites

### Required Software

- **Docker**: Version 20.10 or higher
- **Docker Compose**: Version 1.29 or higher
- **curl**: For health checks
- **openssl**: For SSL certificate generation
- **mail**: For email alerts (optional but recommended)

### System Requirements

- **OS**: Ubuntu 22.04 LTS (recommended), CentOS 8+, or any Linux distribution with Docker support
- **RAM**: Minimum 2GB, recommended 4GB+
- **Storage**: Minimum 20GB, recommended 50GB+
- **CPU**: 2 cores minimum, 4+ cores recommended
- **Network**: Static IP address (for production)

### Ports Required

- **80**: HTTP (for Let's Encrypt challenges and redirects)
- **443**: HTTPS (main application)
- **3306**: MySQL (internal, not exposed to internet)
- **3000**: Node.js app (internal, only accessed via Nginx)

---

## Quick Start

### One-Click Setup (Recommended)

```bash
# Clone or download the project
cd dragon-ai-image

# Run the setup script
bash scripts/setup.sh

# Follow the interactive prompts
```

The setup script will:
- Check prerequisites
- Create directory structure
- Generate `.env` configuration file
- Create SSL certificates
- Build Docker images
- Start all services
- Configure monitoring and backups

---

## System Requirements

### Minimum Configuration

```
CPU:    2 cores
RAM:    2GB
Disk:   20GB
Bandwidth: 1 Mbps
```

### Recommended Configuration

```
CPU:    4+ cores
RAM:    8GB+
Disk:   100GB+ (for backups and images)
Bandwidth: 10 Mbps+
```

### Supported Hosting Providers

- **VPS**: DigitalOcean, Linode, Vultr, AWS EC2
- **Dedicated Servers**: Hetzner, OVH, Scaleway
- **Personal Servers**: Any Linux machine with Docker support
- **Raspberry Pi**: Possible but not recommended for production

---

## Installation Steps

### Step 1: Prepare Your Server

```bash
# Update system packages
sudo apt-get update
sudo apt-get upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Add your user to docker group (optional, for sudo-less commands)
sudo usermod -aG docker $USER
newgrp docker
```

### Step 2: Clone/Download Project

```bash
# Clone the repository
git clone https://github.com/yourusername/dragon-ai-image.git
cd dragon-ai-image

# Or download and extract
wget https://your-repo/dragon-ai-image.zip
unzip dragon-ai-image.zip
cd dragon-ai-image
```

### Step 3: Run Setup Script

```bash
# Make setup script executable
chmod +x scripts/setup.sh

# Run the setup
bash scripts/setup.sh
```

### Step 4: Configure Environment

Edit the `.env` file with your actual values:

```bash
nano .env
```

Key configurations to update:
- `MYSQL_ROOT_PASSWORD`: Strong random password
- `MYSQL_PASSWORD`: Strong random password
- `JWT_SECRET`: Strong random secret
- Firebase credentials
- Email configuration
- Domain name

### Step 5: Start Services

```bash
# Start all services
docker-compose up -d

# Verify services are running
docker-compose ps

# Check logs
docker-compose logs -f app
```

---

## Configuration

### Environment Variables

Create or edit `.env` file with these variables:

```env
# Node Environment
NODE_ENV=production

# Database
MYSQL_ROOT_PASSWORD=your_strong_password
MYSQL_DATABASE=dragon_ai_image
MYSQL_USER=dragon_ai
MYSQL_PASSWORD=your_strong_password
DATABASE_URL=mysql://dragon_ai:password@mysql:3306/dragon_ai_image

# JWT
JWT_SECRET=your_very_long_random_secret

# Firebase
VITE_APP_ID=your_firebase_app_id
VITE_APP_TITLE=Dragon AI Image
VITE_APP_LOGO=https://your-domain.com/logo.png

# APIs
BUILT_IN_FORGE_API_URL=https://api.manus.im
BUILT_IN_FORGE_API_KEY=your_api_key
VITE_FRONTEND_FORGE_API_URL=https://api.manus.im
VITE_FRONTEND_FORGE_API_KEY=your_frontend_api_key

# Analytics
VITE_ANALYTICS_ENDPOINT=https://analytics.example.com
VITE_ANALYTICS_WEBSITE_ID=your_website_id

# Email Configuration
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_FROM=your-email@gmail.com
SMTP_PASSWORD=your-app-password
ALERT_EMAIL=admin@example.com

# Backup
RETENTION_DAYS=30

# Monitoring
APP_URL=https://your-domain.com
HEALTH_CHECK_INTERVAL=60
```

### Docker Compose Configuration

The `docker-compose.yml` includes:

- **MySQL Service**: Database container with persistent storage
- **App Service**: Node.js application container
- **Nginx Service**: Reverse proxy with SSL/TLS

All services are connected via a custom Docker network and use health checks.

---

## SSL/TLS Setup

### Option 1: Self-Signed Certificates (Development)

Already generated by setup script:

```bash
# Certificates are in ssl/ directory
ls -la ssl/
```

### Option 2: Let's Encrypt (Production - Recommended)

```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx -y

# Generate certificate
sudo certbot certonly --standalone -d your-domain.com

# Copy certificates to ssl directory
sudo cp /etc/letsencrypt/live/your-domain.com/fullchain.pem ssl/cert.pem
sudo cp /etc/letsencrypt/live/your-domain.com/privkey.pem ssl/key.pem
sudo chown $USER:$USER ssl/*
```

### Option 3: Automatic Renewal with Certbot

```bash
# Create renewal script
cat > scripts/renew-ssl.sh << 'EOF'
#!/bin/bash
certbot renew --quiet
cp /etc/letsencrypt/live/your-domain.com/fullchain.pem /path/to/ssl/cert.pem
cp /etc/letsencrypt/live/your-domain.com/privkey.pem /path/to/ssl/key.pem
docker-compose restart nginx
EOF

chmod +x scripts/renew-ssl.sh

# Add to crontab (runs monthly)
(crontab -l 2>/dev/null; echo "0 3 1 * * /path/to/scripts/renew-ssl.sh") | crontab -
```

---

## Backup & Recovery

### Manual Backup

```bash
# Run backup script
bash scripts/backup.sh

# Backups are saved in backups/ directory
ls -la backups/
```

### Automated Daily Backups

Already configured by setup script. Backups run daily at 2 AM.

```bash
# View backup schedule
crontab -l | grep backup.sh

# View backup logs
tail -f logs/backup.log
```

### Restore from Backup

```bash
# Stop services
docker-compose down

# Restore database
gunzip < backups/mysql_backup_YYYYMMDD_HHMMSS.sql.gz | \
  docker-compose exec -T mysql mysql -u root -p$MYSQL_ROOT_PASSWORD $MYSQL_DATABASE

# Restore application files
tar -xzf backups/app_backup_YYYYMMDD_HHMMSS.tar.gz

# Start services
docker-compose up -d
```

### Backup Retention Policy

- Default: 30 days
- Configure in `.env`: `RETENTION_DAYS=30`
- Old backups are automatically deleted

---

## Monitoring & Alerts

### Health Checks

Services have built-in health checks:

```bash
# View health status
docker-compose ps

# Manual health check
curl http://localhost:3000/health
```

### Uptime Monitoring

Monitoring script runs continuously:

```bash
# Start monitoring
bash scripts/monitor.sh start

# Stop monitoring
bash scripts/monitor.sh stop

# Run in foreground (for debugging)
bash scripts/monitor.sh foreground

# View monitoring logs
tail -f logs/monitor.log
```

### Email Alerts

Configured in `.env`:

```env
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_FROM=your-email@gmail.com
SMTP_PASSWORD=your-app-password
ALERT_EMAIL=admin@example.com
```

Alerts are sent for:
- Application health failures
- Database connection issues
- High disk usage (>90%)
- High memory usage (>90%)
- High CPU usage (>90%)

---

## Troubleshooting

### Services Won't Start

```bash
# Check Docker daemon
sudo systemctl status docker

# View detailed logs
docker-compose logs app
docker-compose logs mysql
docker-compose logs nginx

# Rebuild images
docker-compose build --no-cache

# Start with verbose output
docker-compose up
```

### Database Connection Issues

```bash
# Test database connection
docker-compose exec mysql mysql -u root -p$MYSQL_ROOT_PASSWORD -e "SELECT 1"

# Check database logs
docker-compose logs mysql

# Verify environment variables
docker-compose exec app env | grep DATABASE
```

### SSL Certificate Issues

```bash
# Check certificate validity
openssl x509 -in ssl/cert.pem -text -noout

# Verify certificate and key match
openssl x509 -noout -modulus -in ssl/cert.pem | openssl md5
openssl rsa -noout -modulus -in ssl/key.pem | openssl md5
```

### High Memory/CPU Usage

```bash
# Check resource usage
docker stats

# View application logs
docker-compose logs -f app

# Restart services
docker-compose restart app
```

### Backup Failures

```bash
# Check backup logs
tail -f logs/backup.log

# Verify backup directory permissions
ls -la backups/

# Test manual backup
bash scripts/backup.sh
```

---

## Security Best Practices

### 1. Firewall Configuration

```bash
# Allow only necessary ports
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22/tcp      # SSH
sudo ufw allow 80/tcp      # HTTP
sudo ufw allow 443/tcp     # HTTPS
sudo ufw enable
```

### 2. SSH Security

```bash
# Disable root login
sudo sed -i 's/^#PermitRootLogin.*/PermitRootLogin no/' /etc/ssh/sshd_config

# Disable password authentication
sudo sed -i 's/^#PasswordAuthentication.*/PasswordAuthentication no/' /etc/ssh/sshd_config

# Restart SSH
sudo systemctl restart sshd
```

### 3. Fail2Ban Setup

```bash
# Install Fail2Ban
sudo apt-get install fail2ban -y

# Create local configuration
sudo cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local

# Start Fail2Ban
sudo systemctl start fail2ban
sudo systemctl enable fail2ban
```

### 4. Regular Updates

```bash
# Update system packages
sudo apt-get update
sudo apt-get upgrade -y

# Update Docker images
docker-compose pull
docker-compose up -d
```

### 5. Database Security

```bash
# Change default MySQL passwords
docker-compose exec mysql mysql -u root -p$MYSQL_ROOT_PASSWORD \
  -e "ALTER USER 'root'@'localhost' IDENTIFIED BY 'new_strong_password';"

# Remove anonymous users
docker-compose exec mysql mysql -u root -p$MYSQL_ROOT_PASSWORD \
  -e "DELETE FROM mysql.user WHERE User='';"
```

### 6. Environment Variables Security

```bash
# Protect .env file
chmod 600 .env

# Never commit .env to git
echo ".env" >> .gitignore
```

### 7. Log Management

```bash
# Enable log rotation
sudo apt-get install logrotate -y

# Configure log rotation for Docker
cat | sudo tee /etc/logrotate.d/docker-compose << 'EOF'
/home/*/dragon-ai-image/logs/*.log {
    daily
    rotate 7
    compress
    delaycompress
    notifempty
    create 0640 root root
}
EOF
```

---

## Common Commands

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# Restart services
docker-compose restart

# View logs
docker-compose logs -f app

# Execute command in container
docker-compose exec app npm run db:push

# Check service status
docker-compose ps

# View resource usage
docker stats

# Backup database
bash scripts/backup.sh

# Start monitoring
bash scripts/monitor.sh start

# Update images
docker-compose pull
docker-compose up -d
```

---

## Support & Documentation

- **GitHub**: https://github.com/yourusername/dragon-ai-image
- **Issues**: https://github.com/yourusername/dragon-ai-image/issues
- **Email**: support@your-domain.com

---

## License

Dragon AI Image is licensed under the MIT License.

---

**Last Updated**: 2026-06-17
**Version**: 1.0.0
