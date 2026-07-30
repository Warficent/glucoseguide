// Strict glycemic scoring.
//
// Impact is NOT a vibe score. It is derived from published glycemic index (GI)
// values for the dominant carbohydrate source in the recipe, combined with the
// recipe's carbohydrate content to produce a glycemic load (GL):
//
//   GL = GI x available carbohydrate (g) / 100
//
// GI values below are glucose-referenced (glucose = 100) and taken from the
// International Tables of Glycemic Index and Glycemic Load Values
// (Foster-Powell, Holt & Brand-Miller) and the University of Sydney GI database.
// Where a food has a published range, the HIGHER value is used so the score
// errs on the side of predicting a faster rise.
//
// The model follows the published evidence base:
//   - Jenkins 2002 (Am J Clin Nutr 76:266S): GI is glucose-referenced, a mixed
//     meal's GI is the carbohydrate-weighted average of its carb sources, and
//     GL is computed on AVAILABLE carbohydrate (total carb minus fibre).
//   - Rovner 2009 (J Am Diet Assoc 109:303): low GI = <= 55 glucose-referenced;
//     low-GI eating cut hyperglycaemia in children with T1D but did NOT reduce
//     time below 70 mg/dL.
//   - Quarta 2023 (Nutrients 15:3507): macronutrients shift the postprandial
//     curve differently, so high-fat plates get a delayed-rise warning.
//   - Zafar 2019 (Am J Clin Nutr): low-GI diets improved HbA1c and fasting
//     glucose but had NO effect on insulin requirements - never dose from these.
//   - Vega-Lopez 2018 / Brand-Miller commentary: published GI values vary
//     between labs and individuals, so every score carries a confidence tier.
//
// GI bands: low <= 55, medium 56-69, high >= 70.
// GL bands follow the standard clinical cut-offs: low <= 10, medium 11-19,
// high >= 20.

import type { Food } from "./data";
import { INGREDIENT_INDEX } from "./ingredient-index.generated";
import { MEASURE_INDEX } from "./measures.generated";
import { COMPOSITION, FAT_ONLY, measureToGrams, type Composition } from "./composition";

