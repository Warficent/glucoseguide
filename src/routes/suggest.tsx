import { createFileRoute, Link } from "@tanstack/react-router";
import { ImpactScale } from "@/components/ImpactScale";
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

import { glycemicForRecipe } from "@/lib/glycemic";
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
  const isLow = zone === "low" || zone === "severe-low";
  const foods = isLow ? [] : suggestFoods(glucose, liked, ease);
  const showMoveCTA = zone === "high";

  const headline = isLow
    ? "Treat the low first"
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
            {isLow
              ? "Recipes are the wrong tool for a low. Use fast-acting glucose."
              : zone === "in-range"
                ? "Balanced foods to steady you here."
                : "Sorted by how gently they raise glucose."}
          </p>
        </div>

        {isLow ? (
          <Rule1515 severe={zone === "severe-low"} />
        ) : (
          <>
            <EaseFilter value={ease} onChange={setEase} />

            <ul className="space-y-3">
              {foods.map((f) => {
                const g = glycemicForRecipe(f);
                return (
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

                        <div className="mt-1 flex flex-wrap gap-1.5">
                          {g.delayedRise && (
                            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-800">
                              Delayed rise
                            </span>
                          )}
                          {g.confidence === "estimated" && (
                            <span className="rounded-full bg-ink/10 px-2 py-0.5 text-[10px] font-semibold text-ink/60">
                              Estimated GI
                            </span>
                          )}
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 shrink-0 text-ink/40" />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </>
        )}

        <ImpactScale />

        <p className="rounded-2xl bg-lavender p-4 text-xs leading-relaxed text-ink/60">
          Impact scores are computed from published, glucose-referenced glycemic index
          values combined across each recipe's carbohydrate sources, then scaled by its
          available carbohydrate. Low-GI eating improves average glucose but does not
          change insulin needs — this is a food-ranking guide only, never a basis for
          dosing.{" "}
          <Link to="/evidence" className="font-semibold text-primary underline">
            See the research behind these scores
          </Link>
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

function Rule1515({ severe }: { severe: boolean }) {
  return (
    <section className="space-y-3">
      <div className="rounded-3xl border-2 border-primary/30 bg-lavender p-5">
        <h3 className="font-serif text-lg font-semibold text-ink">The 15-15 rule</h3>
        <ol className="mt-3 space-y-3 text-sm leading-relaxed text-ink/80">
          <li className="flex gap-3">
            <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary text-xs font-semibold text-white">
              1
            </span>
            <span>
              Take <strong className="font-semibold text-ink">15g of fast-acting
              carbohydrate</strong> now — glucose tablets, 4 oz (120 ml) juice or regular
              soda, or a tablespoon of sugar or honey.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary text-xs font-semibold text-white">
              2
            </span>
            <span>Wait 15 minutes. Do not stack more treatment in the meantime.</span>
          </li>
          <li className="flex gap-3">
            <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary text-xs font-semibold text-white">
              3
            </span>
            <span>
              Recheck. Still under 70 mg/dL? Repeat with another 15g. Back above 70? Follow
              with a snack or meal containing protein if your next meal is more than an
              hour away.
            </span>
          </li>
        </ol>
        <p className="mt-4 rounded-xl bg-white p-3 text-xs leading-relaxed text-ink/70">
          Recipe suggestions are deliberately hidden here. Low-glycemic eating improves
          average glucose but has not been shown to reduce time spent below 70 mg/dL
          (Rovner 2009), and a cooked dish is far too slow to treat a low.
        </p>
      </div>

      {severe && (
        <p className="rounded-2xl bg-lavender p-4 text-xs leading-relaxed text-ink/70">
          Below 54 mg/dL is a severe low. Treat immediately if you can self-treat. If you
          are confused, unable to swallow safely, or losing consciousness, this is an
          emergency — call 911 or your local emergency number, and use glucagon if you
          have it and someone can give it.
        </p>
      )}

      <Link
        to="/log"
        className="flex items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-4 font-semibold text-white shadow-lg shadow-primary/20"
      >
        Log a recheck
        <ArrowRight className="h-4 w-4" />
      </Link>
    </section>
  );
}

