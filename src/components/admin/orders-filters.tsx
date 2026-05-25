"use client";

import { useRouter, usePathname } from "next/navigation";
import { useCallback, useRef } from "react";

interface Props {
  currentStatus?: string;
  currentPaymentStatus?: string;
  currentSearch?: string;
}

function Pill({
  label,
  dot,
  active,
  onClick,
}: {
  label: string;
  dot?: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "4px",
        padding: "0.28rem 0.65rem",
        borderRadius: 9999,
        fontSize: "0.74rem",
        fontWeight: active ? 700 : 500,
        border: active ? "1.5px solid rgba(212,175,55,0.55)" : "1.5px solid rgba(184,117,20,0.16)",
        background: active ? "rgba(212,175,55,0.13)" : "rgba(255,255,255,0.55)",
        color: active ? "#92400e" : "#6F5635",
        cursor: "pointer",
        transition: "all 150ms ease",
        whiteSpace: "nowrap",
        flexShrink: 0,
      }}
      onMouseEnter={(e) => {
        if (!active) {
          (e.currentTarget as HTMLButtonElement).style.background = "rgba(212,175,55,0.08)";
          (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(184,117,20,0.3)";
        }
      }}
      onMouseLeave={(e) => {
        if (!active) {
          (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.55)";
          (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(184,117,20,0.16)";
        }
      }}
    >
      {dot && (
        <span style={{ width: 5, height: 5, borderRadius: "50%", background: dot, flexShrink: 0 }} />
      )}
      {label}
    </button>
  );
}

const STATUS_PILLS = [
  { value: "pending",   label: "Pendiente",  dot: "#f59e0b" },
  { value: "confirmed", label: "Confirmado", dot: "#3b82f6" },
  { value: "shipped",   label: "Enviado",    dot: "#8b5cf6" },
  { value: "delivered", label: "Entregado",  dot: "#10b981" },
  { value: "cancelled", label: "Cancelado",  dot: "#ef4444" },
] as const;

const PAYMENT_PILLS = [
  { value: "pending_transfer",     label: "Espera transf.",  dot: "#f59e0b" },
  { value: "pending_deposit",      label: "Espera depósito", dot: "#f97316" },
  { value: "pending_cash_payment", label: "Contra entrega",  dot: "#6366f1" },
  { value: "paid",                 label: "Pagado",          dot: "#10b981" },
] as const;

export default function OrdersFilters({
  currentStatus,
  currentPaymentStatus,
  currentSearch,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const inputRef = useRef<HTMLInputElement>(null);

  const nav = useCallback(
    (p: Record<string, string | undefined>) => {
      const sp = new URLSearchParams();
      Object.entries(p).forEach(([k, v]) => { if (v) sp.set(k, v); });
      const q = sp.toString();
      router.push(q ? `${pathname}?${q}` : pathname);
    },
    [router, pathname]
  );

  function toggleStatus(v: string) {
    nav({ status: currentStatus === v ? undefined : v, payment_status: currentPaymentStatus, search: currentSearch });
  }
  function togglePayment(v: string) {
    nav({ status: currentStatus, payment_status: currentPaymentStatus === v ? undefined : v, search: currentSearch });
  }
  function commitSearch(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter")
      nav({ status: currentStatus, payment_status: currentPaymentStatus, search: e.currentTarget.value.trim() || undefined });
  }
  function clearAll() {
    if (inputRef.current) inputRef.current.value = "";
    router.push(pathname);
  }

  const hasFilters = !!(currentStatus || currentPaymentStatus || currentSearch);

  return (
    <div
      className="admin-card"
      style={{ padding: "0.875rem 1rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}
    >
      {/* Row 1: search + sort + clear */}
      <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 0 }}>
          <span
            style={{
              position: "absolute", left: "0.65rem", top: "50%",
              transform: "translateY(-50%)", color: "#B87514",
              pointerEvents: "none", display: "flex",
            }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
            </svg>
          </span>
          <input
            ref={inputRef}
            type="search"
            placeholder="Buscar por pedido, cliente o email…"
            defaultValue={currentSearch ?? ""}
            onKeyDown={commitSearch}
            aria-label="Buscar pedidos"
            style={{
              width: "100%",
              padding: "0.45rem 0.875rem 0.45rem 2.1rem",
              borderRadius: "0.5rem",
              border: "1.5px solid rgba(184,117,20,0.18)",
              background: "rgba(255,255,255,0.72)",
              color: "#2C1E11",
              fontSize: "0.82rem",
              outline: "none",
              transition: "border-color 180ms ease, box-shadow 180ms ease",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "rgba(212,175,55,0.62)";
              e.target.style.boxShadow = "0 0 0 3px rgba(212,175,55,0.1)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "rgba(184,117,20,0.18)";
              e.target.style.boxShadow = "none";
            }}
          />
        </div>

        {/* Sort indicator (visual) */}
        <span
          style={{
            display: "inline-flex", alignItems: "center", gap: "4px",
            padding: "0.42rem 0.7rem", borderRadius: "0.5rem",
            border: "1.5px solid rgba(184,117,20,0.15)",
            background: "rgba(255,255,255,0.55)",
            color: "#6F5635", fontSize: "0.74rem", fontWeight: 500,
            whiteSpace: "nowrap", flexShrink: 0, userSelect: "none",
          }}
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M11 5H21M11 12H17M11 19H13M3 5L7 9L3 13" />
          </svg>
          Más recientes
        </span>

        {hasFilters && (
          <button
            onClick={clearAll}
            style={{
              display: "inline-flex", alignItems: "center", gap: "3px",
              padding: "0.42rem 0.65rem", borderRadius: "0.5rem",
              fontSize: "0.74rem", fontWeight: 600,
              border: "1.5px solid rgba(239,68,68,0.2)",
              background: "rgba(239,68,68,0.05)",
              color: "#7f1d1d", cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0,
              transition: "background 150ms ease",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(239,68,68,0.1)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(239,68,68,0.05)"; }}
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
            Limpiar
          </button>
        )}
      </div>

      {/* Row 2: pills */}
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", alignItems: "center" }}>
        <span style={{ fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#B87514", flexShrink: 0 }}>
          Estado
        </span>
        {STATUS_PILLS.map((p) => (
          <Pill key={p.value} label={p.label} dot={p.dot} active={currentStatus === p.value} onClick={() => toggleStatus(p.value)} />
        ))}
        <span style={{ width: 1, height: 16, background: "rgba(184,117,20,0.15)", flexShrink: 0 }} />
        <span style={{ fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#B87514", flexShrink: 0 }}>
          Pago
        </span>
        {PAYMENT_PILLS.map((p) => (
          <Pill key={p.value} label={p.label} dot={p.dot} active={currentPaymentStatus === p.value} onClick={() => togglePayment(p.value)} />
        ))}
      </div>
    </div>
  );
}
