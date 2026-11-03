# Glucose Guide

Build a mobile-first web app called "Novak Nutrition" — a food and activity guide for Type 1 diabetics based on their current blood glucose reading.

DESIGN

- Purple (#6C2BD9) header bar and primary buttons

- Home screen has a dark green (#1E3D2A) background with white text

- All other screens (Suggest, Move, Select, food detail) have a white background with soft lavender (#F4F1FB) card backgrounds and dark purple/navy text (#2B1A4A)

- Rounded corners (rounded-2xl / rounded-3xl), soft card shadows, clean sans-serif body text with a slightly more expressive serif for headings

- Bottom nav bar with 4 tabs: Home, Suggest, Move, Select

DATA MODEL

Create a foods table/array with: name, carbs (grams), glucose impact score (1–10, where 1 raises blood glucose the most and 10 raises it the least), and a short note explaining why.

Seed it with: Honeycrisp Apple, Horchata, Hot Dog, Meat Ravioli, Orange Juice, Lay's Original chips, Peanut Butter, Pizza Slice, Potato Fries, Raw Broccoli, Seafood Paella — assign realistic carb counts and impact scores.

Create an exercises table/array with: name, duration, estimated mg/dL glucose reduction, and a short note. Seed it with: Brisk Walk, Cycling, Swimming, Strength Training.

SCREENS

1. Home

- A circular/semicircle gauge showing the current glucose reading (mg/dL), color-coded by zone: dark red below 54 or above 400, red 54–69, green 70–180, purple 180–400

- Buttons: "Log Glucose" and "Browse Foods" always visible; "Suggest Foods" and "Move" appear once a reading has been logged

- If the reading is below 54 or above 400, show a red emergency banner (see EMERGENCY LOGIC below)

2. Glucose Entry

- Simple numeric input for glucose in mg/dL, with a Confirm button that saves the reading and navigates to Suggest

3. Suggest

- Shows the logged reading and its zone

- Recommends 4 foods from the database based on the zone:

  - Below 70 (or below 54): sort foods by LOWEST impact score first (fast-acting sugar)

  - Above 180 (or above 400): sort foods by HIGHEST impact score first (gentle, low-impact foods)

  - 70–180: show foods with impact score between 4 and 8 (balanced)

- Foods the user has "liked" (see PREFERENCE MEMORY) should always sort to the top of the list

- If the reading is above 400 or below 54, show the emergency banner here too

- If the reading is high (180–400), show a button linking to the Move screen

4. Move

- Lists the 4 exercises with duration and estimated mg/dL reduction

- If glucose is low or severely low, replace the exercise list with a message to treat the low first — do not show exercise suggestions

- If glucose is above 400 (severe high), hide the exercise list entirely and show a message that exercise isn't safe at this level; show the emergency banner

- If glucose is high but under 400, show a note that light-to-moderate activity can help

5. Select (browse all foods)

- Search bar to filter the food list by name

- A "Recently Viewed" section at the top (last 5 foods the user tapped into), shown only when there's no active search

- Full food list below, each row showing name, carbs, and impact score badge, with a heart icon to like/unlike

6. Food Detail

- Icon, name, and heart (like) toggle

- Two stat cards: carbs and impact score

- Short explanatory note about why that food has that score

PREFERENCE MEMORY

- Tapping into a food's detail view adds it to a "recently viewed" list (most recent 5, no duplicates)

- Tapping the heart icon toggles a "liked" state for that food

- Liked foods are always sorted to the top of Suggest results within their zone

EMERGENCY LOGIC

- Glucose below 54 mg/dL = "Severe low" zone. Show a red banner: take fast-acting sugar now if able to self-treat; if confused, unable to self-treat, or losing consciousness, call 911 or local emergency services immediately.

- Glucose above 400 mg/dL = "Severe high" zone. Show a red banner: call 911 or local emergency services, especially with nausea, vomiting, confusion, rapid breathing, or fruity-smelling breath (possible signs of diabetic ketoacidosis / DKA).

- Always include a line clarifying the app cannot replace emergency medical care.

- This banner should appear on Home, Suggest, and Move whenever the current reading falls in either emergency zone.

Keep all logic client-side for now — no backend/auth needed yet. Prioritize the Home, Suggest, and emergency banner logic first, then Move, then Select/food detail.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://glucoseguide.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/ae6de15e-e1e4-47f2-b2c2-5ccd782c3f7d).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
