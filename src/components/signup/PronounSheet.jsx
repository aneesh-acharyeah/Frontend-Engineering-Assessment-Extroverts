import { useEffect, useState } from 'react';
import BottomSheet from '../common/BottomSheet.jsx';
import Button from '../common/Button.jsx';
import { MAX_PRONOUNS, PRONOUNS } from '../../data/constants.js';

/**
 * The app's SELECT PRONOUNS sheet: a checkbox list capped at three.
 *
 * The app silently ignores taps past the cap; here the remaining options are
 * disabled and the count is shown, so the limit is visible before it is hit.
 */
export default function PronounSheet({ open, onClose, initial, onConfirm }) {
  const [selected, setSelected] = useState(initial);

  useEffect(() => {
    if (open) setSelected(initial);
  }, [open, initial]);

  const atLimit = selected.length >= MAX_PRONOUNS;

  const toggle = (pronoun) => {
    setSelected((current) => {
      if (current.includes(pronoun)) return current.filter((item) => item !== pronoun);
      if (current.length >= MAX_PRONOUNS) return current;
      return [...current, pronoun];
    });
  };

  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      title="Select Pronouns"
      subtitle={`Select up to ${MAX_PRONOUNS} · ${selected.length} chosen`}
    >
      <div className="pb-4">
        <ul className="space-y-1">
          {PRONOUNS.map((pronoun) => {
            const checked = selected.includes(pronoun);
            const blocked = atLimit && !checked;
            return (
              <li key={pronoun}>
                <label
                  className={`flex items-center gap-4 rounded-2xl px-2 py-3 transition-colors ${
                    blocked ? 'cursor-not-allowed opacity-35' : 'cursor-pointer hover:bg-white/[0.04]'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    disabled={blocked}
                    onChange={() => toggle(pronoun)}
                    className="sr-only"
                  />
                  <span
                    aria-hidden="true"
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border transition-colors ${
                      checked ? 'border-white bg-white' : 'border-white/35'
                    }`}
                  >
                    {checked ? (
                      <svg width="14" height="11" viewBox="0 0 14 11" fill="none">
                        <path
                          d="M1 5.5L5 9.5L13 1.5"
                          stroke="black"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    ) : null}
                  </span>
                  <span className="text-lg text-white">{pronoun}</span>
                </label>
              </li>
            );
          })}
        </ul>

        <div className="sticky bottom-0 -mx-6 mt-4 bg-[#151515] px-6 pb-2 pt-3">
          <Button onClick={() => onConfirm(selected)} disabled={selected.length === 0}>
            Proceed
          </Button>
          <p className="mt-3 text-sm text-white/40">Did we miss anything?</p>
        </div>
      </div>
    </BottomSheet>
  );
}
