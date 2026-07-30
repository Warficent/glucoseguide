import { EASE_LEVELS, type EaseLevel } from "@/lib/data";

export function EaseFilter({
  value,
  onChange,
}: {
  value: EaseLevel | null;
  onChange: (next: EaseLevel | null) => void;
}) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-0.5">
      <span className="shrink-0 text-xs font-semibold uppercase tracking-[0.15em] text-ink/50">
        Effort
      </span>
      <button
        onClick={() => onChange(null)}
        aria-pressed={value === null}
        className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition ${
          value === null ? "bg-primary text-white" : "bg-lavender text-ink/70"
        }`}
      >
        All
      </button>
      {EASE_LEVELS.map((level) => (
        <button
          key={level}
          onClick={() => onChange(value === level ? null : level)}
          aria-pressed={value === level}
          className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition ${
            value === level ? "bg-primary text-white" : "bg-lavender text-ink/70"
          }`}
        >
          {level}
        </button>
      ))}
    </div>
  );
}
