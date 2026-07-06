const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://localhost:5432/admin_panel',
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false
});

// Test connection
pool.on('connect', () => {
  console.log('✅ PostgreSQL database connected');
});

pool.on('error', (err) => {
  console.error('❌ Unexpected error on idle client', err);
  process.exit(-1);
});

// Initialize database (create tables)
async function initDatabase() {
  try {
    const sqlPath = path.join(__dirname, 'database-setup.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    await pool.query(sql);
    console.log('✅ Database tables initialized');
    
    // Migrate data from database.json if exists
    await migrateFromJSON();
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    throw error;
  }
}

// Migrate data from database.json to PostgreSQL (one-time)
async function migrateFromJSON() {
  try {
    const jsonPath = path.join(__dirname, 'database.json');
    
    if (!fs.existsSync(jsonPath)) {
      console.log('ℹ️  No database.json found, skipping migration');
      return;
    }
    
    const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    
    // Check if products already exist
    const { rows } = await pool.query('SELECT COUNT(*) as count FROM products');
    if (rows[0].count > 0) {
      console.log('ℹ️  Database already has data, skipping migration');
      return;
    }
    
    console.log('🔄 Migrating data from database.json...');
    
    // Migrate products
    for (const product of data.products || []) {
      await pool.query(
        `INSERT INTO products (id, name, image, stock, price, category, weight, pack_quantity, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         ON CONFLICT (id) DO NOTHING`,
        [
          product.id,
          product.name,
          product.image || null,
          product.stock || 0,
          product.price || 0,
          product.category || null,
          product.weight || 0,
          product.packQuantity || 1,
          product.createdAt || new Date()
        ]
      );
    }
    
    // Migrate orders
    for (const order of data.orders || []) {
      await pool.query(
        `INSERT INTO orders (id, order_number, customer, phone, date, status, warehouse, address, comment, currency, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
         ON CONFLICT (id) DO NOTHING`,
        [
          order.id,
          order.orderNumber,
          order.customer || null,
          order.phone || null,
          order.date || new Date(),
          order.status || 'Jo\'natilmagan',
          order.warehouse || 'Склад',
          order.address || null,
          order.comment || null,
          order.currency || 'USD',
          order.createdAt || new Date()
        ]
      );
      
      // Migrate order lines
      for (const line of order.lines || []) {
        await pool.query(
          `INSERT INTO order_lines (id, order_id, product_id, name, image, qty, price, discount)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
           ON CONFLICT (id) DO NOTHING`,
          [
            line.id,
            order.id,
            line.productId || null,
            line.name,
            line.image || null,
            line.qty || 1,
            line.price || 0,
            line.discount || 0
          ]
        );
      }
    }
    
    // Migrate customer orders
    for (const custOrder of data.customerOrders || []) {
      await pool.query(
        `INSERT INTO customer_orders (id, customer_name, phone_number, product_id, product_name, product_price, product_weight, product_pack_quantity, status, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
         ON CONFLICT (id) DO NOTHING`,
        [
          custOrder.id,
          custOrder.customerName,
          custOrder.phoneNumber,
          custOrder.productId || null,
          custOrder.productName || null,
          custOrder.productPrice || null,
          custOrder.productWeight || null,
          custOrder.productPackQuantity || null,
          custOrder.status || 'pending',
          custOrder.createdAt || new Date()
        ]
      );
    }
    
    console.log('✅ Data migration completed successfully!');
    console.log(`   - ${data.products?.length || 0} products migrated`);
    console.log(`   - ${data.orders?.length || 0} orders migrated`);
    console.log(`   - ${data.customerOrders?.length || 0} customer orders migrated`);
    
    // Rename database.json to database.json.backup
    const backupPath = path.join(__dirname, 'database.json.backup');
    fs.renameSync(jsonPath, backupPath);
    console.log('✅ database.json renamed to database.json.backup');
    
  } catch (error) {
    console.error('❌ Error migrating data:', error);
  }
}

module.exports = {
  pool,
  initDatabase
};
