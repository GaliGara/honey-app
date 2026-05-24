"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import type { Product, ProductColorScheme, ProductVisual } from "@/types/product";
import { useCartStore } from "@/store/use-cart";

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

/* ── Float timing presets — prevents synchronised bobbing ── */
const FLOAT_TIMINGS = [
  { dur: "6.0s", delay: "0s"    },
  { dur: "6.8s", delay: "-1.8s" },
  { dur: "5.6s", delay: "-3.2s" },
  { dur: "7.2s", delay: "-0.7s" },
  { dur: "6.2s", delay: "-2.4s" },
  { dur: "5.8s", delay: "-1.1s" },
  { dur: "7.0s", delay: "-3.8s" },
  { dur: "6.5s", delay: "-2.0s" },
] as const;

/* ════════════════════════════════════════════════════════
   SHARED PEDESTAL — 2.5D base for all product visuals
   ════════════════════════════════════════════════════════ */
function Pedestal({ glow }: { glow: string }) {
  return (
    <>
      {/* Oval platform top face */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          bottom: 8,
          left: "22%",
          right: "22%",
          height: 10,
          background:
            "linear-gradient(180deg, rgba(212,175,55,0.30) 0%, rgba(184,117,20,0.08) 100%)",
          borderRadius: "50%",
          border: "1px solid rgba(212,175,55,0.24)",
          boxShadow: "0 2px 8px rgba(184,117,20,0.16)",
        }}
      />
      {/* Ambient floor glow */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          bottom: 0,
          left: "8%",
          right: "8%",
          height: 24,
          background: `radial-gradient(ellipse at center, ${glow} 0%, transparent 70%)`,
          filter: "blur(10px)",
        }}
      />
    </>
  );
}

/* ════════════════════════════════════════════════════════
   PRODUCT VISUALS
   ════════════════════════════════════════════════════════ */

/* ── Jar (honey) ─────────────────────────────────────────── */
function JarVisual({ scheme }: { scheme: ProductColorScheme }) {
  const c = COLOR_CONFIGS[scheme];
  return (
    <div style={{ width: 100, height: 140, position: "relative" }}>
      {/* Ambient glow */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: "10% -45%",
          background: `radial-gradient(ellipse, ${c.glow} 0%, transparent 70%)`,
          filter: "blur(22px)",
          pointerEvents: "none",
        }}
      />

      {/* Lid body */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: 0,
          left: "10%",
          right: "10%",
          height: 12,
          background: c.lid,
          borderRadius: "6px 6px 2px 2px",
          boxShadow:
            "0 4px 14px rgba(44,30,17,0.55), inset 0 1px 0 rgba(255,220,140,0.18)",
        }}
      />
      {/* Gold collar ring */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: 10,
          left: "8%",
          right: "8%",
          height: 5,
          background: "linear-gradient(180deg, #E8C84A 0%, #A07808 100%)",
          boxShadow: "0 1px 5px rgba(184,117,20,0.45)",
        }}
      />
      {/* Neck band */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: 14,
          left: "6%",
          right: "6%",
          height: 5,
          background: "linear-gradient(180deg, #4A2E14 0%, #2C1A08 100%)",
          borderRadius: "1px",
        }}
      />

      {/* Jar body */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: 18,
          left: 0,
          right: 0,
          bottom: 12,
          borderRadius: "8px 8px 24px 24px",
          overflow: "hidden",
          background: c.glass,
          boxShadow: [
            `0 20px 50px ${c.glow}`,
            "0 0 0 1px rgba(212,175,55,0.28)",
            "inset 4px 0 16px rgba(255,255,255,0.20)",
            "inset -5px 0 18px rgba(184,117,20,0.09)",
            "inset 0 14px 28px rgba(255,252,232,0.24)",
            "inset 0 -14px 32px rgba(25,8,0,0.22)",
          ].join(", "),
        }}
      >
        {/* Honey fill */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "70%", background: c.fill }} />
        {/* Surface glow below meniscus */}
        <div style={{ position: "absolute", bottom: "68%", left: 0, right: 0, height: "8%", background: "linear-gradient(180deg, transparent, rgba(255,210,60,0.26))" }} />
        {/* Meniscus */}
        <div style={{
          position: "absolute", bottom: "70%", left: "-4%", right: "-4%",
          height: 8, background: c.meniscus,
          borderRadius: "0 0 50% 50% / 0 0 100% 100%",
          transform: "translateY(3px)",
          boxShadow: "inset 0 2px 6px rgba(255,230,100,0.50)",
        }} />
        {/* Primary glass highlight */}
        <div style={{
          position: "absolute", top: "3%", left: "7%", width: "10%", height: "55%",
          background: "linear-gradient(180deg, rgba(255,255,255,0.65) 0%, rgba(255,255,255,0.12) 65%, transparent 100%)",
          borderRadius: "5px", filter: "blur(0.5px)",
        }} />
        {/* Thin secondary highlight */}
        <div style={{
          position: "absolute", top: "5%", left: "21%", width: "3%", height: "35%",
          background: "linear-gradient(180deg, rgba(255,255,255,0.35) 0%, transparent 100%)",
          borderRadius: "2px",
        }} />
        {/* Label */}
        <div style={{
          position: "absolute", top: "20%", left: "13%", right: "13%", height: "32%",
          background: "linear-gradient(180deg, rgba(253,249,241,0.98) 0%, rgba(246,241,230,0.96) 100%)",
          borderRadius: "4px",
          border: `0.5px solid ${c.labelText}44`,
          boxShadow: "0 1px 6px rgba(184,117,20,0.10), inset 0 1px 0 rgba(255,255,255,0.90)",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 3,
        }}>
          <div style={{ width: "55%", height: 1, background: `linear-gradient(90deg, transparent, ${c.labelText}, transparent)` }} />
          <span style={{ fontFamily: "var(--font-playfair)", fontSize: 7.5, fontWeight: 700, color: "#2C1E11", letterSpacing: "0.14em" }}>HONEY</span>
          <div style={{ width: "55%", height: 1, background: `linear-gradient(90deg, transparent, ${c.labelText}, transparent)` }} />
        </div>
        {/* Bottom depth */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "12%", background: "linear-gradient(0deg, rgba(25,8,0,0.28) 0%, transparent 100%)" }} />
      </div>

      <Pedestal glow={c.glow} />
    </div>
  );
}

