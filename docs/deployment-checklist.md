# Checklist de deploy — Honey Shop

Completa cada punto en orden antes de hacer deploy a producción en Vercel.

---

## 1. Datos de pago (OBLIGATORIO antes de cualquier deploy)

- [ ] Abrir `src/constants/payment.ts`
- [ ] Reemplazar `bankName` con el nombre real del banco
- [ ] Reemplazar `clabe` con la CLABE real (18 dígitos)
- [ ] Reemplazar `accountHolder` si difiere de "Honey Productos de la Colmena"
- [ ] Reemplazar `whatsapp` con el número real (formato: `521XXXXXXXXXX`, sin + ni espacios)
- [ ] Reemplazar `whatsappDisplay` con el número formateado para mostrar al cliente
- [ ] Reemplazar `email` con el correo real para recibir comprobantes

> Estos datos aparecen en la página /gracias y en el campo `payment_instructions`
> guardado en Supabase con cada pedido.

---

## 2. Variables de entorno en Vercel

- [ ] Ir a Vercel → Proyecto → Settings → Environment Variables
- [ ] Agregar `NEXT_PUBLIC_SUPABASE_URL` (valor: URL del proyecto Supabase)
- [ ] Agregar `NEXT_PUBLIC_SUPABASE_ANON_KEY` (valor: clave anon)
- [ ] Agregar `SUPABASE_SERVICE_ROLE_KEY` (valor: clave service_role)
  - Marcar como **sensitive** / no exponer en logs
  - Aplicar solo a entornos **Production** y **Preview** (no Development)
- [ ] Verificar que `.env.local` NO está en el repositorio (lo cubre `.gitignore`)

---

## 3. Base de datos Supabase

- [ ] Ejecutar `docs/supabase-schema.sql` completo en el SQL Editor de Supabase
- [ ] Verificar que la tabla `orders` existe con todas sus columnas
- [ ] Verificar que la tabla `order_items` existe con todas sus columnas
- [ ] Verificar que el índice `idx_orders_order_number` existe
- [ ] Confirmar que Row Level Security (RLS) está **habilitado** en ambas tablas
- [ ] Confirmar que **no hay políticas RLS** que permitan lectura pública
  - La API Route usa `service_role` y bypasea RLS correctamente
  - Los clientes nunca leen pedidos directamente desde el frontend

---

## 4. Build local

```bash
pnpm build
```

- [ ] El build completa sin errores TypeScript
- [ ] El build completa sin errores de ESLint
- [ ] No hay warnings de tipo `Type 'X' is not assignable to type 'Y'`
- [ ] No hay imports de módulos que no existen

---

## 5. Prueba de flujo completo (local o staging)

### Transferencia SPEI

- [ ] Agregar productos al carrito
- [ ] Ir a /checkout, seleccionar "Transferencia SPEI"
- [ ] Completar todos los campos del formulario
- [ ] Enviar pedido → redirige a /gracias
- [ ] Verificar que /gracias muestra: número de pedido, nombre, email, total
- [ ] Verificar que se muestran los datos bancarios (banco, CLABE, referencia)
- [ ] Verificar que aparece el botón de WhatsApp y el de email
- [ ] Verificar en Supabase que el pedido se creó con `payment_status = 'pending_transfer'`

### Depósito bancario

- [ ] Repetir flujo seleccionando "Depósito bancario"
- [ ] Verificar que /gracias muestra los datos de depósito
- [ ] Verificar en Supabase: `payment_status = 'pending_deposit'`

### Pago contra entrega

- [ ] Repetir flujo seleccionando "Pago contra entrega"
- [ ] Verificar que /gracias muestra el mensaje de entrega (sin datos bancarios)
- [ ] Verificar en Supabase: `payment_status = 'pending_cash_payment'`

---

## 6. Pruebas responsive

- [ ] /checkout en móvil (375px): formulario y resumen se muestran en columna, ancho completo
- [ ] /checkout en escritorio (1280px+): formulario a la izquierda, resumen sticky a la derecha
- [ ] /gracias en móvil: datos bancarios legibles, sin texto cortado, botones de ancho completo
- [ ] /gracias en escritorio: layout centrado, cómodo de leer

---

## 7. Deploy en Vercel

- [ ] Conectar repositorio a Vercel (si no está conectado)
- [ ] Verificar que el framework detectado es **Next.js**
- [ ] Verificar que el comando de build es `pnpm build` (o `next build`)
- [ ] Hacer deploy
- [ ] Revisar los logs de build en Vercel — sin errores
- [ ] Abrir la URL de producción y repetir el flujo completo (paso 5)

---

## 8. Post-deploy

- [ ] Confirmar que los pedidos de prueba en producción aparecen en Supabase
- [ ] Eliminar o marcar como cancelados los pedidos de prueba
- [ ] Configurar alertas en Supabase (opcional) para nuevos pedidos
- [ ] Guardar las credenciales de Supabase en un gestor de contraseñas seguro

---

## Referencia rápida

| Archivo | Qué contiene |
|---------|-------------|
| `src/constants/payment.ts` | Datos bancarios, WhatsApp, email — **editar antes de deploy** |
| `docs/env.example` | Plantilla de variables de entorno |
| `docs/supabase-schema.sql` | SQL completo para crear las tablas |
| `docs/manual-payments.md` | Flujo de pagos manuales y gestión de pedidos |
