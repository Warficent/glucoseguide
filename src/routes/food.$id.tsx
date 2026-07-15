import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect } from "react";
import { AppShell } from "@/components/AppShell";
import { FOODS } from "@/lib/data";
import { useAppState, actions } from "@/lib/store";
import { ArrowLeft, Heart } from "lucide-react";

export const Route = createFileRoute("/food/$id")({
  head: ({ params }) => {
    const food = FOODS.find((f) => f.id === params.id);
    return {
      meta: [
        {
          title: food ? `${food.name} — Novak Nutrition` : "Food — Novak Nutrition",
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
          <h1 className="mt-4 font-serif text-3xl font-semibold text-ink">
            {food.name}
          </h1>
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

        <div className="rounded-2xl bg-lavender p-5">
          <h2 className="font-serif text-lg font-semibold text-ink">Why this score</h2>
          <p className="mt-2 text-sm leading-relaxed text-ink/75">{food.note}</p>
          <p className="mt-3 text-xs text-ink/50">
            Higher scores rise glucose more gently. Lower scores rise it faster.
          </p>
        </div>
      </div>
    </AppShell>
  );
}
