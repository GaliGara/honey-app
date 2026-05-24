import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import ProductFilters from "@/components/products/product-filters";
import { PRODUCTS } from "@/constants/products";

/* ── Store hero section (inline, server component) ──────── */
function StoreHero() {
  return (
    <div
      className="relative pt-36 pb-16 px-6 text-center overflow-hidden"
      style={{ background: "#EAE3D2" }}
    >
      {/* Broad warm ambient light */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "80%",
          height: "100%",
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(212,175,55,0.18) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Hex decor — upper right, drifting */}
      <div
        aria-hidden
        className="hex-shape hex-drift absolute pointer-events-none"
        style={{
          width: 220,
          height: 220,
          right: "3%",
          top: "8%",
          background:
            "linear-gradient(135deg, rgba(212,175,55,0.10) 0%, rgba(184,117,20,0.04) 100%)",
          ["--hr" as string]: "10deg",
          ["--hd" as string]: "14s",
          ["--hdelay" as string]: "0s",
        }}
      />
      {/* Hex decor — lower left, drifting */}
      <div
        aria-hidden
        className="hex-shape hex-drift absolute pointer-events-none"
        style={{
          width: 130,
          height: 130,
          left: "5%",
          bottom: "0%",
          background:
            "linear-gradient(135deg, rgba(184,117,20,0.09) 0%, rgba(212,175,55,0.04) 100%)",
          ["--hr" as string]: "-6deg",
          ["--hd" as string]: "11s",
          ["--hdelay" as string]: "-4s",
        }}
      />
      {/* Hex decor — upper left, small */}
      <div
        aria-hidden
        className="hex-shape hex-drift absolute pointer-events-none"
        style={{
          width: 72,
          height: 72,
          left: "16%",
          top: "18%",
          background: "rgba(212,175,55,0.08)",
          ["--hr" as string]: "22deg",
          ["--hd" as string]: "9s",
          ["--hdelay" as string]: "-2s",
        }}
      />

      <div className="relative">
        {/* Breadcrumb */}
        <nav
          className="flex items-center justify-center gap-2 mb-6 text-[10px] uppercase tracking-[0.32em]"
          aria-label="Breadcrumb"
        >
          <a href="/" style={{ color: "rgba(111,86,53,0.6)" }}>
            Inicio
          </a>
          <span style={{ color: "rgba(184,117,20,0.4)" }}>·</span>
          <span style={{ color: "#B87514" }}>Tienda</span>
        </nav>

        {/* Eyebrow */}
        <div className="flex items-center justify-center gap-4 mb-5">
          <div className="gold-divider w-12" />
          <span
            className="text-[10px] uppercase tracking-[0.44em]"
            style={{ color: "#B87514" }}
          >
            Nuestra colección
          </span>
          <div className="gold-divider w-12" />
        </div>

        {/* Title */}
        <h1
          className="text-4xl md:text-5xl xl:text-6xl font-bold mb-5"
          style={{ fontFamily: "var(--font-playfair)", color: "#2C1E11" }}
        >
          La{" "}
          <span
            style={{
              background:
                "linear-gradient(135deg, #D4AF37 0%, #E5A93B 55%, #B87514 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Colmena
          </span>
        </h1>

        {/* Subtitle */}
        <p
          className="text-sm md:text-base leading-relaxed max-w-lg mx-auto"
          style={{ color: "#6F5635" }}
        >
          Mieles de origen, productos de la colmena y accesorios seleccionados
          con un criterio claro: pureza, sabor y carácter.
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
