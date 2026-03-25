/**
 * Stock Controller
 * Handles /stocks endpoints
 */
const stockService = require('../services/stockService');

/**
 * GET /stocks
 * Get all stocks
 */
async function getAllStocks(req, res) {
  try {
    const stocks = await stockService.getAllStocks();
    
    res.status(200).json({
      success: true,
      data: {
        stocks,
        count: stocks.length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}

/**
 * GET /stocks/:id
 * Get stock by ID
 */
async function getStockById(req, res) {
  try {
    const stockId = parseInt(req.params.id);
    
    if (isNaN(stockId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid stock ID'
      });
    }
    
    const stock = await stockService.getStockById(stockId);
    
    res.status(200).json({
      success: true,
      data: { stock }
    });
  } catch (error) {
    if (error.message === 'Stock not found') {
      return res.status(404).json({
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
 * POST /stocks
 * Create a new stock (admin only)
 */
async function createStock(req, res) {
  try {
    const { name, symbol, initialPrice } = req.body;
    
    if (!name || !symbol || !initialPrice) {
      return res.status(400).json({
        success: false,
        error: 'Name, symbol, and initial price are required'
      });
    }
    
    const stock = await stockService.createStock({ name, symbol, initialPrice });
    
    res.status(201).json({
      success: true,
      data: { stock },
      message: 'Stock created successfully'
    });
  } catch (error) {
    if (error.message.includes('required') || error.message.includes('must be')) {
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
 * PUT /stocks/:id/price
 * Update stock price manually (admin only)
 */
async function updateStockPrice(req, res) {
  try {
    const stockId = parseInt(req.params.id);
    const { price } = req.body;
    
    if (isNaN(stockId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid stock ID'
      });
    }
    
    if (!price || typeof price !== 'number' || price <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Valid price is required'
      });
    }
    
    const stock = await stockService.updateStockPriceManual(stockId, price);
    
    res.status(200).json({
      success: true,
      data: { stock },
      message: 'Stock price updated successfully'
    });
  } catch (error) {
    if (error.message === 'Stock not found') {
      return res.status(404).json({
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
  getAllStocks,
  getStockById,
  createStock,
  updateStockPrice
};
