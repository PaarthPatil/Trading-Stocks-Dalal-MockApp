/**
 * Socket.io Client Service
 * Handles real-time communication with backend
 */
import { io } from 'socket.io-client';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

class SocketService {
  constructor() {
    this.socket = null;
    this.listeners = {};
  }

  /**
   * Connect to Socket.io server
   */
  connect(token) {
    if (this.socket?.connected) {
      console.log('Socket already connected');
      return;
    }

    this.socket = io(API_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5
    });

    this.socket.on('connect', () => {
      console.log('✅ Socket connected:', this.socket.id);
    });

    this.socket.on('disconnect', () => {
      console.log('❌ Socket disconnected');
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    // Set up event listeners
    this.setupEventListeners();
  }

  /**
   * Set up socket event listeners
   */
  setupEventListeners() {
    if (!this.socket) return;

    // Stock price updates
    this.socket.on('stock_update', (data) => {
      console.log('📊 Stock update:', data);
      this.notifyListeners('stock_update', data);
    });

    // Trade executions
    this.socket.on('trade_executed', (data) => {
      console.log('💼 Trade executed:', data);
      this.notifyListeners('trade_executed', data);
    });

    // Leaderboard updates
    this.socket.on('leaderboard_update', (data) => {
      console.log('🏆 Leaderboard update:', data);
      this.notifyListeners('leaderboard_update', data);
    });

    // Portfolio updates
    this.socket.on('portfolio_update', (data) => {
      console.log('💰 Portfolio update:', data);
      this.notifyListeners('portfolio_update', data);
    });

    // Market events
    this.socket.on('market_event', (data) => {
      console.log('📢 Market event:', data);
      this.notifyListeners('market_event', data);
    });
  }

  /**
   * Register event listener
   */
  on(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  /**
   * Remove event listener
   */
  off(event, callback) {
    if (!this.listeners[event]) return;
    
    if (callback) {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    } else {
      this.listeners[event] = [];
    }
  }

  /**
   * Notify all listeners for an event
   */
  notifyListeners(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in listener for ${event}:`, error);
        }
      });
    }
  }

  /**
   * Disconnect from server
   */
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.listeners = {};
      console.log('Socket disconnected manually');
    }
  }

  /**
   * Check if connected
   */
  isConnected() {
    return this.socket?.connected || false;
  }
}

// Export singleton instance
export const socketService = new SocketService();
export default socketService;
