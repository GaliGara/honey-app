"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { AdminOrder, OrderStatus, PaymentStatus } from "@/types/admin";
import OrderStatusBadge from "./order-status-badge";
import OrderPaymentBadge from "./order-payment-badge";

const MXN = new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 });

const LBL: React.CSSProperties = { fontSize: "0.66rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#B87514", marginBottom: "0.2rem" };
const VAL: React.CSSProperties = { fontSize: "0.85rem", color: "#2C1E11" };

const PM_LABEL: Record<string, string> = {
  bank_transfer: "Transferencia SPEI",
  bank_deposit: "Depósito bancario",
  cash_on_delivery: "Contra entrega",
};

function F({ label, value }: { label: string; value?: React.ReactNode }) {
  if (!value) return null;
  return <div><p style={LBL}>{label}</p><p style={VAL}>{value}</p></div>;
}

function Section({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div className="glass-panel" style={{ borderRadius: "0.625rem", padding: "0.75rem 1rem", ...style }}>
      {children}
    </div>
  );
}

/* ── Actions ───────────────────────────────────────────────── */

interface Action {
  label: string;
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  color: string;
  bg: string;
  border: string;
  hoverBg: string;
}

function buildActions(order: AdminOrder): Action[] {
  const actions: Action[] = [];

  if (order.paymentStatus === "pending_transfer" || order.paymentStatus === "pending_deposit" || order.paymentStatus === "pending_cash_payment") {
    actions.push({ label: "✓ Confirmar pago", paymentStatus: "paid", color: "#064e3b", bg: "rgba(16,185,129,0.1)", border: "rgba(16,185,129,0.28)", hoverBg: "rgba(16,185,129,0.18)" });
  }
  if (order.status === "pending") {
    actions.push({ label: "Confirmar pedido", status: "processing", color: "#1e3a8a", bg: "rgba(59,130,246,0.09)", border: "rgba(59,130,246,0.26)", hoverBg: "rgba(59,130,246,0.17)" });
  }
  if (order.status === "processing") {
    actions.push({ label: "🚚 Marcar enviado", status: "shipped", color: "#1e3a8a", bg: "rgba(59,130,246,0.09)", border: "rgba(59,130,246,0.26)", hoverBg: "rgba(59,130,246,0.17)" });
  }
  if (order.status === "shipped") {
    actions.push({ label: "✓ Entregado", status: "delivered", color: "#064e3b", bg: "rgba(16,185,129,0.09)", border: "rgba(16,185,129,0.26)", hoverBg: "rgba(16,185,129,0.17)" });
  }
  if (order.status !== "cancelled" && order.status !== "delivered") {
    actions.push({ label: "Cancelar", status: "cancelled", color: "#7f1d1d", bg: "rgba(239,68,68,0.07)", border: "rgba(239,68,68,0.2)", hoverBg: "rgba(239,68,68,0.14)" });
  }
  return actions;
}

