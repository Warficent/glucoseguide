import { useMemo } from "react";
import type { Reading } from "@/lib/store";

export function GlucoseChart({ history }: { history: Reading[] }) {
  const data = useMemo(() => history.slice(-20), [history]);
  const w = 320;
  const h = 140;
  const padL = 28;
  const padR = 8;
  const padT = 12;
  const padB = 20;

  if (data.length === 0) {
    return (
      <div className="rounded-2xl bg-white/5 p-5 text-center text-sm text-white/60 ring-1 ring-white/10">
        No history yet. Log a reading to start your trend.
      </div>
    );
  }

  const minY = 40;
  const maxY = Math.max(220, ...data.map((d) => d.value + 20));
  const xFor = (i: number) =>
    padL + (data.length === 1 ? (w - padL - padR) / 2 : (i * (w - padL - padR)) / (data.length - 1));
  const yFor = (v: number) =>
    padT + ((maxY - v) / (maxY - minY)) * (h - padT - padB);

  const path = data
    .map((d, i) => `${i === 0 ? "M" : "L"} ${xFor(i).toFixed(1)} ${yFor(d.value).toFixed(1)}`)
    .join(" ");

  // Fill target band 70–180
  const bandTop = yFor(180);
  const bandBottom = yFor(70);

  const gridYs = [70, 140, 180];

  const last = data[data.length - 1];
  const first = data[0];
  const delta = last.value - first.value;

  return (
    <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
      <div className="mb-2 flex items-baseline justify-between">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
          Trend
        </p>
        <p className="text-xs text-white/60">
          {data.length} reading{data.length === 1 ? "" : "s"}
          {data.length > 1 && (
            <span className={delta >= 0 ? " text-red-300" : " text-emerald-300"}>
              {" · "}
              {delta > 0 ? "+" : ""}
              {delta} mg/dL
            </span>
          )}
        </p>
      </div>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full">
        <rect
          x={padL}
          y={bandTop}
          width={w - padL - padR}
          height={bandBottom - bandTop}
          fill="rgba(74, 222, 128, 0.12)"
        />
        {gridYs.map((v) => (
          <g key={v}>
            <line
              x1={padL}
              x2={w - padR}
              y1={yFor(v)}
              y2={yFor(v)}
              stroke="rgba(255,255,255,0.08)"
              strokeDasharray="2 3"
            />
            <text
              x={padL - 4}
              y={yFor(v) + 3}
              fill="rgba(255,255,255,0.5)"
              fontSize="9"
              textAnchor="end"
            >
              {v}
            </text>
          </g>
        ))}
        <path
          d={path}
          fill="none"
          stroke="#C4A9F5"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {data.map((d, i) => {
          const color =
            d.value < 54 || d.value > 400
              ? "#7f1d1d"
              : d.value < 70
                ? "#ef4444"
                : d.value <= 180
                  ? "#22c55e"
                  : "#a78bfa";
          return (
            <circle
              key={i}
              cx={xFor(i)}
              cy={yFor(d.value)}
              r={i === data.length - 1 ? 4 : 2.5}
              fill={color}
              stroke="#1E3D2A"
              strokeWidth={i === data.length - 1 ? 2 : 0}
            />
          );
        })}
      </svg>
    </div>
  );
}
