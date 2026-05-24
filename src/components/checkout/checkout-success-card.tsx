"use client";

import { useState, useEffect } from "react";
import type { OrderSummaryData, PaymentMethod } from "@/types/order";

/* ── Constantes ────────────────────────────────────────────── */

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

/* ── Labels para método de pago ────────────────────────────── */

const PAYMENT_METHOD_LABEL: Record<PaymentMethod, string> = {
  bank_transfer: "Transferencia SPEI",
  bank_deposit: "Depósito bancario",
  cash_on_delivery: "Pago contra entrega",
  mercado_pago: "Mercado Pago",
};

/* ── Sub-components ─────────────────────────────────────────── */

function HexCheck() {
  return (
    <div
      aria-hidden
      style={{
        width: 88,
        height: 88,
        borderRadius: "30% 70% 70% 30% / 30% 30% 70% 70%",
        background:
          "linear-gradient(135deg, rgba(212,175,55,0.18) 0%, rgba(184,117,20,0.12) 100%)",
        border: "1px solid rgba(212,175,55,0.35)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg
        width="36"
        height="36"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#D4AF37"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20 6L9 17l-5-5" />
      </svg>
    </div>
  );
}

function InfoIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      style={{ flexShrink: 0, marginTop: 1 }}
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

/* ── Payment instruction blocks ─────────────────────────────── */

interface BankDataRowProps {
  label: string;
  value: string;
  highlight?: boolean;
}

function BankDataRow({ label, value, highlight }: BankDataRowProps) {
  return (
    <div
      className="flex items-start justify-between gap-4 py-2 text-sm"
      style={{ borderBottom: "1px solid rgba(212,175,55,0.1)" }}
    >
      <span
        className="text-[10px] uppercase tracking-[0.14em] pt-0.5"
        style={{ color: "rgba(111,86,53,0.55)", minWidth: 90 }}
      >
        {label}
      </span>
      <span
        className="text-right font-medium flex-1"
        style={{
          color: highlight ? "#D4AF37" : "#2C1E11",
          fontFamily: highlight ? "var(--font-playfair)" : "var(--font-inter)",
          wordBreak: "break-all",
          fontWeight: highlight ? 700 : 500,
        }}
      >
        {value}
      </span>
    </div>
  );
}

function PlaceholderNote() {
  return (
    <p
      className="text-[9px] text-center uppercase tracking-[0.16em] mt-3"
      style={{ color: "rgba(184,117,20,0.45)" }}
    >
      ⚠ Datos de placeholder — se actualizarán con información real antes del lanzamiento
    </p>
  );
}

interface PaymentInstructionsProps {
  paymentMethod: PaymentMethod;
  orderNumber: string;
}

function PaymentInstructions({
  paymentMethod,
  orderNumber,
}: PaymentInstructionsProps) {
  /* ── Transferencia SPEI ── */
  if (paymentMethod === "bank_transfer") {
    return (
      <div className="glass-panel rounded-2xl p-6 w-full flex flex-col gap-4">
        <div>
          <h2
            className="text-base font-semibold"
            style={{ fontFamily: "var(--font-playfair)", color: "#2C1E11" }}
          >
            Datos para transferencia SPEI
          </h2>
          <div className="gold-divider mt-2" style={{ maxWidth: 80 }} />
        </div>

        <div
          className="flex items-start gap-2.5 rounded-xl px-4 py-3"
          style={{
            background: "rgba(212,175,55,0.07)",
            border: "1px solid rgba(212,175,55,0.2)",
          }}
        >
          <InfoIcon />
          <p className="text-xs leading-relaxed" style={{ color: "#6F5635" }}>
            Tu pedido fue recibido. Realiza la transferencia SPEI y envía tu
            comprobante por WhatsApp o email para agilizar la confirmación.
          </p>
        </div>

        <div className="flex flex-col">
          <BankDataRow label="Banco" value={BANK_INFO.bank} />
          <BankDataRow label="Titular" value={BANK_INFO.holder} />
          <BankDataRow label="CLABE" value={BANK_INFO.clabe} />
          <BankDataRow label="Referencia" value={orderNumber} highlight />
          <BankDataRow label="WhatsApp" value={BANK_INFO.whatsapp} />
          <BankDataRow label="Email" value={BANK_INFO.email} />
        </div>

        <PlaceholderNote />
      </div>
    );
  }

  /* ── Depósito bancario ── */
  if (paymentMethod === "bank_deposit") {
    return (
      <div className="glass-panel rounded-2xl p-6 w-full flex flex-col gap-4">
        <div>
          <h2
            className="text-base font-semibold"
            style={{ fontFamily: "var(--font-playfair)", color: "#2C1E11" }}
          >
            Datos para depósito bancario
          </h2>
          <div className="gold-divider mt-2" style={{ maxWidth: 80 }} />
        </div>

        <div
          className="flex items-start gap-2.5 rounded-xl px-4 py-3"
          style={{
            background: "rgba(212,175,55,0.07)",
            border: "1px solid rgba(212,175,55,0.2)",
          }}
        >
          <InfoIcon />
          <p className="text-xs leading-relaxed" style={{ color: "#6F5635" }}>
            Tu pedido fue recibido. Realiza el depósito bancario y comparte el
            comprobante por WhatsApp o email para confirmar tu pedido.
          </p>
        </div>

        <div className="flex flex-col">
          <BankDataRow label="Banco" value={BANK_INFO.bank} />
          <BankDataRow label="Titular" value={BANK_INFO.holder} />
          <BankDataRow label="No. Cuenta" value={BANK_INFO.account} />
          <BankDataRow label="Referencia" value={orderNumber} highlight />
          <BankDataRow label="WhatsApp" value={BANK_INFO.whatsapp} />
          <BankDataRow label="Email" value={BANK_INFO.email} />
        </div>

        <PlaceholderNote />
      </div>
    );
  }

  /* ── Pago contra entrega ── */
  if (paymentMethod === "cash_on_delivery") {
    return (
      <div className="glass-panel rounded-2xl p-6 w-full flex flex-col gap-3">
        <div>
          <h2
            className="text-base font-semibold"
            style={{ fontFamily: "var(--font-playfair)", color: "#2C1E11" }}
          >
            Pago contra entrega
          </h2>
          <div className="gold-divider mt-2" style={{ maxWidth: 80 }} />
        </div>
        <div
          className="flex items-start gap-2.5 rounded-xl px-4 py-3"
          style={{
            background: "rgba(212,175,55,0.07)",
            border: "1px solid rgba(212,175,55,0.2)",
          }}
        >
          <InfoIcon />
          <p className="text-xs leading-relaxed" style={{ color: "#6F5635" }}>
            Tu pedido será confirmado y el pago se realizará al momento de la
            entrega. Nuestro equipo se pondrá en contacto para coordinar la
            entrega en tu zona.
          </p>
        </div>
      </div>
    );
  }

  /* ── Mercado Pago ── */
  return (
    <div className="glass-panel rounded-2xl p-6 w-full flex flex-col gap-3">
      <div>
        <h2
          className="text-base font-semibold"
          style={{ fontFamily: "var(--font-playfair)", color: "#2C1E11" }}
        >
          Mercado Pago
        </h2>
        <div className="gold-divider mt-2" style={{ maxWidth: 80 }} />
      </div>
      <div
        className="flex items-start gap-2.5 rounded-xl px-4 py-3"
        style={{
          background: "rgba(212,175,55,0.07)",
          border: "1px solid rgba(212,175,55,0.2)",
        }}
      >
        <InfoIcon />
        <p className="text-xs leading-relaxed" style={{ color: "#6F5635" }}>
          Tu pedido quedó pendiente de pago con Mercado Pago. La integración
          automática se activará en la siguiente fase — nuestro equipo se
          pondrá en contacto contigo para coordinar el pago.
        </p>
      </div>
    </div>
  );
}

/* ── Main component ─────────────────────────────────────────── */

interface CheckoutSuccessCardProps {
  orderNumber?: string;
}

export default function CheckoutSuccessCard({
  orderNumber,
}: CheckoutSuccessCardProps) {
  const [orderData, setOrderData] = useState<OrderSummaryData | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem("honey-last-order");
    if (!raw) return;
    try {
      setOrderData(JSON.parse(raw) as OrderSummaryData);
    } catch {
      // silently ignore corrupt data
    }
  }, []);

  const displayOrder = orderNumber ?? orderData?.orderNumber;
  const paymentMethod: PaymentMethod =
    orderData?.paymentMethod ?? "bank_transfer";
  const methodLabel = PAYMENT_METHOD_LABEL[paymentMethod];

  return (
    <div className="flex flex-col items-center text-center gap-8 max-w-2xl mx-auto py-16 px-6">
      {/* Icon */}
      <HexCheck />

      {/* Divider */}
      <div className="gold-divider w-20" />

      {/* Main message */}
      <div className="flex flex-col gap-3">
        <h1
          className="text-3xl md:text-4xl font-bold"
          style={{ fontFamily: "var(--font-playfair)", color: "#2C1E11" }}
        >
          Pedido recibido
        </h1>
        <p
          className="text-sm leading-relaxed max-w-sm mx-auto"
          style={{ color: "#6F5635" }}
        >
          Estamos preparando tu selección Honey con el cuidado que merece.
          Recibirás actualizaciones a tu correo.
        </p>
      </div>

      {/* Order number + payment method chips */}
      <div className="flex flex-col sm:flex-row gap-3 items-center">
        {displayOrder && (
          <div className="glass-panel rounded-2xl px-7 py-4 flex flex-col gap-1 items-center">
            <span
              className="text-[9px] uppercase tracking-[0.3em]"
              style={{ color: "#B87514" }}
            >
              Número de pedido
            </span>
            <span
              className="text-2xl font-bold"
              style={{ fontFamily: "var(--font-playfair)", color: "#D4AF37" }}
            >
              {displayOrder}
            </span>
          </div>
        )}
        {orderData && (
          <div className="glass-panel rounded-2xl px-5 py-4 flex flex-col gap-1 items-center">
            <span
              className="text-[9px] uppercase tracking-[0.3em]"
              style={{ color: "#B87514" }}
            >
              Método de pago
            </span>
            <span
              className="text-sm font-semibold"
              style={{ fontFamily: "var(--font-playfair)", color: "#2C1E11" }}
            >
              {methodLabel}
            </span>
          </div>
        )}
      </div>

      {/* Order details card */}
      {orderData && (
        <div className="glass-panel rounded-2xl p-6 w-full text-left flex flex-col gap-4">
          <div>
            <h2
              className="text-base font-semibold"
              style={{ fontFamily: "var(--font-playfair)", color: "#2C1E11" }}
            >
              Detalles del pedido
            </h2>
            <div className="gold-divider mt-2" style={{ maxWidth: 80 }} />
          </div>

          <div className="grid grid-cols-[auto_1fr] gap-x-8 gap-y-2.5 text-sm">
            <span style={{ color: "#6F5635" }}>Cliente</span>
            <span style={{ color: "#2C1E11", fontWeight: 500 }}>
              {orderData.customerName}
            </span>

            <span style={{ color: "#6F5635" }}>Email</span>
            <span style={{ color: "#2C1E11" }}>{orderData.customerEmail}</span>

            <span style={{ color: "#6F5635" }}>Productos</span>
            <span style={{ color: "#2C1E11" }}>
              {orderData.itemCount}{" "}
              {orderData.itemCount === 1 ? "artículo" : "artículos"}
            </span>

            <span style={{ color: "#6F5635" }}>Total del pedido</span>
            <span
              style={{
                fontFamily: "var(--font-playfair)",
                color: "#D4AF37",
                fontWeight: 700,
                fontSize: "1.05rem",
              }}
            >
              ${orderData.total.toFixed(2)}
            </span>
          </div>
        </div>
      )}

      {/* Payment instructions */}
      {orderData && displayOrder && (
        <div className="w-full text-left">
          <PaymentInstructions
            paymentMethod={paymentMethod}
            orderNumber={displayOrder}
          />
        </div>
      )}

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
        <a href="/tienda" className="premium-button text-sm">
          Seguir comprando
        </a>
        <a href="/" className="secondary-button text-sm">
          Ir al inicio
        </a>
      </div>

      <p
        className="text-[9px] uppercase tracking-[0.28em]"
        style={{ color: "rgba(184,117,20,0.38)" }}
      >
        Pureza · Origen · Excelencia
      </p>
    </div>
  );
}
