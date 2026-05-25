import type { AdminOrderSummary } from "@/types/admin";

interface TimelineEvent {
  id: string;
  time: string;
  icon: "order" | "paid" | "shipped" | "delivered" | "cancelled";
  title: string;
  subtitle: string;
  accent: string;
}

function toTimeStr(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString("es-MX", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function buildEvents(orders: AdminOrderSummary[]): TimelineEvent[] {
  const events: TimelineEvent[] = [];

  for (const o of orders) {
    if (o.status === "delivered") {
      events.push({
        id: `d-${o.id}`,
        time: toTimeStr(o.createdAt),
        icon: "delivered",
        title: "Pedido entregado",
        subtitle: `${o.orderNumber} · ${o.customerName}`,
        accent: "#10b981",
      });
    } else if (o.status === "shipped") {
      events.push({
        id: `s-${o.id}`,
        time: toTimeStr(o.createdAt),
        icon: "shipped",
        title: "Pedido enviado",
        subtitle: `${o.orderNumber} · ${o.customerName}`,
        accent: "#8b5cf6",
      });
    } else if (o.paymentStatus === "paid") {
      events.push({
        id: `p-${o.id}`,
        time: toTimeStr(o.createdAt),
        icon: "paid",
        title: "Pago confirmado",
        subtitle: `${o.orderNumber} · ${o.customerName}`,
        accent: "#10b981",
      });
    } else if (o.status === "cancelled") {
      events.push({
        id: `c-${o.id}`,
        time: toTimeStr(o.createdAt),
        icon: "cancelled",
        title: "Pedido cancelado",
        subtitle: `${o.orderNumber} · ${o.customerName}`,
        accent: "#ef4444",
      });
    } else {
      events.push({
        id: `o-${o.id}`,
        time: toTimeStr(o.createdAt),
        icon: "order",
        title: "Nuevo pedido",
        subtitle: `${o.orderNumber} · ${o.customerName}`,
        accent: "#f59e0b",
      });
    }
  }

  return events.slice(0, 7);
}

function EventIcon({ type, color }: { type: TimelineEvent["icon"]; color: string }) {
  const svgs: Record<TimelineEvent["icon"], React.ReactNode> = {
    order: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" />
      </svg>
    ),
    paid: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
    shipped: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
      </svg>
    ),
    delivered: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <polyline points="20 6 9 17 4 12" />
      </svg>
    ),
    cancelled: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    ),
  };
  return <>{svgs[type]}</>;
}

interface Props {
  orders: AdminOrderSummary[];
}

export default function AdminActivityTimeline({ orders }: Props) {
  const events = buildEvents(orders);

  if (events.length === 0) {
    return (
      <div style={{ padding: "1.5rem", textAlign: "center" }}>
        <p style={{ fontSize: "0.82rem", color: "#6F5635" }}>Sin actividad reciente.</p>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
      {events.map((ev, idx) => (
        <div
          key={ev.id}
          style={{
            display: "flex",
            gap: "0.75rem",
            padding: "0.5rem 0",
            position: "relative",
          }}
        >
          {/* Timeline line + icon */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              flexShrink: 0,
              width: 24,
            }}
          >
            <div
              style={{
                width: 24,
                height: 24,
                borderRadius: "50%",
                background: `${ev.accent}18`,
                border: `1.5px solid ${ev.accent}40`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                zIndex: 1,
              }}
            >
              <EventIcon type={ev.icon} color={ev.accent} />
            </div>
            {idx < events.length - 1 && (
              <div
                style={{
                  width: 1,
                  flex: 1,
                  minHeight: 16,
                  background: "rgba(184,117,20,0.12)",
                  marginTop: "2px",
                }}
              />
            )}
          </div>

          {/* Content */}
          <div style={{ flex: 1, minWidth: 0, paddingBottom: idx < events.length - 1 ? "0.35rem" : 0 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "0.25rem" }}>
              <p style={{ fontSize: "0.8rem", fontWeight: 600, color: "#2C1E11" }}>
                {ev.title}
              </p>
              <span style={{ fontSize: "0.68rem", color: "#9ca3af", flexShrink: 0 }}>
                {ev.time}
              </span>
            </div>
            <p style={{ fontSize: "0.72rem", color: "#6F5635", marginTop: "1px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {ev.subtitle}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
