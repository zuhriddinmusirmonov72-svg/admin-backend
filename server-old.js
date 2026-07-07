const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');

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

// ==================== SWAGGER API DOCUMENTATION ====================

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Admin Panel API'
}));

// Swagger JSON
app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// ==================== MAHSULOTLAR (PRODUCTS) ====================

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Barcha mahsulotlarni olish
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Muvaffaqiyatli
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *       500:
 *         description: Server xatosi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

// Barcha mahsulotlarni olish
app.get('/api/products', (req, res) => {
  try {
    const db = readDatabase();
    res.json({ success: true, data: db.products });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Xatolik yuz berdi', error: error.message });
  }
});

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Yangi mahsulot qo'shish
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - weight
 *             properties:
 *               name:
 *                 type: string
 *                 example: Coca Cola
 *               image:
 *                 type: string
 *                 example: https://example.com/image.jpg
 *               stock:
 *                 type: integer
 *                 example: 1000
 *               price:
 *                 type: number
 *                 example: 1.50
 *               category:
 *                 type: string
 *                 example: Ichimliklar
 *               weight:
 *                 type: integer
 *                 example: 500
 *               packQuantity:
 *                 type: integer
 *                 example: 24
 *     responses:
 *       200:
 *         description: Mahsulot muvaffaqiyatli qo'shildi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Product'
 *       500:
 *         description: Server xatosi
 */

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


// ==================== KLIENTLAR ====================

// Klientlarni qidirish
app.get('/api/customers/search', (req, res) => {
  try {
    const db = readDatabase();
    const query = req.query.q || '';
    
    if (!query.trim()) {
      return res.json({ success: true, data: [] });
    }
    
    const filteredCustomers = db.orders
      .map(o => o.customer)
      .filter(Boolean)
      .filter((customer, index, self) => self.indexOf(customer) === index)
      .filter(customer => customer.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 10); // Eng ko'pi bilan 10 ta
    
    res.json({ success: true, data: filteredCustomers });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Xatolik yuz berdi', error: error.message });
  }
});

// Barcha unikal klientlar
app.get('/api/customers', (req, res) => {
  try {
    const db = readDatabase();
    const uniqueCustomers = [...new Set(db.orders.map(o => o.customer).filter(Boolean))];
    res.json({ success: true, data: uniqueCustomers });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Xatolik yuz berdi', error: error.message });
  }
});

// ==================== KLIENT ZAKASLARI ====================

// Barcha klient zakaslarini olish
app.get('/api/customer-orders', (req, res) => {
  try {
    const db = readDatabase();
    if (!db.customerOrders) {
      db.customerOrders = [];
    }
    res.json({ success: true, data: db.customerOrders });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Xatolik yuz berdi', error: error.message });
  }
});

// Yangi klient zakasini qo'shish
app.post('/api/customer-orders', (req, res) => {
  try {
    const db = readDatabase();
    if (!db.customerOrders) {
      db.customerOrders = [];
    }
    
    const newOrder = {
      id: Date.now(),
      ...req.body,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    
    db.customerOrders.push(newOrder);
    writeDatabase(db);
    res.json({ success: true, data: newOrder });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Zakas qo\'shishda xatolik', error: error.message });
  }
});

// Klient zakasini yangilash (admin uchun)
app.put('/api/customer-orders/:id', (req, res) => {
  try {
    const db = readDatabase();
    if (!db.customerOrders) {
      db.customerOrders = [];
    }
    
    const id = parseInt(req.params.id);
    const index = db.customerOrders.findIndex(o => o.id === id);
    
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Zakas topilmadi' });
    }
    
    db.customerOrders[index] = {
      ...db.customerOrders[index],
      ...req.body,
      updatedAt: new Date().toISOString()
    };
    writeDatabase(db);
    res.json({ success: true, data: db.customerOrders[index] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Yangilashda xatolik', error: error.message });
  }
});

// Klient zakasini o'chirish (admin uchun)
app.delete('/api/customer-orders/:id', (req, res) => {
  try {
    const db = readDatabase();
    if (!db.customerOrders) {
      db.customerOrders = [];
    }
    
    const id = parseInt(req.params.id);
    const index = db.customerOrders.findIndex(o => o.id === id);
    
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Zakas topilmadi' });
    }
    
    const deleted = db.customerOrders.splice(index, 1);
    writeDatabase(db);
    res.json({ success: true, data: deleted[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'O\'chirishda xatolik', error: error.message });
  }
});


// ==================== RO'YXATDAN O'TISH ====================

// Register endpointi
app.post('/api/register', (req, res) => {
  try {
    const db = readDatabase();
    const { email, password } = req.body;
    
    // Validatsiya
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email va password talab qilinadi' 
      });
    }
    
    // Email formatini tekshirish
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Noto\'g\'ri email format' 
      });
    }
    
    // Boshqa foydalanuvchi borligini tekshirish
    const existingUser = db.users.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: 'Bu email allaqachon ro\'yxatdan o\'tgan' 
      });
    }
    
    // Yangi foydalanuvchi yaratish
    const newUser = {
      id: Date.now(),
      email,
      password, // Real loyihada hash qilish kerak!
      createdAt: new Date().toISOString()
    };
    
    db.users.push(newUser);
    writeDatabase(db);
    
    res.json({ 
      success: true, 
      message: 'Ro\'yxatdan o\'tish muvaffaqiyatli',
      data: {
        id: newUser.id,
        email: newUser.email,
        createdAt: newUser.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Ro\'yxatdan o\'tishda xatolik', 
      error: error.message 
    });
  }
});

// Login endpointi
app.post('/api/login', (req, res) => {
  try {
    const db = readDatabase();
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email va password talab qilinadi' 
      });
    }
    
    const user = db.users.find(u => u.email === email && u.password === password);
    
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Noto\'g\'ri email yoki password' 
      });
    }
    
    res.json({ 
      success: true, 
      message: 'Kirish muvaffaqiyatli',
      data: {
        id: user.id,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Kirishda xatolik', 
      error: error.message 
    });
  }
});