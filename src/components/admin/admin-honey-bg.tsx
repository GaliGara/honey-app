/** Decorative honeycomb SVG background pattern. Place inside a `position:relative` container. */
export default function AdminHoneyBg({ opacity = 0.07 }: { opacity?: number }) {
  return (
    <svg
      aria-hidden
      xmlns="http://www.w3.org/2000/svg"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        opacity,
        pointerEvents: "none",
        zIndex: 0,
      }}
    >
      <defs>
        <pattern
          id="hc-pat"
          x="0"
          y="0"
          width="60"
          height="52"
          patternUnits="userSpaceOnUse"
        >
          <polygon
            points="30,2 58,17 58,35 30,50 2,35 2,17"
            fill="none"
            stroke="rgba(184,117,20,0.75)"
            strokeWidth="1"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#hc-pat)" />
    </svg>
  );
}
