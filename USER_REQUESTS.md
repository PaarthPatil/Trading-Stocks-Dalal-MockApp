# 🚀 How to Start & Setup Multiplayer Stock Simulation Platform

Complete guide for starting the app, connecting over LAN, and enabling friends to play together.

---

## 📋 Table of Contents

1. [Quick Start (Single Computer)](#quick-start-single-computer)
2. [LAN Setup (Multiple PCs on Local Network)](#lan-setup-multiple-pcs-on-local-network)
3. [Online Multiplayer (Hosted/Internet)](#online-multiplayer-hostedinternet)
4. [Playing with Friends - Complete Guide](#playing-with-friends---complete-guide)
5. [Trading Interface Overview](#trading-interface-overview)
6. [Troubleshooting](#troubleshooting)

---

## ⚡ Quick Start (Single Computer)

### Prerequisites Check

Before starting, ensure you have:
- ✅ Node.js 16+ installed ([Download](https://nodejs.org/))
- ✅ MySQL 8.0+ installed ([Download](https://dev.mysql.com/downloads/))
- ✅ Git installed (optional, for cloning)

### Step-by-Step Setup

#### **Step 1: Install Dependencies**

Open terminal/command prompt:

```bash
# Navigate to project folder
cd "d:\Dalal Stret Game"

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

**Time:** ~2-5 minutes

---

#### **Step 2: Configure Database**

```bash
# Go back to backend folder
cd ../backend

# Copy environment template
copy .env.example .env

# Edit .env file (use notepad or VS Code)
notepad .env
```

**Update these values in `.env`:**
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=stock_simulation
```

**Create Database:**
```bash
# Open MySQL command line or Workbench
mysql -u root -p

# Run these commands in MySQL:
CREATE DATABASE stock_simulation;
EXIT;
```

**Import Schema:**
```bash
# In terminal (from backend folder)
mysql -u root -p stock_simulation < database/schema.sql
```

**Optional - Seed Sample Data:**
```bash
npm run db:seed
```

This creates:
- 8 sample stocks (Tech Corp, Global Bank, etc.)
- 1 admin user
- Initial market data

---

#### **Step 3: Configure Frontend**

```bash
# Go to frontend folder
cd ../frontend

# Copy environment template
copy .env.example .env

# Edit .env file
notepad .env
```

**Set API URL:**
```env
VITE_API_URL=http://localhost:5000/api
```

---

#### **Step 4: Start Backend Server**

```bash
# Go to backend folder
cd ../backend

# Start development server
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

#### **Step 5: Start Frontend App**

Open a **NEW terminal/command prompt**:

```bash
# Navigate to frontend folder
cd "d:\Dalal Stret Game\frontend"

# Start development server
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

Open your web browser and go to:
```
http://localhost:5173
```

**Default Admin Login (if you ran seed script):**
```
Email: admin@stocksim.com
Password: password123
```

🎉 **You're in! Start trading!**

---

## 🌐 LAN Setup (Multiple PCs on Local Network)

Want to play with friends in the same house/school/office? Follow these steps!

### What You'll Need

- ✅ One computer as **HOST** (runs backend + frontend)
- ✅ Other computers as **CLIENTS** (just need web browsers)
- ✅ All devices connected to same WiFi/network
- ✅ Firewall access (we'll configure this)

---

### **Method 1: Host Runs Everything (Recommended)**

#### **On HOST Computer:**

**Step 1: Find Your Local IP Address**

*Windows:*
```cmd
ipconfig
```
Look for "IPv4 Address" - something like `192.168.1.100`

*Mac/Linux:*
```bash
ifconfig
# or
hostname -I
```
Look for address like `192.168.1.100`

**Write this down!** You'll need it.

---

**Step 2: Update Backend Configuration**

Edit `backend/.env`:
```env
# Change CORS origin to allow LAN connections
CORS_ORIGIN=*

# Or specify your network
CORS_ORIGIN=http://192.168.1.100:5173
```

---

**Step 3: Start Backend with Network Access**

By default, servers only accept localhost connections. To allow LAN:

Edit `backend/src/config/app.js`:
```javascript
module.exports = {
  // ... other config
  host: '0.0.0.0',  // Listen on all network interfaces
  port: process.env.PORT || 5000,
  // ...
};
```

Start backend:
```bash
cd backend
npm run dev
```

---

**Step 4: Update Frontend Configuration**

Edit `frontend/.env`:
```env
# Replace localhost with your actual IP
VITE_API_URL=http://192.168.1.100:5000/api
```

Also update `vite.config.js`:
```javascript
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',  // Allow network access
    port: 5173,
  }
})
```

Start frontend:
```bash
cd frontend
npm run dev
```

---

**Step 5: Configure Firewall (Windows)**

Open Windows Defender Firewall:

1. Press `Win + R`, type `firewall.cpl`, press Enter
2. Click "Advanced settings"
3. Click "Inbound Rules" → "New Rule"
4. Select "Port" → Next
5. Enter ports: `5000, 5173`
6. Select "Allow the connection"
7. Check all profiles (Domain, Private, Public)
8. Name it "Stock Simulation App"
9. Finish

**Mac Firewall:**
1. System Preferences → Security & Privacy → Firewall
2. Add Node.js to allowed apps
3. Or temporarily disable firewall for testing

---

**Step 6: Friends Connect from Their Computers**

On friend's computer, open browser and go to:
```
http://192.168.1.100:5173
```

Replace `192.168.1.100` with YOUR IP address!

They should see the app and can:
- Create accounts
- Login
- Trade stocks
- See real-time updates

---

### **Method 2: Separate Backend/Frontend (Advanced)**

If you want better performance:

**Computer A (Backend Server):**
- Runs only backend on port 5000
- Update CORS to allow frontend IP

**Computer B (Frontend Server):**
- Runs only frontend on port 5173
- Points API URL to Computer A's IP

**Other Computers (Clients):**
- Just access frontend via browser

---

## 🌍 Online Multiplayer (Hosted/Internet)

Want friends to connect from different locations? Use these methods:

### **Option 1: Ngrok Tunnel (Easiest, Temporary)**

Ngrok creates a public URL that tunnels to your local server.

**On Host Computer:**

**Step 1: Install Ngrok**
```bash
# Download from https://ngrok.com/download
# Or install with npm
npm install -g ngrok
```

**Step 2: Start Your App**
```bash
# Start backend
cd backend
npm run dev

# In new terminal, start frontend
cd frontend
npm run dev
```

**Step 3: Create Tunnels**
```bash
# Expose backend (port 5000)
ngrok http 5000

# In new terminal, expose frontend (port 5173)
ngrok http 5173
```

**Step 4: Get Public URLs**

Ngrok will show URLs like:
```
Forwarding: https://abc123.ngrok.io -> http://localhost:5000
Forwarding: https://xyz789.ngrok.io -> http://localhost:5173
```

**Step 5: Share with Friends**

Send them the frontend URL:
```
https://xyz789.ngrok.io
```

Update frontend `.env` with ngrok backend URL:
```env
VITE_API_URL=https://abc123.ngrok.io/api
```

Restart frontend after changing `.env`.

**Limitations:**
- Free tier: URL changes each time
- Speed limited on free tier
- Good for testing, not long-term use

---

### **Option 2: Deploy to Cloud (Recommended for Long-term)**

Deploy once, everyone connects anytime!

#### **Quick Deploy Options:**

**A. Heroku (Backend) + Netlify/Vercel (Frontend)**

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed instructions.

**Steps:**
1. Deploy backend to Heroku/Railway/Render
2. Deploy frontend to Netlify/Vercel
3. Update frontend `.env` with production backend URL
4. Share deployed URL with friends

**Example:**
```
Frontend: https://stock-sim.netlify.app
Backend:  https://stock-sim-api.herokuapp.com
```

Friends just visit the Netlify URL!

---

**B. DigitalOcean Droplet ($5/month)**

Full control, one server does everything.

**Steps:**
1. Create DigitalOcean account
2. Create $5/month droplet (Ubuntu 22.04)
3. SSH into droplet
4. Install Node.js, MySQL, Nginx
5. Deploy code
6. Configure domain/subdomain
7. Enable HTTPS

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for complete instructions.

**Result:**
```
https://your-domain.com
```

Everyone accesses this URL from anywhere!

---

**C. VPS Providers**

Similar to DigitalOcean:
- Linode
- AWS EC2
- Google Cloud Compute Engine
- Azure Virtual Machines

---

### **Option 3: Self-Host with Port Forwarding**

Expose your home computer to internet (advanced users only).

⚠️ **Security Warning:** This exposes your computer. Use strong passwords and firewall rules!

**Steps:**

1. **Setup Static IP on Host Computer**
   - Router settings → DHCP Reservation
   - Assign permanent IP to your PC

2. **Configure Port Forwarding**
   - Router admin panel (usually 192.168.1.1)
   - Forward ports 5000 and 5173 to your PC's IP

3. **Find Your Public IP**
   ```
   Visit: https://whatismyip.com
   ```

4. **Share with Friends**
   ```
   http://YOUR_PUBLIC_IP:5173
   ```

**Problems:**
- Public IP can change (use Dynamic DNS)
- ISP may block ports
- Security risks
- Not recommended for beginners

---

## 👥 Playing with Friends - Complete Guide

Now that you're connected, here's how to play together!

### **Game Modes**

#### **Mode 1: Competitive Trading**

Each player manages their own portfolio. Compete for highest returns!

**Setup:**
1. Each friend creates account at `/signup`
2. Everyone gets $100,000 virtual cash
3. Trade independently
4. Check leaderboard at `/leaderboard`

**Features:**
- Personal portfolio tracking
- Individual P/L calculation
- Rankings by total value
- Team competition available

---

#### **Mode 2: Team Competition**

Form teams and compete against other teams!

**Setup:**
1. Create teams at `/teams`
2. Friends join same team
3. Team portfolio = combined value
4. Compete against other teams

**How Teams Work:**
- Team name (e.g., "Bulls", "Wolves")
- Combined portfolio value
- Average return percentage
- Team rankings

---

#### **Mode 3: Collaborative Trading**

Work together on same portfolio (requires coordination).

**Informal Method:**
- Share one account login
- Discuss trades via Discord/WhatsApp
- Take turns making decisions

**Formal Method:**
- Each person manages different sectors
- One person per industry
- Regular strategy meetings

---

### **Communication Tools**

While trading, stay connected:

**Voice Chat:**
- Discord (recommended)
- Zoom
- Google Meet
- WhatsApp call

**Text Chat:**
- WhatsApp group
- Telegram
- Slack
- Discord text channels

**Screen Sharing:**
- Discord screenshare
- Zoom screen share
- Google Meet present

Great for analyzing stocks together!

---

### **Suggested Game Rules**

Make it interesting with house rules:

**Time Limits:**
- Play for 1 week
- Play for 1 month
- One semester challenge

**Win Conditions:**
- Highest portfolio value
- Best return percentage
- Most profitable single trade
- Best team average

**Prizes:**
- Bragging rights
- Actual money pool
- Dinner/lunch treat
- Trophy/medal

**Restrictions:**
- No trading certain stocks
- Maximum 10 trades per day
- Must hold minimum 5 stocks
- Sector diversification required

---

### **Admin Controls (For Game Masters)**

One person acts as Admin/Game Master:

**Admin Powers:**
- Monitor all trades
- Trigger market events
- Freeze trading if needed
- Adjust stock prices manually
- View audit logs

**How to Access Admin Panel:**
1. Login with admin account
2. Click "Admin" in navbar
3. Access dashboard at `/admin`

**Admin Features:**
- Dashboard tab: System overview
- Stocks tab: Price controls
- Users tab: Player management
- Transactions tab: Trade monitoring
- Actions tab: Audit trail
- Market Events: Trigger bull/bear markets

**Example Admin Actions:**
```
Trigger "Bull Market" → All stocks +10%
Trigger "Market Crash" → All stocks -25%
Freeze trading during news event
Manually adjust specific stock
```

---

## 💹 Trading Interface Overview

When you're in the app, here's how trading works:

### **Dashboard (`/dashboard`)**

Main trading screen shows:

**Stock Cards Display:**
```
┌─────────────────────────────┐
│ TECH Corp          $175.50  │
│ ▲ +5.50 (+3.24%)            │
│                             │
│ [Buy]  [Sell]               │
└─────────────────────────────┘
```

**Information Shown:**
- Stock name & symbol
- Current price (live updates!)
- Price change (green/red)
- Buy/Sell buttons

---

### **Making a Trade**

**To BUY:**

1. Click "Buy" button on stock card
2. Modal popup appears
3. Enter quantity (e.g., 10 shares)
4. See total cost preview
5. Click "Confirm Buy"
6. Trade executes instantly!

**To SELL:**

1. Click "Sell" button
2. Enter quantity to sell
3. See revenue preview
4. Click "Confirm Sell"
5. Trade executes!

**Trade Confirmation Shows:**
- Stock name
- Quantity
- Price per share
- Total amount
- Your remaining balance

---

### **Portfolio Page (`/portfolio`)**

View your investments:

**Summary Cards:**
```
┌──────────────┬──────────────┬──────────────┐
│ Portfolio    │ Cash Balance │ Total Value  │
│   $12,450    │   $87,550    │   $100,000   │
└──────────────┴──────────────┴──────────────┘
```

**Holdings Table:**
```
Stock     | Qty | Avg Cost | Current | P/L | P/L%
----------|-----|----------|---------|-----|------
TECH      | 10  | $170.00  | $175.50 | +$55| +3.24%
BANK      | 20  | $100.00  | $105.25 | +$105| +5.25%
```

**Visual Chart:**
- Pie chart showing asset allocation
- Color-coded by stock
- Percentage breakdown

---

### **Real-Time Updates**

While you're using the app:

✅ **Prices update automatically** - No refresh needed  
✅ **Your portfolio value updates live**  
✅ **Leaderboard rankings refresh in real-time**  
✅ **Trades appear instantly in transaction history**  

All powered by Socket.io! ⚡

---

### **Team Features**

**Join a Team:**
1. Go to `/teams`
2. Browse available teams
3. Click "Join Team"
4. Confirm selection

**Team Page Shows:**
- Team name
- Members list
- Combined portfolio value
- Team rankings
- Average return %

**Benefits:**
- Compete in team leaderboard
- Shared strategy discussions
- Pool resources (informally)
- Bragging rights!

---

## 🔧 Troubleshooting

### **Can't Start Backend**

**Error: Database connection failed**
```
Solution:
1. Check MySQL is running
2. Verify credentials in backend/.env
3. Test: mysql -u root -p
4. Ensure database exists
```

**Error: Port 5000 already in use**
```
Solution:
1. Change PORT in backend/.env to 5001
2. Update frontend/.env VITE_API_URL accordingly
3. Restart both servers
```

---

### **Can't Start Frontend**

**Error: Port 5173 already in use**
```
Solution:
1. Close other apps using port 5173
2. Or change port in vite.config.js
3. Restart dev server
```

**Blank page / White screen**
```
Solution:
1. Check browser console (F12)
2. Verify backend is running
3. Check VITE_API_URL in frontend/.env
4. Clear browser cache (Ctrl+Shift+Delete)
```

---

### **LAN Connection Issues**

**Friend can't connect**
```
Checklist:
✓ Host computer firewall allows ports 5000, 5173
✓ Both computers on same WiFi network
✓ Using correct IP address (not localhost)
✓ Backend/frontend started with --host flag
✓ Antivirus not blocking
```

**Test locally first:**
```
1. On host, open http://localhost:5173
2. If works locally but not remotely → firewall issue
3. Temporarily disable firewall to test
4. Re-enable and create proper rules
```

---

### **Real-Time Not Working**

**Socket.io not connecting**
```
Solution:
1. Check browser console for errors
2. Verify CORS configured correctly
3. Ensure JWT token is valid
4. Try logging out and back in
5. Clear browser cache
```

**Prices not updating live**
```
Solution:
1. Check Socket.io connection in console
2. Refresh page (Ctrl+R)
3. Verify backend is running
4. Check network tab for WebSocket connection
```

---

### **Multiplayer Issues**

**Friends can't create accounts**
```
Check:
1. Backend API is accessible
2. Database allows new users
3. Email addresses are unique
4. Password meets requirements
```

**Trades not executing**
```
Check:
1. User has sufficient balance
2. User has sufficient holdings (for selling)
3. Trading is not frozen by admin
4. No validation errors
```

---

### **Performance Issues**

**App is slow**
```
Solutions:
1. Close unnecessary browser tabs
2. Reduce number of concurrent users
3. Check network speed
4. Restart backend server
5. Clear browser cache
```

**Database slow**
```
Solutions:
1. Ensure indexes exist (schema includes them)
2. Limit transaction history queries
3. Use pagination for large datasets
4. Optimize MySQL configuration
```

---

## 📞 Additional Help

### **Documentation Files**

- **[README.md](./README.md)** - Main project overview
- **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** - Production deployment
- **[API_DOCS.md](./API_DOCS.md)** - API endpoint reference
- **[CONTRIBUTING.md](./CONTRIBUTING.md)** - Contribution guidelines

### **Common Commands**

```bash
# Start backend
cd backend
npm run dev

# Start frontend
cd frontend
npm run dev

# Reset database
mysql -u root -p stock_simulation < database/schema.sql
npm run db:seed

# Check what's running
netstat -ano | findstr :5000
netstat -ano | findstr :5173
```

---

## ✅ Quick Reference Card

**Single Player:**
```
1. cd backend → npm run dev
2. cd frontend → npm run dev
3. Open http://localhost:5173
```

**LAN Party:**
```
1. Find host IP: ipconfig
2. Update .env files with IP
3. Start servers with --host
4. Configure firewall
5. Friends visit http://IP:5173
```

**Online Multiplayer:**
```
Option A: Use ngrok (temporary)
Option B: Deploy to cloud (permanent)
Option C: Port forwarding (advanced)
```

**Default Admin:**
```
Email: admin@stocksim.com
Password: password123
```

---

## 🎉 Ready to Trade!

You now have everything you need to:
✅ Start the app on your computer  
✅ Connect multiple PCs on LAN  
✅ Setup online multiplayer  
✅ Play with friends competitively  
✅ Use the trading interface  
✅ Troubleshoot common issues  

**Have fun trading!** 📈💰

---

*Last Updated: March 25, 2026*  
*Version: 1.0.0*
