import type { Product, ProductColorScheme, ProductVisual } from "@/types/product";

/* ── Color configurations ───────────────────────────────── */

interface ColorConfig {
  fill: string;
  fillDeep: string;
  glass: string;
  lid: string;
  glow: string;
  labelText: string;
  meniscus: string;
}

const COLOR_CONFIGS: Record<ProductColorScheme, ColorConfig> = {
  amber: {
    fill:      "linear-gradient(180deg, rgba(229,169,59,0.88) 0%, rgba(184,117,20,0.98) 100%)",
    fillDeep:  "rgba(229,169,59,0.85)",
    glass:     "linear-gradient(145deg, rgba(255,247,223,0.55) 0%, rgba(229,169,59,0.22) 40%, rgba(184,117,20,0.4) 100%)",
    lid:       "linear-gradient(135deg, #8B6B3D 0%, #2C1E11 100%)",
    glow:      "rgba(229,169,59,0.4)",
    labelText: "#B87514",
    meniscus:  "rgba(229,169,59,0.82)",
  },
  pale: {
    fill:      "linear-gradient(180deg, rgba(240,220,130,0.85) 0%, rgba(200,175,80,0.96) 100%)",
    fillDeep:  "rgba(240,220,130,0.82)",
    glass:     "linear-gradient(145deg, rgba(255,253,230,0.65) 0%, rgba(240,220,130,0.22) 40%, rgba(200,175,80,0.35) 100%)",
    lid:       "linear-gradient(135deg, #9B8B50 0%, #5A4A25 100%)",
    glow:      "rgba(240,220,130,0.38)",
    labelText: "#7A6030",
    meniscus:  "rgba(240,220,130,0.78)",
  },
  dark: {
    fill:      "linear-gradient(180deg, rgba(140,80,30,0.88) 0%, rgba(70,35,10,0.98) 100%)",
    fillDeep:  "rgba(140,80,30,0.85)",
    glass:     "linear-gradient(145deg, rgba(200,150,80,0.3) 0%, rgba(140,80,30,0.2) 40%, rgba(70,35,10,0.5) 100%)",
    lid:       "linear-gradient(135deg, #3A2010 0%, #1A0A04 100%)",
    glow:      "rgba(140,80,30,0.38)",
    labelText: "#6F5635",
    meniscus:  "rgba(140,80,30,0.78)",
  },
  cream: {
    fill:      "linear-gradient(180deg, rgba(240,228,185,0.88) 0%, rgba(210,192,140,0.96) 100%)",
    fillDeep:  "rgba(240,228,185,0.85)",
    glass:     "linear-gradient(145deg, rgba(255,252,240,0.65) 0%, rgba(240,228,185,0.22) 40%, rgba(210,192,140,0.35) 100%)",
    lid:       "linear-gradient(135deg, #A09060 0%, #5A4A30 100%)",
    glow:      "rgba(240,228,185,0.38)",
    labelText: "#8B7040",
    meniscus:  "rgba(240,228,185,0.78)",
  },
  gold: {
    fill:      "linear-gradient(180deg, rgba(212,175,55,0.88) 0%, rgba(160,120,20,0.98) 100%)",
    fillDeep:  "rgba(212,175,55,0.85)",
    glass:     "linear-gradient(145deg, rgba(255,240,180,0.55) 0%, rgba(212,175,55,0.22) 40%, rgba(160,120,20,0.4) 100%)",
    lid:       "linear-gradient(135deg, #C4A020 0%, #6A5010 100%)",
    glow:      "rgba(212,175,55,0.45)",
    labelText: "#8A6A10",
    meniscus:  "rgba(212,175,55,0.82)",
  },
  herb: {
    fill:      "linear-gradient(180deg, rgba(200,168,48,0.88) 0%, rgba(148,114,20,0.98) 100%)",
    fillDeep:  "rgba(200,168,48,0.85)",
    glass:     "linear-gradient(145deg, rgba(240,245,220,0.55) 0%, rgba(200,168,48,0.2) 40%, rgba(148,114,20,0.38) 100%)",
    lid:       "linear-gradient(135deg, #7A6A30 0%, #2E2810 100%)",
    glow:      "rgba(200,168,48,0.38)",
    labelText: "#7A6420",
    meniscus:  "rgba(200,168,48,0.78)",
  },
  floral: {
    fill:      "linear-gradient(180deg, rgba(215,178,110,0.88) 0%, rgba(170,128,60,0.98) 100%)",
    fillDeep:  "rgba(215,178,110,0.85)",
    glass:     "linear-gradient(145deg, rgba(250,240,235,0.6) 0%, rgba(215,178,110,0.2) 40%, rgba(170,128,60,0.35) 100%)",
    lid:       "linear-gradient(135deg, #907860 0%, #40281A 100%)",
    glow:      "rgba(215,178,110,0.38)",
    labelText: "#8A6040",
    meniscus:  "rgba(215,178,110,0.78)",
  },
  wood: {
    fill:      "linear-gradient(180deg, rgba(160,110,60,0.85) 0%, rgba(100,62,28,0.96) 100%)",
    fillDeep:  "rgba(160,110,60,0.8)",
    glass:     "linear-gradient(145deg, rgba(220,180,130,0.4) 0%, rgba(160,110,60,0.22) 40%, rgba(100,62,28,0.4) 100%)",
    lid:       "linear-gradient(135deg, #7A5030 0%, #2C1A0A 100%)",
    glow:      "rgba(160,110,60,0.38)",
    labelText: "#7A5030",
    meniscus:  "rgba(160,110,60,0.75)",
  },
};

