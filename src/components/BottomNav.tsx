import { Link } from "@tanstack/react-router";
import { Home, Sparkles, Activity, ListChecks } from "lucide-react";

const tabs = [
  { to: "/", label: "Home", Icon: Home },
  { to: "/suggest", label: "Suggest", Icon: Sparkles },
  { to: "/move", label: "Move", Icon: Activity },
  { to: "/select", label: "Select", Icon: ListChecks },
] as const;

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-black/5 bg-white/95 backdrop-blur">
      <ul className="mx-auto flex max-w-md items-stretch justify-around px-2 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        {tabs.map(({ to, label, Icon }) => (
          <li key={to} className="flex-1">
            <Link
              to={to}
              activeOptions={{ exact: to === "/" }}
              className="group flex flex-col items-center gap-1 rounded-xl py-1.5 text-[11px] font-medium text-ink/60 transition-colors data-[status=active]:text-primary"
            >
              <Icon className="h-5 w-5" strokeWidth={2.2} />
              <span>{label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