/* ── Dropper bottle ──────────────────────────────────────── */
function DropperVisual({ scheme }: { scheme: ProductColorScheme }) {
  const c = COLOR_CONFIGS[scheme];
  return (
    <div style={{ width: 52, height: 148, position: "relative" }}>
      <div aria-hidden style={{ position: "absolute", inset: "10% -60%", background: `radial-gradient(ellipse, ${c.glow} 0%, transparent 70%)`, filter: "blur(16px)", pointerEvents: "none" }} />
      <div aria-hidden style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 22, height: 22, borderRadius: "50%", background: "linear-gradient(135deg, #3A2010 0%, #1A0A04 100%)", boxShadow: "0 4px 12px rgba(44,30,17,0.5)" }} />
      <div aria-hidden style={{ position: "absolute", top: 18, left: "50%", transform: "translateX(-50%)", width: 8, height: 16, background: c.glass, borderRadius: "2px", border: "1px solid rgba(255,255,255,0.15)" }} />
      <div aria-hidden style={{ position: "absolute", top: 30, left: "50%", transform: "translateX(-50%)", width: 0, height: 0, borderLeft: "12px solid transparent", borderRight: "12px solid transparent", borderBottom: `10px solid ${scheme === "dark" ? "rgba(100,55,20,0.9)" : "rgba(180,140,60,0.8)"}` }} />
      <div aria-hidden style={{ position: "absolute", top: 38, left: 0, right: 0, bottom: 12, borderRadius: "4px 4px 12px 12px", overflow: "hidden", background: c.glass, boxShadow: `0 12px 28px ${c.glow}, 0 0 0 1px rgba(212,175,55,0.2), inset 2px 0 8px rgba(255,255,255,0.12)` }}>
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "65%", background: c.fill }} />
        <div style={{ position: "absolute", top: "5%", left: "10%", width: "15%", height: "50%", background: "linear-gradient(180deg, rgba(255,255,255,0.45) 0%, transparent 100%)", borderRadius: "3px" }} />
        <div style={{ position: "absolute", top: "15%", left: "10%", right: "10%", height: "26%", background: "rgba(244,239,227,0.9)", borderRadius: "2px", border: `1px solid ${c.labelText}44`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontFamily: "var(--font-playfair)", fontSize: 6, fontWeight: 700, color: "#2C1E11", letterSpacing: "0.08em" }}>HONEY</span>
        </div>
      </div>
      <Pedestal glow={c.glow} />
    </div>
  );
}

