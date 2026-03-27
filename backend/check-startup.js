/**
 * Startup Validation Script
 * Checks all requirements before starting the server
 */

const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

// Colors
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
  cyan: '\x1b[36m'
};

console.log(`\n${colors.cyan}🔍 Checking startup requirements...${colors.reset}\n`);

async function validate() {
  const errors = [];
  const warnings = [];

  // Check 1: .env file exists
  console.log(`${colors.blue}[1/5]${colors.reset} Checking .env file...`);
  const envPath = path.join(__dirname, '.env');
  if (!fs.existsSync(envPath)) {
    errors.push('.env file not found. Run "npm run setup" first.');
    console.log(`${colors.red}✗ Missing${colors.reset}`);
  } else {
    console.log(`${colors.green}✓ Found${colors.reset}`);
  }

  // Check 2: node_modules installed
  console.log(`${colors.blue}[2/5]${colors.reset} Checking dependencies...`);
  const nodeModulesPath = path.join(__dirname, 'node_modules');
  if (!fs.existsSync(nodeModulesPath)) {
    errors.push('Dependencies not installed. Run "npm install" first.');
    console.log(`${colors.red}✗ Not installed${colors.reset}`);
  } else {
    console.log(`${colors.green}✓ Installed${colors.reset}`);
  }

  // Check 3: Database connection
  console.log(`${colors.blue}[3/5]${colors.reset} Testing database connection...`);
  if (fs.existsSync(envPath)) {
    require('dotenv').config();
    
    try {
      const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT) || 3306,
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || ''
      });

      await connection.ping();
      console.log(`${colors.green}✓ Connected${colors.reset}`);
      
      // Check if database exists
      const [rows] = await connection.query(
        `SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = ?`,
        [process.env.DB_NAME || 'stock_simulation']
      );

      if (rows.length === 0) {
        warnings.push(`Database "${process.env.DB_NAME}" doesn't exist. Run "npm run db:init"`);
        console.log(`${colors.yellow}⚠ Database missing${colors.reset}`);
      } else {
        console.log(`${colors.green}✓ Database exists${colors.reset}`);
        
        // Check if tables exist
        const [tables] = await connection.query(
          `SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = ?`,
          [process.env.DB_NAME]
        );

        if (tables.length < 5) {
          warnings.push('Database tables missing. Run "npm run db:init"');
          console.log(`${colors.yellow}⚠ Tables missing${colors.reset}`);
        } else {
          console.log(`${colors.green}✓ Tables found (${tables.length})${colors.reset}`);
        }
      }

      await connection.end();
    } catch (error) {
      errors.push(`Database connection failed: ${error.message}`);
      console.log(`${colors.red}✗ Connection failed${colors.reset}`);
    }
  }

  // Check 4: Required files
  console.log(`${colors.blue}[4/5]${colors.reset} Checking required files...`);
  const requiredFiles = [
    'server.js',
    'src/config/app.js',
    'src/config/database.js',
    'src/config/socket.js'
  ];

  let allFilesExist = true;
  for (const file of requiredFiles) {
    const filePath = path.join(__dirname, file);
    if (!fs.existsSync(filePath)) {
      errors.push(`Missing required file: ${file}`);
      allFilesExist = false;
    }
  }

  if (allFilesExist) {
    console.log(`${colors.green}✓ All files present${colors.reset}`);
  } else {
    console.log(`${colors.red}✗ Some files missing${colors.reset}`);
  }

  // Check 5: Port availability
  console.log(`${colors.blue}[5/5]${colors.reset} Checking port availability...`);
  const net = require('net');
  const port = process.env.PORT || 5000;

  const portAvailable = await new Promise((resolve) => {
    const server = net.createServer();
    server.once('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        resolve(false);
      }
    });

    server.once('listening', () => {
      server.close();
      resolve(true);
    });

    server.listen(port);
  });

  if (portAvailable) {
    console.log(`${colors.green}✓ Port ${port} available${colors.reset}`);
  } else {
    errors.push(`Port ${port} is already in use. Change PORT in .env or kill the process.`);
    console.log(`${colors.red}✗ Port in use${colors.reset}`);
  }

  // Summary
  console.log('\n' + '='.repeat(50));
  
  if (errors.length > 0) {
    console.log(`\n${colors.red}❌ ERRORS FOUND:${colors.reset}`);
    errors.forEach((error, i) => {
      console.log(`${colors.red}${i + 1}.${colors.reset} ${error}`);
    });

    console.log(`\n${colors.yellow}Fix these issues before starting the server.${colors.reset}`);
    console.log(`${colors.blue}Run: ${colors.cyan}npm run setup${colors.reset}\n`);
    process.exit(1);
  } else if (warnings.length > 0) {
    console.log(`\n${colors.yellow}⚠️  WARNINGS:${colors.reset}`);
    warnings.forEach((warning, i) => {
      console.log(`${colors.yellow}${i + 1}.${colors.reset} ${warning}`);
    });

    console.log(`\n${colors.green}✅ Server can start, but consider fixing warnings.${colors.reset}`);
    console.log(`${colors.blue}Ready to start: ${colors.cyan}npm run dev${colors.reset}\n`);
  } else {
    console.log(`\n${colors.green}✅ ALL CHECKS PASSED!${colors.reset}`);
    console.log(`${colors.blue}Ready to start: ${colors.cyan}npm run dev${colors.reset}\n`);
  }
}

validate().catch(console.error);
