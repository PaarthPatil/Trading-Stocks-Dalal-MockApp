/**
 * Database Seed Script
 * Populates database with sample data for testing
 */
require('dotenv').config();
const bcrypt = require('bcryptjs');
const db = require('./src/config/database');

async function seedDatabase() {
  console.log('\n🌱 Seeding Database...\n');
  
  try {
    // Initialize database connection
    await db.initializePool();
    
    await db.transaction(async (connection) => {
      
      // 1. Seed Teams
      console.log('📦 Inserting teams...');
      const teams = [
        ['Bulls'],
        ['Bears'],
        ['Wolves'],
        ['Eagles']
      ];
      
      for (const team of teams) {
        await connection.execute(
          'INSERT IGNORE INTO teams (team_name) VALUES (?)',
          team
        );
      }
      console.log('✅ Teams inserted\n');
      
      // 2. Seed Users
      console.log('👥 Inserting users...');
      const hashedPassword = await bcrypt.hash('password123', 10);
      
      const users = [
        ['Admin User', 'admin@stocksim.com', hashedPassword, null, 1000000, true],
        ['John Doe', 'john@bulls.com', hashedPassword, 1, 100000, false],
        ['Jane Smith', 'jane@bulls.com', hashedPassword, 1, 100000, false],
        ['Bob Wilson', 'bob@bears.com', hashedPassword, 2, 100000, false],
        ['Alice Brown', 'alice@bears.com', hashedPassword, 2, 100000, false],
        ['Charlie Davis', 'charlie@wolves.com', hashedPassword, 3, 100000, false],
        ['Diana Miller', 'diana@eagles.com', hashedPassword, 4, 100000, false]
      ];
      
      for (const user of users) {
        await connection.execute(
          `INSERT INTO users (name, email, password_hash, team_id, balance, is_admin) 
           VALUES (?, ?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE name=VALUES(name)`,
          user
        );
      }
      console.log('✅ Users inserted\n');
      
      // 3. Seed Stocks
      console.log('📈 Inserting stocks...');
      const stocks = [
        ['Tech Corp', 'TECH', 150.00, 100.00],
        ['Finance Inc', 'FIN', 200.00, 150.00],
        ['Energy Co', 'NRG', 75.00, 50.00],
        ['Healthcare Ltd', 'HLTH', 120.00, 80.00],
        ['Consumer Goods', 'CONS', 95.00, 60.00],
        ['Industrial Corp', 'IND', 180.00, 120.00],
        ['Telecom Inc', 'TEL', 110.00, 70.00],
        ['Utility Co', 'UTIL', 85.00, 55.00]
      ];
      
      for (const stock of stocks) {
        await connection.execute(
          `INSERT INTO stocks (name, symbol, current_price, initial_price) 
           VALUES (?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE name=VALUES(name)`,
          stock
        );
      }
      console.log('✅ Stocks inserted\n');
      
      // 4. Create some sample transactions
      console.log('💼 Creating sample transactions...');
      
      // Get first user and first stock
      const [userRows] = await connection.execute(
        'SELECT id, balance FROM users WHERE email = ?',
        ['john@bulls.com']
      );
      
      if (userRows.length > 0) {
        const userId = userRows[0].id;
        
        // Buy some stocks
        const sampleBuys = [
          [userId, 1, 'BUY', 10, 150.00, 1500.00],
          [userId, 2, 'BUY', 5, 200.00, 1000.00],
          [userId, 3, 'BUY', 20, 75.00, 1500.00]
        ];
        
        for (const tx of sampleBuys) {
          await connection.execute(
            'INSERT INTO transactions (user_id, stock_id, type, quantity, price, total_amount) VALUES (?, ?, ?, ?, ?, ?)',
            tx
          );
          
          // Update holdings
          await connection.execute(
            `INSERT INTO holdings (user_id, stock_id, quantity, average_cost) 
             VALUES (?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE 
               quantity = quantity + VALUES(quantity),
               average_cost = ((quantity * average_cost) + (VALUES(quantity) * VALUES(price))) / (quantity + VALUES(quantity))`,
            [userId, tx[1], tx[2] === 'BUY' ? tx[3] : -tx[3], tx[4]]
          );
          
          // Update user balance
          await connection.execute(
            'UPDATE users SET balance = balance - ? WHERE id = ?',
            [tx[5], userId]
          );
        }
        
        console.log('✅ Sample transactions created\n');
      }
      
      // 5. Display summary
      console.log('\n📊 SEED SUMMARY');
      console.log('='.repeat(50));
      
      const teamCount = await connection.execute('SELECT COUNT(*) as count FROM teams');
      console.log(`Teams: ${teamCount[0][0].count}`);
      
      const userCount = await connection.execute('SELECT COUNT(*) as count FROM users');
      console.log(`Users: ${userCount[0][0].count}`);
      
      const stockCount = await connection.execute('SELECT COUNT(*) as count FROM stocks');
      console.log(`Stocks: ${stockCount[0][0].count}`);
      
      const transactionCount = await connection.execute('SELECT COUNT(*) as count FROM transactions');
      console.log(`Transactions: ${transactionCount[0][0].count}`);
      
      console.log('='.repeat(50));
      console.log('\n🎉 Database seeded successfully!\n');
      console.log('📝 Sample Login Credentials:');
      console.log('   Admin: admin@stocksim.com / password123');
      console.log('   User: john@bulls.com / password123\n');
    });
    
    process.exit(0);
    
  } catch (error) {
    console.error('\n❌ SEED FAILED\n');
    console.error('Error:', error.message);
    process.exit(1);
  }
}

// Run the seed
seedDatabase();

module.exports = seedDatabase;