// Published GI (glucose = 100) for carbohydrate-bearing foods.
// Ingredients not listed here contribute negligible available carbohydrate
// (meat, fish, eggs, fats, herbs, spices, most non-starchy vegetables).
export const GI_TABLE: Record<string, number> = {
  // Sugars and syrups
  glucose: 100,
  "glucose syrup": 100,
  dextrose: 100,
  maltodextrin: 105,
  sugar: 65,
  "caster sugar": 65,
  "granulated sugar": 65,
  "white sugar": 65,
  "brown sugar": 64,
  "icing sugar": 65,
  "powdered sugar": 65,
  "demerara sugar": 65,
  "muscovado sugar": 64,
  "golden syrup": 63,
  "corn syrup": 75,
  treacle: 70,
  molasses: 55,
  honey: 61,
  "maple syrup": 54,
  "agave syrup": 15,
  jam: 51,
  marmalade: 48,
  "condensed milk": 61,
  "evaporated milk": 61,

  // Flours, breads, and baked goods
  flour: 71,
  "plain flour": 71,
  "all purpose flour": 71,
  "self-raising flour": 71,
  "self raising flour": 71,
  "strong bread flour": 71,
  "bread flour": 71,
  "wholemeal flour": 66,
  "whole wheat flour": 66,
  "rye flour": 45,
  "corn flour": 70,
  cornflour: 85,
  cornstarch: 85,
  "corn starch": 85,
  semolina: 66,
  bread: 75,
  "white bread": 75,
  "wholemeal bread": 74,
  baguette: 95,
  brioche: 70,
  ciabatta: 73,
  "bread roll": 73,
  bun: 73,
  bap: 73,
  breadcrumb: 74,
  panko: 74,
  crouton: 74,
  "pitta bread": 68,
  "naan bread": 71,
  tortilla: 52,
  "flour tortilla": 52,
  "corn tortilla": 52,
  "puff pastry": 59,
  "shortcrust pastry": 59,
  "filo pastry": 59,
  "phyllo dough": 59,
  "filo dough": 59,
  pastry: 59,

  "digestive biscuit": 62,
  biscuit: 62,
  "sponge cake": 46,
  cake: 54,
  "pizza base": 80,
  crumpet: 69,
  scone: 92,
  waffle: 76,
  pancake: 66,

  // Grains, rice, pasta
  rice: 73,
  "white rice": 73,
  "basmati rice": 58,
  "long grain rice": 68,
  "jasmine rice": 89,
  "arborio rice": 69,
  "risotto rice": 69,
  "brown rice": 68,
  "sticky rice": 87,
  "glutinous rice": 87,
  "rice flour": 95,
  "rice noodle": 61,
  pasta: 49,
  spaghetti: 49,
  penne: 49,
  macaroni: 47,
  fettuccine: 46,
  linguine: 46,
  tagliatelle: 46,
  lasagne: 49,
  "lasagne sheet": 49,
  noodle: 47,
  "egg noodle": 47,
  "udon noodle": 62,
  "soba noodle": 46,
  couscous: 65,
  bulgur: 48,
  quinoa: 53,
  barley: 28,
  "pearl barley": 28,
  oat: 55,
  oats: 55,
  "rolled oat": 55,
  "porridge oat": 55,
  polenta: 68,
  cornmeal: 68,
  grits: 69,
  grit: 69,
  hominy: 69,
  "corn kernel": 52,
  sweetcorn: 52,
  corn: 52,


  // Non-starchy vegetables and low-carb condiments.
  // Carrot (39) and tomato (38) have published glucose-referenced values; the
  // remaining non-starchy vegetables sit below the carbohydrate load needed for
  // a standard GI test, so the conventional low value of 15 is used and their
  // small carbohydrate contribution is still counted in the weighted average.
  tomato: 38,
  "beef tomato": 38,
  "cherry tomato": 38,
  "plum tomato": 38,
  "chopped tomato": 38,
  "tomato sauce": 38,
  "tomato puree": 38,
  passata: 38,
  carrot: 39,
  "green bean": 32,
  "chinese long bean": 32,
  onion: 15,
  "red onion": 15,
  shallot: 15,
  "spring onion": 15,
  scallion: 15,
  leek: 15,
  garlic: 15,
  "garlic clove": 15,
  aubergine: 15,
  "egg plant": 15,
  eggplant: 15,
  courgette: 15,
  zucchini: 15,
  cucumber: 15,
  pepper: 15,
  "red pepper": 15,
  "green pepper": 15,
  "yellow pepper": 15,
  "mixed pepper": 15,
  "bell pepper": 15,
  chilli: 15,
  "red chilli": 15,
  "green chilli": 15,
  mushroom: 15,
  "shiitake mushroom": 15,
  cabbage: 15,
  kale: 15,
  spinach: 15,
  celery: 15,
  fennel: 15,
  broccoli: 15,
  cauliflower: 15,
  lettuce: 15,
  olive: 15,
  "green olive": 15,
  "black olive": 15,
  "heart of palm": 15,
  "soy sauce": 20,
  "oyster sauce": 40,
  sherry: 40,
  "dry sherry": 40,
  sake: 40,

  // Starchy vegetables and legumes
  potato: 78,
  "new potato": 62,
  "baby potato": 62,
  "mashed potato": 87,
  "sweet potato": 63,
  yam: 54,
  parsnip: 52,
  "butternut squash": 51,
  pumpkin: 64,
  plantain: 55,
  cassava: 55,
  bean: 31,
  "black bean": 30,
  "kidney bean": 24,
  "cannellini bean": 31,
  "butter bean": 31,
  "baked bean": 40,
  chickpea: 28,
  lentil: 32,
  "red lentil": 26,
  pea: 51,
  "green pea": 51,
  "split pea": 25,

  // Dairy and plant milks
  milk: 39,
  "whole milk": 39,
  "semi skimmed milk": 37,
  "skimmed milk": 37,
  "coconut milk": 41,
  "soy milk": 34,
  "almond milk": 25,
  yogurt: 41,
  yoghurt: 41,
  "greek yogurt": 11,
  "greek yoghurt": 11,
  "ice cream": 57,
  "double cream": 30,
  "single cream": 30,
  "creme fraiche": 30,
  "sour cream": 30,

  // Fruit
  apple: 36,
  banana: 51,
  orange: 43,
  "orange juice": 50,
  "apple juice": 41,
  "pineapple juice": 46,
  pineapple: 59,
  mango: 51,
  grape: 53,
  raisin: 64,
  sultana: 56,
  date: 62,
  "dried apricot": 42,
  fig: 61,
  peach: 42,
  pear: 38,
  plum: 40,
  cherry: 22,
  strawberry: 40,
  raspberry: 32,
  blueberry: 53,
  watermelon: 76,
  melon: 65,
  kiwi: 50,
  lemon: 20,
  lime: 20,
  cranberry: 45,
  "dried cranberry": 64,
  prune: 29,
  apricot: 34,

  // Sweet extras
  chocolate: 40,
  "dark chocolate": 23,
  "milk chocolate": 43,
  "white chocolate": 44,
  "chocolate chip": 40,
  cocoa: 20,
  nutella: 33,
  marshmallow: 62,
  "sweetened condensed milk": 61,
  custard: 43,
  "rice pudding": 62,
  "sponge finger": 46,
  "graham cracker": 74,

  // Other carb contributors
  "tomato ketchup": 55,
  ketchup: 55,
  "sweet chilli sauce": 60,
  "hoisin sauce": 58,
  "bbq sauce": 60,
  "baked bean sauce": 40,
  beer: 66,
  cider: 40,
  "white wine": 15,
  "red wine": 15,
  nut: 15,
  peanut: 14,
  "peanut butter": 14,
  almond: 15,
  cashew: 25,
  walnut: 15,
  "ground almond": 15,
  "desiccated coconut": 45,
  coconut: 45,
};
// If we cannot identify any carbohydrate source, we assume a mixed refined
// meal (GI 70). This is deliberately conservative: it predicts a faster rise
// than most unknown dishes actually cause.
export const DEFAULT_GI = 70;

