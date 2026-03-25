# Stock Simulation Platform - Backend API

Complete backend implementation for the stock trading simulation platform.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment
```bash
# Copy the example environment file
cp .env.example .env

# Edit .env with your database credentials
```

### 3. Setup Database
```bash
# Make sure MySQL is running, then execute:
mysql -u root -p < database/schema.sql
```

### 4. Start Server
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

Server will start on `http://localhost:5000`

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration files
│   │   ├── app.js       # App configuration
│   │   └── database.js  # Database connection
│   ├── core/            # Pure business logic (no DB/UI)
│   │   └── tradingEngine.js
│   ├── models/          # Database operations
│   │   ├── User.js
│   │   ├── Team.js
│   │   ├── Stock.js
│   │   ├── Holding.js
│   │   └── Transaction.js
│   ├── services/        # Business logic layer
│   │   ├── authService.js
│   │   ├── stockService.js
│   │   ├── tradeService.js
│   │   ├── teamService.js
│   │   └── portfolioService.js
│   ├── controllers/     # Request handlers
│   │   ├── authController.js
│   │   ├── stockController.js
│   │   ├── tradeController.js
│   │   ├── teamController.js
│   │   ├── transactionController.js
│   │   ├── portfolioController.js
│   │   └── adminController.js
│   ├── middleware/      # Middleware functions
│   │   ├── auth.js      # JWT authentication
│   │   └── validation.js
│   └── routes/          # API route definitions
│       ├── auth.js
│       ├── stocks.js
│       ├── trades.js
│       ├── teams.js
│       ├── transactions.js
│       ├── portfolio.js
│       └── admin.js
├── database/
│   └── schema.sql       # Database schema
├── .env.example         # Environment template
├── server.js            # Entry point
└── package.json
```

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires auth)

### Stocks
- `GET /api/stocks` - Get all stocks
- `GET /api/stocks/:id` - Get stock by ID
- `POST /api/stocks` - Create stock (admin only)
- `PUT /api/stocks/:id/price` - Update stock price (admin only)

### Trading
- `POST /api/trades/buy` - Buy stocks
- `POST /api/trades/sell` - Sell stocks

### Teams
- `GET /api/teams` - Get all teams
- `GET /api/teams/:id` - Get team by ID
- `POST /api/teams` - Create team (admin only)

### Transactions
- `GET /api/transactions` - Get transactions (user's or all for admin)
- `GET /api/transactions/recent` - Get recent transactions

### Portfolio
- `GET /api/portfolio` - Get user's portfolio
- `GET /api/portfolio/transactions` - Get user's transaction history
- `GET /api/portfolio/leaderboard` - Get leaderboard (public)

### Admin
- `GET /api/admin/users` - Get all users
- `GET /api/admin/transactions` - Get all transactions
- `GET /api/admin/leaderboard` - Get complete leaderboard
- `POST /api/admin/freeze-trading` - Freeze/unfreeze trading
- `GET /api/admin/system-status` - Get system status

## 🔐 Authentication

All protected endpoints require JWT token in Authorization header:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

Get token from `/api/auth/login` or `/api/auth/signup` response.

## 📊 API Response Format

Success:
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional message"
}
```

Error:
```json
{
  "success": false,
  "error": "Error message"
}
```

## 🧪 Testing with cURL

### Register a new user
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Get all stocks (save token from login)
```bash
TOKEN="YOUR_JWT_TOKEN_HERE"
curl -X GET http://localhost:5000/api/stocks \
  -H "Authorization: Bearer $TOKEN"
```

### Buy stocks
```bash
curl -X POST http://localhost:5000/api/trades/buy \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "stockId": 1,
    "quantity": 10
  }'
```

## ⚙️ Configuration

Edit `.env` file:

```env
PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=stock_simulation

JWT_SECRET=your_secret_key
JWT_EXPIRE=7d

PRICE_IMPACT_FACTOR=0.01
INITIAL_USER_BALANCE=100000
```

## 🗄️ Database Schema

Tables created:
- `users` - User accounts with balances
- `teams` - Trading teams
- `stocks` - Available stocks
- `holdings` - User stock holdings
- `transactions` - Transaction history
- `admin_actions` - Admin action logs
- `system_settings` - System configuration

## 🛡️ Security Features

- JWT authentication
- Password hashing with bcryptjs
- Helmet security headers
- Rate limiting (100 req/15min)
- CORS enabled
- Input validation
- SQL injection prevention (parameterized queries)

## 🎯 Core Trading Logic

Price update formula:
```javascript
newPrice = currentPrice + (buyVolume - sellVolume) * factor + randomness
// factor = 0.01 (configurable)
// randomNoise = ±5% of current price
```

Features:
- Balance validation before purchase
- Holdings validation before sale
- Weighted average cost calculation
- Atomic transactions with database transactions
- Real-time portfolio valuation

## 📝 Notes

- All monetary values stored as DECIMAL(15,2)
- Quantities are integers only
- Prices must be positive numbers
- Trading can be frozen by admin
- Users start with default balance (configurable)

## 🚨 Error Handling

Common error codes:
- `400` - Bad request (validation errors)
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not found
- `409` - Conflict (duplicate email)
- `500` - Internal server error
- `503` - Service unavailable (trading frozen)

## 🔄 Development

```bash
# Install dependencies
npm install

# Run in development mode with auto-reload
npm run dev

# Run in production mode
npm start

# Initialize database
npm run db:init
```

## 📦 Dependencies

- `express` - Web framework
- `mysql2` - Database driver
- `jsonwebtoken` - JWT authentication
- `bcryptjs` - Password hashing
- `cors` - CORS middleware
- `dotenv` - Environment variables
- `helmet` - Security headers
- `express-rate-limit` - Rate limiting
