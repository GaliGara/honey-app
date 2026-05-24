function RefreshIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" />
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

const subscription = {
  name: "Monthly Honey Reserve",
  nameEs: "Reserva Mensual de Miel",
  product: "Miel Multifloral 500g",
  status: "active" as const,
  statusLabel: "Activa",
  nextDelivery: "5 Jun, 2025",
  frequency: "Mensual",
  price: "$24.00 / mes",
  nextCharge: "28 May, 2025",
} as const;

export default function SubscriptionCard() {
  return (
    <div
      id="suscripcion"
      className="glass-panel rounded-2xl p-6 flex flex-col gap-5 relative overflow-hidden"
    >
      {/* Ambient decor */}
      <div
        aria-hidden
        className="hex-shape absolute pointer-events-none"
        style={{
          width: 180,
          height: 180,
          left: -50,
          top: -50,
          background: "rgba(212,175,55,0.05)",
          transform: "rotate(-8deg)",
        }}
      />

      {/* Header */}
      <div className="relative flex items-start justify-between gap-3">
        <div>
          <h2
            className="text-base font-semibold"
            style={{ fontFamily: "var(--font-playfair)", color: "#2C1E11" }}
          >
            Suscripción
          </h2>
          <div className="gold-divider mt-1.5" style={{ maxWidth: 80 }} />
        </div>
        {/* Status badge */}
        <span
          className="text-[9px] uppercase tracking-[0.2em] px-2.5 py-1 rounded-full flex items-center gap-1.5 shrink-0"
          style={{
            background: "rgba(91,150,90,0.14)",
            color: "#4A8A49",
            border: "1px solid rgba(91,150,90,0.28)",
          }}
        >
          <span
            style={{
              width: 5,
              height: 5,
              borderRadius: "50%",
              background: "#4A8A49",
              display: "inline-block",
            }}
          />
          {subscription.statusLabel}
        </span>
      </div>

      {/* Subscription info */}
      <div
        className="relative rounded-xl p-4 flex flex-col gap-3"
        style={{
          background: "rgba(255,255,255,0.5)",
          border: "1px solid rgba(212,175,55,0.18)",
        }}
      >
        <div className="flex items-start gap-3">
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: "linear-gradient(135deg, rgba(212,175,55,0.2), rgba(229,169,59,0.12))",
              border: "1px solid rgba(212,175,55,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#B87514",
              flexShrink: 0,
            }}
          >
            <RefreshIcon />
          </div>
          <div>
            <p
              className="text-sm font-semibold"
              style={{ fontFamily: "var(--font-playfair)", color: "#2C1E11" }}
            >
              {subscription.nameEs}
            </p>
            <p className="text-xs mt-0.5" style={{ color: "#6F5635" }}>
              {subscription.product}
            </p>
          </div>
        </div>

        {/* Details grid */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          {[
            { label: "Frecuencia",      value: subscription.frequency },
            { label: "Precio",          value: subscription.price },
            { label: "Próximo cargo",   value: subscription.nextCharge },
            { label: "Próxima entrega", value: subscription.nextDelivery },
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="text-[9px] uppercase tracking-[0.14em] mb-0.5" style={{ color: "rgba(111,86,53,0.55)" }}>
                {label}
              </p>
              <p className="font-medium" style={{ color: "#2C1E11" }}>
                {value}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Next delivery indicator */}
      <div className="flex items-center gap-2 text-xs" style={{ color: "#B87514" }}>
        <CalendarIcon />
        <span>Próxima entrega: <strong>{subscription.nextDelivery}</strong></span>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <a href="#" className="secondary-button text-xs flex-1 text-center">
          Gestionar
        </a>
        <a href="#" className="secondary-button text-xs flex-1 text-center">
          Pausar
        </a>
      </div>
    </div>
  );
}