/**
 * Share of the meal's carbohydrate that a single high-GI source must supply
 * before we abandon the weighted average and use that source's GI directly.
 * A safety ceiling: it stops a rice- or sugar-dominated plate from being
 * averaged down by low-GI side ingredients.
 */
const DOMINANCE_THRESHOLD = 0.4;

export type Confidence = "measured" | "derived" | "estimated";

export type CarbContributor = {
  /** Normalized ingredient name as printed in the recipe. */
  ingredient: string;
  /** GI table key the value came from. */
  giKey: string;
  gi: number;
  /** Estimated grams of carbohydrate this ingredient contributes. */
  carbGrams: number;
  /** Fraction of the recipe's carbohydrate, 0-1. */
  share: number;
};

export type GlycemicResult = {
  /** Carbohydrate-weighted meal GI (Jenkins 2002 mixed-meal model). */
  gi: number;
  /** Glycemic load computed on available carbohydrate. */
  gl: number;
  /** Total carbohydrate for the serving, as stated on the recipe. */
  carbs: number;
  /** Estimated fibre grams for the serving. */
  fibre: number;
  /** carbs - fibre, the available carbohydrate GL is computed from. */
  availableCarbs: number;
  /** Estimated fat grams for the serving; drives the delayed-rise flag. */
  fat: number;
  /** True when fat is high enough to delay and prolong the rise. */
  delayedRise: boolean;
  /** The largest carbohydrate contributor, or null when none was identified. */
  source: string | null;
  /** True when the weighted average was overridden by a dominant high-GI source. */
  dominated: boolean;
  /** How well grounded the number is. */
  confidence: Confidence;
  /** Every identified carbohydrate source, largest share first. */
  contributors: CarbContributor[];
  /** Kept for older callers: false when nothing could be identified. */
  verified: boolean;
};

export function lookupGI(ingredient: string): { gi: number; key: string } | null {
  // The ingredient index is naively singularized ("couscous" -> "couscou"),
  // so test both forms.
  const base = ingredient.toLowerCase().trim();
  const ing = GI_TABLE[base] === undefined && GI_TABLE[base + "s"] !== undefined ? base + "s" : base;
  if (GI_TABLE[ing] !== undefined) return { gi: GI_TABLE[ing], key: ing };
  // Otherwise match a table key that appears as whole words inside the
  // ingredient name ("basmati rice" -> "rice", "cherry tomato" -> no match).
  // Substring matching is deliberately word-bounded so "water" can never be
  // read as "watermelon".
  let best: { gi: number; key: string } | null = null;
  for (const key of Object.keys(GI_TABLE)) {
    const re = new RegExp(`(^|\\s)${key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(s)?($|\\s)`);
    if (re.test(ing) || re.test(ing + "s")) {
      if (!best || key.length > best.key.length) best = { gi: GI_TABLE[key], key };
    }
  }
  return best;
}

