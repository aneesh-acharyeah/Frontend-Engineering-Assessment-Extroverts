import { useEffect, useState } from 'react';
import BottomSheet from '../common/BottomSheet.jsx';
import Button from '../common/Button.jsx';
import { CUSTOM_PRONOUN_MAX, MAX_PRONOUNS, PRONOUNS, PRONOUN_SETS } from '../../data/constants.js';

/**
 * The app's SELECT PRONOUNS sheet, with three fixes:
 *
 *  - quick-picks for the common sets, which the app makes you assemble one word
 *    at a time (and lets you mix inconsistently)
 *  - the cap is visible: remaining options disable and the count is shown,
 *    rather than taps being silently swallowed
 *  - "Did we miss anything?" actually does something. In the app it is dead
 *    text under the button; here it opens a field to add your own.
 */
export default function PronounSheet({ open, onClose, initial, onConfirm }) {
  const [selected, setSelected] = useState(initial);
  const [customOpen, setCustomOpen] = useState(false);
  const [custom, setCustom] = useState('');

  useEffect(() => {
    if (open) {
      setSelected(initial);
      setCustomOpen(false);
      setCustom('');
    }
  }, [open, initial]);

  const atLimit = selected.length >= MAX_PRONOUNS;

  const toggle = (pronoun) => {
    setSelected((current) => {
      if (current.includes(pronoun)) return current.filter((item) => item !== pronoun);
      if (current.length >= MAX_PRONOUNS) return current;
      return [...current, pronoun];
    });
  };

  const applySet = (values) => {
    // Replaces rather than appends, so a set is always internally consistent.
    setSelected((current) =>
      values.every((value) => current.includes(value)) ? [] : values.slice(0, MAX_PRONOUNS)
    );
  };

  const addCustom = () => {
    const value = custom.trim().toLowerCase();
    if (!value || selected.includes(value) || atLimit) return;
    setSelected((current) => [...current, value]);
    setCustom('');
    setCustomOpen(false);
  };

  // Anything the user added themselves, so it renders alongside the fixed list.
  const extras = selected.filter((item) => !PRONOUNS.includes(item));

  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      title="Select Pronouns"
      subtitle={`Select up to ${MAX_PRONOUNS} · ${selected.length} chosen`}
    >
      <div className="pb-4 pt-1">
        <div className="mb-5 flex flex-wrap gap-2">
          {PRONOUN_SETS.map((set) => {
            const active = set.values.every((value) => selected.includes(value));
            return (
              <button
                key={set.id}
                type="button"
                onClick={() => applySet(set.values)}
                aria-pressed={active}
                className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                  active
                    ? 'border-white bg-white text-black'
                    : 'border-white/15 text-white/70 hover:border-white/40 hover:text-white'
                }`}
              >
                {set.label}
              </button>
            );
          })}
        </div>

        <ul className="space-y-1">
          {[...PRONOUNS, ...extras].map((pronoun) => {
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

          {customOpen ? (
            <div className="mt-4 flex gap-2">
              <input
                autoFocus
                value={custom}
                maxLength={CUSTOM_PRONOUN_MAX}
                placeholder="e.g. xe"
                aria-label="Add your own pronoun"
                onChange={(event) => setCustom(event.target.value.replace(/[^a-zA-Z]/g, ''))}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault();
                    addCustom();
                  }
                }}
                className="field-surface-raised min-h-[48px] flex-1 rounded-xl border border-white/45 bg-white/[0.07] px-4 text-base text-white placeholder:text-white/35 focus:border-white/70"
              />
              <Button size="sm" fullWidth={false} onClick={addCustom} disabled={!custom.trim() || atLimit}>
                Add
              </Button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setCustomOpen(true)}
              className="mt-3 text-sm text-white/40 underline decoration-white/25 underline-offset-4 transition-colors hover:text-white/80"
            >
              Did we miss anything?
            </button>
          )}
        </div>
      </div>
    </BottomSheet>
  );
}
