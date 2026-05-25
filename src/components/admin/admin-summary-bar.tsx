import type { AdminStats } from "@/types/admin";

const MXN = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
  maximumFractionDigits: 0,
});

function MiniCard({
  label,
  value,
  dot,
  last,
}: {
  label: string;
  value: string;
  dot?: string;
  last?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "0.15rem",
        padding: "0.6rem 1rem",
        borderRight: last ? "none" : "1px solid rgba(184,117,20,0.09)",
        minWidth: 0,
        flexShrink: 0,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
        {dot && (
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: dot, flexShrink: 0 }} />
        )}
        <span style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#6F5635", whiteSpace: "nowrap" }}>
          {label}
        </span>
      </div>
      <p style={{ fontFamily: "var(--font-playfair)", fontSize: "1.1rem", fontWeight: 700, color: "#2C1E11", lineHeight: 1, whiteSpace: "nowrap" }}>
        {value}
      </p>
    </div>
  );
}

interface Props {
  stats: AdminStats;
  total: number;
}

export default function AdminSummaryBar({ stats, total }: Props) {
  const avg = stats.paidOrders > 0 ? Math.round(stats.totalRevenue / stats.paidOrders) : 0;

  const metrics = [
    { label: "Total", value: String(total) },
    { label: "Facturado", value: MXN.format(stats.totalRevenue), dot: "#10b981" },
    { label: "Pendientes", value: String(stats.pendingOrders), dot: "#f59e0b" },
    { label: "Confirmados", value: String(stats.confirmedOrders), dot: "#3b82f6" },
    { label: "Enviados", value: String(stats.shippedOrders), dot: "#8b5cf6" },
    { label: "Entregados", value: String(stats.deliveredOrders), dot: "#10b981" },
    { label: "Ticket prom.", value: avg > 0 ? MXN.format(avg) : "—" },
  ];

  return (
    <div className="admin-card" style={{ display: "flex", flexWrap: "wrap", overflow: "hidden" }}>
      {metrics.map((m, i) => (
        <MiniCard key={m.label} {...m} last={i === metrics.length - 1} />
      ))}
    </div>
  );
}
