import { STEP_LABELS, TOTAL_STEPS } from '../../data/constants.js';

/** Four segments plus a "Step X of 4" readout, so progress is never a guess. */
export default function StepProgress({ current }) {
  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <p className="eyebrow">
          Step {current} of {TOTAL_STEPS}
        </p>
        <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-white/70 sm:text-xs">
          {STEP_LABELS[current - 1]}
        </p>
      </div>

      <div
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={TOTAL_STEPS}
        aria-valuenow={current}
        aria-label={`Signup progress: step ${current} of ${TOTAL_STEPS}`}
        className="flex gap-1.5"
      >
        {Array.from({ length: TOTAL_STEPS }, (_, index) => (
          <span
            // eslint-disable-next-line react/no-array-index-key
            key={index}
            className="h-1 flex-1 overflow-hidden rounded-full bg-white/10"
          >
            <span
              className={`block h-full rounded-full bg-gradient-to-r from-vibe-500 via-pink-500 to-amber-400 transition-transform duration-500 ease-out ${
                index < current ? 'scale-x-100' : 'scale-x-0'
              }`}
              style={{ transformOrigin: 'left' }}
            />
          </span>
        ))}
      </div>
    </div>
  );
}
