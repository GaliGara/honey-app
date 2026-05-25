import type { PaymentStatus } from "@/types/admin";

const PAYMENT_MAP: Record<
  PaymentStatus,
  { label: string; dot: string; bg: string; color: string; border: string }
> = {
  pending_payment: {
    label: "Sin pago",
    dot: "#9ca3af",
    bg: "rgba(156,163,175,0.1)",
    color: "#374151",
    border: "rgba(156,163,175,0.28)",
  },
  pending_transfer: {
    label: "Espera transferencia",
    dot: "#f59e0b",
    bg: "rgba(245,158,11,0.09)",
    color: "#92400e",
    border: "rgba(245,158,11,0.28)",
  },
  pending_deposit: {
    label: "Espera depósito",
    dot: "#f97316",
    bg: "rgba(249,115,22,0.09)",
    color: "#7c2d12",
    border: "rgba(249,115,22,0.28)",
  },
  pending_cash_payment: {
    label: "Contra entrega",
    dot: "#6366f1",
    bg: "rgba(99,102,241,0.09)",
    color: "#312e81",
    border: "rgba(99,102,241,0.28)",
  },
  paid: {
    label: "Pagado",
    dot: "#10b981",
    bg: "rgba(16,185,129,0.1)",
    color: "#064e3b",
    border: "rgba(16,185,129,0.28)",
  },
  payment_failed: {
    label: "Pago fallido",
    dot: "#ef4444",
    bg: "rgba(239,68,68,0.09)",
    color: "#7f1d1d",
    border: "rgba(239,68,68,0.28)",
  },
  cancelled: {
    label: "Cancelado",
    dot: "#ef4444",
    bg: "rgba(239,68,68,0.09)",
    color: "#7f1d1d",
    border: "rgba(239,68,68,0.28)",
  },
  refunded: {
    label: "Reembolsado",
    dot: "#6366f1",
    bg: "rgba(99,102,241,0.09)",
    color: "#312e81",
    border: "rgba(99,102,241,0.28)",
  },
};

export default function OrderPaymentBadge({ status }: { status: PaymentStatus }) {
  const cfg = PAYMENT_MAP[status] ?? PAYMENT_MAP.pending_payment;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "5px",
        padding: "3px 10px 3px 8px",
        borderRadius: 9999,
        fontSize: "0.75rem",
        fontWeight: 600,
        letterSpacing: "0.02em",
        background: cfg.bg,
        color: cfg.color,
        border: `1px solid ${cfg.border}`,
        whiteSpace: "nowrap",
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: cfg.dot,
          flexShrink: 0,
        }}
      />
      {cfg.label}
    </span>
  );
}
