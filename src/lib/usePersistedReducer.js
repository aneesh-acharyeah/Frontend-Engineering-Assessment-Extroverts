import { useEffect, useReducer } from 'react';

/**
 * useReducer that mirrors state into sessionStorage.
 *
 * Wrapped in try/catch on both ends: private-mode Safari throws on write, and a
 * stale or hand-edited value would otherwise crash the wizard on mount. Any
 * failure just falls back to `initialState`.
 */
export default function usePersistedReducer(reducer, initialState, storageKey) {
  const [state, dispatch] = useReducer(reducer, initialState, (fallback) => {
    try {
      const stored = sessionStorage.getItem(storageKey);
      if (!stored) return fallback;
      const parsed = JSON.parse(stored);
      // Merge rather than replace, so a shape change in a new build cannot
      // resurrect a half-populated state object.
      return { ...fallback, ...parsed };
    } catch {
      return fallback;
    }
  });

  useEffect(() => {
    try {
      sessionStorage.setItem(storageKey, JSON.stringify(state));
    } catch {
      /* storage unavailable or full - persistence is a convenience, not a requirement */
    }
  }, [state, storageKey]);

  return [state, dispatch];
}

export function clearPersisted(storageKey) {
  try {
    sessionStorage.removeItem(storageKey);
  } catch {
    /* no-op */
  }
}
