/**
 * Authentication Service
 * Handles user registration, login, and token generation
 */
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/app');
const User = require('../models/User');

/**
 * Register a new user
 * @param {object} userData - User registration data
 * @returns {Promise<object>} Created user with token
 */
async function signup(userData) {
  const { name, email, password, teamId } = userData;

  // Validate required fields
  if (!name || !email || !password) {
    throw new Error('Name, email, and password are required');
  }

  // Check if user already exists
  const existingUser = await User.getUserByEmail(email);
  if (existingUser) {
    throw new Error('Email already registered');
  }

  // Hash password
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  // Create user with initial balance
  const user = await User.createUser({
    name,
    email,
    passwordHash,
    teamId: teamId || null,
    balance: config.trading.initialUserBalance
  });

  // Generate JWT token
  const token = generateToken(user);

  return {
    user: formatUserResponse(user),
    token
  };
}

/**
 * Login user
 * @param {object} credentials - Login credentials
 * @returns {Promise<object>} User with token
 */
async function login(credentials) {
  const { email, password } = credentials;

  // Validate required fields
  if (!email || !password) {
    throw new Error('Email and password are required');
  }

  // Get user by email
  const user = await User.getUserByEmail(email);
  if (!user) {
    throw new Error('Invalid email or password');
  }

  // Verify password
  const isValidPassword = await bcrypt.compare(password, user.password_hash);
  if (!isValidPassword) {
    throw new Error('Invalid email or password');
  }

  // Generate JWT token
  const token = generateToken(user);

  return {
    user: formatUserResponse(user),
    token
  };
}

/**
 * Generate JWT token for user
 * @param {object} user - User object
 * @returns {string} JWT token
 */
function generateToken(user) {
  const payload = {
    userId: user.id,
    email: user.email,
    isAdmin: user.is_admin === 1
  };

  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expire
  });
}

/**
 * Format user object for API response
 * @param {object} user - User object from database
 * @returns {object} Formatted user response
 */
function formatUserResponse(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    teamId: user.team_id,
    teamName: user.team_name || null,
    balance: parseFloat(user.balance),
    isAdmin: user.is_admin === 1,
    createdAt: user.created_at
  };
}

module.exports = {
  signup,
  login,
  generateToken,
  formatUserResponse
};
