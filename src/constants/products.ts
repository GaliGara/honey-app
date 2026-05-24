import type { Product } from "@/types/product";

export const PRODUCTS: Product[] = [
  {
    id: "1",
    slug: "miel-multifloral",
    name: "Miel Multifloral",
    category: "Miel cruda",
    price: 24,
    size: "500g",
    badge: "Más vendido",
    description: "Miel cruda de flores silvestres, equilibrada y aromática.",
    visual: "jar",
    colorScheme: "amber",
    isBestSeller: true,
  },
  {
    id: "2",
    slug: "miel-de-azahar",
    name: "Miel de Azahar",
    category: "Miel monofloral",
    price: 28,
    size: "500g",
    badge: "Aroma floral",
    description: "Miel suave y luminosa con notas cítricas delicadas.",
    visual: "jar",
    colorScheme: "pale",
  },
  {
    id: "3",
    slug: "propoleo",
    name: "Propóleo",
    category: "Productos de la colmena",
    price: 22,
    size: "30ml",
    badge: "Apoyo natural",
    description: "Extracto natural de propóleo seleccionado.",
    visual: "dropper",
    colorScheme: "dark",
  },
  {
    id: "4",
    slug: "jalea-real",
    name: "Jalea Real",
    category: "Productos de la colmena",
    price: 32,
    size: "20g",
    badge: "Nutrición real",
    description: "Jalea real fresca de alta calidad.",
    visual: "pot",
    colorScheme: "cream",
  },
  {
    id: "5",
    slug: "golden-hive-set",
    name: "The Golden Hive Set",
    category: "Regalos",
    price: 75,
    size: "Set",
    badge: "Regalo premium",
    description: "Selección elegante de productos de la colmena.",
    visual: "giftbox",
    colorScheme: "gold",
    featured: true,
  },
  {
    id: "6",
    slug: "miel-de-romero",
    name: "Miel de Romero",
    category: "Miel monofloral",
    price: 26,
    size: "500g",
    badge: "Nuevo",
    description: "Miel aromática con notas herbales suaves y elegantes.",
    visual: "jar",
    colorScheme: "herb",
    isNew: true,
  },
  {
    id: "7",
    slug: "miel-de-lavanda",
    name: "Miel de Lavanda",
    category: "Miel monofloral",
    price: 29,
    size: "500g",
    badge: "Edición especial",
    description: "Miel floral delicada con un perfil aromático relajante.",
    visual: "jar",
    colorScheme: "floral",
  },
  {
    id: "8",
    slug: "honey-dipper",
    name: "Honey Dipper",
    category: "Accesorios",
    price: 12,
    size: "Olivo",
    badge: "Artesanal",
    description: "Cuchara mielera de madera para servir con elegancia.",
    visual: "dipper",
    colorScheme: "wood",
  },
];

export const STORE_CATEGORIES = [
  "Todos los productos",
  "Miel cruda",
  "Miel monofloral",
  "Productos de la colmena",
  "Regalos",
  "Accesorios",
  "Nuevos",
  "Más vendidos",
] as const;

export type StoreCategory = (typeof STORE_CATEGORIES)[number];

export function filterProducts(
  products: Product[],
  category: StoreCategory,
): Product[] {
  if (category === "Todos los productos") return products;
  if (category === "Nuevos") return products.filter((p) => p.isNew === true);
  if (category === "Más vendidos") return products.filter((p) => p.isBestSeller === true);
  return products.filter((p) => p.category === category);
}
