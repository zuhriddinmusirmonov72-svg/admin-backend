-- Admin Panel Database Schema
-- PostgreSQL

-- Products table (Mahsulotlar)
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

-- Orders table (Buyurtmalar)
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
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Order lines table (Buyurtma qatorlari)
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

-- Customer orders table (Klient zakaslari)
CREATE TABLE IF NOT EXISTS customer_orders (
    id BIGSERIAL PRIMARY KEY,
    customer_name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(50) NOT NULL,
    product_id BIGINT,
    product_name VARCHAR(255),
    product_price DECIMAL(10, 2),
    product_weight INTEGER,
    product_pack_quantity INTEGER,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Users table (Foydalanuvchilar)
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_name ON products(name);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_customer ON orders(customer);
CREATE INDEX IF NOT EXISTS idx_order_lines_order_id ON order_lines(order_id);
CREATE INDEX IF NOT EXISTS idx_customer_orders_status ON customer_orders(status);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Insert test data (agar mahsulotlar bo'sh bo'lsa)
INSERT INTO products (name, image, stock, price, category, weight, pack_quantity)
SELECT 'Coca Cola', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8qffjjryhIs66zjCTtF_Vdm4quhOzymUP4vBdSEvvOw&s=10', 1000, 1.00, 'Ichimliklar', 500, 24
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Coca Cola');

INSERT INTO products (name, image, stock, price, category, weight, pack_quantity)
SELECT 'Pepsi', 'https://example.com/pepsi.jpg', 1000, 1.00, 'Ichimliklar', 500, 24
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Pepsi');

INSERT INTO products (name, image, stock, price, category, weight, pack_quantity)
SELECT 'Fanta', 'https://example.com/fanta.jpg', 1000, 0.90, 'Ichimliklar', 500, 24
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Fanta');
