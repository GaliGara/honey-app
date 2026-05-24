"use client";

import type { CSSProperties } from "react";

/* ════════════════════════════════════════════════════════════
   PremiumHoneyVisual — 2.5D editorial composition
   Layers (back → front):
     0 · Ambient radial light
     1 · Far hex outlines
     2 · Mid hex fills (behind jar)
     3 · JAR — lid · body · honey · label · glass fx
     4 · Close hex fills (in front of jar)
     5 · Honey drops — SVG teardrops
     6 · Top atmospheric vignette
   ════════════════════════════════════════════════════════════ */

interface Props {
  /** Normalised mouse offset −0.5 … 0.5. 0 when idle. */
  mouseX: number;
  mouseY: number;
}

/* ── Parallax offset helper ──────────────────────────────── */
function pl(mx: number, my: number, s: number): CSSProperties {
  return {
    transform: `translate(${(mx * s).toFixed(2)}px, ${(my * s).toFixed(2)}px)`,
    willChange: "transform",
    /* Smooth, elastic easing — silky parallax feel */
    transition: "transform 0.65s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
  };
}

/* ── SVG Hex outline ─────────────────────────────────────── */
function HexOutline({
  size,
  stroke = "rgba(212,175,55,0.42)",
  sw = 1,
  style,
}: {
  size: number;
  stroke?: string;
  sw?: number;
  style?: CSSProperties;
}) {
  const w = size;
  const h = size * 0.866;
  const cx = w / 2;
  const cy = h / 2;
  const r = Math.min(cx, cy) - sw;
  const pts = Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI / 3) * i - Math.PI / 6;
    return `${(cx + r * Math.cos(a)).toFixed(2)},${(cy + r * Math.sin(a)).toFixed(2)}`;
  }).join(" ");
  return (
    <svg
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      style={{ display: "block", ...style }}
      aria-hidden
    >
      <polygon points={pts} fill="none" stroke={stroke} strokeWidth={sw} />
    </svg>
  );
}

/* ── Hex fill shape ──────────────────────────────────────── */
function HexFill({
  size, opacity, rotate, dur, delay, style,
}: {
  size: number; opacity: number; rotate: number;
  dur: string; delay: string; style: CSSProperties;
}) {
  return (
    <div
      aria-hidden
      className="hex-shape hex-drift"
      style={{
        position: "absolute",
        width: size,
        height: size,
        opacity,
        background:
          "linear-gradient(135deg, rgba(212,175,55,0.65) 0%, rgba(229,169,59,0.28) 100%)",
        ["--hr" as string]: `${rotate}deg`,
        ["--hd" as string]: dur,
        ["--hdelay" as string]: delay,
        ...style,
      }}
    />
  );
}

