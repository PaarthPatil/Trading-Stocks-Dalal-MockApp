/**
 * Trade Controller
 * Handles /buy and /sell endpoints
 */
const tradeService = require('../services/tradeService');

/**
 * POST /buy
 * Execute a buy order
 */
async function buy(req, res) {
  try {
    const userId = req.user.userId;
    const { stockId, quantity } = req.body;
    
    // Validate inputs
    if (!stockId || quantity === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Stock ID and quantity are required'
      });
    }
    
    const parsedStockId = parseInt(stockId);
    const parsedQuantity = parseInt(quantity);
    
    if (isNaN(parsedStockId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid stock ID'
      });
    }
    
    if (!Number.isInteger(parsedQuantity) || parsedQuantity <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Quantity must be a positive integer'
      });
    }
    
    // Check if trading is frozen
    const isFrozen = await tradeService.isTradingFrozen();
    if (isFrozen) {
      return res.status(503).json({
        success: false,
        error: 'Trading is currently frozen'
      });
    }
    
    // Execute buy order
    const result = await tradeService.executeBuy(userId, parsedStockId, parsedQuantity);
    
    res.status(200).json({
      success: true,
      data: result.data,
      message: result.message
    });
  } catch (error) {
    if (error.message.includes('not found')) {
      return res.status(404).json({
        success: false,
        error: error.message
      });
    }
    
    if (error.message.includes('Insufficient') || 
        error.message.includes('must be') || 
        error.message.includes('required')) {
      return res.status(400).json({
        success: false,
        error: error.message
      });
    }
    
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}

/**
 * POST /sell
 * Execute a sell order
 */
async function sell(req, res) {
  try {
    const userId = req.user.userId;
    const { stockId, quantity } = req.body;
    
    // Validate inputs
    if (!stockId || quantity === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Stock ID and quantity are required'
      });
    }
    
    const parsedStockId = parseInt(stockId);
    const parsedQuantity = parseInt(quantity);
    
    if (isNaN(parsedStockId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid stock ID'
      });
    }
    
    if (!Number.isInteger(parsedQuantity) || parsedQuantity <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Quantity must be a positive integer'
      });
    }
    
    // Check if trading is frozen
    const isFrozen = await tradeService.isTradingFrozen();
    if (isFrozen) {
      return res.status(503).json({
        success: false,
        error: 'Trading is currently frozen'
      });
    }
    
    // Execute sell order
    const result = await tradeService.executeSell(userId, parsedStockId, parsedQuantity);
    
    res.status(200).json({
      success: true,
      data: result.data,
      message: result.message
    });
  } catch (error) {
    if (error.message.includes('not found')) {
      return res.status(404).json({
        success: false,
        error: error.message
      });
    }
    
    if (error.message.includes('Insufficient') || 
        error.message.includes('must be') || 
        error.message.includes('required')) {
      return res.status(400).json({
        success: false,
        error: error.message
      });
    }
    
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}

module.exports = {
  buy,
  sell
};
