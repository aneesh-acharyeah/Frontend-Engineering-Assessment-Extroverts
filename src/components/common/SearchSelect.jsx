import { forwardRef, useEffect, useId, useImperativeHandle, useMemo, useRef, useState } from 'react';
import FieldError from './FieldError.jsx';

/**
 * Searchable single-select combobox.
 *
 * Used for the State -> City -> College cascade. When `disabled` (because the
 * parent field is still empty) it shows `disabledHint` instead of the
 * placeholder, so the dependency is explained rather than just greyed out.
 */
const SearchSelect = forwardRef(function SearchSelect(
  {
    label,
    options,
    value,
    onChange,
    onBlur,
    placeholder = 'Select…',
    disabledHint = 'Choose the field above first',
    error,
    disabled = false,
    className = '',
  },
  ref
) {
  const id = useId();
  const listId = `${id}-list`;
  const errorId = `${id}-error`;

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);

  const rootRef = useRef(null);
  const inputRef = useRef(null);
  const optionRefs = useRef([]);

  // useFieldErrors focuses the first invalid field by ref; forward that to the input.
  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current?.focus(),
    scrollIntoView: (options) => rootRef.current?.scrollIntoView(options),
  }));

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return options;
    return options.filter((option) => option.toLowerCase().includes(needle));
  }, [options, query]);

  // Click-outside closes and reverts the query to the committed value.
  useEffect(() => {
    if (!open) return undefined;
    const onPointerDown = (event) => {
      if (!rootRef.current?.contains(event.target)) {
        setOpen(false);
        setQuery('');
      }
    };
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  // Keep the highlighted option scrolled into view during keyboard nav.
  useEffect(() => {
    if (open) optionRefs.current[activeIndex]?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex, open]);

  const commit = (option) => {
    onChange(option);
    setQuery('');
    setOpen(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (event) => {
    if (disabled) return;
    if (!open && ['ArrowDown', 'Enter', ' '].includes(event.key)) {
      event.preventDefault();
      setOpen(true);
      setActiveIndex(Math.max(0, filtered.indexOf(value)));
      return;
    }
    if (!open) return;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setActiveIndex((index) => (index + 1) % Math.max(1, filtered.length));
        break;
      case 'ArrowUp':
        event.preventDefault();
        setActiveIndex((index) => (index - 1 + filtered.length) % Math.max(1, filtered.length));
        break;
      case 'Enter':
        event.preventDefault();
        if (filtered[activeIndex]) commit(filtered[activeIndex]);
        break;
      case 'Escape':
        event.preventDefault();
        setOpen(false);
        setQuery('');
        break;
      case 'Tab':
        setOpen(false);
        setQuery('');
        break;
      default:
        break;
    }
  };

  const displayed = open ? query : (value ?? '');

  return (
    <div className={className} ref={rootRef}>
      <label htmlFor={id} className="mb-2 block text-xs font-medium uppercase tracking-[0.16em] text-white/50">
        {label}
      </label>

      <div className="relative">
        <input
          ref={inputRef}
          id={id}
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={open && filtered[activeIndex] ? `${id}-opt-${activeIndex}` : undefined}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          autoComplete="off"
          disabled={disabled}
          placeholder={disabled ? disabledHint : placeholder}
          value={displayed}
          onChange={(event) => {
            setQuery(event.target.value);
            setActiveIndex(0);
            if (!open) setOpen(true);
          }}
          onFocus={() => !disabled && setOpen(true)}
          onBlur={onBlur}
          onKeyDown={handleKeyDown}
          className={[
            'field-surface w-full cursor-pointer rounded-2xl border bg-white/[0.03] px-4 py-3.5 pr-11 text-base text-white',
            'placeholder:text-white/30 transition-colors duration-200',
            'focus:border-white/40 focus:bg-white/[0.07]',
            // A disabled dependent field must still read as a field, so its
            // border dims rather than disappearing.
            'disabled:cursor-not-allowed disabled:border-white/15 disabled:bg-white/[0.01] disabled:text-white/25',
            error ? 'border-danger/70 bg-danger/[0.06]' : 'border-white/30',
          ].join(' ')}
        />

        <span
          aria-hidden="true"
          className={`pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 transition-transform duration-200 ${
            open ? 'rotate-180' : ''
          } ${disabled ? 'text-white/15' : 'text-white/35'}`}
        >
          <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
            <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </span>

        {open && !disabled ? (
          <ul
            id={listId}
            role="listbox"
            className="no-scrollbar absolute z-30 mt-2 max-h-60 w-full overflow-y-auto rounded-2xl border border-white/10 bg-[#111] p-1.5 shadow-2xl shadow-black/60"
          >
            {filtered.length === 0 ? (
              <li className="px-3 py-3 text-sm text-white/35">No matches for “{query}”</li>
            ) : (
              filtered.map((option, index) => (
                <li key={option}>
                  <button
                    id={`${id}-opt-${index}`}
                    ref={(element) => {
                      optionRefs.current[index] = element;
                    }}
                    type="button"
                    role="option"
                    aria-selected={option === value}
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => commit(option)}
                    className={[
                      'flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm transition-colors',
                      index === activeIndex ? 'bg-white/10 text-white' : 'text-white/70',
                    ].join(' ')}
                  >
                    <span>{option}</span>
                    {option === value ? (
                      <span className="text-vibe-300" aria-hidden="true">
                        ✓
                      </span>
                    ) : null}
                  </button>
                </li>
              ))
            )}
          </ul>
        ) : null}
      </div>

      <FieldError id={errorId} message={error} />
    </div>
  );
});

export default SearchSelect;
