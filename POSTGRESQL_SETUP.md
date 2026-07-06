# PostgreSQL Database Setup

## Nega PostgreSQL?

✅ **Ma'lumotlar doimiy saqlanadi** - Server restart bo'lsa ham  
✅ **Production'da ishlaydi** - Render.com, Vercel, Railway  
✅ **Tezroq** - File-based database'dan tezroq  
✅ **Xavfsizroq** - SQL injection himoyasi  
✅ **Bepul** - Render.com'da bepul PostgreSQL database

---

## 1. Lokal PostgreSQL O'rnatish (Windows)

### Variant A: PostgreSQL Official Installer (Tavsiya etiladi)

1. **Yuklab oling:**
   - https://www.postgresql.org/download/windows/
   - **PostgreSQL 16** versiyasini tanlang
   - EDB Installer yuklab oling

2. **O'rnating:**
   - Installer'ni ishga tushiring
   - Port: `5432` (default)
   - Password: `admin` (yoki o'zingiz o'ylagan)
   - Barcha default settings

3. **Tekshirish:**
   ```bash
   psql --version
   ```
   Ko'rinishi kerak: `psql (PostgreSQL) 16.x`

---

### Variant B: Docker (Agar Docker o'rnatilgan bo'lsa)

```bash
docker run --name postgres-admin -e POSTGRES_PASSWORD=admin -p 5432:5432 -d postgres:16
```

---

## 2. Database Yaratish

### Windows Command Prompt yoki PowerShell'da:

```bash
# PostgreSQL'ga kirish
psql -U postgres

# Password: admin (yoki o'zingizniki)

# Database yaratish
CREATE DATABASE admin_panel;

# Database'ga o'tish
\c admin_panel

# Chiqish
\q
```

---

## 3. Backend Environment Variable

### `.env` faylini yarating (`d:\Admin\backend\.env`):

```env
DATABASE_URL=postgresql://postgres:admin@localhost:5432/admin_panel
PORT=3001
```

⚠️ **Password:** `admin` ni o'zingizning PostgreSQL password bilan almashtiring!

---

## 4. Backend'ni Ishga Tushiring

```bash
cd backend
npm start
```

**Console'da ko'rinishi kerak:**
```
✅ PostgreSQL database connected
✅ Database tables initialized
🔄 Migrating data from database.json...
✅ Data migration completed successfully!
   - 3 products migrated
   - 1 orders migrated
   - 0 customer orders migrated
✅ database.json renamed to database.json.backup

╔═══════════════════════════════════════════╗
║  🚀 Backend Server ishga tushdi!         ║
║                                           ║
║  📍 URL: http://localhost:3001           ║
║  📊 Database: PostgreSQL                 ║
║  📚 Swagger: /api-docs                   ║
╚═══════════════════════════════════════════╝
```

---

## 5. Test Qilish

### API orqali:
```bash
# Products olish
curl http://localhost:3001/api/products

# Yangi mahsulot qo'shish
curl -X POST http://localhost:3001/api/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Product","weight":500,"packQuantity":24,"price":1.50}'
```

### Swagger UI orqali:
```
http://localhost:3001/api-docs
```

### Database'da tekshirish:
```bash
psql -U postgres admin_panel

# Barcha mahsulotlarni ko'rish
SELECT * FROM products;

# Barcha buyurtmalarni ko'rish
SELECT * FROM orders;

# Chiqish
\q
```

---

## 6. Production (Render.com)

### Render.com'da PostgreSQL Database:

1. **Render Dashboard** → **New +** → **PostgreSQL**
2. **Settings:**
   ```
   Name: admin-panel-db
   Database: admin_panel
   User: admin_panel_user
   Region: Frankfurt (EU) yoki Singapore
   PostgreSQL Version: 16
   Plan: Free
   ```
3. **Create Database**
4. **Connection String'ni ko'chirib oling:**
   ```
   postgresql://user:password@host:5432/dbname
   ```

### Backend Web Service'da:

1. **Backend Web Service'ga o'ting**
2. **Environment** → **Add Environment Variable:**
   ```
   Key: DATABASE_URL
   Value: postgresql://user:password@host:5432/dbname
   ```
   (Yuqorida ko'chirilgan connection string)
3. **Save**
4. **Manual Deploy** qiling

---

## 7. Migration

Backend ishga tushganda avtomatik:
1. `database.json` dan ma'lumotlarni o'qiydi
2. PostgreSQL'ga ko'chiradi
3. `database.json` ni `database.json.backup` ga o'zgartiradi

Keyinchalik faqat PostgreSQL ishlatiladi!

---

## 8. Muammolarni Hal Qilish

### Muammo: "psql: command not found"
**Yechim:** PostgreSQL PATH'ga qo'shilmagan
- Windows Search → "Environment Variables"
- System PATH'ga qo'shing: `C:\Program Files\PostgreSQL\16\bin`

### Muammo: "Connection refused"
**Yechim:** PostgreSQL service ishlamayapti
- Windows Services → PostgreSQL 16 → Start

### Muammo: "password authentication failed"
**Yechim:** Noto'g'ri password
- `.env` faylda `DATABASE_URL` ni tekshiring
- PostgreSQL password ni qayta o'rnating:
  ```sql
  ALTER USER postgres PASSWORD 'yangi_password';
  ```

### Muammo: "database admin_panel does not exist"
**Yechim:** Database yaratilmagan
```sql
psql -U postgres
CREATE DATABASE admin_panel;
```

---

## 9. Backup va Restore

### Backup:
```bash
pg_dump -U postgres admin_panel > backup.sql
```

### Restore:
```bash
psql -U postgres admin_panel < backup.sql
```

---

## 10. GUI Tools (Ixtiyoriy)

PostgreSQL'ni ko'rish uchun GUI:

- **pgAdmin 4** (rasmiy) - https://www.pgadmin.org/
- **DBeaver** (bepul) - https://dbeaver.io/
- **TablePlus** (chiroyli) - https://tableplus.com/

---

**PostgreSQL o'rnatgandan keyin backend'ni ishga tushiring! Ma'lumotlar endi doimiy saqlanadi! 🎉**
