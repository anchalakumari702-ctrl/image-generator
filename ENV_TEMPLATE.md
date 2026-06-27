# Dragon AI Image - Environment Configuration Template

Copy this template to `.env` file and fill in the values for your deployment.

```bash
# ============================================
# Application Settings
# ============================================
NODE_ENV=production
APP_NAME=Dragon AI Image
APP_URL=https://your-domain.com
PORT=3000

# ============================================
# Database Configuration
# ============================================
DATABASE_URL=mysql://dragon_ai:your_strong_password@mysql:3306/dragon_ai_image
MYSQL_ROOT_PASSWORD=your_strong_root_password
MYSQL_PASSWORD=your_strong_password
MYSQL_DATABASE=dragon_ai_image
MYSQL_USER=dragon_ai

# ============================================
# Firebase Configuration
# ============================================
VITE_APP_ID=your_firebase_app_id
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
FIREBASE_APP_ID=your_firebase_app_id
FIREBASE_MEASUREMENT_ID=your_firebase_measurement_id

# Firebase Admin SDK (for server-side verification)
FIREBASE_ADMIN_SDK_KEY=your_firebase_admin_sdk_json_key

# ============================================
# Security Settings
# ============================================
JWT_SECRET=generate_with_openssl_rand_base64_64
SESSION_SECRET=generate_with_openssl_rand_base64_64

# ============================================
# Email Configuration (for alerts)
# ============================================
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
SMTP_FROM_EMAIL=noreply@your-domain.com
ALERT_EMAIL=admin@your-domain.com

# ============================================
# SSL/TLS Configuration
# ============================================
SSL_CERT_PATH=/app/ssl/cert.pem
SSL_KEY_PATH=/app/ssl/key.pem
SSL_DOMAIN=your-domain.com
SSL_EMAIL=admin@your-domain.com

# ============================================
# Backup Configuration
# ============================================
BACKUP_RETENTION_DAYS=30
BACKUP_LOCATION=/app/backups
BACKUP_COMPRESSION=true

# ============================================
# Monitoring Configuration
# ============================================
HEALTH_CHECK_INTERVAL=300
HEALTH_CHECK_TIMEOUT=10
ENABLE_MONITORING=true
MONITORING_LOG_PATH=/app/logs/monitor.log

# ============================================
# Logging Configuration
# ============================================
LOG_LEVEL=info
LOG_PATH=/app/logs
LOG_MAX_SIZE=100M
LOG_MAX_FILES=14

# ============================================
# Image Generation API
# ============================================
# If using external API, configure here
IMAGE_GEN_API_KEY=your_api_key
IMAGE_GEN_API_URL=https://api.example.com

# ============================================
# Analytics (Optional)
# ============================================
VITE_ANALYTICS_ENDPOINT=https://analytics.example.com
VITE_ANALYTICS_WEBSITE_ID=your_website_id

# ============================================
# Feature Flags
# ============================================
ENABLE_REGISTRATION=true
ENABLE_GOOGLE_SIGNIN=true
ENABLE_EMAIL_SIGNIN=true
ENABLE_IMAGE_GENERATION=true
ENABLE_IMAGE_DOWNLOAD=true
ENABLE_IMAGE_SHARING=false
```

## Configuration Guide

### Application Settings
- **NODE_ENV**: Set to `production` for production deployment
- **APP_NAME**: Display name of your application
- **APP_URL**: Full URL of your application (used for redirects, emails, etc.)
- **PORT**: Port the application runs on (default: 3000)

### Database Configuration
- **DATABASE_URL**: MySQL connection string
- **MYSQL_ROOT_PASSWORD**: Strong password for MySQL root user (min 16 characters)
- **MYSQL_PASSWORD**: Strong password for application database user
- **MYSQL_DATABASE**: Database name (default: dragon_ai_image)
- **MYSQL_USER**: Database user (default: dragon_ai)

