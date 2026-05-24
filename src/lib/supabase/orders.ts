import { createSupabaseClient } from "./client";
import type { CartItem } from "@/types/product";

interface CreateOrderInput {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  city: string;
  state?: string;
  postalCode?: string;
  notes?: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  taxes: number;
  total: number;
}

interface CreateOrderResult {
  orderId: string;
  orderNumber: string;
}

export async function createOrder(
  input: CreateOrderInput
): Promise<CreateOrderResult> {
  const supabase = createSupabaseClient();

  /* ── 1. Insert order row ── */
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
    })
    .select("id, order_number")
    .single();

  if (orderError) {
    throw new Error(`Error al guardar el pedido: ${orderError.message}`);
  }

  /* ── 2. Insert order items ── */
  const orderItems = input.items.map((item) => ({
    order_id: order.id,
    product_id: item.productId,
    product_slug: item.slug,
    product_name: item.name,
    product_category: item.category as string,
    product_size: item.size ?? null,
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
