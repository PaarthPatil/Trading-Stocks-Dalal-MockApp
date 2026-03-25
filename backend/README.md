# 🚀 Stock Simulation Platform - Backend

Backend API server built with Node.js, Express, MySQL, and Socket.io.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Node](https://img.shields.io/badge/node-%3E%3D16.x-green)
![Express](https://img.shields.io/badge/express-4.18.2-blue)

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Database Setup](#database-setup)
- [Real-Time Features](#real-time-features)
- [Security](#security)
- [Testing](#testing)
- [Project Structure](#project-structure)
- [Troubleshooting](#troubleshooting)

---

## ✨ Features

### Core API

- ✅ RESTful API design
- ✅ JWT authentication
- ✅ Role-based authorization
- ✅ Input validation
- ✅ Error handling
- ✅ Rate limiting
- ✅ CORS support
- ✅ Security headers (Helmet)

### Business Logic

- ✅ Stock trading engine (pure functions)
- ✅ Portfolio calculations
- ✅ Transaction processing
- ✅ Team management
- ✅ Leaderboard rankings
- ✅ Admin controls

### Real-Time (Socket.io)

- ✅ Live stock price updates
- ✅ Trade execution notifications
- ✅ Market event broadcasts
- ✅ Portfolio updates
- ✅ Leaderboard changes

### Database

- ✅ MySQL with InnoDB engine
- ✅ Foreign key constraints
- ✅ Cascading deletes
- ✅ Indexes for performance
- ✅ DECIMAL precision for money
- ✅ Audit trail tables

---

## 🛠️ Tech Stack

### Runtime & Framework

- **Node.js** >= 16.x
- **Express.js** ^4.18.2

### Database

- **MySQL** >= 8.0
- **mysql2** ^3.6.5 (driver)

### Authentication & Security

- **jsonwebtoken** ^9.0.2 (JWT tokens)
- **bcryptjs** ^2.4.3 (password hashing)
- **helmet** ^7.1.0 (security headers)
- **cors** ^2.8.5 (CORS support)
- **express-rate-limit** ^7.1.5 (rate limiting)

### Real-Time

- **socket.io** ^4.6.0 (WebSocket server)

### Utilities

- **dotenv** ^16.3.1 (environment variables)
- **nodemon** ^3.0.2 (development auto-reload)

---

## 📦 Installation

### 1. Clone Repository

```bash
cd backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Edit `.env` with your credentials:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password_here
DB_NAME=stock_simulation

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d

# Trading Configuration
PRICE_IMPACT_FACTOR=0.01
INITIAL_USER_BALANCE=100000
```

### 4. Setup Database

```bash
# Create database and run schema
mysql -u root -p < database/schema.sql

# Optional: Seed sample data
npm run db:seed

# Test connection
npm run db:test
```

---

## ⚙️ Configuration

### Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `PORT` | Server port | `5000` | Yes |
| `NODE_ENV` | Environment | `development` | Yes |
| `DB_HOST` | MySQL host | `localhost` | Yes |
| `DB_PORT` | MySQL port | `3306` | Yes |
| `DB_USER` | MySQL username | `root` | Yes |
| `DB_PASSWORD` | MySQL password | - | Yes |
| `DB_NAME` | Database name | `stock_simulation` | Yes |
| `JWT_SECRET` | JWT secret key | - | Yes |
| `JWT_EXPIRE` | Token expiration | `7d` | Yes |
| `PRICE_IMPACT_FACTOR` | Price impact multiplier | `0.01` | Yes |
| `INITIAL_USER_BALANCE` | Starting balance | `100000` | Yes |

### Best Practices

✅ Use strong JWT secrets (32+ random characters)  
✅ Never commit `.env` files to git  
✅ Use different secrets for dev/staging/prod  
✅ Rotate secrets periodically  
✅ Enable HTTPS in production  

---

## 🚀 Usage

### Development Mode

```bash
npm run dev
```

Server runs on `http://localhost:5000` with auto-reload.

### Production Mode

```bash
npm start
```

### Available Scripts

```json
{
  "start": "node server.js",           // Production start
  "dev": "nodemon server.js",          // Development with reload
  "db:init": "mysql -u root -p < database/schema.sql",  // Create DB
  "db:test": "node test-database.js",  // Test connection
  "db:seed": "node seed-database.js",  // Seed sample data
  "db:setup": "npm run db:init && npm run db:seed"      // Full setup
}
```

---

## 📡 API Endpoints

### Base URL

```
http://localhost:5000/api
```

### Health Check

```http
GET /health
```

Response:
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "timestamp": "2026-03-25T10:30:00.000Z",
    "environment": "development"
  }
}
```

### Authentication

#### POST /api/auth/login
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

#### POST /api/auth/signup
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "teamId": 1
}
```

### Stocks

#### GET /api/stocks
Get all stocks

#### GET /api/stocks/:id
Get stock by ID

### Trades

#### POST /api/trades/buy
```json
{
  "stockId": 1,
  "quantity": 10
}
```

#### POST /api/trades/sell
```json
{
  "stockId": 1,
  "quantity": 5
}
```

### Portfolio

#### GET /api/portfolio/user/:userId
Get user portfolio

### Teams

#### GET /api/teams
Get all teams

#### POST /api/teams/join
```json
{
  "teamId": 1
}
```

### Transactions

#### GET /api/transactions/user/:userId
Get user transactions

### Admin (Requires Admin Role)

#### GET /api/admin/users
Get all users

#### GET /api/admin/transactions
Get all transactions

#### GET /api/admin/stocks
Manage stocks

#### PUT /api/admin/stocks/:id/price
```json
{
  "price": 175.50
}
```

#### POST /api/admin/freeze-trading
```json
{
  "frozen": true
}
```

#### POST /api/admin/market-event
```json
{
  "eventType": "bull_market",
  "impactPercent": 10,
  "affectedStocks": [{"id": 1}]
}
```

#### GET /api/admin/actions
Get admin action logs

#### GET /api/admin/leaderboard
Get leaderboard

For complete API docs, see [API_DOCS.md](../API_DOCS.md)

---

## 🗄️ Database Setup

### Schema Location

`database/schema.sql`

### Tables Created

1. **teams** - User teams
2. **users** - Platform users
3. **stocks** - Tradable stocks
4. **holdings** - User stock ownership
5. **transactions** - Trade history
6. **admin_actions** - Admin audit trail
7. **system_settings** - Platform config

### Run Schema

```bash
mysql -u root -p < database/schema.sql
```

### Sample Data

The seed script (`seed-database.js`) creates:

- 8 sample stocks
- 1 admin user (admin@stocksim.com / password123)
- Initial market configuration

Run with:
```bash
npm run db:seed
```

---

## ⚡ Real-Time Features

### Socket.io Setup

Socket.io is automatically initialized when the server starts.

### Connection Flow

1. Client connects with JWT token
2. Server verifies token
3. Client joins user-specific room
4. Admins also join admin room
5. Events are routed accordingly

### Events Emitted

#### stock_update
Triggered when stock prices change.

```javascript
{
  id: 1,
  symbol: "TECH",
  name: "Tech Corp",
  currentPrice: 175.50,
  previousPrice: 170.00,
  priceChange: 5.50,
  updatedAt: "2026-03-25T10:30:00.000Z"
}
```

#### trade_executed
Sent when a trade is executed.

```javascript
{
  id: 123,
  userId: 5,
  stockId: 1,
  stockSymbol: "TECH",
  type: "BUY",
  quantity: 10,
  price: 175.50,
  totalAmount: 1755.00,
  timestamp: "2026-03-25T10:35:00.000Z"
}
```

#### market_event
Broadcast when admin triggers event.

```javascript
{
  eventType: "bull_market",
  impactPercent: 10,
  affectedStocksCount: 8,
  timestamp: "2026-03-25T11:00:00.000Z"
}
```

---

## 🔐 Security

### Authentication

- JWT tokens for all protected routes
- Password hashing with bcryptjs
- Token expiration (7 days default)
- Auto-logout on invalid token

### Authorization

- Role-based access control
- Admin-only endpoints
- User data isolation

### API Security

- Helmet security headers
- CORS configuration
- Rate limiting (100 requests per 15 minutes)
- Input validation on all endpoints
- SQL injection prevention (parameterized queries)

### Best Practices Implemented

✅ Passwords never stored in plain text  
✅ JWT secrets from environment variables  
✅ Parameterized SQL queries  
✅ Input validation on all endpoints  
✅ Error messages don't leak sensitive info  
✅ Rate limiting prevents abuse  
✅ CORS restricts origins  

---

## 🧪 Testing

### Test Database Connection

```bash
npm run db:test
```

### Manual API Testing

Use tools like Postman or curl:

```bash
# Health check
curl http://localhost:5000/health

# Get stocks
curl http://localhost:5000/api/stocks

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@stocksim.com","password":"password123"}'
```

---

## 📁 Project Structure

```
backend/
├── database/
│   ├── schema.sql               # Database schema
│   ├── test-database.js         # Connection test
│   └── seed-database.js         # Sample data generator
├── src/
│   ├── core/
│   │   └── tradingEngine.js     # Pure business logic
│   ├── config/
│   │   ├── app.js               # App configuration
│   │   ├── database.js          # DB connection pool
│   │   └── socket.js            # Socket.io server
│   ├── models/                  # Data models (5 files)
│   ├── services/                # Business logic (5 files)
│   ├── middleware/              # Auth & validation
│   ├── controllers/             # Request handlers (7 files)
│   └── routes/                  # API routes (7 files)
├── .env                         # Environment variables (DO NOT COMMIT)
├── .env.example                 # Template
├── package.json                 # Dependencies
└── server.js                    # Entry point
```

### Key Directories

**`core/`** - Pure business logic (no DB/API calls)  
**`config/`** - Configuration files  
**`models/`** - Database operations  
**`services/`** - Business logic + DB operations  
**`controllers/`** - HTTP request handlers  
**`middleware/`** - Auth, validation, error handling  
**`routes/`** - API route definitions  

---

## 🔧 Troubleshooting

### Cannot Connect to Database

**Problem:** Database connection error

**Solutions:**
1. Verify MySQL is running
2. Check credentials in `.env`
3. Ensure database exists
4. Test connection: `npm run db:test`
5. Check firewall settings

### Port Already in Use

**Problem:** EADDRINUSE error

**Solutions:**
1. Change PORT in `.env`
2. Kill process using port 5000
3. Use different port

### JWT Token Invalid

**Problem:** 401 Unauthorized errors

**Solutions:**
1. Verify JWT_SECRET matches
2. Check token expiration
3. Re-login to get new token
4. Clear browser cache

### Socket.io Not Connecting

**Problem:** WebSocket connection fails

**Solutions:**
1. Check CORS configuration
2. Verify JWT token is valid
3. Check browser console for errors
4. Ensure backend is running

### Module Not Found

**Problem:** Cannot find module

**Solutions:**
1. Delete `node_modules`
2. Run `npm install`
3. Check package.json dependencies

---

## 📞 Support

### Documentation

- [Main README](../README.md)
- [API Documentation](../API_DOCS.md)
- [Frontend README](../frontend/README.md)

### Common Commands

```bash
# Start development
npm run dev

# Setup database
npm run db:setup

# Test connection
npm run db:test

# View logs (check terminal output)
```

---

**Built with ❤️ using Node.js, Express, MySQL, and Socket.io**
