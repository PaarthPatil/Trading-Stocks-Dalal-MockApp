/**
 * Application Configuration
 */
require('dotenv').config();

module.exports = {
  // Server configuration
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Database configuration
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'stock_simulation',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  },
  
  // JWT configuration
  jwt: {
    secret: process.env.JWT_SECRET || 'default_secret_change_in_production',
    expire: process.env.JWT_EXPIRE || '7d'
  },
  
  // Trading configuration
  trading: {
    priceImpactFactor: parseFloat(process.env.PRICE_IMPACT_FACTOR) || 0.01,
    initialUserBalance: parseFloat(process.env.INITIAL_USER_BALANCE) || 100000
  }
};
