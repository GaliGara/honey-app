export type ProductCategory =
  | "Miel cruda"
  | "Miel monofloral"
  | "Productos de la colmena"
  | "Regalos"
  | "Accesorios";

export type ProductVisual = "jar" | "dropper" | "pot" | "giftbox" | "dipper";

export type ProductColorScheme =
  | "amber"
  | "pale"
  | "dark"
  | "cream"
  | "gold"
  | "herb"
  | "floral"
  | "wood";

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
}
