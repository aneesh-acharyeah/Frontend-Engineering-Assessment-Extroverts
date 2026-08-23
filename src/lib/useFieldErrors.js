import { useCallback, useMemo, useRef, useState } from 'react';

/**
 * Shared touched/error bookkeeping for a wizard step.
 *
 * `errorMap` is recomputed by the caller on every render from the pure
 * validators, so errors are always current. This hook only decides whether an
 * error is *shown* yet — the on-blur-first, then-on-change rule the brief asks
 * for:
 *
 *   - a field shows its error only once it has been touched (blurred), so the
 *     form does not shout at someone still typing their first character
 *   - once touched, it re-validates on every keystroke, so the message clears
 *     the moment the input becomes valid
 *   - pressing Next touches everything at once, revealing every outstanding
 *     problem and focusing the first one
 */
export default function useFieldErrors(errorMap) {
  const [touched, setTouched] = useState({});
  const fieldRefs = useRef({});

  const registerRef = useCallback(
    (field) => (element) => {
      fieldRefs.current[field] = element;
    },
    []
  );

  const touch = useCallback((field) => {
    setTouched((current) => (current[field] ? current : { ...current, [field]: true }));
  }, []);

  const touchAll = useCallback(() => {
    setTouched(Object.keys(errorMap).reduce((all, field) => ({ ...all, [field]: true }), {}));
  }, [errorMap]);

  const showError = useCallback((field) => (touched[field] ? (errorMap[field] ?? null) : null), [touched, errorMap]);

  const firstInvalid = useMemo(
    () => Object.keys(errorMap).find((field) => errorMap[field]) ?? null,
    [errorMap]
  );

  const isValid = firstInvalid === null;

  /** Touch everything, focus the first offending field, and report validity. */
  const validateAll = useCallback(() => {
    touchAll();
    if (firstInvalid) {
      const element = fieldRefs.current[firstInvalid];
      element?.focus?.();
      element?.scrollIntoView?.({ block: 'center', behavior: 'smooth' });
      return false;
    }
    return true;
  }, [touchAll, firstInvalid]);

  return { touch, touchAll, showError, validateAll, isValid, firstInvalid, registerRef };
}
