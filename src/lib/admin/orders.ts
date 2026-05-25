/**
 * Módulo server-only — consultas admin a Supabase.
 * Usa createSupabaseServerClient (service_role). NUNCA importar desde cliente.
 */
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type {
  AdminOrder,
  AdminOrderSummary,
  AdminStats,
  OrderStatus,
  PaymentStatus,
} from "@/types/admin";

/* ── helpers ───────────────────────────────────────────── */

function rowToSummary(row: Record<string, unknown>): AdminOrderSummary {
  const items = (row.order_items as Array<Record<string, unknown>>) ?? [];
  return {
    id: row.id as string,
    orderNumber: row.order_number as string,
    customerName: row.customer_name as string,
    customerEmail: row.customer_email as string,
    total: row.total as number,
    status: row.status as OrderStatus,
    paymentStatus: row.payment_status as PaymentStatus,
    paymentMethod: (row.payment_method as AdminOrderSummary["paymentMethod"]) ?? null,
    createdAt: row.created_at as string,
    itemCount: items.reduce((acc, i) => acc + ((i.quantity as number) ?? 0), 0),
  };
}

function rowToOrder(row: Record<string, unknown>): AdminOrder {
  const items = (row.order_items as Array<Record<string, unknown>>) ?? [];
  return {
    id: row.id as string,
    orderNumber: row.order_number as string,
    customerName: row.customer_name as string,
    customerEmail: row.customer_email as string,
    customerPhone: row.customer_phone as string,
    address: row.address as string,
    city: row.city as string,
    state: (row.state as string) ?? null,
    postalCode: (row.postal_code as string) ?? null,
    notes: (row.notes as string) ?? null,
    subtotal: row.subtotal as number,
    shipping: row.shipping as number,
    taxes: row.taxes as number,
    total: row.total as number,
    status: row.status as OrderStatus,
    paymentProvider: (row.payment_provider as string) ?? null,
    paymentStatus: row.payment_status as PaymentStatus,
    paymentMethod: (row.payment_method as AdminOrder["paymentMethod"]) ?? null,
    paymentInstructions: (row.payment_instructions as string) ?? null,
    paymentReference: (row.payment_reference as string) ?? null,
    manualPaymentReference: (row.manual_payment_reference as string) ?? null,
    paymentProofUrl: (row.payment_proof_url as string) ?? null,
    paidAt: (row.paid_at as string) ?? null,
    cancelledAt: (row.cancelled_at as string) ?? null,
    createdAt: row.created_at as string,
    items: items.map((i) => ({
      id: i.id as string,
      productId: i.product_id as string,
      productSlug: i.product_slug as string,
      productName: i.product_name as string,
      productCategory: i.product_category as string,
      productSize: (i.product_size as string) ?? null,
      quantity: i.quantity as number,
      unitPrice: i.unit_price as number,
      total: i.total as number,
    })),
  };
}

/* ── listOrders ─────────────────────────────────────────── */

export async function listOrders(opts: {
  status?: string;
  paymentStatus?: string;
  search?: string;
  page?: number;
  limit?: number;
}): Promise<{ orders: AdminOrderSummary[]; total: number }> {
  const supabase = createSupabaseServerClient();
  const limit = opts.limit ?? 20;
  const page = opts.page ?? 1;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase
    .from("orders")
    .select(
      `id, order_number, customer_name, customer_email, total,
       status, payment_status, payment_method, created_at,
       order_items(quantity)`,
      { count: "exact" }
    )
    .order("created_at", { ascending: false })
    .range(from, to);

  if (opts.status) {
    // "confirmed" filter should match both 'confirmed' and legacy 'processing' values
    if (opts.status === "confirmed") {
      query = query.in("status", ["confirmed", "processing"]);
    } else {
      query = query.eq("status", opts.status);
    }
  }
  if (opts.paymentStatus) query = query.eq("payment_status", opts.paymentStatus);
  if (opts.search) {
    const s = `%${opts.search}%`;
    query = query.or(
      `order_number.ilike.${s},customer_name.ilike.${s},customer_email.ilike.${s}`
    );
  }

  const { data, error, count } = await query;
  if (error) throw new Error(`Error listando pedidos: ${error.message}`);

  return {
    orders: (data ?? []).map((r) => rowToSummary(r as unknown as Record<string, unknown>)),
    total: count ?? 0,
  };
}

/* ── getOrder ────────────────────────────────────────────── */

