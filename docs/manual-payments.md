# Pagos manuales — Honey Shop

Documentación del sistema de pagos manuales: flujos por método, gestión de pedidos en Supabase y configuración de datos bancarios.

---

## Resumen del sistema

Honey Shop no usa pasarela de pago. Los clientes eligen un método al hacer checkout, el pedido se guarda en Supabase con estado `pending_*`, y el equipo confirma el pago manualmente.

```
Cliente elige método → Pedido creado en Supabase (pending_*) → Cliente envía comprobante
→ Equipo verifica → Actualiza payment_status a 'paid' en Supabase → Prepara envío
```

---

## Métodos de pago disponibles

### 1. Transferencia SPEI (`bank_transfer`)

**Flujo del cliente:**
1. Selecciona "Transferencia SPEI" en checkout
2. Completa el pedido → llega a /gracias
3. Ve los datos bancarios: banco, CLABE, referencia (= número de pedido)
4. Realiza la transferencia desde su banco con el número de pedido como referencia
5. Envía el comprobante por WhatsApp o email usando los botones de /gracias

**Estado inicial en DB:** `pending_transfer`

**Tiempo esperado:** Mismo día hábil (SPEI es inmediato, pero la verificación es manual).

---

### 2. Depósito bancario (`bank_deposit`)

**Flujo del cliente:**
1. Selecciona "Depósito bancario" en checkout
2. Completa el pedido → llega a /gracias
3. Ve los datos bancarios: banco, CLABE/cuenta, referencia
4. Va a una sucursal bancaria o OXXO Pay y realiza el depósito
5. Envía el comprobante por WhatsApp o email

**Estado inicial en DB:** `pending_deposit`

**Tiempo esperado:** 1–2 días hábiles dependiendo del banco.

---

### 3. Pago contra entrega (`cash_on_delivery`)

**Flujo del cliente:**
1. Selecciona "Pago contra entrega" en checkout
2. Completa el pedido → llega a /gracias
3. Ve el mensaje: el pago se realiza al recibir el paquete
4. No necesita enviar comprobante

**Estado inicial en DB:** `pending_cash_payment`

**Tiempo esperado:** Al momento de la entrega.

> Nota: confirma antes que tu zona de reparto acepta pago contra entrega.

---

## Estados de pago (`payment_status`)

| Valor | Significado |
|-------|-------------|
| `pending_transfer` | Esperando transferencia SPEI del cliente |
| `pending_deposit` | Esperando depósito bancario del cliente |
| `pending_cash_payment` | Pedido confirmado, pago al entregar |
| `paid` | Pago verificado y confirmado |
| `cancelled` | Pedido cancelado |
| `refunded` | Pago reembolsado al cliente |

---

## Gestión de pedidos en Supabase

### Ver pedidos nuevos

1. Ir a Supabase → Table Editor → `orders`
2. Filtrar por `payment_status = 'pending_transfer'` o `pending_deposit`
3. Ordenar por `created_at DESC`

### Confirmar un pago recibido

```sql
UPDATE orders
SET
  payment_status = 'paid',
  paid_at = now()
WHERE order_number = 'HNY-XXXX';
```

O desde la UI de Supabase:
1. Table Editor → `orders`
2. Buscar la fila por `order_number`
3. Editar `payment_status` → `paid`
4. Editar `paid_at` → fecha/hora actual

### Cancelar un pedido

```sql
UPDATE orders
SET
  payment_status = 'cancelled',
  status = 'cancelled',
  cancelled_at = now()
WHERE order_number = 'HNY-XXXX';
```

### Ver los ítems de un pedido

```sql
SELECT
  oi.product_name,
  oi.product_size,
  oi.quantity,
  oi.unit_price,
  oi.total
FROM order_items oi
JOIN orders o ON oi.order_id = o.id
WHERE o.order_number = 'HNY-XXXX';
```

---

## Configurar datos bancarios

Todos los datos bancarios y de contacto están centralizados en un solo archivo:

**`src/constants/payment.ts`**

```typescript
export const manualPaymentConfig = {
  bankName: "Nombre del banco",          // <-- reemplazar antes de producción
  accountHolder: "Honey Productos de la Colmena",
  clabe: "000000000000000000",           // <-- reemplazar antes de producción (18 dígitos)
  whatsapp: "520000000000",             // <-- reemplazar antes de producción (sin + ni espacios)
  whatsappDisplay: "+52 000 000 0000",  // <-- reemplazar antes de producción (formato visual)
  email: "pagos@honey.mx",             // <-- reemplazar antes de producción
} as const;
```

**Dónde aparecen estos datos:**
- En la página `/gracias` → sección de instrucciones de pago
- En el campo `payment_instructions` guardado en Supabase con cada pedido
- En los links de WhatsApp y email generados automáticamente

**Cómo actualizar:**
1. Editar `src/constants/payment.ts` con los valores reales
2. Ejecutar `pnpm build` para verificar que no hay errores
3. Hacer deploy

> Importante: no hagas deploy con `Nombre del banco`, `000000000000000000`,
> `+52 000 000 0000` o `pagos@honey.mx`. Son valores placeholder.

> No hay que tocar ningún otro archivo. Todas las vistas y la API Route importan
> sus datos desde este archivo único.

---

## Instrucciones que se guardan en Supabase

Al crear cada pedido, la API Route genera automáticamente el campo `payment_instructions` con los datos relevantes para ese método. Ejemplo para `bank_transfer`:

```
Banco: BBVA
Titular: Honey Productos de la Colmena
CLABE: 012180015611506531
Referencia: HNY-AB12
WhatsApp: +52 55 1234 5678
Email: pagos@honey.mx
Tu pedido se confirmará cuando recibamos y validemos tu comprobante.
```

> El bloque anterior es solo un ejemplo documental. Antes de producción,
> reemplaza el email y los datos bancarios por valores reales.

Para `cash_on_delivery`:
```
El pago se realizará al momento de la entrega. La disponibilidad puede depender de la zona de entrega.
```

Esto permite reconstruir las instrucciones de pago desde la DB aunque cambien los datos en el código en el futuro.

---

## Columnas reservadas para pasarela futura

Las siguientes columnas existen en la tabla `orders` pero actualmente no se usan.
Están reservadas para una futura integración con Mercado Pago u otra pasarela:

| Columna | Uso futuro |
|---------|-----------|
| `payment_reference` | ID de pago devuelto por la pasarela |
| `payment_preference_id` | ID de preferencia creada en la pasarela |
| `payment_init_point` | URL de checkout de la pasarela |
| `payment_status_detail` | Detalle del estado (ej: `accredited`, `pending_contingency`) |

No las elimines de la DB. Su valor actual siempre es `NULL`.
