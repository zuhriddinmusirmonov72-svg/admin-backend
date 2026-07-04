const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Database fayl yo'li
const DB_PATH = path.join(__dirname, 'database.json');

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json());

// Database ni o'qish
function readDatabase() {
  try {
    if (!fs.existsSync(DB_PATH)) {
      const defaultData = {
        products: [],
        orders: [],
        users: []
      };
      fs.writeFileSync(DB_PATH, JSON.stringify(defaultData, null, 2));
      return defaultData;
    }
    const data = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Database o\'qishda xatolik:', error);
    return { products: [], orders: [], users: [] };
  }
}

// Database ga yozish
function writeDatabase(data) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Database ga yozishda xatolik:', error);
    return false;
  }
}

// ==================== MAHSULOTLAR (PRODUCTS) ====================

// Barcha mahsulotlarni olish
app.get('/api/products', (req, res) => {
  try {
    const db = readDatabase();
    res.json({ success: true, data: db.products });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Xatolik yuz berdi', error: error.message });
  }
});

// Yangi mahsulot qo'shish
app.post('/api/products', (req, res) => {
  try {
    const db = readDatabase();
    const newProduct = {
      id: Date.now(),
      ...req.body,
      createdAt: new Date().toISOString()
    };
    db.products.push(newProduct);
    writeDatabase(db);
    res.json({ success: true, data: newProduct });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Mahsulot qo\'shishda xatolik', error: error.message });
  }
});

// Mahsulotni yangilash
app.put('/api/products/:id', (req, res) => {
  try {
    const db = readDatabase();
    const id = parseInt(req.params.id);
    const index = db.products.findIndex(p => p.id === id);
    
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Mahsulot topilmadi' });
    }
    
    db.products[index] = {
      ...db.products[index],
      ...req.body,
      updatedAt: new Date().toISOString()
    };
    writeDatabase(db);
    res.json({ success: true, data: db.products[index] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Yangilashda xatolik', error: error.message });
  }
});

// Mahsulotni o'chirish
app.delete('/api/products/:id', (req, res) => {
  try {
    const db = readDatabase();
    const id = parseInt(req.params.id);
    const index = db.products.findIndex(p => p.id === id);
    
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Mahsulot topilmadi' });
    }
    
    const deleted = db.products.splice(index, 1);
    writeDatabase(db);
    res.json({ success: true, data: deleted[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'O\'chirishda xatolik', error: error.message });
  }
});

// ==================== BUYURTMALAR (ORDERS) ====================

// Barcha buyurtmalarni olish
app.get('/api/orders', (req, res) => {
  try {
    const db = readDatabase();
    res.json({ success: true, data: db.orders });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Xatolik yuz berdi', error: error.message });
  }
});

// Yangi buyurtma qo'shish
app.post('/api/orders', (req, res) => {
  try {
    const db = readDatabase();
    const newOrder = {
      id: Date.now(),
      orderNumber: `#ORD-${String(db.orders.length + 1).padStart(3, '0')}`,
      ...req.body,
      createdAt: new Date().toISOString()
    };
    db.orders.push(newOrder);
    writeDatabase(db);
    res.json({ success: true, data: newOrder });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Buyurtma qo\'shishda xatolik', error: error.message });
  }
});

// Buyurtmani yangilash
app.put('/api/orders/:id', (req, res) => {
  try {
    const db = readDatabase();
    const id = parseInt(req.params.id);
    const index = db.orders.findIndex(o => o.id === id);
    
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Buyurtma topilmadi' });
    }
    
    db.orders[index] = {
      ...db.orders[index],
      ...req.body,
      updatedAt: new Date().toISOString()
    };
    writeDatabase(db);
    res.json({ success: true, data: db.orders[index] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Yangilashda xatolik', error: error.message });
  }
});

// Buyurtmani o'chirish
app.delete('/api/orders/:id', (req, res) => {
  try {
    const db = readDatabase();
    const id = parseInt(req.params.id);
    const index = db.orders.findIndex(o => o.id === id);
    
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Buyurtma topilmadi' });
    }
    
    const deleted = db.orders.splice(index, 1);
    writeDatabase(db);
    res.json({ success: true, data: deleted[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'O\'chirishda xatolik', error: error.message });
  }
});

// ==================== STATISTIKA ====================

app.get('/api/stats', (req, res) => {
  try {
    const db = readDatabase();
    const stats = {
      totalProducts: db.products.length,
      totalOrders: db.orders.length,
      completedOrders: db.orders.filter(o => o.status === "Jo'natilgan").length,
      pendingOrders: db.orders.filter(o => o.status === "Jo'natilmagan").length,
      canceledOrders: db.orders.filter(o => o.status === "Bekor qilindi").length,
    };
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Statistika olishda xatolik', error: error.message });
  }
});

// ==================== SERVER ====================

// Server statusini tekshirish
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Server ishlamoqda!',
    timestamp: new Date().toISOString()
  });
});

// 404 - Topilmadi
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'API endpoint topilmadi' });
});

// Serverni ishga tushirish
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════╗
║  🚀 Backend Server ishga tushdi!         ║
║                                           ║
║  📍 URL: http://localhost:${PORT}         ║
║  📊 Database: ${DB_PATH}                  ║
║                                           ║
║  API Endpoints:                           ║
║  • GET    /api/products                   ║
║  • POST   /api/products                   ║
║  • PUT    /api/products/:id               ║
║  • DELETE /api/products/:id               ║
║                                           ║
║  • GET    /api/orders                     ║
║  • POST   /api/orders                     ║
║  • PUT    /api/orders/:id                 ║
║  • DELETE /api/orders/:id                 ║
║                                           ║
║  • GET    /api/stats                      ║
║  • GET    /api/health                     ║
╚═══════════════════════════════════════════╝
  `);
});
