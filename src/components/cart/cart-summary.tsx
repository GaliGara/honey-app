"use client";

import { useRouter } from "next/navigation";

interface CartSummaryProps {
  subtotal: number;
  onClose: () => void;
}

function ArrowIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

export default function CartSummary({ subtotal, onClose }: CartSummaryProps) {
  const router = useRouter();

  const handleCheckout = () => {
    onClose();
    router.push("/checkout");
  };

  return (
    <div className="flex flex-col gap-4">

      {/* Totals */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <span className="text-sm" style={{ color: "#6F5635" }}>Subtotal</span>
          <span
            className="text-sm font-semibold"
            style={{ fontFamily: "var(--font-playfair)", color: "#2C1E11" }}
          >
            ${subtotal.toFixed(2)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm" style={{ color: "#6F5635" }}>Envío</span>
          <span className="text-xs italic" style={{ color: "#B87514" }}>
            Calculado en checkout
          </span>
        </div>

        <div className="gold-divider my-0.5" />

        <div className="flex items-center justify-between">
          <span
            className="text-base font-semibold"
            style={{ fontFamily: "var(--font-playfair)", color: "#2C1E11" }}
          >
            Total estimado
          </span>
          <span
            className="text-xl font-bold"
            style={{ fontFamily: "var(--font-playfair)", color: "#D4AF37" }}
          >
            ${subtotal.toFixed(2)}
          </span>
        </div>
      </div>

      {/* CTAs */}
      <div className="flex flex-col gap-3 mt-1">
        <button
          onClick={handleCheckout}
          className="premium-button w-full text-sm flex items-center justify-center gap-2"
        >
          Continuar al checkout
          <ArrowIcon />
        </button>

        <button
          onClick={onClose}
          className="secondary-button w-full text-sm"
        >
          Seguir comprando
        </button>
      </div>

      {/* Trust note */}
      <p
        className="text-[9px] text-center uppercase tracking-[0.22em]"
        style={{ color: "rgba(111,86,53,0.45)" }}
      >
        Pago seguro · Devolución 30 días · Envío premium
      </p>
    </div>
  );
}
