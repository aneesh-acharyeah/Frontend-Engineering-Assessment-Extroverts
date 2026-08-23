export default function Spinner({ className = '', label = 'Loading' }) {
  return (
    <span
      role="status"
      aria-label={label}
      className={`inline-block h-[1.15em] w-[1.15em] animate-spin rounded-full border-2 border-current border-t-transparent align-[-0.15em] ${className}`}
    />
  );
}
