import type { AdminOrder } from "@/types/admin";

interface Step {
  key: string;
  label: string;
  sub: string;
  done: boolean;
  active: boolean;
  cancelled?: boolean;
  date?: string;
  color: string;
  icon: "box" | "clock" | "check" | "truck" | "home" | "x";
}

function fmtDate(d: string | null) {
  if (!d) return null;
  return new Date(d).toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function buildSteps(order: AdminOrder): Step[] {
  const isConfirmed = order.status === "confirmed" || order.status === "processing";
  const isCancelled = order.status === "cancelled";
  const isShipped = order.status === "shipped" || order.status === "delivered";
  const isDelivered = order.status === "delivered";

  const paymentDone = order.paymentStatus === "paid";
  const paymentLabel =
    order.paymentStatus === "pending_transfer" ? "Esperando transferencia bancaria" :
    order.paymentStatus === "pending_deposit" ? "Esperando depósito bancario" :
    order.paymentStatus === "pending_cash_payment" ? "Pago contra entrega" :
    order.paymentStatus === "paid" ? "Pago confirmado" :
    "Pendiente de pago";

  const steps: Step[] = [
    {
      key: "created",
      label: "Pedido recibido",
      sub: fmtDate(order.createdAt) ?? "",
      done: true,
      active: order.status === "pending" && !paymentDone,
      color: "#f59e0b",
      icon: "box",
      date: order.createdAt,
    },
    {
      key: "payment",
      label: paymentDone ? "Pago confirmado" : paymentLabel,
      sub: paymentDone
        ? (fmtDate(order.paidAt) ?? "")
        : "Pendiente de verificación",
      done: paymentDone,
      active: !paymentDone && !isCancelled,
      color: paymentDone ? "#10b981" : "#f59e0b",
      icon: paymentDone ? "check" : "clock",
      date: order.paidAt ?? undefined,
    },
    {
      key: "confirmed",
      label: "Pedido confirmado",
      sub: isConfirmed ? "En preparación" : isCancelled ? "No aplica" : "En espera",
      done: isConfirmed || isShipped || isDelivered,
      active: isConfirmed && !isShipped,
      cancelled: isCancelled,
      color: "#3b82f6",
      icon: "check",
    },
    {
      key: "shipped",
      label: "Enviado",
      sub: isShipped ? "En camino al cliente" : isCancelled ? "No aplica" : "Pendiente",
      done: isShipped || isDelivered,
      active: isShipped && !isDelivered,
      cancelled: isCancelled,
      color: "#8b5cf6",
      icon: "truck",
    },
    {
      key: "delivered",
      label: "Entregado",
      sub: isDelivered ? "Entrega completada" : isCancelled ? "Pedido cancelado" : "Pendiente",
      done: isDelivered,
      active: false,
      cancelled: isCancelled,
      color: isCancelled ? "#ef4444" : "#10b981",
      icon: isCancelled ? "x" : "home",
    },
  ];

  return steps;
}

function StepIcon({ icon, color, done, active }: { icon: Step["icon"]; color: string; done: boolean; active: boolean }) {
  const stroke = done || active ? color : "rgba(184,117,20,0.3)";
  const svgs: Record<Step["icon"], React.ReactNode> = {
    box: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      </svg>
    ),
    clock: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    check: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <polyline points="20 6 9 17 4 12" />
      </svg>
    ),
    truck: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
        <circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
      </svg>
    ),
    home: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
    x: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    ),
  };
  return <>{svgs[icon]}</>;
}

interface Props {
  order: AdminOrder;
}

export default function AdminOrderTimeline({ order }: Props) {
  const steps = buildSteps(order);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
      {steps.map((step, idx) => {
        const dotColor = step.done ? step.color : step.active ? step.color : "rgba(184,117,20,0.2)";
        const lineColor = step.done ? "rgba(184,117,20,0.25)" : "rgba(184,117,20,0.1)";

        return (
          <div
            key={step.key}
            className="admin-detail-timeline-step"
            style={{ display: "flex", gap: "0.75rem", position: "relative" }}
          >
            {/* Dot + line */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0, width: 28 }}>
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  background: step.done ? `${step.color}15` : "rgba(255,255,255,0.5)",
                  border: `2px solid ${dotColor}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  zIndex: 1,
                  boxShadow: step.active ? `0 0 0 4px ${step.color}15` : "none",
                }}
              >
                <StepIcon icon={step.icon} color={step.color} done={step.done} active={step.active} />
              </div>
              {idx < steps.length - 1 && (
                <div
                  style={{
                    width: 2,
                    flex: 1,
                    minHeight: 14,
                    background: lineColor,
                    marginTop: "2px",
                    marginBottom: "2px",
                  }}
                />
              )}
            </div>

            {/* Content */}
            <div
              style={{
                flex: 1,
                paddingBottom: idx < steps.length - 1 ? "0.75rem" : 0,
                paddingTop: "2px",
                opacity: step.cancelled && step.key !== "delivered" ? 0.4 : 1,
              }}
            >
              <p
                style={{
                  fontSize: "0.85rem",
                  fontWeight: step.done || step.active ? 700 : 500,
                  color: step.done ? step.color : step.active ? step.color : "#9ca3af",
                  lineHeight: 1.3,
                }}
              >
                {step.label}
              </p>
              {step.sub && (
                <p style={{ fontSize: "0.72rem", color: "#6F5635", marginTop: "2px" }}>
                  {step.sub}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
