# 🗄️ DATABASE DESIGN PROMPT

Design a PostgreSQL database schema for a stock trading simulation.

## TABLES REQUIRED:

### Users

* id
* name
* email
* password_hash
* team_id
* balance

### Teams

* id
* team_name

### Stocks

* id
* name
* current_price

### Transactions

* id
* user_id
* stock_id
* type (buy/sell)
* quantity
* price
* timestamp

### Holdings

* id
* user_id
* stock_id
* quantity

## REQUIREMENTS:

* Use proper foreign keys
* Add indexes for performance
* Ensure normalization

## OUTPUT:

* Full SQL schema
* CREATE TABLE statements
* Constraints included
