import type { PaymentMethod, PaymentStatus } from "@/types/order";

/**
 * Configuración de pagos manuales.
 *
 * ⚠ PLACEHOLDER — Estos datos son ficticios.
 *   Reemplazar con información bancaria real antes del lanzamiento.
 */
export const manualPaymentConfig = {
  /** TODO: Nombre real del banco (ej: "BBVA", "Santander") */
  bankName: "Nombre del banco",
  accountHolder: "Honey Productos de la Colmena",
  /** TODO: CLABE interbancaria real (18 dígitos) */
  clabe: "000000000000000000",
  /** Sin `+` ni espacios — para links wa.me */
  whatsapp: "520000000000",
  /** Con formato — para mostrar en UI */
  whatsappDisplay: "+52 000 000 0000",
  /** TODO: email real de pagos */
  email: "pagos@honey.mx",
} as const;

/* ── Labels ────────────────────────────────────────────────── */

/** Etiqueta legible para el método de pago */
export function getPaymentMethodLabel(paymentMethod: PaymentMethod): string {
  switch (paymentMethod) {
    case "bank_transfer":    return "Transferencia SPEI";
    case "bank_deposit":     return "Depósito bancario";
    case "cash_on_delivery": return "Pago contra entrega";
  }
}

/** Etiqueta legible para el estado de pago */
export function getPaymentStatusLabel(paymentStatus: PaymentStatus): string {
  switch (paymentStatus) {
    case "pending_transfer":     return "Pendiente de transferencia";
    case "pending_deposit":      return "Pendiente de depósito";
    case "pending_cash_payment": return "Pago pendiente contra entrega";
    case "paid":                 return "Pagado";
    case "cancelled":            return "Cancelado";
    case "refunded":             return "Reembolsado";
  }
}

/* ── URL builders ──────────────────────────────────────────── */

/**
 * Link directo de WhatsApp con mensaje de comprobante prellenado.
 * Formato wa.me: número sin `+` ni espacios.
 */
export function buildWhatsappProofUrl(orderNumber: string): string {
  const message = encodeURIComponent(
    `Hola, quiero enviar el comprobante de pago de mi pedido ${orderNumber} de Honey.`
  );
  return `https://wa.me/${manualPaymentConfig.whatsapp}?text=${message}`;
}

/** Link mailto con asunto y cuerpo de comprobante prellenados */
export function buildEmailProofUrl(orderNumber: string): string {
  const subject = encodeURIComponent(
    `Comprobante de pago pedido ${orderNumber}`
  );
  const body = encodeURIComponent(
    `Hola, adjunto/envío el comprobante de pago de mi pedido ${orderNumber}.`
  );
  return `mailto:${manualPaymentConfig.email}?subject=${subject}&body=${body}`;
}

/* ── Instructions builder ──────────────────────────────────── */

/**
 * Genera el texto de instrucciones de pago que se almacena en Supabase
 * (campo `payment_instructions`) y se muestra en /gracias.
 */
export function buildManualPaymentInstructions(
  paymentMethod: PaymentMethod,
  orderNumber: string
): string {
  const c = manualPaymentConfig;

  switch (paymentMethod) {
    case "bank_transfer":
      return [
        `Banco: ${c.bankName}`,
        `Titular: ${c.accountHolder}`,
        `CLABE: ${c.clabe}`,
        `Referencia: ${orderNumber}`,
        `WhatsApp: ${c.whatsappDisplay}`,
        `Email: ${c.email}`,
        "Tu pedido se confirmará cuando recibamos y validemos tu comprobante.",
      ].join("\n");

    case "bank_deposit":
      return [
        `Banco: ${c.bankName}`,
        `Titular: ${c.accountHolder}`,
        `CLABE: ${c.clabe}`,
        `Referencia: ${orderNumber}`,
        `WhatsApp: ${c.whatsappDisplay}`,
        `Email: ${c.email}`,
        "Tu pedido se confirmará cuando recibamos y validemos tu comprobante.",
      ].join("\n");

    case "cash_on_delivery":
      return "El pago se realizará al momento de la entrega. La disponibilidad puede depender de la zona de entrega.";
  }
}
