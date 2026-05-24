import type { CartItem, ProductColorScheme } from "@/types/product";

/* ── Color dot map ───────────────────────────────────────── */

const SCHEME_DOT: Record<ProductColorScheme, string> = {
  amber:  "#E5A93B",
  pale:   "#D4AF37",
  dark:   "#6F5635",
  cream:  "#B89A60",
  gold:   "#D4AF37",
  herb:   "#7A9E5A",
  floral: "#C4879C",
  wood:   "#8B5E3C",
};

/* ── Trust badge icons ───────────────────────────────────── */

function ShieldIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function WalletIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <line x1="2" y1="10" x2="22" y2="10" />
      <circle cx="17" cy="15" r="1" />
    </svg>
  );
}

function BoxIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <line x1="12" y1="22" x2="12" y2="12" />
      <path d="M3.27 6.96L12 12.01l8.73-5.05" />
    </svg>
  );
}

const TRUST_ITEMS = [
  { Icon: ShieldIcon, label: "Pago seguro" },
  { Icon: WalletIcon, label: "Sin comisión de pasarela" },
  { Icon: BoxIcon,    label: "Envío con cuidado" },
] as const;

/* ── Props ───────────────────────────────────────────────── */

interface OrderSummaryProps {
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
}

/* ─────────────────────────────────────────────────────────── */

export default function OrderSummary({
  items,
  subtotal,
  shipping,
  total,
}: OrderSummaryProps) {
  return (
    <div className="glass-panel rounded-2xl p-6 flex flex-col gap-5 w-full">

      {/* Header */}
      <div>
        <h2
          className="text-lg font-bold"
          style={{ fontFamily: "var(--font-playfair)", color: "#2C1E11" }}
        >
          Resumen del pedido
        </h2>
        <div className="gold-divider mt-2" style={{ maxWidth: 120 }} />
      </div>

      {/* Item list */}
      <div className="flex flex-col">
        {items.map((item) => (
          <div
            key={item.productId}
            className="flex items-center gap-3 py-3"
            style={{ borderBottom: "1px solid rgba(212,175,55,0.13)" }}
          >
            {/* Color scheme dot */}
            <div
              aria-hidden
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: SCHEME_DOT[item.colorScheme],
                flexShrink: 0,
                boxShadow: `0 0 7px ${SCHEME_DOT[item.colorScheme]}60`,
              }}
            />

            {/* Name + meta */}
            <div className="flex-1 min-w-0">
              <p
                className="text-sm font-semibold truncate"
                style={{ fontFamily: "var(--font-playfair)", color: "#2C1E11" }}
              >
                {item.name}
              </p>
              <p
                className="text-[9px] uppercase tracking-[0.2em] mt-0.5"
                style={{ color: "#B87514" }}
              >
                {item.size} · ×{item.quantity}
              </p>
            </div>

            {/* Line total */}
            <span
              className="text-sm font-semibold shrink-0"
              style={{ fontFamily: "var(--font-playfair)", color: "#2C1E11" }}
            >
              ${(item.price * item.quantity).toFixed(2)}
            </span>
          </div>
        ))}
      </div>

      {/* Price breakdown */}
      <div className="flex flex-col gap-2.5 pt-1">
        <div className="flex items-center justify-between text-sm">
          <span style={{ color: "#6F5635" }}>Subtotal</span>
          <span style={{ color: "#2C1E11" }}>${subtotal.toFixed(2)}</span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span style={{ color: "#6F5635" }}>Envío estimado</span>
          <span style={{ color: "#2C1E11" }}>${shipping.toFixed(2)}</span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span style={{ color: "#6F5635" }}>Impuestos</span>
          <span className="text-xs italic" style={{ color: "rgba(111,86,53,0.6)" }}>
            Incluidos
          </span>
        </div>

        <div className="gold-divider my-0.5" />

        {/* Total row — subtle golden tint */}
        <div
          className="flex items-center justify-between rounded-xl"
          style={{
            background:
              "linear-gradient(135deg, rgba(212,175,55,0.09) 0%, rgba(184,117,20,0.05) 100%)",
            border: "1px solid rgba(212,175,55,0.16)",
            padding: "10px 12px",
          }}
        >
          <span
            className="font-semibold"
            style={{ fontFamily: "var(--font-playfair)", color: "#2C1E11" }}
          >
            Total
          </span>
          <span
            className="text-xl font-bold"
            style={{ fontFamily: "var(--font-playfair)", color: "#D4AF37" }}
          >
            ${total.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Trust badges + confirmation note */}
      <div
        className="flex flex-col gap-2 pt-2"
        style={{ borderTop: "1px solid rgba(212,175,55,0.13)" }}
      >
        {TRUST_ITEMS.map(({ Icon, label }) => (
          <div key={label} className="flex items-center gap-2.5">
            <span style={{ color: "#D4AF37", flexShrink: 0 }}>
              <Icon />
            </span>
            <span
              className="text-[10px] uppercase tracking-[0.18em]"
              style={{ color: "rgba(111,86,53,0.65)" }}
            >
              {label}
            </span>
          </div>
        ))}

        {/* Confirmation note */}
        <p
          className="text-[10px] leading-relaxed mt-1"
          style={{ color: "rgba(111,86,53,0.50)", fontStyle: "italic" }}
        >
          Tu pedido se confirmará según el método de pago seleccionado.
        </p>
      </div>
    </div>
  );
}
