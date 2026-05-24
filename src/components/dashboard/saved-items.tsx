const SAVED_ITEMS = [
  {
    name: "Velas de Cera de Abeja",
    category: "Accesorios",
    price: "$28.00",
    color: "#B89A60",
    bgGradient: "linear-gradient(145deg, rgba(255,252,240,0.8) 0%, rgba(210,192,140,0.9) 100%)",
  },
  {
    name: "Honey Dipper",
    category: "Accesorios",
    price: "$18.00",
    color: "#8B5E3C",
    bgGradient: "linear-gradient(145deg, rgba(220,180,130,0.6) 0%, rgba(100,62,28,0.92) 100%)",
  },
  {
    name: "Honey Gift Box",
    category: "Regalos",
    price: "$65.00",
    color: "#D4AF37",
    bgGradient: "linear-gradient(145deg, rgba(255,240,180,0.7) 0%, rgba(160,120,20,0.92) 100%)",
  },
] as const;

function HeartFilledIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="0" aria-hidden>
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

function CartPlusIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      <line x1="19" y1="3" x2="19" y2="9" /><line x1="16" y1="6" x2="22" y2="6" />
    </svg>
  );
}

export default function SavedItems() {
  return (
    <div
      id="guardados"
      className="glass-panel rounded-2xl p-6 flex flex-col gap-5"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2
            className="text-base font-semibold"
            style={{ fontFamily: "var(--font-playfair)", color: "#2C1E11" }}
          >
            Artículos guardados
          </h2>
          <div className="gold-divider mt-1.5" style={{ maxWidth: 80 }} />
        </div>
        <a
          href="/tienda"
          className="text-[10px] uppercase tracking-[0.2em]"
          style={{ color: "#B87514" }}
        >
          Explorar más
        </a>
      </div>

      {/* Items grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {SAVED_ITEMS.map((item) => (
          <div
            key={item.name}
            className="rounded-xl p-4 flex flex-col gap-3 relative"
            style={{
              background: "rgba(255,255,255,0.5)",
              border: "1px solid rgba(212,175,55,0.18)",
            }}
          >
            {/* Remove favorite button */}
            <button
              aria-label={`Quitar ${item.name} de guardados`}
              className="absolute top-3 right-3 p-1 rounded-full transition-colors duration-200"
              style={{ color: "#D4AF37" }}
            >
              <HeartFilledIcon />
            </button>

            {/* Product visual */}
            <div
              aria-hidden
              style={{
                width: 44,
                height: 52,
                borderRadius: "6px 6px 14px 14px",
                background: item.bgGradient,
                boxShadow: `0 4px 12px ${item.color}44, 0 0 0 1px rgba(212,175,55,0.18)`,
              }}
            />

            {/* Info */}
            <div className="flex flex-col gap-0.5">
              <p
                className="text-sm font-semibold leading-snug pr-4"
                style={{ fontFamily: "var(--font-playfair)", color: "#2C1E11" }}
              >
                {item.name}
              </p>
              <p className="text-[9px] uppercase tracking-[0.18em]" style={{ color: "#B87514" }}>
                {item.category}
              </p>
            </div>

            {/* Price + CTA */}
            <div className="flex items-center justify-between mt-auto">
              <span
                className="font-bold"
                style={{ fontFamily: "var(--font-playfair)", color: "#D4AF37", fontSize: "1rem" }}
              >
                {item.price}
              </span>
              <button
                aria-label={`Agregar ${item.name} al carrito`}
                className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.14em] px-2.5 py-1.5 rounded-lg transition-all duration-200"
                style={{
                  background: "rgba(212,175,55,0.12)",
                  color: "#B87514",
                  border: "1px solid rgba(212,175,55,0.25)",
                }}
              >
                <CartPlusIcon />
                Añadir
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
