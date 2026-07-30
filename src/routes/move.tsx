import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { EmergencyBanner } from "@/components/EmergencyBanner";
import { useAppState } from "@/lib/store";
import { EXERCISES, zoneFor, zoneLabel, zoneColor } from "@/lib/data";
import { Info } from "lucide-react";

export const Route = createFileRoute("/move")({
  head: () => ({
    meta: [
      { title: "Activity guidance for your glucose — Glucose Guide" },
      {
        name: "description",
        content:
          "See safe exercise options for your current reading — or a warning to hold off when your blood sugar is unsafe for activity.",
      },
      { property: "og:title", content: "Activity guidance for your glucose — Glucose Guide" },
      {
        property: "og:description",
        content: "Safe exercise options based on your current glucose reading.",
      },
      { property: "og:url", content: "https://glucoseguide.lovable.app/move" },
    ],
    links: [{ rel: "canonical", href: "https://glucoseguide.lovable.app/move" }],
  }),
  component: MovePage,
});

function MovePage() {
  const glucose = useAppState((s) => s.glucose);

  if (glucose == null) {
    return (
      <AppShell title="Move">
        <div className="rounded-3xl bg-lavender p-6 text-center">
          <p className="font-serif text-xl text-ink">No reading yet</p>
          <p className="mt-2 text-sm text-ink/60">
            Log a glucose reading first — activity guidance depends on your zone.
          </p>
          <Link
            to="/log"
            className="mt-4 inline-block rounded-2xl bg-primary px-5 py-3 font-semibold text-white"
          >
            Log glucose
          </Link>
        </div>
      </AppShell>
    );
  }

  const zone = zoneFor(glucose);
  const isLow = zone === "severe-low" || zone === "low";
  const isSevereHigh = zone === "severe-high";
  const isHigh = zone === "high";

  return (
    <AppShell title="Move">
      <div className="space-y-5">
        <section className="rounded-3xl bg-lavender p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-ink/50">Reading</p>
              <p className="mt-1 font-serif text-4xl font-semibold tabular-nums text-ink">
                {glucose}
                <span className="ml-1 text-base font-medium text-ink/50">mg/dL</span>
              </p>
            </div>
            <span
              className="rounded-full px-3 py-1 text-xs font-semibold text-white"
              style={{ backgroundColor: zoneColor(zone) }}
            >
              {zoneLabel(zone)}
            </span>
          </div>
        </section>

        <EmergencyBanner zone={zone} />

        {isLow && (
          <div className="rounded-2xl bg-lavender p-5">
            <p className="font-serif text-lg font-semibold text-ink">
              Treat the low first
            </p>
            <p className="mt-2 text-sm text-ink/70">
              Don't exercise while low. Take fast-acting sugar, wait 15 minutes,
              and re-check your glucose before considering any activity.
            </p>
            <Link
              to="/suggest"
              className="mt-4 inline-block rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-white"
            >
              See fast-acting foods
            </Link>
          </div>
        )}

        {isSevereHigh && (
          <div className="rounded-2xl bg-lavender p-5">
            <p className="font-serif text-lg font-semibold text-ink">
              Exercise isn't safe right now
            </p>
            <p className="mt-2 text-sm text-ink/70">
              At this level, physical activity can raise glucose further and risk
              DKA. Follow the emergency guidance above.
            </p>
          </div>
        )}

        {!isLow && !isSevereHigh && (
          <>
            {isHigh && (
              <div className="flex items-start gap-3 rounded-2xl bg-primary/10 p-4 text-sm text-ink">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <p>
                  Light-to-moderate activity can help bring elevated glucose down.
                  Check ketones first if you feel unwell.
                </p>
              </div>
            )}
            <ul className="space-y-3">
              {EXERCISES.map((e) => (
                <li
                  key={e.id}
                  className="flex items-center gap-4 rounded-2xl bg-lavender p-4"
                >
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-white text-2xl">
                    {e.emoji}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-ink">{e.name}</p>
                    <p className="text-xs text-ink/60">{e.duration}</p>
                    <p className="mt-1 text-xs text-ink/70">{e.note}</p>
                  </div>
                </li>
              ))}
            </ul>
            <p className="text-center text-xs text-ink/50">
              Individual response varies — check your glucose before and after activity.
            </p>
          </>
        )}
      </div>
    </AppShell>
  );
}
