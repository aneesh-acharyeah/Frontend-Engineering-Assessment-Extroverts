import { useId } from 'react';
import FieldError from './FieldError.jsx';

/**
 * Pill-chip selector, single or multi. Rendered as a real fieldset/radiogroup so
 * arrow keys and screen readers behave, rather than a pile of clickable divs.
 */
export default function ChipGroup({
  label,
  options,
  value,
  onChange,
  multiple = false,
  error,
  hint,
  max,
  className = '',
}) {
  const id = useId();
  const errorId = `${id}-error`;
  const selected = multiple ? value ?? [] : value;

  const isSelected = (optionId) => (multiple ? selected.includes(optionId) : selected === optionId);

  const toggle = (optionId) => {
    if (!multiple) {
      onChange(selected === optionId ? null : optionId);
      return;
    }
    if (selected.includes(optionId)) {
      onChange(selected.filter((item) => item !== optionId));
    } else {
      if (max && selected.length >= max) return;
      onChange([...selected, optionId]);
    }
  };

  return (
    <fieldset className={className} aria-describedby={error ? errorId : undefined}>
      <legend className="mb-3 text-xs font-medium uppercase tracking-[0.16em] text-white/50">
        {label}
      </legend>

      <div role={multiple ? 'group' : 'radiogroup'} className="flex flex-wrap gap-2">
        {options.map((option) => {
          const active = isSelected(option.id);
          const blocked = multiple && !active && max && selected.length >= max;
          return (
            <button
              key={option.id}
              type="button"
              role={multiple ? 'checkbox' : 'radio'}
              aria-checked={active}
              disabled={blocked || undefined}
              onClick={() => toggle(option.id)}
              className={[
                'inline-flex min-h-[40px] items-center gap-1.5 rounded-full border px-4 py-2',
                'text-sm transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-30',
                active
                  ? 'border-white bg-white text-black'
                  : 'border-white/12 bg-white/[0.03] text-white/70 hover:border-white/35 hover:text-white',
              ].join(' ')}
            >
              {option.emoji ? (
                <span aria-hidden="true" className="text-base leading-none">
                  {option.emoji}
                </span>
              ) : null}
              {option.label}
            </button>
          );
        })}
      </div>

      {hint && !error ? <p className="mt-3 text-xs text-white/35">{hint}</p> : null}
      <FieldError id={errorId} message={error} />
    </fieldset>
  );
}
