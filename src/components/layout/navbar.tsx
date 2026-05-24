"use client";

import { useState } from "react";
import { siteConfig } from "@/constants/site";

const NAV_LINKS = [
  { label: "Tienda",      href: "/tienda" },
  { label: "Origen",      href: "#" },
  { label: "Colecciones", href: "#" },
  { label: "Regalos",     href: "#" },
] as const;

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="11" cy="11" r="8" />
      <path d="M21 21l-4.35-4.35" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}

function HamburgerIcon({ open }: { open: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden>
      {open ? (
        <>
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </>
      ) : (
        <>
          <line x1="3" y1="7" x2="21" y2="7" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="17" x2="21" y2="17" />
        </>
      )}
    </svg>
  );
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 pt-4">
      <nav className="glass-panel rounded-2xl px-6 py-3.5">
        <div className="flex items-center justify-between gap-6">

          {/* Logo */}
          <a href="/" className="flex flex-col shrink-0">
            <span
              className="text-xl font-bold leading-none tracking-wide"
              style={{ fontFamily: "var(--font-playfair)", color: "#D4AF37" }}
            >
              {siteConfig.name}
            </span>
            <span
              className="hidden sm:block text-[9px] uppercase tracking-[0.28em] mt-0.5"
              style={{ color: "#6F5635" }}
            >
              {siteConfig.descriptor}
            </span>
          </a>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-7">
            {NAV_LINKS.map(({ label, href }) => (
              <a key={label} href={href} className="nav-link">
                {label}
              </a>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              className="p-2 rounded-full transition-colors duration-300"
              style={{ color: "#6F5635" }}
              aria-label="Buscar"
            >
              <SearchIcon />
            </button>

            <button
              className="hidden sm:flex p-2 rounded-full transition-colors duration-300"
              style={{ color: "#6F5635" }}
              aria-label="Mi cuenta"
            >
              <UserIcon />
            </button>

            <button
              className="flex items-center gap-2 ml-1 px-4 py-2 rounded-full text-sm font-medium tracking-wide transition-all duration-500"
              style={{
                background: "linear-gradient(135deg, #D4AF37 0%, #E5A93B 50%, #B87514 100%)",
                color: "#2C1E11",
                boxShadow: "0 4px 16px rgba(212,175,55,0.3), 0 1px 0 rgba(255,255,255,0.25) inset",
              }}
              aria-label="Carrito"
            >
              <CartIcon />
              <span className="hidden sm:inline">Carrito</span>
            </button>

            <button
              className="md:hidden p-2 rounded-full"
              style={{ color: "#6F5635" }}
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={menuOpen}
            >
              <HamburgerIcon open={menuOpen} />
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {menuOpen && (
          <div className="md:hidden mt-4 pt-4 flex flex-col gap-1" style={{ borderTop: "1px solid rgba(255,255,255,0.35)" }}>
            {NAV_LINKS.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                className="py-2.5 text-sm tracking-wide"
                style={{ color: "#6F5635" }}
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </a>
            ))}
          </div>
        )}
      </nav>
    </header>
  );
}
