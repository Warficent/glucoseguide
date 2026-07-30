// AUTO-USED BY src/lib/glycemic.ts — composition tables and measure parsing.
//
// Carbohydrate, fibre and fat content per 100 g of edible portion, used to
// weight each carbohydrate source by how much of it a recipe actually
// contains. Values are rounded figures from USDA FoodData Central / McCance &
// Widdowson. They are approximations for the purposes of *ranking* recipes and
// are not a substitute for a nutrition label.

export type Composition = { carb: number; fibre: number; fat: number };

export const COMPOSITION: Record<string, Composition> = {
  // Sugars and syrups
  glucose: { carb: 100, fibre: 0, fat: 0 },
  "glucose syrup": { carb: 82, fibre: 0, fat: 0 },
  dextrose: { carb: 100, fibre: 0, fat: 0 },
  maltodextrin: { carb: 95, fibre: 0, fat: 0 },
  sugar: { carb: 100, fibre: 0, fat: 0 },
  "caster sugar": { carb: 100, fibre: 0, fat: 0 },
  "granulated sugar": { carb: 100, fibre: 0, fat: 0 },
  "white sugar": { carb: 100, fibre: 0, fat: 0 },
  "brown sugar": { carb: 98, fibre: 0, fat: 0 },
  "icing sugar": { carb: 100, fibre: 0, fat: 0 },
  "powdered sugar": { carb: 100, fibre: 0, fat: 0 },
  "demerara sugar": { carb: 99, fibre: 0, fat: 0 },
  "muscovado sugar": { carb: 98, fibre: 0, fat: 0 },
  "golden syrup": { carb: 79, fibre: 0, fat: 0 },
  "corn syrup": { carb: 77, fibre: 0, fat: 0 },
  treacle: { carb: 75, fibre: 0, fat: 0 },
  molasses: { carb: 75, fibre: 0, fat: 0 },
  honey: { carb: 82, fibre: 0, fat: 0 },
  "maple syrup": { carb: 67, fibre: 0, fat: 0 },
  "agave syrup": { carb: 76, fibre: 0, fat: 0 },
  jam: { carb: 65, fibre: 1, fat: 0 },
  marmalade: { carb: 65, fibre: 1, fat: 0 },
  "condensed milk": { carb: 54, fibre: 0, fat: 9 },
  "sweetened condensed milk": { carb: 54, fibre: 0, fat: 9 },
  "evaporated milk": { carb: 10, fibre: 0, fat: 8 },

  // Flours, breads, baked goods
  flour: { carb: 76, fibre: 3, fat: 1 },
  "plain flour": { carb: 76, fibre: 3, fat: 1 },
  "all purpose flour": { carb: 76, fibre: 3, fat: 1 },
  "self-raising flour": { carb: 75, fibre: 3, fat: 1 },
  "self raising flour": { carb: 75, fibre: 3, fat: 1 },
  "strong bread flour": { carb: 73, fibre: 3, fat: 1 },
  "bread flour": { carb: 73, fibre: 3, fat: 1 },
  "wholemeal flour": { carb: 64, fibre: 11, fat: 2 },
  "whole wheat flour": { carb: 64, fibre: 11, fat: 2 },
  "rye flour": { carb: 69, fibre: 15, fat: 2 },
  "corn flour": { carb: 76, fibre: 7, fat: 4 },
  cornflour: { carb: 91, fibre: 1, fat: 0 },
  cornstarch: { carb: 91, fibre: 1, fat: 0 },
  "corn starch": { carb: 91, fibre: 1, fat: 0 },
  semolina: { carb: 73, fibre: 4, fat: 1 },
  bread: { carb: 49, fibre: 3, fat: 3 },
  "white bread": { carb: 49, fibre: 3, fat: 3 },
  "wholemeal bread": { carb: 41, fibre: 7, fat: 3 },
  baguette: { carb: 55, fibre: 3, fat: 2 },
  brioche: { carb: 48, fibre: 2, fat: 15 },
  ciabatta: { carb: 52, fibre: 3, fat: 3 },
  "bread roll": { carb: 50, fibre: 3, fat: 3 },
  bun: { carb: 50, fibre: 3, fat: 4 },
  bap: { carb: 50, fibre: 3, fat: 3 },
  breadcrumb: { carb: 72, fibre: 5, fat: 5 },
  panko: { carb: 72, fibre: 4, fat: 3 },
  crouton: { carb: 64, fibre: 5, fat: 15 },
  "pitta bread": { carb: 55, fibre: 3, fat: 1 },
  "naan bread": { carb: 50, fibre: 2, fat: 6 },
  tortilla: { carb: 52, fibre: 3, fat: 8 },
  "flour tortilla": { carb: 52, fibre: 3, fat: 8 },
  "corn tortilla": { carb: 45, fibre: 6, fat: 3 },
  "puff pastry": { carb: 36, fibre: 2, fat: 26 },
  "shortcrust pastry": { carb: 41, fibre: 2, fat: 26 },
  "filo pastry": { carb: 55, fibre: 2, fat: 3 },
  pastry: { carb: 40, fibre: 2, fat: 24 },
  "digestive biscuit": { carb: 66, fibre: 3, fat: 21 },
  biscuit: { carb: 66, fibre: 2, fat: 20 },
  "graham cracker": { carb: 71, fibre: 3, fat: 12 },
  "sponge cake": { carb: 55, fibre: 1, fat: 12 },
  cake: { carb: 55, fibre: 1, fat: 15 },
  "sponge finger": { carb: 71, fibre: 1, fat: 6 },
  "pizza base": { carb: 50, fibre: 2, fat: 4 },
  crumpet: { carb: 38, fibre: 2, fat: 1 },
  scone: { carb: 54, fibre: 2, fat: 15 },
  waffle: { carb: 33, fibre: 1, fat: 14 },
  pancake: { carb: 28, fibre: 1, fat: 9 },

  // Grains, rice, pasta (dry weight unless stated)
  rice: { carb: 78, fibre: 1, fat: 1 },
  "white rice": { carb: 78, fibre: 1, fat: 1 },
  "basmati rice": { carb: 78, fibre: 1, fat: 1 },
  "long grain rice": { carb: 78, fibre: 1, fat: 1 },
  "jasmine rice": { carb: 79, fibre: 1, fat: 1 },
  "arborio rice": { carb: 79, fibre: 1, fat: 1 },
  "risotto rice": { carb: 79, fibre: 1, fat: 1 },
  "brown rice": { carb: 72, fibre: 4, fat: 3 },
  "sticky rice": { carb: 80, fibre: 1, fat: 0 },
  "glutinous rice": { carb: 80, fibre: 1, fat: 0 },
  "rice flour": { carb: 80, fibre: 2, fat: 1 },
  "rice noodle": { carb: 80, fibre: 2, fat: 1 },
  pasta: { carb: 75, fibre: 3, fat: 2 },
  spaghetti: { carb: 75, fibre: 3, fat: 2 },
  penne: { carb: 75, fibre: 3, fat: 2 },
  macaroni: { carb: 75, fibre: 3, fat: 2 },
  fettuccine: { carb: 75, fibre: 3, fat: 2 },
  linguine: { carb: 75, fibre: 3, fat: 2 },
  tagliatelle: { carb: 75, fibre: 3, fat: 2 },
  lasagne: { carb: 75, fibre: 3, fat: 2 },
  "lasagne sheet": { carb: 75, fibre: 3, fat: 2 },
  noodle: { carb: 71, fibre: 3, fat: 5 },
  "egg noodle": { carb: 71, fibre: 3, fat: 5 },
  "udon noodle": { carb: 57, fibre: 3, fat: 1 },
  "soba noodle": { carb: 74, fibre: 5, fat: 1 },
  couscous: { carb: 72, fibre: 5, fat: 1 },
  bulgur: { carb: 76, fibre: 18, fat: 1 },
  quinoa: { carb: 64, fibre: 7, fat: 6 },
  barley: { carb: 73, fibre: 17, fat: 1 },
  "pearl barley": { carb: 78, fibre: 15, fat: 1 },
  oat: { carb: 66, fibre: 11, fat: 7 },
  oats: { carb: 66, fibre: 11, fat: 7 },
  "rolled oat": { carb: 66, fibre: 11, fat: 7 },
  "porridge oat": { carb: 66, fibre: 11, fat: 7 },
  polenta: { carb: 79, fibre: 7, fat: 2 },
  cornmeal: { carb: 79, fibre: 7, fat: 2 },
  grits: { carb: 79, fibre: 4, fat: 1 },
  grit: { carb: 79, fibre: 4, fat: 1 },
  hominy: { carb: 22, fibre: 4, fat: 1 },
  "phyllo dough": { carb: 55, fibre: 2, fat: 3 },
  "filo dough": { carb: 55, fibre: 2, fat: 3 },
  "corn kernel": { carb: 19, fibre: 2, fat: 1 },
  sweetcorn: { carb: 19, fibre: 2, fat: 1 },
  corn: { carb: 19, fibre: 2, fat: 1 },

  // Starchy vegetables and legumes
  potato: { carb: 17, fibre: 2, fat: 0 },
  "new potato": { carb: 16, fibre: 2, fat: 0 },
  "baby potato": { carb: 16, fibre: 2, fat: 0 },
  "mashed potato": { carb: 15, fibre: 2, fat: 4 },
  "sweet potato": { carb: 20, fibre: 3, fat: 0 },
  yam: { carb: 28, fibre: 4, fat: 0 },
  parsnip: { carb: 18, fibre: 5, fat: 0 },
  "butternut squash": { carb: 12, fibre: 2, fat: 0 },
  pumpkin: { carb: 7, fibre: 1, fat: 0 },
  plantain: { carb: 32, fibre: 2, fat: 0 },
  cassava: { carb: 38, fibre: 2, fat: 0 },
  bean: { carb: 21, fibre: 7, fat: 1 },
  "black bean": { carb: 24, fibre: 9, fat: 1 },
  "kidney bean": { carb: 23, fibre: 7, fat: 1 },
  "cannellini bean": { carb: 21, fibre: 6, fat: 1 },
  "butter bean": { carb: 20, fibre: 6, fat: 0 },
  "baked bean": { carb: 13, fibre: 4, fat: 1 },
  chickpea: { carb: 27, fibre: 8, fat: 3 },
  lentil: { carb: 20, fibre: 8, fat: 0 },
  "red lentil": { carb: 20, fibre: 8, fat: 0 },
  pea: { carb: 14, fibre: 5, fat: 0 },
  "green pea": { carb: 14, fibre: 5, fat: 0 },
  "split pea": { carb: 21, fibre: 8, fat: 0 },

  // Dairy and plant milks
  milk: { carb: 5, fibre: 0, fat: 4 },
  "whole milk": { carb: 5, fibre: 0, fat: 4 },
  "semi skimmed milk": { carb: 5, fibre: 0, fat: 2 },
  "skimmed milk": { carb: 5, fibre: 0, fat: 0 },
  "coconut milk": { carb: 3, fibre: 0, fat: 21 },
  "soy milk": { carb: 3, fibre: 0, fat: 2 },
  "almond milk": { carb: 1, fibre: 0, fat: 1 },
  yogurt: { carb: 5, fibre: 0, fat: 3 },
  yoghurt: { carb: 5, fibre: 0, fat: 3 },
  "greek yogurt": { carb: 4, fibre: 0, fat: 5 },
  "greek yoghurt": { carb: 4, fibre: 0, fat: 5 },
  "ice cream": { carb: 24, fibre: 1, fat: 11 },
  "double cream": { carb: 3, fibre: 0, fat: 48 },
  "heavy cream": { carb: 3, fibre: 0, fat: 37 },
  "single cream": { carb: 4, fibre: 0, fat: 19 },
  "creme fraiche": { carb: 3, fibre: 0, fat: 30 },
  "sour cream": { carb: 4, fibre: 0, fat: 20 },
  custard: { carb: 16, fibre: 0, fat: 3 },
  "rice pudding": { carb: 16, fibre: 0, fat: 2 },

  // Fruit
  apple: { carb: 14, fibre: 2, fat: 0 },
  "bramley apple": { carb: 12, fibre: 2, fat: 0 },
  banana: { carb: 23, fibre: 3, fat: 0 },
  orange: { carb: 12, fibre: 2, fat: 0 },
  "orange juice": { carb: 10, fibre: 0, fat: 0 },
  "apple juice": { carb: 11, fibre: 0, fat: 0 },
  "pineapple juice": { carb: 13, fibre: 0, fat: 0 },
  pineapple: { carb: 13, fibre: 1, fat: 0 },
  mango: { carb: 15, fibre: 2, fat: 0 },
  grape: { carb: 18, fibre: 1, fat: 0 },
  raisin: { carb: 79, fibre: 4, fat: 0 },
  sultana: { carb: 79, fibre: 4, fat: 0 },
  date: { carb: 75, fibre: 8, fat: 0 },
  "dried apricot": { carb: 63, fibre: 7, fat: 1 },
  apricot: { carb: 11, fibre: 2, fat: 0 },
  fig: { carb: 19, fibre: 3, fat: 0 },
  peach: { carb: 10, fibre: 2, fat: 0 },
  pear: { carb: 15, fibre: 3, fat: 0 },
  plum: { carb: 11, fibre: 1, fat: 0 },
  prune: { carb: 64, fibre: 7, fat: 0 },
  cherry: { carb: 16, fibre: 2, fat: 0 },
  strawberry: { carb: 8, fibre: 2, fat: 0 },
  raspberry: { carb: 12, fibre: 7, fat: 1 },
  blueberry: { carb: 14, fibre: 2, fat: 0 },
  watermelon: { carb: 8, fibre: 0, fat: 0 },
  melon: { carb: 8, fibre: 1, fat: 0 },
  kiwi: { carb: 15, fibre: 3, fat: 1 },
  lemon: { carb: 9, fibre: 3, fat: 0 },
  lime: { carb: 11, fibre: 3, fat: 0 },
  cranberry: { carb: 12, fibre: 4, fat: 0 },
  "dried cranberry": { carb: 82, fibre: 6, fat: 1 },

  // Sweet extras
  chocolate: { carb: 55, fibre: 5, fat: 33 },
  "dark chocolate": { carb: 46, fibre: 11, fat: 43 },
  "milk chocolate": { carb: 59, fibre: 3, fat: 30 },
  "white chocolate": { carb: 59, fibre: 0, fat: 32 },
  "chocolate chip": { carb: 63, fibre: 6, fat: 30 },
  "white chocolate chip": { carb: 59, fibre: 0, fat: 32 },
  cocoa: { carb: 58, fibre: 33, fat: 14 },
  nutella: { carb: 57, fibre: 3, fat: 31 },
  marshmallow: { carb: 81, fibre: 0, fat: 0 },
  "miniature marshmallow": { carb: 81, fibre: 0, fat: 0 },

  // Sauces and other carb contributors
  "tomato ketchup": { carb: 26, fibre: 0, fat: 0 },
  ketchup: { carb: 26, fibre: 0, fat: 0 },
  "sweet chilli sauce": { carb: 45, fibre: 0, fat: 0 },
  "hoisin sauce": { carb: 44, fibre: 3, fat: 1 },
  "bbq sauce": { carb: 41, fibre: 1, fat: 0 },
  "baked bean sauce": { carb: 13, fibre: 3, fat: 0 },
  beer: { carb: 4, fibre: 0, fat: 0 },
  cider: { carb: 4, fibre: 0, fat: 0 },
  "white wine": { carb: 3, fibre: 0, fat: 0 },
  "red wine": { carb: 3, fibre: 0, fat: 0 },

  // Nuts (low carb, high fat — matter for the delayed-rise flag)
  nut: { carb: 20, fibre: 7, fat: 50 },
  peanut: { carb: 16, fibre: 9, fat: 49 },
  "peanut butter": { carb: 20, fibre: 6, fat: 50 },
  almond: { carb: 22, fibre: 12, fat: 50 },
  "ground almond": { carb: 22, fibre: 12, fat: 50 },
  "flaked almond": { carb: 22, fibre: 12, fat: 50 },
  cashew: { carb: 30, fibre: 3, fat: 44 },
  walnut: { carb: 14, fibre: 7, fat: 65 },
  coconut: { carb: 15, fibre: 9, fat: 33 },
  "desiccated coconut": { carb: 24, fibre: 16, fat: 65 },
};

