import type { OrderStatus } from "@/types/admin";

const CONFIRMED_CFG = {
  label: "Confirmado",
  dot: "#3b82f6",
  bg: "rgba(59,130,246,0.09)",
  color: "#1e3a8a",
  border: "rgba(59,130,246,0.28)",
};

const STATUS_MAP: Record<
  OrderStatus,
  { label: string; dot: string; bg: string; color: string; border: string }
> = {
  pending: {
    label: "Pendiente",
    dot: "#f59e0b",
    bg: "rgba(245,158,11,0.09)",
    color: "#92400e",
    border: "rgba(245,158,11,0.28)",
  },
  confirmed: CONFIRMED_CFG,
  processing: CONFIRMED_CFG, // backward compat — legacy DB value
  shipped: {
    label: "Enviado",
    dot: "#8b5cf6",
    bg: "rgba(139,92,246,0.09)",
    color: "#4c1d95",
    border: "rgba(139,92,246,0.28)",
  },
  delivered: {
    label: "Entregado",
    dot: "#10b981",
    bg: "rgba(16,185,129,0.09)",
    color: "#064e3b",
    border: "rgba(16,185,129,0.28)",
  },
  cancelled: {
    label: "Cancelado",
    dot: "#ef4444",
    bg: "rgba(239,68,68,0.09)",
    color: "#7f1d1d",
    border: "rgba(239,68,68,0.28)",
  },
};

export default function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const cfg = STATUS_MAP[status] ?? STATUS_MAP.pending;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "5px",
        padding: "3px 10px 3px 8px",
        borderRadius: 9999,
        fontSize: "0.72rem",
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
