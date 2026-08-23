import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';

const ToastContext = createContext(null);

const TONES = {
  error: {
    ring: 'border-danger/40 bg-danger/10',
    icon: '⚠',
    iconClass: 'text-danger',
  },
  success: {
    ring: 'border-emerald-400/40 bg-emerald-400/10',
    icon: '✓',
    iconClass: 'text-emerald-400',
  },
  info: {
    ring: 'border-vibe-400/40 bg-vibe-400/10',
    icon: 'ℹ',
    iconClass: 'text-vibe-300',
  },
};

/**
 * Global alert channel. Used for submission-level failures only — field-level
 * problems render beneath their input instead, so the two never compete.
 */
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timers = useRef(new Map());

  const dismiss = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
    const timer = timers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
  }, []);

  const push = useCallback(
    (message, { tone = 'error', duration = 5000 } = {}) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      setToasts((current) => [...current.slice(-2), { id, message, tone }]);
      timers.current.set(
        id,
        setTimeout(() => dismiss(id), duration)
      );
      return id;
    },
    [dismiss]
  );

  const value = useMemo(
    () => ({
      toast: push,
      error: (message, options) => push(message, { ...options, tone: 'error' }),
      success: (message, options) => push(message, { ...options, tone: 'success' }),
      info: (message, options) => push(message, { ...options, tone: 'info' }),
      dismiss,
    }),
    [push, dismiss]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        // polite, not assertive: an error toast should not interrupt a screen
        // reader mid-word while the user is still typing.
        role="status"
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 top-4 z-[100] flex flex-col items-center gap-2 px-4 sm:top-6"
      >
        {toasts.map((toast) => {
          const tone = TONES[toast.tone] ?? TONES.info;
          return (
            <div
              key={toast.id}
              className={`pointer-events-auto flex w-full max-w-md animate-toast-in items-start gap-3 rounded-2xl border px-4 py-3 backdrop-blur-xl ${tone.ring}`}
            >
              <span className={`mt-0.5 text-base leading-none ${tone.iconClass}`} aria-hidden="true">
                {tone.icon}
              </span>
              <p className="flex-1 text-sm leading-snug text-white">{toast.message}</p>
              <button
                type="button"
                onClick={() => dismiss(toast.id)}
                aria-label="Dismiss notification"
                className="-mr-1 -mt-1 rounded-full p-1.5 text-white/40 transition-colors hover:text-white"
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                  <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used inside a <ToastProvider>');
  return context;
}