/* ── Shared pedestal / shadow ───────────────────────────── */

function Pedestal({ glow }: { glow: string }) {
  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        bottom: 12,
        left: "15%",
        right: "15%",
        height: 18,
        background: `radial-gradient(ellipse at center, ${glow} 0%, transparent 70%)`,
        filter: "blur(5px)",
      }}
    />
  );
}

/* ── Visual: Jar ────────────────────────────────────────── */

function JarVisual({ scheme }: { scheme: ProductColorScheme }) {
  const c = COLOR_CONFIGS[scheme];
  return (
    <div style={{ width: 88, height: 126, position: "relative" }}>
      {/* Ambient glow */}
      <div aria-hidden style={{ position: "absolute", inset: "10% -45%", background: `radial-gradient(ellipse, ${c.glow} 0%, transparent 70%)`, filter: "blur(18px)", pointerEvents: "none" }} />

      {/* Lid */}
      <div aria-hidden style={{ position: "absolute", top: 0, left: "11%", right: "11%", height: 9, background: c.lid, borderRadius: "5px 5px 2px 2px", boxShadow: "0 4px 10px rgba(44,30,17,0.5)" }} />

      {/* Lid band */}
      <div aria-hidden style={{ position: "absolute", top: 7, left: "8%", right: "8%", height: 5, background: "rgba(44,30,17,0.3)", borderRadius: "1px" }} />

      {/* Body */}
      <div aria-hidden style={{ position: "absolute", top: 11, left: 0, right: 0, bottom: 10, borderRadius: "7px 7px 18px 18px", overflow: "hidden", background: c.glass, boxShadow: `0 14px 36px ${c.glow}, 0 0 0 1px rgba(212,175,55,0.22), inset 2px 0 10px rgba(255,255,255,0.14), inset -3px 0 14px rgba(184,117,20,0.12)` }}>
        {/* Fill */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "70%", background: c.fill }} />
        {/* Meniscus */}
        <div style={{ position: "absolute", bottom: "70%", left: "-5%", right: "-5%", height: 7, background: c.meniscus, borderRadius: "0 0 50% 50% / 0 0 100% 100%", transform: "translateY(3px)" }} />
        {/* Highlight */}
        <div style={{ position: "absolute", top: "4%", left: "8%", width: "11%", height: "52%", background: "linear-gradient(180deg, rgba(255,255,255,0.52) 0%, rgba(255,255,255,0.08) 70%, transparent 100%)", borderRadius: "4px" }} />
        {/* Label */}
        <div style={{ position: "absolute", top: "22%", left: "14%", right: "14%", height: "30%", background: "rgba(244,239,227,0.92)", borderRadius: "3px", border: `1px solid ${c.labelText}44`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 3 }}>
          <div style={{ width: "55%", height: 1, background: `linear-gradient(90deg, transparent, ${c.labelText}, transparent)` }} />
          <span style={{ fontFamily: "var(--font-playfair)", fontSize: 7, fontWeight: 700, color: "#2C1E11", letterSpacing: "0.1em" }}>HONEY</span>
          <div style={{ width: "55%", height: 1, background: `linear-gradient(90deg, transparent, ${c.labelText}, transparent)` }} />
        </div>
        {/* Bottom shadow */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "14%", background: "linear-gradient(0deg, rgba(44,30,17,0.22) 0%, transparent 100%)" }} />
      </div>

      <Pedestal glow={c.glow} />
    </div>
  );
}