export async function getOrder(id: string): Promise<AdminOrder | null> {
  const supabase = createSupabaseServerClient();

  const { data, error } = await supabase
    .from("orders")
    .select(
      `*, order_items(
        id, product_id, product_slug, product_name,
        product_category, product_size, quantity, unit_price, total
      )`
    )
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null; // not found
    throw new Error(`Error obteniendo pedido: ${error.message}`);
  }

  return rowToOrder(data as unknown as Record<string, unknown>);
}

/* ── updateOrder ─────────────────────────────────────────── */

export async function updateOrder(
  id: string,
  patch: { status?: OrderStatus; paymentStatus?: PaymentStatus }
): Promise<void> {
  const supabase = createSupabaseServerClient();

  const update: {
    status?: string;
    payment_status?: string;
    paid_at?: string | null;
    cancelled_at?: string | null;
  } = {};

  if (patch.status) {
    update.status = patch.status === "processing" ? "confirmed" : patch.status;
  }
  if (patch.paymentStatus) {
    update.payment_status = patch.paymentStatus;
    if (patch.paymentStatus === "paid") {
      update.paid_at = new Date().toISOString();
    }
  }
  if (patch.status === "cancelled") {
    update.cancelled_at = new Date().toISOString();
  }

  const { error } = await supabase.from("orders").update(update).eq("id", id);
  if (error) throw new Error(`Error actualizando pedido: ${error.message}`);
}

/* ── getAdminStats ───────────────────────────────────────── */

export async function getAdminStats(): Promise<AdminStats> {
  const supabase = createSupabaseServerClient();

  const todayStart = new Date();
  todayStart.setUTCHours(0, 0, 0, 0);

  const [allOrders, todayOrders] = await Promise.all([
    supabase.from("orders").select("status, payment_status, total"),
    supabase.from("orders").select("total").gte("created_at", todayStart.toISOString()),
  ]);

  if (allOrders.error) throw new Error(allOrders.error.message);
  if (todayOrders.error) throw new Error(todayOrders.error.message);

  const all = allOrders.data ?? [];
  const today = todayOrders.data ?? [];

  const totalRevenue = all
    .filter((o) => o.payment_status === "paid")
    .reduce((acc, o) => acc + (o.total ?? 0), 0);

  const todayRevenue = today.reduce((acc, o) => acc + (o.total ?? 0), 0);

  const confirmedOrders = all.filter(
    (o) => o.status === "confirmed" || o.status === "processing"
  ).length;

  const pd_transfer = all.filter((o) => o.payment_status === "pending_transfer").length;
  const pd_deposit = all.filter((o) => o.payment_status === "pending_deposit").length;
  const pd_cash = all.filter((o) => o.payment_status === "pending_cash_payment").length;
  const pd_paid = all.filter((o) => o.payment_status === "paid").length;
  const pd_other = all.length - pd_transfer - pd_deposit - pd_cash - pd_paid;

  return {
    totalOrders: all.length,
    pendingOrders: all.filter((o) => o.status === "pending").length,
    awaitingPaymentOrders: all.filter(
      (o) =>
        o.payment_status === "pending_transfer" ||
        o.payment_status === "pending_deposit"
    ).length,
    confirmedOrders,
    processingOrders: confirmedOrders, // deprecated alias
    shippedOrders: all.filter((o) => o.status === "shipped").length,
    deliveredOrders: all.filter((o) => o.status === "delivered").length,
    paidOrders: all.filter((o) => o.payment_status === "paid").length,
    totalRevenue,
    todayOrders: today.length,
    todayRevenue,
    paymentDistribution: {
      pending_transfer: pd_transfer,
      pending_deposit: pd_deposit,
      pending_cash_payment: pd_cash,
      paid: pd_paid,
      other: Math.max(0, pd_other),
    },
  };
}

/* ── listCriticalOrders ──────────────────────────────────── */
/**
 * Devuelve los pedidos más urgentes:
 * - Esperan confirmación de pago (pending_transfer, pending_deposit)
 * - O están recibidos sin procesar (status = pending)
 * Ordenados por antigüedad (más viejos primero).
 */
export async function listCriticalOrders(limit = 5): Promise<AdminOrderSummary[]> {
  const supabase = createSupabaseServerClient();

  const { data, error } = await supabase
    .from("orders")
    .select(
      `id, order_number, customer_name, customer_email, total,
       status, payment_status, payment_method, created_at,
       order_items(quantity)`
    )
    .or(
      "payment_status.in.(pending_transfer,pending_deposit),status.eq.pending"
    )
    .not("status", "in", "(cancelled,delivered)")
    .order("created_at", { ascending: true })
    .limit(limit);

  if (error) throw new Error(`Error listando pedidos críticos: ${error.message}`);

  return (data ?? []).map((r) =>
    rowToSummary(r as unknown as Record<string, unknown>)
  );
}
