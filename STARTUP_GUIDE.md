# 🚀 Easy Startup Guide - Stock Simulation Platform

**New & Improved Setup Process!** ✨

---

## ⚡ Quick Start (Recommended Method)

### **For Windows Users:**

**Double-click this file:** `start.bat`

That's it! The script will:
- ✅ Check if setup is complete
- ✅ Run setup wizard if needed
- ✅ Install dependencies automatically
- ✅ Start both backend and frontend
- ✅ Open two terminal windows for you

**Then open browser:** `http://localhost:5173`

---

### **For Mac/Linux Users:**

```bash
# Step 1: Run setup (first time only)
cd backend
npm run setup

# Step 2: Start everything
# Terminal 1 - Backend:
cd backend
npm run dev

# Terminal 2 - Frontend:
cd frontend
npm run dev

# Step 3: Open browser
# Go to: http://localhost:5173
```

---

## 📋 Complete Step-by-Step Guide

### **Method 1: Automated Setup (Easiest)**

#### **Windows:**
```cmd
cd "d:\Dalal Stret Game"
start.bat
```

#### **Mac/Linux:**
```bash
cd /path/to/stock-simulation
# Create your own start script or follow manual steps below
```

---

### **Method 2: Interactive Wizard**

Perfect for first-time setup!

```bash
cd backend
npm run setup
```

**The wizard will ask you:**
1. Database host (default: localhost)
2. Database port (default: 3306)
3. Database user (default: root)
4. Database password
5. Database name (default: stock_simulation)
6. Whether to seed sample data

**Then it automatically:**
- ✅ Creates .env file with secure JWT secret
- ✅ Tests database connection
- ✅ Creates database if needed
- ✅ Imports schema
- ✅ Installs dependencies (if missing)
- ✅ Seeds sample data (optional)

---

### **Method 3: Manual Setup**

For advanced users who want full control.

#### **Step 1: Backend Setup**

```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Edit .env with your settings
# Use notepad, VS Code, or nano
notepad .env  # Windows
nano .env     # Mac/Linux
```

**.env Configuration:**
```env
PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=stock_simulation

JWT_SECRET=generate_random_string_here
JWT_EXPIRE=7d

PRICE_IMPACT_FACTOR=0.01
INITIAL_USER_BALANCE=100000
```

**Generate JWT Secret:**
```bash
# Node.js one-liner to generate random secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

#### **Step 2: Database Setup**

```bash
# Login to MySQL
mysql -u root -p

# Create database
CREATE DATABASE stock_simulation;
EXIT;

# Import schema
mysql -u root -p stock_simulation < database/schema.sql

# Optional: Seed sample data
npm run db:seed
```

**Sample data includes:**
- 8 stocks (Tech Corp, Global Bank, Energy Plus, etc.)
- 1 admin user (email: admin@stocksim.com, password: password123)
- Initial market configuration

---

#### **Step 3: Start Backend**

```bash
cd backend
npm run dev
```

**You should see:**
```
╔════════════════════════════════════════════════╗
║   🚀 Stock Simulation Platform API             ║
║   Server running on port 5000                  ║
║   Environment: development                     ║
║   ⚡ Real-time: Socket.io enabled               ║
╚════════════════════════════════════════════════╝
```

✅ **Backend is running!** Keep this terminal open.

---

#### **Step 4: Frontend Setup**

Open a **NEW terminal**:

```bash
# Navigate to frontend folder
cd frontend

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Edit .env
notepad .env  # Windows
nano .env     # Mac/Linux
```

**Set API URL:**
```env
VITE_API_URL=http://localhost:5000/api
```

---

#### **Step 5: Start Frontend**

```bash
cd frontend
npm run dev
```

**You should see:**
```
VITE v5.0.8  ready in 1234 ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

✅ **Frontend is running!**

---

#### **Step 6: Open the App**

Open your web browser:
```
http://localhost:5173
```

**Default Admin Login:**
```
Email: admin@stocksim.com
Password: password123
```

🎉 **You're in!**

---

## 🔍 Troubleshooting & Diagnostics

### **Check Everything Before Starting**

New command to verify your setup:

```bash
cd backend
npm run check
```

This checks:
- ✅ .env file exists
- ✅ Dependencies installed
- ✅ Database connection works
- ✅ Required files present
- ✅ Port 5000 is available
- ✅ Database and tables exist

**If all checks pass:**
```
✅ ALL CHECKS PASSED!
Ready to start: npm run dev
```

**If errors found:**
```
❌ ERRORS FOUND:
1. .env file not found. Run "npm run setup" first.
2. Database connection failed...

Fix these issues before starting the server.
Run: npm run setup
```

---

### **Common Issues & Solutions**

#### **Issue: Port already in use**

**Error:**
```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solution:**
```bash
# Windows - Find and kill process
netstat -ano | findstr :5000
taskkill /PID <PID_NUMBER> /F

# Mac/Linux
lsof -i :5000
kill -9 <PID>