// Fat-dominant, effectively carb-free ingredients. They contribute nothing to
// glycemic load but do drive the delayed-rise flag (Jenkins 2002; Quarta 2023).
export const FAT_ONLY: Record<string, number> = {
  butter: 81,
  "salted butter": 81,
  "unsalted butter": 81,
  ghee: 100,
  lard: 100,
  "olive oil": 100,
  "vegetable oil": 100,
  "sunflower oil": 100,
  "sesame oil": 100,
  "coconut oil": 100,
  oil: 100,
  cheese: 33,
  cheddar: 34,
  "cheddar cheese": 34,
  parmesan: 29,
  "parmesan cheese": 29,
  mozzarella: 22,
  "cream cheese": 34,
  feta: 21,
  bacon: 42,
  "streaky bacon": 42,
  chorizo: 38,
  sausage: 28,
  mayonnaise: 75,
  "sesame seed": 50,
};

// Grams per cup, by ingredient, for volume measures. Falls back to 150 g.
const CUP_GRAMS: Record<string, number> = {
  flour: 120,
  "plain flour": 120,
  "self-raising flour": 120,
  "self raising flour": 120,
  "all purpose flour": 120,
  "bread flour": 127,
  "strong bread flour": 127,
  "wholemeal flour": 120,
  "whole wheat flour": 120,
  sugar: 200,
  "caster sugar": 200,
  "granulated sugar": 200,
  "brown sugar": 213,
  "icing sugar": 120,
  "powdered sugar": 120,
  rice: 185,
  "white rice": 185,
  "basmati rice": 185,
  "brown rice": 185,
  oat: 90,
  oats: 90,
  "rolled oat": 90,
  breadcrumb: 108,
  panko: 60,
  milk: 240,
  water: 240,
  cream: 240,
  "heavy cream": 240,
  "double cream": 240,
  stock: 240,
  "chocolate chip": 170,
  "white chocolate chip": 170,
  butter: 227,
  cocoa: 85,
  honey: 340,
  "maple syrup": 322,
  yogurt: 245,
  yoghurt: 245,
};

