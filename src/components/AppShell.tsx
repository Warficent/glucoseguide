import type { ReactNode } from "react";
import { BottomNav } from "./BottomNav";

export function AppShell({
  children,
  title,
  tone = "light",
}: {
  children: ReactNode;
  title: string;
  tone?: "light" | "dark";
}) {
  const bg = tone === "dark" ? "bg-[#1E3D2A] text-white" : "bg-white text-ink";
  return (
    <div className={`min-h-dvh ${bg}`}>
      <header className="sticky top-0 z-30 bg-primary text-white shadow-md">
        <div className="mx-auto flex max-w-md items-center justify-between px-5 pt-[max(1rem,env(safe-area-inset-top))] pb-3">
          <h1 className="font-serif text-xl font-semibold tracking-tight">
            Novak Nutrition
          </h1>
          <span className="text-xs uppercase tracking-[0.2em] text-white/70">
            {title}
          </span>
        </div>
      </header>
      <main className="mx-auto max-w-md px-5 pb-28 pt-5">{children}</main>
      <BottomNav />
    </div>
  );
}