/* ── Wide pot (Jalea Real) ───────────────────────────────── */
function PotVisual({ scheme }: { scheme: ProductColorScheme }) {
  const c = COLOR_CONFIGS[scheme];
  return (
    <div style={{ width: 110, height: 86, position: "relative" }}>
      <div aria-hidden style={{ position: "absolute", inset: "0% -25%", background: `radial-gradient(ellipse, ${c.glow} 0%, transparent 70%)`, filter: "blur(18px)", pointerEvents: "none" }} />
      <div aria-hidden style={{ position: "absolute", top: 0, left: "-3%", right: "-3%", height: 16, background: c.lid, borderRadius: "8px 8px 3px 3px", boxShadow: "0 4px 14px rgba(44,30,17,0.45)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 24, height: 6, background: "rgba(255,255,255,0.12)", borderRadius: "2px", border: "1px solid rgba(255,255,255,0.2)" }} />
      </div>
      <div aria-hidden style={{ position: "absolute", top: 14, left: 0, right: 0, bottom: 12, borderRadius: "3px 3px 16px 16px", overflow: "hidden", background: c.glass, boxShadow: `0 12px 32px ${c.glow}, 0 0 0 1px rgba(212,175,55,0.22), inset 2px 0 10px rgba(255,255,255,0.12)` }}>
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "55%", background: c.fill }} />
        <div style={{ position: "absolute", top: "8%", left: "5%", width: "8%", height: "55%", background: "linear-gradient(180deg, rgba(255,255,255,0.45) 0%, transparent 100%)", borderRadius: "2px" }} />
        <div style={{ position: "absolute", top: "12%", left: "12%", right: "12%", height: "38%", background: "rgba(244,239,227,0.9)", borderRadius: "3px", border: `1px solid ${c.labelText}44`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2 }}>
          <span style={{ fontFamily: "var(--font-playfair)", fontSize: 7, fontWeight: 700, color: "#2C1E11", letterSpacing: "0.12em" }}>HONEY</span>
          <span style={{ fontSize: 6, color: "#6F5635", letterSpacing: "0.15em" }}>JALEA REAL</span>
        </div>
      </div>
      <Pedestal glow={c.glow} />
    </div>
  );
}

/* ── Gift box ────────────────────────────────────────────── */
function GiftboxVisual({ scheme }: { scheme: ProductColorScheme }) {
  const c = COLOR_CONFIGS[scheme];
  return (
    <div style={{ width: 120, height: 106, position: "relative" }}>
      <div aria-hidden style={{ position: "absolute", inset: "-10% -20%", background: `radial-gradient(ellipse, ${c.glow} 0%, transparent 65%)`, filter: "blur(20px)", pointerEvents: "none" }} />
      <div aria-hidden style={{ position: "absolute", top: 0, left: 0, right: 0, height: 38, background: c.lid, borderRadius: "8px 8px 2px 2px", boxShadow: "0 6px 16px rgba(44,30,17,0.4)", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(255,255,255,0.12) 0%, transparent 100%)" }} />
        <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: 8, transform: "translateY(-50%)", background: "rgba(255,255,255,0.18)", borderTop: "1px solid rgba(255,255,255,0.25)", borderBottom: "1px solid rgba(255,255,255,0.25)" }} />
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 18, height: 18, borderRadius: "50%", background: "rgba(255,255,255,0.22)", border: "1px solid rgba(255,255,255,0.35)" }} />
      </div>
      <div aria-hidden style={{ position: "absolute", top: 36, left: 3, right: 3, bottom: 12, background: "linear-gradient(160deg, rgba(244,239,227,0.9) 0%, rgba(234,227,210,0.95) 100%)", borderRadius: "2px 2px 10px 10px", boxShadow: `0 10px 28px ${c.glow}, 0 0 0 1px rgba(212,175,55,0.3)`, overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, bottom: 0, left: "50%", transform: "translateX(-50%)", width: 8, background: c.glass, opacity: 0.5 }} />
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

