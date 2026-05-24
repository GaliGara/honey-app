"use client";

import { useState, useMemo } from "react";
import type { Product } from "@/types/product";
import { STORE_CATEGORIES, filterProducts, type StoreCategory } from "@/constants/products";
import ProductSidebar from "./product-sidebar";
import ProductGrid from "./product-grid";

function SearchIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="11" cy="11" r="8" />
      <path d="M21 21l-4.35-4.35" />
    </svg>
  );
}

function SortIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <line x1="8"  y1="6"  x2="21" y2="6"  />
      <line x1="8"  y1="12" x2="21" y2="12" />
      <line x1="8"  y1="18" x2="21" y2="18" />
      <line x1="3"  y1="6"  x2="3.01" y2="6"  />
      <line x1="3"  y1="12" x2="3.01" y2="12" />
      <line x1="3"  y1="18" x2="3.01" y2="18" />
    </svg>
  );
}

interface ProductFiltersProps {
  products: Product[];
}

export default function ProductFilters({ products }: ProductFiltersProps) {
  const [activeCategory, setActiveCategory] = useState<StoreCategory>(
    "Todos los productos",
  );

  const filteredProducts = useMemo(
    () => filterProducts(products, activeCategory),
    [products, activeCategory],
  );

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const cat of STORE_CATEGORIES) {
      counts[cat] = filterProducts(products, cat).length;
    }
    return counts;
  }, [products]);

  return (
    <div className="flex gap-8 lg:gap-10">

      {/* ── Desktop sidebar ── */}
      <div className="hidden lg:block shrink-0" style={{ position: "sticky", top: "6rem", alignSelf: "start" }}>
        <ProductSidebar
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          categoryCounts={categoryCounts}
        />
      </div>

      {/* ── Main content ── */}
      <div className="flex-1 min-w-0">

        {/* Mobile: horizontal category pills */}
        <div className="lg:hidden flex gap-2 overflow-x-auto pb-3 mb-5" style={{ scrollbarWidth: "none" }}>
          {STORE_CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className="shrink-0 px-4 py-2 rounded-full text-xs font-medium tracking-wide transition-all duration-300"
                style={
                  isActive
                    ? {
                        background: "linear-gradient(135deg, #D4AF37 0%, #B87514 100%)",
                        color: "#2C1E11",
                        boxShadow: "0 3px 12px rgba(212,175,55,0.35)",
                      }
                    : {
                        background: "rgba(255,255,255,0.5)",
                        color: "#6F5635",
                        border: "1px solid rgba(184,117,20,0.25)",
                      }
                }
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Toolbar: results count + search + sort */}
        <div className="flex items-center justify-between gap-4 mb-7 flex-wrap">

          {/* Results count */}
          <p className="text-sm" style={{ color: "#6F5635" }}>
            <span
              className="text-lg font-semibold"
              style={{ fontFamily: "var(--font-playfair)", color: "#2C1E11" }}
            >
              {filteredProducts.length}
            </span>
            {" "}
            {filteredProducts.length === 1 ? "producto" : "productos"}
            {activeCategory !== "Todos los productos" && (
              <>
                {" "}en{" "}
                <span style={{ color: "#B87514", fontWeight: 500 }}>
                  {activeCategory}
                </span>
              </>
            )}
          </p>

          <div className="flex items-center gap-3">

            {/* Search (visual only) */}
            <label
              className="flex items-center gap-2 px-3 py-2 rounded-full"
              style={{
                background: "rgba(255,255,255,0.55)",
                border: "1px solid rgba(184,117,20,0.2)",
                color: "#6F5635",
              }}
            >
              <SearchIcon />
              <input
                type="text"
                placeholder="Buscar..."
                readOnly
                className="bg-transparent text-xs outline-none w-24"
                style={{ color: "#6F5635" }}
                aria-label="Buscar productos (próximamente)"
              />
            </label>

            {/* Sort (visual only) */}
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-full"
              style={{
                background: "rgba(255,255,255,0.55)",
                border: "1px solid rgba(184,117,20,0.2)",
                color: "#6F5635",
              }}
            >
              <SortIcon />
              <span className="text-xs" style={{ color: "#6F5635" }}>
                Relevancia
              </span>
            </div>
          </div>
        </div>

        {/* Grid or empty state */}
        {filteredProducts.length > 0 ? (
          <ProductGrid products={filteredProducts} />
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div
              className="hex-shape mb-6"
              style={{ width: 60, height: 60, background: "rgba(212,175,55,0.12)" }}
              aria-hidden
            />
            <p
              className="text-xl mb-2"
              style={{ fontFamily: "var(--font-playfair)", color: "#2C1E11" }}
            >
              Sin productos en esta categoría
            </p>
            <p className="text-sm mb-8" style={{ color: "#6F5635" }}>
              Explora otras categorías o vuelve a la colección completa.
            </p>
            <button
              onClick={() => setActiveCategory("Todos los productos")}
              className="premium-button text-sm"
            >
              Ver todos los productos
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
