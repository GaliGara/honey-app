/* ══════════════════════════════════════════════════════════
   StorySection — Editorial 2-column brand story
   Server Component — no client JS needed.
   ══════════════════════════════════════════════════════════ */

/* ── Brand bee icon ──────────────────────────────────────── */

function BeeIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M12 2C8 2 5 5 5 9c0 2.5 1.2 4.7 3 6.1V18a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-2.9c1.8-1.4 3-3.6 3-6.1 0-4-3-7-7-7z" />
      <path d="M12 2v5" />
      <path d="M7 9h10" />
      <path d="M9 6.5c-1.5-.5-3-1-4-2" />
      <path d="M15 6.5c1.5-.5 3-1 4-2" />
    </svg>
  );
}

/* ── Pillar data ─────────────────────────────────────────── */

const PILLARS = [
  {
    label: "Origen",
    text: "Colmenares seleccionados que respetan los ciclos naturales de la colmena y su flora.",
  },
  {
    label: "Pureza",
    text: "Extracción en frío, sin calor ni aditivos, para preservar enzimas y aromas vivos.",
  },
  {
    label: "Cuidado",
    text: "De la colmena a tu mesa, cada frasco envasado con atención en cada detalle.",
  },
] as const;

/* ── Brand origin seal ───────────────────────────────────── */

function BrandVisual() {
  return (
    <div
      className="relative flex items-center justify-center mx-auto"
      style={{ width: 300, height: 300 }}
    >
      {/* Ambient glow */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at center, rgba(212,175,55,0.22) 0%, transparent 68%)",
          pointerEvents: "none",
        }}
      />

      {/* Drifting hex decors */}
      <div
        aria-hidden
        className="hex-shape hex-drift absolute pointer-events-none"
        style={{
          width: 68,
          height: 68,
          top: "2%",
          left: "4%",
          background: "rgba(212,175,55,0.10)",
          ["--hd" as string]: "8s",
        }}
      />
      <div
        aria-hidden
        className="hex-shape hex-drift absolute pointer-events-none"
        style={{
          width: 42,
          height: 42,
          top: "12%",
          right: "2%",
          background: "rgba(212,175,55,0.07)",
          ["--hd" as string]: "11.5s",
          animationDelay: "-3.2s",
        }}
      />
      <div
        aria-hidden
        className="hex-shape hex-drift absolute pointer-events-none"
        style={{
          width: 54,
          height: 54,
          bottom: "8%",
          right: "6%",
          background: "rgba(229,169,59,0.09)",
          ["--hd" as string]: "9.5s",
          animationDelay: "-5s",
        }}
      />
      <div
        aria-hidden
        className="hex-shape hex-drift absolute pointer-events-none"
        style={{
          width: 30,
          height: 30,
          bottom: "4%",
          left: "8%",
          background: "rgba(184,117,20,0.08)",
          ["--hd" as string]: "13s",
          animationDelay: "-1.8s",
        }}
      />

      {/* Outer dashed ring */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          width: 220,
          height: 220,
          borderRadius: "50%",
          border: "1px dashed rgba(212,175,55,0.25)",
        }}
      />

      {/* Origin seal */}
      <div
        style={{
          position: "relative",
          width: 192,
          height: 192,
          borderRadius: "50%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 4,
          background:
            "linear-gradient(145deg, rgba(255,253,240,0.96) 0%, rgba(234,227,210,0.92) 100%)",
          border: "1px solid rgba(212,175,55,0.42)",
          boxShadow: [
            "0 0 0 9px rgba(212,175,55,0.06)",
            "0 0 0 18px rgba(212,175,55,0.025)",
            "0 12px 50px rgba(184,117,20,0.20)",
          ].join(", "),
        }}
      >
        <div style={{ color: "#B87514", marginBottom: 2 }}>
          <BeeIcon />
        </div>

        <span
          style={{
            fontFamily: "var(--font-playfair)",
            color: "#2C1E11",
            fontSize: 28,
            fontWeight: 700,
            lineHeight: 1,
            letterSpacing: "0.03em",
          }}
        >
          Honey
        </span>

        {/* Gold hairline */}
        <div
          aria-hidden
          style={{
            width: 36,
            height: 1,
            background:
              "linear-gradient(90deg, transparent, rgba(212,175,55,0.65), transparent)",
            margin: "3px 0",
          }}
        />

        <span
          style={{
            fontSize: 8,
            textTransform: "uppercase",
            letterSpacing: "0.32em",
            color: "#B87514",
          }}
        >
          Artesanal · Natural
        </span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN EXPORT
   ═══════════════════════════════════════════════════════════ */
export default function StorySection() {
  return (
    <section
      className="relative py-28 overflow-hidden"
      style={{ background: "#EAE3D2" }}
    >
      {/* Top gold edge */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 1,
          background:
            "linear-gradient(90deg, transparent 0%, rgba(212,175,55,0.32) 50%, transparent 100%)",
        }}
      />
      {/* Bottom gold edge */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 1,
          background:
            "linear-gradient(90deg, transparent 0%, rgba(212,175,55,0.20) 50%, transparent 100%)",
        }}
      />

      <div className="relative max-w-5xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* ── Left: Brand visual ── */}
          <div className="flex justify-center">
            <BrandVisual />
          </div>

          {/* ── Right: Editorial content ── */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left">

            {/* Kicker */}
            <div className="flex items-center gap-3 mb-6">
              <div className="gold-divider w-8" />
              <span
                className="text-[10px] uppercase tracking-[0.42em]"
                style={{ color: "#B87514" }}
              >
                Nuestra historia
              </span>
            </div>

            {/* Pull quote */}
            <h2
              className="text-3xl md:text-4xl font-bold leading-[1.25] mb-6"
              style={{ fontFamily: "var(--font-playfair)", color: "#2C1E11" }}
            >
              De colmenares seleccionados a tu mesa,{" "}
              <span
                style={{
                  background:
                    "linear-gradient(135deg, #D4AF37 0%, #B87514 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                cada frasco Honey
              </span>{" "}
              celebra el trabajo paciente de las abejas.
            </h2>

            {/* Body */}
            <p
              className="text-sm md:text-base leading-relaxed mb-10"
              style={{ color: "#6F5635", maxWidth: 440 }}
            >
              Trabajamos con colmenares que respetan los ciclos naturales
              de la colmena. Sin prisa, sin atajos. El resultado es una
              miel que cuenta la historia del terroir donde nació: su flora,
              su altitud, su luz.
            </p>

            {/* Pillar glass cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
              {PILLARS.map(({ label, text }) => (
                <div
                  key={label}
                  style={{
                    background: "rgba(255,255,255,0.62)",
                    backdropFilter: "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",
                    border: "1px solid rgba(212,175,55,0.22)",
                    borderRadius: 14,
                    boxShadow: "0 2px 16px rgba(184,117,20,0.07)",
                    padding: "18px 14px",
                  }}
                >
                  {/* Gold accent bar */}
                  <div
                    aria-hidden
                    className="mx-auto lg:mx-0"
                    style={{
                      width: 24,
                      height: 2,
                      background: "linear-gradient(90deg, #D4AF37, #B87514)",
                      borderRadius: 2,
                      marginBottom: 10,
                    }}
                  />
                  <span
                    className="block text-sm font-semibold mb-1.5"
                    style={{
                      fontFamily: "var(--font-playfair)",
                      color: "#2C1E11",
                    }}
                  >
                    {label}
                  </span>
                  <p
                    className="text-[11px] leading-relaxed"
                    style={{ color: "#6F5635" }}
                  >
                    {text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
