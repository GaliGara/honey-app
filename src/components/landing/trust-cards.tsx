function LeafIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M11 20A7 7 0 0 1 4 13c0-5 5-9 8-11 3 2 8 6 8 11a7 7 0 0 1-7 7z" />
      <path d="M12 20v-9" />
    </svg>
  );
}

function MapPinIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function GiftIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <polyline points="20 12 20 22 4 22 4 12" />
      <rect x="2" y="7" width="20" height="5" />
      <line x1="12" y1="22" x2="12" y2="7" />
      <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
      <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
    </svg>
  );
}

const TRUST_ITEMS = [
  {
    icon: LeafIcon,
    title: "100% Natural",
    body: "Sin aditivos, sin conservantes. Solo miel pura, tal como la abeja la creó.",
    accent: "rgba(212,175,55,0.15)",
  },
  {
    icon: MapPinIcon,
    title: "Origen garantizado",
    body: "Trazabilidad completa desde el colmenar hasta tu hogar.",
    accent: "rgba(184,117,20,0.12)",
  },
  {
    icon: GiftIcon,
    title: "Regalos que enamoran",
    body: "Presentaciones únicas para momentos que merecen ser recordados.",
    accent: "rgba(229,169,59,0.14)",
  },
] as const;

export default function TrustCards() {
  return (
    <section className="relative py-24 overflow-hidden" style={{ background: "#EAE3D2" }}>

      {/* Decorative top edge */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 1,
          background: "linear-gradient(90deg, transparent 0%, rgba(212,175,55,0.5) 50%, transparent 100%)",
        }}
      />

      <div className="max-w-6xl mx-auto px-6">

        {/* Section label */}
        <div className="flex items-center justify-center gap-4 mb-14">
          <div className="gold-divider flex-1 max-w-[80px]" />
          <span
            className="text-[10px] uppercase tracking-[0.4em]"
            style={{ color: "#B87514" }}
          >
            Nuestra promesa
          </span>
          <div className="gold-divider flex-1 max-w-[80px]" />
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TRUST_ITEMS.map(({ icon: Icon, title, body, accent }) => (
            <div
              key={title}
              className="glass-panel rounded-2xl p-8 flex flex-col items-center text-center"
              style={{ background: `rgba(255,255,255,0.38)` }}
            >
              {/* Icon halo */}
              <div
                className="flex items-center justify-center rounded-full mb-6"
                style={{
                  width: 64,
                  height: 64,
                  background: accent,
                  color: "#B87514",
                  boxShadow: `0 0 0 8px ${accent}`,
                }}
              >
                <Icon />
              </div>

              {/* Title */}
              <h3
                className="text-lg font-semibold mb-3"
                style={{ fontFamily: "var(--font-playfair)", color: "#2C1E11" }}
              >
                {title}
              </h3>

              {/* Body */}
              <p className="text-sm leading-relaxed" style={{ color: "#6F5635" }}>
                {body}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Decorative bottom edge */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 1,
          background: "linear-gradient(90deg, transparent 0%, rgba(212,175,55,0.4) 50%, transparent 100%)",
        }}
      />
    </section>
  );
}
