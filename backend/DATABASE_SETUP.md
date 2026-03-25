# Database Setup Guide

## 📋 Prerequisites

- MySQL Server installed and running
- MySQL root password or user with CREATE DATABASE privileges

## 🚀 Quick Setup

### Step 1: Configure Database Connection

Edit `backend/.env` file:
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=stock_simulation
```

### Step 2: Create Database Schema

**Option A: Using MySQL CLI**
```bash
mysql -u root -p < database/schema.sql
```

**Option B: Using MySQL Workbench**
1. Open MySQL Workbench
2. Connect to your MySQL server
3. Open `database/schema.sql`
4. Execute the script (Lightning bolt icon)

**Option C: Manual Execution**
```bash
# Login to MySQL
mysql -u root -p

# Copy and paste the contents of schema.sql
```

### Step 3: Verify Database Setup

Login to MySQL and check:
```sql
USE stock_simulation;
SHOW TABLES;
```

You should see:
```
+----------------------------------+
| Tables_in_stock_simulation       |
+----------------------------------+
| admin_actions                    |
| holdings                         |
| stocks                           |
| system_settings                  |
| teams                            |
| transactions                     |
| users                            |
+----------------------------------+
```

## 📊 Database Structure

### Tables Created:

1. **teams** - Team/group information
   - Stores team names
   - Tracks creation date
   
2. **users** - User accounts
   - Authentication credentials
   - Balance tracking
   - Team association
   - Admin flag

3. **stocks** - Available stocks
   - Stock details (name, symbol)
   - Current and initial prices
   - Auto-updated timestamps

4. **holdings** - User stock ownership
   - Tracks quantity per stock
   - Average cost basis
   - Unique user-stock combination

5. **transactions** - Trading history
   - All buy/sell operations
   - Price and quantity tracking
   - Full audit trail

6. **admin_actions** - Admin activity log
   - Tracks admin operations
   - Metadata storage (JSON)

7. **system_settings** - System configuration
   - Trading freeze control
   - Price impact factor
   - Other global settings

## 🔧 Testing Database Connection

### Test Script
Create `test-db.js` in backend folder:
```javascript
const db = require('./src/config/database');

async function testConnection() {
  try {
    await db.initializePool();
    console.log('✅ Database connection successful!');
    
    // Test query
    const result = await db.query('SELECT 1 as test');
    console.log('✅ Query execution successful:', result);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Database test failed:', error.message);
    process.exit(1);
  }
}

testConnection();
```

Run it:
```bash
node test-db.js
```

## 🔐 Database Security

### Best Practices Implemented:
✅ Parameterized queries (SQL injection prevention)  
✅ Connection pooling (resource management)  
✅ Transaction support (ACID compliance)  
✅ Foreign key constraints (data integrity)  
✅ Proper indexing (performance)  
✅ Decimal precision for money (financial accuracy)  

### Recommended Production Steps:
1. Change default MySQL root password
2. Create dedicated database user with limited privileges
3. Enable MySQL SSL connections
4. Set up regular backups
5. Monitor slow queries
6. Use environment variables for credentials (already done)

## 📈 Performance Optimization

### Indexes Created:
- `users.email` - Fast login lookups
- `users.team_id` - Team member queries
- `stocks.symbol` - Symbol searches
- `stocks.name` - Name searches
- `holdings.user_id` - Portfolio queries
- `holdings.stock_id` - Holder queries
- `transactions.user_id` - User transaction history
- `transactions.stock_id` - Stock transaction history
- `transactions.type` - Trade type filtering
- `transactions.timestamp` - Time-based queries

## 🛠️ Maintenance Commands

### Backup Database
```bash
mysqldump -u root -p stock_simulation > backup_$(date +%Y%m%d).sql
```

### Restore Database
```bash
mysql -u root -p stock_simulation < backup_20260325.sql
```

### Reset Database (Development)
```bash
# Drop and recreate
mysql -u root -p -e "DROP DATABASE IF EXISTS stock_simulation;"
mysql -u root -p < database/schema.sql
```

### Check Table Status
```sql
USE stock_simulation;
SHOW TABLE STATUS;
```

### View Sample Data
```sql
-- Check teams
SELECT * FROM teams;

-- Check users
SELECT id, name, email, balance FROM users;

-- Check stocks
SELECT symbol, name, current_price FROM stocks;

-- Recent transactions
SELECT * FROM transactions ORDER BY timestamp DESC LIMIT 10;
```

## 🔍 Troubleshooting

### Error: Access Denied
```
Solution: Check DB_USER and DB_PASSWORD in .env file
```

### Error: Database doesn't exist
```
Solution: Run schema.sql to create database and tables
```

### Error: Connection refused
```
Solution: Ensure MySQL server is running
Windows: Check Services -> MySQL
Mac/Linux: sudo systemctl status mysql
```

### Error: Table already exists
```
Solution: Drop existing tables first or use:
DROP DATABASE IF EXISTS stock_simulation;
```

## 📊 Entity Relationship Diagram

```
┌─────────────┐
│   teams     │
│─────────────│
│ id (PK)     │
│ team_name   │
│ created_at  │
└──────┬──────┘
       │
       │ 1:N
       │
┌──────▼──────┐          ┌──────────────┐
│   users     │          │   stocks     │
│─────────────│          │──────────────│
│ id (PK)     │          │ id (PK)      │
│ name        │          │ name         │
│ email (UK)  │          │ symbol (UK)  │
│ password    │          │ current_price│
│ team_id (FK)│          │ initial_price│
│ balance     │          │ created_at   │
│ is_admin    │          │ updated_at   │
│ created_at  │          └──────┬───────┘
└──────┬──────┘                 │
       │                        │
       │                        │
       ├──────────┬─────────────┘
       │          │
       │ 1:N      │ 1:N
       │          │
┌──────▼──────────▼───────┐
│      holdings           │
│─────────────────────────│
│ id (PK)                 │
│ user_id (FK)            │
│ stock_id (FK)           │
│ quantity                │
│ average_cost            │
│ created_at              │
│ updated_at              │
│ UNIQUE(user_id,stock_id)│
└─────────────────────────┘

┌──────────────────┐
│  transactions    │
│──────────────────│
│ id (PK)          │
│ user_id (FK)     │
│ stock_id (FK)    │
│ type (ENUM)      │
│ quantity         │
│ price            │
│ total_amount     │
│ timestamp        │
└──────────────────┘
```

## 🎯 Next Steps

After database setup:
1. ✅ Install npm dependencies: `npm install`
2. ✅ Start development server: `npm run dev`
3. ✅ Test API endpoints (see API_DOCUMENTATION.md)
4. ✅ Create first admin user
5. ✅ Add initial stocks
6. ✅ Begin testing trading flows

## 📝 Additional Notes

- Database uses MySQL 8.0+ features
- All monetary values use DECIMAL(15,2) for precision
- Timestamps are in UTC
- Character set is utf8mb4 (full Unicode support)
- InnoDB engine for transaction support
- Automatic timestamp updates on row changes

---

**Database Status:** ✅ Ready for Production  
**Schema Version:** 1.0.0  
**Last Updated:** March 25, 2026
