import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ArrowLeft, ExternalLink } from "lucide-react";

const TITLE = "How Glucose Guide rates food — the evidence | Glucose Guide";
const DESCRIPTION =
  "The published research and exact formula behind every glycemic index, glycemic load and 1-10 impact score in Glucose Guide.";

export const Route = createFileRoute("/evidence")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: "How Glucose Guide rates food — the evidence" },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:url", content: "https://glucoseguide.lovable.app/evidence" },
      { property: "og:type", content: "article" },
    ],
    links: [{ rel: "canonical", href: "https://glucoseguide.lovable.app/evidence" }],
  }),
  component: Evidence,
});

type Paper = {
  cite: string;
  title: string;
  url: string;
  finding: string;
  used: string;
};

const PAPERS: Paper[] = [
  {
    cite: "Jenkins et al., 2002",
    title: "Glycemic index: overview of implications in health and disease",
    url: "https://pubmed.ncbi.nlm.nih.gov/12081851/",
    finding:
      "Defines the glycemic index against a glucose reference and sets out the mixed-meal principle: a meal's GI is the carbohydrate-weighted average of its carbohydrate sources, applied to available carbohydrate. Also describes how fat and protein blunt and delay the rise.",
    used: "The core formula. Meal GI is weighted by each ingredient's carbohydrate contribution, and glycemic load is computed on available carbohydrate (total carbs minus fibre) rather than total carbs.",
  },
  {
    cite: "Rovner et al., 2009",
    title:
      "The effect of a low glycemic diet versus a standard diet on blood glucose levels and macronutrient intake in children with type 1 diabetes",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC2713749/",
    finding:
      "23 children with type 1 diabetes, continuous glucose monitoring, crossover design. On the low-GI day (mean diet GI 34) versus the usual day (GI 57): mean daytime glucose 125 vs 186 mg/dL, area above 180 mg/dL 4,485 vs 26,708, high-blood-glucose index 5.1 vs 13.6. Crucially, there was no reduction in time below 70 mg/dL and no nighttime difference.",
    used: "Two things. The low-GI threshold of 55 (glucose-referenced) used for the GI bands, and the decision to stop ranking recipes by 'fastest rise' when you are low — that use is not supported by this evidence.",
  },
  {
    cite: "Zafar et al., 2019",
    title: "Low-glycemic index diets as an intervention for diabetes",
    url: "https://pubmed.ncbi.nlm.nih.gov/31374573/",
    finding:
      "Systematic review and meta-analysis of 54 randomised controlled trials in type 1 diabetes, type 2 diabetes and impaired glucose tolerance. Low-GI diets reduced HbA1c, fasting glucose, BMI, total cholesterol and LDL — but had no effect on insulin requirements.",
    used: "Justifies using GI to rank foods at all, and is the reason the app never presents these numbers as a dosing tool.",
  },
  {
    cite: "Quarta et al., 2023",
    title: "Diet and Glycemic Index in Children with Type 1 Diabetes",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC10459060/",
    finding:
      "Review focused on type 1 diabetes in children. GI and GL together capture the quality and quantity of carbohydrate, and each macronutrient affects postprandial glucose differently, so fat and protein must be considered alongside carbohydrate.",
    used: "The delayed-rise flag on high-fat, high-carbohydrate recipes.",
  },
  {
    cite: "Vega-López et al., 2018",
    title:
      "Relevance of the Glycemic Index and Glycemic Load for Body Weight, Diabetes, and Cardiovascular Disease",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC6165362/",
    finding:
      "Reviews the substantial variability in published GI values — between laboratories, between individuals, and with ripeness, processing and cooking.",
    used: "Why every recipe carries a confidence tier instead of a single number presented as fact.",
  },
  {
    cite: "Ojo et al., 2018",
    title:
      "The Effect of Dietary Glycaemic Index on Glycaemia in Patients with Type 2 Diabetes",
    url: "https://www.mdpi.com/2072-6643/10/3/373",
    finding:
      "Meta-analysis of randomised controlled trials finding low-GI diets improve HbA1c and fasting glucose. Note: the published paper covers type 2 diabetes, not type 1.",
    used: "Supporting evidence for the GI approach in general. It is not treated as type 1 evidence here.",
  },
  {
    cite: "Brand-Miller et al. (commentary)",
    title:
      "The Glycemic Index: Not the most effective nutrition therapy for type 1 diabetes?",
    url: "https://diabetesjournals.org/care/article/29/2/451/24540",
    finding:
      "Argues GI is an adjunct to, not a replacement for, carbohydrate counting in type 1 diabetes.",
    used: "The framing throughout the app: GI ranks food choices, carbohydrate counting and insulin matching remain primary.",
  },
  {
    cite: "Chiang et al., 2014 (ADA position statement)",
    title: "Type 1 Diabetes Through the Life Span",
    url: "https://diabetesjournals.org/care/article/37/7/2034/29570",
    finding:
      "American Diabetes Association position statement keeping carbohydrate counting with insulin matching as the foundation of nutrition therapy in type 1 diabetes.",
    used: "Why the app never tells you how much insulin to take and defers to your care team.",
  },
  {
    cite: "Powers et al., 2018",
    title: "Eating Patterns and Food Intake of Persons with Type 1 Diabetes",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC6296482/",
    finding:
      "Describes real eating patterns in people with type 1 diabetes and the practical limits of prescriptive diet approaches.",
    used: "Why the app suggests real, makeable recipes rather than a restricted food list.",
  },
  {
    cite: "Williston et al., 2019",
    title: "The Effects of a Low-Glycemic Index Diabetes Diet in Patients With Type 1 Diabetes",
    url: "https://digitalcommons.latech.edu/",
    finding: "Applied review of low-GI eating specifically in type 1 diabetes.",
    used: "Supporting context for the low-GI ranking approach.",
  },
  {
    cite: "Linus Pauling Institute",
    title: "Glycemic Index and Glycemic Load",
    url: "https://lpi.oregonstate.edu/mic/food-beverages/glycemic-index-glycemic-load",
    finding:
      "Background review of GI and GL methodology and the standard clinical cut-offs.",
    used: "Reference for the GL bands: low 10 or under, medium 11-19, high 20 and above.",
  },
  {
    cite: "Beyond Type 1",
    title: "Glycemic Index Diet and Diabetes",
    url: "https://beyondtype1.org/glycemic-index-diabetes/",
    finding: "Plain-language clinical overview of the type 1 literature.",
    used: "Patient-facing wording checks.",
  },
];

