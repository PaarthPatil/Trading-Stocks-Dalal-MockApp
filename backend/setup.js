/**
 * Automated Setup Script
 * Guides users through initial configuration
 */

const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const readline = require('readline');
const crypto = require('crypto');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
  cyan: '\x1b[36m'
};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

console.log(`
${colors.cyan}╔════════════════════════════════════════════════╗
║   🚀 Stock Simulation Platform - Setup Wizard    ║
╚════════════════════════════════════════════════╝${colors.reset}
`);

async function setup() {
  try {
    // Step 1: Check if .env exists
    const envPath = path.join(__dirname, '.env');
    const envExamplePath = path.join(__dirname, '.env.example');
    
    let useExisting = false;
    if (fs.existsSync(envPath)) {
      console.log(`${colors.yellow}⚠️  .env file already exists.${colors.reset}`);
      const answer = await question('Do you want to reconfigure? (y/n): ');
      if (answer.toLowerCase() === 'y') {
        fs.copyFileSync(envPath, path.join(__dirname, '.env.backup'));
        console.log(`${colors.green}✓ Backed up existing .env to .env.backup${colors.reset}`);
      } else {
        useExisting = true;
      }
    }

    if (!useExisting) {
      // Step 2: Get database configuration
      console.log(`\n${colors.blue}📊 Database Configuration${colors.reset}`);
      
      const dbHost = await question('Database Host [localhost]: ') || 'localhost';
      const dbPort = await question('Database Port [3306]: ') || '3306';
      const dbUser = await question('Database User [root]: ') || 'root';
      const dbPassword = await question('Database Password: ', { silent: true }) || '';
      const dbName = await question('Database Name [stock_simulation]: ') || 'stock_simulation';

      // Step 3: Test database connection
      console.log(`\n${colors.yellow}🔍 Testing database connection...${colors.reset}`);
      
      try {
        const connection = await mysql.createConnection({
          host: dbHost,
          port: parseInt(dbPort),
          user: dbUser,
          password: dbPassword
        });

        // Create database if it doesn't exist
        await connection.query(`CREATE DATABASE IF NOT EXISTS ${dbName}`);
        console.log(`${colors.green}✓ Database connection successful!${colors.reset}`);
        
        await connection.end();
      } catch (error) {
        console.log(`${colors.red}✗ Database connection failed: ${error.message}${colors.reset}`);
        console.log(`${colors.yellow}Please check your MySQL credentials and try again.${colors.reset}`);
        rl.close();
        return;
      }

      // Step 4: Generate JWT secret
      const jwtSecret = crypto.randomBytes(32).toString('hex');
      console.log(`\n${colors.green}✓ Generated secure JWT secret${colors.reset}`);

      // Step 5: Create .env file
      const envContent = `# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DB_HOST=${dbHost}
DB_PORT=${dbPort}
DB_USER=${dbUser}
DB_PASSWORD=${dbPassword}
DB_NAME=${dbName}

# JWT Configuration
JWT_SECRET=${jwtSecret}
JWT_EXPIRE=7d

# Trading Configuration
PRICE_IMPACT_FACTOR=0.01
INITIAL_USER_BALANCE=100000

# CORS Origin (frontend URL)
CORS_ORIGIN=http://localhost:5173
`;

      fs.writeFileSync(envPath, envContent);
      console.log(`${colors.green}✓ Created .env file${colors.reset}`);

      // Step 6: Import database schema
      console.log(`\n${colors.blue}📥 Setting up database schema...${colors.reset}`);
      
      const schemaPath = path.join(__dirname, 'database', 'schema.sql');
      if (fs.existsSync(schemaPath)) {
        const schema = fs.readFileSync(schemaPath, 'utf8');
        
        const connection = await mysql.createConnection({
          host: dbHost,
          port: parseInt(dbPort),
          user: dbUser,
          password: dbPassword,
          database: dbName
        });

        // Split and execute statements
        const statements = schema.split(';').filter(s => s.trim().length > 0);
        for (const statement of statements) {
          if (statement.trim()) {
            await connection.query(statement);
          }
        }

        console.log(`${colors.green}✓ Database schema imported successfully!${colors.reset}`);
        await connection.end();
      } else {
        console.log(`${colors.yellow}⚠️  schema.sql not found. Skipping database import.${colors.reset}`);
      }
    }

    // Step 7: Install dependencies check
    console.log(`\n${colors.blue}📦 Checking dependencies...${colors.reset}`);
    const nodeModulesPath = path.join(__dirname, 'node_modules');
    
    if (!fs.existsSync(nodeModulesPath)) {
      console.log(`${colors.yellow}⚠️  Dependencies not installed.${colors.reset}`);
      console.log(`${colors.blue}Run: ${colors.cyan}npm install${colors.reset}`);
      
      const answer = await question('Do you want to install dependencies now? (y/n): ');
      if (answer.toLowerCase() === 'y') {
        const { exec } = require('child_process');
        exec('npm install', (error, stdout, stderr) => {
          if (error) {
            console.log(`${colors.red}Error installing dependencies:${colors.reset}`, error);
          } else {
            console.log(`${colors.green}✓ Dependencies installed!${colors.reset}`);
          }
        });
      }
    } else {
      console.log(`${colors.green}✓ Dependencies already installed${colors.reset}`);
    }

    // Step 8: Seed data
    console.log(`\n${colors.blue}🌱 Sample Data${colors.reset}`);
    const seedPath = path.join(__dirname, 'seed-database.js');
    if (fs.existsSync(seedPath)) {
      const answer = await question('Do you want to seed sample data? (includes admin account) (y/n): ');
      if (answer.toLowerCase() === 'y') {
        console.log(`${colors.yellow}Seeding database...${colors.reset}`);
        const { exec } = require('child_process');
        exec('node seed-database.js', (error, stdout, stderr) => {
          if (error) {
            console.log(`${colors.red}Error seeding data:${colors.reset}`, error.message);
          } else {
            console.log(`${colors.green}✓ Sample data seeded successfully!${colors.reset}`);
            console.log(stdout);
          }
          showNextSteps();
        });
        rl.close();
        return;
      }
    }

    showNextSteps();
    rl.close();

  } catch (error) {
    console.error(`${colors.red}Setup failed: ${error.message}${colors.reset}`);
    rl.close();
  }
}

function showNextSteps() {
  console.log(`
${colors.cyan}╔════════════════════════════════════════════════╗
║          ✅ Setup Complete!                     ║
╚════════════════════════════════════════════════╝${colors.reset}
`);

  console.log(`${colors.green}Next Steps:${colors.reset}
${colors.blue}1.${colors.reset} Start the backend server:
   ${colors.cyan}npm run dev${colors.reset}

${colors.blue}2.${colors.reset} In a new terminal, go to frontend folder:
   ${colors.cyan}cd ../frontend${colors.reset}
   ${colors.cyan}npm run dev${colors.reset}

${colors.blue}3.${colors.reset} Open browser:
   ${colors.cyan}http://localhost:5173${colors.reset}

${colors.yellow}Default Admin Login (if seeded):${colors.reset}
   Email: ${colors.cyan}admin@stocksim.com${colors.reset}
   Password: ${colors.cyan}password123${colors.reset}
`);
}

// Run setup
setup();
