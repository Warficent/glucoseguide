## Goal

Re-ground the impact scores in this full evidence set, and make the app show which evidence produced each number.

## What the sources actually support

Verified from the sources this turn:

- **Rovner 2009** (J Am Diet Assoc 109:303-307) — 23 children with T1D, CGM crossover. Low-GI day (mean diet GI 34) vs usual day (GI 57): mean daytime glucose 125 vs 186 mg/dL, area above 180 mg/dL 4,485 vs 26,708, high-BG index 5.1 vs 13.6. **No reduction in time below 70 mg/dL** (area below 70 was numerically higher on the low-GI day), and **no nighttime difference**. Used low GI = **≤55, glucose-referenced**; fiber 24.5 g vs 14.5 g.
- **Jenkins 2002** (AJCN 76:266S) — GI defined against a glucose reference; mixed-meal GI is the **carbohydrate-weighted average** of the meal's carb sources, applied to **available** carbohydrate; fat and protein blunt the early rise and delay it.
- **Zafar 2019** (AJCN, 54 RCTs incl. T1D) — low-GI diets reduced HbA1c and fasting glucose; **no effect on insulin requirements**. GI is a ranking tool, not a dosing tool.
- **Ojo 2018** (Nutrients 10:373) — note: the published paper is **type 2 diabetes only**, not T1D as listed. It supports low-GI diets improving HbA1c/fasting glucose, but it will be cited accurately as T2D evidence, not extended to T1D.
- **Quarta 2023** (Nutrients 15:3507) — T1D children specifically: GI and GL assess quality and quantity together, and **each macronutrient shifts postprandial glucose differently**, so fat and protein must be considered alongside carbs. This is the direct justification for a delayed-rise flag.
- **Vega-López 2018**, **Brand-Miller commentary**, **Powers 2018**, **Williston 2019**, **Chiang 2014 (ADA position)**, **LPI review**, **Beyond Type 1** — collectively: GI values carry real measurement variability between individuals and labs, GI is an **adjunct to carbohydrate counting and never a replacement**, and ADA guidance keeps carb counting plus insulin matching as the primary tool. These set the app's framing and its limits section rather than the math.

Three things in `src/lib/glycemic.ts` conflict with the above.

## Technical changes

**1. Meal GI: carbohydrate-weighted, not worst-ingredient (Jenkins, Quarta)**

`glycemicForRecipe` currently takes the single highest-GI ingredient. Replace with the additive mixed-meal model:

- Add a `CARB_PER_100G` table beside `GI_TABLE` and estimate each matched ingredient's carb contribution from its parsed measure.
- Meal GI = Σ(GI_i × carb_i) / Σ(carb_i), rescaled so Σcarb_i matches the recipe's stated carbs.
- Safety ceiling: if the highest-GI source supplies ≥40% of the carbs, use that ingredient's GI instead of the average.
- Show both the weighted meal GI and the dominant source on the detail card.

**2. Available carbohydrate = total carb − fiber (Jenkins; fiber was the main dietary difference in Rovner)**

Estimate fiber per recipe from the same table and compute `GL = mealGI × (carbs − fiber) / 100`, the published GL definition.

**3. GI category labels use the ≤55 / 56-69 / ≥70 cut-offs (Rovner, Jenkins)**

Display the GI band next to the number, since ≤55 is the exact threshold Rovner used to build the low-GI arm. GL bands (≤10 / 11-19 / ≥20) stay for the load.

**4. Delayed-rise flag (Jenkins, Quarta)**

Recipes that are high fat + high carb (pizza, fries, creamy pasta) show a blunted early rise and a prolonged late climb that GI does not capture. Flag on the detail card and in Suggest: "GI understates this meal — fat delays the rise, expect a later climb."

**5. Uncertainty band instead of a false-precision single number (Vega-López, Brand-Miller)**

Published GI values vary substantially between labs and individuals. Each recipe will carry a `confidence` field — `measured` (dominant carb source directly in the GI table), `derived` (weighted from multiple matched sources), or `estimated` (no match, current 47-of-232 fallback) — rendered as a visible label so the user can tell a solid number from a guess.

**6. Fix the low-glucose path — the safety-critical change**

Rovner found low-GI eating did not reduce hypoglycemia, and no source in this set supports ranking recipes by "fastest rise" to treat a low. For the low and severe-low zones, Suggest will lead with the standard **15-15 rule** (15 g fast-acting carbohydrate — glucose tabs, juice, regular soda — recheck in 15 min) and demote recipes to "after you have recovered". Emergency banner logic unchanged.

**7. Evidence surfacing**

- New `/evidence` route: the scoring method in full, provenance of the GI and carb tables, every citation above with a link and its specific finding, and the limits — GI values are population averages measured fasted on isolated foods; Zafar found no effect on insulin requirements; ADA (Chiang 2014) keeps carbohydrate counting primary, so GI here is an adjunct only.
- The Glycemic detail card links to `/evidence` and names the evidence behind its band.
- Suggest and Select disclaimers rewritten to cite this evidence base and state plainly that the app is not a dosing tool.

**8. Recompute and verify**

Re-run the scoring script across all 232 recipes, write updated `impact` values into `src/lib/data.ts`, and report how many changed and how many remain in the `estimated` confidence tier.

## What this will not do

None of these papers publish GI values for the specific TheMealDB dishes — GI numbers still come from the International Tables (Foster-Powell/Brand-Miller) and the Sydney database. The papers govern how those numbers are combined, bounded, and presented. Per-serving carb figures remain my estimates until replaced with USDA FoodData Central values.
