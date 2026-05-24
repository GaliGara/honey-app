"use client";

import { useEffect, useState } from "react";
import { useCartStore } from "@/store/use-cart";
import CartItem from "./cart-item";
import CartSummary from "./cart-summary";

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function EmptyBagIcon() {
  return (
    <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}

export default function CartDrawer() {
  const [mounted, setMounted] = useState(false);

  const isOpen = useCartStore((s) => s.isOpen);
  const closeCart = useCartStore((s) => s.closeCart);
  const clearCart = useCartStore((s) => s.clearCart);
  const items = useCartStore((s) => s.items);
  const getSubtotal = useCartStore((s) => s.getSubtotal);

  useEffect(() => {
    setMounted(true);
  }, []);

  /* Lock body scroll cuando el drawer está abierto */
  useEffect(() => {
    if (!mounted) return;
    const prev = document.body.style.overflow;
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen, mounted]);

  const cartItems = mounted ? items : [];
  const subtotal = mounted ? getSubtotal() : 0;
  const isEmpty = cartItems.length === 0;

  return (
    <>
      {/* ── Overlay ── */}
      <div
        aria-hidden
        className="fixed inset-0 z-40 transition-opacity duration-300"
        style={{
          background: "rgba(44,30,17,0.45)",
          backdropFilter: "blur(5px)",
          WebkitBackdropFilter: "blur(5px)",
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? "auto" : "none",
        }}
        onClick={closeCart}
      />

      {/* ── Drawer panel ── */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Carrito de compras"
        className="fixed inset-y-0 right-0 z-50 flex flex-col w-full sm:max-w-[420px] transition-transform duration-300 ease-in-out"
        style={{
          background: "#F4EFE3",
          transform: isOpen ? "translateX(0)" : "translateX(100%)",
          boxShadow: "-24px 0 80px rgba(44,30,17,0.18)",
        }}
      >

        {/* ── Header ── */}
        <div
          className="flex items-center justify-between px-6 py-5 shrink-0"
          style={{ borderBottom: "1px solid rgba(212,175,55,0.22)" }}
        >
          <div>
            <h2
              className="text-xl font-bold"
              style={{ fontFamily: "var(--font-playfair)", color: "#2C1E11" }}
            >
              Tu carrito
            </h2>
            {!isEmpty && (
              <p
                className="text-[9px] uppercase tracking-[0.28em] mt-0.5"
                style={{ color: "#B87514" }}
              >
                {cartItems.length}{" "}
                {cartItems.length === 1 ? "producto" : "productos"}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            {!isEmpty && (
              <button
                onClick={clearCart}
                className="text-[9px] uppercase tracking-[0.2em] px-3 py-1.5 rounded-full transition-all duration-200"
                style={{
                  color: "#6F5635",
                  border: "1px solid rgba(184,117,20,0.25)",
                  background: "rgba(255,255,255,0.4)",
                }}
              >
                Vaciar
              </button>
            )}
            <button
              onClick={closeCart}
              className="p-2 rounded-full transition-all duration-200"
              style={{
                color: "#6F5635",
                background: "rgba(255,255,255,0.6)",
                border: "1px solid rgba(255,255,255,0.8)",
              }}
              aria-label="Cerrar carrito"
            >
              <CloseIcon />
            </button>
          </div>
        </div>

        {/* ── Body ── */}
        {isEmpty ? (
          /* Estado vacío */
          <div className="flex-1 flex flex-col items-center justify-center px-8 text-center gap-6">
            <div style={{ color: "rgba(184,117,20,0.28)" }}>
              <EmptyBagIcon />
            </div>

            {/* Decorative divider */}
            <div className="gold-divider w-16" />

            <div className="flex flex-col gap-2">
              <p
                className="text-xl font-semibold"
                style={{ fontFamily: "var(--font-playfair)", color: "#2C1E11" }}
              >
                Tu carrito está vacío
              </p>
              <p className="text-sm leading-relaxed" style={{ color: "#6F5635" }}>
                Descubre nuestra selección de mieles premium y productos de la
                colmena.
              </p>
            </div>

            <a
              href="/tienda"
              onClick={closeCart}
              className="premium-button text-sm"
            >
              Explorar colección
            </a>

            <p
              className="text-[9px] uppercase tracking-[0.28em]"
              style={{ color: "rgba(184,117,20,0.4)" }}
            >
              Pureza · Origen · Excelencia
            </p>
          </div>
        ) : (
          <>
            {/* Lista de items — scrollable */}
            <div className="flex-1 overflow-y-auto px-6">
              {cartItems.map((item) => (
                <CartItem key={item.productId} item={item} />
              ))}

              {/* Espacio al final de la lista */}
              <div className="h-4" />
            </div>

            {/* Resumen — fijo en el pie */}
            <div
              className="px-6 pb-6 pt-4 shrink-0"
              style={{
                borderTop: "1px solid rgba(212,175,55,0.2)",
                background:
                  "linear-gradient(180deg, rgba(244,239,227,0.6) 0%, #F4EFE3 100%)",
              }}
            >
              <CartSummary subtotal={subtotal} onClose={closeCart} />
            </div>
          </>
        )}
      </div>
    </>
  );
}
