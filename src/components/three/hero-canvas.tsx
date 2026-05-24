"use client";

import { Suspense, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import StudioLights from "./studio-lights";
import HoneyJarModel from "./honey-jar-model";

/* ─── HTML fallback shown while WebGL scene loads ──────── */
function CanvasFallback() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "none",
      }}
    >
      <span
        style={{
          fontSize: 11,
          letterSpacing: "0.32em",
          textTransform: "uppercase",
          color: "rgba(184,117,20,0.55)",
          fontFamily: "var(--font-playfair)",
        }}
      >
        Cargando miel dorada…
      </span>
    </div>
  );
}

/* ─── Hero Canvas ───────────────────────────────────────── */
export default function HeroCanvas() {
  // Avoid SSR — Canvas must only render on client
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  if (!mounted) return <CanvasFallback />;

  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0, 4.5], fov: 42, near: 0.1, far: 50 }}
      style={{ position: "absolute", inset: 0 }}
      shadows={false}
    >
      <Suspense fallback={null}>
        <StudioLights />
        <HoneyJarModel />
      </Suspense>
    </Canvas>
  );
}