/* ── Visual: Dropper bottle ─────────────────────────────── */

function DropperVisual({ scheme }: { scheme: ProductColorScheme }) {
  const c = COLOR_CONFIGS[scheme];
  return (
    <div style={{ width: 52, height: 148, position: "relative" }}>
      {/* Glow */}
      <div aria-hidden style={{ position: "absolute", inset: "10% -60%", background: `radial-gradient(ellipse, ${c.glow} 0%, transparent 70%)`, filter: "blur(16px)", pointerEvents: "none" }} />

      {/* Rubber bulb (top) */}
      <div aria-hidden style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 22, height: 22, borderRadius: "50%", background: "linear-gradient(135deg, #3A2010 0%, #1A0A04 100%)", boxShadow: "0 4px 12px rgba(44,30,17,0.5)" }} />

      {/* Glass neck */}
      <div aria-hidden style={{ position: "absolute", top: 18, left: "50%", transform: "translateX(-50%)", width: 8, height: 16, background: c.glass, borderRadius: "2px", border: "1px solid rgba(255,255,255,0.15)" }} />

      {/* Shoulder taper */}
      <div aria-hidden style={{ position: "absolute", top: 30, left: "50%", transform: "translateX(-50%)", width: 0, height: 0, borderLeft: "12px solid transparent", borderRight: "12px solid transparent", borderBottom: `10px solid ${scheme === "dark" ? "rgba(100,55,20,0.9)" : "rgba(180,140,60,0.8)"}` }} />

      {/* Body */}
      <div aria-hidden style={{ position: "absolute", top: 38, left: 0, right: 0, bottom: 12, borderRadius: "4px 4px 12px 12px", overflow: "hidden", background: c.glass, boxShadow: `0 12px 28px ${c.glow}, 0 0 0 1px rgba(212,175,55,0.2), inset 2px 0 8px rgba(255,255,255,0.12)` }}>
        {/* Fill */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "65%", background: c.fill }} />
        {/* Highlight */}
        <div style={{ position: "absolute", top: "5%", left: "10%", width: "15%", height: "50%", background: "linear-gradient(180deg, rgba(255,255,255,0.45) 0%, transparent 100%)", borderRadius: "3px" }} />
        {/* Label */}
        <div style={{ position: "absolute", top: "15%", left: "10%", right: "10%", height: "26%", background: "rgba(244,239,227,0.9)", borderRadius: "2px", border: `1px solid ${c.labelText}44`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontFamily: "var(--font-playfair)", fontSize: 6, fontWeight: 700, color: "#2C1E11", letterSpacing: "0.08em" }}>HONEY</span>
        </div>
      </div>

      <Pedestal glow={c.glow} />
    </div>
  );
}

