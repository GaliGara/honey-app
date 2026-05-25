"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { AdminOrder, OrderStatus, PaymentStatus } from "@/types/admin";

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

  if (
    order.paymentStatus === "pending_transfer" ||
    order.paymentStatus === "pending_deposit" ||
    order.paymentStatus === "pending_cash_payment"
  ) {
    actions.push({
      label: "✓ Confirmar pago",
      paymentStatus: "paid",
      color: "#064e3b",
      bg: "rgba(16,185,129,0.09)",
      border: "rgba(16,185,129,0.28)",
      hoverBg: "rgba(16,185,129,0.16)",
    });
  }

  if (order.status === "pending") {
    actions.push({
      label: "Confirmar pedido",
      status: "confirmed",
      color: "#1e3a8a",
      bg: "rgba(59,130,246,0.09)",
      border: "rgba(59,130,246,0.26)",
      hoverBg: "rgba(59,130,246,0.16)",
    });
  }

  if (order.status === "confirmed" || order.status === "processing") {
    actions.push({
      label: "🚚 Marcar enviado",
      status: "shipped",
      color: "#4c1d95",
      bg: "rgba(139,92,246,0.09)",
      border: "rgba(139,92,246,0.26)",
      hoverBg: "rgba(139,92,246,0.16)",
    });
  }

  if (order.status === "shipped") {
    actions.push({
      label: "✓ Entregado",
      status: "delivered",
      color: "#064e3b",
      bg: "rgba(16,185,129,0.09)",
      border: "rgba(16,185,129,0.26)",
      hoverBg: "rgba(16,185,129,0.16)",
    });
  }

  if (order.status !== "cancelled" && order.status !== "delivered") {
    actions.push({
      label: "Cancelar",
      status: "cancelled",
      color: "#7f1d1d",
      bg: "rgba(239,68,68,0.07)",
      border: "rgba(239,68,68,0.2)",
      hoverBg: "rgba(239,68,68,0.14)",
    });
  }

  return actions;
}

interface Props {
  order: AdminOrder;
}

export default function AdminOrderActions({ order }: Props) {
  const actions = buildActions(order);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [successLabel, setSuccessLabel] = useState<string | null>(null);
  const router = useRouter();

  if (actions.length === 0) {
    return (
      <p style={{ fontSize: "0.8rem", color: "#6F5635", fontStyle: "italic" }}>
        Sin acciones disponibles para este pedido.
      </p>
    );
  }

  function run(action: Action) {
    setError(null);
    setSuccessLabel(null);
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
        if (!res.ok || !data.ok) {
          setError(data.message ?? "Error");
          return;
        }
        setSuccessLabel(action.label);
        router.refresh();
      } catch {
        setError("Error de conexión");
      }
    });
  }

  return (
    <div>
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        {actions.map((a) => (
          <button
            key={a.label}
            onClick={() => run(a)}
            disabled={isPending}
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "0.45rem 0.875rem",
              borderRadius: "0.5rem",
              border: `1px solid ${a.border}`,
              background: a.bg,
              color: a.color,
              fontSize: "0.8rem",
              fontWeight: 600,
              cursor: isPending ? "wait" : "pointer",
              transition: "all 150ms ease",
              opacity: isPending ? 0.65 : 1,
              whiteSpace: "nowrap",
            }}
            onMouseEnter={(e) => {
              if (!isPending) (e.currentTarget as HTMLButtonElement).style.background = a.hoverBg;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = a.bg;
            }}
          >
            {isPending ? "…" : a.label}
          </button>
        ))}
      </div>
      {successLabel && (
        <p style={{ fontSize: "0.78rem", color: "#10b981", marginTop: "0.5rem", fontWeight: 600 }}>
          ✓ {successLabel} ejecutado correctamente
        </p>
      )}
      {error && (
        <p role="alert" style={{ fontSize: "0.78rem", color: "#c0392b", marginTop: "0.5rem" }}>
          {error}
        </p>
      )}
    </div>
  );
}
