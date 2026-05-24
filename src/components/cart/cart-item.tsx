"use client";

import { useCartStore } from "@/store/use-cart";
import type { CartItem as CartItemType, ProductColorScheme } from "@/types/product";

/* ── Thumb visual simplificado ──────────────────────────── */

const THUMB_GRADIENTS: Record<ProductColorScheme, string> = {
  amber:  "linear-gradient(145deg, rgba(255,247,223,0.7) 0%, rgba(184,117,20,0.92) 100%)",
  pale:   "linear-gradient(145deg, rgba(255,253,230,0.8) 0%, rgba(200,175,80,0.88) 100%)",
  dark:   "linear-gradient(145deg, rgba(200,150,80,0.4) 0%, rgba(70,35,10,0.95) 100%)",
  cream:  "linear-gradient(145deg, rgba(255,252,240,0.8) 0%, rgba(210,192,140,0.9) 100%)",
  gold:   "linear-gradient(145deg, rgba(255,240,180,0.7) 0%, rgba(160,120,20,0.92) 100%)",
  herb:   "linear-gradient(145deg, rgba(240,245,220,0.7) 0%, rgba(148,114,20,0.92) 100%)",
  floral: "linear-gradient(145deg, rgba(250,240,235,0.7) 0%, rgba(170,128,60,0.9) 100%)",
  wood:   "linear-gradient(145deg, rgba(220,180,130,0.6) 0%, rgba(100,62,28,0.92) 100%)",
};

function ItemThumb({ colorScheme }: { colorScheme: ProductColorScheme }) {
  return (
    <div
      aria-hidden
      style={{
        width: 52,
        height: 62,
        flexShrink: 0,
        borderRadius: "7px 7px 18px 18px",
        background: THUMB_GRADIENTS[colorScheme],
        boxShadow:
          "0 4px 14px rgba(184,117,20,0.22), 0 0 0 1px rgba(212,175,55,0.2)",
      }}
    />
  );
}

/* ── Remove icon ────────────────────────────────────────── */

function XIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

/* ── Cart Item ──────────────────────────────────────────── */

export default function CartItem({ item }: { item: CartItemType }) {
  const increaseQuantity = useCartStore((s) => s.increaseQuantity);
  const decreaseQuantity = useCartStore((s) => s.decreaseQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

  const itemSubtotal = item.price * item.quantity;

  return (
    <div
      className="flex gap-3.5 py-4"
      style={{ borderBottom: "1px solid rgba(212,175,55,0.18)" }}
    >
      {/* Thumb */}
      <ItemThumb colorScheme={item.colorScheme} />

      {/* Content */}
      <div className="flex-1 min-w-0 flex flex-col gap-2">

        {/* Name + remove */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p
              className="text-sm font-semibold leading-snug truncate"
              style={{ fontFamily: "var(--font-playfair)", color: "#2C1E11" }}
            >
              {item.name}
            </p>
            <p
              className="text-[9px] uppercase tracking-[0.22em] mt-0.5"
              style={{ color: "#B87514" }}
            >
              {item.category} · {item.size}
            </p>
          </div>
          <button
            onClick={() => removeItem(item.productId)}
            className="p-1.5 rounded-full transition-all duration-200 shrink-0"
            style={{
              color: "#6F5635",
              background: "rgba(255,255,255,0.5)",
              border: "1px solid rgba(184,117,20,0.2)",
            }}
            aria-label={`Eliminar ${item.name}`}
          >
            <XIcon />
          </button>
        </div>

        {/* Price · quantity · subtotal */}
        <div className="flex items-center justify-between gap-2">

          {/* Unit price */}
          <span className="text-[10px]" style={{ color: "rgba(111,86,53,0.7)" }}>
            ${item.price.toFixed(2)} / ud.
          </span>

          {/* Quantity controls */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => decreaseQuantity(item.productId)}
              className="w-6 h-6 rounded-lg flex items-center justify-center text-sm font-medium transition-all duration-200"
              style={{
                background: "rgba(255,255,255,0.7)",
                border: "1px solid rgba(184,117,20,0.28)",
                color: "#6F5635",
              }}
              aria-label="Reducir cantidad"
            >
              −
            </button>
            <span
              className="w-6 text-center text-sm font-semibold"
              style={{ fontFamily: "var(--font-playfair)", color: "#2C1E11" }}
            >
              {item.quantity}
            </span>
            <button
              onClick={() => increaseQuantity(item.productId)}
              className="w-6 h-6 rounded-lg flex items-center justify-center text-sm font-medium transition-all duration-200"
              style={{
                background: "rgba(255,255,255,0.7)",
                border: "1px solid rgba(184,117,20,0.28)",
                color: "#6F5635",
              }}
              aria-label="Aumentar cantidad"
            >
              +
            </button>
          </div>

          {/* Item subtotal */}
          <span
            className="text-sm font-bold"
            style={{ fontFamily: "var(--font-playfair)", color: "#D4AF37" }}
          >
            ${itemSubtotal.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}
