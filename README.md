# Glucose Guide

Food, recipe, and activity guidance for people living with Type 1 diabetes. You log a blood glucose reading, and Glucose Guide suggests what to eat or how to move, given that reading.

**Live app:** https://glucoseguide.lovable.app

> ⚠️ **Informational only. Not medical advice.** Glucose Guide does not replace guidance from your doctor, endocrinologist, or diabetes care team. Never use it to dose insulin. Always follow your own treatment plan, especially when treating a low.

---

## How it was built

I designed Glucose Guide and built it with [Lovable](https://lovable.dev), an AI app builder. I wrote the product requirements and the glycemic scoring rules, chose the research behind them, and iterated on the design through prompts. Lovable's AI generated the code, which is why most commits come from `gpt-engineer-app[bot]`.

## Features

- **Log:** record a reading in mg/dL. Readings are stored locally in your browser (`localStorage`); there is no account or server-side storage.
- **Glucose zones:** each reading is classified as severe low (< 54), low (54–69), in range (70–180), high (181–400), or severe high (> 400) mg/dL. Low and severe readings show an emergency banner.
- **Suggest:** recipe ideas ranked for your current zone, using the impact score described below.
- **Move:** activity suggestions for your zone, or a warning to hold off when your glucose is unsafe for exercise.
- **Scan:** photograph a food to get an AI estimate of its carbs and a 1–10 rating for eating it now.
- **Select:** browse the full food library. Each food page links to its recipe on TheMealDB.
- **Evidence:** a page listing the papers and formulas behind the scores.

## How the impact score works

Each recipe gets a 1–10 impact score, where 10 raises blood glucose the most. The score comes from a rule-based model in `src/lib/glycemic.ts`, not from AI:

1. Each carbohydrate ingredient is matched to a published glycemic index (GI) value, taken from the International Tables of Glycemic Index (Foster-Powell, Holt & Brand-Miller) and the University of Sydney GI database. When a food has a published range, the higher value is used, so the score errs toward predicting a faster rise.
2. The meal's GI is the carbohydrate-weighted average of its ingredients, following Jenkins 2002.
3. Glycemic load is computed on available carbohydrate (total carbs minus fiber): GL = GI × available carbs (g) / 100.
4. GL maps to the 1–10 scale. The standard bands (low ≤ 10, medium 11–19, high ≥ 20) are extended upward for very high-load plates.
5. Each score carries a confidence tier: *measured* (from the recipe's actual ingredient amounts), *derived*, or *estimated*. High-fat plates get a delayed-rise warning (Quarta 2023).

Full citations are on the in-app `/evidence` page.

**The Scan feature works differently.** Scan sends the photo and your current zone to Google's Gemini model (`google/gemini-3-flash-preview`) through the Lovable AI gateway. Its carb estimate and rating come from the AI model, not from the glycemic model above, and are less reliable.

## Tech stack

- [TanStack Start](https://tanstack.com/start) (React, TypeScript, file-based routing, server functions)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/) and [shadcn/ui](https://ui.shadcn.com/)
- [Vercel AI SDK](https://sdk.vercel.ai/) with the Lovable AI gateway, for Scan
- [TheMealDB](https://www.themealdb.com/) API for recipes
- Built and hosted with [Lovable](https://lovable.dev)

## Project structure

```
src/
├── routes/                 # Pages: index, log, suggest, scan, move, select, food.$id, evidence
├── components/             # App UI (GlucoseGauge, GlucoseChart, ImpactScale, ...) and shadcn/ui
└── lib/
    ├── glycemic.ts         # GI table and impact-score model
    ├── composition.ts      # Ingredient carb/fiber/fat composition and unit conversion
    ├── data.ts             # Food library, exercises, glucose zones
    ├── mealdb.ts           # TheMealDB client
    ├── scan.functions.ts   # Server function for AI food scanning
    ├── store.ts            # Readings, stored in localStorage
    └── *.generated.ts      # Indexes built by the scripts below
scripts/
├── build-ingredient-index.ts   # Fetch recipe ingredients from TheMealDB
├── build-measure-index.ts      # Fetch ingredient amounts for weighting
├── recompute-impacts.ts        # Recompute every impact score from glycemic.ts
├── repair-ingredient-index.ts
└── check-youtube-links.ts      # Hide recipe videos that are no longer available
```

## Running locally

You need [Bun](https://bun.sh/) (the repo uses `bun.lock`). npm also works.

```bash
git clone https://github.com/Warficent/glucoseguide.git
cd glucoseguide
bun install
bun run dev
```

Open the local URL that Vite prints.

Everything except Scan works without configuration. Scan needs a Lovable AI gateway key, set as a server-side environment variable:

```bash
LOVABLE_API_KEY=your-key
```

This key is only read on the server. Don't expose it with a `VITE_` prefix.

### Other commands

```bash
bun run build                         # production build
bun run preview                       # serve the production build locally
bun run lint                          # ESLint
bun run scripts/recompute-impacts.ts  # recompute impact scores after editing glycemic.ts
```

## Deployment

The app is deployed through Lovable at https://glucoseguide.lovable.app. Because Scan uses a server function, the app needs a host that runs server code. A static host like GitHub Pages would not support Scan.

The repo is synced with the Lovable project: changes made in Lovable are committed to `main`, and changes pushed to `main` sync back to Lovable. Renaming or moving the repo breaks the sync.

## Limitations

- GI values vary between labs and between individuals, so scores are approximate.
- Scores estimate how a food is likely to affect glucose. They do not account for insulin on board, exercise, stress, illness, or individual response.
- Scan results depend on an AI model's identification of the food and can be wrong.

## Author

Designed by Luke Novak, Chemical Engineering, Vanderbilt University. Built with Lovable.