/* ── SVG Honey teardrop drop ─────────────────────────────── */
function HoneyDrop({
  dropId, w, h, delay, dur,
  swayDur = "4.2s", swayDelay = "0s", swayAmt = "1.4px",
  style,
}: {
  dropId: string;
  w: number; h: number;
  delay: string; dur: string;
  /** Lateral sway — each drop gets independent timing */
  swayDur?: string; swayDelay?: string; swayAmt?: string;
  style: CSSProperties;
}) {
  const gId = `hd-fill-${dropId}`;
  const sId = `hd-shine-${dropId}`;
  return (
    <div
      aria-hidden
      className="drop-bob"
      style={{
        position: "absolute",
        width: w,
        height: h,
        ["--db" as string]: dur,
        ["--dbdelay" as string]: delay,
        ...style,
      }}
    >
      {/* Inner wrapper: lateral sway — composes with outer Y-bob */}
      <div
        className="drop-sway"
        style={{
          width: "100%",
          height: "100%",
          ["--ds" as string]: swayAmt,
          ["--dsd" as string]: swayDur,
          ["--dsdelay" as string]: swayDelay,
        }}
      >
        {/* Perfect teardrop: pointed top, rounded base */}
        <svg viewBox="0 0 20 28" width={w} height={h} aria-hidden>
          <defs>
            <radialGradient id={gId} cx="37%" cy="30%" r="65%">
              <stop offset="0%"   stopColor="#FFE050" stopOpacity={0.95} />
              <stop offset="38%"  stopColor="#D49010" stopOpacity={0.97} />
              <stop offset="100%" stopColor="#854500" stopOpacity={1.00} />
            </radialGradient>
            <radialGradient id={sId} cx="34%" cy="26%" r="38%">
              <stop offset="0%"   stopColor="#FFFFFF" stopOpacity={0.50} />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity={0.00} />
            </radialGradient>
          </defs>
          {/* Fill */}
          <path
            d="M10,1 C10,1 20,11 20,18 C20,23.5 15.5,27 10,27 C4.5,27 0,23.5 0,18 C0,11 10,1 10,1 Z"
            fill={`url(#${gId})`}
          />
          {/* Specular shine */}
          <path
            d="M10,1 C10,1 20,11 20,18 C20,23.5 15.5,27 10,27 C4.5,27 0,23.5 0,18 C0,11 10,1 10,1 Z"
            fill={`url(#${sId})`}
          />
        </svg>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   JAR PARTS
   ══════════════════════════════════════════════════════════ */

function JarLid() {
  return (
    <>
      {/* Lid body — warm wood gradient + subtle horizontal grain */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: 0,
          left: "11%",
          right: "11%",
          height: 40,
          background: [
            /* horizontal grain highlights */
            "linear-gradient(90deg, rgba(255,215,140,0.12) 0%, rgba(255,185,95,0.04) 20%, rgba(255,185,95,0.04) 75%, rgba(255,210,130,0.10) 100%)",
            /* base wood tone */
            "linear-gradient(180deg, #A07840 0%, #7A5228 28%, #5E3C1C 62%, #3E2610 100%)",
          ].join(", "),
          borderRadius: "8px 8px 3px 3px",
          boxShadow: [
            "0 6px 20px rgba(44,20,5,0.50)",
            "0 2px 6px rgba(44,20,5,0.30)",
            "inset 0 1px 0 rgba(255,220,140,0.18)",
            "inset 0 -2px 8px rgba(0,0,0,0.22)",
          ].join(", "),
          zIndex: 10,
        }}
      />

      {/* Gold ring at base of lid */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: 38,
          left: "9%",
          right: "9%",
          height: 7,
          background:
            "linear-gradient(180deg, #F0D460 0%, #C8A010 42%, #9A7208 100%)",
          boxShadow:
            "0 2px 8px rgba(184,117,20,0.45), inset 0 1px 0 rgba(255,248,140,0.55)",
          zIndex: 10,
        }}
      />

      {/* Dark band — lid to body transition */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: 45,
          left: "7%",
          right: "7%",
          height: 13,
          background:
            "linear-gradient(180deg, #5A3818 0%, #3C2410 100%)",
          borderRadius: "0 0 3px 3px",
          boxShadow:
            "0 3px 12px rgba(44,20,5,0.40), inset 0 -2px 6px rgba(0,0,0,0.20)",
          zIndex: 10,
        }}
      />
    </>
  );
}

