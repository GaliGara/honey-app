# Panel de administración — Honey Shop

Guía de configuración, acceso y uso del dashboard admin.

---

## Acceso

URL: `https://tu-dominio.com/admin`

El panel requiere contraseña. Al ingresar se crea una cookie httpOnly con duración de 8 horas.

---

## Variables de entorno requeridas

| Variable | Descripción |
|----------|-------------|
| `ADMIN_PASSWORD` | Contraseña de acceso al panel. Mínimo 12 caracteres recomendado. |
| `ADMIN_SESSION_TOKEN` | Token aleatorio (≥32 chars) almacenado en la cookie de sesión. |

> **Nunca** usar prefijo `NEXT_PUBLIC_` en estas variables.

Generar un token seguro:
```bash
openssl rand -base64 48
```

---

## Funcionalidades

### Dashboard (`/admin`)
- Resumen del día con 4 métricas operativas: pagos pendientes, pedidos por atender, ingresos pagados y pedidos de hoy.
- Pedidos recientes en formato compacto.
- Distribución de métodos de pago con donut.
- Notas operativas y actividad reciente.
- Si hay trabajo pendiente, se muestra una card pequeña de atención requerida que enlaza a pedidos.

### Gestión de pedidos (`/admin/orders`)
- Tabla paginada desktop (20 por página) con todos los pedidos.
- Cards mobile para evitar tablas en pantallas chicas.
- Filtros por estado del pedido, estado de pago y búsqueda libre.
- Botón `Ver` para navegar al detalle del pedido.

### Detalle de pedido (`/admin/orders/[id]`)
- Página completa con resumen, cliente/envío, pago, instrucciones, actividad y notas internas.
- Acciones contextuales: confirmar pago, confirmar pedido, marcar enviado, marcar entregado y cancelar.
- Los registros legacy con estado `processing` se muestran como `Confirmado`; las acciones nuevas usan `confirmed`.

---

## Estados disponibles

### Estado del pedido

| Valor | Descripción |
|-------|-------------|
| `pending` | Pedido recibido, esperando acción |
| `confirmed` | Confirmado, pendiente de envío |
| `processing` | Legacy: se muestra como `confirmed` |
| `shipped` | Enviado al cliente |
| `delivered` | Entregado |
| `cancelled` | Cancelado |

### Estado del pago

| Valor | Descripción |
|-------|-------------|
| `pending_payment` | Sin método de pago confirmado |
| `pending_transfer` | Esperando transferencia SPEI |
| `pending_deposit` | Esperando depósito bancario |
| `pending_cash_payment` | Se pagará contra entrega |
| `paid` | Pago confirmado (registra `paid_at`) |
| `payment_failed` | Pago fallido |
| `cancelled` | Pago cancelado |
| `refunded` | Reembolsado |

> Al marcar un pedido como `paid`, el campo `paid_at` se registra automáticamente.
> Al marcar como `cancelled` (en estado), el campo `cancelled_at` se registra automáticamente.

---

## Seguridad

- La contraseña **nunca** se guarda en `localStorage` ni en el cliente.
- La sesión se almacena en una cookie `httpOnly` (inaccesible desde JavaScript).
- Todas las rutas `/admin/*` (excepto `/admin/login`) requieren sesión válida.
- Todas las API Routes `/api/admin/*` validan la cookie antes de ejecutar.
- El `ADMIN_SESSION_TOKEN` se compara directamente con el valor de la cookie — nunca se expone al frontend.
- El `service_role` de Supabase solo se usa en archivos server-only (`lib/`).

---

## Arquitectura de rutas

```
src/app/admin/
  login/page.tsx                   ← Pública (redirige si ya hay sesión)
  (protected)/
    layout.tsx                     ← Guard: llama requireAdminAuth()
    page.tsx                       ← Dashboard
    orders/page.tsx                ← Gestión de pedidos
    orders/[id]/page.tsx           ← Detalle operativo del pedido

src/app/api/admin/
  login/route.ts                   ← POST (valida ADMIN_PASSWORD, crea cookie)
  logout/route.ts                  ← POST (elimina cookie)
  orders/route.ts                  ← GET (lista pedidos con filtros)
  orders/[id]/route.ts             ← GET (detalle) + PATCH (actualizar estado)

src/lib/admin/
  auth.ts                          ← isAdminAuthenticated(), requireAdminAuth()
  orders.ts                        ← listOrders(), getOrder(), updateOrder(), getAdminStats()
```

---

## Pendiente antes de producción

- Configurar datos bancarios reales en `src/constants/payment.ts`.
- Configurar WhatsApp real para comprobantes.
- Configurar email real de pagos.
- Limpiar pedidos de prueba en Supabase.
- Revisar textos legales y reemplazar links temporales.
- Configurar variables en Vercel: Supabase, `ADMIN_PASSWORD`, `ADMIN_SESSION_TOKEN`.
- Revisar Supabase RLS y confirmar que no existe SELECT público.
- Probar admin completo: login, dashboard, filtros, detalle, acciones y logout.
- Ejecutar `pnpm build`.
