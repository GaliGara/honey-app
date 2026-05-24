"use client";

import { useState, useCallback } from "react";
import type { MouseEvent } from "react";
import { siteConfig } from "@/constants/site";
import PremiumHoneyVisual from "./premium-honey-visual";

/* ─── Hero Section ─────────────────────────────────────── */
export default function HeroSection() {
  /* Mouse position for parallax: normalised −0.5 … 0.5 */
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e: MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    setMouse({
      x: (e.clientX - r.left - r.width  / 2) / r.width,
      y: (e.clientY - r.top  - r.height / 2) / r.height,
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setMouse({ x: 0, y: 0 });
  }, []);

  return (
    <section
      className="relative min-h-screen warm-radial-bg overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Background hex decor — section-level, static */}
      {([
        { size: 320, top: "-80px", right: "-60px", opacity: 0.04, rotate: 15 },
        { size: 160, top: "30%",  left: "-40px",  opacity: 0.06, rotate: -10 },
        { size: 80,  bottom: "15%", right: "12%", opacity: 0.08, rotate: 5 },
        { size: 50,  top: "15%",  left: "20%",    opacity: 0.07, rotate: 20 },
      ] as const).map(({ size, opacity, rotate, ...pos }) => (
        <div
          key={`${size}-${rotate}`}
          aria-hidden
          className="hex-shape absolute pointer-events-none"
          style={{
            width: size,
            height: size,
            opacity,
            transform: `rotate(${rotate}deg)`,
            background:
              "linear-gradient(135deg, rgba(212,175,55,0.6) 0%, rgba(229,169,59,0.3) 100%)",
            ...pos,
          }}
        />
      ))}

      {/* Top light ray */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "60%",
          height: "35%",
          background:
            "radial-gradient(ellipse at top, rgba(212,175,55,0.12) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Main content grid */}
      <div className="relative max-w-7xl mx-auto px-6 pt-36 pb-20 flex flex-col lg:flex-row items-center justify-between gap-12 min-h-screen">

        {/* ── Left: Copy ── */}
        <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left max-w-xl">

          {/* Eyebrow */}
          <div className="flex items-center gap-3 mb-7">
            <div className="gold-divider w-8" />
            <span
              className="text-[10px] uppercase tracking-[0.42em]"
              style={{ color: "#B87514" }}
            >
              Pureza · Origen · Excelencia
            </span>
            <div className="gold-divider w-8" />
          </div>

          {/* Headline */}
          <h1
            className="text-5xl md:text-6xl xl:text-7xl font-bold leading-[1.1] mb-6"
            style={{ fontFamily: "var(--font-playfair)", color: "#2C1E11" }}
          >
            {siteConfig.tagline.split(",")[0]},
            <br />
            <span
              style={{
                background:
                  "linear-gradient(135deg, #D4AF37 0%, #E5A93B 55%, #B87514 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              lujo en cada gota.
            </span>
          </h1>

          {/* Body */}
          <p
            className="text-base md:text-lg leading-relaxed mb-10 max-w-md"
            style={{ color: "#6F5635" }}
          >
            Descubre mieles 100&nbsp;% naturales y productos de la colmena
            seleccionados con cuidado, sabor incomparable y una experiencia
            pensada para disfrutarse lentamente.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4">
            <a href="/tienda" className="premium-button text-sm">
              Descubrir colección
            </a>
            <a href="/tienda" className="secondary-button text-sm">
              Explorar tienda
            </a>
          </div>

          {/* Stats */}
          <div className="mt-14 flex items-center gap-8 flex-wrap justify-center lg:justify-start">
            {[
              { value: "100%", label: "Natural" },
              { value: "6+",   label: "Variedades" },
              { value: "24/7", label: "Trazabilidad" },
            ].map(({ value, label }) => (
              <div key={label} className="flex flex-col items-center lg:items-start">
                <span
                  className="text-2xl font-bold"
                  style={{ fontFamily: "var(--font-playfair)", color: "#D4AF37" }}
                >
                  {value}
                </span>
                <span
                  className="text-xs uppercase tracking-widest mt-0.5"
                  style={{ color: "#6F5635" }}
                >
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right: 2.5D Premium Visual ── */}
        <div className="flex-1 flex items-center justify-center w-full">
          <PremiumHoneyVisual mouseX={mouse.x} mouseY={mouse.y} />
        </div>

      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        style={{ color: "#B87514" }}
        aria-hidden
      >
        <span className="text-[9px] uppercase tracking-[0.35em]">Scroll</span>
        <div
          style={{
            width: 1,
            height: 40,
            background: "linear-gradient(180deg, #D4AF37, transparent)",
          }}
        />
      </div>
    </section>
  );
}
