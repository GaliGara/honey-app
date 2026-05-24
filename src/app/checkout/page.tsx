import type { Metadata } from "next";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import CheckoutForm from "@/components/checkout/checkout-form";

export const metadata: Metadata = {
  title: "Checkout — Honey",
  description: "Finaliza tu pedido de productos Honey.",
};

/* ── Decorative hex (server) ─────────────────────────────── */
function PageDecor() {
  return (
    <>
      <div
        aria-hidden
        className="hex-shape absolute pointer-events-none"
        style={{
          width: 280,
          height: 280,
          right: "2%",
          top: "8%",
          background: "rgba(212,175,55,0.05)",
          transform: "rotate(12deg)",
        }}
      />
      <div
        aria-hidden
        className="hex-shape absolute pointer-events-none"
        style={{
          width: 160,
          height: 160,
          left: "1%",
          bottom: "12%",
          background: "rgba(184,117,20,0.04)",
          transform: "rotate(-8deg)",
        }}
      />
    </>
  );
}

/* ── Page ─────────────────────────────────────────────────── */
export default function CheckoutPage() {
  return (
    <>
      <Navbar />

      <main className="warm-radial-bg relative min-h-screen pt-28 pb-20 px-4">
        <PageDecor />

        <div className="relative max-w-5xl mx-auto">
          {/* Breadcrumb */}
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 mb-8 text-[10px] uppercase tracking-[0.28em]"
          >
            <a href="/" style={{ color: "rgba(111,86,53,0.6)" }}>
              Inicio
            </a>
            <span style={{ color: "rgba(184,117,20,0.35)" }}>·</span>
            <a href="/tienda" style={{ color: "rgba(111,86,53,0.6)" }}>
              Tienda
            </a>
            <span style={{ color: "rgba(184,117,20,0.35)" }}>·</span>
            <span style={{ color: "#B87514" }}>Checkout</span>
          </nav>

          {/* Page header */}
          <div className="mb-10">
            <div className="flex items-center gap-4 mb-3">
              <div className="gold-divider w-8" />
              <span
                className="text-[10px] uppercase tracking-[0.4em]"
                style={{ color: "#B87514" }}
              >
                Tu pedido
              </span>
            </div>
            <h1
              className="text-3xl md:text-4xl font-bold"
              style={{ fontFamily: "var(--font-playfair)", color: "#2C1E11" }}
            >
              Finalizar pedido
            </h1>
            <div className="gold-divider mt-3" style={{ maxWidth: 140 }} />
          </div>

          {/* Form + summary */}
          <CheckoutForm />
        </div>
      </main>

      <Footer />
    </>
  );
}
