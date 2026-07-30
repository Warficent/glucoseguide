export function ImpactScale() {
  return (
    <section className="rounded-2xl bg-lavender p-4">
      <h2 className="font-serif text-base text-ink">How the 1–10 impact score works</h2>
      <p className="mt-1 text-xs leading-relaxed text-ink/70">
        The score estimates how much a serving of that recipe is likely to raise your blood
        glucose. <strong className="font-semibold text-ink">1 is the lowest rise</strong> and{" "}
        <strong className="font-semibold text-ink">10 is the highest rise</strong>.
      </p>

      <div className="mt-3 h-2 w-full rounded-full bg-gradient-to-r from-emerald-400 via-amber-400 to-red-500" />
      <div className="mt-1 flex justify-between text-[10px] font-semibold uppercase tracking-wide text-ink/50">
        <span>1 · gentle</span>
        <span>5 · moderate</span>
        <span>10 · steep</span>
      </div>

      <ul className="mt-3 space-y-1.5 text-xs leading-relaxed text-ink/70">
        <li>
          <strong className="font-semibold text-ink">1–3 — gentle.</strong> Low glycemic load:
          mostly protein, fat, vegetables or high-fibre carbs. Best choice when you are already
          running high.
        </li>
        <li>
          <strong className="font-semibold text-ink">4–7 — moderate.</strong> A real
          carbohydrate portion with a steady rise. Suited to in-range readings and planned
          meals.
        </li>
        <li>
          <strong className="font-semibold text-ink">8–10 — steep.</strong> High glycemic load
          from sugar or refined starch. Fast and useful for treating a low, hard on you when
          high.
        </li>
      </ul>

      <p className="mt-3 text-xs leading-relaxed text-ink/60">
        Each score comes from the recipe's published glycemic index values weighted across its
        carbohydrate sources, then scaled by its available carbohydrate (total carb minus
        fibre) — no subjective judgement. Portion size changes it, so the food detail page
        recalculates as you move the serving slider.
      </p>
    </section>
  );
}
