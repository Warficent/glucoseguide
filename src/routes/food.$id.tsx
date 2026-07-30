import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/AppShell";
import { FOODS } from "@/lib/data";
import { useAppState, actions } from "@/lib/store";
import { findMealForFood, splitInstructions, type Meal } from "@/lib/mealdb";
import { ArrowLeft, Heart, ExternalLink, ChefHat, Youtube } from "lucide-react";
import { isYoutubePlayable } from "@/lib/youtube-blocklist.generated";
import {
  glycemicForRecipe,
  confidenceLabel,
  confidenceExplanation,
  scaleGlycemic,
  impactFromGL,
  type GlycemicResult,
} from "@/lib/glycemic";


export const Route = createFileRoute("/food/$id")({
  head: ({ params }) => {
    const food = FOODS.find((f) => f.id === params.id);
    if (!food) {
      return { meta: [{ title: "Food — Glucose Guide" }] };
    }
    const url = `https://glucoseguide.lovable.app/food/${food.id}`;
    const description = `${food.name}: ~${food.carbs}g carbs, glucose impact ${food.impact}/10. ${food.note}`.slice(0, 200);
    return {
      meta: [
        { title: `${food.name} — carbs & glucose impact | Glucose Guide` },
        { name: "description", content: description },
        { property: "og:title", content: `${food.name} — carbs & glucose impact` },
        { property: "og:description", content: description },
        { property: "og:url", content: url },
        { property: "og:type", content: "article" },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Recipe",
            name: food.name,
            description: food.note,
            recipeCategory: "Main",
            nutrition: {
              "@type": "NutritionInformation",
              carbohydrateContent: `${food.carbs} g`,
            },
          }),
        },
      ],
    };
  },
  loader: ({ params }) => {
    const food = FOODS.find((f) => f.id === params.id);
    if (!food) throw notFound();
    return { food };
  },
  component: FoodDetail,
  notFoundComponent: () => (
    <AppShell title="Food">
      <div className="rounded-3xl bg-lavender p-6 text-center text-ink">
        <p className="font-serif text-xl">Food not found</p>
        <Link
          to="/select"
          className="mt-4 inline-block rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-white"
        >
          Browse foods
        </Link>
      </div>
    </AppShell>
  ),
});

const PORTION_STEPS = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 2.5, 3];

function portionLabel(factor: number) {
  if (factor === 1) return "1 serving";
  if (factor === 0.5) return "Half serving";
  if (factor === 2) return "Double serving";
  return `${factor} servings`;
}

function FoodDetail() {
  const { food } = Route.useLoaderData();
  const liked = useAppState((s) => s.liked.includes(food.id));
  const [stepIndex, setStepIndex] = useState(PORTION_STEPS.indexOf(1));
  const portion = PORTION_STEPS[stepIndex];

  const base = useMemo(() => glycemicForRecipe(food), [food]);
  const scaled = useMemo(() => scaleGlycemic(base, portion), [base, portion]);
  const impact = impactFromGL(scaled.gl);

  useEffect(() => {
    actions.addRecent(food.id);
  }, [food.id]);

  return (
    <AppShell title="Food">
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <Link
            to="/select"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-ink/60"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </Link>
          <button
            onClick={() => actions.toggleLike(food.id)}
            aria-label={liked ? "Unlike" : "Like"}
            className="grid h-11 w-11 place-items-center rounded-full bg-lavender transition active:scale-90"
          >
            <Heart
              className={`h-5 w-5 ${liked ? "fill-primary text-primary" : "text-ink/50"}`}
            />
          </button>
        </div>

        <div className="rounded-3xl bg-lavender p-6 text-center">
          <div className="mx-auto grid h-24 w-24 place-items-center rounded-3xl bg-white text-5xl shadow-sm">
            {food.emoji}
          </div>
          <h2 className="mt-4 font-serif text-3xl font-semibold text-ink">
            {food.name}
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-lavender p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-ink/50">Carbs</p>
            <p className="mt-2 font-serif text-3xl font-semibold text-ink tabular-nums">
              {scaled.carbs}
              <span className="ml-1 text-base font-medium text-ink/50">g</span>
            </p>
          </div>
          <div className="rounded-2xl bg-lavender p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-ink/50">Impact</p>
            <p className="mt-2 font-serif text-3xl font-semibold text-primary tabular-nums">
              {impact}
              <span className="ml-1 text-base font-medium text-ink/50">/10</span>
            </p>
          </div>
        </div>

        <PortionSlider
          stepIndex={stepIndex}
          onChange={setStepIndex}
          portion={portion}
          baseCarbs={base.carbs}
          scaledCarbs={scaled.carbs}
        />

        <GlycemicCard food={food} g={scaled} portion={portion} />

        <div className="rounded-2xl bg-lavender p-5">
          <h2 className="font-serif text-lg font-semibold text-ink">Why this score</h2>
          <p className="mt-2 text-sm leading-relaxed text-ink/75">{food.note}</p>
          <p className="mt-3 text-xs text-ink/50">
            Higher scores rise glucose more gently. Lower scores rise it faster.
          </p>
        </div>

        <RecipeSection food={food} />
      </div>
    </AppShell>
  );
}

