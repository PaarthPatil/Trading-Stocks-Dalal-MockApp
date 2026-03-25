# Stock Simulation Platform - Complete API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected endpoints require JWT token in the Authorization header:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## 🔐 AUTHENTICATION ENDPOINTS

### POST /api/auth/signup
Register a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "teamId": null,
      "teamName": null,
      "balance": 100000,
      "isAdmin": false,
      "createdAt": "2026-03-25T10:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "User registered successfully"
}
```

---

### POST /api/auth/login
Login with existing credentials.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "teamId": null,
      "teamName": null,
      "balance": 100000,
      "isAdmin": false,
      "createdAt": "2026-03-25T10:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "Login successful"
}
```

---

### GET /api/auth/me
Get current authenticated user info.

**Headers:** `Authorization: Bearer TOKEN`

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "userId": 1,
      "email": "john@example.com",
      "isAdmin": false
    }
  }
}
```

---

## 📈 STOCK ENDPOINTS

### GET /api/stocks
Get all available stocks.

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "stocks": [
      {
        "id": 1,
        "name": "Tech Corp",
        "symbol": "TECH",
        "currentPrice": 150.00,
        "initialPrice": 100.00,
        "createdAt": "2026-03-25T10:00:00.000Z",
        "updatedAt": "2026-03-25T12:30:00.000Z"
      }
    ],
    "count": 3
  }
}
```

---

### GET /api/stocks/:id
Get details of a specific stock.

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "stock": {
      "id": 1,
      "name": "Tech Corp",
      "symbol": "TECH",
      "currentPrice": 150.00,
      "initialPrice": 100.00,
      "createdAt": "2026-03-25T10:00:00.000Z",
      "updatedAt": "2026-03-25T12:30:00.000Z"
    }
  }
}
```

---

### POST /api/stocks
Create a new stock (Admin only).

**Headers:** `Authorization: Bearer ADMIN_TOKEN`

**Request Body:**
```json
{
  "name": "Tech Corp",
  "symbol": "TECH",
  "initialPrice": 100.00
}
```

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "stock": {
      "id": 1,
      "name": "Tech Corp",
      "symbol": "TECH",
      "currentPrice": 100.00,
      "initialPrice": 100.00,
      "createdAt": "2026-03-25T10:00:00.000Z",
      "updatedAt": "2026-03-25T10:00:00.000Z"
    }
  },
  "message": "Stock created successfully"
}
```

---

### PUT /api/stocks/:id/price
Manually update stock price (Admin only).

**Headers:** `Authorization: Bearer ADMIN_TOKEN`

**Request Body:**
```json
{
  "price": 175.50
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "stock": {
      "id": 1,
      "name": "Tech Corp",
      "symbol": "TECH",
      "currentPrice": 175.50,
      "initialPrice": 100.00,
      "updatedAt": "2026-03-25T14:00:00.000Z"
    }
  },
  "message": "Stock price updated successfully"
}
```

---

## 💼 TRADING ENDPOINTS

### POST /api/trades/buy
Execute a buy order for stocks.

**Headers:** `Authorization: Bearer TOKEN`

**Request Body:**
```json
{
  "stockId": 1,
  "quantity": 10
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "stockId": 1,
    "quantity": 10,
    "price": 150.00,
    "totalCost": 1500.00,
    "newBalance": 98500.00,
    "transactionId": 1
  },
  "message": "Buy order executed successfully"
}
```

**Error Response (400) - Insufficient Balance:**
```json
{
  "success": false,
  "error": "Insufficient balance"
}
```

---

### POST /api/trades/sell
Execute a sell order for stocks.

**Headers:** `Authorization: Bearer TOKEN`

**Request Body:**
```json
{
  "stockId": 1,
  "quantity": 5
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "stockId": 1,
    "quantity": 5,
    "price": 150.00,
    "revenue": 750.00,
    "newBalance": 99250.00,
    "transactionId": 2
  },
  "message": "Sell order executed successfully"
}
```

**Error Response (400) - Insufficient Holdings:**
```json
{
  "success": false,
  "error": "Insufficient holdings"
}
```

---

## 👥 TEAM ENDPOINTS

