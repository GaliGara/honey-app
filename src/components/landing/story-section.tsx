function BeeIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 2C8 2 5 5 5 9c0 2.5 1.2 4.7 3 6.1V18a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-2.9c1.8-1.4 3-3.6 3-6.1 0-4-3-7-7-7z" />
      <path d="M12 2v5" />
      <path d="M7 9h10" />
      <path d="M9 6.5c-1.5-.5-3-1-4-2" />
      <path d="M15 6.5c1.5-.5 3-1 4-2" />
    </svg>
  );
}

export default function StorySection() {
  return (
    <section
      className="relative py-28 overflow-hidden"
      style={{ background: "#EAE3D2" }}
    >
      {/* Decorative large hex */}
      <div
        aria-hidden
        className="hex-shape absolute pointer-events-none"
        style={{
          width: 500,
          height: 500,
          right: "-120px",
          top: "50%",
          transform: "translateY(-50%) rotate(10deg)",
          background: "linear-gradient(135deg, rgba(212,175,55,0.07) 0%, rgba(229,169,59,0.04) 100%)",
        }}
      />
      <div
        aria-hidden
        className="hex-shape absolute pointer-events-none"
        style={{
          width: 200,
          height: 200,
          left: "-60px",
          bottom: "10%",
          background: "rgba(184,117,20,0.06)",
          transform: "rotate(-5deg)",
        }}
      />

      <div className="relative max-w-4xl mx-auto px-6 text-center">

        {/* Icon */}
        <div
          className="inline-flex items-center justify-center rounded-full mb-8 mx-auto"
          style={{
            width: 72,
            height: 72,
            background: "linear-gradient(135deg, rgba(212,175,55,0.18) 0%, rgba(229,169,59,0.1) 100%)",
            border: "1px solid rgba(212,175,55,0.35)",
            color: "#B87514",
          }}
        >
          <BeeIcon />
        </div>

        {/* Kicker */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="gold-divider w-10" />
          <span className="text-[10px] uppercase tracking-[0.42em]" style={{ color: "#B87514" }}>
            Nuestra historia
          </span>
          <div className="gold-divider w-10" />
        </div>

        {/* Pull quote */}
        <blockquote
          className="text-3xl md:text-4xl font-bold leading-[1.25] mb-10"
          style={{ fontFamily: "var(--font-playfair)", color: "#2C1E11" }}
        >
          De colmenares seleccionados a tu mesa,{" "}
          <span
            style={{
              background: "linear-gradient(135deg, #D4AF37 0%, #B87514 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            cada producto Honey
          </span>{" "}
          celebra el trabajo paciente de las abejas.
        </blockquote>

        {/* Body */}
        <p
          className="text-base md:text-lg leading-relaxed max-w-2xl mx-auto mb-12"
          style={{ color: "#6F5635" }}
        >
          Trabajamos con colmenares de confianza que respetan los ciclos naturales
          de la colmena. Sin prisa, sin atajos. El resultado es una miel que
          cuenta la historia del terroir donde nació: su flora, su altitud, su luz.
        </p>

        {/* Three pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-4">
          {[
            { num: "01", label: "Selección", text: "Elegimos solo los colmenares con los estándares más altos de pureza." },
            { num: "02", label: "Extracción", text: "Proceso en frío para preservar enzimas, aromas y sabor vivos." },
            { num: "03", label: "Entrega",   text: "De la colmena a tu hogar, con cuidado en cada detalle del envase." },
          ].map(({ num, label, text }) => (
            <div key={num} className="flex flex-col items-center text-center gap-3">
              <span
                className="text-3xl font-bold"
                style={{ fontFamily: "var(--font-playfair)", color: "rgba(212,175,55,0.4)" }}
              >
                {num}
              </span>
              <div className="gold-divider w-8" />
              <span className="text-sm font-semibold tracking-wide" style={{ color: "#2C1E11" }}>
                {label}
              </span>
              <p className="text-xs leading-relaxed" style={{ color: "#6F5635" }}>
                {text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
