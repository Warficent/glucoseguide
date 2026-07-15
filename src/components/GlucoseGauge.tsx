import { zoneColor, zoneFor, zoneLabel } from "@/lib/data";

export function GlucoseGauge({ value }: { value: number | null }) {
  const size = 220;
  const stroke = 18;
  const r = (size - stroke) / 2;
  const cx = size / 2;
  const cy = size / 2;
  // semicircle from left to right along the top
  const startX = cx - r;
  const startY = cy;
  const endX = cx + r;
  const endY = cy;
  const arc = `M ${startX} ${startY} A ${r} ${r} 0 0 1 ${endX} ${endY}`;
  const length = Math.PI * r;

  const displayed = value ?? 0;
  const clamped = Math.max(40, Math.min(420, displayed));
  // Map 40..420 to 0..1
  const t = value == null ? 0 : (clamped - 40) / (420 - 40);
  const dash = length * t;

  const zone = value == null ? null : zoneFor(value);
  const color = zone ? zoneColor(zone) : "#ffffff33";

  return (
    <div className="relative mx-auto" style={{ width: size, height: size / 2 + 40 }}>
      <svg width={size} height={size / 2 + 12} viewBox={`0 0 ${size} ${size / 2 + 12}`}>
        <path
          d={arc}
          fill="none"
          stroke="rgba(255,255,255,0.15)"
          strokeWidth={stroke}
          strokeLinecap="round"
        />
        {value != null && (
          <path
            d={arc}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={`${dash} ${length}`}
            style={{ transition: "stroke-dasharray 0.6s ease, stroke 0.4s ease" }}
          />
        )}
      </svg>
      <div className="absolute inset-x-0 top-8 flex flex-col items-center">
        <div className="font-serif text-5xl font-semibold tabular-nums text-white">
          {value ?? "—"}
        </div>
        <div className="mt-1 text-xs uppercase tracking-[0.2em] text-white/70">
          mg/dL
        </div>
        {zone && (
          <div
            className="mt-2 rounded-full px-3 py-1 text-xs font-semibold"
            style={{ backgroundColor: color, color: "#fff" }}
          >
            {zoneLabel(zone)}
          </div>
        )}
      </div>
    </div>
  );
}
