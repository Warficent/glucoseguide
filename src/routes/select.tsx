import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";
import { AppShell } from "@/components/AppShell";
import { IngredientPicker } from "@/components/IngredientPicker";
import { EaseFilter } from "@/components/EaseFilter";
import {
  FOODS,
  filterFoodsByIngredients,
  easeLabel,
  type IngredientMode,
  type EaseLevel,
} from "@/lib/data";

import { useAppState, actions } from "@/lib/store";
import { Heart, Search, ArrowRight } from "lucide-react";

const searchSchema = z.object({
  ingredients: fallback(z.string().array(), []).default([]),
  mode: fallback(z.string(), "any").default("any"),
});

export const Route = createFileRoute("/select")({
  validateSearch: zodValidator(searchSchema),
  head: () => ({
    meta: [
      { title: "Browse foods & recipes — Glucose Guide" },
      {
        name: "description",
        content:
          "Search 130+ recipes with carb counts and 1–10 glucose impact scores. Filter by ingredients you have on hand.",
      },
      { property: "og:title", content: "Browse foods & recipes — Glucose Guide" },
      {
        property: "og:description",
        content: "Search recipes with carb counts and 1–10 glucose impact scores.",
      },
      { property: "og:url", content: "https://glucoseguide.lovable.app/select" },
    ],
    links: [{ rel: "canonical", href: "https://glucoseguide.lovable.app/select" }],
  }),
  component: SelectPage,
});

function SelectPage() {
  const [q, setQ] = useState("");
  const [ease, setEase] = useState<EaseLevel | null>(null);
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const liked = useAppState((s) => s.liked);
  const recent = useAppState((s) => s.recent);

  const mode: IngredientMode = search.mode === "only" ? "only" : "any";
  const selected = search.ingredients;

  type SearchT = z.infer<typeof searchSchema>;
  const setIngredients = (next: string[]) =>
    navigate({ to: ".", search: (prev: SearchT) => ({ ...prev, ingredients: next }) });
  const setMode = (next: IngredientMode) =>
    navigate({ to: ".", search: (prev: SearchT) => ({ ...prev, mode: next }) });

  const nameFiltered = useMemo(
    () => FOODS.filter((f) => f.name.toLowerCase().includes(q.toLowerCase())),
    [q],
  );

  const easeFiltered = useMemo(
    () => (ease ? nameFiltered.filter((f) => easeLabel(f.id) === ease) : nameFiltered),
    [nameFiltered, ease],
  );

  const results = useMemo(
    () => filterFoodsByIngredients(easeFiltered, selected, mode),
    [easeFiltered, selected, mode],
  );

  const showRecent = !q && selected.length === 0 && !ease;
  const recentFoods = recent
    .map((id) => FOODS.find((f) => f.id === id))
    .filter((f): f is (typeof FOODS)[number] => Boolean(f));

  return (
    <AppShell title="Select">
      <div className="space-y-5">
        <IngredientPicker
          selected={selected}
          mode={mode}
          onChange={setIngredients}
          onModeChange={setMode}
        />

        <EaseFilter value={ease} onChange={setEase} />

        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search foods…"
            className="w-full rounded-2xl bg-lavender py-3.5 pl-11 pr-4 text-sm text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>

        {showRecent && recentFoods.length > 0 && (
          <section>
            <h2 className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-ink/50">
              Recently viewed
            </h2>
            <ul className="space-y-2">
              {recentFoods.map((f) => (
                <FoodRow
                  key={f.id}
                  food={f}
                  liked={liked.includes(f.id)}
                  onLike={() => actions.toggleLike(f.id)}
                  ease={easeLabel(f.id)}
                />
              ))}
            </ul>
          </section>
        )}

        <section>
          <div className="mb-2 flex items-baseline justify-between">
            <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-ink/50">
              {selected.length > 0
                ? mode === "only"
                  ? "You can make right now"
                  : "Uses ingredients you have"
                : "All foods — easiest first"}
            </h2>
            {selected.length > 0 && (
              <span className="text-xs text-ink/50 tabular-nums">
                {results.length} match{results.length === 1 ? "" : "es"}
              </span>
            )}
          </div>
          <ul className="space-y-2">
            {results.map(({ food, matched, total }) => (
              <FoodRow
                key={food.id}
                food={food}
                liked={liked.includes(food.id)}
                onLike={() => actions.toggleLike(food.id)}
                ease={easeLabel(food.id)}
                matchInfo={
                  selected.length > 0 && total > 0
                    ? `${matched} of ${total} ingredients`
                    : total > 0
                      ? `${total} ingredients`
                      : undefined
                }
              />
            ))}

            {results.length === 0 && (
              <li className="rounded-2xl bg-lavender p-6 text-center text-sm text-ink/60">
                {selected.length > 0
                  ? mode === "only"
                    ? "No recipes match. Try switching to Any of these."
                    : "No recipes use those ingredients yet."
                  : `No foods match "${q}".`}
              </li>
            )}
          </ul>
        </section>
      </div>
    </AppShell>
  );
}

function FoodRow({
  food,
  liked,
  onLike,
  matchInfo,
  ease,
}: {
  food: (typeof FOODS)[number];
  liked: boolean;
  onLike: () => void;
  matchInfo?: string;
  ease?: string;
}) {
  return (
    <li className="flex items-center gap-3 rounded-2xl bg-lavender p-3">
      <Link
        to="/food/$id"
        params={{ id: food.id }}
        className="flex min-w-0 flex-1 items-center gap-3"
      >
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white text-xl">
          {food.emoji}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="truncate font-semibold text-ink">{food.name}</p>
            {ease && (
              <span className="shrink-0 rounded-full bg-white px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-ink/60">
                {ease}
              </span>
            )}
          </div>
          <p className="text-xs text-ink/60">
            {food.carbs}g carbs{matchInfo ? ` · ${matchInfo}` : ""}
          </p>
        </div>

        <span className="shrink-0 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary tabular-nums">
          {food.impact}/10
        </span>
        <ArrowRight className="ml-1 h-4 w-4 shrink-0 text-ink/30" />
      </Link>
      <button
        onClick={onLike}
        aria-label={liked ? "Unlike" : "Like"}
        className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/70 transition active:scale-90"
      >
        <Heart
          className={`h-4 w-4 ${liked ? "fill-primary text-primary" : "text-ink/40"}`}
        />
      </button>
    </li>
  );
}
