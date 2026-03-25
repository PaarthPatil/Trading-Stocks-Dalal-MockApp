# 📡 Stock Simulation Platform - API Documentation

Complete API reference for the Stock Simulation Platform.

**Base URL:** `http://localhost:5000/api`  
**Version:** 1.0.0  
**Authentication:** JWT Bearer Token

---

## 🔐 Authentication

All protected endpoints require a JWT token in the Authorization header.

### Get Token

Login via `/api/auth/login` to receive a token.

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

### Token Expiration

- Default: 7 days
- Auto-logout on expiration
- Refresh by re-login

---

## 📋 Table of Contents

- [Authentication Endpoints](#authentication-endpoints)
- [Stock Endpoints](#stock-endpoints)
- [Trade Endpoints](#trade-endpoints)
- [Portfolio Endpoints](#portfolio-endpoints)
- [Team Endpoints](#team-endpoints)
- [Transaction Endpoints](#transaction-endpoints)
- [Admin Endpoints](#admin-endpoints)
- [Error Responses](#error-responses)
- [Rate Limiting](#rate-limiting)

---

## Authentication Endpoints

### POST /auth/login

Authenticate user and receive JWT token.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "user@example.com",
      "isAdmin": false
    }
  },
  "message": "Login successful"
}
```

**Error (401 Unauthorized):**
```json
{
  "success": false,
  "error": "Invalid credentials"
}
```

---

### POST /auth/signup

Register new user account.

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "teamId": 1
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "teamId": 1,
      "balance": 100000.00,
      "isAdmin": false
    }
  },
  "message": "User created successfully"
}
```

**Error (400 Bad Request):**
```json
{
  "success": false,
  "error": "Email already exists"
}
```

---

## Stock Endpoints

### GET /stocks

Get all available stocks.

**Headers:** None required

**Response (200 OK):**
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
        "initialPrice": 150.00,
        "createdAt": "2026-03-01T00:00:00.000Z",
        "updatedAt": "2026-03-25T10:30:00.000Z"
      },
      {
        "id": 2,
        "name": "Global Bank",
        "symbol": "BANK",
        "currentPrice": 105.25,
        "initialPrice": 100.00,
        "createdAt": "2026-03-01T00:00:00.000Z",
        "updatedAt": "2026-03-25T10:30:00.000Z"
      }
    ],
    "count": 8
  }
}
```

---

### GET /stocks/:id

Get stock by ID.

**Parameters:**
- `id` (integer) - Stock ID

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Tech Corp",
    "symbol": "TECH",
    "currentPrice": 175.50,
    "initialPrice": 150.00,
    "createdAt": "2026-03-01T00:00:00.000Z",
    "updatedAt": "2026-03-25T10:30:00.000Z"
  }
}
```

**Error (404 Not Found):**
```json
{
  "success": false,
  "error": "Stock not found"
}
```

---

## Trade Endpoints

### POST /trades/buy

Execute a buy order.

**Authentication:** Required

**Request:**
```json
{
  "stockId": 1,
  "quantity": 10
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "stockId": 1,
    "quantity": 10,
    "price": 175.50,
    "totalCost": 1755.00,
    "newBalance": 98245.00,
    "transactionId": 123
  },
  "message": "Buy order executed successfully"
}
```

**Errors:**

(400 Bad Request)
```json
{
  "success": false,
  "error": "Insufficient balance"
}
```

(400 Bad Request)
```json
{
  "success": false,
  "error": "Quantity must be a positive integer"
}
```

---

### POST /trades/sell

Execute a sell order.

**Authentication:** Required

**Request:**
```json
{
  "stockId": 1,
  "quantity": 5
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "stockId": 1,
    "quantity": 5,
    "price": 175.50,
    "revenue": 877.50,
    "newBalance": 99122.50,
    "transactionId": 124
  },
  "message": "Sell order executed successfully"
}
```

**Errors:**

(400 Bad Request)
```json
{
  "success": false,
  "error": "Insufficient holdings"
}
```

---

## Portfolio Endpoints

### GET /portfolio/user/:userId

Get user portfolio with holdings and P/L.

**Authentication:** Required

**Parameters:**
- `userId` (integer) - User ID

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "userId": 1,
    "balance": 98245.00,
    "holdings": [
      {
        "stockId": 1,
        "stockName": "Tech Corp",
        "symbol": "TECH",
        "quantity": 10,
        "averageCost": 170.00,
        "currentPrice": 175.50,
        "currentValue": 1755.00,
        "costBasis": 1700.00,
        "gainLoss": 55.00,
        "gainLossPercent": 3.24
      }
    ],
    "totalValue": 1755.00,
    "totalGainLoss": 55.00,
    "totalGainLossPercent": 3.24
  }
}
```

---

## Team Endpoints

### GET /teams

Get all teams with portfolios.

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "teams": [
      {
        "id": 1,
        "teamName": "Bulls",
        "memberCount": 5,
        "totalPortfolioValue": 550000.00,
        "averageReturn": 12.5,
        "createdAt": "2026-03-01T00:00:00.000Z"
      }
    ],
    "count": 3
  }
}
```

