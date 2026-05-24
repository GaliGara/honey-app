const STATS = [
  { value: "1,250", label: "Puntos" },
  { value: "2",     label: "Pedidos" },
  { value: "6",     label: "Guardados" },
] as const;

export default function DashboardHeader() {
  return (
    <div
      id="resumen"
      className="glass-panel rounded-2xl p-6 md:p-8 overflow-hidden relative"
    >
      {/* Ambient hex decor */}
      <div
        aria-hidden
        className="hex-shape absolute pointer-events-none"
        style={{
          width: 240,
          height: 240,
          right: -60,
          top: -60,
          background: "rgba(212,175,55,0.07)",
          transform: "rotate(10deg)",
        }}
      />

      <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">

        {/* Left: greeting */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-3 mb-1">
            <div className="gold-divider w-6" />
            <span
              className="text-[9px] uppercase tracking-[0.38em]"
              style={{ color: "#B87514" }}
            >
              Panel de cliente
            </span>
          </div>
          <h1
            style={{
              fontFamily: "var(--font-playfair)",
              color: "#2C1E11",
              fontSize: "1.8rem",
              fontWeight: 700,
              lineHeight: 1.15,
            }}
          >
            Bienvenida, Isabella
          </h1>
          <p className="text-sm" style={{ color: "#6F5635" }}>
            Miembro Gold desde Mayo 2025 · Nivel Gold Beekeeper
          </p>
        </div>

        {/* Right: quick stats */}
        <div
          className="flex gap-6 sm:gap-8 shrink-0 p-4 rounded-xl"
          style={{ background: "rgba(255,255,255,0.45)", border: "1px solid rgba(212,175,55,0.2)" }}
        >
          {STATS.map(({ value, label }, i) => (
            <div key={label} className="flex flex-col items-center gap-0.5">
              {i > 0 && (
                <div className="hidden" aria-hidden />
              )}
              <span
                style={{
                  fontFamily: "var(--font-playfair)",
                  color: "#D4AF37",
                  fontSize: "1.4rem",
                  fontWeight: 700,
                  lineHeight: 1,
                }}
              >
                {value}
              </span>
              <span
                className="text-[9px] uppercase tracking-[0.18em]"
                style={{ color: "#6F5635" }}
              >
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