function HoneyFill() {
  return (
    <>
      {/* Deep honey body — dark at base → bright ámbar near surface */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "70%",
          background:
            "linear-gradient(180deg, " +
            "#F0C030 0%, " +          /* bright golden surface */
            "#D4900C 10%, " +         /* warm amber */
            "#B87208 30%, " +         /* deep amber */
            "#8A5005 58%, " +         /* rich brown amber */
            "#5E3002 82%, " +         /* dark base */
            "#3C1A00 100%)",          /* very dark bottom */
          zIndex: 1,
        }}
      />

      {/* Surface luminance — glassy shine just under the meniscus */}
      <div
        style={{
          position: "absolute",
          bottom: "68%",
          left: 0,
          right: 0,
          height: "8%",
          background:
            "linear-gradient(180deg, transparent 0%, rgba(255,210,60,0.42) 100%)",
          zIndex: 2,
        }}
      />

      {/* Meniscus — concave honey surface */}
      <div
        style={{
          position: "absolute",
          bottom: "70%",
          left: "-3%",
          right: "-3%",
          height: 22,
          background:
            "linear-gradient(180deg, rgba(255,205,50,0.88) 0%, rgba(220,155,15,0.95) 100%)",
          borderRadius: "0 0 50% 50% / 0 0 100% 100%",
          transform: "translateY(6px)",
          boxShadow: [
            "0 3px 12px rgba(200,140,10,0.30)",
            "inset 0 3px 8px rgba(255,230,100,0.65)",
          ].join(", "),
          zIndex: 3,
        }}
      />

      {/* Meniscus top rim — brightest line at honey surface */}
      <div
        style={{
          position: "absolute",
          bottom: "70%",
          left: "2%",
          right: "2%",
          height: 3,
          background:
            "linear-gradient(90deg, transparent, rgba(255,235,120,0.80), transparent)",
          transform: "translateY(6px)",
          borderRadius: "50%",
          zIndex: 4,
        }}
      />

      {/* Bottom depth gradient */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "24%",
          background:
            "linear-gradient(0deg, rgba(20,6,0,0.38) 0%, transparent 100%)",
          zIndex: 5,
        }}
      />
    </>
  );
}

function GlassHighlights() {
  return (
    <>
      {/* ── PRIMARY left highlight — main glass streak w/ shimmer ── */}
      <div
        className="glass-shimmer"
        style={{
          position: "absolute",
          top: "4%",
          left: "8%",
          width: "9%",
          height: "58%",
          background:
            "linear-gradient(180deg, " +
            "rgba(255,255,255,0.72) 0%, " +
            "rgba(255,255,255,0.30) 40%, " +
            "rgba(255,255,255,0.08) 78%, " +
            "transparent 100%)",
          borderRadius: "5px 5px 9px 9px",
          filter: "blur(1.2px)",
          zIndex: 8,
          ["--gsd" as string]: "11s",
          ["--gsdelay" as string]: "0s",
        }}
      />

      {/* ── SECONDARY left — thin inner strip w/ offset shimmer ── */}
      <div
        className="glass-shimmer"
        style={{
          position: "absolute",
          top: "6%",
          left: "20%",
          width: "2.5%",
          height: "38%",
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.38) 0%, rgba(255,255,255,0.06) 75%, transparent 100%)",
          borderRadius: "2px",
          filter: "blur(0.8px)",
          zIndex: 8,
          ["--gsd" as string]: "8s",
          ["--gsdelay" as string]: "-3.5s",
        }}
      />

      {/* ── Right edge highlight ── */}
      <div
        style={{
          position: "absolute",
          top: "7%",
          right: "9%",
          width: "4%",
          height: "28%",
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.30) 0%, rgba(255,255,255,0.06) 72%, transparent 100%)",
          borderRadius: "2px",
          zIndex: 8,
        }}
      />

      {/* ── Top shine — narrow bright bead at very top ── */}
      <div
        style={{
          position: "absolute",
          top: "2%",
          left: "14%",
          right: "14%",
          height: "4.5%",
          background:
            "radial-gradient(ellipse at 40% 50%, rgba(255,255,255,0.32) 0%, rgba(255,252,235,0.10) 60%, transparent 100%)",
          filter: "blur(1px)",
          zIndex: 9,
        }}
      />

      {/* ── Upper glass area overlay — adds depth above honey ── */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "30%",
          background:
            "linear-gradient(180deg, rgba(255,252,238,0.20) 0%, rgba(255,248,220,0.04) 70%, transparent 100%)",
          zIndex: 9,
          pointerEvents: "none",
        }}
      />

      {/* ── Bottom glass darkening ── */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "10%",
          background:
            "linear-gradient(0deg, rgba(24,8,0,0.18) 0%, transparent 100%)",
          zIndex: 9,
          pointerEvents: "none",
        }}
      />
    </>
  );
}

