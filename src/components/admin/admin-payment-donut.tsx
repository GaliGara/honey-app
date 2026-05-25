import type { AdminStats } from "@/types/admin";

const R = 36;
const CX = 50;
const CY = 50;
const C = 2 * Math.PI * R;
const SW = 16;

const COLORS: Record<string, string> = {
  pending_transfer: "#f59e0b",
  pending_deposit: "#f97316",
  pending_cash_payment: "#6366f1",
  paid: "#10b981",
  other: "#9ca3af",
};

const LABELS: Record<string, string> = {
  pending_transfer: "Espera transf.",
  pending_deposit: "Espera depósito",
  pending_cash_payment: "Contra entrega",
  paid: "Pagado",
  other: "Otros",
};

const MXN = new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 });

interface Props {
  stats: AdminStats;
}

export default function AdminPaymentDonut({ stats }: Props) {
  const dist = stats.paymentDistribution;
  const rawSegs = [
    { key: "pending_transfer", value: dist.pending_transfer },
    { key: "pending_deposit", value: dist.pending_deposit },
    { key: "pending_cash_payment", value: dist.pending_cash_payment },
    { key: "paid", value: dist.paid },
    { key: "other", value: dist.other },
  ].filter((s) => s.value > 0);

  const total = rawSegs.reduce((acc, s) => acc + s.value, 0);

  if (total === 0) {
    return (
      <div style={{ padding: "1.5rem", textAlign: "center" }}>
        <p style={{ fontSize: "0.85rem", color: "#6F5635" }}>Sin pedidos registrados.</p>
      </div>
    );
  }

  let cumulative = 0;
  const segs = rawSegs.map((s) => {
    const fraction = s.value / total;
    const dashLen = fraction * C;
    const dashOffset = -cumulative * C;
    cumulative += fraction;
    return { ...s, fraction, dashLen, dashOffset };
  });

  return (
    <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
      {/* SVG Donut */}
      <div style={{ position: "relative", width: 108, height: 108, flexShrink: 0 }}>
        <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>
          {/* Track */}
          <circle
            cx={CX} cy={CY} r={R}
            fill="none"
            stroke="rgba(184,117,20,0.07)"
            strokeWidth={SW}
          />
          {/* Segments */}
          <g transform="rotate(-90 50 50)">
            {segs.map((seg) => (
              <circle
                key={seg.key}
                cx={CX} cy={CY} r={R}
                fill="none"
                stroke={COLORS[seg.key]}
                strokeWidth={SW}
                strokeDasharray={`${seg.dashLen.toFixed(2)} ${(C - seg.dashLen).toFixed(2)}`}
                strokeDashoffset={seg.dashOffset.toFixed(2)}
                strokeLinecap="butt"
              />
            ))}
          </g>
        </svg>
        {/* Center label */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-playfair)",
              fontSize: "1.375rem",
              fontWeight: 700,
              color: "#2C1E11",
              lineHeight: 1,
            }}
          >
            {total}
          </p>
          <p style={{ fontSize: "0.6rem", color: "#6F5635", letterSpacing: "0.06em", textTransform: "uppercase" }}>
            pedidos
          </p>
        </div>
      </div>

      {/* Legend */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.3rem", minWidth: 0 }}>
        {segs.map((seg) => (
          <div key={seg.key} style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "2px",
                background: COLORS[seg.key],
                flexShrink: 0,
              }}
            />
            <span
              style={{
                flex: 1,
                fontSize: "0.7rem",
                color: "#6F5635",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {LABELS[seg.key]}
            </span>
            <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#2C1E11", flexShrink: 0 }}>
              {seg.value}
            </span>
            <span style={{ fontSize: "0.66rem", color: "#9ca3af", width: 30, textAlign: "right", flexShrink: 0 }}>
              {Math.round(seg.fraction * 100)}%
            </span>
          </div>
        ))}
        <div style={{ marginTop: "0.4rem", paddingTop: "0.4rem", borderTop: "1px solid rgba(184,117,20,0.1)" }}>
          <p style={{ fontSize: "0.7rem", color: "#6F5635" }}>
            Ingresos confirmados:{" "}
            <strong style={{ color: "#2C1E11" }}>{MXN.format(stats.totalRevenue)}</strong>
          </p>
        </div>
      </div>
    </div>
  );
}