// Grams for a single countable item, used for bare-number measures.
const ITEM_GRAMS: Record<string, number> = {
  egg: 50,
  "free-range eggs beaten": 50,
  potato: 170,
  onion: 110,
  "red onion": 110,
  garlic: 5,
  "garlic clove": 5,
  clove: 3,
  carrot: 60,
  apple: 180,
  "bramley apple": 200,
  banana: 118,
  orange: 130,
  lemon: 84,
  lime: 67,
  tomato: 120,
  pepper: 120,
  "bell pepper": 120,
  courgette: 200,
  aubergine: 250,
  "chicken breast": 170,
  tortilla: 45,
  "corn tortilla": 25,
  bread: 30,
  slice: 30,
  bun: 60,
  "bread roll": 60,
  plantain: 180,
};

const UNICODE_FRACTIONS: Record<string, number> = {
  "½": 0.5, "⅓": 1 / 3, "⅔": 2 / 3, "¼": 0.25, "¾": 0.75,
  "⅕": 0.2, "⅖": 0.4, "⅗": 0.6, "⅘": 0.8, "⅙": 1 / 6, "⅚": 5 / 6,
  "⅛": 0.125, "⅜": 0.375, "⅝": 0.625, "⅞": 0.875,
};

function parseQuantity(text: string): number | null {
  let s = text.trim().toLowerCase();
  for (const [glyph, value] of Object.entries(UNICODE_FRACTIONS)) {
    s = s.replace(glyph, ` ${value} `);
  }
  // Take the first quantity of a range ("2-3 cups" -> 2).
  s = s.replace(/\s*[-–]\s*\d+(\.\d+)?/, " ");
  const mixed = s.match(/^(\d+)\s+(\d+)\s*\/\s*(\d+)/);
  if (mixed) return Number(mixed[1]) + Number(mixed[2]) / Number(mixed[3]);
  const frac = s.match(/^(\d+)\s*\/\s*(\d+)/);
  if (frac) return Number(frac[1]) / Number(frac[2]);
  const num = s.match(/^(\d+(\.\d+)?)/);
  if (num) return Number(num[1]);
  return null;
}

