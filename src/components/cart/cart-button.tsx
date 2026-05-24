"use client";

import { useState, useEffect } from "react";
import { useCartStore } from "@/store/use-cart";

function BagIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}

export default function CartButton() {
  const [mounted, setMounted] = useState(false);
  const toggleCart = useCartStore((s) => s.toggleCart);
  const items = useCartStore((s) => s.items);

  useEffect(() => {
    setMounted(true);
  }, []);

  const totalItems = mounted
    ? items.reduce((sum, i) => sum + i.quantity, 0)
    : 0;

  return (
    <button
      onClick={toggleCart}
      className="relative flex items-center gap-2 ml-1 px-4 py-2 rounded-full text-sm font-medium tracking-wide transition-all duration-500"
      style={{
        background:
          "linear-gradient(135deg, #D4AF37 0%, #E5A93B 50%, #B87514 100%)",
        color: "#2C1E11",
        boxShadow:
          "0 4px 16px rgba(212,175,55,0.3), 0 1px 0 rgba(255,255,255,0.25) inset",
      }}
      aria-label={
        totalItems > 0
          ? `Carrito — ${totalItems} ${totalItems === 1 ? "producto" : "productos"}`
          : "Abrir carrito"
      }
    >
      <BagIcon />
      <span className="hidden sm:inline">Carrito</span>

      {/* Badge — solo visible después de hydration y con items */}
      {mounted && totalItems > 0 && (
        <span
          className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-0.5 rounded-full text-[9px] font-bold flex items-center justify-center"
          style={{
            background: "#2C1E11",
            color: "#D4AF37",
            border: "1.5px solid #D4AF37",
          }}
        >
          {totalItems > 99 ? "99+" : totalItems}
        </span>
      )}
    </button>
  );
}
