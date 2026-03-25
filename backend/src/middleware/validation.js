/**
 * Validation Middleware
 * Helper functions for request validation
 */

/**
 * Validate required fields in request body
 * @param {array} requiredFields - Array of required field names
 */
function validateRequiredFields(requiredFields) {
  return (req, res, next) => {
    const missingFields = [];
    
    for (const field of requiredFields) {
      if (!req.body[field] && req.body[field] !== 0) {
        missingFields.push(field);
      }
    }
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        error: `Missing required fields: ${missingFields.join(', ')}`
      });
    }
    
    next();
  };
}

/**
 * Validate numeric fields
 * @param {array} fields - Array of field names to validate as numbers
 */
function validateNumericFields(fields) {
  return (req, res, next) => {
    const invalidFields = [];
    
    for (const field of fields) {
      if (req.body[field] !== undefined && typeof req.body[field] !== 'number') {
        invalidFields.push(field);
      }
    }
    
    if (invalidFields.length > 0) {
      return res.status(400).json({
        success: false,
        error: `Invalid number fields: ${invalidFields.join(', ')}`
      });
    }
    
    next();
  };
}

/**
 * Validate positive integer
 * @param {string} fieldName - Field name to validate
 */
function validatePositiveInteger(fieldName) {
  return (req, res, next) => {
    const value = req.body[fieldName];
    
    if (value === undefined) {
      return res.status(400).json({
        success: false,
        error: `${fieldName} is required`
      });
    }
    
    if (!Number.isInteger(value) || value <= 0) {
      return res.status(400).json({
        success: false,
        error: `${fieldName} must be a positive integer`
      });
    }
    
    next();
  };
}

module.exports = {
  validateRequiredFields,
  validateNumericFields,
  validatePositiveInteger
};
