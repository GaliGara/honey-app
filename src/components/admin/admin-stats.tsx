"use client";

import type { AdminStats } from "@/types/admin";
import Link from "next/link";
import AdminSparkline from "./admin-sparkline";

const MXN = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
  maximumFractionDigits: 0,
});

/* Static sparkline shapes per metric (visual only — no historical data) */
const LINES = {
  payments: [3, 5, 4, 7, 5, 6, 5],
  pending:  [4, 6, 5, 8, 6, 7, 6],
  revenue:  [80, 120, 100, 160, 140, 180, 165],
  today:    [0, 1, 0, 2, 1, 2, 3],
  confirmed:[1, 2, 3, 2, 4, 3, 4],
};

interface CardProps {
  label: string;
  value: string;
  sub: string;
  iconEl: React.ReactNode;
  accentColor: string;
  sparkData: number[];
  sparkColor: string;
  href?: string;
  hrefLabel?: string;
  alert?: boolean;
  animClass?: string;
}

function StatCard({
  label, value, sub, iconEl, accentColor, sparkData, sparkColor,
  href, hrefLabel, alert, animClass,
}: CardProps) {
  return (
    <div
      className={`admin-card${animClass ? ` ${animClass}` : ""}`}
      style={{
        padding: "1rem 1.1rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
        borderLeft: `3px solid ${accentColor}`,
        position: "relative",
        overflow: "hidden",
        transition: "box-shadow 200ms ease, transform 200ms ease",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.boxShadow = `0 6px 24px rgba(184,117,20,0.1), 0 1px 0 rgba(255,255,255,0.75) inset`;
        el.style.transform = "translateY(-1px)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.boxShadow = "";
        el.style.transform = "";
      }}
    >
      {alert && (
        <span
          aria-hidden
          style={{
            position: "absolute", top: 10, right: 10,
            width: 7, height: 7, borderRadius: "50%",
            background: "#f59e0b",
            boxShadow: "0 0 0 3px rgba(245,158,11,0.2)",
          }}
        />
      )}

      {/* Top row: icon + label + sparkline */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        {iconEl}
        <p style={{
          flex: 1,
          fontSize: "0.67rem", fontWeight: 700, letterSpacing: "0.08em",
          textTransform: "uppercase", color: "#6F5635", lineHeight: 1.2,
        }}>
          {label}
        </p>
        <AdminSparkline data={sparkData} color={sparkColor} width={72} height={24} />
      </div>

      {/* Value */}
      <p style={{
        fontFamily: "var(--font-playfair)",
        fontSize: "1.75rem", fontWeight: 700, color: "#2C1E11",
        lineHeight: 1, letterSpacing: "-0.01em",
      }}>
        {value}
      </p>

      {/* Sub + link */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.5rem" }}>
        <p style={{ fontSize: "0.72rem", color: "#6F5635", lineHeight: 1.3, flex: 1 }}>{sub}</p>
        {href && (
          <Link
            href={href}
            style={{
              fontSize: "0.72rem", fontWeight: 700,
              color: accentColor, textDecoration: "none",
              whiteSpace: "nowrap", flexShrink: 0,
            }}
          >
            {hrefLabel ?? "Ver →"}
          </Link>
        )}
      </div>
    </div>
  );
}

/* ── Icon helpers ─────────────────────────────────────────── */
function IB({ bg, border, children }: { bg: string; border: string; children: React.ReactNode }) {
  return (
    <div style={{
      width: 32, height: 32, borderRadius: "0.5rem",
      background: bg, border: `1px solid ${border}`,
      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
    }}>
      {children}
    </div>
  );
}

const icons = {
  wallet: (c: string) => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="2" y="5" width="20" height="14" rx="2" /><path d="M2 10h20" />
      <circle cx="16" cy="15" r="1" fill={c} stroke="none" />
    </svg>
  ),
  clock: (c: string) => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  check: (c: string) => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  ),
  trend: (c: string) => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
    </svg>
  ),
  box: (c: string) => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M20 7l-8-4-8 4m16 0-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
    </svg>
  ),
};

/* ── Main ──────────────────────────────────────────────────── */

export default function AdminStats({ stats }: { stats: AdminStats }) {
  return (
    <div className="admin-stats-grid">
      <StatCard
        animClass="admin-fade-up-1"
        label="Pagos pendientes"
        value={String(stats.awaitingPaymentOrders)}
        sub={stats.awaitingPaymentOrders === 0 ? "Todo al día" : `${stats.awaitingPaymentOrders} esperan confirmación`}
        iconEl={<IB bg="rgba(245,158,11,0.1)" border="rgba(245,158,11,0.22)">{icons.wallet("#d97706")}</IB>}
        accentColor="#f59e0b"
        sparkData={LINES.payments}
        sparkColor="#f59e0b"
        href={stats.awaitingPaymentOrders > 0 ? "/admin/orders?payment_status=pending_transfer" : undefined}
        hrefLabel="Ver →"
        alert={stats.awaitingPaymentOrders > 0}
      />

      <StatCard
        animClass="admin-fade-up-2"
        label="Por atender"
        value={String(stats.pendingOrders)}
        sub={stats.pendingOrders === 0 ? "Sin nuevos pedidos" : `${stats.pendingOrders} sin procesar`}
        iconEl={<IB bg="rgba(59,130,246,0.1)" border="rgba(59,130,246,0.2)">{icons.clock("#3b82f6")}</IB>}
        accentColor="#3b82f6"
        sparkData={LINES.pending}
        sparkColor="#3b82f6"
        href={stats.pendingOrders > 0 ? "/admin/orders?status=pending" : undefined}
        hrefLabel="Atender →"
        alert={stats.pendingOrders > 0}
      />

      <StatCard
        animClass="admin-fade-up-3"
        label="Ingresos pagados"
        value={MXN.format(stats.totalRevenue)}
        sub={`${stats.paidOrders} pedido${stats.paidOrders !== 1 ? "s" : ""} confirmado${stats.paidOrders !== 1 ? "s" : ""}`}
        iconEl={<IB bg="rgba(16,185,129,0.1)" border="rgba(16,185,129,0.2)">{icons.check("#10b981")}</IB>}
        accentColor="#10b981"
        sparkData={LINES.revenue}
        sparkColor="#10b981"
        href="/admin/orders?payment_status=paid"
        hrefLabel="Ver →"
      />

      <StatCard
        animClass="admin-fade-up-4"
        label="Hoy"
        value={String(stats.todayOrders)}
        sub={stats.todayOrders === 0 ? "Sin actividad hoy" : `${MXN.format(stats.todayRevenue)} nuevos`}
        iconEl={<IB bg="rgba(212,175,55,0.12)" border="rgba(212,175,55,0.22)">{icons.trend("#D4AF37")}</IB>}
        accentColor="#D4AF37"
        sparkData={LINES.today}
        sparkColor="#D4AF37"
      />

      {stats.confirmedOrders > 0 && (
        <StatCard
          animClass="admin-fade-up-5"
          label="En preparación"
          value={String(stats.confirmedOrders)}
          sub="Confirmados, pendientes de envío"
          iconEl={<IB bg="rgba(139,92,246,0.1)" border="rgba(139,92,246,0.2)">{icons.box("#8b5cf6")}</IB>}
          accentColor="#8b5cf6"
          sparkData={LINES.confirmed}
          sparkColor="#8b5cf6"
          href="/admin/orders?status=confirmed"
          hrefLabel="Ver →"
        />
      )}
    </div>
  );
}
