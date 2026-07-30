import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/AppShell";
import { FOODS } from "@/lib/data";
import { useAppState, actions } from "@/lib/store";
import { findMealForFood, splitInstructions, type Meal } from "@/lib/mealdb";
import { ArrowLeft, Heart, ExternalLink, ChefHat, Youtube } from "lucide-react";
import { isYoutubePlayable } from "@/lib/youtube-blocklist.generated";
import { glycemicForRecipe, glBand } from "@/lib/glycemic";

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

function FoodDetail() {
  const { food } = Route.useLoaderData();
  const liked = useAppState((s) => s.liked.includes(food.id));

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
              {food.carbs}
              <span className="ml-1 text-base font-medium text-ink/50">g</span>
            </p>
          </div>
          <div className="rounded-2xl bg-lavender p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-ink/50">Impact</p>
            <p className="mt-2 font-serif text-3xl font-semibold text-primary tabular-nums">
              {food.impact}
              <span className="ml-1 text-base font-medium text-ink/50">/10</span>
            </p>
          </div>
        </div>

        <GlycemicCard food={food} />

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

function GlycemicCard({ food }: { food: (typeof FOODS)[number] }) {
  const g = glycemicForRecipe(food);
  return (
    <section className="rounded-2xl bg-lavender p-5">
      <h2 className="font-serif text-lg font-semibold text-ink">Glycemic detail</h2>
      <dl className="mt-3 grid grid-cols-3 gap-3 text-center">
        <div className="rounded-xl bg-white p-3">
          <dt className="text-[10px] uppercase tracking-wider text-ink/50">GI</dt>
          <dd className="font-serif text-2xl font-semibold text-ink tabular-nums">{g.gi}</dd>
        </div>
        <div className="rounded-xl bg-white p-3">
          <dt className="text-[10px] uppercase tracking-wider text-ink/50">GL</dt>
          <dd className="font-serif text-2xl font-semibold text-ink tabular-nums">{g.gl}</dd>
        </div>
        <div className="rounded-xl bg-white p-3">
          <dt className="text-[10px] uppercase tracking-wider text-ink/50">Load</dt>
          <dd className="font-serif text-2xl font-semibold text-primary">{glBand(g.gl)}</dd>
        </div>
      </dl>
      <p className="mt-3 text-xs leading-relaxed text-ink/60">
        {g.verified ? (
          <>
            Glycemic index {g.gi} taken from published glucose-referenced tables for{" "}
            <strong className="font-semibold text-ink/80">{g.source}</strong>, the
            highest-GI carbohydrate in this recipe. Glycemic load = GI × {food.carbs}g
            carbs ÷ 100 = {g.gl}.
          </>
        ) : (
          <>
            No published glycemic index could be matched to this recipe's ingredients,
            so a conservative mixed-refined-meal value of GI {g.gi} is assumed — this
            may over- or under-state the real rise. Treat this score with extra caution.
          </>
        )}
      </p>
      <p className="mt-3 rounded-xl bg-white/70 p-3 text-xs leading-relaxed text-ink/70">
        Ratings are population averages for a typical portion. Your own response depends
        on portion size, insulin, activity and other factors. Always count carbs and dose
        as directed by your care team — this app is not medical advice and must not be
        used to make insulin decisions.
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
