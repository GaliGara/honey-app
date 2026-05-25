import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import AdminHeader from "@/components/admin/admin-header";
import AdminOrderTimeline from "@/components/admin/admin-order-timeline";
import AdminOrderActions from "@/components/admin/admin-order-actions";
import AdminCopyButton from "@/components/admin/admin-copy-button";
import OrderStatusBadge from "@/components/admin/order-status-badge";
import OrderPaymentBadge from "@/components/admin/order-payment-badge";
import { requireAdminAuth } from "@/lib/admin/auth";
import { getOrder } from "@/lib/admin/orders";
import type { AdminOrder } from "@/types/admin";

export const revalidate = 0;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const order = await getOrder(id).catch(() => null);
  return {
    title: order
      ? `${order.orderNumber} — Honey Admin`
      : "Pedido — Honey Admin",
    robots: { index: false, follow: false },
  };
}

/* ── Formatters ──────────────────────────────────────────────── */
const MXN = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
  maximumFractionDigits: 0,
});

const PM_LABEL: Record<string, string> = {
  bank_transfer: "Transferencia SPEI",
  bank_deposit: "Depósito bancario",
  cash_on_delivery: "Pago contra entrega",
};

/* ── Next step logic ─────────────────────────────────────────── */
interface NextStep {
  text: string;
  color: string;
  bg: string;
  border: string;
  done?: boolean;
}

function getNextStep(order: AdminOrder): NextStep | null {
  if (order.status === "cancelled") return null;

  if (order.status === "delivered") {
    return {
      text: "Pedido completado",
      color: "#064e3b",
      bg: "rgba(16,185,129,0.07)",
      border: "rgba(16,185,129,0.2)",
      done: true,
    };
  }

  if (order.paymentStatus === "pending_transfer") {
    return {
      text: "Verificar transferencia bancaria del cliente",
      color: "#92400e",
      bg: "rgba(245,158,11,0.07)",
      border: "rgba(245,158,11,0.22)",
    };
  }
  if (order.paymentStatus === "pending_deposit") {
    return {
      text: "Verificar depósito bancario del cliente",
      color: "#92400e",
      bg: "rgba(245,158,11,0.07)",
      border: "rgba(245,158,11,0.22)",
    };
  }
  if (order.paymentStatus === "pending_cash_payment") {
    return {
      text: "Cobrar al cliente en la entrega",
      color: "#92400e",
      bg: "rgba(245,158,11,0.07)",
      border: "rgba(245,158,11,0.22)",
    };
  }

  if (order.status === "pending") {
    return {
      text: "Confirmar el pedido para procesarlo",
      color: "#1e3a8a",
      bg: "rgba(59,130,246,0.07)",
      border: "rgba(59,130,246,0.22)",
    };
  }

  if (order.status === "confirmed" || order.status === "processing") {
    return {
      text: "Preparar el pedido y marcarlo como enviado",
      color: "#4c1d95",
      bg: "rgba(139,92,246,0.07)",
      border: "rgba(139,92,246,0.22)",
    };
  }

  if (order.status === "shipped") {
    return {
      text: "Confirmar la entrega al cliente",
      color: "#064e3b",
      bg: "rgba(16,185,129,0.07)",
      border: "rgba(16,185,129,0.2)",
    };
  }

  return null;
}

/* ── Payment instructions parser ────────────────────────────── */
interface InstructionRow {
  label: string;
  value: string;
  isCLABE: boolean;
}

function parseInstructions(text: string): InstructionRow[] {
  return text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((line) => {
      const colonIdx = line.indexOf(":");
      if (colonIdx > 0) {
        const label = line.slice(0, colonIdx).trim();
        const value = line.slice(colonIdx + 1).trim();
        const isCLABE =
          label.toLowerCase().includes("clabe") ||
          /^\d{18}$/.test(value.replace(/\s/g, ""));
        return { label, value, isCLABE };
      }
      return { label: "", value: line, isCLABE: false };
    });
}

