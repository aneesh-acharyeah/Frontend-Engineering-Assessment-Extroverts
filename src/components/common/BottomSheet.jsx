import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import useReducedMotion from '../../lib/useReducedMotion.js';

/**
 * Modal sheet that rises from the bottom edge — the app uses this for date of
 * birth and pronoun selection rather than inline controls.
 *
 * Adds the things the app's sheets lack: Escape to close, a focus trap while
 * open, focus restored to the trigger on close, and `body` scroll lock.
 */
export default function BottomSheet({ open, onClose, title, subtitle, children }) {
  const panelRef = useRef(null);
  const previouslyFocused = useRef(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!open) return undefined;

    previouslyFocused.current = document.activeElement;
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        onClose();
        return;
      }
      if (event.key !== 'Tab' || !panelRef.current) return;

      // Focus trap: cycle within the sheet rather than escaping to the page behind.
      const focusables = panelRef.current.querySelectorAll(
        'button:not([disabled]), [href], input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    // Defer so the panel exists before we reach into it.
    const focusTimer = setTimeout(() => {
      panelRef.current?.querySelector('input, button')?.focus();
    }, 60);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = overflow;
      clearTimeout(focusTimer);
      previouslyFocused.current?.focus?.();
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-[80] flex items-end justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.2 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            aria-hidden="true"
          />

          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial={{ y: reduced ? 0 : '100%' }}
            animate={{ y: 0 }}
            exit={{ y: reduced ? 0 : '100%' }}
            transition={reduced ? { duration: 0 } : { type: 'spring', damping: 32, stiffness: 320 }}
            className="relative flex max-h-[88dvh] w-full max-w-lg flex-col rounded-t-[1.75rem] border-t border-white/10 bg-[#151515] pb-[max(1.25rem,env(safe-area-inset-bottom))]"
          >
            <div className="flex justify-center pb-1 pt-3" aria-hidden="true">
              <span className="h-1 w-10 rounded-full bg-white/30" />
            </div>

            <div className="flex items-start justify-between gap-4 px-6 pb-4 pt-2">
              <div>
                <h2 className="text-2xl font-bold uppercase leading-none tracking-tight text-white">
                  {title}
                </h2>
                {subtitle ? <p className="mt-2 text-sm text-white/50">{subtitle}</p> : null}
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="-mr-2 -mt-1 rounded-full p-2 text-white/60 transition-colors hover:text-white"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <div className="no-scrollbar flex-1 overflow-y-auto px-6">{children}</div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
