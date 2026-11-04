# Glucose Guide

Food, recipe, and activity guidance for people living with Type 1 diabetes. You log a blood glucose reading, and Glucose Guide gives instant suggestions tailored to that reading.

**Live demo:** https://glucoseguide.lovable.app

> ⚠️ **Informational only. Not medical advice.** Glucose Guide does not replace guidance from your doctor, endocrinologist, or diabetes care team. Always follow your own treatment plan, especially when treating a low.

---

## Features

- **Log glucose:** Record a reading in mg/dL to unlock suggestions.
- **Glucose trend:** View your reading history at a glance.
- **Suggest:** Get food and recipe ideas based on your current reading.
- **Move:** Get activity suggestions matched to your glucose level.
- **Scan:** Scan food to get guidance on it.
- **Select:** Browse the food library.

## Pages

| Route      | Purpose                              |
|------------|--------------------------------------|
| `/`        | Home: current reading, trend, quick actions |
| `/suggest` | Food and recipe suggestions          |
| `/scan`    | Food scanning                        |
| `/move`    | Activity suggestions                 |
| `/select`  | Browse foods                         |

## Tech stack

- [Vite](https://vitejs.dev/) + [React](https://react.dev/) + TypeScript
- [Tailwind CSS](https://tailwindcss.com/) and [shadcn/ui](https://ui.shadcn.com/)
- Prototyped with [Lovable](https://lovable.dev)
- Deployed with GitHub Actions to GitHub Pages

## Quick start

You need [Node.js](https://nodejs.org/) 18 or newer and npm.

```bash
git clone https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git
cd YOUR-REPO-NAME
npm install
npm run dev
```

Then open the local URL that Vite prints, usually http://localhost:8080 or http://localhost:5173.

### Other scripts

```bash
npm run build     # production build into dist/
npm run preview   # serve the production build locally
```

## Environment variables

If the app connects to Supabase or Lovable Cloud, create a `.env` file in the project root:

```bash
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

Anything prefixed `VITE_` is bundled into the public JavaScript. Only put publishable or anon keys here, never a service-role key. Make sure `.env` is listed in `.gitignore`.

## Deployment

Every push to `main` builds the site and deploys it to GitHub Pages through `.github/workflows/deploy.yml`.

To set it up:

1. In `vite.config.ts`, set `base: "/YOUR-REPO-NAME/"`.
2. If the app uses React Router, use `<BrowserRouter basename={import.meta.env.BASE_URL}>`.
3. In the repo, go to **Settings → Pages → Source** and select **GitHub Actions**.
4. If you use environment variables, add them under **Settings → Secrets and variables → Actions**, then uncomment the `env:` block in the workflow.

The workflow copies `index.html` to `404.html`, so direct links and page refreshes on routes like `/scan` work on GitHub Pages.

## Editing with Lovable

This repo is synced with the Lovable project. Changes made in Lovable are committed to `main` automatically. Changes pushed to `main` from your own editor sync back to Lovable. Don't rename or move the repo, because that breaks the sync.

## Author

Built by Luke Novak, Chemical Engineering at Vanderbilt University.