### GET /api/teams
Get all teams with statistics.

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "teams": [
      {
        "id": 1,
        "teamName": "Bulls",
        "memberCount": 5,
        "totalBalance": 500000,
        "createdAt": "2026-03-25T10:00:00.000Z"
      }
    ],
    "count": 2
  }
}
```

---

### GET /api/teams/:id
Get team details with members.

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "team": {
      "id": 1,
      "teamName": "Bulls",
      "createdAt": "2026-03-25T10:00:00.000Z",
      "members": [
        {
          "id": 1,
          "name": "John Doe",
          "email": "john@example.com",
          "balance": 100000,
          "isAdmin": false,
          "createdAt": "2026-03-25T10:00:00.000Z"
        }
      ]
    }
  }
}
```

---

### POST /api/teams
Create a new team (Admin only).

**Headers:** `Authorization: Bearer ADMIN_TOKEN`

**Request Body:**
```json
{
  "teamName": "Bears"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "team": {
      "id": 2,
      "teamName": "Bears",
      "createdAt": "2026-03-25T10:00:00.000Z"
    }
  },
  "message": "Team created successfully"
}
```

---

## 📊 TRANSACTION ENDPOINTS

### GET /api/transactions
Get transactions (user's own or all for admin).

**Headers:** `Authorization: Bearer TOKEN`

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "transactions": [
      {
        "id": 1,
        "userId": 1,
        "userName": "John Doe",
        "stockId": 1,
        "stockName": "Tech Corp",
        "stockSymbol": "TECH",
        "type": "BUY",
        "quantity": 10,
        "price": 150.00,
        "totalAmount": 1500.00,
        "timestamp": "2026-03-25T12:00:00.000Z"
      }
    ],
    "count": 1
  }
}
```

---

### GET /api/transactions/recent
Get recent transactions (public access).

**Query Parameters:**
- `limit` (optional): Number of transactions (default: 50)

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "transactions": [
      {
        "id": 1,
        "userId": 1,
        "userName": "John Doe",
        "stockId": 1,
        "stockName": "Tech Corp",
        "stockSymbol": "TECH",
        "type": "BUY",
        "quantity": 10,
        "price": 150.00,
        "totalAmount": 1500.00,
        "timestamp": "2026-03-25T12:00:00.000Z"
      }
    ],
    "count": 1
  }
}
```

---

## 💰 PORTFOLIO ENDPOINTS

### GET /api/portfolio
Get user's complete portfolio.

**Headers:** `Authorization: Bearer TOKEN`

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "portfolio": {
      "userId": 1,
      "userName": "John Doe",
      "cashBalance": 85000.00,
      "holdings": [
        {
          "stockId": 1,
          "stockName": "Tech Corp",
          "stockSymbol": "TECH",
          "quantity": 10,
          "averageCost": 150.00,
          "currentPrice": 155.00,
          "currentValue": 1550.00,
          "gainLoss": 50.00,
          "gainLossPercent": 3.33
        }
      ],
      "portfolioValue": 1550.00,
      "totalValue": 86550.00,
      "calculatedAt": "2026-03-25T14:00:00.000Z"
    }
  }
}
```

---

### GET /api/portfolio/transactions
Get user's transaction history.

**Headers:** `Authorization: Bearer TOKEN`

**Query Parameters:**
- `limit` (optional): Number of transactions (default: 50)

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "transactions": [
      {
        "id": 1,
        "stockId": 1,
        "stockName": "Tech Corp",
        "stockSymbol": "TECH",
        "type": "BUY",
        "quantity": 10,
        "price": 150.00,
        "totalAmount": 1500.00,
        "timestamp": "2026-03-25T12:00:00.000Z"
      }
    ],
    "count": 1
  }
}
```

---

### GET /api/portfolio/leaderboard
Get leaderboard ranking (public access).

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "leaderboard": [
      {
        "userId": 1,
        "userName": "John Doe",
        "teamId": 1,
        "teamName": "Bulls",
        "cashBalance": 85000.00,
        "portfolioValue": 15500.00,
        "totalValue": 100500.00,
        "isAdmin": false
      }
    ]
  }
}
```

---

## 👑 ADMIN ENDPOINTS

### GET /api/admin/users
Get all users (Admin only).

**Headers:** `Authorization: Bearer ADMIN_TOKEN`

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": 1,
        "name": "John Doe",
        "email": "john@example.com",
        "teamId": 1,
        "teamName": "Bulls",
        "balance": 85000.00,
        "isAdmin": false,
        "createdAt": "2026-03-25T10:00:00.000Z"
      }
    ],
    "count": 1
  }
}
```

