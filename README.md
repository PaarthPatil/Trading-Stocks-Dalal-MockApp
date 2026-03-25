# 🚀 Stock Simulation Platform

A comprehensive real-time stock trading simulation platform built with Node.js, Express, MySQL, React, and Socket.io.

![Status](https://img.shields.io/badge/status-production--ready-success)
![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Quick Start](#-quick-start)
- [Installation](#-installation)
- [Usage](#-usage)
- [API Documentation](#-api-documentation)
- [Admin Panel](#-admin-panel)
- [Real-Time Features](#-real-time-features)
- [Security](#-security)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)
- [Support](#-support)

---

## ✨ Features

### For Users

- **🎯 Real-Time Trading** - Live stock price updates and instant trade execution
- **💼 Portfolio Tracking** - Track holdings, P/L, and asset allocation with charts
- **👥 Team Competition** - Join teams and compete with other traders
- **🏆 Leaderboards** - Real-time rankings of top performers
- **📊 Interactive Charts** - Visual portfolio breakdown using Recharts
- **🔐 Secure Authentication** - JWT-based auth with password hashing
- **📱 Responsive Design** - Works seamlessly on desktop, tablet, and mobile

### For Admins

- **🎛️ Dashboard** - Complete system overview with key metrics
- **👤 User Management** - View and manage all users
- **📈 Stock Control** - Manually adjust stock prices
- **💹 Transaction Monitoring** - Real-time trade surveillance
- **❄️ Trading Controls** - Freeze/unfreeze trading platform-wide
- **🌍 Market Events** - Trigger bull/bear markets, crashes, and booms
- **📝 Audit Trail** - Complete admin action logging
- **🔍 System Analytics** - Track platform statistics

---

## 🛠️ Tech Stack

### Backend

- **Runtime:** Node.js
- **Framework:** Express.js v4.18
- **Database:** MySQL v8.0 with mysql2 driver
- **Authentication:** JWT (jsonwebtoken v9.0)
- **Security:** bcryptjs, Helmet, CORS, Rate Limiting
- **Real-Time:** Socket.io v4.6
- **Environment:** dotenv

### Frontend

- **Framework:** React 18
- **Build Tool:** Vite 5
- **Routing:** React Router DOM v6
- **Styling:** Tailwind CSS v3.4
- **Charts:** Recharts v2.10
- **HTTP Client:** Axios v1.6
- **Real-Time:** Socket.io-client v4.6

### Database

- **Engine:** InnoDB
- **Tables:** 7 (users, teams, stocks, holdings, transactions, admin_actions, system_settings)
- **Features:** Foreign keys, indexes, cascading deletes, DECIMAL precision for money

---

## 📁 Project Structure

```
stock-simulation/
├── backend/                          # Backend API server
│   ├── database/
│   │   ├── schema.sql               # Database schema
│   │   ├── test-database.js         # Connection test
│   │   └── seed-database.js         # Sample data
│   ├── src/
│   │   ├── core/
│   │   │   └── tradingEngine.js     # Pure business logic
│   │   ├── config/
│   │   │   ├── app.js               # App config
│   │   │   ├── database.js          # DB connection
│   │   │   └── socket.js            # Socket.io server
│   │   ├── models/                  # Data models (5 files)
│   │   ├── services/                # Business logic (5 files)
│   │   ├── middleware/              # Auth & validation
│   │   ├── controllers/             # Request handlers (7 files)
│   │   └── routes/                  # API routes (7 files)
│   ├── .env.example                 # Environment template
│   ├── package.json                 # Dependencies
│   └── server.js                    # Entry point
│
├── frontend/                         # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/              # Reusable components
│   │   ├── contexts/                # React contexts
│   │   ├── pages/                   # App pages (8 files)
│   │   ├── services/                # API services
│   │   ├── App.jsx                  # Main app
│   │   ├── main.jsx                 # Entry point
│   │   └── index.css                # Styles
│   ├── .env.example                 # Environment template
│   ├── package.json                 # Dependencies
│   ├── tailwind.config.js           # Tailwind config
│   ├── vite.config.js               # Vite config
│   └── README.md                    # Frontend docs
│
├── Prompts/                          # Requirements docs
│   ├── 01core_logic.md
│   ├── 02backend_api.md
│   ├── 03database.md
│   ├── 04frontend_ui.md
│   ├── 05admin_panel.md
│   ├── 06realtime.md
│   └── 07_constraints.md
│
├── FINAL_STATUS_REPORT.md           # System verification
└── README.md                        # This file
```

---

## ⚡ Quick Start

### Prerequisites

- Node.js >= 16.x
- MySQL >= 8.0
- npm or yarn

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/stock-simulation.git
cd stock-simulation
```

### 2. Setup Backend

```bash
cd backend

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Edit .env with your database credentials

# Create database and run schema
mysql -u root -p < database/schema.sql

# Seed sample data (optional)
npm run db:seed

# Start server
npm run dev
```

Backend runs on `http://localhost:5000`

### 3. Setup Frontend

```bash
cd ../frontend

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Start development server
npm run dev
```

Frontend runs on `http://localhost:5173`

---

## 📖 Installation

### Detailed Backend Setup

1. **Install Dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Configure Environment**
   
   Create `.env` file in backend root:
   ```env
   PORT=5000
   NODE_ENV=development
   
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=stock_simulation
   
   JWT_SECRET=your_super_secret_jwt_key
   JWT_EXPIRE=7d
   
   PRICE_IMPACT_FACTOR=0.01
   INITIAL_USER_BALANCE=100000
   ```

3. **Setup Database**
   ```bash
   # Method 1: Using npm script
   npm run db:init
   
   # Method 2: Manual MySQL command
   mysql -u root -p < database/schema.sql
   ```

4. **Seed Sample Data** (Optional)
   ```bash
   npm run db:seed
   ```
   
   This creates:
   - Sample stocks (8 companies)
   - Test admin user
   - Initial market data

5. **Test Database Connection**
   ```bash
   npm run db:test
   ```

6. **Start Development Server**
   ```bash
   npm run dev
   ```

### Detailed Frontend Setup

1. **Install Dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Configure Environment**
   
   Create `.env` file in frontend root:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Build for Production**
   ```bash
   npm run build
   ```

5. **Preview Production Build**
   ```bash
   npm run preview
   ```

---

## 🚀 Usage

### Default Admin Account

After running seed script:

```
Email: admin@stocksim.com
Password: password123
```

### Sample Stocks Included

- Tech Corp (TECH) - $150.00
- Global Bank (BANK) - $100.00
- Energy Plus (ENRG) - $80.00
- Health Co (HLTH) - $120.00
- Consumer Giant (CONS) - $95.00
- Industrial Inc (INDU) - $110.00
- Telecom Ltd (TCOM) - $75.00
- Utility Max (UTIL) - $85.00

### User Registration

1. Navigate to `/signup`
2. Fill in name, email, password
3. Select a team (optional)
4. Click "Sign Up"
5. Login with credentials

### Trading Workflow

1. **Dashboard** - View all stocks with live prices
2. **Buy/Sell** - Click buttons on stock cards
3. **Enter Quantity** - Specify number of shares
4. **Confirm** - Review and execute trade
5. **Portfolio** - View holdings and P/L

---

## 📡 API Documentation

### Base URL

```
http://localhost:5000/api
```

### Authentication Endpoints

#### POST /auth/login
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "user@example.com",
      "isAdmin": false
    }
  }
}
```

#### POST /auth/signup
```json
{
  "name": "John Doe",
  "email": "user@example.com",
  "password": "password123",
  "teamId": 1
}
```

### Stock Endpoints

#### GET /stocks
Get all stocks

Response:
```json
{
  "success": true,
  "data": {
    "stocks": [
      {
        "id": 1,
        "name": "Tech Corp",
        "symbol": "TECH",
        "currentPrice": 175.50,
        "initialPrice": 150.00
      }
    ]
  }
}
```

#### GET /stocks/:id
Get stock by ID

### Trade Endpoints

#### POST /trades/buy
```json
{
  "stockId": 1,
  "quantity": 10
}
```

#### POST /trades/sell
```json
{
  "stockId": 1,
  "quantity": 5
}
```

### Portfolio Endpoints

#### GET /portfolio/user/:userId
Get user portfolio with holdings and P/L

### Admin Endpoints

All admin endpoints require JWT token with `isAdmin: true`.

#### GET /admin/users
Get all users

#### PUT /admin/stocks/:id/price
```json
{
  "price": 180.00
}
```

#### POST /admin/market-event
```json
{
  "eventType": "bull_market",
  "impactPercent": 10,
  "affectedStocks": [
    {"id": 1},
    {"id": 2}
  ]
}
```

#### POST /admin/freeze-trading
```json
{
  "frozen": true
}
```

For complete API documentation, see [API_DOCS.md](./API_DOCS.md)

---

## 👑 Admin Panel

Access at: `http://localhost:5173/admin`

### Features

1. **Dashboard Tab**
   - System statistics
   - Trading status toggle
   - Quick actions

2. **Stocks Tab**
   - View all stocks
   - Update individual prices
   - Monitor price changes

3. **Users Tab**
   - User directory
   - Balance tracking
   - Role management

4. **Transactions Tab**
   - Real-time trade feed
   - User attribution
   - Volume monitoring

5. **Actions Tab**
   - Admin audit trail
   - Action type categorization
   - Timestamp tracking

### Market Events

Predefined events available:
- 🚀 Bull Market (+10%)
- 🐻 Bear Market (-10%)
- 💥 Market Crash (-25%)
- 🎉 Market Boom (+25%)
- Custom percentage

---

## ⚡ Real-Time Features

### Socket.io Integration

The platform uses Socket.io for real-time communication:

#### Events Received by Clients

1. **stock_update**
   - Triggered when stock prices change
   - Updates dashboard automatically

2. **trade_executed**
   - Sent when user executes trade
   - Shown to user and admins

3. **leaderboard_update**
   - Rankings changes
   - Broadcast to all clients

4. **market_event**
   - Market-wide announcements
   - Alert notifications

### Connection Details

```javascript
// Frontend connects with JWT token
const socket = io('http://localhost:5000', {
  auth: { token: 'your-jwt-token' }
});

// Listen for events
socket.on('stock_update', (data) => {
  console.log('Price updated:', data);
});
```

---

## 🔐 Security

### Authentication

- JWT tokens with 7-day expiration
- Automatic token refresh on login
- Protected routes enforcement
- Auto-logout on token expiration

### Authorization

- Role-based access control
- Admin-only routes protected
- User data isolation
- Private rooms in Socket.io

### API Security

- Password hashing with bcryptjs
- Helmet security headers
- CORS configuration
- Rate limiting (100 req/15min)
- Input validation
- SQL injection prevention (parameterized queries)

### Best Practices

✅ Never commit `.env` files  
✅ Use strong JWT secrets (32+ characters)  
✅ Enable HTTPS in production  
✅ Rotate JWT secrets periodically  
✅ Implement request logging  
✅ Monitor for suspicious activity  

---

## 🧪 Testing

### Backend Testing

```bash
# Test database connection
npm run db:test

# Test API endpoints (manual)
curl http://localhost:5000/health
```

### Frontend Testing

```bash
# Run tests (if configured)
npm test

# Lint code
npm run lint
```

### Manual Testing Checklist

- [ ] User registration works
- [ ] Login authentication works
- [ ] Stocks load on dashboard
- [ ] Buy order executes successfully
- [ ] Sell order executes successfully
- [ ] Portfolio shows correct holdings
- [ ] Real-time price updates work
- [ ] Admin panel accessible only to admins
- [ ] Market events affect stock prices
- [ ] Trading freeze prevents trades

---

## 🚀 Deployment

### Backend Deployment

1. **Set Production Environment**
   ```env
   NODE_ENV=production
   PORT=5000
   DB_HOST=your-db-host
   DB_PASSWORD=strong-password
   JWT_SECRET=very-long-random-string
   ```

2. **Install PM2** (Process Manager)
   ```bash
   npm install -g pm2
   ```

3. **Start with PM2**
   ```bash
   pm2 start server.js --name stock-api
   pm2 save
   pm2 startup
   ```

4. **Configure Nginx** (Reverse Proxy)
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
     }
   }
   ```

### Frontend Deployment

1. **Build for Production**
   ```bash
   npm run build
   ```

2. **Deploy `dist/` folder** to static hosting:
   - Netlify
   - Vercel
   - AWS S3 + CloudFront
   - Your own server

3. **Configure Environment**
   ```env
   VITE_API_URL=https://api.yourdomain.com/api
   ```

### Database Deployment

1. **Use Managed MySQL Service**:
   - AWS RDS
   - Google Cloud SQL
   - Azure Database for MySQL
   - DigitalOcean Managed Database

2. **Update Schema**
   ```bash
   mysql -h your-db-host -u root -p < database/schema.sql
   ```

3. **Seed Data** (optional)
   ```bash
   node seed-database.js
   ```

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- Backend: Follow existing Express.js patterns
- Frontend: Use functional components with hooks
- Comments: JSDoc for functions
- Formatting: Consistent indentation (2 spaces)

### Guidelines

See [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed guidelines.

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

```
MIT License

Copyright (c) 2026 Stock Simulation Platform

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 📞 Support

### Documentation

- [Backend README](./backend/README.md)
- [Frontend README](./frontend/README.md)
- [API Documentation](./API_DOCS.md)
- [Final Status Report](./FINAL_STATUS_REPORT.md)

### Common Issues

**Issue: Cannot connect to database**
- Check MySQL is running
- Verify credentials in `.env`
- Ensure database exists
- Run `npm run db:test`

**Issue: Socket.io not connecting**
- Check CORS configuration
- Verify JWT token is valid
- Check browser console for errors
- Ensure backend server is running

**Issue: Frontend can't reach backend**
- Verify `VITE_API_URL` in frontend `.env`
- Check CORS settings in backend
- Ensure both servers are running

### Contact

- **Project Lead:** Your Name
- **Email:** your.email@example.com
- **GitHub:** https://github.com/yourusername

---

## 🙏 Acknowledgments

- Express.js team for the amazing framework
- React team for the UI library
- Socket.io for real-time capabilities
- All contributors to this project

---

**Built with ❤️ using Node.js, Express, React, and Socket.io**

⭐ Star this repo if you find it helpful!
