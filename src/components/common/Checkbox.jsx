import { forwardRef, useId } from 'react';
import FieldError from './FieldError.jsx';

const Checkbox = forwardRef(function Checkbox(
  { checked, onChange, error, children, id: providedId, ...props },
  ref
) {
  const generatedId = useId();
  const id = providedId ?? generatedId;
  const errorId = `${id}-error`;

  return (
    <div>
      <div className="flex items-start gap-3">
        <input
          ref={ref}
          type="checkbox"
          id={id}
          checked={checked}
          onChange={onChange}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={`mt-0.5 h-[18px] w-[18px] shrink-0 cursor-pointer rounded border bg-white/5 accent-vibe-500 ${
            error ? 'border-danger' : 'border-white/25'
          }`}
          {...props}
        />
        <label htmlFor={id} className="cursor-pointer text-sm leading-relaxed text-white/60">
          {children}
        </label>
      </div>
      <FieldError id={errorId} message={error} />
    </div>
  );
});

export default Checkbox;