function JarLabel() {
  return (
    <div
      style={{
        position: "absolute",
        top: "21%",
        left: "14%",
        right: "14%",
        height: "32%",
        /* Subtle cream gradient — slightly lighter top */
        background:
          "linear-gradient(180deg, rgba(253,249,241,0.98) 0%, rgba(246,241,230,0.97) 100%)",
        borderRadius: "5px",
        /* Finer gold border */
        border: "0.5px solid rgba(212,175,55,0.42)",
        boxShadow: [
          "0 2px 16px rgba(184,117,20,0.16)",
          "0 0 0 1px rgba(212,175,55,0.10)",
          "inset 0 1px 0 rgba(255,255,255,0.92)",
        ].join(", "),
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        padding: "11px 8px",
        zIndex: 6,
      }}
    >
      {/* Top gold rule */}
      <div
        style={{
          width: "56%",
          height: 1,
          background:
            "linear-gradient(90deg, transparent, rgba(212,175,55,0.85), transparent)",
        }}
      />

      {/* Brand wordmark */}
      <span
        style={{
          fontFamily: "var(--font-playfair)",
          fontSize: 17,
          fontWeight: 700,
          color: "#2C1E11",
          letterSpacing: "0.18em",
          lineHeight: 1,
        }}
      >
        Honey
      </span>

      {/* Subtitle */}
      <span
        style={{
          fontSize: 6.5,
          color: "#8A6030",
          letterSpacing: "0.26em",
          textTransform: "uppercase",
          lineHeight: 1,
        }}
      >
        Productos de la colmena
      </span>

      {/* Bottom gold rule */}
      <div
        style={{
          width: "56%",
          height: 1,
          background:
            "linear-gradient(90deg, transparent, rgba(212,175,55,0.85), transparent)",
        }}
      />
    </div>
  );
}

