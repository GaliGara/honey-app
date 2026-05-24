-- ============================================================
-- Honey Shop — Supabase Schema
-- Fase 6: Órdenes locales (sin auth)
--
-- Instrucciones:
-- 1. Abre tu proyecto en https://supabase.com
-- 2. Ve a SQL Editor
-- 3. Pega y ejecuta este script completo
-- ============================================================


-- ── Tabla: orders ──────────────────────────────────────────

CREATE TABLE IF NOT EXISTS orders (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number  text NOT NULL UNIQUE,
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text NOT NULL,
  address       text NOT NULL,
  city          text NOT NULL,
  state         text,
  postal_code   text,
  notes         text,
  subtotal      numeric(10, 2) NOT NULL,
  shipping      numeric(10, 2) NOT NULL,
  taxes         numeric(10, 2) NOT NULL,
  total         numeric(10, 2) NOT NULL,
  status        text NOT NULL DEFAULT 'pending',
  created_at    timestamptz DEFAULT now()
);

COMMENT ON TABLE orders IS 'Pedidos del e-commerce Honey Shop';
COMMENT ON COLUMN orders.status IS 'Estado: pending | confirmed | shipped | delivered | cancelled';


-- ── Tabla: order_items ─────────────────────────────────────

CREATE TABLE IF NOT EXISTS order_items (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id         uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id       text NOT NULL,
  product_slug     text NOT NULL,
  product_name     text NOT NULL,
  product_category text NOT NULL,
  product_size     text,
  quantity         integer NOT NULL CHECK (quantity > 0),
  unit_price       numeric(10, 2) NOT NULL,
  total            numeric(10, 2) NOT NULL,
  created_at       timestamptz DEFAULT now()
);

COMMENT ON TABLE order_items IS 'Líneas de cada pedido';


-- ── Índices ────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS orders_order_number_idx    ON orders(order_number);
CREATE INDEX IF NOT EXISTS orders_customer_email_idx  ON orders(customer_email);
CREATE INDEX IF NOT EXISTS order_items_order_id_idx   ON order_items(order_id);


-- ── Row Level Security ──────────────────────────────────────
-- ADVERTENCIA: estas políticas son permisivas para la fase MVP.
-- Antes de producción real se deben limitar a usuarios autenticados
-- o validar con una Edge Function intermediaria.

ALTER TABLE orders     ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Permite insertar desde el anon key (frontend sin auth)
-- TODO Fase 6+: reemplazar con auth.uid() check cuando se agregue auth
CREATE POLICY "anon_insert_orders"
  ON orders
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "anon_insert_order_items"
  ON order_items
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Solo el rol service_role puede leer y modificar pedidos (admin futuro)
-- (no crear política de SELECT para anon por seguridad)
