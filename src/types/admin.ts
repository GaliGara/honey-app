/** Tipos exclusivos para el panel de administración. Server-only. */

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"   // kept for backward compat with existing DB records; displays as "Confirmado"
  | "shipped"
  | "delivered"
  | "cancelled";

export type PaymentStatus =
  | "pending_payment"
  | "pending_transfer"
  | "pending_deposit"
  | "pending_cash_payment"
  | "paid"
  | "payment_failed"
  | "cancelled"
  | "refunded";

export type PaymentMethod = "bank_transfer" | "bank_deposit" | "cash_on_delivery";

export interface AdminOrderItem {
  id: string;
  productId: string;
  productSlug: string;
  productName: string;
  productCategory: string;
  productSize: string | null;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface AdminOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  city: string;
  state: string | null;
  postalCode: string | null;
  notes: string | null;
  subtotal: number;
  shipping: number;
  taxes: number;
  total: number;
  status: OrderStatus;
  paymentProvider: string | null;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod | null;
  paymentInstructions: string | null;
  paymentReference: string | null;
  manualPaymentReference: string | null;
  paymentProofUrl: string | null;
  paidAt: string | null;
  cancelledAt: string | null;
  createdAt: string;
  items: AdminOrderItem[];
}

export interface AdminOrderSummary {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  total: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod | null;
  createdAt: string;
  itemCount: number;
}

export interface AdminStats {
  totalOrders: number;
  /** status = 'pending' — recibidos sin procesar */
  pendingOrders: number;
  /** payment_status IN (pending_transfer, pending_deposit) */
  awaitingPaymentOrders: number;
  /** status IN ('confirmed', 'processing') — confirmados, en preparación */
  confirmedOrders: number;
  /** @deprecated use confirmedOrders */
  processingOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  paidOrders: number;
  totalRevenue: number;
  todayOrders: number;
  todayRevenue: number;
  paymentDistribution: {
    pending_transfer: number;
    pending_deposit: number;
    pending_cash_payment: number;
    paid: number;
    other: number;
  };
}

export interface OrdersFilter {
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  search?: string;
  page?: number;
  limit?: number;
}

export interface PatchOrderBody {
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
}
