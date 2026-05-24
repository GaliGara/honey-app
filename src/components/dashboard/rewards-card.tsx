/* ── Hexagonal CSS badge ────────────────────────────────────── */
function HexBadge() {
  return (
    <div className="relative flex items-center justify-center" style={{ width: 88, height: 100 }}>
      {/* Outer glow */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: -8,
          clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
          background: "rgba(212,175,55,0.18)",
          filter: "blur(8px)",
        }}
      />
      {/* Main badge */}
      <div
        style={{
          width: 88,
          height: 100,
          clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
          background: "linear-gradient(145deg, #D4AF37 0%, #E5A93B 45%, #B87514 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        {/* Inner shadow overlay */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            clipPath: "inherit",
            background: "linear-gradient(145deg, rgba(255,255,255,0.22) 0%, transparent 50%)",
          }}
        />
        {/* Text */}
        <div className="relative flex flex-col items-center gap-0.5">
          <span
            style={{
              fontFamily: "var(--font-playfair)",
              color: "#2C1E11",
              fontSize: "0.65rem",
              fontWeight: 700,
              letterSpacing: "0.06em",
              lineHeight: 1.2,
              textAlign: "center",
            }}
          >
            GOLD
          </span>
          <span
            style={{
              color: "rgba(44,30,17,0.75)",
              fontSize: "0.55rem",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              textAlign: "center",
              lineHeight: 1.2,
            }}
          >
            BEEKEEPER
          </span>
        </div>
      </div>
    </div>
  );
}

/* ── Progress bar ───────────────────────────────────────────── */
function ProgressBar({ percent }: { percent: number }) {
  return (
    <div
      style={{
        height: 6,
        borderRadius: 99,
        background: "rgba(212,175,55,0.15)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: `${percent}%`,
          height: "100%",
          borderRadius: 99,
          background: "linear-gradient(90deg, #D4AF37 0%, #E5A93B 100%)",
          boxShadow: "0 0 8px rgba(212,175,55,0.5)",
          transition: "width 0.8s ease",
        }}
      />
    </div>
  );
}

/* ── Component ──────────────────────────────────────────────── */

const CURRENT_POINTS = 1250;
const NEXT_LEVEL_POINTS = 2000;
const PERCENT = Math.round((CURRENT_POINTS / NEXT_LEVEL_POINTS) * 100);

export default function RewardsCard() {
  return (
    <div
      id="recompensas"
      className="glass-panel rounded-2xl p-6 flex flex-col gap-5 relative overflow-hidden"
    >
      {/* Subtle hex decor */}
      <div
        aria-hidden
        className="hex-shape absolute pointer-events-none"
        style={{
          width: 160,
          height: 160,
          right: -40,
          bottom: -40,
          background: "rgba(212,175,55,0.06)",
          transform: "rotate(5deg)",
        }}
      />

      {/* Header */}
      <div>
        <h2
          className="text-base font-semibold"
          style={{ fontFamily: "var(--font-playfair)", color: "#2C1E11" }}
        >
          Programa de recompensas
        </h2>
        <div className="gold-divider mt-1.5" style={{ maxWidth: 80 }} />
      </div>

      {/* Badge + points */}
      <div className="flex items-center gap-5">
        <HexBadge />
        <div className="flex flex-col gap-1">
          <p
            style={{
              fontFamily: "var(--font-playfair)",
              color: "#D4AF37",
              fontSize: "2rem",
              fontWeight: 700,
              lineHeight: 1,
            }}
          >
            {CURRENT_POINTS.toLocaleString()}
          </p>
          <p className="text-xs uppercase tracking-[0.18em]" style={{ color: "#6F5635" }}>
            Puntos acumulados
          </p>
          <p
            className="text-[10px] mt-0.5 px-2 py-0.5 rounded-full inline-block"
            style={{
              color: "#B87514",
              background: "rgba(212,175,55,0.12)",
              border: "1px solid rgba(212,175,55,0.25)",
            }}
          >
            Gold Beekeeper
          </p>
        </div>
      </div>

      {/* Progress to next level */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between text-xs">
          <span style={{ color: "#6F5635" }}>Progreso al nivel Platinum</span>
          <span style={{ color: "#B87514", fontWeight: 600 }}>
            {CURRENT_POINTS.toLocaleString()} / {NEXT_LEVEL_POINTS.toLocaleString()}
          </span>
        </div>
        <ProgressBar percent={PERCENT} />
        <p className="text-[10px]" style={{ color: "rgba(111,86,53,0.6)" }}>
          Te faltan {(NEXT_LEVEL_POINTS - CURRENT_POINTS).toLocaleString()} puntos para Platinum Beekeeper
        </p>
      </div>

      {/* Quick actions */}
      <div
        className="flex gap-3 pt-3"
        style={{ borderTop: "1px solid rgba(212,175,55,0.15)" }}
      >
        <a href="#" className="secondary-button text-xs flex-1 text-center">
          Canjear puntos
        </a>
        <a href="#" className="secondary-button text-xs flex-1 text-center">
          Ver beneficios
        </a>
      </div>
    </div>
  );
}
