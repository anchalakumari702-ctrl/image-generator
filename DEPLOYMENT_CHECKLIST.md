# Dragon AI Image - Deployment Checklist

Complete checklist for deploying Dragon AI Image to production.

## Pre-Deployment

### Server Preparation
- [ ] Provision VPS/Dedicated Server (Ubuntu 22.04 LTS recommended)
- [ ] SSH into server with root access
- [ ] Update system packages: `sudo apt-get update && sudo apt-get upgrade -y`
- [ ] Set hostname: `sudo hostnamectl set-hostname dragon-ai-image`
- [ ] Configure static IP address (if not already configured)
- [ ] Set up DNS records pointing to server IP

### Domain Setup
- [ ] Purchase domain name (if not already owned)
- [ ] Add A record pointing to server IP
- [ ] Add AAAA record for IPv6 (if applicable)
- [ ] Wait for DNS propagation (can take up to 48 hours)
- [ ] Test DNS resolution: `nslookup your-domain.com`

### Security Prerequisites
- [ ] Generate SSH key pair (if not already done)
- [ ] Add SSH public key to server
- [ ] Test SSH connection without password
- [ ] Disable SSH password authentication
- [ ] Change SSH port (optional but recommended)
- [ ] Set up firewall rules

## Installation

### Docker Setup
- [ ] Install Docker: `curl -fsSL https://get.docker.com -o get-docker.sh && sudo sh get-docker.sh`
- [ ] Install Docker Compose: `sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose && sudo chmod +x /usr/local/bin/docker-compose`
- [ ] Add current user to docker group: `sudo usermod -aG docker $USER`
- [ ] Verify Docker installation: `docker --version && docker-compose --version`

### Project Setup
- [ ] Clone/download project: `git clone <repo-url> && cd dragon-ai-image`
- [ ] Make setup script executable: `chmod +x scripts/setup.sh`
- [ ] Run setup script: `bash scripts/setup.sh`
- [ ] Verify `.env` file was created
- [ ] Update `.env` with actual values (see Configuration section)

## Configuration

### Environment Variables
- [ ] Set `NODE_ENV=production`
- [ ] Generate strong `MYSQL_ROOT_PASSWORD`
- [ ] Generate strong `MYSQL_PASSWORD`
- [ ] Generate strong `JWT_SECRET` (use: `openssl rand -base64 64`)
- [ ] Add Firebase project ID to `VITE_APP_ID`
- [ ] Add Firebase API keys
- [ ] Configure SMTP settings for email alerts
- [ ] Set `ALERT_EMAIL` for notifications
- [ ] Set `APP_URL` to your domain

### Firebase Configuration
- [ ] Create Firebase project (if not already done)
- [ ] Enable Email/Password authentication
- [ ] Enable Google Sign-in
- [ ] Add authorized domains in Firebase Console
- [ ] Copy Firebase config to `.env`
- [ ] Test Firebase authentication

### Database
- [ ] Verify MySQL container starts: `docker-compose logs mysql`
- [ ] Check database creation: `docker-compose exec mysql mysql -u root -p$MYSQL_ROOT_PASSWORD -e "SHOW DATABASES;"`
- [ ] Run migrations: `docker-compose exec app npm run db:push`
- [ ] Verify tables created: `docker-compose exec mysql mysql -u dragon_ai -p$MYSQL_PASSWORD dragon_ai_image -e "SHOW TABLES;"`

## SSL/TLS Setup

### Certificate Generation
- [ ] Install Certbot: `sudo apt-get install certbot python3-certbot-nginx -y`
- [ ] Generate Let's Encrypt certificate: `sudo certbot certonly --standalone -d your-domain.com`
- [ ] Copy certificates to SSL directory:
  ```bash
  sudo cp /etc/letsencrypt/live/your-domain.com/fullchain.pem ssl/cert.pem
  sudo cp /etc/letsencrypt/live/your-domain.com/privkey.pem ssl/key.pem
  sudo chown $USER:$USER ssl/*
  ```
- [ ] Verify certificate: `openssl x509 -in ssl/cert.pem -text -noout`
- [ ] Test certificate renewal: `sudo certbot renew --dry-run`

### Certificate Renewal
- [ ] Set up automatic renewal cron job:
  ```bash
  (crontab -l 2>/dev/null; echo "0 3 1 * * /path/to/dragon-ai-image/scripts/renew-ssl.sh") | crontab -
  ```
- [ ] Verify cron job: `crontab -l | grep renew-ssl`

## Security Hardening

### Firewall
- [ ] Run firewall setup: `sudo bash scripts/setup-firewall.sh`
- [ ] Verify firewall rules: `sudo ufw status verbose`
- [ ] Test SSH access still works
- [ ] Test HTTP access: `curl -I http://your-domain.com`
- [ ] Test HTTPS access: `curl -I https://your-domain.com`

### Fail2Ban
- [ ] Install Fail2Ban: `sudo apt-get install fail2ban -y`
- [ ] Copy configuration: `sudo cp config/fail2ban-jail.local /etc/fail2ban/jail.local`
- [ ] Start Fail2Ban: `sudo systemctl start fail2ban && sudo systemctl enable fail2ban`
- [ ] Verify status: `sudo fail2ban-client status`

