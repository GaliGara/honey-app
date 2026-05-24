export default function CtaSection() {
  return (
    <section className="relative py-28 overflow-hidden warm-dark-bg">

      {/* Decorative hex shapes — background */}
      <div
        aria-hidden
        className="hex-shape absolute pointer-events-none"
        style={{
          width: 420,
          height: 420,
          right: "-100px",
          top: "50%",
          transform: "translateY(-50%) rotate(15deg)",
          background: "rgba(212,175,55,0.05)",
        }}
      />
      <div
        aria-hidden
        className="hex-shape absolute pointer-events-none"
        style={{
          width: 240,
          height: 240,
          left: "-60px",
          top: "20%",
          background: "rgba(229,169,59,0.06)",
          transform: "rotate(-8deg)",
        }}
      />

      {/* Top light halo */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "70%",
          height: "50%",
          background: "radial-gradient(ellipse at top, rgba(212,175,55,0.15) 0%, transparent 65%)",
          pointerEvents: "none",
        }}
      />

      <div className="relative max-w-3xl mx-auto px-6 text-center">

        {/* Eyebrow */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="gold-divider w-10" />
          <span className="text-[10px] uppercase tracking-[0.42em]" style={{ color: "rgba(212,175,55,0.7)" }}>
            Honey shop
          </span>
          <div className="gold-divider w-10" />
        </div>

        {/* Headline */}
        <h2
          className="text-4xl md:text-5xl font-bold leading-[1.2] mb-6"
          style={{ fontFamily: "var(--font-playfair)", color: "#F4EFE3" }}
        >
          Lleva a casa la{" "}
          <span
            style={{
              background: "linear-gradient(135deg, #D4AF37 0%, #E5A93B 55%, #B87514 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            esencia dorada
          </span>{" "}
          de la colmena.
        </h2>

        {/* Body */}
        <p
          className="text-base md:text-lg leading-relaxed mb-12 max-w-xl mx-auto"
          style={{ color: "rgba(244,239,227,0.65)" }}
        >
          Explora una colección creada para quienes disfrutan lo natural con una
          mirada más elegante, consciente y especial.
        </p>

        {/* CTA */}
        <a href="/tienda" className="premium-button text-sm px-10">
          Explorar tienda
        </a>

        {/* Trust strip */}
        <div className="mt-14 flex items-center justify-center gap-3 flex-wrap">
          {["Envío gratuito +$50", "Devolución 30 días", "Pago seguro"].map((item) => (
            <span
              key={item}
              className="text-[10px] uppercase tracking-[0.25em] px-3 py-1.5 rounded-full"
              style={{
                color: "rgba(244,239,227,0.5)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