export function lookupComposition(ingredient: string, giKey: string | null): Composition | null {
  const base = ingredient.toLowerCase().trim();
  if (COMPOSITION[base]) return COMPOSITION[base];
  if (COMPOSITION[base + "s"]) return COMPOSITION[base + "s"];
  if (giKey && COMPOSITION[giKey]) return COMPOSITION[giKey];
  let best: { key: string; comp: Composition } | null = null;
  for (const key of Object.keys(COMPOSITION)) {
    const re = new RegExp(`(^|\\s)${key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(s)?($|\\s)`);
    if (re.test(base) || re.test(base + "s")) {
      if (!best || key.length > best.key.length) best = { key, comp: COMPOSITION[key] };
    }
  }
  return best ? best.comp : null;
}

function lookupFat(ingredient: string): number | null {
  const base = ingredient.toLowerCase().trim();
  if (FAT_ONLY[base] !== undefined) return FAT_ONLY[base];
  let best: { key: string; fat: number } | null = null;
  for (const key of Object.keys(FAT_ONLY)) {
    const re = new RegExp(`(^|\\s)${key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(s)?($|\\s)`);
    if (re.test(base)) {
      if (!best || key.length > best.key.length) best = { key, fat: FAT_ONLY[key] };
    }
  }
  return best ? best.fat : null;
}

/**
 * Evidence-based glycemic profile for a plated recipe.
 *
 * Jenkins 2002: a mixed meal's GI is the carbohydrate-weighted average of its
 * carbohydrate sources, applied to *available* carbohydrate (total carb minus
 * fibre). Quarta 2023: fat and protein shift the postprandial curve, so a
 * high-fat, high-carb plate needs its own warning rather than a lower score.
 */
export function glycemicForRecipe(food: Food): GlycemicResult {
  const measured = MEASURE_INDEX[food.id] ?? [];
  const names = measured.length
    ? measured
    : (INGREDIENT_INDEX[food.id] ?? []).map((name) => ({ name, measure: "" }));

  let rawCarb = 0;
  let rawFibre = 0;
  let rawFat = 0;
  const raw: { ingredient: string; giKey: string; gi: number; carbGrams: number; exact: boolean }[] = [];

  for (const { name, measure } of names) {
    const grams = measureToGrams(measure, name);
    const hit = lookupGI(name);
    const comp = lookupComposition(name, hit ? hit.key : null);

    if (comp) {
      // Without a usable measure, assume a modest 100 g so the ingredient still
      // counts toward the weighting instead of vanishing.
      const g = grams ?? 100;
      const carbGrams = (g * comp.carb) / 100;
      rawFibre += (g * comp.fibre) / 100;
      rawFat += (g * comp.fat) / 100;
      if (hit && carbGrams > 0.5) {
        rawCarb += carbGrams;
        raw.push({
          ingredient: name,
          giKey: hit.key,
          gi: hit.gi,
          carbGrams,
          exact: GI_TABLE[name.toLowerCase().trim()] !== undefined,
        });
      }
    }

    const fatPct = lookupFat(name);
    if (fatPct !== null) rawFat += ((grams ?? 30) * fatPct) / 100;
  }

  if (rawCarb <= 0) {
    const availableCarbs = food.carbs;
    const gl = Math.round((DEFAULT_GI * availableCarbs) / 100);
    return {
      gi: DEFAULT_GI,
      gl,
      carbs: food.carbs,
      fibre: 0,
      availableCarbs,
      fat: 0,
      delayedRise: false,
      source: null,
      dominated: false,
      confidence: "estimated",
      contributors: [],
      verified: false,
    };
  }

  const contributors: CarbContributor[] = raw
    .map((c) => ({
      ingredient: c.ingredient,
      giKey: c.giKey,
      gi: c.gi,
      carbGrams: Math.round((c.carbGrams / rawCarb) * food.carbs * 10) / 10,
      share: c.carbGrams / rawCarb,
    }))
    .sort((a, b) => b.share - a.share);

  const weightedGI = Math.round(
    raw.reduce((sum, c) => sum + c.gi * c.carbGrams, 0) / rawCarb,
  );

  // Safety ceiling: a dominant high-GI source sets the meal GI on its own.
  const highest = raw.reduce((a, b) => (b.gi > a.gi ? b : a));
  const highestShare = highest.carbGrams / rawCarb;
  const dominated = highestShare >= DOMINANCE_THRESHOLD && highest.gi > weightedGI;
  const gi = dominated ? highest.gi : weightedGI;

  // Scale fibre and fat to the stated serving using the carbohydrate ratio, so
  // they stay consistent with the per-serving carb figure the app shows.
  const scale = food.carbs / rawCarb;
  const fibre = Math.min(Math.round(rawFibre * scale), Math.round(food.carbs * 0.5));
  const fat = Math.round(rawFat * scale);
  const availableCarbs = Math.max(food.carbs - fibre, 0);
  const gl = Math.round((gi * availableCarbs) / 100);

  const top = contributors[0];
  const confidence: Confidence =
    top && top.share >= 0.5 && raw.find((r) => r.giKey === top.giKey)?.exact
      ? "measured"
      : "derived";

  return {
    gi,
    gl,
    carbs: food.carbs,
    fibre,
    availableCarbs,
    fat,
    // High fat alongside meaningful carbohydrate blunts the early rise and
    // pushes it later (Jenkins 2002; Quarta 2023).
    delayedRise: fat >= 25 && food.carbs >= 30,
    source: dominated ? highest.giKey : (top?.giKey ?? null),
    dominated,
    confidence,
    contributors,
    verified: true,
  };
}

