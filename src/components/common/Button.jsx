import Spinner from './Spinner.jsx';

/**
 * Button styles taken from the app screenshots.
 *
 * Note the corner radius: the app uses generously rounded *rectangles*
 * (~14px on a 60px-tall button), not fully round pills. Primary is a solid
 * white block with black uppercase text; secondary is the same shape outlined
 * in white. They stack full-width at the bottom of every wizard screen.
 */
const VARIANTS = {
  primary: 'bg-white text-black hover:bg-white/90 disabled:text-black/25 disabled:opacity-100',
  secondary: 'border border-white/80 bg-transparent text-white hover:bg-white/10',
  ghost: 'bg-transparent text-white/50 hover:text-white',
  vibe: 'bg-vibe-500 text-white hover:bg-vibe-600 shadow-glow',
};

const SIZES = {
  sm: 'min-h-[44px] rounded-xl px-5 text-xs',
  md: 'min-h-[52px] rounded-2xl px-6 text-sm',
  lg: 'min-h-[60px] rounded-2xl px-7 text-[15px]',
};

/**
 * `loading` is the single duplicate-submit guard for the whole app: it disables
 * the button, swaps the label for a spinner and flags `aria-busy`, so a double
 * click during an in-flight request cannot fire a second request.
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'lg',
  loading = false,
  disabled = false,
  fullWidth = true,
  className = '',
  type = 'button',
  ...props
}) {
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      className={[
        'relative inline-flex items-center justify-center gap-2.5',
        'font-semibold uppercase tracking-[0.06em] transition-all duration-200',
        'active:scale-[0.995] disabled:cursor-not-allowed disabled:active:scale-100',
        variant !== 'primary' ? 'disabled:opacity-35' : '',
        VARIANTS[variant],
        SIZES[size],
        fullWidth ? 'w-full' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {loading ? (
        <>
          <Spinner />
          <span>{typeof children === 'string' ? children : 'Please wait'}</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}