# Or change PORT in .env to 5001
```

---

#### **Issue: Database connection failed**

**Error:**
```
ER_ACCESS_DENIED_ERROR or ECONNREFUSED
```

**Solution:**
1. Verify MySQL is running
2. Check credentials in `.env`
3. Test connection manually:
   ```bash
   mysql -u root -p
   ```
4. Ensure database exists:
   ```sql
   SHOW DATABASES;
   ```

---

#### **Issue: Module not found**

**Error:**
```
Cannot find module 'express'
```

**Solution:**
```bash
cd backend
npm install

cd ../frontend
npm install
```

---

#### **Issue: Can't access frontend**

**Error:**
```
Page won't load or shows blank screen
```

**Solution:**
1. Check both servers are running (backend + frontend)
2. Verify `VITE_API_URL` in `frontend/.env`
3. Clear browser cache (Ctrl+Shift+Delete)
4. Try incognito/private mode
5. Check browser console for errors (F12)

---

#### **Issue: Socket.io not connecting**

**Error in console:**
```
WebSocket connection failed
```

**Solution:**
1. Ensure backend is running
2. Check CORS settings in backend `.env`:
   ```env
   CORS_ORIGIN=http://localhost:5173
   ```
3. Clear browser cache
4. Re-login to get fresh token

---

## 🎯 Development Workflow

### **Daily Development:**

**Every time you code:**

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend  
cd frontend
npm run dev

# Browser
http://localhost:5173
```

**Hot reload is automatic!** Changes appear instantly.

---

### **Stopping Servers:**

**Manual stop:**
- Press `Ctrl+C` in each terminal
- Or close terminal windows

**Force stop (Windows):**
```cmd
taskkill /F /IM node.exe
```

**Force stop (Mac/Linux):**
```bash
pkill -f node
```

---

## 📊 Available Commands

### **Backend Commands:**

```bash
npm run setup      # Interactive setup wizard
npm run check      # Verify setup before starting
npm run dev        # Start development server
npm start          # Start production server
npm run db:init    # Import database schema
npm run db:test    # Test database connection
npm run db:seed    # Seed sample data
npm run db:setup   # Full database setup
```

### **Frontend Commands:**

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
```

---

## 🚀 Production Deployment

When ready to deploy:

### **Quick Deploy:**

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for complete instructions.

**Fast options:**
1. **Heroku + Netlify** - Free tier available
2. **DigitalOcean** - $5/month VPS
3. **Vercel** - Automatic deployments

---

## 💡 Pro Tips

### **Tip 1: Multiple Terminals**

Use separate terminals for:
- Backend server
- Frontend server
- Database commands
- Git operations

**Recommended:**
- Terminal 1: Backend (port 5000)
- Terminal 2: Frontend (port 5173)
- Terminal 3: MySQL commands

---

### **Tip 2: Environment Variables**

Keep different configs for:
- `.env` - Development (local)
- `.env.production` - Production server
- `.env.test` - Testing

**Never commit `.env` files to Git!**

---

### **Tip 3: Database Backup**

Before making changes:
```bash
mysqldump -u root -p stock_simulation > backup_$(date +%Y%m%d).sql
```

Restore from backup:
```bash
mysql -u root -p stock_simulation < backup_20260325.sql
```

---

### **Tip 4: Quick Reset**

Everything broken? Start fresh:

```bash
# Drop and recreate database
mysql -u root -p
DROP DATABASE IF EXISTS stock_simulation;
CREATE DATABASE stock_simulation;
EXIT;

# Re-import schema
mysql -u root -p stock_simulation < database/schema.sql

# Re-seed data
npm run db:seed

# Restart servers
# (Ctrl+C, then npm run dev)
```

---

## 📞 Getting Help

### **Documentation:**
- **[README.md](./README.md)** - Main overview
- **[USER_REQUESTS.md](./USER_REQUESTS.md)** - Multiplayer setup
- **[API_DOCS.md](./API_DOCS.md)** - API reference
- **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** - Deployment

### **Commands Reference:**

```bash
# First time setup
npm run setup

# Daily development
npm run dev

# Check status
npm run check

# Reset database
npm run db:setup
```

---

## ✅ Checklist for First Setup

- [ ] Node.js 16+ installed
- [ ] MySQL 8.0+ installed
- [ ] Navigated to project folder
- [ ] Ran `npm run setup` in backend
- [ ] Database created successfully
- [ ] Sample data seeded (optional)
- [ ] Backend starts without errors
- [ ] Frontend starts without errors
- [ ] Can access http://localhost:5173
- [ ] Can login with admin account

---

## 🎉 Success Indicators

**Backend running correctly when you see:**
```
╔════════════════════════════════════════════════╗
║   🚀 Stock Simulation Platform API             ║
║   Server running on port 5000                  ║
║   ⚡ Real-time: Socket.io enabled               ║
╚════════════════════════════════════════════════╝
```

**Frontend running correctly when you see:**
```
VITE v5.0.8  ready in XXXX ms
➜  Local:   http://localhost:5173/
```

**App working correctly when:**
- ✅ Landing page loads
- ✅ Can login successfully
- ✅ Dashboard shows stocks
- ✅ Can buy/sell stocks
- ✅ Portfolio updates
- ✅ Real-time prices work

---

**Happy Coding! 🚀**

*Last Updated: March 25, 2026*
