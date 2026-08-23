import { useEffect, useRef } from 'react';
import Button from '../common/Button.jsx';
import Logo from '../common/Logo.jsx';
import StepProgress from '../common/StepProgress.jsx';

/**
 * The frame every wizard screen shares, taken from the app: logo top-left,
 * phase label top-right, a bold two-line question, the field, then the actions
 * pinned to the bottom edge.
 *
 * On mount it moves focus to the heading, so keyboard and screen-reader users
 * land at the top of the new screen rather than wherever the last button was.
 */
export default function ScreenShell({
  title,
  phase = 'Getting Ready',
  step = null,
  children,
  onSubmit,
  primaryLabel = 'Next',
  secondaryLabel = 'Back',
  onBack,
  loading = false,
  primaryDisabled = false,
  footer,
}) {
  const headingRef = useRef(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, [title]);

  return (
    <form
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit?.(event);
      }}
      className="flex min-h-[inherit] flex-1 flex-col"
    >
      <header className="mb-10 flex items-start justify-between gap-4">
        <Logo size="lg" />
        <p className="pt-3 text-lg font-bold uppercase tracking-[0.01em] text-white sm:text-xl">
          {phase}
        </p>
      </header>

      {/* Progress is an addition — the app gives no sense of how much is left. */}
      {step ? (
        <div className="mb-9">
          <StepProgress current={step} />
        </div>
      ) : null}

      <h1
        ref={headingRef}
        tabIndex={-1}
        className="text-[28px] font-bold leading-[1.2] tracking-[-0.01em] text-white outline-none sm:text-[32px]"
      >
        {title}
      </h1>

      <div className="mt-7 flex-1">{children}</div>

      <div className="mt-10 space-y-3 pb-2">
        <Button type="submit" loading={loading} disabled={primaryDisabled}>
          {primaryLabel}
        </Button>
        {onBack ? (
          <Button variant="secondary" onClick={onBack} disabled={loading}>
            {secondaryLabel}
          </Button>
        ) : null}
        {footer}
      </div>
    </form>
  );
}
