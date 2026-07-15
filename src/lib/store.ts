import { useSyncExternalStore } from "react";

export type Reading = { value: number; at: number };

type State = {
  glucose: number | null;
  liked: string[];
  recent: string[];
  history: Reading[];
};

const KEY = "novak-nutrition-v2";

function load(): State {
  if (typeof window === "undefined")
    return { glucose: null, liked: [], recent: [], history: [] };
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<State>;
      return {
        glucose: parsed.glucose ?? null,
        liked: parsed.liked ?? [],
        recent: parsed.recent ?? [],
        history: parsed.history ?? [],
      };
    }
  } catch {}
  return { glucose: null, liked: [], recent: [], history: [] };
}

let state: State = { glucose: null, liked: [], recent: [], history: [] };
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

const serverSnap: State = { glucose: null, liked: [], recent: [], history: [] };

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
    const at = Date.now();
    // Cap history at 100 readings
    const history = [...state.history, { value: v, at }].slice(-100);
    state = { ...state, glucose: v, history };
    emit();
  },
  clearGlucose() {
    state = { ...state, glucose: null };
    emit();
  },
  clearHistory() {
    state = { ...state, history: [] };
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
