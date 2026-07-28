import { useMemo, useState } from "react";
import { X, Plus } from "lucide-react";
import {
  ALL_INGREDIENTS,
  INGREDIENT_CATEGORIES,
} from "@/lib/ingredient-index.generated";
import type { IngredientMode } from "@/lib/data";

export function IngredientPicker({
  selected,
  mode,
  onChange,
  onModeChange,
}: {
  selected: string[];
  mode: IngredientMode;
  onChange: (next: string[]) => void;
  onModeChange: (mode: IngredientMode) => void;
}) {
  const [open, setOpen] = useState(selected.length > 0);
  const [q, setQ] = useState("");

  const suggestions = useMemo(() => {
    const query = q.toLowerCase().trim();
    if (!query) return [];
    return ALL_INGREDIENTS.filter(
      (i) => i.includes(query) && !selected.includes(i),
    ).slice(0, 8);
  }, [q, selected]);

  const add = (ing: string) => {
    const v = ing.toLowerCase().trim();
    if (!v || selected.includes(v)) return;
    onChange([...selected, v]);
    setQ("");
  };
  const remove = (ing: string) => onChange(selected.filter((s) => s !== ing));

  return (
    <div className="rounded-2xl bg-lavender p-4">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between text-left"
      >
        <div>
          <p className="text-sm font-semibold text-ink">
            What's in your kitchen?
          </p>
          <p className="text-xs text-ink/60">
            {selected.length > 0
              ? `${selected.length} ingredient${selected.length === 1 ? "" : "s"} selected`
              : "Filter recipes by ingredients you have"}
          </p>
        </div>
        <span className="text-xs font-semibold text-primary">
          {open ? "Hide" : "Open"}
        </span>
      </button>

      {open && (
        <div className="mt-4 space-y-3">
          {selected.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {selected.map((s) => (
                <button
                  key={s}
                  onClick={() => remove(s)}
                  className="inline-flex items-center gap-1 rounded-full bg-primary px-2.5 py-1 text-xs font-medium text-white"
                >
                  {s}
                  <X className="h-3 w-3" />
                </button>
              ))}
              <button
                onClick={() => onChange([])}
                className="text-xs font-medium text-ink/50 underline"
              >
                Clear
              </button>
            </div>
          )}

          <div className="flex gap-1 rounded-full bg-white p-1 text-xs font-semibold">
            {(["any", "only"] as IngredientMode[]).map((m) => (
              <button
                key={m}
                onClick={() => onModeChange(m)}
                className={`flex-1 rounded-full py-1.5 transition ${
                  mode === m ? "bg-primary text-white" : "text-ink/60"
                }`}
              >
                {m === "any" ? "Any of these" : "Only these"}
              </button>
            ))}
          </div>

          <div className="relative">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && suggestions[0]) add(suggestions[0]);
              }}
              placeholder="Type an ingredient…"
              className="w-full rounded-xl bg-white px-3 py-2 text-sm text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
            {suggestions.length > 0 && (
              <ul className="mt-1 flex flex-wrap gap-1.5">
                {suggestions.map((s) => (
                  <li key={s}>
                    <button
                      onClick={() => add(s)}
                      className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-xs text-ink/80 hover:bg-primary/10"
                    >
                      <Plus className="h-3 w-3" />
                      {s}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="space-y-2">
            {Object.entries(INGREDIENT_CATEGORIES).map(([cat, items]) => {
              const avail = items.filter((i) => !selected.includes(i)).slice(0, 12);
              if (avail.length === 0) return null;
              return (
                <div key={cat}>
                  <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-ink/50">
                    {cat}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {avail.map((i) => (
                      <button
                        key={i}
                        onClick={() => add(i)}
                        className="rounded-full bg-white px-2.5 py-1 text-xs text-ink/80 hover:bg-primary/10"
                      >
                        {i}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
