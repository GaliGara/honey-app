import { siteConfig } from "@/constants/site";

/* ─── CSS Honey Jar ────────────────────────────────────── */
function HoneyJar() {
  return (
    <div className="float-animation" style={{ width: 210, height: 300, position: "relative" }}>

      {/* Ambient glow */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: "15% -40%",
          background: "radial-gradient(ellipse, rgba(229,169,59,0.3) 0%, transparent 68%)",
          filter: "blur(28px)",
          pointerEvents: "none",
        }}
      />

      {/* Lid */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: 0,
          left: "11%",
          right: "11%",
          height: 20,
          background: "linear-gradient(135deg, #8B6B3D 0%, #2C1E11 100%)",
          borderRadius: "6px 6px 2px 2px",
          boxShadow: "0 4px 14px rgba(44,30,17,0.55), 0 1px 0 rgba(255,255,255,0.08) inset",
        }}
      />

      {/* Lid band */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: 17,
          left: "8%",
          right: "8%",
          height: 9,
          background: "linear-gradient(180deg, #6F5635 0%, #4A3020 100%)",
          borderRadius: "1px 1px 3px 3px",
          boxShadow: "0 2px 8px rgba(44,30,17,0.4)",
        }}
      />

      {/* Jar body */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: 24,
          left: 0,
          right: 0,
          bottom: 28,
          borderRadius: "10px 10px 28px 28px",
          overflow: "hidden",
          background: "linear-gradient(145deg, rgba(255,247,223,0.55) 0%, rgba(229,169,59,0.25) 35%, rgba(184,117,20,0.45) 100%)",
          boxShadow: [
            "0 24px 64px rgba(184,117,20,0.45)",
            "0 0 0 1px rgba(212,175,55,0.35)",
            "inset 3px 0 16px rgba(255,255,255,0.18)",
            "inset -5px 0 24px rgba(184,117,20,0.18)",
            "inset 0 -8px 20px rgba(44,30,17,0.12)",
          ].join(", "),
        }}
      >
        {/* Honey fill */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "70%",
            background: "linear-gradient(180deg, rgba(229,169,59,0.88) 0%, rgba(212,175,55,0.92) 15%, rgba(184,117,20,0.98) 100%)",
          }}
        />

        {/* Honey meniscus / curved surface */}
        <div
          style={{
            position: "absolute",
            bottom: "70%",
            left: "-5%",
            right: "-5%",
            height: 14,
            background: "rgba(229,169,59,0.82)",
            borderRadius: "0 0 50% 50% / 0 0 100% 100%",
            transform: "translateY(4px)",
          }}
        />

        {/* Glass highlight — primary */}
        <div
          style={{
            position: "absolute",
            top: "4%",
            left: "8%",
            width: "13%",
            height: "58%",
            background: "linear-gradient(180deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.12) 65%, transparent 100%)",
            borderRadius: "6px",
          }}
        />

        {/* Glass highlight — secondary (right edge) */}
        <div
          style={{
            position: "absolute",
            top: "8%",
            right: "9%",
            width: "5%",
            height: "32%",
            background: "linear-gradient(180deg, rgba(255,255,255,0.22) 0%, transparent 100%)",
            borderRadius: "3px",
          }}
        />

        {/* Label */}
        <div
          style={{
            position: "absolute",
            top: "20%",
            left: "14%",
            right: "14%",
            height: "33%",
            background: "rgba(244,239,227,0.93)",
            borderRadius: "5px",
            border: "1px solid rgba(212,175,55,0.5)",
            boxShadow: "0 2px 10px rgba(184,117,20,0.18)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 5,
            padding: "10px 6px",
          }}
        >
          <div className="gold-divider" style={{ width: "55%" }} />
          <span
            style={{
              fontFamily: "var(--font-playfair)",
              fontSize: 14,
              fontWeight: 700,
              color: "#2C1E11",
              letterSpacing: "0.12em",
            }}
          >
            HONEY
          </span>
          <span
            style={{
              fontSize: 8,
              color: "#6F5635",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
            }}
          >
            de la colmena
          </span>
          <div className="gold-divider" style={{ width: "55%" }} />
        </div>

        {/* Bottom darkening */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "18%",
            background: "linear-gradient(0deg, rgba(44,30,17,0.28) 0%, transparent 100%)",
          }}
        />
      </div>

      {/* Drop shadow */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          bottom: 0,
          left: "8%",
          right: "8%",
          height: 28,
          background: "radial-gradient(ellipse at center, rgba(184,117,20,0.55) 0%, rgba(184,117,20,0.08) 65%, transparent 100%)",
          filter: "blur(8px)",
        }}
      />
    </div>
  );
}

