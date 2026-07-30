import { FOODS } from "../src/lib/data";
import { glycemicForRecipe } from "../src/lib/glycemic";
import { MEASURE_INDEX } from "../src/lib/measures.generated";
import { INGREDIENT_INDEX } from "../src/lib/ingredient-index.generated";
import { measureToGrams } from "../src/lib/composition";
import { lookupComposition } from "../src/lib/glycemic";

for (const f of FOODS) {
  if (glycemicForRecipe(f).confidence !== "estimated") continue;
  const names = (MEASURE_INDEX as any)[f.id] ?? (INGREDIENT_INDEX[f.id] ?? []).map((n: string) => ({ name: n, measure: "" }));
  let carb = 0;
  for (const { name, measure } of names) {
    const comp = lookupComposition(name, null);
    if (!comp) continue;
    const g = measureToGrams(measure, name) ?? 100;
    carb += (g * comp.carb) / 100;
  }
  console.log(`${f.id}\tstated=${f.carbs}\trecipeCarb=${Math.round(carb)}\tper4=${Math.round(carb / 4)}`);
}
