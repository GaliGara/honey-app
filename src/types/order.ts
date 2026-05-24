/** Métodos de pago disponibles en el checkout */
export type PaymentMethod =
  | "bank_transfer"
  | "bank_deposit"
  | "cash_on_delivery"
  | "mercado_pago";

/**
 * Estados de pago.
 * Mapeo:
 *   bank_transfer    → pending_transfer
 *   bank_deposit     → pending_deposit
 *   cash_on_delivery → pending_cash_payment
 *   mercado_pago     → pending_payment
 *   (resueltos)      → paid | payment_failed | cancelled | refunded
 */
export type PaymentStatus =
  | "pending_transfer"
  | "pending_deposit"
  | "pending_cash_payment"
  | "pending_payment"
  | "paid"
  | "payment_failed"
  | "cancelled"
  | "refunded";

/** Datos del pedido almacenados en sessionStorage para /gracias */
export interface OrderSummaryData {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  total: number;
  itemCount: number;
  createdAt: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
}

export interface CheckoutFormData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  notes: string;
}

export type CheckoutFormErrors = Partial<Record<keyof CheckoutFormData, string>>;
