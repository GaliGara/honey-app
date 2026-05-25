/**
 * Pantalla de login unificada (cliente + admin) — MVP.
 *
 * FUTURO: cuando se integre Supabase Auth, este componente será
 * reemplazado por un flujo único con roles customer/admin.
 * Por ahora:
 *   - Cliente: acceso mock directo a /cuenta.
 *   - Admin: formulario de contraseña → /api/admin/login → /admin.
 */
"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

/* ── Icons ─────────────────────────────────────────────────── */

function ClientIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#D4AF37"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function AdminIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#D4AF37"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

/* ── Shared card icon ring ─────────────────────────────────── */

function IconRing({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        width: 60,
        height: 60,
        borderRadius: "50%",
        background:
          "linear-gradient(135deg, rgba(212,175,55,0.16) 0%, rgba(184,117,20,0.09) 100%)",
        border: "1.5px solid rgba(212,175,55,0.38)",
        boxShadow: "0 0 0 6px rgba(212,175,55,0.05)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      {children}
    </div>
  );
}

/* ── Card header ───────────────────────────────────────────── */

function CardHeader({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <IconRing>{icon}</IconRing>
      <div>
        <h2
          style={{
            fontFamily: "var(--font-playfair)",
            fontSize: "1.2rem",
            fontWeight: 700,
            color: "#2C1E11",
            lineHeight: 1.2,
            marginBottom: "0.4rem",
          }}
        >
          {title}
        </h2>
        <p style={{ fontSize: "0.85rem", color: "#6F5635", lineHeight: 1.55 }}>
          {description}
        </p>
      </div>
      <div className="gold-divider" style={{ maxWidth: 60 }} />
    </div>
  );
}

/* ── Client card ───────────────────────────────────────────── */

function ClientCard() {
  return (
    <div
      className="glass-panel"
      style={{
        borderRadius: "1.5rem",
        padding: "2rem 1.75rem",
        display: "flex",
        flexDirection: "column",
        gap: "1.75rem",
        width: "100%",
      }}
    >
      <CardHeader
        icon={<ClientIcon />}
        title="Cliente"
        description="Consulta tu cuenta, favoritos y pedidos cuando habilitemos el acceso completo."
      />

      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        <Link href="/cuenta" className="premium-button" style={{ width: "100%" }}>
          Entrar como cliente
        </Link>
        <p
          style={{
            fontSize: "0.75rem",
            color: "rgba(111,86,53,0.6)",
            textAlign: "center",
          }}
        >
          Vista mock por ahora.
        </p>
      </div>
    </div>
  );
}

/* ── Admin card ────────────────────────────────────────────── */

function AdminCard() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      try {
        const res = await fetch("/api/admin/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password }),
        });
        const data = await res.json();

        if (!res.ok || !data.ok) {
          setError(data.message ?? "Contraseña incorrecta");
          return;
        }

        router.replace("/admin");
        router.refresh();
      } catch {
        setError("Error de conexión. Intenta de nuevo.");
      }
    });
  }

  return (
    <div
      className="glass-panel"
      style={{
        borderRadius: "1.5rem",
        padding: "2rem 1.75rem",
        display: "flex",
        flexDirection: "column",
        gap: "1.75rem",
        flex: 1,
      }}
    >
      <CardHeader
        icon={<AdminIcon />}
        title="Administrador"
        description="Gestiona pedidos, pagos manuales y estados de envío."
      />

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
          <label
            htmlFor="admin-password"
            style={{
              fontSize: "0.75rem",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "#6F5635",
            }}
          >
            Contraseña
          </label>
          <input
            id="admin-password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isPending}
            placeholder="••••••••"
            style={{
              width: "100%",
              padding: "0.7rem 1rem",
              borderRadius: "0.75rem",
              border: "1.5px solid rgba(184,117,20,0.28)",
              background: "rgba(255,255,255,0.7)",
              color: "#2C1E11",
              fontSize: "0.9rem",
              outline: "none",
              transition: "border-color 250ms ease, box-shadow 250ms ease",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "rgba(212,175,55,0.8)";
              e.target.style.boxShadow = "0 0 0 3px rgba(212,175,55,0.12)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "rgba(184,117,20,0.28)";
              e.target.style.boxShadow = "none";
            }}
          />
        </div>

        {error && (
          <p
            role="alert"
            style={{
              fontSize: "0.82rem",
              color: "#c0392b",
              background: "rgba(192,57,43,0.07)",
              border: "1px solid rgba(192,57,43,0.2)",
              borderRadius: "0.5rem",
              padding: "0.55rem 0.875rem",
            }}
          >
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isPending || password.length === 0}
          className="premium-button"
          style={{
            width: "100%",
            opacity: isPending || password.length === 0 ? 0.6 : 1,
          }}
        >
          {isPending ? "Verificando…" : "Ingresar al panel"}
        </button>
      </form>
    </div>
  );
}

