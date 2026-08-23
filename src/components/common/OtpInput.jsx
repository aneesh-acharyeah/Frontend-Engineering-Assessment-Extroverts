import { useEffect, useRef } from 'react';
import FieldError from './FieldError.jsx';

/**
 * Segmented one-time-code input.
 *
 * The app draws six thin underlines with a dot placeholder above each. That
 * shape is kept, but the behaviour is rebuilt — the brief names this screen as
 * the app's weak spot:
 *   - type to auto-advance, Backspace on an empty box steps back
 *   - arrow keys and Home/End move between boxes
 *   - pasting a 6-digit code fills every box at once, from any position
 *   - `autocomplete="one-time-code"` lets the OS offer the SMS/email code
 *   - non-digits are stripped on input rather than merely blocked by `pattern`
 *   - `onComplete` fires as the last digit lands, so there is no dead beat
 */
export default function OtpInput({
  length = 6,
  value = '',
  onChange,
  onComplete,
  error,
  disabled = false,
  autoFocus = true,
}) {
  const inputsRef = useRef([]);
  const completedRef = useRef(false);

  const digits = Array.from({ length }, (_, index) => value[index] ?? '');

  useEffect(() => {
    if (autoFocus) inputsRef.current[0]?.focus();
  }, [autoFocus]);

  // Fire onComplete exactly once per completed code, and re-arm when it changes.
  useEffect(() => {
    if (value.length === length && !completedRef.current) {
      completedRef.current = true;
      onComplete?.(value);
    } else if (value.length < length) {
      completedRef.current = false;
    }
  }, [value, length, onComplete]);

  const focusBox = (index) => {
    const target = inputsRef.current[Math.max(0, Math.min(length - 1, index))];
    target?.focus();
    target?.select();
  };

  const setDigit = (index, digit) => {
    const next = digits.slice();
    next[index] = digit;
    onChange(next.join('').replace(/\s/g, ''));
  };

  const handleChange = (index, raw) => {
    const clean = raw.replace(/\D/g, '');
    if (!clean) {
      setDigit(index, '');
      return;
    }
    if (clean.length > 1) {
      const next = digits.slice();
      clean.split('').forEach((digit, offset) => {
        if (index + offset < length) next[index + offset] = digit;
      });
      onChange(next.join(''));
      focusBox(index + clean.length);
      return;
    }
    setDigit(index, clean);
    if (index < length - 1) focusBox(index + 1);
  };

  const handleKeyDown = (index, event) => {
    switch (event.key) {
      case 'Backspace':
        if (!digits[index] && index > 0) {
          event.preventDefault();
          setDigit(index - 1, '');
          focusBox(index - 1);
        }
        break;
      case 'ArrowLeft':
        event.preventDefault();
        focusBox(index - 1);
        break;
      case 'ArrowRight':
        event.preventDefault();
        focusBox(index + 1);
        break;
      case 'Home':
        event.preventDefault();
        focusBox(0);
        break;
      case 'End':
        event.preventDefault();
        focusBox(length - 1);
        break;
      default:
        break;
    }
  };

  const handlePaste = (event) => {
    event.preventDefault();
    const pasted = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    if (!pasted) return;
    onChange(pasted);
    focusBox(pasted.length >= length ? length - 1 : pasted.length);
  };

  return (
    <div>
      {/* Screen readers get one coherent label rather than six anonymous boxes. */}
      <div
        role="group"
        aria-label={`Enter the ${length}-digit verification code`}
        onPaste={handlePaste}
        className={`flex justify-between gap-2.5 sm:gap-4 ${error ? 'animate-shake' : ''}`}
      >
        {digits.map((digit, index) => (
          <div key={index} className="relative flex-1">
            <input
              ref={(element) => {
                inputsRef.current[index] = element;
              }}
              type="text"
              inputMode="numeric"
              autoComplete={index === 0 ? 'one-time-code' : 'off'}
              aria-label={`Digit ${index + 1} of ${length}`}
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? 'otp-error' : undefined}
              maxLength={1}
              disabled={disabled}
              value={digit}
              onChange={(event) => handleChange(index, event.target.value)}
              onKeyDown={(event) => handleKeyDown(index, event)}
              onFocus={(event) => event.target.select()}
              className={[
                'peer h-14 w-full bg-transparent pb-1 text-center',
                'text-2xl font-semibold tabular-nums text-white',
                'border-b-2 transition-colors duration-200 focus:border-white',
                'disabled:opacity-40',
                error ? 'border-danger/80' : digit ? 'border-white/70' : 'border-white/25',
              ].join(' ')}
            />
            {/* The app's dot placeholder, hidden once a digit is present. */}
            {!digit ? (
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 text-center text-lg leading-none text-white/30 peer-focus:opacity-0"
              >
                •
              </span>
            ) : null}
          </div>
        ))}
      </div>
      <FieldError id="otp-error" message={error} />
    </div>
  );
}
