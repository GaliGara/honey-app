/* ── Icons ─────────────────────────────────────────────────── */

function IconGrid() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}
function IconBag() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}
function IconStar() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}
function IconRefresh() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" />
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
    </svg>
  );
}
function IconUser() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
    </svg>
  );
}
function IconHeart() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}
function IconBookmark() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  );
}
function IconLogOut() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

/* ── Data ───────────────────────────────────────────────────── */

const NAV_ITEMS = [
  { label: "Resumen",       href: "#resumen",     Icon: IconGrid },
  { label: "Mis pedidos",   href: "#pedidos",     Icon: IconBag },
  { label: "Recompensas",   href: "#recompensas", Icon: IconStar },
  { label: "Suscripción",   href: "#suscripcion", Icon: IconRefresh },
  { label: "Mi perfil",     href: "#perfil",      Icon: IconUser },
  { label: "Guardados",     href: "#guardados",   Icon: IconBookmark },
  { label: "Favoritos",     href: "#favoritos",   Icon: IconHeart },
] as const;

/* ── Component ──────────────────────────────────────────────── */

export default function DashboardSidebar() {
  return (
    <aside className="glass-panel rounded-2xl p-5 flex flex-col gap-5 lg:sticky lg:top-28">

      {/* ── User profile ── */}
      <div
        className="flex flex-col items-center gap-3 pb-5"
        style={{ borderBottom: "1px solid rgba(212,175,55,0.2)" }}
      >
        {/* Avatar */}
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #D4AF37 0%, #E5A93B 60%, #B87514 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 8px 24px rgba(184,117,20,0.35), 0 0 0 3px rgba(212,175,55,0.18)",
            flexShrink: 0,
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-playfair)",
              color: "#2C1E11",
              fontSize: "1.4rem",
              fontWeight: 700,
              letterSpacing: "-0.02em",
            }}
          >
            IR
          </span>
        </div>

        {/* Info */}
        <div className="text-center flex flex-col gap-1">
          <p
            className="font-semibold"
            style={{ fontFamily: "var(--font-playfair)", color: "#2C1E11", fontSize: "1rem" }}
          >
            Isabella Rose
          </p>
          <p className="text-xs" style={{ color: "#6F5635" }}>
            isabella.rose@email.com
          </p>
          <div className="flex justify-center mt-1">
            <span
              className="text-[9px] uppercase tracking-[0.2em] px-3 py-1 rounded-full"
              style={{
                background: "linear-gradient(135deg, #D4AF37, #B87514)",
                color: "#2C1E11",
                fontWeight: 600,
              }}
            >
              Gold Beekeeper
            </span>
          </div>
        </div>
      </div>

      {/* ── Navigation ── */}
      {/* Mobile: horizontal scroll; Desktop: vertical stack */}
      <nav
        className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-x-visible pb-1 lg:pb-0"
        style={{ scrollbarWidth: "none" }}
      >
        {NAV_ITEMS.map(({ label, href, Icon }) => (
          <a
            key={label}
            href={href}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors duration-200 shrink-0 lg:shrink"
            style={{ color: "#6F5635" }}
          >
            <span
              className="flex items-center justify-center rounded-lg shrink-0"
              style={{
                width: 30,
                height: 30,
                background: "rgba(212,175,55,0.1)",
                color: "#B87514",
              }}
            >
              <Icon />
            </span>
            <span className="text-sm font-medium whitespace-nowrap lg:whitespace-normal">
              {label}
            </span>
          </a>
        ))}
      </nav>

      {/* ── Sign out ── */}
      <div
        className="pt-4"
        style={{ borderTop: "1px solid rgba(212,175,55,0.15)" }}
      >
        <button
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-colors duration-200 text-sm"
          style={{ color: "rgba(111,86,53,0.6)" }}
        >
          <IconLogOut />
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
