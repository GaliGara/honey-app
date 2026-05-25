"use client";

import { useRouter } from "next/navigation";
import type { AdminOrderSummary } from "@/types/admin";
import OrderStatusBadge from "./order-status-badge";
import OrderPaymentBadge from "./order-payment-badge";

const MXN = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
  maximumFractionDigits: 0,
});

const TH: React.CSSProperties = {
  padding: "0.55rem 0.875rem",
  textAlign: "left",
  fontWeight: 700,
  fontSize: "0.62rem",
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: "#B87514",
  whiteSpace: "nowrap",
  borderBottom: "1px solid rgba(184,117,20,0.1)",
};

const TD: React.CSSProperties = {
  padding: "0.6rem 0.875rem",
  verticalAlign: "middle",
};

function EyeIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

interface Props {
  orders: AdminOrderSummary[];
  total: number;
  currentPage: number;
}

export default function OrdersTable({ orders, total, currentPage }: Props) {
  const router = useRouter();

  if (orders.length === 0) {
    return (
      <div
        className="admin-card"
        style={{ padding: "3rem 1.5rem", textAlign: "center" }}
      >
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="rgba(184,117,20,0.35)"
          strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden
          style={{ margin: "0 auto 0.75rem", display: "block" }}>
          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
          <line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" />
        </svg>
        <p style={{ fontSize: "0.9rem", fontWeight: 600, color: "#2C1E11", marginBottom: "0.25rem" }}>
          Sin pedidos
        </p>
        <p style={{ fontSize: "0.8rem", color: "#6F5635" }}>
          Los pedidos aparecerán aquí cuando lleguen.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* ── Desktop table ─────────────────────────── */}
      <div className="admin-table-wrap admin-card" style={{ overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.82rem" }}>
            <thead>
              <tr style={{ background: "rgba(212,175,55,0.035)" }}>
                <th style={TH}>Pedido</th>
                <th style={TH}>Cliente</th>
                <th style={TH}>Prods.</th>
                <th style={TH}>Estado</th>
                <th style={TH}>Pago</th>
                <th style={{ ...TH, textAlign: "right" }}>Total</th>
                <th style={TH}>Fecha</th>
                <th style={{ ...TH, textAlign: "center" }}>Ver</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, idx) => {
                const critical =
                  order.paymentStatus === "pending_transfer" ||
                  order.paymentStatus === "pending_deposit";

                return (
                  <tr
                    key={order.id}
                    style={{
                      borderBottom: "1px solid rgba(184,117,20,0.06)",
                      background: critical
                        ? "rgba(245,158,11,0.025)"
                        : idx % 2 === 0 ? "transparent" : "rgba(212,175,55,0.015)",
                      borderLeft: critical ? "2.5px solid rgba(245,158,11,0.4)" : "2.5px solid transparent",
                      transition: "background 120ms ease",
                      cursor: "pointer",
                    }}
                    onClick={() => router.push(`/admin/orders/${order.id}`)}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLTableRowElement).style.background = "rgba(212,175,55,0.07)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLTableRowElement).style.background = critical
                        ? "rgba(245,158,11,0.025)"
                        : idx % 2 === 0 ? "transparent" : "rgba(212,175,55,0.015)";
                    }}
                  >
                    <td style={TD}>
                      <p style={{ fontWeight: 700, color: "#B87514", whiteSpace: "nowrap", fontSize: "0.84rem" }}>
                        {order.orderNumber}
                      </p>
                      <p style={{ fontSize: "0.68rem", color: "#9ca3af" }}>
                        {new Date(order.createdAt).toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </td>
                    <td style={TD}>
                      <p style={{ fontWeight: 600, color: "#2C1E11", whiteSpace: "nowrap" }}>{order.customerName}</p>
                      <p style={{ fontSize: "0.7rem", color: "#6F5635", maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {order.customerEmail}
                      </p>
                    </td>
                    <td style={{ ...TD, color: "#6F5635", fontSize: "0.78rem", whiteSpace: "nowrap" }}>
                      {order.itemCount} {order.itemCount === 1 ? "prod." : "prods."}
                    </td>
                    <td style={{ ...TD, whiteSpace: "nowrap" }}>
                      <OrderStatusBadge status={order.status} />
                    </td>
                    <td style={{ ...TD, whiteSpace: "nowrap" }}>
                      <OrderPaymentBadge status={order.paymentStatus} />
                    </td>
                    <td style={{ ...TD, fontWeight: 700, color: "#2C1E11", textAlign: "right", whiteSpace: "nowrap" }}>
                      {MXN.format(order.total)}
                    </td>
                    <td style={{ ...TD, color: "#6F5635", fontSize: "0.78rem", whiteSpace: "nowrap" }}>
                      {new Date(order.createdAt).toLocaleDateString("es-MX", { day: "2-digit", month: "short", year: "numeric" })}
                    </td>
                    <td style={{ ...TD, textAlign: "center" }}>
                      <button
                        onClick={(e) => { e.stopPropagation(); router.push(`/admin/orders/${order.id}`); }}
                        aria-label={`Ver detalle ${order.orderNumber}`}
                        style={{
                          display: "inline-flex", alignItems: "center", gap: "3px",
                          padding: "0.3rem 0.625rem", borderRadius: "0.4rem",
                          border: "1px solid rgba(184,117,20,0.24)",
                          background: "rgba(255,255,255,0.65)",
                          color: "#B87514", fontSize: "0.75rem", fontWeight: 600,
                          cursor: "pointer", transition: "all 150ms ease",
                        }}
                        onMouseEnter={(e) => {
                          const b = e.currentTarget as HTMLButtonElement;
                          b.style.background = "rgba(212,175,55,0.14)";
                          b.style.borderColor = "rgba(212,175,55,0.45)";
                        }}
                        onMouseLeave={(e) => {
                          const b = e.currentTarget as HTMLButtonElement;
                          b.style.background = "rgba(255,255,255,0.65)";
                          b.style.borderColor = "rgba(184,117,20,0.24)";
                        }}
                      >
                        <EyeIcon /> Ver
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Mobile cards ─────────────────────────── */}
      <div className="admin-cards-wrap">
        {orders.map((order) => {
          const critical =
            order.paymentStatus === "pending_transfer" ||
            order.paymentStatus === "pending_deposit";

          return (
            <div
              key={order.id}
              onClick={() => router.push(`/admin/orders/${order.id}`)}
              style={{
                background: "rgba(255,255,255,0.62)",
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
                border: critical ? "1px solid rgba(245,158,11,0.35)" : "1px solid rgba(255,255,255,0.65)",
                borderLeft: critical ? "3px solid rgba(245,158,11,0.5)" : "3px solid transparent",
                borderRadius: "0.75rem",
                padding: "0.875rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.6rem",
                cursor: "pointer",
                boxShadow: "0 1px 8px rgba(184,117,20,0.06)",
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "0.5rem" }}>
                <div>
                  <p style={{ fontWeight: 700, fontSize: "0.9rem", color: "#B87514" }}>{order.orderNumber}</p>
                  <p style={{ fontSize: "0.82rem", color: "#2C1E11" }}>{order.customerName}</p>
                  <p style={{ fontSize: "0.7rem", color: "#6F5635" }}>{order.customerEmail}</p>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <p style={{ fontWeight: 700, fontSize: "0.95rem", color: "#2C1E11" }}>{MXN.format(order.total)}</p>
                  <p style={{ fontSize: "0.7rem", color: "#6F5635" }}>
                    {new Date(order.createdAt).toLocaleDateString("es-MX", { day: "2-digit", month: "short" })}
                  </p>
                  <p style={{ fontSize: "0.68rem", color: "#9ca3af" }}>
                    {order.itemCount} {order.itemCount === 1 ? "prod." : "prods."}
                  </p>
                </div>
              </div>
              <div style={{ display: "flex", gap: "0.3rem", flexWrap: "wrap" }}>
                <OrderStatusBadge status={order.status} />
                <OrderPaymentBadge status={order.paymentStatus} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination info */}
      {total > 20 && (
        <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "0.5rem" }}>
          <p style={{ fontSize: "0.75rem", color: "#6F5635" }}>
            Página {currentPage} · {total} pedidos en total
          </p>
        </div>
      )}
    </>
  );
}
