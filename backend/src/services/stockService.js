/**
 * Stock Service
 * Business logic for stock operations
 */
const Stock = require('../models/Stock');
const tradingEngine = require('../core/tradingEngine');
const config = require('../config/app');
const { emitStockUpdate, emitMarketEvent } = require('../config/socket');

/**
 * Get all stocks
 * @returns {Promise<array>} Array of stocks
 */
async function getAllStocks() {
  const stocks = await Stock.getAllStocks();
  
  return stocks.map(stock => ({
    id: stock.id,
    name: stock.name,
    symbol: stock.symbol,
    currentPrice: parseFloat(stock.current_price),
    initialPrice: parseFloat(stock.initial_price),
    createdAt: stock.created_at,
    updatedAt: stock.updated_at
  }));
}

/**
 * Get stock by ID
 * @param {number} stockId - Stock ID
 * @returns {Promise<object>} Stock data
 */
async function getStockById(stockId) {
  const stock = await Stock.getStockById(stockId);
  
  if (!stock) {
    throw new Error('Stock not found');
  }
  
  return {
    id: stock.id,
    name: stock.name,
    symbol: stock.symbol,
    currentPrice: parseFloat(stock.current_price),
    initialPrice: parseFloat(stock.initial_price),
    createdAt: stock.created_at,
    updatedAt: stock.updated_at
  };
}

/**
 * Create a new stock
 * @param {object} stockData - Stock data
 * @returns {Promise<object>} Created stock
 */
async function createStock(stockData) {
  const { name, symbol, initialPrice } = stockData;
  
  // Validate using core logic
  const stock = tradingEngine.createStock(name, symbol, initialPrice);
  
  // Create in database
  const createdStock = await Stock.createStock({
    name,
    symbol,
    initialPrice
  });
  
  return {
    id: createdStock.id,
    name: createdStock.name,
    symbol: createdStock.symbol,
    currentPrice: parseFloat(createdStock.current_price),
    initialPrice: parseFloat(createdStock.initial_price),
    createdAt: createdStock.created_at,
    updatedAt: createdStock.updated_at
  };
}

/**
 * Update stock price manually (admin only)
 * @param {number} stockId - Stock ID
 * @param {number} newPrice - New price
 * @returns {Promise<object>} Updated stock
 */
async function updateStockPriceManual(stockId, newPrice) {
  if (typeof newPrice !== 'number' || newPrice <= 0) {
    throw new Error('New price must be a positive number');
  }
  
  const stock = await Stock.getStockById(stockId);
  if (!stock) {
    throw new Error('Stock not found');
  }
  
  const updatedStock = await Stock.updateStockPrice(stockId, newPrice);
  
  // Emit real-time update
  const stockData = {
    id: updatedStock.id,
    symbol: updatedStock.symbol,
    name: updatedStock.name,
    currentPrice: parseFloat(updatedStock.current_price),
    previousPrice: parseFloat(stock.current_price),
    priceChange: parseFloat(updatedStock.current_price) - parseFloat(stock.current_price),
    updatedAt: updatedStock.updated_at
  };
  emitStockUpdate(stockData);
  
  return {
    id: updatedStock.id,
    name: updatedStock.name,
    symbol: updatedStock.symbol,
    currentPrice: parseFloat(updatedStock.current_price),
    initialPrice: parseFloat(updatedStock.initial_price),
    updatedAt: updatedStock.updated_at
  };
}

/**
 * Update stock price based on trading activity
 * @param {number} stockId - Stock ID
 * @param {number} buyVolume - Buy volume
 * @param {number} sellVolume - Sell volume
 * @returns {Promise<object>} Updated stock with new price
 */
async function updateStockPriceFromTrading(stockId, buyVolume, sellVolume) {
  const stock = await Stock.getStockById(stockId);
  
  if (!stock) {
    throw new Error('Stock not found');
  }
  
  // Calculate new price using core logic
  const factor = config.trading.priceImpactFactor;
  const newPrice = tradingEngine.updatePrice(
    parseFloat(stock.current_price),
    buyVolume,
    sellVolume,
    factor
  );
  
  // Update in database
  const updatedStock = await Stock.updateStockPrice(stockId, newPrice);
  
  // Emit real-time update
  const stockData = {
    id: updatedStock.id,
    symbol: updatedStock.symbol,
    name: updatedStock.name,
    currentPrice: parseFloat(updatedStock.current_price),
    previousPrice: parseFloat(stock.current_price),
    priceChange: parseFloat(updatedStock.current_price) - parseFloat(stock.current_price),
    updatedAt: updatedStock.updated_at
  };
  emitStockUpdate(stockData);
  
  return {
    id: updatedStock.id,
    name: updatedStock.name,
    symbol: updatedStock.symbol,
    currentPrice: parseFloat(updatedStock.current_price),
    previousPrice: parseFloat(stock.current_price),
    priceChange: parseFloat(updatedStock.current_price) - parseFloat(stock.current_price),
    updatedAt: updatedStock.updated_at
  };
}

module.exports = {
  getAllStocks,
  getStockById,
  createStock,
  updateStockPriceManual,
  updateStockPriceFromTrading
};
