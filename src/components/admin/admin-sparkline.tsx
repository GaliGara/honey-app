interface Props {
  data: number[];
  color?: string;
  width?: number;
  height?: number;
}

export default function AdminSparkline({
  data,
  color = "#D4AF37",
  width = 80,
  height = 28,
}: Props) {
  if (!data || data.length < 2) return null;

  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = max - min || 1;
  const padY = height * 0.08;

  const coords = data.map((v, i) => ({
    x: (i / (data.length - 1)) * width,
    y: height - padY - ((v - min) / range) * (height - 2 * padY),
  }));

  const linePoints = coords.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  const areaPoints = `0,${height} ${linePoints} ${width},${height}`;

  const lastP = coords[coords.length - 1];
  const gradId = `sg${color.replace(/[^a-z0-9]/gi, "")}`;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      aria-hidden
      style={{ overflow: "visible", flexShrink: 0 }}
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.22" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={areaPoints} fill={`url(#${gradId})`} />
      <polyline
        points={linePoints}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={0.72}
      />
      <circle
        cx={lastP.x.toFixed(1)}
        cy={lastP.y.toFixed(1)}
        r="2.2"
        fill={color}
        opacity={0.9}
      />
    </svg>
  );
}
