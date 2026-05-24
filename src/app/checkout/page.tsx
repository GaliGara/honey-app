import type { Metadata } from "next";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import CheckoutForm from "@/components/checkout/checkout-form";

export const metadata: Metadata = {
  title: "Checkout — Honey",
  description: "Finaliza tu pedido de productos Honey.",
};

/* ── Decorative hexes (animated, server) ─────────────────── */
function PageDecor() {
  return (
    <>
      <div
        aria-hidden
        className="hex-shape hex-drift absolute pointer-events-none"
        style={{
          width: 300,
          height: 300,
          right: "1%",
          top: "6%",
          background: "rgba(212,175,55,0.05)",
          transform: "rotate(12deg)",
          ["--hd" as string]: "14s",
        }}
      />
      <div
        aria-hidden
        className="hex-shape hex-drift absolute pointer-events-none"
        style={{
          width: 180,
          height: 180,
          left: "0.5%",
          bottom: "14%",
          background: "rgba(184,117,20,0.04)",
          transform: "rotate(-8deg)",
          ["--hd" as string]: "11s",
          animationDelay: "-5s",
        }}
      />
      <div
        aria-hidden
        className="hex-shape hex-drift absolute pointer-events-none"
        style={{
          width: 110,
          height: 110,
          left: "7%",
          top: "32%",
          background: "rgba(229,169,59,0.035)",
          transform: "rotate(22deg)",
          ["--hd" as string]: "17s",
          animationDelay: "-8.5s",
        }}
      />
    </>
  );
}

/* ── Checkout step progress ──────────────────────────────── */
type StepState = "done" | "active" | "future";

const CHECKOUT_STEPS: Array<{ num: string; label: string; state: StepState }> =
  [
    { num: "✓", label: "Carrito",       state: "done"   },
    { num: "2", label: "Pedido",        state: "active" },
    { num: "3", label: "Confirmación",  state: "future" },
  ];

function CheckoutSteps() {
  return (
    <div className="flex items-center mb-10">
      {CHECKOUT_STEPS.map(({ num, label, state }, i) => (
        <div key={label} className="flex items-center shrink-0">
          {/* Connector line between steps */}
          {i > 0 && (
            <div
              aria-hidden
              style={{
                width: 28,
                height: 1,
                margin: "0 8px",
                background:
                  state === "future"
                    ? "rgba(212,175,55,0.12)"
                    : "rgba(212,175,55,0.38)",
              }}
            />
          )}

          {/* Step bubble + label */}
          <div className="flex items-center gap-1.5">
            <div
              style={{
                width: 20,
                height: 20,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 8,
                fontWeight: 700,
                flexShrink: 0,
                ...(state === "done"
                  ? {
                      background: "rgba(212,175,55,0.14)",
                      border: "1px solid rgba(212,175,55,0.40)",
                      color: "#D4AF37",
                    }
                  : state === "active"
                  ? {
                      background:
                        "linear-gradient(135deg, #D4AF37 0%, #B87514 100%)",
                      color: "#2C1E11",
                    }
                  : {
                      background: "transparent",
                      border: "1px solid rgba(212,175,55,0.18)",
                      color: "rgba(111,86,53,0.30)",
                    }),
              }}
            >
              {num}
            </div>
            <span
              style={{
                fontSize: 9,
                textTransform: "uppercase",
                letterSpacing: "0.22em",
                color:
                  state === "active"
                    ? "#B87514"
                    : state === "done"
                    ? "rgba(111,86,53,0.5)"
                    : "rgba(111,86,53,0.30)",
                fontWeight: state === "active" ? 600 : 400,
              }}
            >
              {label}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Page ─────────────────────────────────────────────────── */
export default function CheckoutPage() {
  return (
    <>
      <Navbar />

      <main className="warm-radial-bg relative min-h-screen pt-28 pb-20 px-4">
        {/* Bottom ambient warm glow */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            bottom: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: "55%",
            height: "28%",
            background:
              "radial-gradient(ellipse at bottom, rgba(229,169,59,0.09) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

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
          <div className="mb-6">
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

          {/* Step progress */}
          <CheckoutSteps />

          {/* Form + summary */}
          <CheckoutForm />
        </div>
      </main>

      <Footer />
    </>
  );
}
