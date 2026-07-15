import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { GlucoseGauge } from "@/components/GlucoseGauge";
import { EmergencyBanner } from "@/components/EmergencyBanner";
import { useAppState, actions } from "@/lib/store";
import { zoneFor } from "@/lib/data";
import { Activity, ListChecks, Sparkles, Plus } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const glucose = useAppState((s) => s.glucose);
  const navigate = useNavigate();
  const zone = glucose != null ? zoneFor(glucose) : null;
  const hasReading = glucose != null;

  return (
    <AppShell title="Home" tone="dark">
      <div className="space-y-6">
        <section className="rounded-3xl bg-white/5 p-6 ring-1 ring-white/10">
          <p className="text-center text-xs uppercase tracking-[0.24em] text-white/60">
            Current reading
          </p>
          <div className="mt-4">
            <GlucoseGauge value={glucose} />
          </div>
          {!hasReading && (
            <p className="mt-2 text-center text-sm text-white/70">
              Log a glucose reading to unlock food and activity suggestions.
            </p>
          )}
          {hasReading && (
            <button
              onClick={() => actions.clearGlucose()}
              className="mx-auto mt-3 block text-xs text-white/50 underline underline-offset-4"
            >
              Clear reading
            </button>
          )}
        </section>

        {zone && <EmergencyBanner zone={zone} />}

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => navigate({ to: "/log" })}
            className="col-span-2 flex items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-4 font-semibold text-white shadow-lg shadow-black/20 transition active:scale-[0.98]"
          >
            <Plus className="h-5 w-5" /> Log Glucose
          </button>
          <Link
            to="/select"
            className="flex items-center justify-center gap-2 rounded-2xl bg-white/10 px-4 py-4 font-semibold text-white ring-1 ring-white/15 transition active:scale-[0.98]"
          >
            <ListChecks className="h-5 w-5" /> Browse Foods
          </Link>
          {hasReading ? (
            <Link
              to="/suggest"
              className="flex items-center justify-center gap-2 rounded-2xl bg-white/10 px-4 py-4 font-semibold text-white ring-1 ring-white/15 transition active:scale-[0.98]"
            >
              <Sparkles className="h-5 w-5" /> Suggest
            </Link>
          ) : (
            <div className="flex items-center justify-center gap-2 rounded-2xl bg-white/5 px-4 py-4 text-sm text-white/40 ring-1 ring-white/5">
              <Sparkles className="h-5 w-5" /> Suggest
            </div>
          )}
          {hasReading ? (
            <Link
              to="/move"
              className="col-span-2 flex items-center justify-center gap-2 rounded-2xl bg-white/10 px-4 py-4 font-semibold text-white ring-1 ring-white/15 transition active:scale-[0.98]"
            >
              <Activity className="h-5 w-5" /> Move
            </Link>
          ) : (
            <div className="col-span-2 flex items-center justify-center gap-2 rounded-2xl bg-white/5 px-4 py-4 text-sm text-white/40 ring-1 ring-white/5">
              <Activity className="h-5 w-5" /> Move
            </div>
          )}
        </div>

        <p className="pt-2 text-center text-xs text-white/50">
          Informational only. Not medical advice.
        </p>
      </div>
    </AppShell>
  );
}
