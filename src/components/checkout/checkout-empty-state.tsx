function EmptyCartIcon() {
  return (
    <svg
      width="64"
      height="64"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="0.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}

export default function CheckoutEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[55vh] px-6 text-center gap-7">
      <div style={{ color: "rgba(184,117,20,0.25)" }}>
        <EmptyCartIcon />
      </div>

      <div className="gold-divider w-16" />

      <div className="flex flex-col gap-2.5">
        <h2
          className="text-2xl font-semibold"
          style={{ fontFamily: "var(--font-playfair)", color: "#2C1E11" }}
        >
          Tu carrito está vacío
        </h2>
        <p className="text-sm leading-relaxed max-w-xs" style={{ color: "#6F5635" }}>
          Añade productos a tu carrito antes de continuar al checkout.
        </p>
      </div>

      <a href="/tienda" className="premium-button text-sm">
        Explorar colección
      </a>

      <p
        className="text-[9px] uppercase tracking-[0.28em]"
        style={{ color: "rgba(184,117,20,0.35)" }}
      >
        Pureza · Origen · Excelencia
      </p>
    </div>
  );
}
