import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { actions } from "@/lib/store";

export const Route = createFileRoute("/log")({
  head: () => ({
    meta: [{ title: "Log glucose — Novak Nutrition" }],
  }),
  component: LogPage,
});

function LogPage() {
  const [value, setValue] = useState("");
  const navigate = useNavigate();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const n = Number(value);
    if (!Number.isFinite(n) || n <= 0) return;
    actions.setGlucose(Math.round(n));
    navigate({ to: "/suggest" });
  }

  return (
    <AppShell title="Log">
      <form onSubmit={submit} className="space-y-6">
        <div className="rounded-3xl bg-lavender p-6">
          <label className="text-xs font-semibold uppercase tracking-[0.2em] text-ink/60">
            Blood glucose
          </label>
          <div className="mt-3 flex items-baseline gap-2">
            <input
              autoFocus
              inputMode="numeric"
              pattern="[0-9]*"
              value={value}
              onChange={(e) => setValue(e.target.value.replace(/[^0-9]/g, ""))}
              placeholder="120"
              className="w-full bg-transparent font-serif text-6xl font-semibold tabular-nums text-ink outline-none placeholder:text-ink/20"
            />
            <span className="text-lg font-medium text-ink/60">mg/dL</span>
          </div>
          <p className="mt-4 text-xs text-ink/50">
            Typical target range is 70–180 mg/dL.
          </p>
        </div>
        <button
          type="submit"
          disabled={!value}
          className="w-full rounded-2xl bg-primary px-4 py-4 font-semibold text-white shadow-lg shadow-primary/20 transition active:scale-[0.98] disabled:opacity-40"
        >
          Confirm
        </button>
      </form>
    </AppShell>
  );
}
