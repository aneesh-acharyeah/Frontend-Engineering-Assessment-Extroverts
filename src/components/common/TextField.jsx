import { forwardRef, useId } from 'react';
import FieldError from './FieldError.jsx';

/**
 * Text input matching the app's field style: an uppercase label above a tall,
 * generously rounded box with a hairline border and a transparent fill, then
 * helper text beneath.
 *
 * Accessibility contract: the input owns `aria-invalid` and points
 * `aria-describedby` at whichever of {hint, counter, error} are present, so a
 * screen reader announces the problem as soon as focus lands on the field.
 */
const TextField = forwardRef(function TextField(
  {
    label,
    value,
    onChange,
    onBlur,
    error,
    hint,
    maxLength,
    showCounter = false,
    leading,
    trailing,
    // Renders as a button that opens a sheet rather than a typed field.
    readOnlyDisplay = false,
    className = '',
    id: providedId,
    ...props
  },
  ref
) {
  const generatedId = useId();
  const id = providedId ?? generatedId;
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;
  const counterId = `${id}-counter`;
  const length = (value ?? '').length;

  const describedBy = [error ? errorId : null, hint ? hintId : null, showCounter ? counterId : null]
    .filter(Boolean)
    .join(' ');

  const boxClasses = [
    'field-surface w-full rounded-2xl border bg-white/[0.03] px-5 text-[17px] text-white',
    'min-h-[68px] placeholder:text-white/30 transition-colors duration-200',
    'focus:border-white/60',
    leading ? 'pl-16' : '',
    trailing ? 'pr-12' : '',
    error ? 'border-danger/70' : 'border-white/30',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={className}>
      <div className="mb-2.5 flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-[15px] uppercase tracking-[0.04em] text-white/70">
          {label}
        </label>
        {showCounter && maxLength ? (
          <span
            id={counterId}
            className={`text-xs tabular-nums ${length >= maxLength ? 'text-danger' : 'text-white/30'}`}
          >
            {length}/{maxLength}
          </span>
        ) : null}
      </div>

      <div className="relative">
        {leading ? (
          <span className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-[17px] text-white/45">
            {leading}
          </span>
        ) : null}

        {readOnlyDisplay ? (
          <button
            ref={ref}
            id={id}
            type="button"
            aria-invalid={error ? true : undefined}
            aria-describedby={describedBy || undefined}
            className={`${boxClasses} flex items-center justify-between text-left`}
            {...props}
          >
            <span className={value ? 'text-white' : 'text-white/25'}>{value || props.placeholder}</span>
            {trailing}
          </button>
        ) : (
          <input
            ref={ref}
            id={id}
            value={value ?? ''}
            onChange={onChange}
            onBlur={onBlur}
            maxLength={maxLength}
            aria-invalid={error ? true : undefined}
            aria-describedby={describedBy || undefined}
            className={boxClasses}
            {...props}
          />
        )}

        {trailing && !readOnlyDisplay ? (
          <span className="absolute right-5 top-1/2 -translate-y-1/2 text-white/30">{trailing}</span>
        ) : null}
      </div>

      {hint && !error ? (
        <p id={hintId} className="mt-3 text-[15px] leading-relaxed text-white/55">
          {hint}
        </p>
      ) : null}
      <FieldError id={errorId} message={error} />
    </div>
  );
});

export default TextField;
