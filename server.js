const express = require('express');
const cors = require('cors');
const path = require('path');
const { Pool } = require('pg');
const swaggerUi = require('swagger-ui-express');

const app = express();
const PORT = process.env.PORT || 3001;

// ============================================================
// PostgreSQL CONNECTION
// ============================================================
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL
    ? { rejectUnauthorized: false }
    : false,
});

// ============================================================
// DB INIT — jadvallarni avtomatik yaratish
// ============================================================
async function initDB() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS products (
        id BIGSERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        image TEXT,
        stock INTEGER DEFAULT 0,
        price DECIMAL(10, 2) DEFAULT 0,
        category VARCHAR(100),
        weight INTEGER DEFAULT 0,
        pack_quantity INTEGER DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS orders (
        id BIGSERIAL PRIMARY KEY,
        order_number VARCHAR(50) UNIQUE NOT NULL,
        customer VARCHAR(255),
        phone VARCHAR(50),
        date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        status VARCHAR(50) DEFAULT 'Jo''natilmagan',
        warehouse VARCHAR(100) DEFAULT 'Склад',
        address TEXT,
        comment TEXT,
        currency VARCHAR(10) DEFAULT 'USD',
        is_warehouse_printed BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS order_lines (
        id BIGSERIAL PRIMARY KEY,
        order_id BIGINT REFERENCES orders(id) ON DELETE CASCADE,
        product_id BIGINT,
        name VARCHAR(255),
        image TEXT,
        qty INTEGER DEFAULT 1,
        price DECIMAL(10, 2) DEFAULT 0,
        discount DECIMAL(10, 2) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_products_name ON products(name);
      CREATE INDEX IF NOT EXISTS idx_orders_number ON orders(order_number);
      CREATE INDEX IF NOT EXISTS idx_order_lines_order_id ON order_lines(order_id);
    `);
    console.log('✅ Database tables ready (PostgreSQL)');
  } catch (err) {
    console.error('❌ DB init error:', err.message);
  }
}

// ============================================================
// MIDDLEWARE
// ============================================================
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));

// ============================================================
// SWAGGER
// ============================================================
const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'Admin Panel API',
    version: '4.0.0',
    description: 'Mahsulot va Buyurtmalarni Boshqarish (PostgreSQL)',
  },
  tags: [
    { name: 'Auth', description: 'Login: admin@gmail.com / admin' },
    { name: 'Products', description: 'Mahsulotlarni boshqarish' },
    { name: 'Orders', description: 'Buyurtmalarni boshqarish' },
  ],
  paths: {},
};
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ============================================================
// HELPER — products row → frontend format
// ============================================================
function formatProduct(row) {
  return {
    id: Number(row.id),
    name: row.name,
    image: row.image || '',
    stock: Number(row.stock) || 0,
    price: Number(row.price) || 0,
    category: row.category || '',
    weight: Number(row.weight) || 0,
    packQuantity: Number(row.pack_quantity) || 1,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function formatOrder(row, lines = []) {
  return {
    id: Number(row.id),
    orderNumber: row.order_number,
    customer: row.customer || '',
    phone: row.phone || '',
    date: row.date,
    status: row.status,
    warehouse: row.warehouse || 'Склад',
    address: row.address || '',
    comment: row.comment || '',
    currency: row.currency || 'USD',
    isWarehousePrinted: row.is_warehouse_printed || false,
    lines: lines.map(l => ({
      id: Number(l.id),
      productId: l.product_id ? Number(l.product_id) : null,
      name: l.name,
      image: l.image || '',
      qty: Number(l.qty) || 1,
      price: Number(l.price) || 0,
      discount: Number(l.discount) || 0,
    })),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// ============================================================
// AUTH
// ============================================================
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (email === 'admin@gmail.com' && password === 'admin') {
    return res.json({
      success: true,
      message: 'Kirish muvaffaqiyatli',
      user: { email, fullName: 'Administrator', role: 'ADMIN' },
    });
  }
  res.status(401).json({ success: false, message: "Noto'g'ri email yoki parol" });
});

// ============================================================
// PRODUCTS — CRUD
// ============================================================

// GET /api/products
app.get('/api/products', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM products ORDER BY created_at DESC'
    );
    res.json({ success: true, data: rows.map(formatProduct) });
  } catch (err) {
    console.error('GET /api/products:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/products/:id
app.get('/api/products/:id', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM products WHERE id = $1',
      [req.params.id]
    );
    if (!rows.length)
      return res.status(404).json({ success: false, message: 'Mahsulot topilmadi' });
    res.json({ success: true, data: formatProduct(rows[0]) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/products
app.post('/api/products', async (req, res) => {
  const { name, image, stock, price, category, weight, packQuantity } = req.body;
  try {
    const { rows } = await pool.query(
      `INSERT INTO products (name, image, stock, price, category, weight, pack_quantity)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [name, image || null, stock || 0, price || 0, category || null, weight || 0, packQuantity || 1]
    );
    res.json({ success: true, data: formatProduct(rows[0]) });
  } catch (err) {
    console.error('POST /api/products:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/products/:id
app.put('/api/products/:id', async (req, res) => {
  const { name, image, stock, price, category, weight, packQuantity } = req.body;
  try {
    const { rows } = await pool.query(
      `UPDATE products
       SET name = COALESCE($1, name),
           image = COALESCE($2, image),
           stock = COALESCE($3, stock),
           price = COALESCE($4, price),
           category = COALESCE($5, category),
           weight = COALESCE($6, weight),
           pack_quantity = COALESCE($7, pack_quantity),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $8 RETURNING *`,
      [name, image, stock, price, category, weight, packQuantity, req.params.id]
    );
    if (!rows.length)
      return res.status(404).json({ success: false, message: 'Mahsulot topilmadi' });
    res.json({ success: true, data: formatProduct(rows[0]) });
  } catch (err) {
    console.error('PUT /api/products/:id:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/products/:id
app.delete('/api/products/:id', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'DELETE FROM products WHERE id = $1 RETURNING *',
      [req.params.id]
    );
    if (!rows.length)
      return res.status(404).json({ success: false, message: 'Mahsulot topilmadi' });
    res.json({ success: true, data: formatProduct(rows[0]) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ============================================================
// ORDERS — CRUD
// ============================================================

// GET /api/orders — buyurtmalar + ularning linelari
app.get('/api/orders', async (req, res) => {
  try {
    const { rows: orders } = await pool.query(
      'SELECT * FROM orders ORDER BY created_at DESC'
    );
    if (!orders.length) return res.json({ success: true, data: [] });

    const orderIds = orders.map(o => o.id);
    const { rows: lines } = await pool.query(
      'SELECT * FROM order_lines WHERE order_id = ANY($1::bigint[])',
      [orderIds]
    );

    const linesByOrder = {};
    lines.forEach(l => {
      if (!linesByOrder[l.order_id]) linesByOrder[l.order_id] = [];
      linesByOrder[l.order_id].push(l);
    });

    res.json({
      success: true,
      data: orders.map(o => formatOrder(o, linesByOrder[o.id] || [])),
    });
  } catch (err) {
    console.error('GET /api/orders:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/orders/:id
app.get('/api/orders/:id', async (req, res) => {
  try {
    const { rows: orders } = await pool.query(
      'SELECT * FROM orders WHERE id = $1',
      [req.params.id]
    );
    if (!orders.length)
      return res.status(404).json({ success: false, message: 'Buyurtma topilmadi' });

    const { rows: lines } = await pool.query(
      'SELECT * FROM order_lines WHERE order_id = $1',
      [req.params.id]
    );
    res.json({ success: true, data: formatOrder(orders[0], lines) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/orders
app.post('/api/orders', async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const orderNumber = `ORD-${Date.now().toString().slice(-6)}`;
    const {
      customer, phone, date, status, warehouse,
      address, comment, currency, lines = [], isWarehousePrinted,
    } = req.body;

    const { rows: orderRows } = await client.query(
      `INSERT INTO orders (order_number, customer, phone, date, status, warehouse, address, comment, currency, is_warehouse_printed)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
      [
        orderNumber,
        customer || '',
        phone || '',
        date || new Date().toISOString(),
        status || "Jo'natilmagan",
        warehouse || 'Склад',
        address || '',
        comment || '',
        currency || 'USD',
        isWarehousePrinted || false,
      ]
    );
    const order = orderRows[0];

    const insertedLines = [];
    for (const line of lines) {
      const { rows: lineRows } = await client.query(
        `INSERT INTO order_lines (order_id, product_id, name, image, qty, price, discount)
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [order.id, line.productId || null, line.name, line.image || null,
         line.qty || 1, line.price || 0, line.discount || 0]
      );
      insertedLines.push(lineRows[0]);
    }

    await client.query('COMMIT');
    res.json({ success: true, data: formatOrder(order, insertedLines) });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('POST /api/orders:', err.message);
    res.status(500).json({ success: false, message: err.message });
  } finally {
    client.release();
  }
});

// PUT /api/orders/:id
app.put('/api/orders/:id', async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const {
      customer, phone, date, status, warehouse,
      address, comment, currency, lines, isWarehousePrinted,
    } = req.body;

    const { rows: orderRows } = await client.query(
      `UPDATE orders
       SET customer = COALESCE($1, customer),
           phone = COALESCE($2, phone),
           date = COALESCE($3, date),
           status = COALESCE($4, status),
           warehouse = COALESCE($5, warehouse),
           address = COALESCE($6, address),
           comment = COALESCE($7, comment),
           currency = COALESCE($8, currency),
           is_warehouse_printed = COALESCE($9, is_warehouse_printed),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $10 RETURNING *`,
      [customer, phone, date, status, warehouse, address, comment, currency,
       isWarehousePrinted, req.params.id]
    );

    if (!orderRows.length) {
      await client.query('ROLLBACK');
      return res.status(404).json({ success: false, message: 'Buyurtma topilmadi' });
    }

    let insertedLines = [];
    if (lines !== undefined) {
      await client.query('DELETE FROM order_lines WHERE order_id = $1', [req.params.id]);
      for (const line of lines) {
        const { rows: lineRows } = await client.query(
          `INSERT INTO order_lines (order_id, product_id, name, image, qty, price, discount)
           VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
          [req.params.id, line.productId || null, line.name, line.image || null,
           line.qty || 1, line.price || 0, line.discount || 0]
        );
        insertedLines.push(lineRows[0]);
      }
    } else {
      const { rows: existingLines } = await client.query(
        'SELECT * FROM order_lines WHERE order_id = $1', [req.params.id]
      );
      insertedLines = existingLines;
    }

    await client.query('COMMIT');
    res.json({ success: true, data: formatOrder(orderRows[0], insertedLines) });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('PUT /api/orders/:id:', err.message);
    res.status(500).json({ success: false, message: err.message });
  } finally {
    client.release();
  }
});

// DELETE /api/orders/:id
app.delete('/api/orders/:id', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'DELETE FROM orders WHERE id = $1 RETURNING *',
      [req.params.id]
    );
    if (!rows.length)
      return res.status(404).json({ success: false, message: 'Buyurtma topilmadi' });
    res.json({ success: true, data: formatOrder(rows[0], []) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ============================================================
// HEALTH CHECK
// ============================================================
app.get('/', (req, res) => {
  res.json({ success: true, message: 'Admin Panel API ishlayapti!', version: '4.0.0' });
});

app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({
      success: true,
      message: 'Server va Database ishlayapti!',
      database: 'PostgreSQL ✅',
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Database bilan muammo', error: err.message });
  }
});

// 404
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'API endpoint topilmadi' });
});

// ============================================================
// START SERVER
// ============================================================
initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`
╔═══════════════════════════════════════════════╗
║  🚀 Admin Panel Backend v4.0 — PostgreSQL    ║
║                                               ║
║  📍 URL    : http://localhost:${PORT}               ║
║  📊 Swagger: http://localhost:${PORT}/api-docs      ║
║  🗄️  DB     : PostgreSQL (${process.env.DATABASE_URL ? 'REMOTE' : 'LOCAL'})       ║
║                                               ║
║  Endpoints:                                   ║
║  POST /api/auth/login                         ║
║  GET|POST|PUT|DELETE /api/products            ║
║  GET|POST|PUT|DELETE /api/orders              ║
╚═══════════════════════════════════════════════╝
    `);
  });
});
