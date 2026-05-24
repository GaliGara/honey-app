const FAVORITES = [
  {
    name: "Miel de Manuka",
    category: "Miel monofloral",
    description: "Propiedades antibacterianas únicas del árbol Manuka.",
    price: "$38.00",
    color: "#E5A93B",
    bgGradient: "linear-gradient(145deg, rgba(255,247,223,0.7) 0%, rgba(184,117,20,0.92) 100%)",
    badge: "Exclusiva",
  },
  {
    name: "Miel de Acacia",
    category: "Miel monofloral",
    description: "Sabor delicado y cristalización lenta. La más apreciada.",
    price: "$32.00",
    color: "#D4AF37",
    bgGradient: "linear-gradient(145deg, rgba(255,253,230,0.8) 0%, rgba(200,175,80,0.88) 100%)",
    badge: "Bestseller",
  },
  {
    name: "Panal Crudo",
    category: "Productos de la colmena",
    description: "Panal natural directo de la colmena, sin procesar.",
    price: "$45.00",
    color: "#B89A60",
    bgGradient: "linear-gradient(145deg, rgba(255,252,240,0.8) 0%, rgba(210,192,140,0.9) 100%)",
    badge: "Natural",
  },
] as const;

function HeartFilledIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="none" aria-hidden>
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

export default function FavoritesPreview() {
  return (
    <div
      id="favoritos"
      className="glass-panel rounded-2xl p-6 flex flex-col gap-5"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2
            className="text-base font-semibold"
            style={{ fontFamily: "var(--font-playfair)", color: "#2C1E11" }}
          >
            Productos favoritos
          </h2>
          <div className="gold-divider mt-1.5" style={{ maxWidth: 80 }} />
        </div>
        <a
          href="/tienda"
          className="text-[10px] uppercase tracking-[0.2em]"
          style={{ color: "#B87514" }}
        >
          Ver tienda
        </a>
      </div>

      {/* Favorites list */}
      <div className="flex flex-col gap-0">
        {FAVORITES.map((fav, i) => {
          const isLast = i === FAVORITES.length - 1;
          return (
            <div
              key={fav.name}
              className="flex items-center gap-4 py-4"
              style={!isLast ? { borderBottom: "1px solid rgba(212,175,55,0.14)" } : {}}
            >
              {/* Product visual mini */}
              <div
                aria-hidden
                style={{
                  width: 48,
                  height: 56,
                  borderRadius: "5px 5px 14px 14px",
                  background: fav.bgGradient,
                  boxShadow: `0 4px 12px ${fav.color}44, 0 0 0 1px rgba(212,175,55,0.18)`,
                  flexShrink: 0,
                }}
              />

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 flex-wrap">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p
                        className="text-sm font-semibold"
                        style={{ fontFamily: "var(--font-playfair)", color: "#2C1E11" }}
                      >
                        {fav.name}
                      </p>
                      <span
                        className="text-[8px] uppercase tracking-[0.16em] px-1.5 py-0.5 rounded-full"
                        style={{
                          background: "rgba(212,175,55,0.15)",
                          color: "#B87514",
                          border: "1px solid rgba(212,175,55,0.25)",
                        }}
                      >
                        {fav.badge}
                      </span>
                    </div>
                    <p
                      className="text-[9px] uppercase tracking-[0.18em] mt-0.5"
                      style={{ color: "#B87514" }}
                    >
                      {fav.category}
                    </p>
                    <p className="text-xs mt-1 leading-relaxed line-clamp-1" style={{ color: "rgba(111,86,53,0.7)" }}>
                      {fav.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Price + actions */}
              <div className="flex flex-col items-end gap-2 shrink-0">
                <span
                  className="font-bold"
                  style={{ fontFamily: "var(--font-playfair)", color: "#D4AF37", fontSize: "1rem" }}
                >
                  {fav.price}
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    aria-label={`Quitar ${fav.name} de favoritos`}
                    className="p-1.5 rounded-lg transition-colors duration-200"
                    style={{
                      color: "#D4AF37",
                      background: "rgba(212,175,55,0.12)",
                      border: "1px solid rgba(212,175,55,0.2)",
                    }}
                  >
                    <HeartFilledIcon />
                  </button>
                  <a
                    href="/tienda"
                    className="p-1.5 rounded-lg transition-all duration-200 flex items-center"
                    style={{
                      color: "#6F5635",
                      background: "rgba(255,255,255,0.6)",
                      border: "1px solid rgba(212,175,55,0.18)",
                    }}
                    aria-label={`Ver ${fav.name}`}
                  >
                    <ArrowRightIcon />
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom CTA */}
      <a href="/tienda" className="secondary-button text-xs text-center mt-1">
        Explorar colección completa
      </a>
    </div>
  );
}
