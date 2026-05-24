const MOCK_ORDERS = [
  {
    id: "HNY-1048",
    product: "Wildflower Honey",
    description: "Miel silvestre 350g · ×1",
    date: "15 May, 2025",
    total: "$42.00",
    status: "delivered" as const,
    statusLabel: "Entregado",
    colorScheme: "#E5A93B",
  },
  {
    id: "HNY-1043",
    product: "Gourmet Honey Gift Set",
    description: "Set regalo premium · ×3",
    date: "8 May, 2025",
    total: "$78.00",
    status: "transit" as const,
    statusLabel: "En tránsito",
    colorScheme: "#D4AF37",
  },
] as const;

const STATUS_STYLE = {
  delivered: {
    bg: "rgba(91,150,90,0.14)",
    color: "#4A8A49",
    border: "rgba(91,150,90,0.28)",
  },
  transit: {
    bg: "rgba(212,175,55,0.14)",
    color: "#B87514",
    border: "rgba(212,175,55,0.32)",
  },
} as const;

function TruckIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="1" y="3" width="15" height="13" rx="1" />
      <path d="M16 8h4l3 3v5h-7V8z" />
      <circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  );
}

function CheckCircleIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

export default function RecentOrders() {
  return (
    <div
      id="pedidos"
      className="glass-panel rounded-2xl p-6 flex flex-col gap-5"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2
            className="text-base font-semibold"
            style={{ fontFamily: "var(--font-playfair)", color: "#2C1E11" }}
          >
            Pedidos recientes
          </h2>
          <div className="gold-divider mt-1.5" style={{ maxWidth: 80 }} />
        </div>
        <a
          href="#"
          className="text-[10px] uppercase tracking-[0.2em] transition-colors duration-200"
          style={{ color: "#B87514" }}
        >
          Ver todos
        </a>
      </div>

      {/* Orders */}
      <div className="flex flex-col gap-0">
        {MOCK_ORDERS.map((order, i) => {
          const style = STATUS_STYLE[order.status];
          const isLast = i === MOCK_ORDERS.length - 1;
          return (
            <div
              key={order.id}
              className="flex items-start gap-4 py-4"
              style={!isLast ? { borderBottom: "1px solid rgba(212,175,55,0.14)" } : {}}
            >
              {/* Color dot */}
              <div
                aria-hidden
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: order.colorScheme,
                  flexShrink: 0,
                  marginTop: 4,
                  boxShadow: `0 0 8px ${order.colorScheme}88`,
                }}
              />

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 flex-wrap">
                  <div>
                    <p
                      className="text-sm font-semibold"
                      style={{ fontFamily: "var(--font-playfair)", color: "#2C1E11" }}
                    >
                      {order.product}
                    </p>
                    <p className="text-[10px] mt-0.5" style={{ color: "#6F5635" }}>
                      {order.description}
                    </p>
                  </div>
                  <span
                    className="text-sm font-bold shrink-0"
                    style={{ fontFamily: "var(--font-playfair)", color: "#D4AF37" }}
                  >
                    {order.total}
                  </span>
                </div>

                <div className="flex items-center gap-3 mt-2 flex-wrap">
                  {/* Order number */}
                  <span
                    className="text-[9px] uppercase tracking-[0.2em]"
                    style={{ color: "rgba(111,86,53,0.55)" }}
                  >
                    {order.id}
                  </span>
                  <span style={{ color: "rgba(111,86,53,0.3)", fontSize: "0.5rem" }}>·</span>
                  <span className="text-[9px]" style={{ color: "rgba(111,86,53,0.55)" }}>
                    {order.date}
                  </span>

                  {/* Status badge */}
                  <span
                    className="flex items-center gap-1 text-[9px] uppercase tracking-[0.16em] px-2 py-0.5 rounded-full"
                    style={{
                      background: style.bg,
                      color: style.color,
                      border: `1px solid ${style.border}`,
                    }}
                  >
                    {order.status === "delivered" ? <CheckCircleIcon /> : <TruckIcon />}
                    {order.statusLabel}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* CTA */}
      <a
        href="#"
        className="secondary-button text-xs text-center"
      >
        Ver historial completo
      </a>
    </div>
  );
}