---

### POST /teams/join

Join a team.

**Authentication:** Required

**Request:**
```json
{
  "teamId": 1
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "userId": 1,
    "teamId": 1,
    "teamName": "Bulls"
  },
  "message": "Successfully joined team"
}
```

---

## Transaction Endpoints

### GET /transactions/user/:userId

Get user's transaction history.

**Authentication:** Required

**Parameters:**
- `userId` (integer) - User ID

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "transactions": [
      {
        "id": 123,
        "userId": 1,
        "stockId": 1,
        "stockSymbol": "TECH",
        "type": "BUY",
        "quantity": 10,
        "price": 175.50,
        "totalAmount": 1755.00,
        "timestamp": "2026-03-25T10:35:00.000Z"
      },
      {
        "id": 124,
        "userId": 1,
        "stockId": 1,
        "stockSymbol": "TECH",
        "type": "SELL",
        "quantity": 5,
        "price": 175.50,
        "totalAmount": 877.50,
        "timestamp": "2026-03-25T11:20:00.000Z"
      }
    ],
    "count": 2
  }
}
```

---

## Admin Endpoints

All admin endpoints require authentication with `isAdmin: true`.

### GET /admin/users

Get all users.

**Authentication:** Admin required

**Response (200 OK):**
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
        "balance": 98245.00,
        "isAdmin": false,
        "createdAt": "2026-03-20T00:00:00.000Z"
      }
    ],
    "count": 10
  }
}
```

---

### GET /admin/transactions

Get all transactions (system-wide).

**Authentication:** Admin required

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "transactions": [
      {
        "id": 123,
        "userName": "John Doe",
        "userEmail": "john@example.com",
        "stockId": 1,
        "stockSymbol": "TECH",
        "type": "BUY",
        "quantity": 10,
        "price": 175.50,
        "totalAmount": 1755.00,
        "timestamp": "2026-03-25T10:35:00.000Z"
      }
    ],
    "count": 50
  }
}
```

---

### GET /admin/stocks

Get all stocks for management.

**Authentication:** Admin required

**Response (200 OK):**
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
        "initialPrice": 150.00,
        "createdAt": "2026-03-01T00:00:00.000Z",
        "updatedAt": "2026-03-25T10:30:00.000Z"
      }
    ],
    "count": 8
  }
}
```

---

### PUT /admin/stocks/:id/price

Update stock price manually.

**Authentication:** Admin required

**Parameters:**
- `id` (integer) - Stock ID

**Request:**
```json
{
  "price": 180.00
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "stock": {
      "id": 1,
      "name": "Tech Corp",
      "symbol": "TECH",
      "currentPrice": 180.00,
      "initialPrice": 150.00
    }
  },
  "message": "Stock price updated successfully"
}
```

**Error (400 Bad Request):**
```json
{
  "success": false,
  "error": "Valid price is required"
}
```

---

### POST /admin/freeze-trading

Freeze or unfreeze all trading.

**Authentication:** Admin required

**Request:**
```json
{
  "frozen": true
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "tradingFrozen": true
  },
  "message": "Trading frozen successfully"
}
```

---

### POST /admin/market-event

Trigger market-wide event.

**Authentication:** Admin required

**Request:**
```json
{
  "eventType": "bull_market",
  "impactPercent": 10,
  "affectedStocks": [
    {"id": 1},
    {"id": 2},
    {"id": 3}
  ]
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Market event \"bull_market\" triggered successfully",
  "data": {
    "eventType": "bull_market",
    "impactPercent": 10,
    "affectedStocksCount": 3
  }
}
```

**Preset Event Types:**
- `bull_market` - +10% market rally
- `bear_market` - -10% market decline
- `market_crash` - -25% crash
- `market_boom` - +25% boom
- `custom` - Use custom impactPercent

---

### GET /admin/actions

Get admin action logs.

**Authentication:** Admin required

