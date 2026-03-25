/**
 * Core Trading Engine
 * Pure functions for stock trading calculations
 * NO database or API calls - pure business logic only
 */

/**
 * Create a new stock object
 * @param {string} name - Stock name
 * @param {number} initialPrice - Initial price
 * @returns {object} Stock object
 */
function createStock(name, symbol, initialPrice) {
  if (!name || typeof name !== 'string') {
    throw new Error('Stock name is required and must be a string');
  }
  if (!symbol || typeof symbol !== 'string') {
    throw new Error('Stock symbol is required and must be a string');
  }
  if (typeof initialPrice !== 'number' || initialPrice <= 0) {
    throw new Error('Initial price must be a positive number');
  }

  return {
    name,
    symbol,
    currentPrice: initialPrice,
    initialPrice,
    createdAt: new Date()
  };
}

/**
 * Update stock price based on trading activity
 * Formula: price = price + (buy_volume - sell_volume) * factor + randomness
 * @param {number} currentPrice - Current stock price
 * @param {number} buyVolume - Total buy volume
 * @param {number} sellVolume - Total sell volume
 * @param {number} factor - Price impact factor (default: 0.01)
 * @returns {number} New stock price
 */
function updatePrice(currentPrice, buyVolume, sellVolume, factor = 0.01) {
  if (typeof currentPrice !== 'number' || currentPrice <= 0) {
    throw new Error('Current price must be a positive number');
  }
  if (typeof buyVolume !== 'number' || buyVolume < 0) {
    throw new Error('Buy volume must be a non-negative number');
  }
  if (typeof sellVolume !== 'number' || sellVolume < 0) {
    throw new Error('Sell volume must be a non-negative number');
  }

  const netVolume = buyVolume - sellVolume;
  const priceImpact = netVolume * factor;
  
  // Add randomness (±5% of current price)
  const randomNoise = (Math.random() - 0.5) * 0.05 * currentPrice;
  
  let newPrice = currentPrice + priceImpact + randomNoise;
  
  // Ensure price doesn't go below minimum threshold
  newPrice = Math.max(newPrice, 1.00);
  
  // Round to 2 decimal places
  return Math.round(newPrice * 100) / 100;
}

/**
 * Process a buy order
 * @param {number} balance - User's current balance
 * @param {number} price - Stock price
 * @param {number} quantity - Quantity to buy
 * @returns {object} Result with success status, new balance, and cost
 */
function processBuy(balance, price, quantity) {
  if (typeof balance !== 'number' || balance < 0) {
    throw new Error('Balance must be a non-negative number');
  }
  if (typeof price !== 'number' || price <= 0) {
    throw new Error('Price must be a positive number');
  }
  if (typeof quantity !== 'number' || quantity <= 0 || !Number.isInteger(quantity)) {
    throw new Error('Quantity must be a positive integer');
  }

  const totalCost = price * quantity;

  if (totalCost > balance) {
    return {
      success: false,
      error: 'Insufficient balance',
      requiredAmount: totalCost,
      availableBalance: balance
    };
  }

  const newBalance = balance - totalCost;

  return {
    success: true,
    newBalance: Math.round(newBalance * 100) / 100,
    cost: Math.round(totalCost * 100) / 100,
    quantity,
    price
  };
}

/**
 * Process a sell order
 * @param {number} holdings - User's current holdings of this stock
 * @param {number} price - Stock price
 * @param {number} quantity - Quantity to sell
 * @returns {object} Result with success status and revenue
 */
function processSell(holdings, price, quantity) {
  if (typeof holdings !== 'number' || holdings < 0) {
    throw new Error('Holdings must be a non-negative number');
  }
  if (typeof price !== 'number' || price <= 0) {
    throw new Error('Price must be a positive number');
  }
  if (typeof quantity !== 'number' || quantity <= 0 || !Number.isInteger(quantity)) {
    throw new Error('Quantity must be a positive integer');
  }

  if (quantity > holdings) {
    return {
      success: false,
      error: 'Insufficient holdings',
      requiredQuantity: quantity,
      availableHoldings: holdings
    };
  }

  const revenue = price * quantity;
  const newHoldings = holdings - quantity;

  return {
    success: true,
    revenue: Math.round(revenue * 100) / 100,
    newHoldings,
    quantity,
    price
  };
}

/**
 * Calculate total portfolio value
 * @param {array} holdings - Array of holdings with quantity and stock info
 * @param {object} currentPrices - Map of stock IDs to current prices
 * @returns {object} Portfolio breakdown and total value
 */
function calculatePortfolioValue(holdings, currentPrices) {
  if (!Array.isArray(holdings)) {
    throw new Error('Holdings must be an array');
  }
  if (typeof currentPrices !== 'object' || currentPrices === null) {
    throw new Error('Current prices must be an object');
  }

  let totalValue = 0;
  const breakdown = [];

  for (const holding of holdings) {
    const { stockId, quantity, averageCost } = holding;
    const currentPrice = currentPrices[stockId] || 0;
    const currentValue = quantity * currentPrice;
    const costBasis = quantity * averageCost;
    const gainLoss = currentValue - costBasis;
    const gainLossPercent = costBasis > 0 ? ((gainLoss / costBasis) * 100) : 0;

    breakdown.push({
      stockId,
      quantity,
      averageCost,
      currentPrice,
      currentValue,
      costBasis,
      gainLoss: Math.round(gainLoss * 100) / 100,
      gainLossPercent: Math.round(gainLossPercent * 100) / 100
    });

    totalValue += currentValue;
  }

  return {
    totalValue: Math.round(totalValue * 100) / 100,
    breakdown,
    calculatedAt: new Date()
  };
}

/**
 * Validate trade parameters
 * @param {string} type - Trade type ('BUY' or 'SELL')
 * @param {number} quantity - Trade quantity
 * @returns {object} Validation result
 */
function validateTrade(type, quantity) {
  const errors = [];

  if (!type || !['BUY', 'SELL'].includes(type)) {
    errors.push('Invalid trade type. Must be BUY or SELL');
  }

  if (typeof quantity !== 'number' || quantity <= 0 || !Number.isInteger(quantity)) {
    errors.push('Quantity must be a positive integer');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

module.exports = {
  createStock,
  updatePrice,
  processBuy,
  processSell,
  calculatePortfolioValue,
  validateTrade
};