/* ── Visual: Wide pot (Jalea Real) ──────────────────────── */

function PotVisual({ scheme }: { scheme: ProductColorScheme }) {
  const c = COLOR_CONFIGS[scheme];
  return (
    <div style={{ width: 110, height: 86, position: "relative" }}>
      {/* Glow */}
      <div aria-hidden style={{ position: "absolute", inset: "0% -25%", background: `radial-gradient(ellipse, ${c.glow} 0%, transparent 70%)`, filter: "blur(18px)", pointerEvents: "none" }} />

      {/* Lid (slightly wider) */}
      <div aria-hidden style={{ position: "absolute", top: 0, left: "-3%", right: "-3%", height: 16, background: c.lid, borderRadius: "8px 8px 3px 3px", boxShadow: "0 4px 14px rgba(44,30,17,0.45)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        {/* Lid grip */}
        <div style={{ width: 24, height: 6, background: "rgba(255,255,255,0.12)", borderRadius: "2px", border: "1px solid rgba(255,255,255,0.2)" }} />
      </div>

      {/* Body */}
      <div aria-hidden style={{ position: "absolute", top: 14, left: 0, right: 0, bottom: 12, borderRadius: "3px 3px 16px 16px", overflow: "hidden", background: c.glass, boxShadow: `0 12px 32px ${c.glow}, 0 0 0 1px rgba(212,175,55,0.22), inset 2px 0 10px rgba(255,255,255,0.12)` }}>
        {/* Fill */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "55%", background: c.fill }} />
        {/* Highlight */}
        <div style={{ position: "absolute", top: "8%", left: "5%", width: "8%", height: "55%", background: "linear-gradient(180deg, rgba(255,255,255,0.45) 0%, transparent 100%)", borderRadius: "2px" }} />
        {/* Label */}
        <div style={{ position: "absolute", top: "12%", left: "12%", right: "12%", height: "38%", background: "rgba(244,239,227,0.9)", borderRadius: "3px", border: `1px solid ${c.labelText}44`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2 }}>
          <span style={{ fontFamily: "var(--font-playfair)", fontSize: 7, fontWeight: 700, color: "#2C1E11", letterSpacing: "0.12em" }}>HONEY</span>
          <span style={{ fontSize: 6, color: "#6F5635", letterSpacing: "0.15em" }}>JALEA REAL</span>
        </div>
      </div>

      <Pedestal glow={c.glow} />
    </div>
  );
}

/* ── Visual: Gift box ───────────────────────────────────── */

function GiftboxVisual({ scheme }: { scheme: ProductColorScheme }) {
  const c = COLOR_CONFIGS[scheme];
  return (
    <div style={{ width: 120, height: 106, position: "relative" }}>
      {/* Glow */}
      <div aria-hidden style={{ position: "absolute", inset: "-10% -20%", background: `radial-gradient(ellipse, ${c.glow} 0%, transparent 65%)`, filter: "blur(20px)", pointerEvents: "none" }} />

      {/* Lid */}
      <div aria-hidden style={{ position: "absolute", top: 0, left: 0, right: 0, height: 38, background: c.lid, borderRadius: "8px 8px 2px 2px", boxShadow: "0 6px 16px rgba(44,30,17,0.4)", overflow: "hidden" }}>
        {/* Lid highlight */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(255,255,255,0.12) 0%, transparent 100%)" }} />
        {/* Ribbon horizontal stripe on lid */}
        <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: 8, transform: "translateY(-50%)", background: "rgba(255,255,255,0.18)", borderTop: "1px solid rgba(255,255,255,0.25)", borderBottom: "1px solid rgba(255,255,255,0.25)" }} />
        {/* Bow center */}
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 18, height: 18, borderRadius: "50%", background: "rgba(255,255,255,0.22)", border: "1px solid rgba(255,255,255,0.35)" }} />
      </div>

      {/* Box base */}
      <div aria-hidden style={{ position: "absolute", top: 36, left: 3, right: 3, bottom: 12, background: "linear-gradient(160deg, rgba(244,239,227,0.9) 0%, rgba(234,227,210,0.95) 100%)", borderRadius: "2px 2px 10px 10px", boxShadow: `0 10px 28px ${c.glow}, 0 0 0 1px rgba(212,175,55,0.3)`, overflow: "hidden" }}>
        {/* Ribbon vertical stripe on base */}
        <div style={{ position: "absolute", top: 0, bottom: 0, left: "50%", transform: "translateX(-50%)", width: 8, background: c.glass, opacity: 0.5 }} />
        {/* Label */}
        <div style={{ position: "absolute", top: "18%", left: "14%", right: "14%", bottom: "18%", background: "rgba(255,255,255,0.6)", borderRadius: "3px", border: `1px solid ${c.labelText}33`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 3 }}>
          <div style={{ width: "60%", height: 1, background: `linear-gradient(90deg, transparent, ${c.labelText}, transparent)` }} />
          <span style={{ fontFamily: "var(--font-playfair)", fontSize: 8, fontWeight: 700, color: "#2C1E11", letterSpacing: "0.12em" }}>HONEY</span>
          <span style={{ fontSize: 6, color: "#6F5635", letterSpacing: "0.15em" }}>GIFT SET</span>
          <div style={{ width: "60%", height: 1, background: `linear-gradient(90deg, transparent, ${c.labelText}, transparent)` }} />
        </div>
      </div>

      <Pedestal glow={c.glow} />
    </div>
  );
}

