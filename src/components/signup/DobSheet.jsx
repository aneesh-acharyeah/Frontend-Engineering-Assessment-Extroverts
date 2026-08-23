import { useEffect, useRef, useState } from 'react';
import BottomSheet from '../common/BottomSheet.jsx';
import Button from '../common/Button.jsx';
import FieldError from '../common/FieldError.jsx';
import { ageFrom, digitsOnly, toIsoDate, validateDateParts } from '../../lib/validators.js';
import { MIN_AGE } from '../../data/constants.js';

const FIELDS = [
  { key: 'day', placeholder: 'DD', max: 2, label: 'Day' },
  { key: 'month', placeholder: 'MM', max: 2, label: 'Month' },
  { key: 'year', placeholder: 'YYYY', max: 4, label: 'Year' },
];

/**
 * The app's DATE OF BIRTH sheet: three numeric boxes and a PROCEED button.
 *
 * Improvements over the original, which ships a stray "0" in the day box and
 * accepts any age: real placeholders, auto-advance between boxes, calendar
 * validation, and an explicit under-18 refusal.
 */
export default function DobSheet({ open, onClose, initial, onConfirm }) {
  const [parts, setParts] = useState(initial);
  const [error, setError] = useState(null);
  const refs = useRef({});

  useEffect(() => {
    if (open) {
      setParts(initial);
      setError(null);
    }
  }, [open, initial]);

  const age = (() => {
    if (validateDateParts(parts)) return null;
    return ageFrom(toIsoDate(parts));
  })();

  const update = (key, raw, max) => {
    const value = digitsOnly(raw, max);
    setParts((current) => ({ ...current, [key]: value }));
    if (error) setError(null);
    // Jump to the next box once this one is full.
    if (value.length === max) {
      const index = FIELDS.findIndex((field) => field.key === key);
      refs.current[FIELDS[index + 1]?.key]?.focus();
    }
  };

  const handleConfirm = () => {
    const formatError = validateDateParts(parts);
    if (formatError) {
      setError(formatError);
      return;
    }
    const iso = toIsoDate(parts);
    const years = ageFrom(iso);
    if (years < MIN_AGE) {
      // The app lets this through. We stop it here, at the point of entry.
      setError(`You must be ${MIN_AGE} or older to join Extroverts.`);
      return;
    }
    onConfirm(iso);
  };

  return (
    <BottomSheet open={open} onClose={onClose} title="Date of Birth" subtitle="You must be 18 or older.">
      <div className="pb-6">
        <div className="flex gap-3">
          {FIELDS.map((field) => (
            <div key={field.key} className="flex-1">
              <label htmlFor={`dob-${field.key}`} className="sr-only">
                {field.label}
              </label>
              <input
                ref={(element) => {
                  refs.current[field.key] = element;
                }}
                id={`dob-${field.key}`}
                type="text"
                inputMode="numeric"
                autoComplete={field.key === 'year' ? 'bday-year' : `bday-${field.key}`}
                placeholder={field.placeholder}
                maxLength={field.max}
                value={parts[field.key]}
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? 'dob-error' : undefined}
                onChange={(event) => update(field.key, event.target.value, field.max)}
                onKeyDown={(event) => {
                  // Backspace at the start of an empty box steps back a field.
                  if (event.key === 'Backspace' && !parts[field.key]) {
                    const index = FIELDS.findIndex((item) => item.key === field.key);
                    refs.current[FIELDS[index - 1]?.key]?.focus();
                  }
                }}
                className={`field-surface-raised h-16 w-full rounded-2xl border bg-white/[0.07] text-center text-xl tabular-nums text-white placeholder:text-white/40 transition-colors focus:border-white/70 ${
                  error ? 'border-danger/70' : 'border-white/45'
                }`}
              />
            </div>
          ))}
        </div>

        <FieldError id="dob-error" message={error} />

        {age !== null && !error ? (
          <p className="mt-3 text-sm text-white/45">
            That makes you <span className="font-medium text-white">{age}</span>.
          </p>
        ) : null}

        <div className="mt-6">
          <Button onClick={handleConfirm}>Proceed</Button>
        </div>
      </div>
    </BottomSheet>
  );
}
