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
// GL bands follow the standard clinical cut-offs: low <= 10, medium 11-19,
// high >= 20.

import type { Food } from "./data";
import { INGREDIENT_INDEX } from "./ingredient-index.generated";

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
  "corn kernel": 52,
  sweetcorn: 52,
  corn: 52,

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

export type GlycemicResult = {
  gi: number;
  gl: number;
  /** The ingredient the GI value came from, or null when estimated. */
  source: string | null;
  /** false when no carbohydrate source could be identified in the recipe. */
  verified: boolean;
};

function lookupGI(ingredient: string): { gi: number; key: string } | null {
  const ing = ingredient.toLowerCase().trim();
  if (GI_TABLE[ing] !== undefined) return { gi: GI_TABLE[ing], key: ing };
  // Otherwise match a table key that appears as whole words inside the
  // ingredient name ("basmati rice" -> "rice", "cherry tomato" -> no match).
  // Substring matching is deliberately word-bounded so "water" can never be
  // read as "watermelon".
  let best: { gi: number; key: string } | null = null;
  for (const key of Object.keys(GI_TABLE)) {
    const re = new RegExp(`(^|\\s)${key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(s)?($|\\s)`);
    if (re.test(ing)) {
      if (!best || key.length > best.key.length) best = { gi: GI_TABLE[key], key };
    }
  }
  return best;
}

/**
 * Highest published GI among the recipe's identifiable carbohydrate sources.
 * Highest (not average) so the rating never under-predicts a spike.
 */
export function glycemicForRecipe(food: Food): GlycemicResult {
  const ings = INGREDIENT_INDEX[food.id] ?? [];
  let top: { gi: number; key: string } | null = null;
  for (const ing of ings) {
    const hit = lookupGI(ing);
    if (hit && (!top || hit.gi > top.gi)) top = hit;
  }
  const gi = top ? top.gi : DEFAULT_GI;
  const gl = Math.round((gi * food.carbs) / 100);
  return { gi, gl, source: top ? top.key : null, verified: Boolean(top) };
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