function PortionSlider({
  stepIndex,
  onChange,
  portion,
  baseCarbs,
  scaledCarbs,
}: {
  stepIndex: number;
  onChange: (i: number) => void;
  portion: number;
  baseCarbs: number;
  scaledCarbs: number;
}) {
  return (
    <section className="rounded-2xl bg-lavender p-5">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="font-serif text-lg font-semibold text-ink">Portion size</h2>
        <p className="text-sm font-semibold text-primary tabular-nums">
          {portionLabel(portion)}
        </p>
      </div>

      <label className="sr-only" htmlFor="portion-slider">
        Portion size, {portionLabel(portion)}
      </label>
      <input
        id="portion-slider"
        type="range"
        min={0}
        max={PORTION_STEPS.length - 1}
        step={1}
        value={stepIndex}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-valuetext={portionLabel(portion)}
        className="mt-4 h-2 w-full cursor-pointer appearance-none rounded-full bg-white accent-primary"
      />
      <div className="mt-2 flex justify-between text-[10px] uppercase tracking-wider text-ink/40">
        <span>&frac14;</span>
        <span>1 serving</span>
        <span>3&times;</span>
      </div>

      <p className="mt-3 text-xs leading-relaxed text-ink/60">
        One serving is the {baseCarbs}g-carb portion the recipe's published values are
        based on. At {portionLabel(portion).toLowerCase()} that becomes about{" "}
        <strong className="font-semibold text-ink/80">{scaledCarbs}g</strong> of
        carbohydrate, and the impact score below moves with it.
      </p>

      {portion !== 1 && (
        <button
          onClick={() => onChange(PORTION_STEPS.indexOf(1))}
          className="mt-3 rounded-xl bg-white px-3 py-2 text-xs font-semibold text-primary"
        >
          Reset to 1 serving
        </button>
      )}
    </section>
  );
}