/* ── Honey dipper ────────────────────────────────────────── */
function DipperVisual({ scheme }: { scheme: ProductColorScheme }) {
  const c = COLOR_CONFIGS[scheme];
  return (
    <div style={{ width: 54, height: 152, position: "relative" }}>
      <div aria-hidden style={{ position: "absolute", inset: "10% -50%", background: `radial-gradient(ellipse, ${c.glow} 0%, transparent 70%)`, filter: "blur(16px)", pointerEvents: "none" }} />
      <div aria-hidden style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 12, height: 10, border: `2px solid ${scheme === "wood" ? "#7A5030" : "#B87514"}`, borderRadius: "50% 50% 0 0", borderBottom: "none" }} />
      <div aria-hidden style={{ position: "absolute", top: 8, left: "50%", transform: "translateX(-50%)", width: 9, bottom: 38, background: c.fill, borderRadius: "4px", boxShadow: `0 4px 16px ${c.glow}, inset 1px 0 3px rgba(255,255,255,0.2)` }} />
      <div aria-hidden style={{ position: "absolute", top: 80, left: "50%", transform: "translateX(-50%)", width: 11, height: 16, background: "rgba(229,169,59,0.7)", borderRadius: "0 0 6px 6px" }} />
      <div aria-hidden style={{ position: "absolute", bottom: 12, left: "50%", transform: "translateX(-50%)", width: 40, height: 40, borderRadius: "50%", background: c.fill, boxShadow: `0 8px 20px ${c.glow}, 0 0 0 1px rgba(255,255,255,0.1)`, overflow: "hidden" }}>
        {[20, 34, 48, 62].map((pct) => (
          <div key={pct} style={{ position: "absolute", top: `${pct}%`, left: "5%", right: "5%", height: 1, background: "rgba(44,30,17,0.25)" }} />
        ))}
        <div style={{ position: "absolute", top: "10%", left: "12%", width: "20%", height: "40%", background: "rgba(255,255,255,0.3)", borderRadius: "50%" }} />
      </div>
      <Pedestal glow={c.glow} />
    </div>
  );
}

/* ── Image visual — for future real product photos ───────── */
/**
 * Used when `product.visualMode === "image"` and `product.imageUrl` is set.
 * Wraps the photo in the same premium stage as the CSS visuals:
 * ambient glow, drop-shadow, and pedestal. Float animation lives on the
 * outer wrapper, so it works identically with photos or CSS art.
 */
