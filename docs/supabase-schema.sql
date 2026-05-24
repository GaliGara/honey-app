-- ============================================================
-- Honey Shop — Supabase Schema
-- Fase 8.1: Métodos de pago manuales + Mercado Pago (prep)
--
-- Instrucciones:
-- 1. Abre tu proyecto en https://supabase.com
-- 2. Ve a SQL Editor
-- 3. Si es una base de datos nueva → ejecuta TODO desde CREATE TABLE
-- 4. Si ya tienes las tablas → ejecuta SOLO el bloque MIGRACIÓN
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

  -- ── Pago (Fase 8) ──────────────────────────────────────
  payment_provider      text DEFAULT 'mercado_pago',
  payment_status        text NOT NULL DEFAULT 'pending_payment',
  payment_reference     text,
  payment_preference_id text,
  payment_init_point    text,
  payment_status_detail text,
  paid_at               timestamptz,
  cancelled_at          timestamptz,

  -- ── Método manual (Fase 8.1) ───────────────────────────
  payment_method            text,
  payment_instructions      text,
  payment_proof_url         text,
  manual_payment_reference  text,

  created_at    timestamptz DEFAULT now()
);

COMMENT ON TABLE orders IS 'Pedidos del e-commerce Honey Shop';
COMMENT ON COLUMN orders.status IS
  'Estado logístico: pending | confirmed | shipped | delivered | cancelled';
COMMENT ON COLUMN orders.payment_provider IS
  'Procesador de pago: mercado_pago | manual';
COMMENT ON COLUMN orders.payment_status IS
  'Estado del pago: pending_transfer | pending_deposit | pending_cash_payment |'
  ' pending_payment | paid | payment_failed | cancelled | refunded';
COMMENT ON COLUMN orders.payment_method IS
  'Método elegido: bank_transfer | bank_deposit | cash_on_delivery | mercado_pago';
COMMENT ON COLUMN orders.payment_reference IS
  'ID de pago devuelto por Mercado Pago (payment_id)';
COMMENT ON COLUMN orders.payment_preference_id IS
  'ID de preferencia creada en Mercado Pago';
COMMENT ON COLUMN orders.payment_init_point IS
  'URL de checkout generada por Mercado Pago';
COMMENT ON COLUMN orders.payment_status_detail IS
  'Detalle adicional del estado (ej: accredited, pending_contingency)';
COMMENT ON COLUMN orders.payment_instructions IS
  'Instrucciones de pago generadas por el servidor (datos bancarios, etc.)';
COMMENT ON COLUMN orders.payment_proof_url IS
  'URL del comprobante de pago subido por el cliente (uso futuro)';
COMMENT ON COLUMN orders.manual_payment_reference IS
  'Referencia manual = order_number para métodos no-pasarela';


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

CREATE INDEX IF NOT EXISTS orders_order_number_idx          ON orders(order_number);
CREATE INDEX IF NOT EXISTS orders_customer_email_idx        ON orders(customer_email);
CREATE INDEX IF NOT EXISTS orders_payment_status_idx        ON orders(payment_status);
CREATE INDEX IF NOT EXISTS orders_payment_method_idx        ON orders(payment_method);
CREATE INDEX IF NOT EXISTS orders_payment_preference_id_idx ON orders(payment_preference_id);
CREATE INDEX IF NOT EXISTS order_items_order_id_idx         ON order_items(order_id);


-- ── Row Level Security ──────────────────────────────────────
-- Los inserts se hacen desde la API Route del servidor usando service_role,
-- que bypasea RLS automáticamente.
-- NO se necesitan policies INSERT para anon.
-- RLS habilitado para proteger contra acceso directo.

ALTER TABLE orders      ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Nota: No se crean policies para el rol anon.
-- Toda escritura pasa por /api/orders (service_role, servidor).
-- Toda lectura de admin se hará con service_role (dashboard futuro).


-- ============================================================
-- MIGRACIÓN — Solo para bases de datos existentes (Fase 6 / 6.1 / 8)
-- Ejecuta SOLO este bloque si ya tienes las tablas creadas.
-- ============================================================

-- Columnas de Fase 8 (Mercado Pago prep):
ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS payment_provider      text DEFAULT 'mercado_pago',
  ADD COLUMN IF NOT EXISTS payment_status        text NOT NULL DEFAULT 'pending_payment',
  ADD COLUMN IF NOT EXISTS payment_reference     text,
  ADD COLUMN IF NOT EXISTS payment_preference_id text,
  ADD COLUMN IF NOT EXISTS payment_init_point    text,
  ADD COLUMN IF NOT EXISTS payment_status_detail text,
  ADD COLUMN IF NOT EXISTS paid_at               timestamptz,
  ADD COLUMN IF NOT EXISTS cancelled_at          timestamptz;

-- Columnas de Fase 8.1 (métodos manuales):
ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS payment_method           text,
  ADD COLUMN IF NOT EXISTS payment_instructions     text,
  ADD COLUMN IF NOT EXISTS payment_proof_url        text,
  ADD COLUMN IF NOT EXISTS manual_payment_reference text;

-- Índices nuevos:
CREATE INDEX IF NOT EXISTS orders_payment_status_idx
  ON orders(payment_status);

CREATE INDEX IF NOT EXISTS orders_payment_method_idx
  ON orders(payment_method);

CREATE INDEX IF NOT EXISTS orders_payment_preference_id_idx
  ON orders(payment_preference_id);


-- ============================================================
-- LIMPIEZA (solo si ejecutaste el schema de Fase 6 con anon policies)
-- ============================================================
-- DROP POLICY IF EXISTS "anon_insert_orders"      ON orders;
-- DROP POLICY IF EXISTS "anon_insert_order_items" ON order_items;
-- DROP POLICY IF EXISTS "anon_select_orders"      ON orders;
-- DROP POLICY IF EXISTS "anon_select_order_items" ON order_items;