### Firebase Configuration
Get these values from your Firebase project console:
1. Go to Project Settings
2. Copy all values from the "Web" section
3. For Admin SDK, download the service account JSON key

### Security Settings
Generate strong secrets:
```bash
# Generate JWT_SECRET
openssl rand -base64 64

# Generate SESSION_SECRET
openssl rand -base64 64
```

### Email Configuration
For Gmail:
1. Enable 2-factor authentication
2. Generate an App Password
3. Use the App Password in SMTP_PASSWORD

For other email providers, adjust SMTP_HOST and SMTP_PORT accordingly.

### SSL/TLS Configuration
- **SSL_DOMAIN**: Your domain name (used for certificate renewal)
- **SSL_EMAIL**: Email for Let's Encrypt notifications
- Certificates should be placed in `ssl/` directory as `cert.pem` and `key.pem`

### Backup Configuration
- **BACKUP_RETENTION_DAYS**: How many days to keep backups (default: 30)
- **BACKUP_LOCATION**: Where to store backups (default: /app/backups)
- **BACKUP_COMPRESSION**: Whether to compress backups (default: true)

### Monitoring Configuration
- **HEALTH_CHECK_INTERVAL**: Seconds between health checks (default: 300 = 5 minutes)
- **HEALTH_CHECK_TIMEOUT**: Seconds to wait for health check response
- **ENABLE_MONITORING**: Enable/disable monitoring system

### Logging Configuration
- **LOG_LEVEL**: Log level (debug, info, warn, error)
- **LOG_PATH**: Directory for log files
- **LOG_MAX_SIZE**: Maximum log file size before rotation
- **LOG_MAX_FILES**: Number of log files to keep

## Deployment Steps

1. **Create .env file**:
   ```bash
   cp ENV_TEMPLATE.md .env
   ```

2. **Edit .env file**:
   ```bash
   nano .env
   ```

3. **Generate strong secrets**:
   ```bash
   # Replace placeholder values with actual secrets
   JWT_SECRET=$(openssl rand -base64 64)
   SESSION_SECRET=$(openssl rand -base64 64)
   ```

4. **Verify configuration**:
   ```bash
   # Check if all required variables are set
   bash scripts/verify-env.sh
   ```

5. **Start application**:
   ```bash
   docker-compose up -d
   ```

## Security Best Practices

1. **Never commit .env file** to version control
2. **Use strong passwords** (minimum 16 characters, mixed case, numbers, symbols)
3. **Rotate secrets regularly** (quarterly recommended)
4. **Store backups securely** (encrypted, off-site)
5. **Monitor logs regularly** for suspicious activity
6. **Keep dependencies updated** (monthly security updates)
7. **Enable firewall** and restrict access to essential ports only
8. **Use HTTPS only** (HTTP should redirect to HTTPS)

## Troubleshooting

### Database Connection Error
- Verify MYSQL_USER and MYSQL_PASSWORD match in DATABASE_URL
- Check MySQL container is running: `docker-compose ps mysql`
- Check MySQL logs: `docker-compose logs mysql`

### Firebase Authentication Error
- Verify Firebase credentials are correct
- Check authorized domains in Firebase Console
- Verify FIREBASE_PROJECT_ID is correct

### Email Not Sending
- Verify SMTP credentials are correct
- Check email logs: `docker-compose logs app | grep -i email`
- Verify firewall allows outbound SMTP (port 587)

### SSL Certificate Error
- Verify certificate files exist: `ls -la ssl/`
- Check certificate expiry: `openssl x509 -in ssl/cert.pem -noout -enddate`
- Verify domain matches certificate

## Support

For issues or questions, refer to:
- `SELF_HOSTED_GUIDE.md` - Comprehensive deployment guide
- `DOCKER_README.md` - Docker-specific documentation
- `DEPLOYMENT_CHECKLIST.md` - Step-by-step deployment checklist
