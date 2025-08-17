-- Insert sample admin user (you'll need to sign up first, then update the role)
-- This is just for reference - the actual user will be created through auth

-- Insert sample products
INSERT INTO products (name, description, price, category, sku) VALUES
  ('Laptop Computer', 'High-performance business laptop', 999.99, 'Electronics', 'LAP-001'),
  ('Office Chair', 'Ergonomic office chair with lumbar support', 299.99, 'Furniture', 'CHR-001'),
  ('Wireless Mouse', 'Bluetooth wireless mouse', 49.99, 'Electronics', 'MOU-001'),
  ('Desk Lamp', 'LED desk lamp with adjustable brightness', 79.99, 'Furniture', 'LAM-001'),
  ('Notebook Set', 'Pack of 5 professional notebooks', 24.99, 'Stationery', 'NOT-001'),
  ('Coffee Mug', 'Ceramic coffee mug 12oz', 12.99, 'Kitchen', 'MUG-001'),
  ('USB Cable', '6ft USB-C charging cable', 19.99, 'Electronics', 'USB-001'),
  ('Pen Set', 'Set of 10 ballpoint pens', 15.99, 'Stationery', 'PEN-001')
ON CONFLICT (sku) DO NOTHING;
