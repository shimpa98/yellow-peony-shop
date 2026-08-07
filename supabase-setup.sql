-- Политики RLS для Telegram Mini App (anon key)
-- Выполните в Supabase SQL Editor после создания таблиц

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Каталог — чтение для всех
CREATE POLICY "categories_read" ON categories FOR SELECT USING (true);
CREATE POLICY "products_read" ON products FOR SELECT USING (true);

-- Пользователи — вставка и обновление для всех (идентификация по telegram_id на клиенте)
ALTER TABLE users ADD COLUMN IF NOT EXISTS photo_url TEXT;
CREATE POLICY "users_insert" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "users_update" ON users FOR UPDATE USING (true);
CREATE POLICY "users_read" ON users FOR SELECT USING (true);

-- Избранное
CREATE POLICY "favorites_all" ON favorites FOR ALL USING (true) WITH CHECK (true);

-- Корзина
CREATE POLICY "cart_all" ON cart FOR ALL USING (true) WITH CHECK (true);

-- Заказы
CREATE POLICY "orders_insert" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "orders_read" ON orders FOR SELECT USING (true);

-- =====================================================
-- Тестовые данные (опционально)
-- =====================================================

INSERT INTO categories (name, slug, sort_order) VALUES
  ('Букеты', 'bouquets', 1),
  ('Розы', 'roses', 2),
  ('Комнатные', 'indoor', 3)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, category_id, price, price_options, description, in_stock) VALUES
  (
    'Букет «Нежность»',
    (SELECT id FROM categories WHERE slug = 'bouquets' LIMIT 1),
    2500,
    '[{"label": "Мини", "price": 1800}, {"label": "Стандарт", "price": 2500}, {"label": "Большой", "price": 3500}]'::jsonb,
    'Нежный букет из роз и эустомы в пастельных тонах',
    true
  ),
  (
    'Красные розы',
    (SELECT id FROM categories WHERE slug = 'roses' LIMIT 1),
    150,
    '[{"label": "11 шт", "price": 1500}, {"label": "25 шт", "price": 3200}, {"label": "51 шт", "price": 5800}]'::jsonb,
    'Классические красные розы премиум-класса',
    true
  ),
  (
    'Орхидея фаленопсис',
    (SELECT id FROM categories WHERE slug = 'indoor' LIMIT 1),
    3200,
    null,
    'Живое растение в декоративном горшке',
    true
  );
