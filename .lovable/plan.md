## SuperCook-style ingredient filter

Let users pick ingredients they have, then narrow the food list to recipes that either **only** use those ingredients or **contain some** of them.

### Where it lives

New surface on the **Select** screen (`src/routes/select.tsx`), above the search bar:

- A collapsible "What's in your kitchen?" panel with a searchable, tag-style ingredient picker.
- Selected ingredients render as removable chips.
- Two-mode toggle: **Any of these** (recipe includes ≥1 selected ingredient) / **Only these** (recipe uses a subset of selected ingredients).
- "Clear" button to reset.

The existing text search and Recently Viewed still work; ingredient filter composes with them.

Each food row gets a small "3 of 5 ingredients matched" hint when a filter is active.

### Where the ingredient data comes from

Ingredients today are fetched per-recipe from TheMealDB on the food detail page — there is no local ingredient index. For a fast, offline-capable filter across all 131 recipes we prebuild one:

- Add `scripts/build-ingredient-index.ts` — a one-time Node script that walks `FOODS`, calls `findMealForFood` for each, and writes a normalized index to `src/lib/ingredient-index.generated.ts`.
- Shape: `{ [foodId]: string[] }` of lowercased, singularized ingredient names (e.g. `"tomatoes"` → `"tomato"`), plus a sorted union `ALL_INGREDIENTS: string[]` for the picker.
- Committed to the repo so the app ships with zero extra API calls. Re-run the script whenever `FOODS` changes.

### Filtering logic

New helpers in `src/lib/data.ts` (kept next to `suggestFoods`):

- `filterFoodsByIngredients(foods, selected, mode)` where `mode: "any" | "only"`.
- `"any"`: keep foods whose ingredient set intersects `selected` (sort by match count desc, then name).
- `"only"`: keep foods whose ingredient set is a subset of `selected` (a "you can cook this right now" list).
- Case/whitespace-insensitive comparison against the generated index.

### State

Selected ingredients + mode live in URL search params on `/select` so the filter is shareable and survives reloads:

- `ingredients: string[]` and `mode: "any" | "only"` validated with `zodValidator` + `fallback` per the search-params guidance.
- Read via `Route.useSearch()`; update via `navigate({ search: prev => ... })`.

Liked/recent state stays in the existing store.

### Ingredient picker UX

- Text input filters `ALL_INGREDIENTS` as you type; Enter or tap adds a chip.
- Common categories (Produce, Dairy, Pantry, Protein) as quick-add chip rows above the input — categories derived heuristically in the build script from a small keyword map.
- Empty state when a filter yields nothing: "No recipes match. Try switching to Any of these."

### Files touched

- New: `scripts/build-ingredient-index.ts`, `src/lib/ingredient-index.generated.ts`, `src/components/IngredientPicker.tsx`.
- Edited: `src/routes/select.tsx` (integrate picker + filter), `src/lib/data.ts` (add filter helpers), `package.json` (script entry).

### Not in scope

- No changes to Suggest, Move, Home, Scan, or Food Detail.
- No server-side persistence of the pantry (URL-only for now; can promote to store later if you want it to persist across pages).
- No new recipes; filter operates over the existing 131.
