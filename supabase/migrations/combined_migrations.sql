-- Combined migrations file to run in Supabase SQL Editor
-- This file contains all migrations in a single script

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table for customer information
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_id UUID UNIQUE, -- Link to Supabase Auth user
  email VARCHAR NOT NULL UNIQUE,
  phone VARCHAR UNIQUE,
  first_name VARCHAR,
  last_name VARCHAR,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE,
  
  -- Address fields
  address_line1 VARCHAR,
  address_line2 VARCHAR,
  city VARCHAR,
  postal_code VARCHAR,
  country VARCHAR DEFAULT 'Iceland'
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  sku VARCHAR UNIQUE,
  image_url VARCHAR,
  image_emoji VARCHAR(8), -- For emoji representation
  stock_quantity INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Product variants table
CREATE TABLE IF NOT EXISTS product_variants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  color VARCHAR,
  size VARCHAR,
  sku VARCHAR, 
  price DECIMAL(10, 2),
  stock_quantity INTEGER DEFAULT 0
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  status VARCHAR NOT NULL DEFAULT 'pending',
  total_amount DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Shipping address
  shipping_address_line1 VARCHAR,
  shipping_address_line2 VARCHAR,
  shipping_city VARCHAR,
  shipping_postal_code VARCHAR,
  shipping_country VARCHAR DEFAULT 'Iceland',
  
  -- Payment info
  payment_method VARCHAR,
  payment_status VARCHAR DEFAULT 'pending',
  payment_reference VARCHAR
);

-- Order items linking orders to products
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  variant_id UUID REFERENCES product_variants(id),
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10, 2) NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL
);

-- Verification codes table for OTP
CREATE TABLE IF NOT EXISTS verification_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  phone VARCHAR NOT NULL,
  code VARCHAR NOT NULL,
  attempts INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() + INTERVAL '10 minutes',
  verified BOOLEAN DEFAULT FALSE
);

-- Payment methods saved by users
CREATE TABLE IF NOT EXISTS payment_methods (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  method_type VARCHAR NOT NULL,
  label VARCHAR NOT NULL,
  last_four VARCHAR,
  expiry_date VARCHAR,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Country options reference table
CREATE TABLE IF NOT EXISTS countries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(3) NOT NULL UNIQUE,
  name VARCHAR NOT NULL UNIQUE,
  is_active BOOLEAN DEFAULT TRUE
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE countries ENABLE ROW LEVEL SECURITY;

-- Create RLS policies

-- Users table RLS
CREATE POLICY "Users can view their own data" ON users
  FOR SELECT USING (auth.uid() = auth_id);
  
CREATE POLICY "Users can update their own data" ON users
  FOR UPDATE USING (auth.uid() = auth_id);

-- Products table RLS (public read)
CREATE POLICY "Products are viewable by everyone" ON products
  FOR SELECT USING (true);
  
-- Product variants RLS (public read)
CREATE POLICY "Product variants are viewable by everyone" ON product_variants
  FOR SELECT USING (true);
  
-- Orders table RLS
CREATE POLICY "Users can view their own orders" ON orders
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = orders.user_id AND users.auth_id = auth.uid()
    )
  );
  
CREATE POLICY "Users can create their own orders" ON orders
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = orders.user_id AND users.auth_id = auth.uid()
    )
  );

-- Order items RLS
CREATE POLICY "Users can view their own order items" ON order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders 
      JOIN users ON users.id = orders.user_id 
      WHERE orders.id = order_items.order_id AND users.auth_id = auth.uid()
    )
  );

-- Verification codes RLS (service role only)
CREATE POLICY "Verification codes are managed by service role" ON verification_codes
  FOR ALL USING (true);
  
-- Payment methods RLS
CREATE POLICY "Users can view their own payment methods" ON payment_methods
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = payment_methods.user_id AND users.auth_id = auth.uid()
    )
  );
  
CREATE POLICY "Users can manage their own payment methods" ON payment_methods
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = payment_methods.user_id AND users.auth_id = auth.uid()
    )
  );

-- Countries table RLS (public read)
CREATE POLICY "Countries are viewable by everyone" ON countries
  FOR SELECT USING (true);

-- Seed countries table
INSERT INTO countries (code, name) VALUES
  ('IS', 'Iceland'),
  ('DK', 'Denmark'),
  ('NO', 'Norway'),
  ('SE', 'Sweden'),
  ('FI', 'Finland'),
  ('US', 'United States'),
  ('GB', 'United Kingdom'),
  ('DE', 'Germany'),
  ('FR', 'France'),
  ('ES', 'Spain')
ON CONFLICT (code) DO NOTHING;

-- Insert sample products
INSERT INTO products (name, description, price, image_emoji, stock_quantity) VALUES
  ('Premium Cotton T-Shirt', 'High-quality, sustainable cotton', 29.99, '👕', 100)
ON CONFLICT DO NOTHING;

-- Insert product variants for the T-shirt
WITH product AS (SELECT id FROM products WHERE name = 'Premium Cotton T-Shirt' LIMIT 1)
INSERT INTO product_variants (product_id, color, size, sku, stock_quantity) VALUES
  ((SELECT id FROM product), 'Black', 'M', 'TSHIRT-BLK-M', 30),
  ((SELECT id FROM product), 'White', 'M', 'TSHIRT-WHT-M', 25),
  ((SELECT id FROM product), 'Blue', 'M', 'TSHIRT-BLU-M', 20)
ON CONFLICT DO NOTHING;