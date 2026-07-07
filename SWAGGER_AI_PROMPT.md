# Swagger AI uchun Admin Panel API Dokumentatsiyasi Prompty

Mening **Admin Panel Backend API**m uchun to'liq va professional Swagger/OpenAPI 3.0 dokumentatsiya yarating.

## Backend API haqida umumiy ma'lumot

**Texnologiya:** Node.js + Express.js  
**Ma'lumotlar bazasi:** JSON fayl (database.json)  
**CORS:** Ochiq (barcha domenlar)  
**URL'lar:**
- Development: `http://localhost:3001`
- Production: `https://admin-backend-3-ss1w.onrender.com`

---

## API Endpointlar va ularning vazif

alari

### 1. MAHSULOTLAR (PRODUCTS) - `/api/products`

#### GET `/api/products` - Barcha mahsulotlarni olish
- **Vazifasi:** Barcha mahsulotlarni ro'yxatini qaytaradi
- **Response:** 
```json
{
  "success": true,
  "data": [
    {
      "id": 1783276315777,
      "name": "pepsi",
      "image": "https://...",
      "stock": 947,
      "price": 12,
      "category": "",
      "weight": 900,
      "packQuantity": 24,
      "createdAt": "2026-07-05T18:31:55.777Z",
      "updatedAt": "2026-07-06T14:17:40.412Z"
    }
  ]
}
```

#### POST `/api/products` - Yangi mahsulot qo'shish
- **Vazifasi:** Yangi mahsulot yaratadi va database.json ga saqlaydi
- **Request Body:**
```json
{
  "name": "Coca Cola",
  "image": "https://example.com/image.jpg",
  "stock": 1000,
  "price": 12,
  "category": "Ichimliklar",
  "weight": 1000,
  "packQuantity": 24
}
```
- **Majburiy maydonlar:** `name`, `weight`
- **Response:** Yaratilgan mahsulot ob'ekti

#### PUT `/api/products/:id` - Mahsulotni yangilash
- **Vazifasi:** Mavjud mahsulot ma'lumotlarini yangilaydi
- **URL Parametr:** `id` (integer) - mahsulot ID
- **Request Body:** Yangilash kerak bo'lgan maydonlar (qisman ham bo'lishi mumkin)
- **Response:** Yangilangan mahsulot ob'ekti

#### DELETE `/api/products/:id` - Mahsulotni o'chirish
- **Vazifasi:** Mahsulotni database'dan o'chiradi
- **URL Parametr:** `id` (integer) - mahsulot ID
- **Response:** O'chirilgan mahsulot ob'ekti

---

### 2. BUYURTMALAR (ORDERS) - `/api/orders`

#### GET `/api/orders` - Barcha buyurtmalarni olish
- **Vazifasi:** Barcha buyurtmalarni ro'yxatini qaytaradi
- **Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1783277338870,
      "orderNumber": "#ORD-001",
      "customer": "Samar",
      "phone": "",
      "date": "2026-07-05T18:48:58.863Z",
      "status": "Jo'natilgan",
      "warehouse": "Склад",
      "address": "",
      "comment": "",
      "currency": "USD",
      "lines": [
        {
          "id": 1783277335256,
          "productId": 1783276360742,
          "name": "coco cola",
          "image": "https://...",
          "qty": 21,
          "price": 12,
          "discount": 0
        }
      ],
      "createdAt": "2026-07-05T18:48:58.870Z"
    }
  ]
}
```

#### POST `/api/orders` - Yangi buyurtma qo'shish
- **Vazifasi:** Yangi buyurtma yaratadi, avtomatik order number beradi (#ORD-XXX)
- **Request Body:**
```json
{
  "customer": "Ali Valiyev",
  "phone": "+998901234567",
  "date": "2026-07-06T10:00:00.000Z",
  "status": "Jo'natilmagan",
  "warehouse": "Склад",
  "address": "Toshkent, Chilonzor",
  "comment": "Tezroq yetkazib bering",
  "currency": "USD",
  "lines": [
    {
      "id": 1783277335256,
      "productId": 1783276360742,
      "name": "coco cola",
      "image": "https://...",
      "qty": 10,
      "price": 12,
      "discount": 0
    }
  ]
}
```
- **Status qiymatlari:** "Jo'natilmagan", "Jo'natilgan", "Bekor qilindi"
- **Currency qiymatlari:** "USD", "UZS"
- **Response:** Yaratilgan buyurtma (orderNumber avtomatik qo'shiladi)

#### PUT `/api/orders/:id` - Buyurtmani yangilash
- **Vazifasi:** Mavjud buyurtma ma'lumotlarini yangilaydi
- **URL Parametr:** `id` (integer) - buyurtma ID
- **Request Body:** Yangilash kerak bo'lgan maydonlar
- **Response:** Yangilangan buyurtma ob'ekti

#### DELETE `/api/orders/:id` - Buyurtmani o'chirish
- **Vazifasi:** Buyurtmani database'dan o'chiradi
- **URL Parametr:** `id` (integer) - buyurtma ID
- **Response:** O'chirilgan buyurtma ob'ekti

---

### 3. KLIENTLAR (CUSTOMERS) - `/api/customers`

#### GET `/api/customers/search?q={query}` - Klientlarni qidirish
- **Vazifasi:** Buyurtmalardagi klientlarni ism bo'yicha qidiradi
- **Query Parameter:** `q` (string) - qidiruv so'zi
- **Response:** Klient ismlari ro'yxati (maksimal 10 ta)
- **Misol:** `/api/customers/search?q=Ali`

#### GET `/api/customers` - Barcha unikal klientlar
- **Vazifasi:** Barcha unikal klient ismlarini qaytaradi
- **Response:** Klient ismlari array

---

### 4. KLIENT ZAKASI (CUSTOMER ORDERS) - `/api/customer-orders`

#### GET `/api/customer-orders` - Barcha klient zakaslarini olish
- **Vazifasi:** Klientlar tomonidan berilgan zakaslarni ro'yxatini qaytaradi
- **Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1783346391541,
      "customerName": "Aziz",
      "phoneNumber": "998901234567",
      "productId": 1783276315777,
      "productName": "pepsi",
      "productPrice": 12,
      "productWeight": 900,
      "productPackQuantity": 24,
      "status": "pending",
      "createdAt": "2026-07-06T13:59:51.541Z"
    }
  ]
}
```

