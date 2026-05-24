import type { CartItem, ProductColorScheme } from "@/types/product";

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

interface OrderSummaryProps {
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
}

export default function OrderSummary({ items, subtotal, shipping, total }: OrderSummaryProps) {
  return (
    <div className="glass-panel rounded-2xl p-6 flex flex-col gap-5">
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

      {/* Items */}
      <div className="flex flex-col gap-0">
        {items.map((item) => (
          <div
            key={item.productId}
            className="flex items-center gap-3 py-3"
            style={{ borderBottom: "1px solid rgba(212,175,55,0.15)" }}
          >
            {/* Color dot */}
            <div
              aria-hidden
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: SCHEME_DOT[item.colorScheme],
                flexShrink: 0,
                boxShadow: `0 0 6px ${SCHEME_DOT[item.colorScheme]}66`,
              }}
            />

            {/* Name + size */}
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

        <div className="flex items-center justify-between">
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

      {/* Trust badges */}
      <div
        className="flex flex-col gap-2 pt-2"
        style={{ borderTop: "1px solid rgba(212,175,55,0.15)" }}
      >
        {[
          { icon: "🔒", label: "Pago 100% seguro" },
          { icon: "↩", label: "Devolución en 30 días" },
          { icon: "✦", label: "Envío premium cuidado" },
        ].map(({ icon, label }) => (
          <div key={label} className="flex items-center gap-2.5">
            <span className="text-xs" style={{ color: "#D4AF37" }}>
              {icon}
            </span>
            <span className="text-[10px] uppercase tracking-[0.18em]" style={{ color: "rgba(111,86,53,0.65)" }}>
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
