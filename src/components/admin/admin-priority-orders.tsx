"use client";

import type { AdminOrderSummary } from "@/types/admin";
import Link from "next/link";
import OrderStatusBadge from "./order-status-badge";
import OrderPaymentBadge from "./order-payment-badge";

const MXN = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
  maximumFractionDigits: 0,
});

function urgencyLevel(order: AdminOrderSummary): "high" | "medium" {
  if (
    order.paymentStatus === "pending_transfer" ||
    order.paymentStatus === "pending_deposit"
  )
    return "high";
  return "medium";
}

function TimeAgo({ dateStr }: { dateStr: string }) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (days > 0) return <>{days}d</>;
  if (hours > 0) return <>{hours}h</>;
  return <>{mins}m</>;
}

interface Props {
  orders: AdminOrderSummary[];
}

export default function AdminPriorityOrders({ orders }: Props) {
  if (orders.length === 0) {
    return (
      <div
        className="admin-card"
        style={{
          padding: "1.5rem 1.25rem",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.5rem",
        }}
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#10b981"
          strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
        <p style={{ fontSize: "0.875rem", fontWeight: 600, color: "#064e3b" }}>Todo al día</p>
        <p style={{ fontSize: "0.78rem", color: "#6F5635" }}>Sin pedidos que requieran atención.</p>
      </div>
    );
  }

  return (
    <div
      className="admin-card"
      style={{ overflow: "hidden" }}
    >
      {/* Table header */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr auto auto 80px 40px",
          gap: "0.5rem",
          padding: "0.55rem 1rem",
          background: "rgba(212,175,55,0.04)",
          borderBottom: "1px solid rgba(184,117,20,0.08)",
        }}
      >
        {["Pedido", "Cliente", "Estado", "Pago", "Total", ""].map((h) => (
          <span
            key={h}
            style={{
              fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.08em",
              textTransform: "uppercase", color: "#B87514",
            }}
          >
            {h}
          </span>
        ))}
      </div>

      {/* Rows */}
      {orders.map((order, idx) => {
        const level = urgencyLevel(order);
        return (
          <div
            key={order.id}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr auto auto 80px 40px",
              gap: "0.5rem",
              padding: "0.6rem 1rem",
              borderBottom:
                idx < orders.length - 1 ? "1px solid rgba(184,117,20,0.06)" : "none",
              alignItems: "center",
              background:
                level === "high"
                  ? "rgba(245,158,11,0.025)"
                  : "transparent",
              borderLeft:
                level === "high"
                  ? "3px solid rgba(245,158,11,0.4)"
                  : "3px solid transparent",
              transition: "background 120ms ease",
            }}
          >
            {/* Order */}
            <div>
              <p style={{ fontWeight: 700, fontSize: "0.82rem", color: "#B87514", whiteSpace: "nowrap" }}>
                {order.orderNumber}
              </p>
              <p style={{ fontSize: "0.68rem", color: "#9ca3af" }}>
                <TimeAgo dateStr={order.createdAt} />
              </p>
            </div>

            {/* Client */}
            <p style={{ fontSize: "0.8rem", color: "#2C1E11", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {order.customerName}
            </p>

            {/* Status */}
            <div style={{ whiteSpace: "nowrap" }}>
              <OrderStatusBadge status={order.status} />
            </div>

            {/* Payment */}
            <div style={{ whiteSpace: "nowrap" }}>
              <OrderPaymentBadge status={order.paymentStatus} />
            </div>

            {/* Total */}
            <p style={{ fontWeight: 700, fontSize: "0.82rem", color: "#2C1E11", textAlign: "right", whiteSpace: "nowrap" }}>
              {MXN.format(order.total)}
            </p>

            {/* Action */}
            <Link
              href={`/admin/orders/${order.id}`}
              style={{
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                width: 28, height: 28, borderRadius: "0.4rem",
                border: "1px solid rgba(184,117,20,0.22)",
                background: "rgba(255,255,255,0.65)",
                color: "#B87514", textDecoration: "none",
                transition: "all 150ms ease",
              }}
              aria-label={`Ver pedido ${order.orderNumber}`}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.background = "rgba(212,175,55,0.14)";
                (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(212,175,55,0.45)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.65)";
                (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(184,117,20,0.22)";
              }}
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </Link>
          </div>
        );
      })}

      {/* Footer */}
      <div
        style={{
          padding: "0.55rem 1rem",
          borderTop: "1px solid rgba(184,117,20,0.07)",
          display: "flex",
          justifyContent: "flex-end",
          background: "rgba(212,175,55,0.02)",
        }}
      >
        <Link
          href="/admin/orders"
          style={{
            fontSize: "0.75rem", fontWeight: 700,
            color: "#B87514", textDecoration: "none",
          }}
        >
          Ver todos los pedidos →
        </Link>
      </div>
    </div>
  );
}