/**
 * Rescale a computed result to a different portion size.
 *
 * GI is intensive — it describes the quality of the carbohydrate, not how much
 * of it is on the plate — so it is unchanged. Carbohydrate, fibre and fat all
 * scale linearly with the portion, and the glycemic load is recomputed from the
 * scaled available carbohydrate, since GL is what actually tracks the size of
 * the rise. The delayed-rise flag is re-evaluated at the scaled fat and carb
 * amounts, so a half portion can drop below the threshold.
 */
export function scaleGlycemic(result: GlycemicResult, factor: number): GlycemicResult {
  if (factor === 1) return result;
  const carbs = Math.round(result.carbs * factor);
  const fibre = Math.round(result.fibre * factor);
  const fat = Math.round(result.fat * factor);
  const availableCarbs = Math.max(carbs - fibre, 0);
  return {
    ...result,
    carbs,
    fibre,
    fat,
    availableCarbs,
    gl: Math.round((result.gi * availableCarbs) / 100),
    delayedRise: fat >= 25 && carbs >= 30,
    contributors: result.contributors.map((c) => ({
      ...c,
      carbGrams: Math.round(c.carbGrams * factor * 10) / 10,
    })),
  };
}

/**
 * Glycemic load -> 1-10 impact, where 1 raises glucose the most.
 * Bands are anchored on the clinical GL cut-offs (low <=10, medium 11-19,
 * high >=20) and extended above 20 for very high-load plates.
 */
export function impactFromGL(gl: number): number {
  if (gl >= 45) return 1;
  if (gl >= 38) return 2;
  if (gl >= 31) return 3;
  if (gl >= 25) return 4;
  if (gl >= 20) return 5;
  if (gl >= 15) return 6;
  if (gl >= 11) return 7;
  if (gl >= 7) return 8;
  if (gl >= 3) return 9;
  return 10;
}

export function glBand(gl: number): "Low" | "Medium" | "High" {
  if (gl <= 10) return "Low";
  if (gl <= 19) return "Medium";
  return "High";
}

/**
 * GI category using the glucose-referenced cut-offs Rovner 2009 used to build
 * its low-GI arm, and that Jenkins 2002 describes: low <=55, medium 56-69,
 * high >=70.
 */
export function giBand(gi: number): "Low" | "Medium" | "High" {
  if (gi <= 55) return "Low";
  if (gi <= 69) return "Medium";
  return "High";
}

export function confidenceLabel(c: Confidence): string {
  if (c === "measured") return "Measured";
  if (c === "derived") return "Derived";
  return "Estimated";
}

export function confidenceExplanation(c: Confidence): string {
  if (c === "measured") {
    return "The dominant carbohydrate in this recipe has a directly published, glucose-referenced GI value.";
  }
  if (c === "derived") {
    return "No single ingredient dominates, so the GI is a carbohydrate-weighted average of several published values.";
  }
  return "No carbohydrate source in this recipe could be matched to a published GI, so a conservative mixed-refined-meal value is assumed. Treat this number with extra caution.";
}
