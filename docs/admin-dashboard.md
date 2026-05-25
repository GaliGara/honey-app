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
- Estadísticas en tiempo real: total de pedidos, pedidos pendientes, pagados, ingresos.
- Lista de los 8 pedidos más recientes.

### Gestión de pedidos (`/admin/orders`)
- Tabla paginada (20 por página) con todos los pedidos.
- Filtros por estado del pedido, estado de pago y búsqueda libre.
- Actualización de estado en línea sin recargar la página.
- Panel lateral con detalle completo: cliente, envío, productos, totales, instrucciones de pago.

---

## Estados disponibles

### Estado del pedido

| Valor | Descripción |
|-------|-------------|
| `pending` | Pedido recibido, esperando acción |
| `processing` | En preparación |
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

src/app/api/admin/
  login/route.ts                   ← POST (valida ADMIN_PASSWORD, crea cookie)
  logout/route.ts                  ← POST (elimina cookie)
  orders/route.ts                  ← GET (lista pedidos con filtros)
  orders/[id]/route.ts             ← GET (detalle) + PATCH (actualizar estado)

src/lib/admin/
  auth.ts                          ← isAdminAuthenticated(), requireAdminAuth()
  orders.ts                        ← listOrders(), getOrder(), updateOrder(), getAdminStats()
```
