/**
 * The one place a field-level message is rendered, so spacing, colour and the
 * aria wiring stay identical across every input type in the wizard.
 */
export default function FieldError({ id, message }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-2 flex items-start gap-1.5 text-xs leading-snug text-danger">
      <svg
        width="13"
        height="13"
        viewBox="0 0 14 14"
        fill="none"
        aria-hidden="true"
        className="mt-px shrink-0"
      >
        <circle cx="7" cy="7" r="6.25" stroke="currentColor" strokeWidth="1.2" />
        <path d="M7 4v3.4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        <circle cx="7" cy="9.9" r="0.8" fill="currentColor" />
      </svg>
      <span>{message}</span>
    </p>
  );
}
