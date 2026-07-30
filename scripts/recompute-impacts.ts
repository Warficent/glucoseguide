// Recomputes every recipe's `impact` in src/lib/data.ts from the evidence-based
// glycemic model in src/lib/glycemic.ts, and reports the confidence spread.
//   bun run scripts/recompute-impacts.ts
import { readFileSync, writeFileSync } from "node:fs";
import { FOODS } from "../src/lib/data";
import { glycemicForRecipe, impactFromGL } from "../src/lib/glycemic";

const path = "src/lib/data.ts";
let src = readFileSync(path, "utf8");

let changed = 0;
const tally: Record<string, number> = { measured: 0, derived: 0, estimated: 0 };
let delayed = 0;

for (const food of FOODS) {
  const g = glycemicForRecipe(food);
  tally[g.confidence]++;
  if (g.delayedRise) delayed++;
  const next = impactFromGL(g.gl);
  if (next === food.impact) continue;

  const block = new RegExp(
    `(id: "${food.id.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\\\$&")}",[\\s\\S]{0,400}?impact: )\\d+`,
  );
  if (!block.test(src)) {
    console.error(`! could not locate impact for ${food.id}`);
    continue;
  }
  src = src.replace(block, `$1${next}`);
  changed++;
}

writeFileSync(path, src);
console.error(
  `Updated ${changed}/${FOODS.length} impact scores. ` +
    `Confidence: measured ${tally.measured}, derived ${tally.derived}, estimated ${tally.estimated}. ` +
    `Delayed-rise flagged: ${delayed}.`,
);
