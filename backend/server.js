/**
 * Server Entry Point
 * Stock Simulation Platform Backend API
 */
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const http = require('http');
const config = require('./src/config/app');
const db = require('./src/config/database');
const { initializeSocketIO } = require('./src/config/socket');

// Import routes
const authRoutes = require('./src/routes/auth');
const stockRoutes = require('./src/routes/stocks');
const tradeRoutes = require('./src/routes/trades');
const teamRoutes = require('./src/routes/teams');
const transactionRoutes = require('./src/routes/transactions');
const portfolioRoutes = require('./src/routes/portfolio');
const adminRoutes = require('./src/routes/admin');

// Initialize Express app
const app = express();

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
initializeSocketIO(server);

// Security middleware
app.use(helmet()); // Set security HTTP headers
app.use(cors()); // Enable CORS

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    error: 'Too many requests from this IP, please try again later.'
  }
});

app.use('/api', limiter);

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware (development only)
if (config.nodeEnv === 'development') {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
  });
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: config.nodeEnv
    }
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/stocks', stockRoutes);
app.use('/api/trades', tradeRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/admin', adminRoutes);

// Root endpoint
app.get('/api', (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      name: 'Stock Simulation Platform API',
      version: '1.0.0',
      endpoints: {
        auth: '/api/auth',
        stocks: '/api/stocks',
        trades: '/api/trades',
        teams: '/api/teams',
        transactions: '/api/transactions',
        portfolio: '/api/portfolio',
        admin: '/api/admin'
      }
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found'
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  res.status(err.status || 500).json({
    success: false,
    error: config.nodeEnv === 'development' ? err.message : 'Internal server error'
  });
});

// Start server
async function startServer() {
  try {
    // Initialize database connection
    await db.initializePool();
    
    // Start listening
    server.listen(config.port, () => {
      console.log(`
╔════════════════════════════════════════════════╗
║   🚀 Stock Simulation Platform API             ║
║   Server running on port ${config.port}          ║
║   Environment: ${config.nodeEnv}                        ║
║   ⚡ Real-time: Socket.io enabled               ║
║                                                ║
║   Endpoints:                                   ║
║   - Auth: /api/auth                            ║
║   - Stocks: /api/stocks                        ║
║   - Trades: /api/trades                        ║
║   - Teams: /api/teams                          ║
║   - Transactions: /api/transactions            ║
║   - Portfolio: /api/portfolio                  ║
║   - Admin: /api/admin                          ║
╚════════════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled rejection:', err);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err);
  process.exit(1);
});

// Start the server
startServer();

module.exports = app;