#### POST `/api/customer-orders` - Yangi klient zakasini qo'shish
- **Vazifasi:** Klient tomonidan mahsulot zakasini yaratadi
- **Request Body:**
```json
{
  "customerName": "Ali",
  "phoneNumber": "998901234567",
  "productId": 1783276315777,
  "productName": "pepsi",
  "productPrice": 12,
  "productWeight": 900,
  "productPackQuantity": 24
}
```
- **Majburiy maydonlar:** `customerName` (kamida 3 harf), `phoneNumber` (faqat raqamlar), `productId`
- **Status avtomatik:** "pending"
- **Response:** Yaratilgan zakas ob'ekti

#### PUT `/api/customer-orders/:id` - Klient zakasini yangilash (admin)
- **Vazifasi:** Admin klient zakasini tasdiqlab yoki bekor qila oladi
- **URL Parametr:** `id` (integer) - zakas ID
- **Request Body:** `{ "status": "confirmed" }` yoki `{ "status": "cancelled" }`
- **Status qiymatlari:** "pending", "confirmed", "cancelled"
- **Response:** Yangilangan zakas ob'ekti

#### DELETE `/api/customer-orders/:id` - Klient zakasini o'chirish (admin)
- **Vazifasi:** Admin zakas ni database'dan o'chiradi
- **URL Parametr:** `id` (integer) - zakas ID
- **Response:** O'chirilgan zakas ob'ekti

---

### 5. AUTENTIFIKATSIYA (AUTH)

#### POST `/api/register` - Ro'yxatdan o'tish
- **Vazifasi:** Yangi foydalanuvchi yaratadi
- **Request Body:**
```json
{
  "email": "user@example.com",
  "password": "mypassword123"
}
```
- **Validatsiya:** 
  - Email formati to'g'ri bo'lishi kerak
  - Email unique bo'lishi kerak
  - Password majburiy
- **Response:** Yaratilgan foydalanuvchi ma'lumotlari (password qaytmaydi)

#### POST `/api/login` - Tizimga kirish
- **Vazifasi:** Foydalanuvchini autentifikatsiya qiladi
- **Request Body:**
```json
{
  "email": "admin@gmail.com",
  "password": "admin"
}
```
- **Response:** Foydalanuvchi ma'lumotlari (password qaytmaydi)
- **Error:** 401 status agar email yoki password noto'g'ri bo'lsa

---

### 6. STATISTIKA (STATS) - `/api/stats`

#### GET `/api/stats` - Umumiy statistika
- **Vazifasi:** Dashboard uchun umumiy statistikani qaytaradi
- **Response:**
```json
{
  "success": true,
  "data": {
    "totalProducts": 7,
    "totalOrders": 3,
    "completedOrders": 2,
    "pendingOrders": 0,
    "canceledOrders": 1
  }
}
```

---

### 7. SERVER HEALTH - `/api/health`

#### GET `/api/health` - Server holatini tekshirish
- **Vazifasi:** Server ishlab turganini tekshirish
- **Response:**
```json
{
  "success": true,
  "message": "Server ishlamoqda!",
  "timestamp": "2026-07-06T14:00:00.000Z"
}
```

---

## Swagger AI uchun maxsus ko'rsatmalar

1. **To'liq OpenAPI 3.0 spec yarating** - barcha endpoint, schema, response, error kodlari bilan
2. **Request/Response misollarini qo'shing** - har bir endpoint uchun real JSON misollar
3. **Validatsiya qoidalarini yozing** - required fields, min/max uzunlik, format
4. **Error response'larni hujjatlang** - 400, 401, 404, 500 statuslar
5. **Schema component'larini yarating** - Product, Order, CustomerOrder, Error, Success
6. **Tag'lar qo'shing** - har bir endpoint uchun tegishli kategoriya
7. **Security schema qo'shing** - kelgusida JWT uchun (hozir ochiq)
8. **Description'larni batafsil yozing** - har bir field va endpoint uchun

---

## Qo'shimcha talablar

- Barcha matnlarni **O'zbek tilida** yozing (faqat JSON key'lar inglizcha)
- Admin panel uchun mo'ljallangan API ekanligini ko'rsating
- Production va Development server URL'larini ko'rsating
- Swagger UI'da chiroyli ko'rinishi uchun formatlang
- Real misollarda mening database.json'dagi ma'lumotlardan foydalaning

---

Swagger AI, yuqoridagi ma'lumotlarga asoslanib, mening Admin Panel API'm uchun **to'liq, professional va ishlatishga tayyor** Swagger/OpenAPI 3.0 dokumentatsiyasini yarating!
