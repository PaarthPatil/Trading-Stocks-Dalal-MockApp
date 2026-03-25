# 🚀 Stock Simulation Platform - Deployment Guide

Comprehensive guide for deploying to production environments.

---

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Environment Setup](#environment-setup)
- [Database Deployment](#database-deployment)
- [Backend Deployment](#backend-deployment)
- [Frontend Deployment](#frontend-deployment)
- [Docker Deployment](#docker-deployment)
- [Cloud Platforms](#cloud-platforms)
- [Monitoring & Logging](#monitoring--logging)
- [Security Best Practices](#security-best-practices)
- [Troubleshooting](#troubleshooting)

---

## ✅ Prerequisites

### Required Software

- **Node.js** >= 16.x
- **npm** or **yarn**
- **MySQL** >= 8.0
- **Git**

### Recommended Tools

- **PM2** (Process Manager)
- **Nginx** (Reverse Proxy)
- **Docker** (Containerization)

---

## 🔧 Environment Setup

### Backend Environment (.env)

```env
# Production Settings
PORT=5000
NODE_ENV=production

# Database
DB_HOST=your-production-db-host.amazonaws.com
DB_PORT=3306
DB_USER=stock_user
DB_PASSWORD=STRONG_PASSWORD_HERE
DB_NAME=stock_simulation

# JWT
JWT_SECRET=VERY_LONG_RANDOM_STRING_MIN_32_CHARS
JWT_EXPIRE=7d

# Trading
PRICE_IMPACT_FACTOR=0.01
INITIAL_USER_BALANCE=100000

# CORS (Frontend URL)
CORS_ORIGIN=https://yourdomain.com
```

### Frontend Environment (.env)

```env
VITE_API_URL=https://api.yourdomain.com/api
```

---

## 🗄️ Database Deployment

### Option 1: Managed MySQL (Recommended)

**AWS RDS:**
1. Create RDS MySQL instance
2. Configure security groups
3. Get endpoint URL
4. Update backend `.env` with RDS credentials

**Google Cloud SQL:**
1. Create Cloud SQL instance
2. Set root password
3. Create database and user
4. Get connection string

**Azure Database for MySQL:**
1. Create Azure MySQL server
2. Configure firewall rules
3. Create database
4. Update connection string

### Option 2: Self-Hosted MySQL

```bash
# Install MySQL
sudo apt-get install mysql-server

# Secure installation
sudo mysql_secure_installation

# Create database
mysql -u root -p
CREATE DATABASE stock_simulation;
CREATE USER 'stock_user'@'%' IDENTIFIED BY 'strong_password';
GRANT ALL PRIVILEGES ON stock_simulation.* TO 'stock_user'@'%';
FLUSH PRIVILEGES;
EXIT;

# Import schema
mysql -u stock_user -p stock_simulation < backend/database/schema.sql

# Seed data (optional)
cd backend
node seed-database.js
```

---

## 🖥️ Backend Deployment

### Step 1: Prepare Server

**Ubuntu/Debian:**
```bash
# Update system
sudo apt-get update
sudo apt-get upgrade

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Git
sudo apt-get install git

# Install PM2
sudo npm install -g pm2
```

### Step 2: Deploy Code

```bash
# Clone repository
git clone https://github.com/yourusername/stock-simulation.git
cd stock-simulation/backend

# Install dependencies
npm install --production

# Create .env file
cp .env.example .env
nano .env  # Edit with production values
```

### Step 3: Start with PM2

```bash
# Start application
pm2 start server.js --name stock-api

# Save PM2 configuration
pm2 save

# Setup PM2 startup
pm2 startup
# Copy and run the generated command
```

### Step 4: Configure Nginx (Reverse Proxy)

```bash
# Install Nginx
sudo apt-get install nginx

# Create Nginx config
sudo nano /etc/nginx/sites-available/stock-api
```

**Nginx Configuration:**
```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Socket.io WebSocket support
    location /socket.io/ {
        proxy_pass http://localhost:5000/socket.io/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**Enable Site:**
```bash
# Create symbolic link
sudo ln -s /etc/nginx/sites-available/stock-api /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

### Step 5: Enable HTTPS (Let's Encrypt)

```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d api.yourdomain.com

# Auto-renewal test
sudo certbot renew --dry-run
```

---

## 🎨 Frontend Deployment

### Option 1: Build & Deploy to Static Host

```bash
cd frontend

# Install dependencies
npm install

# Set production API URL
echo "VITE_API_URL=https://api.yourdomain.com/api" > .env

# Build for production
npm run build

# Output in dist/ folder
ls dist/
```

**Deploy `dist/` to:**

#### Netlify
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist
```

#### Vercel
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

#### Manual Upload
Upload contents of `dist/` to:
- AWS S3 + CloudFront
- Google Cloud Storage
- Azure Blob Storage
- DigitalOcean Spaces

### Option 2: Serve with Nginx

```bash
# Copy build to Nginx directory
sudo cp -r dist/* /var/www/stock-frontend/

# Nginx config for SPA
sudo nano /etc/nginx/sites-available/stock-frontend
```

**Configuration:**
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    root /var/www/stock-frontend;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /static {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

---

## 🐳 Docker Deployment

### Backend Dockerfile

Create `backend/Dockerfile`:
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production

COPY . .

EXPOSE 5000

CMD ["node", "server.js"]
```

### Frontend Dockerfile

Create `frontend/Dockerfile`:
```dockerfile
FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### Docker Compose

Create `docker-compose.yml`:
```yaml
version: '3.8'

services:
  db:
    image: mysql:8.0
    container_name: stock-db
    environment:
      MYSQL_ROOT_PASSWORD: root_password
      MYSQL_DATABASE: stock_simulation
      MYSQL_USER: stock_user
      MYSQL_PASSWORD: stock_password
    volumes:
      - mysql_data:/var/lib/mysql
      - ./backend/database/schema.sql:/docker-entrypoint-initdb.d/schema.sql
    ports:
      - "3306:3306"
    networks:
      - stock-network

  backend:
    build: ./backend
    container_name: stock-api
    env_file: ./backend/.env
    depends_on:
      - db
    ports:
      - "5000:5000"
    networks:
      - stock-network

  frontend:
    build: ./frontend
    container_name: stock-web
    depends_on:
      - backend
    ports:
      - "80:80"
    networks:
      - stock-network

volumes:
  mysql_data:

networks:
  stock-network:
    driver: bridge
```

**Run with Docker:**
```bash
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

---

## ☁️ Cloud Platforms

### Heroku Deployment

#### Backend

```bash
cd backend

# Login to Heroku
heroku login

# Create app
heroku create stock-simulation-api

# Add MySQL addon
heroku addons:create cleardb:ignite

# Set environment variables
heroku config:set JWT_SECRET=your_secret
heroku config:set NODE_ENV=production

# Deploy
git push heroku main

# Run migrations
heroku run "mysql -h $CLEARDB_DATABASE_HOST -u $CLEARDB_DATABASE_USERNAME -p$CLEARDB_DATABASE_PASSWORD $CLEARDB_DATABASE_NAME < database/schema.sql"
```

#### Frontend

```bash
cd frontend

# Create app
heroku create stock-simulation-web

# Set API URL
heroku config:set VITE_API_URL=https://stock-simulation-api.herokuapp.com/api

# Deploy
git push heroku main
```

### AWS Deployment

#### EC2 + RDS

1. **Launch EC2 Instance**
   - Ubuntu Server 22.04
   - t2.micro or larger
   - Configure security groups (HTTP/HTTPS/SSH)

2. **Create RDS MySQL**
   - Choose MySQL 8.0
   - Configure instance size
   - Set master password
   - Configure VPC and security groups

3. **Deploy Backend to EC2**
   ```bash
   # SSH to EC2
   ssh -i key.pem ubuntu@your-ec2-ip
   
   # Follow backend deployment steps above
   ```

4. **Deploy Frontend to S3**
   ```bash
   # Build frontend
   npm run build
   
   # Create S3 bucket
   aws s3 mb s3://stock-frontend-bucket
   
   # Upload
   aws s3 sync dist/ s3://stock-frontend-bucket
   
   # Enable static website hosting
   aws s3 website s3://stock-frontend-bucket --index-document index.html
   ```

5. **Setup CloudFront**
   - Create CloudFront distribution
   - Point to S3 bucket
   - Configure custom domain

### DigitalOcean Deployment

#### Droplet Setup

```bash
# Create Droplet (Ubuntu 22.04)
# SSH to droplet
ssh root@your-droplet-ip

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Install Docker Compose
curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Deploy with Docker Compose
scp docker-compose.yml root@your-droplet-ip:~/
ssh root@your-droplet-ip
cd ~
docker-compose up -d
```

---

## 📊 Monitoring & Logging

### Application Monitoring

#### PM2 Monitoring

```bash
# View all apps
pm2 list

# View logs
pm2 logs stock-api

# Monitor resources
pm2 monit

# Restart app
pm2 restart stock-api

# View detailed info
pm2 show stock-api
```

#### Nginx Logs

```bash
# Access logs
sudo tail -f /var/log/nginx/access.log

# Error logs
sudo tail -f /var/log/nginx/error.log
```

### Uptime Monitoring

#### UptimeRobot (Free)
1. Create account at uptimerobot.com
2. Add new monitor
3. Set URL: `https://api.yourdomain.com/health`
4. Set interval: 5 minutes
5. Get email alerts on downtime

#### Pingdom
1. Create account
2. Add uptime check
3. Configure alerting

### Performance Monitoring

#### New Relic
```bash
# Install New Relic agent
npm install newrelic

# Configure newrelic.js
# Deploy and view metrics in New Relic dashboard
```

---

## 🔒 Security Best Practices

### Server Security

✅ **Firewall Configuration**
```bash
# Enable UFW
sudo ufw enable

# Allow only necessary ports
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw status
```

✅ **SSH Hardening**
```bash
# Disable root login
sudo nano /etc/ssh/sshd_config
# Set: PermitRootLogin no

# Use SSH keys only
# Set: PasswordAuthentication no

# Restart SSH
sudo systemctl restart sshd
```

### Database Security

✅ **Strong Passwords**
- Minimum 16 characters
- Mix of uppercase, lowercase, numbers, symbols
- Never use default passwords

✅ **Network Isolation**
- Database in private subnet
- Only allow connections from backend server
- Use security groups/VPC

✅ **Regular Backups**
```bash
# Automated backup script
#!/bin/bash
mysqldump -u stock_user -p stock_simulation > backup_$(date +%Y%m%d_%H%M%S).sql
# Schedule with cron
```

### Application Security

✅ **Environment Variables**
- Never commit `.env` files
- Use secrets manager (AWS Secrets Manager, Azure Key Vault)
- Rotate secrets regularly

✅ **HTTPS Everywhere**
- Force HTTPS redirects
- Use HSTS headers
- Valid SSL certificates only

✅ **Rate Limiting**
Already configured in backend (100 req/15min)

✅ **CORS Configuration**
```javascript
// In backend config
app.use(cors({
  origin: 'https://yourdomain.com',
  credentials: true
}));
```

---

## 🔧 Troubleshooting

### Backend Won't Start

**Check Logs:**
```bash
pm2 logs stock-api
```

**Common Issues:**
- Database connection failed → Check credentials in `.env`
- Port already in use → Change PORT or kill process
- Module not found → Run `npm install`

### Frontend Not Loading

**Check Browser Console:**
- Look for CORS errors
- Verify API URL is correct
- Check network tab for failed requests

**Clear Cache:**
```bash
# In browser: Ctrl+Shift+Delete
# Or hard refresh: Ctrl+F5
```

### Database Connection Issues

**Test Connection:**
```bash
mysql -h DB_HOST -u DB_USER -p DB_NAME
```

**Check Firewall:**
```bash
# Ensure MySQL port (3306) is open
sudo ufw status
```

### Socket.io Not Connecting

**Verify:**
1. Backend is running
2. CORS configured correctly
3. WebSocket upgrade headers allowed in proxy
4. Client using correct URL and token

---

## 📞 Support

For additional help:
- [Main README](../README.md)
- [Backend README](../backend/README.md)
- [API Documentation](../API_DOCS.md)

---

**Deployment Checklist:**

- [ ] Database created and schema imported
- [ ] Backend environment configured
- [ ] Frontend environment configured
- [ ] Dependencies installed
- [ ] Backend running (PM2 or Docker)
- [ ] Frontend built and deployed
- [ ] HTTPS enabled
- [ ] Monitoring setup
- [ ] Backups configured
- [ ] Security hardened
- [ ] Testing completed

---

**Good luck with your deployment!** 🚀
