import { NextResponse } from "next/server";
import { z } from "zod";
import { createOrder } from "@/lib/supabase/orders";
import type { PaymentMethod, PaymentStatus } from "@/types/order";

/* ── Constantes de pago ────────────────────────────────────── */

/**
 * Datos bancarios de placeholder.
 * TODO: reemplazar con datos reales antes de producción.
 */
const BANK_INFO = {
  bank: "[Nombre del banco — pendiente de configurar]",
  holder: "Honey Productos de la Colmena",
  clabe: "000000000000000000",
  account: "0000000000",
  whatsapp: "+52 000 000 0000",
  email: "pagos@honey.mx",
} as const;

/* ── Zod schemas ───────────────────────────────────────────── */

const orderItemSchema = z.object({
  productId: z.string().min(1),
  slug: z.string().min(1),
  name: z.string().min(1),
  category: z.string().min(1),
  size: z.string(),
  price: z.number().positive(),
  quantity: z.number().int().positive(),
});

const createOrderBodySchema = z.object({
  fullName: z.string().min(1, "Nombre requerido"),
  email: z.string().email("Email inválido"),
  phone: z.string().min(1, "Teléfono requerido"),
  address: z.string().min(1, "Dirección requerida"),
  city: z.string().min(1, "Ciudad requerida"),
  state: z.string().optional(),
  postalCode: z.string().optional(),
  notes: z.string().optional(),
  items: z
    .array(orderItemSchema)
    .min(1, "El pedido debe tener al menos un producto"),
  shipping: z.number().nonnegative(),
  taxes: z.number().nonnegative(),
  paymentMethod: z.enum([
    "bank_transfer",
    "bank_deposit",
    "cash_on_delivery",
    "mercado_pago",
  ]),
});

type CreateOrderBody = z.infer<typeof createOrderBodySchema>;

/* ── Helpers de pago ───────────────────────────────────────── */

function generateOrderNumber(): string {
  return `HNY-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}

function resolvePaymentStatus(method: PaymentMethod): PaymentStatus {
  switch (method) {
    case "bank_transfer":
      return "pending_transfer";
    case "bank_deposit":
      return "pending_deposit";
    case "cash_on_delivery":
      return "pending_cash_payment";
    case "mercado_pago":
      return "pending_payment";
  }
}

function resolvePaymentProvider(method: PaymentMethod): string {
  return method === "mercado_pago" ? "mercado_pago" : "manual";
}

function buildPaymentInstructions(
  method: PaymentMethod,
  orderNumber: string
): string {
  switch (method) {
    case "bank_transfer":
      return [
        `Banco: ${BANK_INFO.bank}`,
        `Titular: ${BANK_INFO.holder}`,
        `CLABE: ${BANK_INFO.clabe}`,
        `Referencia: ${orderNumber}`,
        `WhatsApp: ${BANK_INFO.whatsapp}`,
        `Email: ${BANK_INFO.email}`,
      ].join("\n");
    case "bank_deposit":
      return [
        `Banco: ${BANK_INFO.bank}`,
        `Titular: ${BANK_INFO.holder}`,
        `Cuenta: ${BANK_INFO.account}`,
        `Referencia: ${orderNumber}`,
        `WhatsApp: ${BANK_INFO.whatsapp}`,
        `Email: ${BANK_INFO.email}`,
      ].join("\n");
    case "cash_on_delivery":
      return "El pago se realizará al momento de la entrega. Solo efectivo.";
    case "mercado_pago":
      return "Integración con Mercado Pago disponible en la siguiente fase.";
  }
}

/* ── POST /api/orders ──────────────────────────────────────── */

export async function POST(request: Request) {
  /* 1. Parsear body */
  let rawBody: unknown;
  try {
    rawBody = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, message: "Cuerpo de la solicitud inválido" },
      { status: 400 }
    );
  }

  /* 2. Validar con Zod */
  const parsed = createOrderBodySchema.safeParse(rawBody);
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    return NextResponse.json(
      {
        ok: false,
        message: firstIssue?.message ?? "Datos del formulario inválidos",
      },
      { status: 400 }
    );
  }

  const data: CreateOrderBody = parsed.data;
  const method = data.paymentMethod as PaymentMethod;

  /* 3. Recalcular totales en el servidor (no confiar en el cliente) */
  const subtotal = data.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const total = subtotal + data.shipping + data.taxes;

  /* 4. Generar número de orden en el servidor */
  const orderNumber = generateOrderNumber();

  /* 5. Resolver datos de pago */
  const paymentStatus = resolvePaymentStatus(method);
  const paymentProvider = resolvePaymentProvider(method);
  const paymentInstructions = buildPaymentInstructions(method, orderNumber);
  const manualPaymentReference =
    method !== "mercado_pago" ? orderNumber : undefined;

  /* 6. Persistir en Supabase */
  try {
    const result = await createOrder({
      orderNumber,
      customerName: data.fullName,
      customerEmail: data.email,
      customerPhone: data.phone,
      address: data.address,
      city: data.city,
      state: data.state || undefined,
      postalCode: data.postalCode || undefined,
      notes: data.notes || undefined,
      items: data.items.map((item) => ({
        productId: item.productId,
        slug: item.slug,
        name: item.name,
        category: item.category,
        size: item.size || null,
        price: item.price,
        quantity: item.quantity,
      })),
      subtotal,
      shipping: data.shipping,
      taxes: data.taxes,
      total,
      paymentProvider,
      paymentStatus,
      paymentMethod: method,
      paymentInstructions,
      manualPaymentReference,
    });

    return NextResponse.json(
      {
        ok: true,
        orderId: result.orderId,
        orderNumber: result.orderNumber,
        paymentMethod: method,
        paymentStatus,
      },
      { status: 201 }
    );
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Error interno del servidor";
    console.error("[POST /api/orders]", err);
    return NextResponse.json({ ok: false, message }, { status: 500 });
  }
}