function ActionsSection({ order, onUpdated }: { order: AdminOrder; onUpdated: (o: AdminOrder) => void }) {
  const actions = buildActions(order);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  if (actions.length === 0) return null;

  function run(action: Action) {
    setError(null);
    startTransition(async () => {
      try {
        const patch: Record<string, string> = {};
        if (action.status) patch.status = action.status;
        if (action.paymentStatus) patch.paymentStatus = action.paymentStatus;
        const res = await fetch(`/api/admin/orders/${order.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(patch),
        });
        const data = await res.json();
        if (!res.ok || !data.ok) { setError(data.message ?? "Error"); return; }
        onUpdated({
          ...order,
          ...(action.status ? { status: action.status } : {}),
          ...(action.paymentStatus ? { paymentStatus: action.paymentStatus } : {}),
          ...(action.paymentStatus === "paid" ? { paidAt: new Date().toISOString() } : {}),
          ...(action.status === "cancelled" ? { cancelledAt: new Date().toISOString() } : {}),
        });
        router.refresh();
      } catch { setError("Error de conexión"); }
    });
  }

  return (
    <div style={{ borderRadius: "0.625rem", padding: "0.75rem 1rem", background: "rgba(212,175,55,0.05)", border: "1px solid rgba(212,175,55,0.16)" }}>
      <p style={{ ...LBL, marginBottom: "0.6rem" }}>Acciones</p>
      <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
        {actions.map((a) => (
          <button
            key={a.label}
            onClick={() => run(a)}
            disabled={isPending}
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "0.4rem 0.75rem",
              borderRadius: "0.5rem",
              border: `1px solid ${a.border}`,
              background: a.bg,
              color: a.color,
              fontSize: "0.78rem",
              fontWeight: 600,
              cursor: isPending ? "wait" : "pointer",
              transition: "all 150ms ease",
              opacity: isPending ? 0.6 : 1,
            }}
            onMouseEnter={(e) => { if (!isPending) (e.currentTarget as HTMLButtonElement).style.background = a.hoverBg; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = a.bg; }}
          >
            {a.label}
          </button>
        ))}
      </div>
      {error && <p role="alert" style={{ fontSize: "0.775rem", color: "#c0392b", marginTop: "0.4rem" }}>{error}</p>}
    </div>
  );
}

/* ── Main panel ────────────────────────────────────────────── */

interface Props {
  order: AdminOrder;
  onClose: () => void;
  onUpdated: (order: AdminOrder) => void;
}

export default function OrderDetailPanel({ order, onClose, onUpdated }: Props) {
  return (
    <div
      style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "flex-start", justifyContent: "flex-end", background: "rgba(44,30,17,0.28)", backdropFilter: "blur(3px)" }}
      onClick={onClose}
    >
      <div
        style={{ width: "100%", maxWidth: 460, height: "100dvh", overflowY: "auto", background: "#F4EFE3", boxShadow: "-10px 0 50px rgba(44,30,17,0.18)", display: "flex", flexDirection: "column" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Sticky header ──────────────────────────── */}
        <div
          style={{ padding: "0.875rem 1.25rem", borderBottom: "1px solid rgba(184,117,20,0.12)", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, background: "rgba(244,239,227,0.96)", backdropFilter: "blur(8px)", zIndex: 2 }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
              <p style={{ fontFamily: "var(--font-playfair)", fontSize: "1rem", fontWeight: 700, color: "#2C1E11" }}>
                {order.orderNumber}
              </p>
              <OrderStatusBadge status={order.status} />
              <OrderPaymentBadge status={order.paymentStatus} />
            </div>
            <p style={{ fontSize: "0.72rem", color: "#6F5635", marginTop: "2px" }}>
              {new Date(order.createdAt).toLocaleDateString("es-MX", { dateStyle: "long" })}
              {order.paidAt && (
                <span style={{ color: "#10b981", marginLeft: "0.5rem" }}>
                  · Pagado {new Date(order.paidAt).toLocaleDateString("es-MX", { day: "2-digit", month: "short" })}
                </span>
              )}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Cerrar"
            style={{ width: 30, height: 30, borderRadius: "50%", border: "1px solid rgba(184,117,20,0.25)", background: "rgba(255,255,255,0.6)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#6F5635", fontSize: "0.9rem", flexShrink: 0 }}
          >✕</button>
        </div>

        {/* ── Body ────────────────────────────────────── */}
        <div style={{ flex: 1, padding: "1rem 1.25rem", display: "flex", flexDirection: "column", gap: "0.875rem" }}>

          {/* Acciones */}
          <ActionsSection order={order} onUpdated={onUpdated} />

          {/* Cliente */}
          <Section>
            <p style={{ ...LBL, marginBottom: "0.6rem" }}>Cliente</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
              <div style={{ gridColumn: "1/-1" }}><F label="Nombre" value={order.customerName} /></div>
              <F label="Correo" value={order.customerEmail} />
              <F label="Teléfono" value={order.customerPhone || undefined} />
            </div>
          </Section>

          {/* Envío */}
          <Section>
            <p style={{ ...LBL, marginBottom: "0.6rem" }}>Envío</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              <F label="Dirección" value={order.address || undefined} />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.5rem" }}>
                <F label="Ciudad" value={order.city || undefined} />
                <F label="Estado" value={order.state ?? undefined} />
                <F label="C.P." value={order.postalCode ?? undefined} />
              </div>
              {order.notes && <F label="Notas" value={order.notes} />}
            </div>
          </Section>

          {/* Pago */}
          <Section>
            <p style={{ ...LBL, marginBottom: "0.5rem" }}>Pago</p>
            <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", alignItems: "center" }}>
              {order.paymentMethod && <span style={{ fontSize: "0.8rem", color: "#6F5635" }}>{PM_LABEL[order.paymentMethod] ?? order.paymentMethod}</span>}
            </div>
            {order.manualPaymentReference && (
              <p style={{ fontSize: "0.8rem", color: "#6F5635", marginTop: "0.3rem" }}>
                Ref: <strong style={{ color: "#2C1E11" }}>{order.manualPaymentReference}</strong>
              </p>
            )}
          </Section>

          {/* Instrucciones */}
          {order.paymentInstructions && (
            <div style={{ borderRadius: "0.625rem", padding: "0.75rem 1rem", background: "rgba(212,175,55,0.06)", border: "1px solid rgba(212,175,55,0.18)" }}>
              <p style={{ ...LBL, marginBottom: "0.4rem" }}>Instrucciones de pago</p>
              <p style={{ fontSize: "0.78rem", color: "#2C1E11", whiteSpace: "pre-line", lineHeight: 1.6 }}>
                {order.paymentInstructions}
              </p>
            </div>
          )}

          {/* Productos */}
          {order.items.length > 0 && (
            <Section>
              <p style={{ ...LBL, marginBottom: "0.5rem" }}>Productos</p>
              {order.items.map((item, i) => (
                <div key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.5rem", padding: "0.4rem 0", borderBottom: i < order.items.length - 1 ? "1px solid rgba(184,117,20,0.08)" : "none" }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: "0.82rem", fontWeight: 600, color: "#2C1E11", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.productName}</p>
                    {item.productSize && <p style={{ fontSize: "0.72rem", color: "#6F5635" }}>{item.productSize}</p>}
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <p style={{ fontSize: "0.72rem", color: "#6F5635" }}>×{item.quantity}</p>
                    <p style={{ fontSize: "0.82rem", fontWeight: 700, color: "#B87514" }}>{MXN.format(item.total)}</p>
                  </div>
                </div>
              ))}
            </Section>
          )}

          {/* Totales */}
          <Section>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
              {[["Subtotal", order.subtotal], ["Envío", order.shipping], ["Impuestos", order.taxes]].map(([l, v]) => (
                <div key={String(l)} style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: "0.82rem", color: "#6F5635" }}>{l}</span>
                  <span style={{ fontSize: "0.82rem", color: "#2C1E11" }}>{MXN.format(Number(v))}</span>
                </div>
              ))}
              <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "0.4rem", borderTop: "1px solid rgba(184,117,20,0.15)", marginTop: "0.1rem" }}>
                <span style={{ fontWeight: 700, color: "#2C1E11", fontSize: "0.85rem" }}>Total</span>
                <span style={{ fontWeight: 700, color: "#B87514", fontSize: "0.95rem" }}>{MXN.format(order.total)}</span>
              </div>
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
}