function GlycemicCard({
  food,
  g,
  portion,
}: {
  food: (typeof FOODS)[number];
  g: GlycemicResult;
  portion: number;
}) {
  const tone =
    g.confidence === "measured"
      ? "bg-primary/10 text-primary"
      : g.confidence === "derived"
        ? "bg-ink/10 text-ink/70"
        : "bg-amber-100 text-amber-800";

  return (
    <section className="rounded-2xl bg-lavender p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-serif text-lg font-semibold text-ink">Glycemic detail</h2>
        <span
          className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${tone}`}
        >
          {confidenceLabel(g.confidence)}
        </span>
      </div>
      <p className="mt-1 text-xs text-ink/50">For {portionLabel(portion).toLowerCase()}</p>

      <dl className="mt-3 grid grid-cols-2 gap-2 text-center">
        <div className="rounded-xl bg-white p-3">
          <dt className="text-[10px] uppercase tracking-wider text-ink/50">Total carb</dt>
          <dd className="font-serif text-2xl font-semibold text-ink tabular-nums">
            {g.carbs}
          </dd>
          <dd className="text-[10px] text-ink/50">grams</dd>
        </div>
        <div className="rounded-xl bg-white p-3">
          <dt className="text-[10px] uppercase tracking-wider text-ink/50">Fibre</dt>
          <dd className="font-serif text-2xl font-semibold text-ink tabular-nums">
            {g.fibre}
          </dd>
          <dd className="text-[10px] text-ink/50">grams</dd>
        </div>
      </dl>


      {g.delayedRise && (
        <p className="mt-3 rounded-xl bg-amber-50 p-3 text-xs leading-relaxed text-amber-900">
          <strong className="font-semibold">Delayed rise.</strong> This plate carries
          roughly {g.fat}g of fat alongside its carbohydrate. Fat blunts the early rise
          and pushes it later, so glucose can climb hours after eating.
        </p>
      )}

      <div className="mt-3 space-y-2 text-xs leading-relaxed text-ink/60">
        {g.verified ? (
          <>
            <p>
              {g.dominated ? (
                <>
                  <strong className="font-semibold text-ink/80">{g.source}</strong> supplies
                  most of this recipe's carbohydrate and is the fastest-acting source in
                  it, so it sets the pace of the rise.
                </>
              ) : (
                <>
                  The impact score is weighted across this recipe's published
                  carbohydrate sources, led by{" "}
                  <strong className="font-semibold text-ink/80">{g.source}</strong>.
                </>
              )}
            </p>
            <p>
              Available carbohydrate is {g.carbs}g total carbs minus about {g.fibre}g
              fibre
              {portion !== 1 ? `, at ${portionLabel(portion).toLowerCase()}` : ""}.
            </p>
            {g.contributors.length > 1 && (
              <p>
                Carbohydrate comes mainly from{" "}
                {g.contributors
                  .slice(0, 3)
                  .map((c) => `${c.giKey} (~${Math.round(c.share * 100)}%)`)
                  .join(", ")}
                .
              </p>
            )}
          </>
        ) : (
          <p>{confidenceExplanation(g.confidence)}</p>
        )}
      </div>


      <p className="mt-3 rounded-xl bg-white/70 p-3 text-xs leading-relaxed text-ink/70">
        Ratings are population averages for a typical portion, and published GI values
        vary between people and laboratories. Low-GI eating improves average glucose but
        does not change insulin requirements, so this is a food-ranking guide only —
        never a basis for dosing. Count carbs and follow your care team.{" "}
        <Link to="/evidence" className="font-semibold text-primary underline">
          How these scores are calculated
        </Link>
      </p>
    </section>
  );
}


function RecipeSection({ food }: { food: (typeof FOODS)[number] }) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["meal", food.id],
    queryFn: () => findMealForFood(food.mealSearch),
    staleTime: 1000 * 60 * 60,
  });

  return (
    <section className="rounded-3xl bg-lavender p-5">
      <div className="mb-3 flex items-center gap-2">
        <ChefHat className="h-4 w-4 text-primary" />
        <h2 className="font-serif text-lg font-semibold text-ink">Recipe idea</h2>
      </div>

      {isLoading && <RecipeSkeleton />}
      {isError && (
        <p className="text-sm text-ink/60">
          Couldn't reach the recipe service. Try again later.
        </p>
      )}
      {!isLoading && !isError && !data && (
        <p className="text-sm text-ink/60">
          No matching recipe found for this food.
        </p>
      )}
      {data && <Recipe meal={data} />}
      <p className="mt-4 text-[10px] uppercase tracking-widest text-ink/40">
        Recipes via TheMealDB
      </p>
    </section>
  );
}

function Recipe({ meal }: { meal: Meal }) {
  const steps = splitInstructions(meal.strInstructions);
  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-2xl bg-white">
        <img
          src={meal.strMealThumb}
          alt={meal.strMeal}
          loading="lazy"
          className="h-40 w-full object-cover"
        />
        <div className="p-4">
          <h3 className="font-serif text-xl font-semibold text-ink">
            {meal.strMeal}
          </h3>
          <p className="mt-1 text-xs text-ink/60">
            {[meal.strCategory, meal.strArea].filter(Boolean).join(" · ")}
          </p>
        </div>
      </div>

      <div>
        <h4 className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-ink/60">
          Ingredients
        </h4>
        <ul className="divide-y divide-white/60 overflow-hidden rounded-2xl bg-white">
          {meal.ingredients.map((ing, i) => (
            <li key={i} className="flex items-center justify-between px-4 py-2.5">
              <span className="text-sm text-ink">{ing.name}</span>
              <span className="text-xs font-medium text-ink/60">
                {ing.measure && ing.measure !== "-" ? ing.measure : "to taste"}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h4 className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-ink/60">
          Instructions
        </h4>
        <ol className="space-y-2">
          {steps.map((step, i) => (
            <li
              key={i}
              className="flex gap-3 rounded-2xl bg-white p-3 text-sm leading-relaxed text-ink/80"
            >
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary text-xs font-semibold text-white">
                {i + 1}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className="flex flex-wrap gap-2">
        {meal.strSource && (
          <a
            href={meal.strSource}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-white"
          >
            Source <ExternalLink className="h-3 w-3" />
          </a>
        )}
        {isYoutubePlayable(meal.strYoutube) && (
          <a
            href={meal.strYoutube ?? undefined}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-ink"
          >
            <Youtube className="h-3.5 w-3.5 text-red-500" /> Watch
          </a>
        )}
      </div>
    </div>
  );
}

function RecipeSkeleton() {
  return (
    <div className="space-y-3">
      <div className="h-40 w-full animate-pulse rounded-2xl bg-white/60" />
      <div className="h-4 w-2/3 animate-pulse rounded bg-white/60" />
      <div className="h-3 w-full animate-pulse rounded bg-white/60" />
      <div className="h-3 w-11/12 animate-pulse rounded bg-white/60" />
      <div className="h-3 w-10/12 animate-pulse rounded bg-white/60" />
    </div>
  );
}
