import type { StoreCategory } from "@/constants/products";
import { STORE_CATEGORIES } from "@/constants/products";

interface ProductSidebarProps {
  activeCategory: StoreCategory;
  onCategoryChange: (category: StoreCategory) => void;
  categoryCounts: Record<string, number>;
}

function ChevronIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

export default function ProductSidebar({
  activeCategory,
  onCategoryChange,
  categoryCounts,
}: ProductSidebarProps) {
  return (
    <aside className="w-56">

      {/* Section label */}
      <div className="mb-5">
        <span
          className="text-[9px] uppercase tracking-[0.4em]"
          style={{ color: "#B87514" }}
        >
          Colección
        </span>
        <h2
          className="text-lg font-semibold mt-0.5"
          style={{ fontFamily: "var(--font-playfair)", color: "#2C1E11" }}
        >
          Categorías
        </h2>
        <div className="gold-divider mt-3" />
      </div>

      {/* Category list */}
      <nav className="flex flex-col gap-0.5">
        {STORE_CATEGORIES.map((category) => {
          const isActive = activeCategory === category;
          const count = categoryCounts[category] ?? 0;

          return (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm text-left transition-all duration-300 w-full group/item"
              style={
                isActive
                  ? {
                      background: "linear-gradient(135deg, rgba(212,175,55,0.18) 0%, rgba(184,117,20,0.12) 100%)",
                      color: "#2C1E11",
                      fontWeight: 600,
                      border: "1px solid rgba(212,175,55,0.4)",
                    }
                  : {
                      color: "#6F5635",
                      border: "1px solid transparent",
                    }
              }
            >
              <div className="flex items-center gap-2">
                {/* Active indicator */}
                <div
                  style={{
                    width: 4,
                    height: 4,
                    borderRadius: "50%",
                    flexShrink: 0,
                    background: isActive
                      ? "linear-gradient(135deg, #D4AF37, #B87514)"
                      : "rgba(184,117,20,0.25)",
                    transition: "all 300ms",
                  }}
                />
                <span className="text-sm leading-none">{category}</span>
              </div>

              <div className="flex items-center gap-1.5">
                {/* Count badge */}
                <span
                  className="text-[9px] px-1.5 py-0.5 rounded-full"
                  style={{
                    background: isActive
                      ? "rgba(212,175,55,0.25)"
                      : "rgba(184,117,20,0.1)",
                    color: isActive ? "#B87514" : "#6F5635",
                  }}
                >
                  {count}
                </span>
                {isActive && (
                  <span style={{ color: "#D4AF37" }}>
                    <ChevronIcon />
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </nav>

      {/* Divider */}
      <div className="gold-divider mt-5 mb-5" />

      {/* Decorative note */}
      <div
        className="glass-panel rounded-xl p-4 text-center"
        style={{ background: "rgba(255,255,255,0.3)" }}
      >
        <p
          className="text-xs leading-relaxed"
          style={{ fontFamily: "var(--font-playfair)", color: "#6F5635", fontStyle: "italic" }}
        >
          &ldquo;Miel de origen, lujo en cada gota.&rdquo;
        </p>
      </div>
    </aside>
  );
}