/**
 * Best-effort conversion of a printed recipe measure to grams for the whole
 * recipe. Returns null when the measure carries no usable quantity
 * ("to taste", "a pinch", "dash").
 */
export function measureToGrams(measure: string, ingredient: string): number | null {
  const raw = (measure ?? "").trim().toLowerCase();
  if (!raw) return null;
  if (/^(to taste|taste|pinch|dash|drizzle|sprinkle|garnish|as needed|some)\b/.test(raw)) {
    return null;
  }
  const qty = parseQuantity(raw);
  if (qty === null || qty <= 0) return null;

  const cupGrams = CUP_GRAMS[ingredient] ?? 150;
  const itemGrams = ITEM_GRAMS[ingredient] ?? 100;

  if (/\bkg\b|kilogram/.test(raw)) return qty * 1000;
  if (/\b(g|gr|grams?|gm)\b/.test(raw)) return qty;
  if (/\b(lbs?|pounds?)\b/.test(raw)) return qty * 453.6;
  if (/\b(oz|ounces?)\b/.test(raw)) return qty * 28.35;
  if (/\b(l|litres?|liters?)\b/.test(raw)) return qty * 1000;
  if (/\b(ml|millilitres?|milliliters?)\b/.test(raw)) return qty;
  if (/\bcups?\b/.test(raw)) return qty * cupGrams;
  if (/\b(tbsp|tbs|tblsp|tablespoons?)\b/.test(raw)) return qty * 15;
  if (/\b(tsp|teaspoons?)\b/.test(raw)) return qty * 5;
  if (/\b(cans?|tins?)\b/.test(raw)) return qty * 400;
  if (/\b(slices?)\b/.test(raw)) return qty * 30;
  if (/\b(cloves?)\b/.test(raw)) return qty * 3;
  if (/\b(sprigs?|leaves|leaf|bunch)\b/.test(raw)) return qty * 10;
  if (/\b(sheets?)\b/.test(raw)) return qty * 40;
  // Bare count ("2", "4 large").
  return qty * itemGrams;
}
