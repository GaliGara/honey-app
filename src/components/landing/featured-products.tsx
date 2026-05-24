type ColorScheme = "amber" | "pale" | "dark" | "cream";

interface ProductData {
  name: string;
  category: string;
  price: string;
  scheme: ColorScheme;
}

const PRODUCTS: ProductData[] = [
  { name: "Miel Multifloral",  category: "Miel cruda",               price: "$24.00", scheme: "amber" },
  { name: "Miel de Azahar",    category: "Miel monofloral",           price: "$28.00", scheme: "pale"  },
  { name: "Propóleo",          category: "Productos de la colmena",   price: "$22.00", scheme: "dark"  },
  { name: "Jalea Real",        category: "Productos de la colmena",   price: "$32.00", scheme: "cream" },
];

const SCHEME_STYLES: Record<ColorScheme, {
  fill: string;
  fillDeep: string;
  glass: string;
  lid: string;
  glow: string;
  label: string;
}> = {
  amber: {
    fill:      "linear-gradient(180deg, rgba(229,169,59,0.85) 0%, rgba(184,117,20,0.98) 100%)",
    fillDeep:  "rgba(229,169,59,0.85)",
    glass:     "linear-gradient(145deg, rgba(255,247,223,0.55) 0%, rgba(229,169,59,0.22) 40%, rgba(184,117,20,0.4) 100%)",
    lid:       "linear-gradient(135deg, #8B6B3D 0%, #2C1E11 100%)",
    glow:      "rgba(229,169,59,0.35)",
    label:     "#B87514",
  },
  pale: {
    fill:      "linear-gradient(180deg, rgba(240,220,130,0.82) 0%, rgba(200,175,80,0.95) 100%)",
    fillDeep:  "rgba(240,220,130,0.82)",
    glass:     "linear-gradient(145deg, rgba(255,253,230,0.65) 0%, rgba(240,220,130,0.25) 40%, rgba(200,175,80,0.35) 100%)",
    lid:       "linear-gradient(135deg, #9B8B50 0%, #5A4A25 100%)",
    glow:      "rgba(240,220,130,0.35)",
    label:     "#7A6030",
  },
  dark: {
    fill:      "linear-gradient(180deg, rgba(140,80,30,0.85) 0%, rgba(80,40,12,0.98) 100%)",
    fillDeep:  "rgba(140,80,30,0.85)",
    glass:     "linear-gradient(145deg, rgba(200,150,80,0.35) 0%, rgba(140,80,30,0.22) 40%, rgba(80,40,12,0.5) 100%)",
    lid:       "linear-gradient(135deg, #4A3020 0%, #1A0E06 100%)",
    glow:      "rgba(140,80,30,0.35)",
    label:     "#6F5635",
  },
  cream: {
    fill:      "linear-gradient(180deg, rgba(240,228,185,0.85) 0%, rgba(210,192,140,0.95) 100%)",
    fillDeep:  "rgba(240,228,185,0.85)",
    glass:     "linear-gradient(145deg, rgba(255,252,240,0.65) 0%, rgba(240,228,185,0.25) 40%, rgba(210,192,140,0.35) 100%)",
    lid:       "linear-gradient(135deg, #A09060 0%, #5A4A30 100%)",
    glow:      "rgba(240,228,185,0.35)",
    label:     "#8B7040",
  },
};

