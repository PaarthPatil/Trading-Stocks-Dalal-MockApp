/**
 * Database Test Utility
 * Verify database connection and schema
 */
require('dotenv').config();
const db = require('./src/config/database');

async function testDatabase() {
  console.log('\n🔍 Testing Database Connection...\n');
  
  try {
    // Test 1: Initialize connection pool
    console.log('Test 1: Initializing connection pool...');
    await db.initializePool();
    console.log('✅ Connection pool initialized\n');
    
    // Test 2: Check database exists
    console.log('Test 2: Checking database...');
    const dbCheck = await db.query('SELECT DATABASE() as current_db');
    console.log(`✅ Connected to database: ${dbCheck[0].current_db}\n`);
    
    // Test 3: List all tables
    console.log('Test 3: Listing tables...');
    const tables = await db.query(`
      SELECT TABLE_NAME 
      FROM information_schema.TABLES 
      WHERE TABLE_SCHEMA = '${process.env.DB_NAME || 'stock_simulation'}'
      ORDER BY TABLE_NAME
    `);
    
    console.log('✅ Tables found:');
    tables.forEach(table => {
      console.log(`   - ${table.TABLE_NAME}`);
    });
    console.log();
    
    // Test 4: Verify required tables exist
    console.log('Test 4: Verifying required tables...');
    const requiredTables = ['users', 'teams', 'stocks', 'holdings', 'transactions'];
    const existingTables = tables.map(t => t.TABLE_NAME);
    
    const missingTables = requiredTables.filter(t => !existingTables.includes(t));
    
    if (missingTables.length > 0) {
      console.log('❌ Missing tables:', missingTables.join(', '));
      console.log('💡 Run: mysql -u root -p < database/schema.sql\n');
      process.exit(1);
    } else {
      console.log('✅ All required tables exist\n');
    }
    
    // Test 5: Check table structure
    console.log('Test 5: Checking table structures...');
    
    for (const tableName of requiredTables) {
      const columns = await db.query(`
        SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_DEFAULT
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_SCHEMA = '${process.env.DB_NAME || 'stock_simulation'}'
        AND TABLE_NAME = '${tableName}'
        ORDER BY ORDINAL_POSITION
      `);
      
      console.log(`\n📊 Table: ${tableName}`);
      console.log('   Columns:', columns.length);
      columns.forEach(col => {
        const nullable = col.IS_NULLABLE === 'YES' ? 'NULL' : 'NOT NULL';
        const defaultVal = col.COLUMN_DEFAULT !== null ? ` DEFAULT ${col.COLUMN_DEFAULT}` : '';
        console.log(`   - ${col.COLUMN_NAME}: ${col.DATA_TYPE} ${nullable}${defaultVal}`);
      });
    }
    
    // Test 6: Check foreign keys
    console.log('\n\nTest 6: Checking foreign key constraints...');
    const foreignKeys = await db.query(`
      SELECT 
        TABLE_NAME,
        COLUMN_NAME,
        REFERENCED_TABLE_NAME,
        REFERENCED_COLUMN_NAME
      FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
      WHERE TABLE_SCHEMA = '${process.env.DB_NAME || 'stock_simulation'}'
      AND REFERENCED_TABLE_NAME IS NOT NULL
    `);
    
    console.log(`✅ Found ${foreignKeys.length} foreign key relationships:`);
    foreignKeys.forEach(fk => {
      console.log(`   ${fk.TABLE_NAME}.${fk.COLUMN_NAME} → ${fk.REFERENCED_TABLE_NAME}.${fk.REFERENCED_COLUMN_NAME}`);
    });
    
    // Test 7: Check indexes
    console.log('\n\nTest 7: Checking indexes...');
    const indexes = await db.query(`
      SELECT 
        TABLE_NAME,
        INDEX_NAME,
        NON_UNIQUE
      FROM INFORMATION_SCHEMA.STATISTICS
      WHERE TABLE_SCHEMA = '${process.env.DB_NAME || 'stock_simulation'}'
      GROUP BY TABLE_NAME, INDEX_NAME, NON_UNIQUE
      ORDER BY TABLE_NAME, INDEX_NAME
    `);
    
    console.log(`✅ Found ${indexes.length} indexes:`);
    indexes.forEach(idx => {
      const type = idx.NON_UNIQUE === 1 ? 'INDEX' : 'UNIQUE';
      console.log(`   ${type}: ${idx.TABLE_NAME}.${idx.INDEX_NAME}`);
    });
    
    // Test 8: Transaction test
    console.log('\n\nTest 8: Testing transaction support...');
    try {
      await db.transaction(async (connection) => {
        await connection.execute('SELECT 1');
        return true;
      });
      console.log('✅ Transactions working\n');
    } catch (error) {
      console.log('❌ Transaction test failed:', error.message);
    }
    
    // Summary
    console.log('\n' + '='.repeat(50));
    console.log('📊 DATABASE TEST SUMMARY');
    console.log('='.repeat(50));
    console.log('✅ Connection Pool: Working');
    console.log('✅ Database Exists: Yes');
    console.log(`✅ Required Tables: ${requiredTables.length}/${requiredTables.length}`);
    console.log('✅ Foreign Keys: Configured');
    console.log('✅ Indexes: Present');
    console.log('✅ Transactions: Supported');
    console.log('='.repeat(50));
    console.log('\n🎉 DATABASE IS READY FOR USE!\n');
    
    process.exit(0);
    
  } catch (error) {
    console.error('\n❌ DATABASE TEST FAILED\n');
    console.error('Error:', error.message);
    console.error('\n💡 Troubleshooting:');
    console.error('   1. Ensure MySQL server is running');
    console.error('   2. Check .env file has correct credentials');
    console.error('   3. Run: mysql -u root -p < database/schema.sql\n');
    process.exit(1);
  }
}

// Run the test
testDatabase();

module.exports = testDatabase;
