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
| `ADMIN_PASSWORD` | Contraseña del panel admin |
| `ADMIN_SESSION_TOKEN` | Token aleatorio para cookie httpOnly del admin |

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
│   ├── api/admin/         # API Routes protegidas del admin
│   ├── admin/             # Login y panel de administración
│   ├── checkout/          # Página de checkout
│   ├── gracias/           # Confirmación de pedido
│   └── ...                # Resto de páginas
├── components/
│   ├── admin/             # Shell, dashboard, pedidos y acciones admin
│   ├── checkout/          # CheckoutForm, OrderSummary, CheckoutSuccessCard
│   └── layout/            # Navbar, Footer
├── constants/
│   └── payment.ts         # Config de pagos: datos bancarios, labels, URLs
├── lib/
│   ├── admin/             # Auth cookie + consultas admin server-only
│   ├── supabase/          # Cliente Supabase + servicio de órdenes (server-only)
│   └── validations/       # Esquemas Zod
├── store/                 # Zustand: carrito
└── types/                 # TypeScript: order.ts, product.ts, database.ts
docs/
├── env.example            # Plantilla de variables de entorno
├── supabase-schema.sql    # Esquema completo de la base de datos
├── admin-dashboard.md     # Guía de operación del admin
├── deployment-checklist.md
└── manual-payments.md
```

---

## Notas importantes

- **Sin autenticación de clientes** — `/cuenta` es una vista mock. El admin sí tiene login protegido con cookie httpOnly.
- **Admin server-only** — `/admin` y rutas hijas usan `requireAdminAuth()`. Las API `/api/admin/*` validan cookie antes de leer o actualizar pedidos.
- **Sin webhook** — los pedidos se confirman manualmente en Supabase tras verificar el comprobante de pago.
- **Datos bancarios placeholder** — actualiza `src/constants/payment.ts` antes de hacer deploy a producción.
- **Columnas de pasarela reservadas** — `payment_reference`, `payment_preference_id`, `payment_init_point`, `payment_status_detail` existen en la DB pero no se usan actualmente. Están reservadas para una futura integración con pasarela.
- **Productos sin fotos reales** — el catálogo usa visuales CSS. Para fotos finales agrega `imageUrl`, `imageAlt` y `visualMode: "image"` en `src/constants/products.ts`.

## Pendiente antes de producción

- Configurar datos bancarios reales en `src/constants/payment.ts`: banco, CLABE, WhatsApp y email.
- No publicar con placeholders: `Nombre del banco`, `000000000000000000`, `+52 000 000 0000`, `pagos@honey.mx`.
- Revisar y publicar textos legales; hoy los links de privacidad y términos apuntan a `#`.
- Crear Aviso de privacidad, Términos y condiciones, Política de envíos y Política de cambios/devoluciones.
- Mantener claro que `/cuenta` es dashboard mock hasta integrar Supabase Auth.
- Reemplazar visuales CSS de productos con fotos reales si la tienda ya tendrá catálogo final.
- Limpiar pedidos de prueba en Supabase.
- Configurar variables en Vercel: Supabase, `ADMIN_PASSWORD` y `ADMIN_SESSION_TOKEN`.
- Revisar RLS en Supabase y confirmar que no hay SELECT público.
- Probar el flujo completo de admin: login, listado, filtros, detalle y acciones.
- Ejecutar `pnpm build` antes de deploy.

---

## Deploy

Ver [`docs/deployment-checklist.md`](docs/deployment-checklist.md) para el checklist completo antes de ir a producción.
