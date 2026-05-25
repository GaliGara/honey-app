"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTransition } from "react";
import { useRouter } from "next/navigation";

interface Props {
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

const NAV_ITEMS = [
  {
    href: "/admin",
    label: "Dashboard",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
      </svg>
    ),
  },
  {
    href: "/admin/orders",
    label: "Pedidos",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </svg>
    ),
  },
] as const;

/* Decorative mini honeycomb in sidebar footer */
function SidebarHoneycomb() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 120 44"
      style={{ width: "100%", height: 44, opacity: 0.14 }}
    >
      {/* Row 1: 3 hexagons */}
      {[0, 1, 2].map((i) => (
        <polygon
          key={`r1-${i}`}
          points="12,2 22,7.5 22,18.5 12,24 2,18.5 2,7.5"
          transform={`translate(${i * 38}, 0)`}
          fill="none"
          stroke="#B87514"
          strokeWidth="1"
        />
      ))}
      {/* Row 2: 2 hexagons offset */}
      {[0, 1].map((i) => (
        <polygon
          key={`r2-${i}`}
          points="12,2 22,7.5 22,18.5 12,24 2,18.5 2,7.5"
          transform={`translate(${i * 38 + 19}, 20)`}
          fill="none"
          stroke="#B87514"
          strokeWidth="1"
        />
      ))}
    </svg>
  );
}

export default function AdminSidebar({ isMobileOpen, onMobileClose }: Props) {
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleLogout() {
    startTransition(async () => {
      await fetch("/api/admin/logout", { method: "POST" });
      router.replace("/admin/login");
      router.refresh();
    });
  }

  return (
    <aside className={`admin-sidebar${isMobileOpen ? " admin-drawer-open" : ""}`}>
      {/* ── Logo / Header ──────────────────────── */}
      <div
        style={{
          padding: "1rem 1.125rem",
          borderBottom: "1px solid rgba(184,117,20,0.1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
        }}
      >
        <Link
          href="/admin"
          style={{ display: "flex", alignItems: "center", gap: "0.55rem", textDecoration: "none" }}
          onClick={onMobileClose}
        >
          {/* Hexagon icon */}
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: "50%",
              background: "linear-gradient(135deg, rgba(212,175,55,0.25) 0%, rgba(184,117,20,0.15) 100%)",
              border: "1.5px solid rgba(212,175,55,0.42)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              boxShadow: "0 2px 8px rgba(184,117,20,0.12)",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#D4AF37" aria-hidden>
              <path d="M12 2C8 2 5 5 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-4-3-7-7-7z" opacity=".9" />
            </svg>
          </div>
          <div>
            <p style={{ fontFamily: "var(--font-playfair)", fontWeight: 700, fontSize: "0.95rem", color: "#2C1E11", lineHeight: 1.1 }}>
              Honey
            </p>
            <p style={{ fontSize: "0.58rem", color: "#B87514", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600 }}>
              Admin Panel
            </p>
          </div>
        </Link>

        {/* Mobile close button */}
        {onMobileClose && (
          <button
            onClick={onMobileClose}
            aria-label="Cerrar menú"
            style={{
              width: 28, height: 28, borderRadius: "50%",
              border: "1px solid rgba(184,117,20,0.2)",
              background: "rgba(255,255,255,0.55)",
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
              color: "#6F5635", fontSize: "0.85rem", flexShrink: 0,
            }}
          >
            ✕
          </button>
        )}
      </div>

      {/* ── Label ──────────────────────────────── */}
      <div style={{ padding: "0.875rem 1.125rem 0.25rem" }}>
        <p style={{
          fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.12em",
          textTransform: "uppercase", color: "rgba(184,117,20,0.55)",
        }}>
          Navegación
        </p>
      </div>

      {/* ── Nav ─────────────────────────────────── */}
      <nav
        style={{
          flex: 1,
          padding: "0 0.625rem",
          display: "flex",
          flexDirection: "column",
          gap: "2px",
        }}
      >
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onMobileClose}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.55rem",
                padding: "0.5rem 0.75rem",
                borderRadius: "0.625rem",
                fontSize: "0.85rem",
                fontWeight: isActive ? 700 : 500,
                color: isActive ? "#B87514" : "#6F5635",
                background: isActive
                  ? "rgba(212,175,55,0.13)"
                  : "transparent",
                border: isActive
                  ? "1px solid rgba(212,175,55,0.24)"
                  : "1px solid transparent",
                transition: "all 160ms ease",
                textDecoration: "none",
                boxShadow: isActive
                  ? "0 1px 4px rgba(212,175,55,0.12)"
                  : "none",
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLAnchorElement).style.background = "rgba(212,175,55,0.07)";
                  (e.currentTarget as HTMLAnchorElement).style.color = "#B87514";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLAnchorElement).style.background = "transparent";
                  (e.currentTarget as HTMLAnchorElement).style.color = "#6F5635";
                }
              }}
            >
              {item.icon}
              {item.label}
              {isActive && (
                <span
                  style={{
                    marginLeft: "auto",
                    width: 5,
                    height: 5,
                    borderRadius: "50%",
                    background: "#D4AF37",
                    flexShrink: 0,
                  }}
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* ── Footer ──────────────────────────────── */}
      <div
        style={{
          padding: "0.625rem",
          borderTop: "1px solid rgba(184,117,20,0.1)",
          display: "flex",
          flexDirection: "column",
          gap: "2px",
          flexShrink: 0,
        }}
      >
        <Link
          href="/"
          target="_blank"
          onClick={onMobileClose}
          style={{
            display: "flex", alignItems: "center", gap: "0.5rem",
            padding: "0.45rem 0.75rem", borderRadius: "0.5rem",
            fontSize: "0.8rem", color: "#6F5635", textDecoration: "none",
            transition: "color 160ms ease",
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#B87514"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#6F5635"; }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
          </svg>
          Ver tienda
        </Link>

        <button
          onClick={handleLogout}
          disabled={isPending}
          style={{
            display: "flex", alignItems: "center", gap: "0.5rem",
            padding: "0.45rem 0.75rem", borderRadius: "0.5rem",
            fontSize: "0.8rem", color: isPending ? "#9ca3af" : "#6F5635",
            background: "none", border: "none",
            cursor: isPending ? "wait" : "pointer",
            transition: "color 160ms ease", textAlign: "left", width: "100%",
          }}
          onMouseEnter={(e) => { if (!isPending) (e.currentTarget as HTMLButtonElement).style.color = "#991b1b"; }}
          onMouseLeave={(e) => { if (!isPending) (e.currentTarget as HTMLButtonElement).style.color = "#6F5635"; }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          {isPending ? "Saliendo…" : "Cerrar sesión"}
        </button>

        {/* Decorative honeycomb */}
        <div style={{ padding: "0.25rem 0.75rem 0.5rem", opacity: 0.7 }}>
          <SidebarHoneycomb />
        </div>
      </div>
    </aside>
  );
}
