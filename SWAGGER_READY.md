# ✅ Swagger API Documentation Tayyor!

## Swagger UI'ni Ochish:

### Lokal (Development):
```
http://localhost:3001/api-docs
```

### Production (Render.com):
```
https://admin-backend-xxxx.onrender.com/api-docs
```

---

## API Endpoints:

### 🔹 Products (Mahsulotlar)
- `GET /api/products` - Barcha mahsulotlarni olish
- `POST /api/products` - Yangi mahsulot qo'shish
- `PUT /api/products/:id` - Mahsulotni yangilash
- `DELETE /api/products/:id` - Mahsulotni o'chirish

### 🔹 Orders (Buyurtmalar)
- `GET /api/orders` - Barcha buyurtmalarni olish
- `POST /api/orders` - Yangi buyurtma qo'shish
- `PUT /api/orders/:id` - Buyurtmani yangilash
- `DELETE /api/orders/:id` - Buyurtmani o'chirish

### 🔹 Customer Orders (Klient Zakaslari)
- `GET /api/customer-orders` - Barcha zakaslarni olish
- `POST /api/customer-orders` - Yangi zakas qo'shish
- `PUT /api/customer-orders/:id` - Zakasni yangilash
- `DELETE /api/customer-orders/:id` - Zakasni o'chirish

### 🔹 Customers (Klientlar)
- `GET /api/customers` - Barcha unique klientlar
- `GET /api/customers/search?q=name` - Klient qidirish

### 🔹 Authentication (Auth)
- `POST /api/register` - Ro'yxatdan o'tish
- `POST /api/login` - Tizimga kirish

### 🔹 Statistics (Statistika)
- `GET /api/stats` - Umumiy statistika

### 🔹 Health Check
- `GET /api/health` - Server holati

---

## Swagger'dan Foydalanish:

### 1. API'ni Ko'rish:
- Browser'da `http://localhost:3001/api-docs` ni oching
- Barcha endpoints ko'rinadi

### 2. API'ni Test Qilish:
- Har bir endpoint'ni bosing
- **"Try it out"** tugmasini bosing
- Kerakli parametrlarni kiriting
- **"Execute"** tugmasini bosing
- Response ko'rinadi

### 3. Schema Ko'rish:
- **Schemas** bo'limida barcha data modellar bor
- Product, Order, CustomerOrder va boshqalar

---

## Misol: Yangi Mahsulot Qo'shish

**Swagger UI'da:**
1. `POST /api/products` ni oching
2. **"Try it out"** bosing
3. Request body'ga kiriting:
```json
{
  "name": "Pepsi",
  "image": "https://example.com/pepsi.jpg",
  "stock": 500,
  "price": 1.20,
  "category": "Ichimliklar",
  "weight": 500,
  "packQuantity": 24
}
```
4. **"Execute"** bosing
5. Response:
```json
{
  "success": true,
  "data": {
    "id": 1783276315777,
    "name": "Pepsi",
    "image": "https://example.com/pepsi.jpg",
    "stock": 500,
    "price": 1.20,
    "category": "Ichimliklar",
    "weight": 500,
    "packQuantity": 24,
    "createdAt": "2026-07-05T..."
  }
}
```

---

## Swagger JSON Export:

API documentation JSON formatda:
```
http://localhost:3001/api-docs.json
```

Buni Postman'ga import qilish mumkin!

---

## Production Deploy:

Backend Render.com'da deploy qilingandan keyin:
```
https://admin-backend-xxxx.onrender.com/api-docs
```

Swagger UI avtomatik ishga tushadi!

---

## Afzalliklari:

✅ **API'ni ko'rish** - Barcha endpoints bir joyda  
✅ **API'ni test qilish** - Browser'dan to'g'ridan-to'g'ri  
✅ **Documentation** - Avtomatik yangilanadi  
✅ **Schema ko'rish** - Data modellarni ko'rish  
✅ **Postman export** - JSON export qilish mumkin  
✅ **Frontend uchun** - Qanday request yuborishni ko'rsatadi

---

**Backend'ni ishga tushiring va Swagger'ni sinab ko'ring!** 🚀