function Evidence() {
  return (
    <AppShell title="Evidence">
      <div className="space-y-5">
        <Link
          to="/select"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-ink/60"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>

        <header className="rounded-3xl bg-lavender p-6">
          <h2 className="font-serif text-2xl font-semibold text-ink">
            How these scores are calculated
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-ink/70">
            Every impact score in Glucose Guide is computed, not judged. This page shows
            the exact formula, where the numbers come from, and what they cannot tell you.
          </p>
        </header>

        <section className="rounded-2xl bg-lavender p-5">
          <h2 className="font-serif text-lg font-semibold text-ink">The formula</h2>
          <ol className="mt-3 space-y-3 text-sm leading-relaxed text-ink/75">
            <li>
              <strong className="font-semibold text-ink">1. Find the carbohydrate.</strong>{" "}
              Each recipe's real ingredient list and printed amounts are converted to
              grams, and each ingredient's carbohydrate, fibre and fat are estimated from
              published composition data.
            </li>
            <li>
              <strong className="font-semibold text-ink">2. Weight the GI.</strong> Meal GI
              is the carbohydrate-weighted average of the published, glucose-referenced GI
              of every carbohydrate source in the recipe (Jenkins 2002).
            </li>
            <li>
              <strong className="font-semibold text-ink">3. Apply a safety ceiling.</strong>{" "}
              If one high-GI ingredient supplies 40% or more of the carbohydrate, its GI is
              used directly instead of the average, so a rice- or sugar-led plate is never
              averaged down by its side ingredients.
            </li>
            <li>
              <strong className="font-semibold text-ink">
                4. Compute the glycemic load.
              </strong>{" "}
              GL = meal GI × available carbohydrate ÷ 100, where available carbohydrate is
              total carbohydrate minus fibre.
            </li>
            <li>
              <strong className="font-semibold text-ink">5. Map to 1-10.</strong> The impact
              score is a fixed mapping from GL, anchored on the clinical cut-offs (low 10
              or under, medium 11-19, high 20 and above) and extended above 20 for very
              high-load plates. 1 raises glucose the most, 10 the least. There is no
              subjective adjustment anywhere in the chain.
            </li>
          </ol>
        </section>

        <section className="rounded-2xl bg-lavender p-5">
          <h2 className="font-serif text-lg font-semibold text-ink">Bands</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl bg-white p-4 text-sm text-ink/75">
              <p className="font-semibold text-ink">Glycemic index</p>
              <p className="mt-1">Low 55 or under · Medium 56-69 · High 70 or above</p>
              <p className="mt-1 text-xs text-ink/50">
                The same cut-off Rovner 2009 used to build its low-GI arm.
              </p>
            </div>
            <div className="rounded-xl bg-white p-4 text-sm text-ink/75">
              <p className="font-semibold text-ink">Glycemic load</p>
              <p className="mt-1">Low 10 or under · Medium 11-19 · High 20 or above</p>
              <p className="mt-1 text-xs text-ink/50">Standard clinical cut-offs.</p>
            </div>
          </div>
        </section>

        <section className="rounded-2xl bg-lavender p-5">
          <h2 className="font-serif text-lg font-semibold text-ink">Confidence tiers</h2>
          <dl className="mt-3 space-y-3 text-sm leading-relaxed text-ink/75">
            <div>
              <dt className="font-semibold text-ink">Measured</dt>
              <dd>
                The dominant carbohydrate in the recipe has a directly published,
                glucose-referenced GI value.
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-ink">Derived</dt>
              <dd>
                No single ingredient dominates, so the GI is a carbohydrate-weighted
                average of several published values.
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-ink">Estimated</dt>
              <dd>
                No carbohydrate source could be matched to a published GI, so a
                conservative mixed-refined-meal value of 70 is assumed. Treat these with
                extra caution.
              </dd>
            </div>
          </dl>
        </section>

        <section className="rounded-2xl bg-lavender p-5">
          <h2 className="font-serif text-lg font-semibold text-ink">The evidence base</h2>
          <ul className="mt-3 space-y-4">
            {PAPERS.map((p) => (
              <li key={p.cite} className="rounded-xl bg-white p-4">
                <a
                  href={p.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-start gap-1.5 font-semibold text-primary"
                >
                  <span className="text-sm">{p.cite}</span>
                  <ExternalLink className="mt-0.5 h-3 w-3 shrink-0" />
                </a>
                <p className="mt-1 text-sm font-medium text-ink">{p.title}</p>
                <p className="mt-2 text-xs leading-relaxed text-ink/70">{p.finding}</p>
                <p className="mt-2 text-xs leading-relaxed text-ink/60">
                  <strong className="font-semibold text-ink/80">How it is used here:</strong>{" "}
                  {p.used}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl bg-lavender p-5">
          <h2 className="font-serif text-lg font-semibold text-ink">What these scores cannot do</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-ink/75">
            <li>
              They cannot tell you how much insulin to take. Zafar 2019 found low-GI eating
              had no effect on insulin requirements, and ADA guidance (Chiang 2014) keeps
              carbohydrate counting and insulin matching as the primary tool.
            </li>
            <li>
              They cannot predict your individual response. GI is measured in fasted people
              on isolated foods, and values vary between laboratories and between people
              (Vega-López 2018).
            </li>
            <li>
              They cannot treat a low. Rovner 2009 found low-GI eating did not reduce time
              below 70 mg/dL, and a recipe is the wrong tool for hypoglycaemia — use
              fast-acting glucose and the 15-15 rule.
            </li>
            <li>
              Portion carbohydrate figures are estimates for a typical serving, not label
              values for the food in front of you.
            </li>
            <li>
              None of the papers above publish GI values for these specific dishes. The GI
              values themselves come from the International Tables of Glycemic Index and
              Glycemic Load Values (Foster-Powell, Holt & Brand-Miller) and the University
              of Sydney GI database; the research governs how they are combined and
              presented.
            </li>
          </ul>
          <p className="mt-4 rounded-xl bg-white p-4 text-xs leading-relaxed text-ink/70">
            Glucose Guide is an educational food-ranking tool. It is not medical advice, not
            a medical device, and must not be used to make insulin or treatment decisions.
            If you are unwell or your glucose is dangerously high or low, contact your care
            team or emergency services.
          </p>
        </section>
      </div>
    </AppShell>
  );
}
