export type Food = {
  id: string;
  name: string;
  carbs: number;
  impact: number; // 1 raises BG most, 10 raises BG least
  note: string;
  emoji: string;
  // TheMealDB search term used to fetch the linked recipe.
  mealSearch: { type: "ingredient" | "name"; term: string };
};

// Each entry maps to a real dish on TheMealDB. Carbs and impact reflect
// the whole plated recipe — not a single ingredient — so the rating on
// the detail page matches the recipe you actually see.
export const FOODS: Food[] = [
  {
    id: "hot-chocolate-fudge",
    name: "Hot Chocolate Fudge",
    carbs: 55,
    impact: 2,
    note: "Almost pure sugar and cocoa — spikes fast, great for treating a low.",
    emoji: "🍫",
    mealSearch: { type: "name", term: "Hot Chocolate Fudge" },
  },
  {
    id: "apple-frangipan-tart",
    name: "Apple Frangipan Tart",
    carbs: 48,
    impact: 3,
    note: "Sweet apple and pastry with almond cream — big rise, softened by fat.",
    emoji: "🥧",
    mealSearch: { type: "name", term: "Apple Frangipan Tart" },
  },
  {
    id: "poutine",
    name: "Poutine",
    carbs: 58,
    impact: 3,
    note: "Fried potato under gravy and cheese — heavy, sustained rise.",
    emoji: "🍟",
    mealSearch: { type: "name", term: "Poutine" },
  },
  {
    id: "fettucine-alfredo",
    name: "Fettucine Alfredo",
    carbs: 62,
    impact: 4,
    note: "Pasta plus cream and cheese — significant rise, blunted by fat.",
    emoji: "🍝",
    mealSearch: { type: "name", term: "Fettucine alfredo" },
  },
  {
    id: "pizza-margherita",
    name: "Pizza Express Margherita",
    carbs: 55,
    impact: 4,
    note: "Dough plus cheese and oil — slow, prolonged rise that often peaks late.",
    emoji: "🍕",
    mealSearch: { type: "name", term: "Pizza Express Margherita" },
  },
  {
    id: "seafood-paella",
    name: "Paella",
    carbs: 55,
    impact: 4,
    note: "Rice-forward dish with seafood — real rise, moderated by protein.",
    emoji: "🥘",
    mealSearch: { type: "name", term: "Paella" },
  },
  {
    id: "bbq-sloppy-joes",
    name: "BBQ Pork Sloppy Joes",
    carbs: 42,
    impact: 5,
    note: "Sweet sauce and bun with fatty pork — moderate, drawn-out rise.",
    emoji: "🥪",
    mealSearch: { type: "name", term: "BBQ Pork Sloppy Joes" },
  },
  {
    id: "chicken-couscous",
    name: "Chicken Couscous",
    carbs: 50,
    impact: 5,
    note: "Semolina grain balanced by lean chicken and vegetables — steady rise.",
    emoji: "🍗",
    mealSearch: { type: "name", term: "Chicken Couscous" },
  },
  {
    id: "peanut-butter-cookies",
    name: "Peanut Butter Cookies",
    carbs: 22,
    impact: 6,
    note: "Sugar tempered by lots of peanut fat — smaller, slower spike than most cookies.",
    emoji: "🍪",
    mealSearch: { type: "name", term: "Peanut Butter Cookies" },
  },
  {
    id: "beef-wellington",
    name: "Beef Wellington",
    carbs: 28,
    impact: 7,
    note: "Thin pastry over lots of beef and mushrooms — gentle, delayed rise.",
    emoji: "🥩",
    mealSearch: { type: "name", term: "Beef Wellington" },
  },
  {
    id: "broccoli-stilton-soup",
    name: "Broccoli & Stilton Soup",
    carbs: 14,
    impact: 9,
    note: "Fiber-heavy vegetables with cheese and cream — barely moves glucose.",
    emoji: "🥦",
    mealSearch: { type: "name", term: "Broccoli" },
  },
];


export type Exercise = {
  id: string;
  name: string;
  duration: string;
  reduction: number; // estimated mg/dL reduction
  note: string;
  emoji: string;
};

export const EXERCISES: Exercise[] = [
  {
    id: "brisk-walk",
    name: "Brisk Walk",
    duration: "20–30 min",
    reduction: 30,
    note: "Gentle aerobic movement — safe, reliable glucose reduction.",
    emoji: "🚶",
  },
  {
    id: "cycling",
    name: "Cycling",
    duration: "30 min",
    reduction: 50,
    note: "Moderate-intensity cardio drops glucose steadily.",
    emoji: "🚴",
  },
  {
    id: "swimming",
    name: "Swimming",
    duration: "30 min",
    reduction: 60,
    note: "Full-body aerobic — strong sustained glucose reduction.",
    emoji: "🏊",
  },
  {
    id: "strength-training",
    name: "Strength Training",
    duration: "20 min",
    reduction: 20,
    note: "Can briefly raise then lower glucose; effect lasts hours.",
    emoji: "🏋️",
  },
];

export type Zone = "severe-low" | "low" | "in-range" | "high" | "severe-high";

export function zoneFor(mgdl: number): Zone {
  if (mgdl < 54) return "severe-low";
  if (mgdl < 70) return "low";
  if (mgdl <= 180) return "in-range";
  if (mgdl <= 400) return "high";
  return "severe-high";
}

export function zoneLabel(z: Zone): string {
  return {
    "severe-low": "Severe low",
    low: "Low",
    "in-range": "In range",
    high: "High",
    "severe-high": "Severe high",
  }[z];
}

export function zoneColor(z: Zone): string {
  return {
    "severe-low": "#7f1d1d",
    low: "#dc2626",
    "in-range": "#16a34a",
    high: "#6C2BD9",
    "severe-high": "#7f1d1d",
  }[z];
}

export function suggestFoods(mgdl: number, liked: string[]): Food[] {
  const z = zoneFor(mgdl);
  let pool: Food[];
  if (z === "severe-low" || z === "low") {
    pool = [...FOODS].sort((a, b) => a.impact - b.impact);
  } else if (z === "high" || z === "severe-high") {
    pool = [...FOODS].sort((a, b) => b.impact - a.impact);
  } else {
    pool = FOODS.filter((f) => f.impact >= 4 && f.impact <= 8);
  }
  pool = [...pool].sort((a, b) => {
    const la = liked.includes(a.id) ? 0 : 1;
    const lb = liked.includes(b.id) ? 0 : 1;
    return la - lb;
  });
  return pool.slice(0, 4);
}