/* ── Full jar (lid + body) ───────────────────────────────── */
function JarAssembly({ mx, my }: { mx: number; my: number }) {
  const JAR_W    = 260;  /* wider: was 230 */
  const BODY_H   = 320;  /* taller body: was 295 */
  const LID_H    = 58;   /* lid(40) + ring(7) + band(13) - slightly more than lid height with overlap */
  const TOTAL_H  = BODY_H + LID_H;

  return (
    <div
      style={{
        ...pl(mx, my, 20),
        position: "absolute",
        left: "50%",
        top: "50%",
        width: JAR_W,
        marginLeft: -(JAR_W / 2),
        marginTop: -(TOTAL_H / 2) + 16,
      }}
    >
      {/* Float animation wrapper */}
      <div className="jar-float" style={{ position: "relative" }}>

        {/* Broad amber glow behind the jar — organic, not rectangular */}
        <div
          aria-hidden
          className="glow-pulse"
          style={{
            position: "absolute",
            top: "5%",
            left: "-55%",
            right: "-55%",
            bottom: "-6%",
            background:
              "radial-gradient(ellipse 80% 70% at 50% 60%, " +
              "rgba(229,169,59,0.32) 0%, " +
              "rgba(200,130,10,0.12) 50%, " +
              "transparent 100%)",
            filter: "blur(38px)",
            zIndex: 0,
            pointerEvents: "none",
          }}
        />

        {/* Second wider soft halo — gentle pulse offset from inner halo */}
        <div
          aria-hidden
          className="glow-pulse"
          style={{
            position: "absolute",
            top: "-10%",
            left: "-80%",
            right: "-80%",
            bottom: "-12%",
            background:
              "radial-gradient(ellipse at 50% 65%, " +
              "rgba(212,175,55,0.12) 0%, " +
              "transparent 70%)",
            filter: "blur(55px)",
            zIndex: 0,
            pointerEvents: "none",
            ["--gpdelay" as string]: "-2.5s",
          }}
        />

        {/* ── Lid ── */}
        <div style={{ position: "relative", height: LID_H, zIndex: 10 }}>
          <JarLid />
        </div>

        {/* ── Jar body ── */}
        <div
          aria-hidden
          style={{
            position: "relative",
            width: JAR_W,
            height: BODY_H,
            /* Organic jar shape: slight oval base */
            borderRadius: "11px 11px 72px 72px / 11px 11px 48px 48px",
            overflow: "hidden",
            /* Glass: very transparent warm tint — NOT opaque/milky */
            background:
              "linear-gradient(155deg, " +
              "rgba(255,250,235,0.16) 0%, " +
              "rgba(255,238,180,0.09) 28%, " +
              "rgba(210,158,50,0.14) 62%, " +
              "rgba(170,110,20,0.20) 100%)",
            boxShadow: [
              /* ── outer warm glow ── */
              "0 32px 90px rgba(184,117,20,0.55)",
              "0 12px 40px rgba(184,117,20,0.32)",
              "0 4px 14px rgba(90,40,5,0.22)",
              /* ── fine gold rim ── */
              "0 0 0 1px rgba(212,175,55,0.35)",
              /* ── inner left glass edge (two layers for realism) ── */
              "inset 6px 0 24px rgba(255,255,255,0.22)",
              "inset 2px 0 7px rgba(255,255,255,0.32)",
              /* ── inner right shadow ── */
              "inset -9px 0 30px rgba(120,60,5,0.16)",
              /* ── inner top shine ── */
              "inset 0 10px 30px rgba(255,252,232,0.38)",
              /* ── inner base depth ── */
              "inset 0 -16px 36px rgba(30,10,0,0.26)",
            ].join(", "),
            zIndex: 5,
          }}
        >
          <HoneyFill />
          <JarLabel />
          <GlassHighlights />
        </div>

        {/* Ground shadow — soft radial ellipse */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            bottom: -16,
            left: "8%",
            right: "8%",
            height: 30,
            background:
              "radial-gradient(ellipse at center, rgba(184,117,20,0.50) 0%, rgba(184,117,20,0.08) 65%, transparent 100%)",
            filter: "blur(12px)",
            zIndex: 0,
          }}
        />

      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   MAIN EXPORT
   ════════════════════════════════════════════════════════════ */
export default function PremiumHoneyVisual({ mouseX, mouseY }: Props) {
  const mx = mouseX;
  const my = mouseY;

  return (
    <div
      aria-hidden
      style={{
        position: "relative",
        width: "100%",
        maxWidth: 500,
        /* Responsive height: scales with container width, caps at 540px */
        height: "min(540px, 90vw)",
        userSelect: "none",
        margin: "0 auto",
        /* Allow decorative elements to bleed outside the box */
        overflow: "visible",
      }}
    >

      {/* ── LAYER 0: Broad ambient glow — purely atmospheric ── */}
      <div
        style={{
          ...pl(mx, my, 5),
          position: "absolute",
          top: "5%",
          left: "-8%",
          right: "-8%",
          bottom: "2%",
          background:
            "radial-gradient(ellipse 70% 55% at 52% 56%, " +
            "rgba(229,169,59,0.18) 0%, " +
            "rgba(200,135,15,0.06) 52%, " +
            "transparent 100%)",
          filter: "blur(65px)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* ── LAYER 1: Far hex outlines ── */}
      {/* Large — upper right */}
      <div
        className="hex-drift"
        style={{
          ...pl(mx, my, 9),
          position: "absolute",
          top: "2%",
          right: "-1%",
          opacity: 0.20,
          zIndex: 1,
          ["--hr" as string]: "12deg",
          ["--hd" as string]: "11s",
          ["--hdelay" as string]: "0s",
        }}
      >
        <HexOutline size={172} stroke="rgba(212,175,55,0.48)" sw={1.2} />
      </div>

      {/* Medium — lower left */}
      <div
        className="hex-drift"
        style={{
          ...pl(mx, my, 7),
          position: "absolute",
          bottom: "6%",
          left: "1%",
          opacity: 0.15,
          zIndex: 1,
          ["--hr" as string]: "-8deg",
          ["--hd" as string]: "13s",
          ["--hdelay" as string]: "-3s",
        }}
      >
        <HexOutline size={116} stroke="rgba(212,175,55,0.42)" sw={1} />
      </div>

      {/* Small — upper left */}
      <div
        className="hex-drift"
        style={{
          ...pl(mx, my, 11),
          position: "absolute",
          top: "16%",
          left: "2%",
          opacity: 0.17,
          zIndex: 1,
          ["--hr" as string]: "5deg",
          ["--hd" as string]: "9s",
          ["--hdelay" as string]: "-1.5s",
        }}
      >
        <HexOutline size={74} stroke="rgba(212,175,55,0.52)" sw={0.9} />
      </div>

      {/* ── LAYER 2: Fill hex behind jar ── */}
      <HexFill
        size={54} opacity={0.11} rotate={-5} dur="10s" delay="-2s"
        style={{ ...pl(mx, my, 13), bottom: "20%", left: "5%", zIndex: 2 }}
      />
      <HexFill
        size={36} opacity={0.13} rotate={18} dur="8s" delay="-4s"
        style={{ ...pl(mx, my, 15), top: "11%", right: "7%", zIndex: 2 }}
      />

      {/* ── LAYER 3: JAR centrepiece ── */}
      <JarAssembly mx={mx} my={my} />

      {/* ── LAYER 4: Close hex fills (in front of jar) ── */}
      <HexFill
        size={42} opacity={0.12} rotate={10} dur="12s" delay="-6s"
        style={{ ...pl(mx, my, 26), bottom: "16%", right: "5%", zIndex: 12 }}
      />
      <HexFill
        size={26} opacity={0.15} rotate={-15} dur="7s" delay="-0.5s"
        style={{ ...pl(mx, my, 28), top: "28%", left: "5%", zIndex: 12 }}
      />

      {/* ── LAYER 5: SVG honey drops — each with independent bob + sway ── */}
      {/* Largest — right mid */}
      <HoneyDrop dropId="a"
        w={20} h={27} delay="0s" dur="5.5s"
        swayDur="4.2s" swayDelay="0s" swayAmt="1.6px"
        style={{ ...pl(mx, my, 34), top: "37%", right: "5%", zIndex: 13 }}
      />
      {/* Medium — right upper */}
      <HoneyDrop dropId="b"
        w={14} h={19} delay="-2.2s" dur="4.8s"
        swayDur="3.6s" swayDelay="-1.5s" swayAmt="1.1px"
        style={{ ...pl(mx, my, 30), top: "20%", right: "11%", zIndex: 13 }}
      />
      {/* Small — left upper */}
      <HoneyDrop dropId="c"
        w={11} h={15} delay="-1.0s" dur="6.2s"
        swayDur="5.0s" swayDelay="-2.8s" swayAmt="0.9px"
        style={{ ...pl(mx, my, 32), top: "25%", left: "6%", zIndex: 13 }}
      />
      {/* Tiny — lower right */}
      <HoneyDrop dropId="d"
        w={9} h={12} delay="-3.5s" dur="5.0s"
        swayDur="3.8s" swayDelay="-0.8s" swayAmt="0.7px"
        style={{ ...pl(mx, my, 36), bottom: "22%", right: "9%", zIndex: 13 }}
      />

      {/* ── LAYER 6: Top atmospheric vignette ── */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "-10%",
          right: "-10%",
          height: "25%",
          background:
            "linear-gradient(180deg, rgba(244,239,227,0.28) 0%, transparent 100%)",
          pointerEvents: "none",
          zIndex: 14,
        }}
      />

    </div>
  );
}
