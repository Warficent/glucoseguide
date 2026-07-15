import { useSyncExternalStore } from "react";

type State = {
  glucose: number | null;
  liked: string[];
  recent: string[];
};

const KEY = "novak-nutrition-v1";

function load(): State {
  if (typeof window === "undefined") return { glucose: null, liked: [], recent: [] };
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { glucose: null, liked: [], recent: [] };
}

let state: State = { glucose: null, liked: [], recent: [] };
let hydrated = false;
const listeners = new Set<() => void>();

function emit() {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  }
  listeners.forEach((l) => l());
}

function ensureHydrated() {
  if (!hydrated && typeof window !== "undefined") {
    state = load();
    hydrated = true;
  }
}

function subscribe(l: () => void) {
  ensureHydrated();
  listeners.add(l);
  return () => listeners.delete(l);
}

const serverSnap: State = { glucose: null, liked: [], recent: [] };

export function useAppState<T>(selector: (s: State) => T): T {
  return useSyncExternalStore(
    subscribe,
    () => {
      ensureHydrated();
      return selector(state);
    },
    () => selector(serverSnap),
  );
}

export const actions = {
  setGlucose(v: number) {
    state = { ...state, glucose: v };
    emit();
  },
  clearGlucose() {
    state = { ...state, glucose: null };
    emit();
  },
  toggleLike(id: string) {
    const liked = state.liked.includes(id)
      ? state.liked.filter((x) => x !== id)
      : [...state.liked, id];
    state = { ...state, liked };
    emit();
  },
  addRecent(id: string) {
    const recent = [id, ...state.recent.filter((x) => x !== id)].slice(0, 5);
    state = { ...state, recent };
    emit();
  },
};
