import { FOODS } from "../src/lib/data";
import { glycemicForRecipe } from "../src/lib/glycemic";
import { INGREDIENT_INDEX } from "../src/lib/ingredient-index.generated";
const out: string[] = [];
for (const f of FOODS) {
  const g = glycemicForRecipe(f);
  if (g.confidence === "estimated") {
    const ings = (INGREDIENT_INDEX as any)[f.id]?? [];
    out.push(`${f.id} :: ${ings.join(", ")}`);
  }
}
console.log(out.length); console.log(out.join("\n"));
