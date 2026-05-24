import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import ProductFilters from "@/components/products/product-filters";
import { PRODUCTS } from "@/constants/products";

/* ── Store hero section (inline, server component) ──────── */
function StoreHero() {
  return (
    <div
      className="relative pt-36 pb-14 px-6 text-center overflow-hidden"
      style={{ background: "#EAE3D2" }}
    >
      {/* Ambient light */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "60%",
          height: "80%",
          background: "radial-gradient(ellipse at top, rgba(212,175,55,0.14) 0%, transparent 65%)",
          pointerEvents: "none",
        }}
      />

      {/* Decorative hex */}
      <div
        aria-hidden
        className="hex-shape absolute pointer-events-none"
        style={{
          width: 200,
          height: 200,
          right: "5%",
          top: "10%",
          background: "rgba(212,175,55,0.06)",
          transform: "rotate(10deg)",
        }}
      />
      <div
        aria-hidden
        className="hex-shape absolute pointer-events-none"
        style={{
          width: 120,
          height: 120,
          left: "8%",
          bottom: "5%",
          background: "rgba(184,117,20,0.07)",
          transform: "rotate(-5deg)",
        }}
      />

      <div className="relative">
        {/* Breadcrumb */}
        <nav className="flex items-center justify-center gap-2 mb-6 text-[10px] uppercase tracking-[0.3em]" aria-label="Breadcrumb">
          <a href="/" style={{ color: "rgba(111,86,53,0.6)" }}>
            Inicio
          </a>
          <span style={{ color: "rgba(184,117,20,0.4)" }}>·</span>
          <span style={{ color: "#B87514" }}>Tienda</span>
        </nav>

        {/* Eyebrow */}
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="gold-divider w-10" />
          <span className="text-[10px] uppercase tracking-[0.42em]" style={{ color: "#B87514" }}>
            Nuestra colección
          </span>
          <div className="gold-divider w-10" />
        </div>

        {/* Title */}
        <h1
          className="text-4xl md:text-5xl font-bold mb-4"
          style={{ fontFamily: "var(--font-playfair)", color: "#2C1E11" }}
        >
          La{" "}
          <span
            style={{
              background: "linear-gradient(135deg, #D4AF37 0%, #E5A93B 55%, #B87514 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Colmena
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-sm leading-relaxed max-w-md mx-auto" style={{ color: "#6F5635" }}>
          Mieles de origen, productos de la colmena y accesorios seleccionados con un criterio claro: pureza, sabor y carácter.
        </p>
      </div>
    </div>
  );
}

/* ── Page ───────────────────────────────────────────────── */
export default function TiendaPage() {
  return (
    <>
      <Navbar />
      <main>
        <StoreHero />

        {/* Bottom border of hero */}
        <div
          aria-hidden
          style={{
            height: 1,
            background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.4), transparent)",
          }}
        />

        {/* Products section */}
        <div
          className="warm-radial-bg min-h-screen"
          style={{ paddingTop: "3rem", paddingBottom: "5rem" }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <ProductFilters products={PRODUCTS} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
