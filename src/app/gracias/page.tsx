import type { Metadata } from "next";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import CheckoutSuccessCard from "@/components/checkout/checkout-success-card";

export const metadata: Metadata = {
  title: "Pedido confirmado — Honey",
  description: "Tu pedido ha sido recibido. Gracias por confiar en Honey.",
};

/* ── Animated decorative hexes (server-renderable) ───────── */
function PageDecor() {
  return (
    <>
      {/* Large right hex */}
      <div
        aria-hidden
        className="hex-shape hex-drift absolute pointer-events-none"
        style={{
          width: 340,
          height: 340,
          right: "2%",
          top: "4%",
          background: "rgba(212,175,55,0.05)",
          transform: "rotate(15deg)",
          ["--hd" as string]: "13s",
        }}
      />
      {/* Small bottom-left hex */}
      <div
        aria-hidden
        className="hex-shape hex-drift absolute pointer-events-none"
        style={{
          width: 200,
          height: 200,
          left: "2%",
          bottom: "10%",
          background: "rgba(184,117,20,0.04)",
          transform: "rotate(-10deg)",
          ["--hd" as string]: "10.5s",
          animationDelay: "-4.5s",
        }}
      />
      {/* Accent top-left hex */}
      <div
        aria-hidden
        className="hex-shape hex-drift absolute pointer-events-none"
        style={{
          width: 120,
          height: 120,
          left: "6%",
          top: "22%",
          background: "rgba(229,169,59,0.035)",
          transform: "rotate(25deg)",
          ["--hd" as string]: "16s",
          animationDelay: "-7s",
        }}
      />
      {/* Bottom ambient warm glow */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "60%",
          height: "30%",
          background:
            "radial-gradient(ellipse at bottom, rgba(229,169,59,0.09) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
    </>
  );
}

/* ── Page ─────────────────────────────────────────────────── */
export default async function GraciasPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const params = await searchParams;

  return (
    <>
      <Navbar />

      <main className="warm-radial-bg relative min-h-screen pt-28 pb-16 px-4 overflow-hidden">
        <PageDecor />
        <CheckoutSuccessCard orderNumber={params.order} />
      </main>

      <Footer />
    </>
  );
}
