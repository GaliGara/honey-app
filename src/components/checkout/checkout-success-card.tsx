"use client";

import { useState, useEffect } from "react";
import type { OrderSummaryData, PaymentMethod, PaymentStatus } from "@/types/order";
import {
  manualPaymentConfig,
  getPaymentMethodLabel,
  getPaymentStatusLabel,
  buildWhatsappProofUrl,
  buildEmailProofUrl,
} from "@/constants/payment";

/* ══════════════════════════════════════════════════════════
   Icon components
   ══════════════════════════════════════════════════════════ */

function WhatsAppIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden style={{ flexShrink: 0, marginTop: 1 }}>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

function AlertTriangleIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden style={{ flexShrink: 0, marginTop: 1 }}>
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

function ShoppingIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}

function HomeIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

/* ══════════════════════════════════════════════════════════
   Success seal — animated entrance + glow-pulse halo
   ══════════════════════════════════════════════════════════ */

function SuccessSeal() {
  return (
    <div
      className="success-pop"
      style={{
        position: "relative",
        width: 104,
        height: 104,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Ambient pulsing glow */}
      <div
        aria-hidden
        className="glow-pulse"
        style={{
          position: "absolute",
          inset: -22,
          borderRadius: "50%",
          background:
            "radial-gradient(ellipse, rgba(212,175,55,0.22) 0%, transparent 68%)",
          pointerEvents: "none",
          ["--gpdelay" as string]: "0.4s",
        }}
      />

      {/* Dashed outer ring */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: -9,
          borderRadius: "50%",
          border: "1px dashed rgba(212,175,55,0.30)",
        }}
      />

      {/* Main seal circle */}
      <div
        style={{
          width: 96,
          height: 96,
          borderRadius: "50%",
          background:
            "linear-gradient(135deg, rgba(212,175,55,0.16) 0%, rgba(184,117,20,0.10) 100%)",
          border: "1.5px solid rgba(212,175,55,0.44)",
          boxShadow: [
            "0 0 0 6px rgba(212,175,55,0.06)",
            "0 8px 36px rgba(184,117,20,0.18)",
          ].join(", "),
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg
          width="42"
          height="42"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#D4AF37"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-label="Pedido confirmado"
        >
          <path d="M20 6L9 17l-5-5" />
        </svg>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   Shared sub-components
   ══════════════════════════════════════════════════════════ */

function SectionHeader({ title }: { title: string }) {
  return (
    <div>
      <h2
        className="text-base font-semibold"
        style={{ fontFamily: "var(--font-playfair)", color: "#2C1E11" }}
      >
        {title}
      </h2>
      <div className="gold-divider mt-2" style={{ maxWidth: 80 }} />
    </div>
  );
}

interface BankDataRowProps {
  label: string;
  value: string;
  highlight?: boolean;
}

function BankDataRow({ label, value, highlight }: BankDataRowProps) {
  return (
    <div
      className="py-2.5"
      style={{ borderBottom: "1px solid rgba(212,175,55,0.10)" }}
    >
      {/*
        Mobile: label arriba, valor abajo — evita cortes en textos largos
        sm+: fila horizontal, valor alineado a la derecha
      */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-0.5 sm:gap-4">
        <span
          className="text-[10px] uppercase tracking-[0.13em] shrink-0"
          style={{ color: "rgba(111,86,53,0.55)", minWidth: 88 }}
        >
          {label}
        </span>
        <span
          className="sm:text-right min-w-0"
          style={{
            color: highlight ? "#D4AF37" : "#2C1E11",
            fontFamily: highlight
              ? "var(--font-playfair)"
              : "var(--font-inter)",
            fontWeight: highlight ? 700 : 500,
            fontSize: highlight ? "0.95rem" : "0.875rem",
            overflowWrap: "break-word",
            wordBreak: "break-word",
          }}
        >
          {value}
        </span>
      </div>
    </div>
  );
}

function PaymentStatusChip({
  paymentStatus,
}: {
  paymentStatus: PaymentStatus;
}) {
  return (
    <span
      className="inline-flex items-center text-[9px] uppercase tracking-[0.16em] px-2.5 py-1 rounded-full"
      style={{
        background: "rgba(212,175,55,0.12)",
        color: "#B87514",
        border: "1px solid rgba(212,175,55,0.25)",
      }}
    >
      {getPaymentStatusLabel(paymentStatus)}
    </span>
  );
}

/* ── Proof action buttons — WhatsApp (primary) + email (secondary) ── */
function ProofButtons({ orderNumber }: { orderNumber: string }) {
  return (
    <div className="flex flex-col gap-2.5">
      <a
        href={buildWhatsappProofUrl(orderNumber)}
        target="_blank"
        rel="noopener noreferrer"
        className="premium-button text-sm flex items-center justify-center gap-2 w-full"
      >
        <WhatsAppIcon />
        Enviar comprobante por WhatsApp
      </a>
      <a
        href={buildEmailProofUrl(orderNumber)}
        className="secondary-button text-sm flex items-center justify-center gap-2 w-full"
      >
        <MailIcon />
        Enviar comprobante por email
      </a>
    </div>
  );
}

function ConfirmationNote() {
  return (
    <div
      className="flex items-start gap-2 rounded-xl px-4 py-3"
      style={{
        background: "rgba(212,175,55,0.06)",
        border: "1px solid rgba(212,175,55,0.16)",
      }}
    >
      <InfoIcon />
      <p className="text-xs leading-relaxed" style={{ color: "#6F5635" }}>
        Tu pedido se confirmará cuando recibamos y validemos tu comprobante.
      </p>
    </div>
  );
}

function PlaceholderWarning() {
  return (
    <div
      className="flex items-start gap-2 rounded-xl px-3 py-2.5"
      style={{
        background: "rgba(184,117,20,0.06)",
        border: "1px solid rgba(184,117,20,0.15)",
      }}
    >
      <AlertTriangleIcon />
      <p
        className="text-[10px] leading-relaxed"
        style={{ color: "rgba(184,117,20,0.70)" }}
      >
        Datos de placeholder — se actualizarán con información bancaria real
        antes del lanzamiento.
      </p>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   Payment instruction blocks — LOGIC UNCHANGED
   ══════════════════════════════════════════════════════════ */

interface PaymentInstructionsProps {
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderNumber: string;
}

function PaymentInstructions({
  paymentMethod,
  paymentStatus,
  orderNumber,
}: PaymentInstructionsProps) {
  const c = manualPaymentConfig;

  /* ── Transferencia SPEI ── */
  if (paymentMethod === "bank_transfer") {
    return (
      <div className="glass-panel rounded-2xl p-4 sm:p-6 w-full flex flex-col gap-4">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <SectionHeader title="Datos para transferencia SPEI" />
          <PaymentStatusChip paymentStatus={paymentStatus} />
        </div>
        <div className="flex flex-col">
          <BankDataRow label="Banco"      value={c.bankName} />
          <BankDataRow label="Titular"    value={c.accountHolder} />
          <BankDataRow label="CLABE"      value={c.clabe} />
          <BankDataRow label="Referencia" value={orderNumber} highlight />
          <BankDataRow label="WhatsApp"   value={c.whatsappDisplay} />
          <BankDataRow label="Email"      value={c.email} />
        </div>
        <ProofButtons orderNumber={orderNumber} />
        <ConfirmationNote />
        <PlaceholderWarning />
      </div>
    );
  }

  /* ── Depósito bancario ── */
  if (paymentMethod === "bank_deposit") {
    return (
      <div className="glass-panel rounded-2xl p-4 sm:p-6 w-full flex flex-col gap-4">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <SectionHeader title="Datos para depósito bancario" />
          <PaymentStatusChip paymentStatus={paymentStatus} />
        </div>
        <div className="flex flex-col">
          <BankDataRow label="Banco"      value={c.bankName} />
          <BankDataRow label="Titular"    value={c.accountHolder} />
          <BankDataRow label="CLABE"      value={c.clabe} />
          <BankDataRow label="Referencia" value={orderNumber} highlight />
          <BankDataRow label="WhatsApp"   value={c.whatsappDisplay} />
          <BankDataRow label="Email"      value={c.email} />
        </div>
        <ProofButtons orderNumber={orderNumber} />
        <ConfirmationNote />
        <PlaceholderWarning />
      </div>
    );
  }

  /* ── Pago contra entrega — único caso restante ── */
  return (
    <div className="glass-panel rounded-2xl p-6 w-full flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <SectionHeader title="Pago contra entrega" />
        <PaymentStatusChip paymentStatus={paymentStatus} />
      </div>
      <div
        className="flex items-start gap-2.5 rounded-xl px-4 py-3"
        style={{
          background: "rgba(212,175,55,0.07)",
          border: "1px solid rgba(212,175,55,0.20)",
        }}
      >
        <InfoIcon />
        <div className="flex flex-col gap-1.5">
          <p className="text-sm font-medium" style={{ color: "#2C1E11" }}>
            Pagarás al momento de la entrega.
          </p>
          <p className="text-xs leading-relaxed" style={{ color: "#6F5635" }}>
            La disponibilidad puede depender de la zona de entrega. Nuestro
            equipo se pondrá en contacto para coordinar.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   Main export — logic identical to original
   ══════════════════════════════════════════════════════════ */

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
      /* silently ignore corrupt data */
    }
  }, []);

  /* ── Derived values — unchanged ── */
  const displayOrder = orderNumber ?? orderData?.orderNumber;
  const paymentMethod: PaymentMethod =
    orderData?.paymentMethod ?? "bank_transfer";
  const paymentStatus: PaymentStatus =
    orderData?.paymentStatus ?? "pending_transfer";

  return (
    <div className="flex flex-col items-center text-center gap-8 max-w-2xl mx-auto py-8 sm:py-14 px-2 sm:px-6">

      {/* ── 1. Animated success seal ── */}
      <SuccessSeal />

      {/* ── 2. Kicker + main headline ── */}
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="gold-divider w-10" />
          <span
            className="text-[10px] uppercase tracking-[0.42em]"
            style={{ color: "#B87514" }}
          >
            Pedido confirmado
          </span>
          <div className="gold-divider w-10" />
        </div>

        <div className="flex flex-col gap-3">
          <h1
            className="text-3xl md:text-4xl font-bold leading-tight"
            style={{ fontFamily: "var(--font-playfair)", color: "#2C1E11" }}
          >
            Gracias por tu pedido
          </h1>
          <p
            className="text-sm leading-relaxed max-w-sm mx-auto"
            style={{ color: "#6F5635" }}
          >
            Estamos preparando tu selección Honey con el cuidado que merece.
          </p>
        </div>
      </div>

      {/* ── 3. Order number chip ── */}
      {displayOrder && (
        <div
          className="glass-panel rounded-2xl px-8 py-5 flex flex-col items-center gap-2"
          style={{
            boxShadow: [
              "0 0 0 6px rgba(212,175,55,0.06)",
              "0 8px 32px rgba(184,117,20,0.10)",
            ].join(", "),
            minWidth: 220,
          }}
        >
          <span
            className="text-[10px] uppercase tracking-[0.32em]"
            style={{ color: "#B87514" }}
          >
            Número de pedido
          </span>
          <span
            className="text-3xl font-bold"
            style={{ fontFamily: "var(--font-playfair)", color: "#D4AF37" }}
          >
            {displayOrder}
          </span>
          {orderData && (
            <PaymentStatusChip paymentStatus={paymentStatus} />
          )}
        </div>
      )}

      {/* ── 4. Order details card ── */}
      {orderData && (
        <div className="glass-panel rounded-2xl p-4 sm:p-6 w-full text-left flex flex-col gap-4">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <SectionHeader title="Detalles del pedido" />
            <span
              className="text-[9px] uppercase tracking-[0.20em]"
              style={{ color: "rgba(111,86,53,0.45)" }}
            >
              {getPaymentMethodLabel(paymentMethod)}
            </span>
          </div>

          <div className="grid grid-cols-[auto_1fr] gap-x-5 sm:gap-x-8 gap-y-3 text-sm">
            <span style={{ color: "#6F5635" }}>Cliente</span>
            <span style={{ color: "#2C1E11", fontWeight: 500 }}>
              {orderData.customerName}
            </span>

            <span style={{ color: "#6F5635" }}>Email</span>
            <span
              style={{
                color: "#2C1E11",
                wordBreak: "break-all",
                overflowWrap: "break-word",
              }}
            >
              {orderData.customerEmail}
            </span>

            <span style={{ color: "#6F5635" }}>Productos</span>
            <span style={{ color: "#2C1E11" }}>
              {orderData.itemCount}{" "}
              {orderData.itemCount === 1 ? "artículo" : "artículos"}
            </span>

            <span style={{ color: "#6F5635" }}>Total</span>
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

      {/* ── 5. Payment instructions — requires orderData + displayOrder ── */}
      {orderData && displayOrder && (
        <div className="w-full text-left">
          <PaymentInstructions
            paymentMethod={paymentMethod}
            paymentStatus={paymentStatus}
            orderNumber={displayOrder}
          />
        </div>
      )}

      {/* ── 6. Final CTAs ── */}
      <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
        <a
          href="/tienda"
          className="premium-button text-sm flex items-center justify-center gap-2 w-full sm:w-auto"
        >
          <ShoppingIcon />
          Volver a tienda
        </a>
        <a
          href="/"
          className="secondary-button text-sm flex items-center justify-center gap-2 w-full sm:w-auto"
        >
          <HomeIcon />
          Ir al inicio
        </a>
      </div>

      {/* ── 7. Brand tagline ── */}
      <p
        className="text-[9px] uppercase tracking-[0.28em]"
        style={{ color: "rgba(184,117,20,0.38)" }}
      >
        Pureza · Origen · Excelencia
      </p>
    </div>
  );
}
