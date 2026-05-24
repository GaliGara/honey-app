export type ProductCategory =
  | "Miel cruda"
  | "Miel monofloral"
  | "Productos de la colmena"
  | "Regalos"
  | "Accesorios";

export type ProductVisual = "jar" | "dropper" | "pot" | "giftbox" | "dipper";

/** Controls whether the card shows the CSS 2.5D visual or a real photo.
 *  Defaults to "css" when absent. */
export type ProductVisualMode = "css" | "image";

export type ProductColorScheme =
  | "amber"
  | "pale"
  | "dark"
  | "cream"
  | "gold"
  | "herb"
  | "floral"
  | "wood";

export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  category: ProductCategory;
  price: number;
  size: string;
  quantity: number;
  visual: ProductVisual;
  colorScheme: ProductColorScheme;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: ProductCategory;
  price: number;
  size: string;
  badge: string;
  description: string;
  visual: ProductVisual;
  colorScheme: ProductColorScheme;
  isNew?: boolean;
  isBestSeller?: boolean;
  featured?: boolean;
  /* ── Future image support ──────────────────────────────────
   * When real product photos are ready:
   *   1. Place image at   public/products/<slug>.webp
   *   2. Set  imageUrl:   "/products/<slug>.webp"
   *   3. Set  imageAlt:   "descriptive alt text"
   *   4. Set  visualMode: "image"
   * ProductCard will switch to photo mode while keeping the
   * premium stage, glow, pedestal and float animation.
   * ─────────────────────────────────────────────────────── */
  imageUrl?: string;
  imageAlt?: string;
  visualMode?: ProductVisualMode;
}
