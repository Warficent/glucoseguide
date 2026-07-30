import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { EmergencyBanner } from "@/components/EmergencyBanner";
import { EaseFilter } from "@/components/EaseFilter";
import { useAppState } from "@/lib/store";
import {
  suggestFoods,
  zoneFor,
  zoneLabel,
  zoneColor,
  easeLabel,
  type EaseLevel,
} from "@/lib/data";

import { Heart, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/suggest")({
  head: () => ({
    meta: [
      { title: "Food suggestions for your glucose — Glucose Guide" },
      {
        name: "description",
        content:
          "Get four food recommendations tailored to your latest blood glucose reading — fast sugar for lows, gentle options for highs, balanced picks in range.",
      },
      { property: "og:title", content: "Food suggestions for your glucose — Glucose Guide" },
      {
        property: "og:description",
        content: "Four food picks tailored to your latest blood glucose reading.",
      },
      { property: "og:url", content: "https://glucoseguide.lovable.app/suggest" },
    ],
    links: [{ rel: "canonical", href: "https://glucoseguide.lovable.app/suggest" }],
  }),
  component: SuggestPage,
});

function SuggestPage() {
  const [ease, setEase] = useState<EaseLevel | null>(null);
  const glucose = useAppState((s) => s.glucose);
  const liked = useAppState((s) => s.liked);

  if (glucose == null) {
    return (
      <AppShell title="Suggest">
        <div className="rounded-3xl bg-lavender p-6 text-center">
          <p className="font-serif text-xl text-ink">No reading yet</p>
          <p className="mt-2 text-sm text-ink/60">
            Log a glucose reading to see tailored food suggestions.
          </p>
          <Link
            to="/log"
            className="mt-4 inline-block rounded-2xl bg-primary px-5 py-3 font-semibold text-white"
          >
            Log glucose
          </Link>
        </div>
      </AppShell>
    );
  }

  const zone = zoneFor(glucose);
  const foods = suggestFoods(glucose, liked, ease);
  const showMoveCTA = zone === "high";

  const headline =
    zone === "severe-low" || zone === "low"
      ? "Fast-acting sugar first"
      : zone === "high" || zone === "severe-high"
        ? "Go gentle — low-impact foods"
        : "Balanced options";

  return (
    <AppShell title="Suggest">
      <div className="space-y-5">
        <section className="rounded-3xl bg-lavender p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-ink/50">Reading</p>
              <p className="mt-1 font-serif text-4xl font-semibold tabular-nums text-ink">
                {glucose}
                <span className="ml-1 text-base font-medium text-ink/50">mg/dL</span>
              </p>
            </div>
            <span
              className="rounded-full px-3 py-1 text-xs font-semibold text-white"
              style={{ backgroundColor: zoneColor(zone) }}
            >
              {zoneLabel(zone)}
            </span>
          </div>
        </section>

        <EmergencyBanner zone={zone} />

        <div>
          <h2 className="font-serif text-xl font-semibold text-ink">{headline}</h2>
          <p className="mt-1 text-sm text-ink/60">
            {zone === "in-range"
              ? "Balanced foods to steady you here."
              : zone === "severe-low" || zone === "low"
                ? "Sorted by how quickly they raise glucose."
                : "Sorted by how gently they raise glucose."}
          </p>
        </div>

        <EaseFilter value={ease} onChange={setEase} />

        <ul className="space-y-3">
          {foods.map((f) => (
            <li key={f.id}>
              <Link
                to="/food/$id"
                params={{ id: f.id }}
                className="flex items-center gap-4 rounded-2xl bg-lavender p-4 transition active:scale-[0.99]"
              >
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-white text-2xl">
                  {f.emoji}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate font-semibold text-ink">{f.name}</p>
                    {liked.includes(f.id) && (
                      <Heart className="h-3.5 w-3.5 shrink-0 fill-primary text-primary" />
                    )}
                  </div>
                  <p className="text-xs text-ink/60">
                    {f.carbs}g carbs · impact {f.impact}/10
                    {easeLabel(f.id) ? ` · ${easeLabel(f.id)} to make` : ""}
                  </p>

                </div>
                <ArrowRight className="h-4 w-4 shrink-0 text-ink/40" />
              </Link>
            </li>
          ))}
        </ul>

        <p className="rounded-2xl bg-lavender p-4 text-xs leading-relaxed text-ink/60">
          Impact scores are derived from published glycemic index values and each
          recipe's carbohydrate load. They are a guide only — not medical advice, and
          never a basis for insulin dosing. Confirm carbs with your care team.
        </p>

        {showMoveCTA && (
          <Link
            to="/move"
            className="flex items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-4 font-semibold text-white shadow-lg shadow-primary/20"
          >
            Try movement to bring it down
            <ArrowRight className="h-4 w-4" />
          </Link>
        )}
      </div>
    </AppShell>
  );
}