function ImageVisual({
  src,
  alt,
  glow,
}: {
  src: string;
  alt: string;
  glow: string;
}) {
  return (
    <div style={{ width: 150, height: 150, position: "relative" }}>
      {/* Ambient glow behind photo */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: "-25%",
          background: `radial-gradient(ellipse, ${glow} 0%, transparent 70%)`,
          filter: "blur(22px)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      {/* Photo — contained, with warm drop-shadow */}
      <div style={{ position: "relative", width: 150, height: 150, zIndex: 1 }}>
        <Image
          src={src}
          alt={alt}
          fill
          style={{
            objectFit: "contain",
            filter: `drop-shadow(0 8px 20px ${glow}) drop-shadow(0 2px 6px rgba(44,20,5,0.18))`,
          }}
          sizes="150px"
        />
      </div>
      {/* Pedestal stays for visual continuity */}
      <Pedestal glow={glow} />
    </div>
  );
}

/* ── Visual renderer ─────────────────────────────────────── */
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

/* ── Icons ───────────────────────────────────────────────── */
function HeartIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

function CartPlusIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M12 11v6M9 14h6" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

/* ════════════════════════════════════════════════════════
   PRODUCT CARD
   ════════════════════════════════════════════════════════ */
export default function ProductCard({
  product,
  index = 0,
}: {
  product: Product;
  /** Grid position — used for staggered entrance and float phase */
  index?: number;
}) {
  const {
    name, category, size, price, badge, description,
    visual, colorScheme,
    imageUrl, imageAlt, visualMode,
  } = product;
  const c   = COLOR_CONFIGS[colorScheme];
  const ft  = FLOAT_TIMINGS[index % FLOAT_TIMINGS.length];
  const usePhoto = visualMode === "image" && !!imageUrl;

  const addItem = useCartStore((s) => s.addItem);
  const [justAdded, setJustAdded] = useState(false);

  const handleAddToCart = () => {
    addItem(product);
    setJustAdded(true);
  };

  useEffect(() => {
    if (!justAdded) return;
    const timer = setTimeout(() => setJustAdded(false), 1800);
    return () => clearTimeout(timer);
  }, [justAdded]);

  return (
    <article
      className="product-card card-rise rounded-3xl flex flex-col overflow-hidden group"
      style={{ ["--card-delay" as string]: `${index * 0.07}s` }}
    >

      {/* ── Visual stage ── */}
      <div
        className="relative flex items-center justify-center overflow-hidden"
        style={{
          height: 210,
          /* Warm stage floor: scheme-specific glow from below */
          background: [
            `radial-gradient(ellipse 75% 55% at 50% 100%, ${c.glow} 0%, transparent 65%)`,
            "linear-gradient(160deg, rgba(255,255,255,0.38) 0%, rgba(234,227,210,0.55) 100%)",
          ].join(", "),
          borderBottom: "1px solid rgba(255,255,255,0.55)",
        }}
      >
        {/* Badge */}
        <div
          className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[9px] font-medium uppercase tracking-[0.24em]"
          style={{
            background:
              "linear-gradient(135deg, rgba(212,175,55,0.22) 0%, rgba(184,117,20,0.14) 100%)",
            color: "#B87514",
            border: "1px solid rgba(212,175,55,0.42)",
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
            boxShadow: "0 1px 6px rgba(184,117,20,0.10)",
          }}
        >
          {badge}
        </div>

        {/* Wishlist button */}
        <button
          aria-label={`Añadir ${name} a favoritos`}
          className="absolute top-3 right-3 p-2 rounded-full transition-all duration-300"
          style={{
            background: "rgba(255,255,255,0.55)",
            border: "1px solid rgba(255,255,255,0.72)",
            color: "#A08050",
            backdropFilter: "blur(4px)",
            WebkitBackdropFilter: "blur(4px)",
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#D4AF37"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#A08050"; }}
          tabIndex={-1}
        >
          <HeartIcon />
        </button>

        {/* Product visual — floats independently (CSS art or real photo) */}
        <div
          className="product-float flex items-center justify-center transition-transform duration-500 group-hover:scale-[1.04]"
          style={{
            height: 168,
            ["--pf-dur" as string]: ft.dur,
            ["--pf-delay" as string]: ft.delay,
          }}
        >
          {usePhoto ? (
            <ImageVisual
              src={imageUrl!}
              alt={imageAlt ?? name}
              glow={c.glow}
            />
          ) : (
            <ProductVisualRenderer visual={visual} colorScheme={colorScheme} />
          )}
        </div>

        {/* Hover glow overlay on visual stage */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse 60% 50% at 50% 80%, ${c.glow.replace("0.4", "0.22").replace("0.38", "0.18").replace("0.45", "0.24")} 0%, transparent 70%)`,
          }}
        />
      </div>

      {/* ── Info area ── */}
      <div className="flex flex-col flex-1 p-5 gap-3">

        {/* Meta */}
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[9px] uppercase tracking-[0.30em]" style={{ color: "#B87514" }}>
              {category}
            </span>
            <span style={{ color: "rgba(184,117,20,0.35)", fontSize: 10 }}>·</span>
            <span className="text-[9px] uppercase tracking-[0.22em]" style={{ color: "#6F5635" }}>
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
        <div className="flex items-center justify-between gap-3">
          <span
            className="text-xl font-bold"
            style={{ fontFamily: "var(--font-playfair)", color: "#D4AF37" }}
          >
            ${price.toFixed(2)}
          </span>

          <button
            onClick={handleAddToCart}
            disabled={justAdded}
            className="flex items-center gap-1.5 px-5 py-2 rounded-full text-xs font-medium tracking-wide transition-all duration-300"
            style={{
              background: justAdded
                ? "linear-gradient(135deg, #4A8A4A 0%, #3A6A3A 100%)"
                : "linear-gradient(135deg, #D4AF37 0%, #E5A93B 50%, #B87514 100%)",
              color: justAdded ? "#fff" : "#2C1E11",
              boxShadow: justAdded
                ? "0 4px 14px rgba(74,138,74,0.30)"
                : "0 4px 16px rgba(212,175,55,0.32)",
            }}
            aria-label={
              justAdded ? `${name} añadido al carrito` : `Agregar ${name} al carrito`
            }
          >
            {justAdded ? <CheckIcon /> : <CartPlusIcon />}
            {justAdded ? "¡Añadido!" : "Agregar"}
          </button>
        </div>
      </div>
    </article>
  );
}
