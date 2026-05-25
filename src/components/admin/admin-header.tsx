"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";

interface Props {
  title: string;
  subtitle?: string;
}

function SearchIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

export default function AdminHeader({ title, subtitle }: Props) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  function handleSearch(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      const val = e.currentTarget.value.trim();
      if (val) {
        router.push(`/admin/orders?search=${encodeURIComponent(val)}`);
      }
    }
  }

  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
        padding: "0.625rem 1.25rem",
        borderBottom: "1px solid rgba(184,117,20,0.1)",
        background: "rgba(244,239,227,0.88)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        position: "sticky",
        top: 0,
        zIndex: 20,
        minHeight: 52,
        flexShrink: 0,
      }}
    >
      {/* Title block */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <h1
          style={{
            fontFamily: "var(--font-playfair)",
            fontSize: "1.05rem",
            fontWeight: 700,
            color: "#2C1E11",
            lineHeight: 1.2,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {title}
        </h1>
        {subtitle && (
          <p
            style={{
              fontSize: "0.7rem",
              color: "#6F5635",
              marginTop: "1px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {subtitle}
          </p>
        )}
      </div>

      {/* Search */}
      <div
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          flexShrink: 0,
        }}
        className="admin-header-search"
      >
        <span
          style={{
            position: "absolute",
            left: "0.55rem",
            color: "#B87514",
            pointerEvents: "none",
            display: "flex",
          }}
        >
          <SearchIcon />
        </span>
        <input
          ref={inputRef}
          type="search"
          placeholder="Buscar pedido…"
          onKeyDown={handleSearch}
          aria-label="Buscar pedido"
          style={{
            width: 180,
            padding: "0.35rem 0.75rem 0.35rem 1.875rem",
            borderRadius: "0.5rem",
            border: "1.5px solid rgba(184,117,20,0.18)",
            background: "rgba(255,255,255,0.62)",
            color: "#2C1E11",
            fontSize: "0.8rem",
            outline: "none",
            transition: "border-color 180ms ease, box-shadow 180ms ease",
          }}
          onFocus={(e) => {
            e.target.style.borderColor = "rgba(212,175,55,0.6)";
            e.target.style.boxShadow = "0 0 0 3px rgba(212,175,55,0.1)";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "rgba(184,117,20,0.18)";
            e.target.style.boxShadow = "none";
          }}
        />
      </div>

      {/* Notifications (visual) */}
      <button
        className="admin-header-notifications"
        aria-label="Notificaciones"
        title="Notificaciones (próximamente)"
        style={{
          width: 34,
          height: 34,
          borderRadius: "0.5rem",
          border: "1px solid rgba(184,117,20,0.15)",
          background: "rgba(255,255,255,0.55)",
          color: "#6F5635",
          cursor: "default",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          position: "relative",
        }}
      >
        <BellIcon />
      </button>

      {/* Admin avatar */}
      <div
        className="admin-header-avatar"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.45rem",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            background: "linear-gradient(135deg, rgba(212,175,55,0.25) 0%, rgba(184,117,20,0.18) 100%)",
            border: "1.5px solid rgba(212,175,55,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "0.75rem",
            fontWeight: 700,
            color: "#B87514",
            flexShrink: 0,
          }}
        >
          A
        </div>
        <span
          style={{
            fontSize: "0.78rem",
            fontWeight: 600,
            color: "#6F5635",
          }}
          className="admin-header-name"
        >
          Admin
        </span>
      </div>
    </header>
  );
}