/* ─── Decorative hex shapes ────────────────────────────── */
function HexDecor({
  size,
  top,
  right,
  left,
  bottom,
  opacity,
  rotate,
}: {
  size: number;
  top?: string;
  right?: string;
  left?: string;
  bottom?: string;
  opacity: number;
  rotate?: number;
}) {
  return (
    <div
      aria-hidden
      className="hex-shape absolute pointer-events-none"
      style={{
        width: size,
        height: size,
        top,
        right,
        left,
        bottom,
        opacity,
        transform: rotate !== undefined ? `rotate(${rotate}deg)` : undefined,
        background: "linear-gradient(135deg, rgba(212,175,55,0.6) 0%, rgba(229,169,59,0.3) 100%)",
      }}
    />
  );
}

/* ─── Hero Section ─────────────────────────────────────── */
export default function HeroSection() {
  return (
    <section className="relative min-h-screen warm-radial-bg overflow-hidden">

      {/* Decorative hex shapes */}
      <HexDecor size={320} top="-80px" right="-60px" opacity={0.04} rotate={15} />
      <HexDecor size={160} top="30%" left="-40px" opacity={0.06} rotate={-10} />
      <HexDecor size={80} bottom="15%" right="12%" opacity={0.08} rotate={5} />
      <HexDecor size={50} top="15%" left="20%" opacity={0.07} rotate={20} />

      {/* Top light ray */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "60%",
          height: "35%",
          background: "radial-gradient(ellipse at top, rgba(212,175,55,0.12) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-6 pt-36 pb-20 flex flex-col lg:flex-row items-center justify-between gap-12 min-h-screen">

        {/* ── Left: Text ── */}
        <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left max-w-xl">

          {/* Eyebrow */}
          <div className="flex items-center gap-3 mb-7">
            <div className="gold-divider w-8" />
            <span
              className="text-[10px] uppercase tracking-[0.42em]"
              style={{ color: "#B87514" }}
            >
              Pureza · Origen · Excelencia
            </span>
            <div className="gold-divider w-8" />
          </div>

          {/* Headline */}
          <h1
            className="text-5xl md:text-6xl xl:text-7xl font-bold leading-[1.1] mb-6"
            style={{ fontFamily: "var(--font-playfair)", color: "#2C1E11" }}
          >
            {siteConfig.tagline.split(",")[0]},
            <br />
            <span
              style={{
                background: "linear-gradient(135deg, #D4AF37 0%, #E5A93B 55%, #B87514 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              lujo en cada gota.
            </span>
          </h1>

          {/* Body */}
          <p
            className="text-base md:text-lg leading-relaxed mb-10 max-w-md"
            style={{ color: "#6F5635" }}
          >
            Descubre mieles 100&nbsp;% naturales y productos de la colmena
            seleccionados con cuidado, sabor incomparable y una experiencia
            pensada para disfrutarse lentamente.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4">
            <a href="/tienda" className="premium-button text-sm">
              Descubrir colección
            </a>
            <a href="/tienda" className="secondary-button text-sm">
              Explorar tienda
            </a>
          </div>

          {/* Stats / trust strip */}
          <div className="mt-14 flex items-center gap-8 flex-wrap justify-center lg:justify-start">
            {[
              { value: "100%", label: "Natural" },
              { value: "6+", label: "Variedades" },
              { value: "24/7", label: "Trazabilidad" },
            ].map(({ value, label }) => (
              <div key={label} className="flex flex-col items-center lg:items-start">
                <span
                  className="text-2xl font-bold"
                  style={{ fontFamily: "var(--font-playfair)", color: "#D4AF37" }}
                >
                  {value}
                </span>
                <span className="text-xs uppercase tracking-widest mt-0.5" style={{ color: "#6F5635" }}>
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right: Jar visual ── */}
        <div className="flex-1 flex items-center justify-center relative">

          {/* Large ambient blur behind jar */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              width: 460,
              height: 460,
              background: "radial-gradient(ellipse, rgba(229,169,59,0.18) 0%, transparent 68%)",
              filter: "blur(40px)",
              pointerEvents: "none",
            }}
          />

          {/* Subtle ring behind jar */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              width: 280,
              height: 280,
              borderRadius: "50%",
              border: "1px solid rgba(212,175,55,0.18)",
              boxShadow: "0 0 0 40px rgba(212,175,55,0.04)",
            }}
          />
          <div
            aria-hidden
            style={{
              position: "absolute",
              width: 340,
              height: 340,
              borderRadius: "50%",
              border: "1px solid rgba(212,175,55,0.1)",
            }}
          />

          <HoneyJar />
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        style={{ color: "#B87514" }}
        aria-hidden
      >
        <span className="text-[9px] uppercase tracking-[0.35em]">Scroll</span>
        <div
          style={{
            width: 1,
            height: 40,
            background: "linear-gradient(180deg, #D4AF37, transparent)",
          }}
        />
      </div>
    </section>
  );
}
