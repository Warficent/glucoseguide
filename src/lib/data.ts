export type Food = {
  id: string;
  name: string;
  carbs: number;
  impact: number; // 1 raises BG most, 10 raises BG least
  note: string;
  emoji: string;
  // TheMealDB search term. Prefer a single ingredient (filter.php?i=)
  // that reliably returns meals for the food.
  mealSearch: { type: "ingredient" | "name"; term: string };
};

export const FOODS: Food[] = [
  {
    id: "honeycrisp-apple",
    name: "Honeycrisp Apple",
    carbs: 25,
    impact: 6,
    note: "Natural sugars with fiber slow absorption for a moderate rise.",
    emoji: "🍎",
    mealSearch: { type: "name", term: "apple" },
  },
  {
    id: "horchata",
    name: "Horchata",
    carbs: 38,
    impact: 2,
    note: "Sweetened rice-milk drink hits fast — great for lows.",
    emoji: "🥛",
    mealSearch: { type: "ingredient", term: "rice" },
  },
  {
    id: "hot-dog",
    name: "Hot Dog",
    carbs: 22,
    impact: 7,
    note: "Fat and protein blunt the bun's carbs, causing a slower rise.",
    emoji: "🌭",
    mealSearch: { type: "ingredient", term: "sausages" },
  },
  {
    id: "meat-ravioli",
    name: "Meat Ravioli",
    carbs: 40,
    impact: 5,
    note: "Pasta with meat and cheese produces a moderate, delayed rise.",
    emoji: "🥟",
    mealSearch: { type: "name", term: "ravioli" },
  },
  {
    id: "orange-juice",
    name: "Orange Juice",
    carbs: 26,
    impact: 1,
    note: "Liquid sugar absorbs almost instantly — classic low treatment.",
    emoji: "🧃",
    mealSearch: { type: "ingredient", term: "orange" },
  },
  {
    id: "lays-original",
    name: "Lay's Original Chips",
    carbs: 15,
    impact: 6,
    note: "Fat slows the starch, giving a moderate rise over time.",
    emoji: "🥔",
    mealSearch: { type: "ingredient", term: "potatoes" },
  },
  {
    id: "peanut-butter",
    name: "Peanut Butter",
    carbs: 7,
    impact: 10,
    note: "High fat, high protein, low carb — barely moves glucose.",
    emoji: "🥜",
    mealSearch: { type: "ingredient", term: "peanut butter" },
  },
  {
    id: "pizza-slice",
    name: "Pizza Slice",
    carbs: 36,
    impact: 4,
    note: "Fat and cheese cause a slow, prolonged rise that often peaks late.",
    emoji: "🍕",
    mealSearch: { type: "name", term: "pizza" },
  },
  {
    id: "potato-fries",
    name: "Potato Fries",
    carbs: 45,
    impact: 3,
    note: "Starchy potato plus grease produces a strong, sustained rise.",
    emoji: "🍟",
    mealSearch: { type: "ingredient", term: "potatoes" },
  },
  {
    id: "raw-broccoli",
    name: "Raw Broccoli",
    carbs: 6,
    impact: 10,
    note: "Fiber-heavy and low carb — almost no glucose impact.",
    emoji: "🥦",
    mealSearch: { type: "ingredient", term: "broccoli" },
  },
  {
    id: "seafood-paella",
    name: "Seafood Paella",
    carbs: 55,
    impact: 4,
    note: "Rice-heavy dish with protein — significant rise, somewhat blunted.",
    emoji: "🥘",
    mealSearch: { type: "name", term: "paella" },
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
