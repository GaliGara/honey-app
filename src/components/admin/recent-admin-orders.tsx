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

function isCritical(o: AdminOrderSummary) {
  return (
    o.paymentStatus === "pending_transfer" ||
    o.paymentStatus === "pending_deposit" ||
    o.status === "pending"
  );
}

export default function RecentAdminOrders({
  orders,
  emptyMessage = "Aún no hay pedidos.",
}: {
  orders: AdminOrderSummary[];
  title?: string;
  emptyMessage?: string;
}) {
  if (orders.length === 0) {
    return (
      <div
        className="admin-card"
        style={{
          padding: "1.5rem 1.25rem",
          textAlign: "center",
          color: "#6F5635",
          fontSize: "0.85rem",
        }}
      >
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="admin-card" style={{ overflow: "hidden" }}>
      {orders.map((order, idx) => {
        const critical = isCritical(order);
        return (
          <Link
            key={order.id}
            href={`/admin/orders/${order.id}`}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              padding: "0.625rem 1rem",
              borderBottom: idx < orders.length - 1 ? "1px solid rgba(184,117,20,0.07)" : "none",
              background: critical ? "rgba(245,158,11,0.025)" : "transparent",
              borderLeft: critical ? "2.5px solid rgba(245,158,11,0.42)" : "2.5px solid transparent",
              textDecoration: "none",
              transition: "background 120ms ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background = "rgba(212,175,55,0.06)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background = critical
                ? "rgba(245,158,11,0.025)"
                : "transparent";
            }}
          >
            {/* Urgency dot */}
            <span
              aria-hidden
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: critical ? "#f59e0b" : "rgba(184,117,20,0.18)",
                flexShrink: 0,
                boxShadow: critical ? "0 0 0 3px rgba(245,158,11,0.14)" : "none",
              }}
            />

            {/* Order + client */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: "0.4rem", flexWrap: "wrap" }}>
                <span style={{ fontWeight: 700, fontSize: "0.82rem", color: "#B87514", whiteSpace: "nowrap" }}>
                  {order.orderNumber}
                </span>
                <span style={{ fontSize: "0.8rem", color: "#2C1E11", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 160 }}>
                  {order.customerName}
                </span>
              </div>
              <div style={{ display: "flex", gap: "0.3rem", flexWrap: "wrap", marginTop: "0.2rem" }}>
                <OrderStatusBadge status={order.status} />
                <OrderPaymentBadge status={order.paymentStatus} />
              </div>
            </div>

            {/* Amount + date */}
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <p style={{ fontWeight: 700, fontSize: "0.85rem", color: "#2C1E11" }}>
                {MXN.format(order.total)}
              </p>
              <p style={{ fontSize: "0.7rem", color: "#6F5635", marginTop: "1px" }}>
                {new Date(order.createdAt).toLocaleDateString("es-MX", { day: "2-digit", month: "short" })}
              </p>
            </div>
          </Link>
        );
      })}

      {/* Footer */}
      <div
        style={{
          padding: "0.55rem 1rem",
          borderTop: "1px solid rgba(184,117,20,0.08)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "rgba(212,175,55,0.02)",
        }}
      >
        <span style={{ fontSize: "0.72rem", color: "#6F5635" }}>
          {orders.length} pedido{orders.length !== 1 ? "s" : ""}
        </span>
        <Link
          href="/admin/orders"
          style={{ fontSize: "0.78rem", fontWeight: 700, color: "#B87514", textDecoration: "none" }}
        >
          Ver todos →
        </Link>
      </div>
    </div>
  );
}
