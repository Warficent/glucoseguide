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
    const res = await fetch(
      `${BASE}/search.php?s=${encodeURIComponent(input.term)}`,
    ).then((r) => r.json());
    const meals: Record<string, string>[] | null = res?.meals ?? null;
    if (!meals || meals.length === 0) return null;
    return normalize(meals[0]);
  } catch {
    return null;
  }
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
