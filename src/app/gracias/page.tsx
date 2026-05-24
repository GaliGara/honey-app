import type { Metadata } from "next";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import CheckoutSuccessCard from "@/components/checkout/checkout-success-card";

export const metadata: Metadata = {
  title: "Pedido confirmado — Honey",
  description: "Tu pedido ha sido recibido. Gracias por confiar en Honey.",
};

export default async function GraciasPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const params = await searchParams;

  return (
    <>
      <Navbar />

      <main
        className="warm-radial-bg relative min-h-screen pt-20 pb-16 px-4 overflow-hidden"
      >
        {/* Ambient decorative elements */}
        <div
          aria-hidden
          className="hex-shape absolute pointer-events-none"
          style={{
            width: 320,
            height: 320,
            right: "3%",
            top: "5%",
            background: "rgba(212,175,55,0.05)",
            transform: "rotate(15deg)",
          }}
        />
        <div
          aria-hidden
          className="hex-shape absolute pointer-events-none"
          style={{
            width: 200,
            height: 200,
            left: "2%",
            bottom: "8%",
            background: "rgba(184,117,20,0.04)",
            transform: "rotate(-10deg)",
          }}
        />

        <CheckoutSuccessCard orderNumber={params.order} />
      </main>

      <Footer />
    </>
  );
}