**Query Parameters:**
- `limit` (optional, default: 100) - Number of actions to return

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "actions": [
      {
        "id": 1,
        "adminId": 1,
        "adminName": "Admin User",
        "actionType": "PRICE_UPDATE",
        "description": "Updated stock Tech Corp price to $180.00",
        "metadata": {
          "stockId": 1,
          "price": 180.00
        },
        "timestamp": "2026-03-25T10:30:00.000Z"
      },
      {
        "id": 2,
        "adminId": 1,
        "adminName": "Admin User",
        "actionType": "MARKET_EVENT",
        "description": "Triggered bull_market market event",
        "metadata": {
          "eventType": "bull_market",
          "impactPercent": 10,
          "affectedStocks": [1, 2, 3]
        },
        "timestamp": "2026-03-25T11:00:00.000Z"
      }
    ],
    "count": 2
  }
}
```

---

### GET /admin/leaderboard

Get leaderboard rankings.

**Authentication:** Admin required

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "leaderboard": [
      {
        "rank": 1,
        "userId": 5,
        "userName": "Jane Smith",
        "email": "jane@example.com",
        "portfolioValue": 125000.00,
        "return": 25.00,
        "returnPercent": 25.00
      },
      {
        "rank": 2,
        "userId": 3,
        "userName": "Bob Johnson",
        "email": "bob@example.com",
        "portfolioValue": 118000.00,
        "return": 18.00,
        "returnPercent": 18.00
      }
    ],
    "count": 10
  }
}
```

---

## Error Responses

### Standard Error Format

All errors follow this format:

```json
{
  "success": false,
  "error": "Error message here"
}
```

### HTTP Status Codes

| Code | Meaning | Example |
|------|---------|---------|
| 200 | Success | Successful operation |
| 201 | Created | User created successfully |
| 400 | Bad Request | Invalid input, validation failed |
| 401 | Unauthorized | Missing or invalid token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Server Error | Internal server error |

### Common Errors

**401 Unauthorized**
```json
{
  "success": false,
  "error": "Access denied. No token provided."
}
```

**403 Forbidden**
```json
{
  "success": false,
  "error": "Admin access required"
}
```

**404 Not Found**
```json
{
  "success": false,
  "error": "User not found"
}
```

**429 Too Many Requests**
```json
{
  "success": false,
  "error": "Too many requests from this IP, please try again later."
}
```

---

## Rate Limiting

### Limits

- **Window:** 15 minutes
- **Max Requests:** 100 per IP
- **Reset:** Automatic after window expires

### Headers

Responses include rate limit headers:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1679753400
```

### Exceeded Limit

**Response (429 Too Many Requests):**
```json
{
  "success": false,
  "error": "Too many requests from this IP, please try again later."
}
```

---

## Real-Time Events (Socket.io)

### Connection

```javascript
const socket = io('http://localhost:5000', {
  auth: {
    token: 'YOUR_JWT_TOKEN'
  }
});
```

### Events

#### stock_update

Broadcast when stock prices change.

```javascript
socket.on('stock_update', (data) => {
  console.log('Price updated:', data);
  // data: { id, symbol, name, currentPrice, previousPrice, priceChange, updatedAt }
});
```

#### trade_executed

Sent when trade executes.

```javascript
socket.on('trade_executed', (data) => {
  console.log('Trade executed:', data);
  // data: { id, userId, stockId, stockSymbol, type, quantity, price, totalAmount, timestamp }
});
```

#### market_event

Broadcast when admin triggers event.

```javascript
socket.on('market_event', (data) => {
  console.log('Market event:', data);
  // data: { eventType, impactPercent, affectedStocksCount, timestamp }
});
```

#### portfolio_update

Sent to user when portfolio changes.

```javascript
socket.on('portfolio_update', (data) => {
  console.log('Portfolio updated:', data);
});
```

#### leaderboard_update

Broadcast when rankings change.

```javascript
socket.on('leaderboard_update', (data) => {
  console.log('Leaderboard updated:', data);
});
```

---

## Testing

### Using cURL

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@stocksim.com","password":"password123"}'
```

**Get Stocks:**
```bash
curl http://localhost:5000/api/stocks
```

**Buy Stock (with token):**
```bash
curl -X POST http://localhost:5000/api/trades/buy \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"stockId":1,"quantity":10}'
```

### Using Postman

1. Create new request
2. Set method and URL
3. Add headers (Authorization)
4. Add body (JSON)
5. Send

### Using JavaScript (Axios)

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

// Get stocks
const response = await api.get('/stocks');
console.log(response.data);
```

---

## Support

For more information:
- [Main README](../README.md)
- [Backend README](../backend/README.md)
- [Frontend README](../frontend/README.md)

---

**API Version:** 1.0.0  
**Last Updated:** March 25, 2026