function MiniJar({ scheme }: { scheme: ColorScheme }) {
  const s = SCHEME_STYLES[scheme];
  const W = 90;
  const H = 130;

  return (
    <div style={{ width: W, height: H, position: "relative", margin: "0 auto" }}>
      {/* Glow */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: "20% -40%",
          background: `radial-gradient(ellipse, ${s.glow} 0%, transparent 70%)`,
          filter: "blur(16px)",
          pointerEvents: "none",
        }}
      />

      {/* Lid */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: 0,
          left: "12%",
          right: "12%",
          height: 9,
          background: s.lid,
          borderRadius: "4px 4px 1px 1px",
          boxShadow: "0 3px 8px rgba(44,30,17,0.4)",
        }}
      />

      {/* Lid band */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: 7,
          left: "9%",
          right: "9%",
          height: 5,
          background: "rgba(44,30,17,0.35)",
          borderRadius: "1px",
        }}
      />

      {/* Body */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: 11,
          left: 0,
          right: 0,
          bottom: 12,
          borderRadius: "6px 6px 16px 16px",
          overflow: "hidden",
          background: s.glass,
          boxShadow: [
            `0 12px 32px ${s.glow}`,
            "0 0 0 1px rgba(212,175,55,0.25)",
            "inset 2px 0 10px rgba(255,255,255,0.15)",
          ].join(", "),
        }}
      >
        {/* Fill */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "68%", background: s.fill }} />

        {/* Meniscus */}
        <div
          style={{
            position: "absolute",
            bottom: "68%",
            left: "-5%",
            right: "-5%",
            height: 7,
            background: s.fillDeep,
            borderRadius: "0 0 50% 50% / 0 0 100% 100%",
            transform: "translateY(3px)",
          }}
        />

        {/* Glass highlight */}
        <div
          style={{
            position: "absolute",
            top: "5%",
            left: "9%",
            width: "11%",
            height: "50%",
            background: "linear-gradient(180deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.08) 70%, transparent 100%)",
            borderRadius: "3px",
          }}
        />

        {/* Label area */}
        <div
          style={{
            position: "absolute",
            top: "22%",
            left: "16%",
            right: "16%",
            height: "30%",
            background: "rgba(244,239,227,0.9)",
            borderRadius: "3px",
            border: `1px solid ${s.label}44`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-playfair)",
              fontSize: 7,
              fontWeight: 700,
              color: "#2C1E11",
              letterSpacing: "0.1em",
            }}
          >
            HONEY
          </span>
        </div>
      </div>

      {/* Shadow */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          bottom: 0,
          left: "10%",
          right: "10%",
          height: 12,
          background: `radial-gradient(ellipse, ${s.glow} 0%, transparent 70%)`,
          filter: "blur(5px)",
        }}
      />
    </div>
  );
}

export default function FeaturedProducts() {
  return (
    <section className="relative py-28 warm-radial-bg overflow-hidden">

      <div className="max-w-6xl mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-4 mb-5">
            <div className="gold-divider w-12" />
            <span className="text-[10px] uppercase tracking-[0.4em]" style={{ color: "#B87514" }}>
              Colección
            </span>
            <div className="gold-divider w-12" />
          </div>
          <h2
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{ fontFamily: "var(--font-playfair)", color: "#2C1E11" }}
          >
            Selección premium
          </h2>
          <p className="text-sm leading-relaxed max-w-md mx-auto" style={{ color: "#6F5635" }}>
            Cada producto, seleccionado por su pureza, origen y carácter único.
          </p>
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {PRODUCTS.map((product) => (
            <article
              key={product.name}
              className="product-card rounded-2xl flex flex-col overflow-hidden"
            >
              {/* Visual area */}
              <div
                className="flex items-center justify-center py-10"
                style={{
                  background: "linear-gradient(160deg, rgba(255,255,255,0.3) 0%, rgba(234,227,210,0.5) 100%)",
                  minHeight: 180,
                }}
              >
                <MiniJar scheme={product.scheme} />
              </div>

              {/* Info */}
              <div className="flex flex-col flex-1 p-5 gap-3">
                <div>
                  <span className="text-[9px] uppercase tracking-[0.3em]" style={{ color: "#B87514" }}>
                    {product.category}
                  </span>
                  <h3
                    className="text-base font-semibold mt-1 leading-snug"
                    style={{ fontFamily: "var(--font-playfair)", color: "#2C1E11" }}
                  >
                    {product.name}
                  </h3>
                </div>

                <div className="gold-divider" />

                <div className="flex items-center justify-between mt-auto">
                  <span
                    className="text-lg font-bold"
                    style={{ fontFamily: "var(--font-playfair)", color: "#D4AF37" }}
                  >
                    {product.price}
                  </span>
                  <button
                    className="px-4 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all duration-400"
                    style={{
                      background: "linear-gradient(135deg, #D4AF37 0%, #E5A93B 50%, #B87514 100%)",
                      color: "#2C1E11",
                      boxShadow: "0 3px 12px rgba(212,175,55,0.28)",
                    }}
                  >
                    Ver producto
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* View all CTA */}
        <div className="flex justify-center mt-12">
          <button className="secondary-button text-sm">
            Ver toda la colección
          </button>
        </div>
      </div>
    </section>
  );
}