/* ── UI primitives ───────────────────────────────────────────── */
function Field({
  label,
  value,
  mono,
}: {
  label: string;
  value?: React.ReactNode;
  mono?: boolean;
}) {
  if (!value && value !== 0) return null;
  return (
    <div>
      <p
        style={{
          fontSize: "0.6rem",
          fontWeight: 700,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "#B87514",
          marginBottom: "0.18rem",
        }}
      >
        {label}
      </p>
      <p
        style={{
          fontSize: "0.83rem",
          color: "#2C1E11",
          fontFamily: mono ? "monospace" : undefined,
          lineHeight: 1.4,
          overflowWrap: "anywhere",
        }}
      >
        {value}
      </p>
    </div>
  );
}

function Card({
  children,
  style,
  className,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}) {
  return (
    <div
      className={`admin-card${className ? ` ${className}` : ""}`}
      style={{ padding: "1rem 1.125rem", ...style }}
    >
      {children}
    </div>
  );
}

function CardTitle({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        fontSize: "0.6rem",
        fontWeight: 700,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        color: "#B87514",
        marginBottom: "0.75rem",
      }}
    >
      {children}
    </p>
  );
}

function Divider() {
  return (
    <div
      style={{
        height: 1,
        background: "rgba(184,117,20,0.1)",
        margin: "0.75rem 0",
      }}
    />
  );
}

function BackIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M19 12H5M12 5l-7 7 7 7" />
    </svg>
  );
}

