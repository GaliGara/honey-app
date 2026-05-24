"use client";

import { useState, useEffect } from "react";
import type { OrderSummaryData } from "@/types/order";

interface CheckoutSuccessCardProps {
  orderNumber?: string;
}

function HexCheck() {
  return (
    <div
      aria-hidden
      style={{
        width: 88,
        height: 88,
        borderRadius: "30% 70% 70% 30% / 30% 30% 70% 70%",
        background: "linear-gradient(135deg, rgba(212,175,55,0.18) 0%, rgba(184,117,20,0.12) 100%)",
        border: "1px solid rgba(212,175,55,0.35)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg
        width="36"
        height="36"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#D4AF37"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20 6L9 17l-5-5" />
      </svg>
    </div>
  );
}

export default function CheckoutSuccessCard({ orderNumber }: CheckoutSuccessCardProps) {
  const [orderData, setOrderData] = useState<OrderSummaryData | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem("honey-last-order");
    if (!raw) return;
    try {
      setOrderData(JSON.parse(raw) as OrderSummaryData);
    } catch {
      // silently ignore corrupt data
    }
  }, []);

  const displayOrder = orderNumber ?? orderData?.orderNumber;

  return (
    <div className="flex flex-col items-center text-center gap-8 max-w-2xl mx-auto py-16 px-6">
      {/* Icon */}
      <HexCheck />

      {/* Divider */}
      <div className="gold-divider w-20" />

      {/* Main message */}
      <div className="flex flex-col gap-3">
        <h1
          className="text-3xl md:text-4xl font-bold"
          style={{ fontFamily: "var(--font-playfair)", color: "#2C1E11" }}
        >
          Gracias por tu pedido
        </h1>
        <p
          className="text-sm leading-relaxed max-w-sm mx-auto"
          style={{ color: "#6F5635" }}
        >
          Estamos preparando tu selección Honey con el cuidado que merece.
          Recibirás una confirmación a tu correo pronto.
        </p>
      </div>

      {/* Order number chip */}
      {displayOrder && (
        <div
          className="glass-panel rounded-2xl px-8 py-5 flex flex-col gap-1.5 items-center"
        >
          <span
            className="text-[9px] uppercase tracking-[0.3em]"
            style={{ color: "#B87514" }}
          >
            Número de pedido
          </span>
          <span
            className="text-2xl font-bold"
            style={{ fontFamily: "var(--font-playfair)", color: "#D4AF37" }}
          >
            {displayOrder}
          </span>
        </div>
      )}

      {/* Order details card */}
      {orderData && (
        <div className="glass-panel rounded-2xl p-6 w-full text-left flex flex-col gap-4">
          <div>
            <h2
              className="text-base font-semibold"
              style={{ fontFamily: "var(--font-playfair)", color: "#2C1E11" }}
            >
              Detalles del pedido
            </h2>
            <div className="gold-divider mt-2" style={{ maxWidth: 80 }} />
          </div>

          <div className="grid grid-cols-[auto_1fr] gap-x-8 gap-y-2.5 text-sm">
            <span style={{ color: "#6F5635" }}>Cliente</span>
            <span style={{ color: "#2C1E11", fontWeight: 500 }}>
              {orderData.customerName}
            </span>

            <span style={{ color: "#6F5635" }}>Email</span>
            <span style={{ color: "#2C1E11" }}>{orderData.customerEmail}</span>

            <span style={{ color: "#6F5635" }}>Productos</span>
            <span style={{ color: "#2C1E11" }}>
              {orderData.itemCount}{" "}
              {orderData.itemCount === 1 ? "artículo" : "artículos"}
            </span>

            <span style={{ color: "#6F5635" }}>Total pagado</span>
            <span
              style={{
                fontFamily: "var(--font-playfair)",
                color: "#D4AF37",
                fontWeight: 700,
                fontSize: "1.05rem",
              }}
            >
              ${orderData.total.toFixed(2)}
            </span>
          </div>
        </div>
      )}

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
        <a href="/tienda" className="premium-button text-sm">
          Seguir comprando
        </a>
        <a href="/" className="secondary-button text-sm">
          Ir al inicio
        </a>
      </div>

      <p
        className="text-[9px] uppercase tracking-[0.28em]"
        style={{ color: "rgba(184,117,20,0.38)" }}
      >
        Pureza · Origen · Excelencia
      </p>
    </div>
  );
}
