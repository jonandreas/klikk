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
INSERT INTO products (id, name, description, price, image_emoji, stock_quantity) VALUES
  (uuid_generate_v4(), 'Premium Cotton T-Shirt', 'High-quality, sustainable cotton', 29.99, '👕', 100)
ON CONFLICT DO NOTHING;

-- Insert product variants for the T-shirt
WITH product AS (SELECT id FROM products WHERE name = 'Premium Cotton T-Shirt' LIMIT 1)
INSERT INTO product_variants (product_id, color, size, sku, stock_quantity) VALUES
  ((SELECT id FROM product), 'Black', 'M', 'TSHIRT-BLK-M', 30),
  ((SELECT id FROM product), 'White', 'M', 'TSHIRT-WHT-M', 25),
  ((SELECT id FROM product), 'Blue', 'M', 'TSHIRT-BLU-M', 20)
ON CONFLICT DO NOTHING;

-- Sample user data will be added programmatically through the application
-- since it requires coordination with Supabase Auth