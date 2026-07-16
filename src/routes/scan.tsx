import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { AppShell } from "@/components/AppShell";
import { EmergencyBanner } from "@/components/EmergencyBanner";
import { useAppState } from "@/lib/store";
import { zoneFor, zoneColor, zoneLabel } from "@/lib/data";
import { scanFood, type ScanResult } from "@/lib/scan.functions";
import { Camera, Loader2, RotateCcw, Upload } from "lucide-react";

export const Route = createFileRoute("/scan")({
  head: () => ({
    meta: [
      { title: "Scan food — Glucose Guide" },
      {
        name: "description",
        content:
          "Snap a photo of any food and get a 1–10 rating based on your current blood glucose reading.",
      },
    ],
  }),
  component: ScanPage,
});

function ScanPage() {
  const glucose = useAppState((s) => s.glucose);
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const run = useServerFn(scanFood);

  const zone = glucose != null ? zoneFor(glucose) : null;
  const emergency = zone === "severe-low" || zone === "severe-high";

  async function handleFile(file: File) {
    setError(null);
    setResult(null);
    setLoading(true);
    try {
      const dataUrl = await toDataUrl(file);
      setPreview(dataUrl);
      const res = await run({ data: { imageDataUrl: dataUrl, glucose } });
      setResult(res);
    } catch (e) {
      console.error(e);
      setError(
        "We couldn't analyze that photo. Try again with better lighting or a clearer shot.",
      );
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setPreview(null);
    setResult(null);
    setError(null);
    if (fileRef.current) fileRef.current.value = "";
  }

  return (
    <AppShell title="Scan">
      <div className="space-y-5">
        {emergency && glucose != null && <EmergencyBanner zone={zone!} />}

        <div className="rounded-3xl bg-lavender p-5">
          <div className="flex items-center gap-2">
            <Camera className="h-4 w-4 text-primary" />
            <h2 className="font-serif text-lg font-semibold text-ink">
              Rate what's in front of you
            </h2>
          </div>
          <p className="mt-2 text-sm text-ink/70">
            Take a photo of your food. We'll identify it and rate 1–10 how good
            a choice it is for your current glucose.
          </p>

          <div className="mt-4 flex items-center justify-between rounded-2xl bg-white p-3 text-sm">
            <span className="text-ink/60">Current reading</span>
            {glucose != null && zone ? (
              <span
                className="rounded-full px-3 py-1 text-xs font-semibold text-white"
                style={{ background: zoneColor(zone) }}
              >
                {glucose} mg/dL · {zoneLabel(zone)}
              </span>
            ) : (
              <span className="text-xs text-ink/50">Not logged</span>
            )}
          </div>
        </div>

        {!preview && (
          <div className="grid gap-3">
            <label className="flex cursor-pointer flex-col items-center gap-2 rounded-3xl bg-primary p-6 text-center text-white shadow-lg active:scale-[0.99]">
              <Camera className="h-8 w-8" />
              <span className="font-serif text-lg font-semibold">
                Take a photo
              </span>
              <span className="text-xs text-white/75">
                Opens your camera on mobile
              </span>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleFile(f);
                }}
              />
            </label>

            <label className="flex cursor-pointer items-center justify-center gap-2 rounded-2xl bg-lavender p-4 text-sm font-semibold text-ink active:scale-[0.99]">
              <Upload className="h-4 w-4" />
              Upload from gallery
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleFile(f);
                }}
              />
            </label>
          </div>
        )}

        {preview && (
          <div className="overflow-hidden rounded-3xl bg-lavender">
            <img
              src={preview}
              alt="Scanned food"
              className="h-64 w-full object-cover"
            />
            <div className="p-5">
              {loading && (
                <div className="flex items-center gap-2 text-sm text-ink/70">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Analyzing your food…
                </div>
              )}
              {error && (
                <p className="rounded-2xl bg-red-50 p-3 text-sm text-red-700">
                  {error}
                </p>
              )}
              {result && <ResultCard result={result} />}
              <button
                onClick={reset}
                className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-xs font-semibold text-ink"
              >
                <RotateCcw className="h-3.5 w-3.5" /> Scan another
              </button>
            </div>
          </div>
        )}

        <p className="text-center text-[11px] text-ink/40">
          Estimates only — not medical advice. Always confirm carbs on the label
          when possible.
        </p>
      </div>
    </AppShell>
  );
}

function ResultCard({ result }: { result: ScanResult }) {
  const color =
    result.rating >= 8
      ? "#16a34a"
      : result.rating >= 5
      ? "#6C2BD9"
      : result.rating >= 3
      ? "#dc2626"
      : "#7f1d1d";
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="font-serif text-2xl font-semibold text-ink">
            {result.name}
          </h3>
          <p className="text-[11px] uppercase tracking-widest text-ink/50">
            {result.confidence} confidence
          </p>
        </div>
        <div
          className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl text-white"
          style={{ background: color }}
        >
          <span className="font-serif text-2xl font-bold tabular-nums leading-none">
            {result.rating}
          </span>
          <span className="text-[10px] opacity-80">/ 10</span>
        </div>
      </div>
      <div className="rounded-2xl bg-white p-3 text-sm text-ink/80">
        <span className="font-semibold text-ink">~{result.carbs} g carbs</span>{" "}
        per typical serving
      </div>
      <p className="rounded-2xl bg-white p-3 text-sm leading-relaxed text-ink/80">
        {result.reason}
      </p>
    </div>
  );
}

function toDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result));
    r.onerror = () => reject(r.error);
    r.readAsDataURL(file);
  });
}
