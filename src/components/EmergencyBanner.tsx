import { AlertTriangle } from "lucide-react";
import type { Zone } from "@/lib/data";

export function EmergencyBanner({ zone }: { zone: Zone }) {
  if (zone !== "severe-low" && zone !== "severe-high") return null;
  const isLow = zone === "severe-low";
  return (
    <div className="rounded-2xl border border-red-900/40 bg-red-700 p-4 text-white shadow-lg">
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
        <div className="space-y-2 text-sm leading-snug">
          <p className="font-serif text-base font-semibold tracking-tight">
            {isLow ? "Severe low — act now" : "Severe high — seek help"}
          </p>
          {isLow ? (
            <p>
              Take fast-acting sugar immediately if you can self-treat. If you feel
              confused, are unable to self-treat, or are losing consciousness, call
              911 or your local emergency services right now.
            </p>
          ) : (
            <p>
              Call 911 or your local emergency services, especially if you have
              nausea, vomiting, confusion, rapid breathing, or fruity-smelling
              breath — these can be signs of diabetic ketoacidosis (DKA).
            </p>
          )}
          <p className="text-white/80">
            This app can't replace emergency medical care.
          </p>
        </div>
      </div>
    </div>
  );
}
