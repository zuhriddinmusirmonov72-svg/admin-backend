const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const swaggerUi = require('swagger-ui-express');

const app = express();
const PORT = process.env.PORT || 3001;
const DB_PATH = path.join(__dirname, 'database.json');

// Middleware
app.use(cors({ origin: '*', methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], credentials: true }));
app.use(express.json());

// Database functions
function readDatabase() {
  try {
    if (!fs.existsSync(DB_PATH)) {
      const defaultData = { products: [], orders: [] };
      fs.writeFileSync(DB_PATH, JSON.stringify(defaultData, null, 2));
      return defaultData;
    }
    return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
  } catch (error) {
    console.error('Database error:', error);
    return { products: [], orders: [] };
  }
}

function writeDatabase(data) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Write error:', error);
    return false;
  }
}

// Swagger spec
const swaggerSpec = {
  openapi: '3.0.0',
  info: { title: 'Admin Panel API', version: '3.0.0', description: 'Mahsulot va Buyurtmalarni Boshqarish' },
  tags: [
    { name: '1. Kirish', description: 'Login: admin@gmail.com / admin' },
    { name: '2. Mahsulotlar', description: 'Mahsulotlarni boshqarish' },
    { name: '3. Mijoz Buyurtmalari', description: 'Buyurtmalarni ko\'rish' }
  ],
  paths: {}
};

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// 1. LOGIN
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (email === 'admin@gmail.com' && password === 'admin') {
    return res.json({ success: true, message: 'Kirish muvaffaqiyatli', user: { email, fullName: 'Administrator', role: 'ADMIN' } });
  }
  res.status(401).json({ success: false, message: 'Noto\'g\'ri email yoki parol' });
});

// 2. MAHSULOTLAR
app.get('/api/products', (req, res) => {
  const db = readDatabase();
  res.json({ success: true, data: db.products });
});

app.get('/api/products/:id', (req, res) => {
  const db = readDatabase();
  const product = db.products.find(p => p.id === parseInt(req.params.id));
  if (!product) return res.status(404).json({ success: false, message: 'Mahsulot topilmadi' });
  res.json({ success: true, data: product });
});

app.post('/api/products', (req, res) => {
  const db = readDatabase();
  const newProduct = {
    id: Date.now(),
    name: req.body.name,
    category: req.body.category || '',
    weight: req.body.weight,
    packQuantity: req.body.packQuantity,
    price: req.body.price,
    stock: req.body.stock,
    image: req.body.image,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  db.products.push(newProduct);
  writeDatabase(db);
  res.json({ success: true, data: newProduct });
});

app.put('/api/products/:id', (req, res) => {
  const db = readDatabase();
  const index = db.products.findIndex(p => p.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ success: false, message: 'Mahsulot topilmadi' });
  db.products[index] = { ...db.products[index], ...req.body, updatedAt: new Date().toISOString() };
  writeDatabase(db);
  res.json({ success: true, data: db.products[index] });
});

app.delete('/api/products/:id', (req, res) => {
  const db = readDatabase();
  const index = db.products.findIndex(p => p.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ success: false, message: 'Mahsulot topilmadi' });
  const deleted = db.products.splice(index, 1);
  writeDatabase(db);
  res.json({ success: true, data: deleted[0] });
});

// 3. MIJOZ BUYURTMALARI
app.get('/api/orders', (req, res) => {
  const db = readDatabase();
  res.json({ success: true, data: db.orders });
});

app.get('/api/orders/:id', (req, res) => {
  const db = readDatabase();
  const order = db.orders.find(o => o.id === parseInt(req.params.id));
  if (!order) return res.status(404).json({ success: false, message: 'Buyurtma topilmadi' });
  res.json({ success: true, data: order });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server ishlamoqda!', timestamp: new Date().toISOString() });
});

// 404
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'API endpoint topilmadi' });
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════╗
║  🚀 Admin Panel Backend - Yangilandi!    ║
║                                           ║
║  📍 URL: http://localhost:${PORT}              ║
║  📊 Swagger: http://localhost:${PORT}/api-docs ║
║  📦 Database: database.json               ║
║                                           ║
║  APIlar:                                  ║
║  1️⃣  POST /api/auth/login                ║
║  2️⃣  GET/POST/PUT/DELETE /api/products   ║
║  3️⃣  GET /api/orders                     ║
╚═══════════════════════════════════════════╝
  `);
});