/* ── Visual: Honey dipper ───────────────────────────────── */

function DipperVisual({ scheme }: { scheme: ProductColorScheme }) {
  const c = COLOR_CONFIGS[scheme];
  return (
    <div style={{ width: 54, height: 152, position: "relative" }}>
      {/* Glow */}
      <div aria-hidden style={{ position: "absolute", inset: "10% -50%", background: `radial-gradient(ellipse, ${c.glow} 0%, transparent 70%)`, filter: "blur(16px)", pointerEvents: "none" }} />

      {/* Hanging loop at top */}
      <div aria-hidden style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 12, height: 10, border: `2px solid ${scheme === "wood" ? "#7A5030" : "#B87514"}`, borderRadius: "50% 50% 0 0", borderBottom: "none" }} />

      {/* Handle */}
      <div aria-hidden style={{ position: "absolute", top: 8, left: "50%", transform: "translateX(-50%)", width: 9, bottom: 38, background: c.fill, borderRadius: "4px", boxShadow: `0 4px 16px ${c.glow}, inset 1px 0 3px rgba(255,255,255,0.2)` }} />

      {/* Honey drip on handle */}
      <div aria-hidden style={{ position: "absolute", top: 80, left: "50%", transform: "translateX(-50%)", width: 11, height: 16, background: "rgba(229,169,59,0.7)", borderRadius: "0 0 6px 6px" }} />

      {/* Dipper head (round grooved end) */}
      <div aria-hidden style={{ position: "absolute", bottom: 12, left: "50%", transform: "translateX(-50%)", width: 40, height: 40, borderRadius: "50%", background: c.fill, boxShadow: `0 8px 20px ${c.glow}, 0 0 0 1px rgba(255,255,255,0.1)`, overflow: "hidden" }}>
        {/* Groove rings */}
        {[20, 34, 48, 62].map((pct) => (
          <div key={pct} style={{ position: "absolute", top: `${pct}%`, left: "5%", right: "5%", height: 1, background: "rgba(44,30,17,0.25)" }} />
        ))}
        {/* Highlight */}
        <div style={{ position: "absolute", top: "10%", left: "12%", width: "20%", height: "40%", background: "rgba(255,255,255,0.3)", borderRadius: "50%" }} />
      </div>

      <Pedestal glow={c.glow} />
    </div>
  );
}