### Log Rotation
- [ ] Copy logrotate config: `sudo cp config/logrotate.conf /etc/logrotate.d/dragon-ai-image`
- [ ] Test logrotate: `sudo logrotate -f /etc/logrotate.d/dragon-ai-image`
- [ ] Verify logs are being rotated

### SSH Hardening
- [ ] Disable SSH root login: `sudo sed -i 's/^#PermitRootLogin.*/PermitRootLogin no/' /etc/ssh/sshd_config`
- [ ] Disable password authentication: `sudo sed -i 's/^#PasswordAuthentication.*/PasswordAuthentication no/' /etc/ssh/sshd_config`
- [ ] Restart SSH: `sudo systemctl restart sshd`
- [ ] Test SSH access (should work with key, not password)

## Monitoring & Backups

### Backup Setup
- [ ] Make backup script executable: `chmod +x scripts/backup.sh`
- [ ] Test manual backup: `bash scripts/backup.sh`
- [ ] Verify backup created: `ls -la backups/`
- [ ] Set up automated backups:
  ```bash
  (crontab -l 2>/dev/null; echo "0 2 * * * /path/to/dragon-ai-image/scripts/backup.sh") | crontab -
  ```
- [ ] Verify backup cron job: `crontab -l | grep backup.sh`

### Monitoring Setup
- [ ] Make monitor script executable: `chmod +x scripts/monitor.sh`
- [ ] Start monitoring: `bash scripts/monitor.sh start`
- [ ] Verify monitoring running: `ps aux | grep monitor.sh`
- [ ] Check monitoring logs: `tail -f logs/monitor.log`
- [ ] Test health endpoint: `curl https://your-domain.com/health`

### Email Alerts
- [ ] Configure SMTP credentials in `.env`
- [ ] Test email sending (monitoring script will send alerts)
- [ ] Verify alert emails are received

## Testing

### Application Testing
- [ ] Test landing page: `https://your-domain.com`
- [ ] Test signup with email/password
- [ ] Test Google Sign-in
- [ ] Test image generation
- [ ] Test image download
- [ ] Test image copy-to-clipboard
- [ ] Test image deletion
- [ ] Test logout
- [ ] Test login again
- [ ] Verify image history is per-user

### Performance Testing
- [ ] Check page load time: `curl -w "@curl-format.txt" https://your-domain.com`
- [ ] Monitor resource usage: `docker stats`
- [ ] Check database performance: `docker-compose exec mysql mysql -u root -p$MYSQL_ROOT_PASSWORD -e "SHOW STATUS LIKE 'Threads%';"`
- [ ] Load test (optional): Use Apache Bench or similar tool

### Security Testing
- [ ] Verify HTTPS is enforced (HTTP redirects to HTTPS)
- [ ] Check SSL certificate validity: `openssl s_client -connect your-domain.com:443`
- [ ] Verify security headers: `curl -I https://your-domain.com | grep -i "strict\|x-frame\|x-content"`
- [ ] Test firewall rules: Verify ports 3306 and 3000 are not accessible externally
- [ ] Test Fail2Ban: Attempt multiple failed logins and verify IP is blocked

## Post-Deployment

### Monitoring
- [ ] Monitor application logs: `docker-compose logs -f app`
- [ ] Monitor database logs: `docker-compose logs -f mysql`
- [ ] Monitor Nginx logs: `docker-compose logs -f nginx`
- [ ] Check system resources: `docker stats`
- [ ] Review monitoring alerts

### Documentation
- [ ] Document server IP and SSH access method
- [ ] Document domain name and SSL certificate expiry date
- [ ] Document database credentials (store securely)
- [ ] Document backup location and retention policy
- [ ] Create runbook for common operations

### Maintenance Schedule
- [ ] Set reminder for SSL certificate renewal (30 days before expiry)
- [ ] Set reminder for database backup verification (weekly)
- [ ] Set reminder for system updates (monthly)
- [ ] Set reminder for security audit (quarterly)

## Rollback Plan

### If Deployment Fails
- [ ] Stop all services: `docker-compose down`
- [ ] Restore from backup: `bash scripts/restore-backup.sh`
- [ ] Restart services: `docker-compose up -d`
- [ ] Verify application is working

### If Issues Occur Post-Deployment
- [ ] Check logs: `docker-compose logs`
- [ ] Restart services: `docker-compose restart`
- [ ] Check disk space: `df -h`
- [ ] Check memory: `free -h`
- [ ] Contact support if issues persist

## Useful Commands

```bash
# View logs
docker-compose logs -f app
docker-compose logs -f mysql
docker-compose logs -f nginx

# Restart services
docker-compose restart
docker-compose restart app

# Stop services
docker-compose down

# Start services
docker-compose up -d

# Manual backup
bash scripts/backup.sh

# Check status
docker-compose ps
docker stats

# View monitoring logs
tail -f logs/monitor.log

# View backup logs
tail -f logs/backup.log

# SSH into container
docker-compose exec app bash
docker-compose exec mysql bash

# View firewall rules
sudo ufw status verbose

# View Fail2Ban status
sudo fail2ban-client status
```

## Support

For issues or questions:
1. Check logs: `docker-compose logs`
2. Review `SELF_HOSTED_GUIDE.md`
3. Check `DOCKER_README.md`
4. Review monitoring logs: `tail -f logs/monitor.log`

---

**Last Updated**: 2026-06-17  
**Version**: 1.0.0
