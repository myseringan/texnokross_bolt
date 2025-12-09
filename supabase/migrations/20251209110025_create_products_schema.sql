/*
  # Create Texnokross E-commerce Schema

  1. New Tables
    - `categories`
      - `id` (uuid, primary key)
      - `name` (text, category name)
      - `slug` (text, URL-friendly name)
      - `created_at` (timestamptz)
    
    - `products`
      - `id` (uuid, primary key)
      - `category_id` (uuid, foreign key to categories)
      - `name` (text, product name)
      - `description` (text, product description)
      - `price` (decimal, product price)
      - `image_url` (text, product image)
      - `specifications` (jsonb, technical specs)
      - `in_stock` (boolean, availability)
      - `created_at` (timestamptz)
    
    - `cart_items`
      - `id` (uuid, primary key)
      - `session_id` (text, guest session identifier)
      - `product_id` (uuid, foreign key to products)
      - `quantity` (integer, item quantity)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Allow public read access to categories and products
    - Allow public access to cart_items for guest shopping
*/

CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  name text NOT NULL,
  description text NOT NULL,
  price decimal(10,2) NOT NULL,
  image_url text NOT NULL,
  specifications jsonb DEFAULT '{}',
  in_stock boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS cart_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  quantity integer DEFAULT 1,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view categories"
  ON categories FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can view products"
  ON products FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can view their cart items"
  ON cart_items FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can add to cart"
  ON cart_items FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can update cart items"
  ON cart_items FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete cart items"
  ON cart_items FOR DELETE
  TO public
  USING (true);

INSERT INTO categories (name, slug) VALUES
  ('Холодильники', 'refrigerators'),
  ('Стиральные машины', 'washing-machines'),
  ('Телевизоры', 'televisions'),
  ('Кондиционеры', 'air-conditioners'),
  ('Микроволновые печи', 'microwaves'),
  ('Пылесосы', 'vacuums');

INSERT INTO products (category_id, name, description, price, image_url, specifications) VALUES
  (
    (SELECT id FROM categories WHERE slug = 'refrigerators'),
    'Samsung RB38T776',
    'Современный холодильник с технологией No Frost и умным управлением температурой',
    89999.00,
    'https://images.pexels.com/photos/2343468/pexels-photo-2343468.jpeg',
    '{"volume": "385 л", "energy_class": "A++", "freezer": "130 л", "color": "Серебристый"}'
  ),
  (
    (SELECT id FROM categories WHERE slug = 'washing-machines'),
    'LG F4V5VS0W',
    'Стиральная машина с функцией пара и инверторным двигателем',
    65999.00,
    'https://images.pexels.com/photos/5591663/pexels-photo-5591663.jpeg',
    '{"load": "9 кг", "spin": "1400 об/мин", "energy_class": "A+++", "color": "Белый"}'
  ),
  (
    (SELECT id FROM categories WHERE slug = 'televisions'),
    'Sony XR-65A80J',
    '4K OLED телевизор с процессором Cognitive и Dolby Vision',
    179999.00,
    'https://images.pexels.com/photos/1444416/pexels-photo-1444416.jpeg',
    '{"screen": "65 дюймов", "resolution": "4K UHD", "smart_tv": "Google TV", "hdr": "Dolby Vision"}'
  ),
  (
    (SELECT id FROM categories WHERE slug = 'air-conditioners'),
    'Daikin FTXM35R',
    'Инверторный кондиционер с функцией очистки воздуха',
    54999.00,
    'https://images.pexels.com/photos/5490235/pexels-photo-5490235.jpeg',
    '{"power": "3.5 кВт", "area": "35 м²", "inverter": "Да", "energy_class": "A++"}'
  ),
  (
    (SELECT id FROM categories WHERE slug = 'microwaves'),
    'Panasonic NN-SD38HS',
    'Микроволновая печь с инверторной технологией и грилем',
    18999.00,
    'https://images.pexels.com/photos/3958509/pexels-photo-3958509.jpeg',
    '{"volume": "23 л", "power": "950 Вт", "grill": "Да", "inverter": "Да"}'
  ),
  (
    (SELECT id FROM categories WHERE slug = 'vacuums'),
    'Dyson V15 Detect',
    'Беспроводной пылесос с лазерным обнаружением пыли',
    74999.00,
    'https://images.pexels.com/photos/4107278/pexels-photo-4107278.jpeg',
    '{"type": "Вертикальный", "battery": "60 мин", "power": "230 Вт", "hepa": "Да"}'
  );