/* ── Visual renderer ────────────────────────────────────── */

function ProductVisualRenderer({
  visual,
  colorScheme,
}: {
  visual: ProductVisual;
  colorScheme: ProductColorScheme;
}) {
  switch (visual) {
    case "jar":     return <JarVisual scheme={colorScheme} />;
    case "dropper": return <DropperVisual scheme={colorScheme} />;
    case "pot":     return <PotVisual scheme={colorScheme} />;
    case "giftbox": return <GiftboxVisual scheme={colorScheme} />;
    case "dipper":  return <DipperVisual scheme={colorScheme} />;
  }
}

/* ── Heart / wishlist icon ──────────────────────────────── */

function HeartIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

/* ── Product Card ───────────────────────────────────────── */

export default function ProductCard({ product }: { product: Product }) {
  const { name, category, size, price, badge, description, visual, colorScheme } = product;

  return (
    <article className="product-card rounded-2xl flex flex-col overflow-hidden group">

      {/* Visual area */}
      <div
        className="relative flex items-center justify-center"
        style={{
          height: 200,
          background: "linear-gradient(160deg, rgba(255,255,255,0.35) 0%, rgba(234,227,210,0.6) 100%)",
          borderBottom: "1px solid rgba(255,255,255,0.5)",
        }}
      >
        {/* Badge */}
        <div
          className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[9px] font-medium uppercase tracking-[0.22em]"
          style={{
            background: "linear-gradient(135deg, rgba(212,175,55,0.2) 0%, rgba(184,117,20,0.15) 100%)",
            color: "#B87514",
            border: "1px solid rgba(212,175,55,0.4)",
            backdropFilter: "blur(4px)",
          }}
        >
          {badge}
        </div>

        {/* Wishlist button (visual only) */}
        <button
          aria-label={`Añadir ${name} a favoritos`}
          className="absolute top-3 right-3 p-2 rounded-full transition-all duration-300"
          style={{
            background: "rgba(255,255,255,0.5)",
            border: "1px solid rgba(255,255,255,0.7)",
            color: "#6F5635",
          }}
          tabIndex={-1}
        >
          <HeartIcon />
        </button>

        {/* Product visual */}
        <div className="flex items-center justify-center" style={{ height: 160 }}>
          <ProductVisualRenderer visual={visual} colorScheme={colorScheme} />
        </div>
      </div>

      {/* Info area */}
      <div className="flex flex-col flex-1 p-5 gap-3">

        {/* Meta */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[9px] uppercase tracking-[0.28em]" style={{ color: "#B87514" }}>
              {category}
            </span>
            <span style={{ color: "rgba(184,117,20,0.4)", fontSize: 10 }}>·</span>
            <span className="text-[9px] uppercase tracking-[0.2em]" style={{ color: "#6F5635" }}>
              {size}
            </span>
          </div>
          <h3
            className="text-base font-semibold leading-snug"
            style={{ fontFamily: "var(--font-playfair)", color: "#2C1E11" }}
          >
            {name}
          </h3>
        </div>

        {/* Description */}
        <p className="text-xs leading-relaxed flex-1" style={{ color: "#6F5635" }}>
          {description}
        </p>

        {/* Divider */}
        <div className="gold-divider" />

        {/* Price + CTA */}
        <div className="flex items-center justify-between gap-2">
          <span
            className="text-lg font-bold"
            style={{ fontFamily: "var(--font-playfair)", color: "#D4AF37" }}
          >
            ${price.toFixed(2)}
          </span>

          <button
            className="px-4 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all duration-300"
            style={{
              background: "linear-gradient(135deg, #D4AF37 0%, #E5A93B 50%, #B87514 100%)",
              color: "#2C1E11",
              boxShadow: "0 3px 12px rgba(212,175,55,0.28)",
            }}
            aria-label={`Ver producto: ${name}`}
          >
            Ver producto
          </button>
        </div>
      </div>
    </article>
  );
}
