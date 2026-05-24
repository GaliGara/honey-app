export default function CtaSection() {
  return (
    <section className="relative py-28 overflow-hidden warm-dark-bg">

      {/* Decorative hex shapes — animated */}
      <div
        aria-hidden
        className="hex-shape hex-drift absolute pointer-events-none"
        style={{
          width: 420,
          height: 420,
          right: "-100px",
          top: "50%",
          transform: "translateY(-50%) rotate(15deg)",
          background: "rgba(212,175,55,0.05)",
          ["--hd" as string]: "12s",
        }}
      />
      <div
        aria-hidden
        className="hex-shape hex-drift absolute pointer-events-none"
        style={{
          width: 240,
          height: 240,
          left: "-60px",
          top: "20%",
          background: "rgba(229,169,59,0.06)",
          transform: "rotate(-8deg)",
          ["--hd" as string]: "9s",
          animationDelay: "-4.5s",
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
          background:
            "radial-gradient(ellipse at top, rgba(212,175,55,0.15) 0%, transparent 65%)",
          pointerEvents: "none",
        }}
      />

      <div className="relative max-w-3xl mx-auto px-6 text-center">

        {/* Eyebrow */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="gold-divider w-10" />
          <span
            className="text-[10px] uppercase tracking-[0.42em]"
            style={{ color: "rgba(212,175,55,0.7)" }}
          >
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
              background:
                "linear-gradient(135deg, #D4AF37 0%, #E5A93B 55%, #B87514 100%)",
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
          className="text-base md:text-lg leading-relaxed mb-10 max-w-xl mx-auto"
          style={{ color: "rgba(244,239,227,0.65)" }}
        >
          Explora una colección creada para quienes disfrutan lo natural con una
          mirada más elegante, consciente y especial.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a href="/tienda" className="premium-button text-sm px-10">
            Explorar tienda
          </a>
          <a
            href="/#proceso"
            className="secondary-button text-sm"
            style={{
              color: "rgba(244,239,227,0.75)",
              borderColor: "rgba(212,175,55,0.42)",
            }}
          >
            Cómo comprar
          </a>
        </div>

        {/* Payment methods trust strip */}
        <div className="mt-14">
          <p
            className="text-[9px] uppercase tracking-[0.28em] mb-4"
            style={{ color: "rgba(244,239,227,0.30)" }}
          >
            Métodos de pago aceptados
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            {[
              "Transferencia SPEI",
              "Depósito bancario",
              "Contra entrega",
            ].map((item) => (
              <span
                key={item}
                className="text-[10px] uppercase tracking-[0.22em] px-3.5 py-1.5 rounded-full"
                style={{
                  color: "rgba(212,175,55,0.65)",
                  border: "1px solid rgba(212,175,55,0.18)",
                  background: "rgba(212,175,55,0.04)",
                }}
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
