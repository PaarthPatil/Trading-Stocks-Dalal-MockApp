/**
 * Socket.io Server Configuration
 * Handles real-time communication between clients
 */

const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const config = require('./config/app');

let io = null;

/**
 * Initialize Socket.io server
 */
function initializeSocketIO(server) {
  io = new Server(server, {
    cors: {
      origin: config.corsOrigin || 'http://localhost:5173',
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  // Middleware for authentication
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    
    if (!token) {
      return next(new Error('Authentication required'));
    }

    try {
      const decoded = jwt.verify(token, config.jwtSecret);
      socket.userId = decoded.userId;
      socket.userEmail = decoded.email;
      socket.isAdmin = decoded.isAdmin;
      next();
    } catch (err) {
      next(new Error('Invalid token'));
    }
  });

  // Connection handler
  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.userEmail} (${socket.id})`);

    // Join user-specific room
    socket.join(`user:${socket.userId}`);

    // Join admin room if admin
    if (socket.isAdmin) {
      socket.join('admins');
    }

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.userEmail} (${socket.id})`);
    });

    // Handle errors
    socket.on('error', (error) => {
      console.error(`Socket error for user ${socket.userEmail}:`, error);
    });
  });

  return io;
}

/**
 * Get Socket.io instance
 */
function getIO() {
  if (!io) {
    throw new Error('Socket.io not initialized. Call initializeSocketIO first.');
  }
  return io;
}

/**
 * Emit stock price update to all clients
 */
function emitStockUpdate(stockData) {
  if (io) {
    io.emit('stock_update', stockData);
  }
}

/**
 * Emit trade execution event
 * - To user who made the trade (private)
 * - To all admins (for monitoring)
 */
function emitTradeExecuted(tradeData, userId) {
  if (io) {
    // Send to the user who made the trade
    io.to(`user:${userId}`).emit('trade_executed', tradeData);
    
    // Send to all admins for monitoring
    io.to('admins').emit('trade_executed', {
      ...tradeData,
      _adminView: true
    });
  }
}

/**
 * Emit leaderboard update to all clients
 */
function emitLeaderboardUpdate(leaderboardData) {
  if (io) {
    io.emit('leaderboard_update', leaderboardData);
  }
}

/**
 * Emit portfolio update to specific user
 */
function emitPortfolioUpdate(userId, portfolioData) {
  if (io) {
    io.to(`user:${userId}`).emit('portfolio_update', portfolioData);
  }
}

/**
 * Emit market event to all clients
 */
function emitMarketEvent(eventData) {
  if (io) {
    io.emit('market_event', eventData);
  }
}

module.exports = {
  initializeSocketIO,
  getIO,
  emitStockUpdate,
  emitTradeExecuted,
  emitLeaderboardUpdate,
  emitPortfolioUpdate,
  emitMarketEvent
};
