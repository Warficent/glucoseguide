export type MealSummary = {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
};

export type Meal = {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strCategory?: string;
  strArea?: string;
  strInstructions: string;
  strSource?: string | null;
  strYoutube?: string | null;
  ingredients: { name: string; measure: string }[];
};

const BASE = "https://www.themealdb.com/api/json/v1/1";

export async function findMealForFood(input: {
  type: "ingredient" | "name";
  term: string;
}): Promise<Meal | null> {
  try {
    if (input.type === "ingredient") {
      const term = input.term
        .split(" ")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join("_");
      const list = await fetch(
        `${BASE}/filter.php?i=${encodeURIComponent(term)}`,
      ).then((r) => r.json());
      const meals: MealSummary[] | null = list?.meals ?? null;
      if (!meals || meals.length === 0) return null;
      const pick = meals[Math.floor(meals.length / 3) % meals.length];
      return await lookupMeal(pick.idMeal);
    }
    // TheMealDB's name search fails on "&" and other punctuation, so try a
    // few progressively looser variants of the title and keep the closest
    // name match rather than whatever the loosest query happened to return.
    let best: { meal: Record<string, string>; score: number } | null = null;
    for (const term of nameVariants(input.term)) {
      const res = await fetch(
        `${BASE}/search.php?s=${encodeURIComponent(term)}`,
      ).then((r) => r.json());
      const meals: Record<string, string>[] | null = res?.meals ?? null;
      if (!meals?.length) continue;
      for (const m of meals) {
        const score = titleSimilarity(input.term, m.strMeal ?? "");
        if (!best || score > best.score) best = { meal: m, score };
      }
      if (best && best.score >= 0.9) break;
    }
    if (!best || best.score < 0.5) return null;
    return normalize(best.meal);
  } catch {
    return null;
  }
}

function tokens(s: string): string[] {
  return s
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && w !== "and" && w !== "the" && w !== "with");
}

// Share of the requested title's significant words present in the candidate.
function titleSimilarity(want: string, got: string): number {
  const a = tokens(want);
  const b = new Set(tokens(got));
  if (!a.length) return 0;
  return a.filter((w) => b.has(w)).length / a.length;
}

function nameVariants(term: string): string[] {
  const variants = [term];
  if (term.includes("&")) {
    variants.push(term.replace(/&/g, "and"));
    const head = term.split("&")[0].trim();
    if (head.length > 3) variants.push(head);
  }
  const stripped = term.replace(/[^\w\s]/g, " ").replace(/\s+/g, " ").trim();
  if (stripped && stripped !== term) variants.push(stripped);
  const words = stripped.split(" ");
  const firstTwo = words.slice(0, 2).join(" ");
  if (firstTwo.length > 3) variants.push(firstTwo);
  if (words[0] && words[0].length > 3) variants.push(words[0]);
  return Array.from(new Set(variants));
}



async function lookupMeal(id: string): Promise<Meal | null> {
  const res = await fetch(`${BASE}/lookup.php?i=${id}`).then((r) => r.json());
  const meals: Record<string, string>[] | null = res?.meals ?? null;
  if (!meals || meals.length === 0) return null;
  return normalize(meals[0]);
}

function normalize(m: Record<string, string>): Meal {
  const ingredients: { name: string; measure: string }[] = [];
  for (let i = 1; i <= 20; i++) {
    const name = (m[`strIngredient${i}`] ?? "").trim();
    const measure = (m[`strMeasure${i}`] ?? "").trim();
    if (name) ingredients.push({ name, measure });
  }
  return {
    idMeal: m.idMeal,
    strMeal: m.strMeal,
    strMealThumb: m.strMealThumb,
    strCategory: m.strCategory,
    strArea: m.strArea,
    strInstructions: m.strInstructions ?? "",
    strSource: m.strSource || null,
    strYoutube: m.strYoutube || null,
    ingredients,
  };
}

export function splitInstructions(text: string): string[] {
  return text
    .split(/\r?\n+|(?<=[.!?])\s+(?=[A-Z0-9])/)
    .map((s) =>
      s
        // Strip leading "Step 1", "STEP 1:", "1)", "1." style prefixes
        .replace(/^\s*(?:step\s*)?\d+\s*[:.\)\-]?\s*/i, "")
        .trim(),
    )
    .filter(
      (s) =>
        s.length > 0 &&
        s.length < 600 &&
        // Skip fragments that are only a number or "Step N"
        !/^(?:step\s*)?\d+\s*[:.\)\-]?\s*$/i.test(s) &&
        // Require at least some letters
        /[a-zA-Z]/.test(s),
    );
}
