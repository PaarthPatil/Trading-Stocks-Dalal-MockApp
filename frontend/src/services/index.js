import api from './api';

// Authentication Service
export const authService = {
  signup: async (userData) => {
    const response = await api.post('/auth/signup', userData);
    if (response.data.success) {
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
    }
    return response.data;
  },

  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data.success) {
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
};

// Stocks Service
export const stockService = {
  getAll: async () => {
    const response = await api.get('/stocks');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/stocks/${id}`);
    return response.data;
  },

  create: async (stockData) => {
    const response = await api.post('/stocks', stockData);
    return response.data;
  },

  updatePrice: async (id, price) => {
    const response = await api.put(`/stocks/${id}/price`, { price });
    return response.data;
  },
};

// Trading Service
export const tradeService = {
  buy: async (stockId, quantity) => {
    const response = await api.post('/trades/buy', { stockId, quantity });
    return response.data;
  },

  sell: async (stockId, quantity) => {
    const response = await api.post('/trades/sell', { stockId, quantity });
    return response.data;
  },
};

// Portfolio Service
export const portfolioService = {
  getPortfolio: async () => {
    const response = await api.get('/portfolio');
    return response.data;
  },

  getTransactions: async (limit = 50) => {
    const response = await api.get(`/portfolio/transactions?limit=${limit}`);
    return response.data;
  },

  getLeaderboard: async () => {
    const response = await api.get('/portfolio/leaderboard');
    return response.data;
  },
};

// Team Service
export const teamService = {
  getAll: async () => {
    const response = await api.get('/teams');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/teams/${id}`);
    return response.data;
  },

  create: async (teamName) => {
    const response = await api.post('/teams', { teamName });
    return response.data;
  },
};

// Transaction Service
export const transactionService = {
  getAll: async () => {
    const response = await api.get('/transactions');
    return response.data;
  },

  getRecent: async (limit = 50) => {
    const response = await api.get(`/transactions/recent?limit=${limit}`);
    return response.data;
  },
};

// Admin Service
export const adminService = {
  getUsers: async () => {
    const response = await api.get('/admin/users');
    return response.data;
  },

  getTransactions: async () => {
    const response = await api.get('/admin/transactions');
    return response.data;
  },

  freezeTrading: async (frozen) => {
    const response = await api.post('/admin/freeze-trading', { frozen });
    return response.data;
  },

  getSystemStatus: async () => {
    const response = await api.get('/admin/system-status');
    return response.data;
  },

  getStocks: async () => {
    const response = await api.get('/admin/stocks');
    return response.data;
  },

  updateStockPrice: async (id, price) => {
    const response = await api.put(`/admin/stocks/${id}/price`, { price });
    return response.data;
  },

  triggerMarketEvent: async (eventType, impactPercent, affectedStocks) => {
    const response = await api.post('/admin/market-event', {
      eventType,
      impactPercent,
      affectedStocks
    });
    return response.data;
  },

  getActions: async (limit = 100) => {
    const response = await api.get(`/admin/actions?limit=${limit}`);
    return response.data;
  },
};
