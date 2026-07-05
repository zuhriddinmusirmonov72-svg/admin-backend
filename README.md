# Backend Server - O'rnatish va ishga tushirish

## 📦 O'rnatish

1. Backend papkasiga kirish:
```bash
cd backend
```

2. Node.js paketlarni o'rnatish:
```bash
npm install
```

## 🚀 Serverni ishga tushirish

Backend serverni ishga tushirish uchun:

```bash
npm start
```

yoki

```bash
node server.js
```

Server `http://localhost:3001` da ishga tushadi.

## 📡 API Endpoints

### Mahsulotlar (Products)
- `GET /api/products` - Barcha mahsulotlarni olish
- `POST /api/products` - Yangi mahsulot qo'shish
- `PUT /api/products/:id` - Mahsulotni yangilash
- `DELETE /api/products/:id` - Mahsulotni o'chirish

### Buyurtmalar (Orders)
- `GET /api/orders` - Barcha buyurtmalarni olish
- `POST /api/orders` - Yangi buyurtma qo'shish
- `PUT /api/orders/:id` - Buyurtmani yangilash
- `DELETE /api/orders/:id` - Buyurtmani o'chirish

### Boshqa
- `GET /api/stats` - Statistika olish
- `GET /api/health` - Server holatini tekshirish

## 💾 Ma'lumotlar bazasi

Ma'lumotlar `backend/database.json` faylida saqlanadi. Bu fayl avtomatik ravishda yaratiladi.

## 🌐 Online joylashtirish (Deployment)

Backend serverni online qilish uchun quyidagi platformalardan foydalaning:

### 1. Render.com (Tavsiya etiladi - BEPUL)
1. [render.com](https://render.com) ga ro'yxatdan o'ting
2. GitHub repoingizni ulang
3. "New Web Service" tugmasini bosing
4. Backend papkangizni tanlang
5. Environment variables qo'shing: `PORT=3001`
6. Deploy bosing
7. Sizga `https://your-app.onrender.com` kabi URL beriladi

### 2. Railway.app (BEPUL)
1. [railway.app](https://railway.app) ga kiring
2. GitHub repo ulang
3. Backend serverni deploy qiling
4. Avtomatik URL oling

### 3. Cyclic.sh (BEPUL)
1. [cyclic.sh](https://cyclic.sh) ga ro'yxatdan o'ting
2. GitHub reponi ulang
3. Deploy qiling

## 🔧 Frontend bilan bog'lash

Backend ishga tushgandan keyin, frontend `.env` faylida API URL ni o'zgartiring:

```env
VITE_API_URL=http://localhost:3001
```

Online qilganingizda:
```env
VITE_API_URL=https://your-backend-url.onrender.com
```

## ⚠️ Muhim eslatmalar

1. **Backend doim ishlab turishi kerak** - Buyurtmalar va mahsulotlar saqlanishi uchun
2. **database.json fayliga kirish** - Barcha ma'lumotlar shu yerda saqlanadi
3. **CORS yoqilgan** - Har qanday domendan so'rov yuborish mumkin
4. **Internet bo'lishi shart** - Backend server ishlamasa, frontend ham ishlamaydi

## 🐛 Muammolar

Agar server ishlamasa:
1. Node.js o'rnatilganligini tekshiring: `node --version`
2. Paketlar o'rnatilganligini tekshiring: `npm install`
3. Port band emasligini tekshiring
4. Console da xatoliklarni ko'ring
