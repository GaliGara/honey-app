# Honey — Productos de la colmena

Tienda en línea de productos apícolas artesanales. Construida con Next.js App Router, Supabase y pagos manuales.

---

## Stack

| Capa | Tecnología |
|------|-----------|
| Framework | Next.js 16.2.6 (App Router, Turbopack) |
| Lenguaje | TypeScript 5.x (strict) |
| Estilos | Tailwind CSS v4 (config via CSS `@theme`) |
| Base de datos | Supabase 2.106.1 (PostgreSQL + Row Level Security) |
| Estado global | Zustand 5.0.13 (persist + hydration SSR) |
| Formularios | react-hook-form 7.76.0 + zod 4.4.3 + @hookform/resolvers 5.4.0 |
| Package manager | pnpm 11.2.2 |
| Deploy objetivo | Vercel |

---

## Métodos de pago

Los pedidos se procesan de forma manual. No hay pasarela de pago integrada.

| Método | `payment_method` | Estado inicial |
|--------|-----------------|---------------|
| Transferencia SPEI | `bank_transfer` | `pending_transfer` |
| Depósito bancario | `bank_deposit` | `pending_deposit` |
| Pago contra entrega | `cash_on_delivery` | `pending_cash_payment` |

Los datos bancarios y de contacto se configuran en **`src/constants/payment.ts`**.
Ver [`docs/manual-payments.md`](docs/manual-payments.md) para el flujo completo.

---

## Configuración local

### Prerrequisitos

- Node.js 20+
- pnpm 11.2.2 (`npm i -g pnpm@11.2.2`)

### Instalación

```bash
pnpm install
```

> pnpm 11 requiere `pnpm-workspace.yaml` con permisos de build para `sharp` y `unrs-resolver`.
> El archivo ya está incluido en el repositorio.

### Variables de entorno

Copia el archivo de ejemplo y rellena los valores reales:

```bash
cp docs/env.example .env.local
```

| Variable | Descripción |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL del proyecto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clave anon (pública, RLS activo) |
| `SUPABASE_SERVICE_ROLE_KEY` | Clave service_role — **solo servidor**, nunca expongas en cliente |

> **Seguridad:** `SUPABASE_SERVICE_ROLE_KEY` bypasea RLS. Se usa únicamente en API Routes
> (`src/app/api/`). Nunca uses esta clave con el prefijo `NEXT_PUBLIC_`.

### Base de datos

Ejecuta el esquema SQL en el editor de Supabase:

```
docs/supabase-schema.sql
```

### Desarrollo

```bash
pnpm dev
```

Abre [http://localhost:3000](http://localhost:3000).

### Build de producción

```bash
pnpm build
```

---

## Estructura del proyecto

```
src/
├── app/
│   ├── api/orders/        # API Route — crea pedidos (server-only)
│   ├── checkout/          # Página de checkout
│   ├── gracias/           # Confirmación de pedido
│   └── ...                # Resto de páginas
├── components/
│   ├── checkout/          # CheckoutForm, OrderSummary, CheckoutSuccessCard
│   └── layout/            # Navbar, Footer
├── constants/
│   └── payment.ts         # Config de pagos: datos bancarios, labels, URLs
├── lib/
│   ├── supabase/          # Cliente Supabase + servicio de órdenes (server-only)
│   └── validations/       # Esquemas Zod
├── store/                 # Zustand: carrito
└── types/                 # TypeScript: order.ts, product.ts, database.ts
docs/
├── env.example            # Plantilla de variables de entorno
├── supabase-schema.sql    # Esquema completo de la base de datos
├── deployment-checklist.md
└── manual-payments.md
```

---

## Notas importantes

- **Sin autenticación** — no hay login de clientes. El panel de pedidos es un dashboard separado (no incluido en este repo).
- **Sin webhook** — los pedidos se confirman manualmente en Supabase tras verificar el comprobante de pago.
- **Datos bancarios placeholder** — actualiza `src/constants/payment.ts` antes de hacer deploy a producción.
- **Columnas de pasarela reservadas** — `payment_reference`, `payment_preference_id`, `payment_init_point`, `payment_status_detail` existen en la DB pero no se usan actualmente. Están reservadas para una futura integración con pasarela.

---

## Deploy

Ver [`docs/deployment-checklist.md`](docs/deployment-checklist.md) para el checklist completo antes de ir a producción.