---

### GET /api/admin/transactions
Get all transactions (Admin only).

**Headers:** `Authorization: Bearer ADMIN_TOKEN`

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "transactions": [
      {
        "id": 1,
        "userId": 1,
        "userName": "John Doe",
        "stockId": 1,
        "stockName": "Tech Corp",
        "stockSymbol": "TECH",
        "type": "BUY",
        "quantity": 10,
        "price": 150.00,
        "totalAmount": 1500.00,
        "timestamp": "2026-03-25T12:00:00.000Z"
      }
    ],
    "count": 1
  }
}
```

---

### GET /api/admin/leaderboard
Get complete leaderboard (Admin only).

**Headers:** `Authorization: Bearer ADMIN_TOKEN`

**Success Response (200):**
Same as `/api/portfolio/leaderboard`

---

### POST /api/admin/freeze-trading
Freeze or unfreeze trading (Admin only).

**Headers:** `Authorization: Bearer ADMIN_TOKEN`

**Request Body:**
```json
{
  "frozen": true
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "frozen": true
  },
  "message": "Trading frozen successfully"
}
```

---

### GET /api/admin/system-status
Get system status (Admin only).

**Headers:** `Authorization: Bearer ADMIN_TOKEN`

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "tradingFrozen": false,
    "stats": {
      "totalUsers": 10,
      "totalStocks": 5,
      "totalTransactions": 42
    }
  }
}
```

---

## ❌ ERROR RESPONSES

### 400 Bad Request
```json
{
  "success": false,
  "error": "Validation error message"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "error": "Access denied. No token provided."
}
```

or
```json
{
  "success": false,
  "error": "Token expired"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "error": "Access denied. Admin privileges required."
}
```

### 404 Not Found
```json
{
  "success": false,
  "error": "Resource not found"
}
```

### 409 Conflict
```json
{
  "success": false,
  "error": "Email already registered"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "error": "Internal server error"
}
```

### 503 Service Unavailable
```json
{
  "success": false,
  "error": "Trading is currently frozen"
}
```

---

## 📝 EXAMPLE CURL COMMANDS

### Register and Login
```bash
# Register
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'

# Save the token from response
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

### Get Stocks
```bash
TOKEN="your_jwt_token_here"
curl -X GET http://localhost:5000/api/stocks \
  -H "Authorization: Bearer $TOKEN"
```

### Buy Stocks
```bash
curl -X POST http://localhost:5000/api/trades/buy \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"stockId":1,"quantity":10}'
```

### Get Portfolio
```bash
curl -X GET http://localhost:5000/api/portfolio \
  -H "Authorization: Bearer $TOKEN"
```

---

## 🎯 QUICK REFERENCE

| Endpoint | Method | Auth | Admin | Description |
|----------|--------|------|-------|-------------|
| /auth/signup | POST | No | No | Register user |
| /auth/login | POST | No | No | Login user |
| /auth/me | GET | Yes | No | Get current user |
| /stocks | GET | No | No | Get all stocks |
| /stocks/:id | GET | Yes | No | Get stock by ID |
| /stocks | POST | Yes | Yes | Create stock |
| /stocks/:id/price | PUT | Yes | Yes | Update price |
| /trades/buy | POST | Yes | No | Buy stocks |
| /trades/sell | POST | Yes | No | Sell stocks |
| /teams | GET | No | No | Get all teams |
| /teams/:id | GET | Yes | No | Get team details |
| /teams | POST | Yes | Yes | Create team |
| /transactions | GET | Yes | No | Get transactions |
| /transactions/recent | GET | No | No | Recent transactions |
| /portfolio | GET | Yes | No | User portfolio |
| /portfolio/transactions | GET | Yes | No | Transaction history |
| /portfolio/leaderboard | GET | No | No | Leaderboard |
| /admin/users | GET | Yes | Yes | All users |
| /admin/transactions | GET | Yes | Yes | All transactions |
| /admin/freeze-trading | POST | Yes | Yes | Freeze trading |
| /admin/system-status | GET | Yes | Yes | System status |

---

**Version:** 1.0.0  
**Last Updated:** March 25, 2026
