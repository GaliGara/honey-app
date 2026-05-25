"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { OrderStatus, PaymentStatus } from "@/types/admin";

interface Props {
  orderId: string;
  currentStatus: OrderStatus;
  currentPaymentStatus: PaymentStatus;
}

const ORDER_STATUSES: { value: OrderStatus; label: string }[] = [
  { value: "pending", label: "Pendiente" },
  { value: "processing", label: "En proceso" },
  { value: "shipped", label: "Enviado" },
  { value: "delivered", label: "Entregado" },
  { value: "cancelled", label: "Cancelado" },
];

const PAYMENT_STATUSES: { value: PaymentStatus; label: string }[] = [
  { value: "pending_payment", label: "Sin pago" },
  { value: "pending_transfer", label: "Espera transferencia" },
  { value: "pending_deposit", label: "Espera depósito" },
  { value: "pending_cash_payment", label: "Contra entrega" },
  { value: "paid", label: "Pagado" },
  { value: "payment_failed", label: "Pago fallido" },
  { value: "cancelled", label: "Cancelado" },
  { value: "refunded", label: "Reembolsado" },
];

const SELECT_STYLE: React.CSSProperties = {
  padding: "0.4rem 0.65rem",
  borderRadius: "0.5rem",
  border: "1.5px solid rgba(184,117,20,0.28)",
  background: "rgba(255,255,255,0.8)",
  color: "#2C1E11",
  fontSize: "0.8rem",
  cursor: "pointer",
  outline: "none",
};

export default function OrderActions({ orderId, currentStatus, currentPaymentStatus }: Props) {
  const [status, setStatus] = useState<OrderStatus>(currentStatus);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(currentPaymentStatus);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  async function handleSave() {
    setError(null);
    setSuccess(false);

    const patch: Record<string, string> = {};
    if (status !== currentStatus) patch.status = status;
    if (paymentStatus !== currentPaymentStatus) patch.paymentStatus = paymentStatus;

    if (Object.keys(patch).length === 0) return;

    startTransition(async () => {
      try {
        const res = await fetch(`/api/admin/orders/${orderId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(patch),
        });
        const data = await res.json();
        if (!res.ok || !data.ok) {
          setError(data.message ?? "Error al actualizar");
          return;
        }
        setSuccess(true);
        setTimeout(() => setSuccess(false), 2500);
        router.refresh();
      } catch {
        setError("Error de conexión");
      }
    });
  }

  const hasChanges = status !== currentStatus || paymentStatus !== currentPaymentStatus;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", alignItems: "center" }}>
        {/* Estado pedido */}
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as OrderStatus)}
          disabled={isPending}
          style={SELECT_STYLE}
          aria-label="Estado del pedido"
        >
          {ORDER_STATUSES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>

        {/* Estado pago */}
        <select
          value={paymentStatus}
          onChange={(e) => setPaymentStatus(e.target.value as PaymentStatus)}
          disabled={isPending}
          style={SELECT_STYLE}
          aria-label="Estado del pago"
        >
          {PAYMENT_STATUSES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>

        {/* Guardar */}
        <button
          onClick={handleSave}
          disabled={isPending || !hasChanges}
          style={{
            padding: "0.4rem 0.875rem",
            borderRadius: "0.5rem",
            border: "none",
            background:
              hasChanges && !isPending
                ? "linear-gradient(135deg, #D4AF37 0%, #E5A93B 100%)"
                : "rgba(184,117,20,0.15)",
            color: hasChanges && !isPending ? "#2C1E11" : "#B87514",
            fontWeight: 600,
            fontSize: "0.8rem",
            cursor: hasChanges && !isPending ? "pointer" : "not-allowed",
            transition: "all 250ms ease",
          }}
        >
          {isPending ? "Guardando…" : success ? "✓ Guardado" : "Guardar"}
        </button>
      </div>

      {error && (
        <p style={{ fontSize: "0.775rem", color: "#c0392b" }} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
