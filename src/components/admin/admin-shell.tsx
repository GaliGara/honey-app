"use client";

import { useState } from "react";
import Link from "next/link";
import AdminSidebar from "./admin-sidebar";

interface Props {
  children: React.ReactNode;
}

function HamburgerIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden
    >
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="17" x2="21" y2="17" />
    </svg>
  );
}

export default function AdminShell({ children }: Props) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="warm-radial-bg admin-layout">
      {/* ── Mobile-only topbar ─────────────────────────── */}
      <div className="admin-topbar">
        {/* Logo */}
        <Link
          href="/admin"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.45rem",
            textDecoration: "none",
          }}
        >
          <div
            style={{
              width: 26,
              height: 26,
              borderRadius: "50%",
              background:
                "linear-gradient(135deg, rgba(212,175,55,0.22) 0%, rgba(184,117,20,0.14) 100%)",
              border: "1.5px solid rgba(212,175,55,0.4)",
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
              fill="#D4AF37"
              aria-hidden
            >
              <path
                d="M12 2C8 2 5 5 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-4-3-7-7-7z"
                opacity=".9"
              />
            </svg>
          </div>
          <div>
            <p
              style={{
                fontFamily: "var(--font-playfair)",
                fontWeight: 700,
                fontSize: "0.9rem",
                color: "#2C1E11",
                lineHeight: 1,
              }}
            >
              Honey
            </p>
            <p
              style={{
                fontSize: "0.6rem",
                color: "#6F5635",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              Admin
            </p>
          </div>
        </Link>

        {/* Hamburger */}
        <button
          onClick={() => setMobileOpen(true)}
          aria-label="Abrir navegación"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 34,
            height: 34,
            borderRadius: "0.5rem",
            border: "1px solid rgba(184,117,20,0.22)",
            background: "rgba(255,255,255,0.6)",
            color: "#6F5635",
            cursor: "pointer",
          }}
        >
          <HamburgerIcon />
        </button>
      </div>

      {/* ── Mobile overlay ─────────────────────────────── */}
      <div
        className={`admin-overlay${mobileOpen ? " admin-drawer-open" : ""}`}
        onClick={() => setMobileOpen(false)}
        aria-hidden
      />

      {/* ── Sidebar ────────────────────────────────────── */}
      <AdminSidebar
        isMobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      {/* ── Main content ───────────────────────────────── */}
      <div className="admin-main">{children}</div>
    </div>
  );
}