/* ── Page ────────────────────────────────────────────────────── */
export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdminAuth();
  const { id } = await params;
  const order = await getOrder(id);

  if (!order) notFound();

  const itemCount = order.items.reduce((s, i) => s + i.quantity, 0);
  const createdDate = new Date(order.createdAt).toLocaleDateString("es-MX", {
    dateStyle: "long",
  });
  const createdTime = new Date(order.createdAt).toLocaleTimeString("es-MX", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const nextStep = getNextStep(order);
  const instructionRows = order.paymentInstructions
    ? parseInstructions(order.paymentInstructions)
    : [];

  return (
    <>
      <AdminHeader
        title={order.orderNumber}
        subtitle={`${createdDate} · ${createdTime}`}
      />

      <main className="admin-page-main admin-page-main--compact">
        {/* Back link */}
        <Link
          href="/admin/orders"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.375rem",
            fontSize: "0.78rem",
            fontWeight: 600,
            color: "#6F5635",
            textDecoration: "none",
            width: "fit-content",
          }}
        >
          <BackIcon />
          Volver a pedidos
        </Link>

        {/* ── Hero card (3 columns) ─────────────────── */}
        <Card
          style={{
            background: "rgba(255,255,255,0.62)",
            borderLeft: "3px solid rgba(212,175,55,0.45)",
            padding: "1rem 1.25rem",
          }}
          className="admin-fade-up"
        >
          <div className="admin-detail-hero">
            {/* ① ID + badges */}
            <div className="admin-detail-hero__id">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.625rem",
                  marginBottom: "0.5rem",
                }}
              >
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: "0.6rem",
                    background:
                      "linear-gradient(135deg, rgba(212,175,55,0.18) 0%, rgba(184,117,20,0.1) 100%)",
                    border: "1.5px solid rgba(212,175,55,0.32)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <svg
                    width="17"
                    height="17"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#B87514"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden
                  >
                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <path d="M16 10a4 4 0 0 1-8 0" />
                  </svg>
                </div>
                <div>
                  <p
                    style={{
                      fontFamily: "var(--font-playfair)",
                      fontSize: "1.15rem",
                      fontWeight: 700,
                      color: "#2C1E11",
                      lineHeight: 1.1,
                    }}
                  >
                    {order.orderNumber}
                  </p>
                  <p style={{ fontSize: "0.7rem", color: "#6F5635" }}>
                    {createdDate} · {createdTime}
                  </p>
                </div>
              </div>
              <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap" }}>
                <OrderStatusBadge status={order.status} />
                <OrderPaymentBadge status={order.paymentStatus} />
              </div>
            </div>

            {/* ② Totals summary */}
            <div className="admin-detail-hero__totals">
              <p
                style={{
                  fontSize: "0.6rem",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "#6F5635",
                  marginBottom: "0.25rem",
                }}
              >
                Total del pedido
              </p>
              <p
                style={{
                  fontFamily: "var(--font-playfair)",
                  fontSize: "1.6rem",
                  fontWeight: 700,
                  color: "#2C1E11",
                  lineHeight: 1,
                  marginBottom: "0.5rem",
                }}
              >
                {MXN.format(order.total)}
              </p>
              <div
                style={{
                  display: "flex",
                  gap: "1rem",
                  flexWrap: "wrap",
                  marginBottom: "0.25rem",
                }}
              >
                <span style={{ fontSize: "0.78rem", color: "#6F5635" }}>
                  <strong style={{ color: "#2C1E11" }}>{itemCount}</strong>{" "}
                  {itemCount === 1 ? "unidad" : "unidades"}
                </span>
                {order.paymentMethod && (
                  <span style={{ fontSize: "0.78rem", color: "#6F5635" }}>
                    {PM_LABEL[order.paymentMethod] ?? order.paymentMethod}
                  </span>
                )}
              </div>
              {order.paidAt && (
                <span
                  style={{
                    fontSize: "0.72rem",
                    color: "#10b981",
                    fontWeight: 600,
                  }}
                >
                  ✓ Pagado el{" "}
                  {new Date(order.paidAt).toLocaleDateString("es-MX", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              )}
            </div>

            {/* ③ Actions */}
            <div className="admin-detail-hero__actions">
              <p
                style={{
                  fontSize: "0.6rem",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "#B87514",
                  marginBottom: "0.625rem",
                }}
              >
                Acciones
              </p>
              <AdminOrderActions order={order} />
            </div>
          </div>
        </Card>

        {/* ── Two-column grid ───────────────────────── */}
        <div className="admin-detail-split">

          {/* Left column (7fr): products + timeline */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

            {/* Products */}
            {order.items.length > 0 && (
              <Card className="admin-fade-up-1 admin-detail-summary-card">
                <CardTitle>Resumen del pedido</CardTitle>

                {/* Product rows */}
                <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                  {order.items.map((item, i) => (
                    <div
                      key={item.id}
                      className="admin-detail-product-row"
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: "0.625rem",
                        padding: "0.5rem 0",
                        borderBottom:
                          i < order.items.length - 1
                            ? "1px solid rgba(184,117,20,0.07)"
                            : "none",
                      }}
                    >
                      <div
                        style={{
                          width: 30,
                          height: 30,
                          borderRadius: "0.4rem",
                          background: "rgba(212,175,55,0.08)",
                          border: "1px solid rgba(212,175,55,0.18)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#B87514"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden
                        >
                          <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                          <line x1="7" y1="7" x2="7.01" y2="7" />
                        </svg>
                      </div>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p
                          style={{
                            fontSize: "0.82rem",
                            fontWeight: 600,
                            color: "#2C1E11",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {item.productName}
                        </p>
                        <div style={{ display: "flex", gap: "0.4rem", marginTop: "1px" }}>
                          {item.productSize && (
                            <span style={{ fontSize: "0.68rem", color: "#6F5635" }}>
                              {item.productSize}
                            </span>
                          )}
                          <span style={{ fontSize: "0.68rem", color: "#9ca3af" }}>
                            {item.productCategory}
                          </span>
                        </div>
                      </div>

                      <div style={{ textAlign: "right", flexShrink: 0 }}>
                        <p style={{ fontSize: "0.7rem", color: "#6F5635" }}>
                          {MXN.format(item.unitPrice)} × {item.quantity}
                        </p>
                        <p
                          style={{
                            fontSize: "0.85rem",
                            fontWeight: 700,
                            color: "#B87514",
                          }}
                        >
                          {MXN.format(item.total)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div
                  style={{
                    marginTop: "0.75rem",
                    paddingTop: "0.75rem",
                    borderTop: "1px solid rgba(184,117,20,0.1)",
                  }}
                >
                  {(
                    [
                      ["Subtotal", order.subtotal],
                      ["Envío", order.shipping],
                      ["Impuestos", order.taxes],
                    ] as [string, number][]
                  ).map(([l, v]) => (
                    <div
                      key={l}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "0.25rem",
                      }}
                    >
                      <span style={{ fontSize: "0.8rem", color: "#6F5635" }}>
                        {l}
                      </span>
                      <span style={{ fontSize: "0.8rem", color: "#2C1E11" }}>
                        {MXN.format(v)}
                      </span>
                    </div>
                  ))}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      paddingTop: "0.35rem",
                      borderTop: "1px solid rgba(184,117,20,0.12)",
                      marginTop: "0.2rem",
                    }}
                  >
                    <span
                      style={{
                        fontWeight: 700,
                        color: "#2C1E11",
                        fontSize: "0.85rem",
                      }}
                    >
                      Total
                    </span>
                    <span
                      style={{
                        fontWeight: 700,
                        color: "#B87514",
                        fontSize: "0.95rem",
                      }}
                    >
                      {MXN.format(order.total)}
                    </span>
                  </div>
                </div>
              </Card>
            )}

            {/* Timeline */}
            <Card className="admin-fade-up-2 admin-detail-timeline-card">
              <CardTitle>Actividad del pedido</CardTitle>
              <AdminOrderTimeline order={order} />

              {/* Siguiente paso */}
              {nextStep && (
                <div
                  className="admin-next-step"
                  style={{
                    marginTop: "0.875rem",
                    padding: "0.625rem 0.75rem",
                    borderRadius: "0.5rem",
                    background: nextStep.bg,
                    border: `1px solid ${nextStep.border}`,
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <span style={{ fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: nextStep.color, flexShrink: 0 }}>
                    {nextStep.done ? "Estado" : "Siguiente"}
                  </span>
                  <span
                    style={{
                      width: 1,
                      height: 12,
                      background: nextStep.color,
                      opacity: 0.3,
                      flexShrink: 0,
                    }}
                  />
                  <span
                    style={{
                      fontSize: "0.78rem",
                      fontWeight: 600,
                      color: nextStep.color,
                    }}
                  >
                    {nextStep.text}
                  </span>
                </div>
              )}
            </Card>
          </div>

          {/* Right column (5fr): customer+shipping + payment */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

            {/* Cliente & Envío (combined) */}
            <Card className="admin-fade-up-1 admin-detail-customer-card">
              <CardTitle>Cliente</CardTitle>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.55rem" }}>
                <Field label="Nombre" value={order.customerName} />
                <Field label="Correo" value={order.customerEmail} />
                {order.customerPhone && (
                  <Field label="Teléfono" value={order.customerPhone} />
                )}
              </div>

              <Divider />

              <p
                style={{
                  fontSize: "0.6rem",
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "#B87514",
                  marginBottom: "0.55rem",
                }}
              >
                Dirección de envío
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.55rem" }}>
                <Field label="Calle / Dirección" value={order.address || undefined} />
                <div className="admin-detail-field-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
                  <Field label="Ciudad" value={order.city || undefined} />
                  <Field label="Estado" value={order.state ?? undefined} />
                </div>
                {order.postalCode && (
                  <Field label="Código postal" value={order.postalCode} />
                )}
                {order.notes && (
                  <div>
                    <p
                      style={{
                        fontSize: "0.6rem",
                        fontWeight: 700,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: "#B87514",
                        marginBottom: "0.18rem",
                      }}
                    >
                      Notas del cliente
                    </p>
                    <p
                      style={{
                        fontSize: "0.8rem",
                        color: "#6F5635",
                        fontStyle: "italic",
                        lineHeight: 1.5,
                      }}
                    >
                      {order.notes}
                    </p>
                  </div>
                )}
              </div>
            </Card>

            {/* Pago */}
            <Card className="admin-fade-up-2 admin-detail-payment-card">
              <CardTitle>Pago</CardTitle>

              {/* Method row */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "0.625rem",
                }}
              >
                <span style={{ fontSize: "0.82rem", color: "#2C1E11", fontWeight: 600 }}>
                  {order.paymentMethod
                    ? PM_LABEL[order.paymentMethod] ?? order.paymentMethod
                    : "Sin método especificado"}
                </span>
                <OrderPaymentBadge status={order.paymentStatus} />
              </div>

              {/* Reference rows */}
              {(order.manualPaymentReference || order.paymentReference) && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.4rem",
                    padding: "0.5rem 0.625rem",
                    borderRadius: "0.4rem",
                    background: "rgba(212,175,55,0.05)",
                    border: "1px solid rgba(212,175,55,0.14)",
                    marginBottom: "0.625rem",
                  }}
                >
                  {order.manualPaymentReference && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "0.5rem",
                      }}
                    >
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <p style={{ fontSize: "0.58rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#B87514" }}>
                          Ref. cliente
                        </p>
                        <p style={{ fontSize: "0.8rem", color: "#2C1E11", fontFamily: "monospace", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {order.manualPaymentReference}
                        </p>
                      </div>
                      <AdminCopyButton value={order.manualPaymentReference} label="referencia" />
                    </div>
                  )}
                  {order.paymentReference && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "0.5rem",
                      }}
                    >
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <p style={{ fontSize: "0.58rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#B87514" }}>
                          Ref. sistema
                        </p>
                        <p style={{ fontSize: "0.8rem", color: "#2C1E11", fontFamily: "monospace", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {order.paymentReference}
                        </p>
                      </div>
                      <AdminCopyButton value={order.paymentReference} label="referencia" />
                    </div>
                  )}
                </div>
              )}

              {order.paidAt && (
                <div
                  style={{
                    fontSize: "0.78rem",
                    color: "#10b981",
                    fontWeight: 600,
                    marginBottom: "0.5rem",
                  }}
                >
                  ✓ Pagado el{" "}
                  {new Date(order.paidAt).toLocaleDateString("es-MX", {
                    dateStyle: "long",
                  })}
                </div>
              )}

              {/* Payment instructions as parsed rows */}
              {instructionRows.length > 0 && (
                <>
                  <Divider />
                  <p
                    style={{
                      fontSize: "0.6rem",
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "#B87514",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Instrucciones de pago
                  </p>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.4rem",
                      padding: "0.5rem 0.625rem",
                      borderRadius: "0.4rem",
                      background: "rgba(212,175,55,0.04)",
                      border: "1px solid rgba(212,175,55,0.14)",
                    }}
                  >
                    {instructionRows.map((row, i) => (
                      <div
                        key={i}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: "0.5rem",
                          paddingBottom:
                            i < instructionRows.length - 1 ? "0.35rem" : 0,
                          borderBottom:
                            i < instructionRows.length - 1
                              ? "1px solid rgba(184,117,20,0.07)"
                              : "none",
                        }}
                      >
                        <div style={{ minWidth: 0, flex: 1 }}>
                          {row.label ? (
                            <>
                              <p
                                style={{
                                  fontSize: "0.58rem",
                                  fontWeight: 700,
                                  letterSpacing: "0.08em",
                                  textTransform: "uppercase",
                                  color: "#6F5635",
                                }}
                              >
                                {row.label}
                              </p>
                              <p
                                style={{
                                  fontSize: "0.8rem",
                                  color: "#2C1E11",
                                  fontFamily: row.isCLABE ? "monospace" : undefined,
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {row.value}
                              </p>
                            </>
                          ) : (
                            <p style={{ fontSize: "0.8rem", color: "#2C1E11" }}>
                              {row.value}
                            </p>
                          )}
                        </div>
                        {row.isCLABE && (
                          <AdminCopyButton value={row.value} label="CLABE" />
                        )}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </Card>
          </div>
        </div>

        {/* ── Notes (full width) ────────────────────── */}
        <Card
          className="admin-fade-up-3 admin-detail-notes-card"
          style={{ opacity: 0.72, padding: "0.875rem 1.125rem" }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "0.5rem",
            }}
          >
            <CardTitle>Notas internas</CardTitle>
            <span
              style={{
                fontSize: "0.62rem",
                color: "#9ca3af",
                fontStyle: "italic",
              }}
            >
              Próximamente
            </span>
          </div>
          <textarea
            disabled
            placeholder="Las notas internas del equipo estarán disponibles en una próxima versión."
            rows={2}
            style={{
              width: "100%",
              padding: "0.45rem 0.625rem",
              borderRadius: "0.5rem",
              border: "1.5px solid rgba(184,117,20,0.12)",
              background: "rgba(255,255,255,0.45)",
              color: "#6F5635",
              fontSize: "0.78rem",
              resize: "none",
              fontFamily: "inherit",
              cursor: "not-allowed",
              outline: "none",
              lineHeight: 1.5,
            }}
          />
        </Card>
      </main>
    </>
  );
}
