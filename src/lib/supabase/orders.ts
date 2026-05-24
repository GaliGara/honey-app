/**
 * Módulo server-only — no importar desde componentes cliente.
 * Usa createSupabaseServerClient (service_role).
 */
import { createSupabaseServerClient } from "./server";

export interface OrderItemInput {
  productId: string;
  slug: string;
  name: string;
  category: string;
  size: string | null;
  price: number;
  quantity: number;
}

export interface CreateOrderInput {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  city: string;
  state?: string;
  postalCode?: string;
  notes?: string;
  items: OrderItemInput[];
  subtotal: number;
  shipping: number;
  taxes: number;
  total: number;
  /** Procesador de pago: 'mercado_pago' | 'manual'. Por defecto 'mercado_pago'. */
  paymentProvider?: string;
  /**
   * Estado inicial del pago.
   * Por defecto 'pending_payment'.
   * Valores: pending_transfer | pending_deposit | pending_cash_payment |
   *          pending_payment | paid | payment_failed | cancelled | refunded
   */
  paymentStatus?: string;
  /**
   * Método elegido por el cliente.
   * Valores: bank_transfer | bank_deposit | cash_on_delivery | mercado_pago
   */
  paymentMethod?: string;
  /** Instrucciones de pago generadas en el servidor. */
  paymentInstructions?: string;
  /** Referencia manual (= orderNumber para métodos no-pasarela). */
  manualPaymentReference?: string;
}

export interface CreateOrderResult {
  orderId: string;
  orderNumber: string;
}

export async function createOrder(
  input: CreateOrderInput
): Promise<CreateOrderResult> {
  const supabase = createSupabaseServerClient();

  /* ── 1. Insertar orden ─────────────────────────────────── */
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      order_number: input.orderNumber,
      customer_name: input.customerName,
      customer_email: input.customerEmail,
      customer_phone: input.customerPhone,
      address: input.address,
      city: input.city,
      state: input.state ?? null,
      postal_code: input.postalCode ?? null,
      notes: input.notes ?? null,
      subtotal: input.subtotal,
      shipping: input.shipping,
      taxes: input.taxes,
      total: input.total,
      status: "pending",
      payment_provider: input.paymentProvider ?? "mercado_pago",
      payment_status: input.paymentStatus ?? "pending_payment",
      payment_method: input.paymentMethod ?? null,
      payment_instructions: input.paymentInstructions ?? null,
      manual_payment_reference: input.manualPaymentReference ?? null,
    })
    .select("id, order_number")
    .single();

  if (orderError) {
    throw new Error(`Error al guardar el pedido: ${orderError.message}`);
  }

  /* ── 2. Insertar líneas del pedido ─────────────────────── */
  const orderItems = input.items.map((item) => ({
    order_id: order.id,
    product_id: item.productId,
    product_slug: item.slug,
    product_name: item.name,
    product_category: item.category,
    product_size: item.size,
    quantity: item.quantity,
    unit_price: item.price,
    total: item.price * item.quantity,
  }));

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(orderItems);

  if (itemsError) {
    throw new Error(
      `Error al guardar los productos del pedido: ${itemsError.message}`
    );
  }

  return {
    orderId: order.id,
    orderNumber: order.order_number,
  };
}
