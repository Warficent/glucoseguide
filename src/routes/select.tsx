import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { FOODS } from "@/lib/data";
import { useAppState, actions } from "@/lib/store";
import { Heart, Search, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/select")({
  head: () => ({
    meta: [
      { title: "Browse foods & recipes — Glucose Guide" },
      {
        name: "description",
        content:
          "Search 30+ recipes with carb counts and 1–10 glucose impact scores. Save favorites and revisit recent picks for easier meal decisions.",
      },
      { property: "og:title", content: "Browse foods & recipes — Glucose Guide" },
      {
        property: "og:description",
        content: "Search 30+ recipes with carb counts and 1–10 glucose impact scores.",
      },
      { property: "og:url", content: "https://glucoseguide.lovable.app/select" },
    ],
    links: [{ rel: "canonical", href: "https://glucoseguide.lovable.app/select" }],
  }),
  component: SelectPage,
});

function SelectPage() {
  const [q, setQ] = useState("");
  const liked = useAppState((s) => s.liked);
  const recent = useAppState((s) => s.recent);

  const filtered = useMemo(
    () =>
      FOODS.filter((f) => f.name.toLowerCase().includes(q.toLowerCase())).sort(
        (a, b) => a.name.localeCompare(b.name),
      ),
    [q],
  );

  const recentFoods = recent
    .map((id) => FOODS.find((f) => f.id === id))
    .filter((f): f is (typeof FOODS)[number] => Boolean(f));

  return (
    <AppShell title="Select">
      <div className="space-y-5">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search foods…"
            className="w-full rounded-2xl bg-lavender py-3.5 pl-11 pr-4 text-sm text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>

        {!q && recentFoods.length > 0 && (
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
                />
              ))}
            </ul>
          </section>
        )}

        <section>
          <h2 className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-ink/50">
            All foods
          </h2>
          <ul className="space-y-2">
            {filtered.map((f) => (
              <FoodRow
                key={f.id}
                food={f}
                liked={liked.includes(f.id)}
                onLike={() => actions.toggleLike(f.id)}
              />
            ))}
            {filtered.length === 0 && (
              <li className="rounded-2xl bg-lavender p-6 text-center text-sm text-ink/60">
                No foods match "{q}".
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
}: {
  food: (typeof FOODS)[number];
  liked: boolean;
  onLike: () => void;
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
          <p className="truncate font-semibold text-ink">{food.name}</p>
          <p className="text-xs text-ink/60">{food.carbs}g carbs</p>
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