/* ── Decorative hex ────────────────────────────────────────── */

function Hex({
  size,
  style,
}: {
  size: number;
  style: React.CSSProperties;
}) {
  return (
    <div
      aria-hidden
      className="hex-shape hex-drift"
      style={{ width: size, height: size, ...style }}
    />
  );
}

/* ── Main component ────────────────────────────────────────── */

export default function UnifiedLogin() {
  return (
    <div
      className="warm-radial-bg"
      style={{
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "6rem 1.25rem 2.5rem",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative hexes */}
      <Hex
        size={280}
        style={{
          position: "absolute",
          right: "-2%",
          top: "5%",
          background: "rgba(212,175,55,0.05)",
          transform: "rotate(12deg)",
          ["--hd" as string]: "14s",
        }}
      />
      <Hex
        size={160}
        style={{
          position: "absolute",
          left: "1%",
          bottom: "12%",
          background: "rgba(184,117,20,0.04)",
          transform: "rotate(-8deg)",
          ["--hd" as string]: "11s",
          animationDelay: "-3.5s",
        }}
      />
      <Hex
        size={90}
        style={{
          position: "absolute",
          left: "8%",
          top: "20%",
          background: "rgba(229,169,59,0.04)",
          transform: "rotate(22deg)",
          ["--hd" as string]: "17s",
          animationDelay: "-6s",
        }}
      />

      {/* Header */}
      <div
        style={{
          textAlign: "center",
          marginBottom: "2.25rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.5rem",
        }}
      >
        <p
          style={{
            fontSize: "0.72rem",
            fontWeight: 700,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "#B87514",
          }}
        >
          Honey
        </p>
        <h1
          style={{
            fontFamily: "var(--font-playfair)",
            fontSize: "clamp(1.5rem, 4vw, 2rem)",
            fontWeight: 700,
            color: "#2C1E11",
            lineHeight: 1.2,
          }}
        >
          Bienvenido
        </h1>
        <p style={{ fontSize: "0.875rem", color: "#6F5635" }}>
          ¿Cómo deseas continuar?
        </p>
      </div>

      {/* Cards — side by side on desktop, stacked on mobile */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "1.25rem",
          width: "100%",
          maxWidth: 740,
          flexWrap: "wrap",
        }}
      >
        {/* Each card has min-width so they stack naturally below ~600px */}
        <div style={{ flex: "1 1 280px", minWidth: 0 }}>
          <ClientCard />
        </div>
        <div style={{ flex: "1 1 280px", minWidth: 0 }}>
          <AdminCard />
        </div>
      </div>

      {/* Bottom note */}
      <p
        style={{
          marginTop: "2rem",
          fontSize: "0.75rem",
          color: "rgba(111,86,53,0.45)",
          textAlign: "center",
          maxWidth: 420,
        }}
      >
        El acceso completo para clientes estará disponible próximamente.
      </p>
    </div>
  );
}
