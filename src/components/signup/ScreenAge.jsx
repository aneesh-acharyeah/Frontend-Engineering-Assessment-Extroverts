import { useState } from 'react';
import TextField from '../common/TextField.jsx';
import ScreenShell from './ScreenShell.jsx';
import DobSheet from './DobSheet.jsx';
import useFieldErrors from '../../lib/useFieldErrors.js';
import { ageFrom, fromIsoDate, validateDob } from '../../lib/validators.js';
import { MIN_AGE, SCREENS, STEP_INDEX } from '../../data/constants.js';

export default function ScreenAge({ state, dispatch }) {
  const [sheetOpen, setSheetOpen] = useState(false);

  const errorMap = { dob: validateDob(state.dob) };
  const { touch, showError, validateAll, registerRef } = useFieldErrors(errorMap);

  const age = ageFrom(state.dob);
  const displayed = age !== null ? `${age}` : '';

  return (
    <ScreenShell
      title="How many years have you been partying?"
      step={STEP_INDEX[SCREENS.AGE]}
      onSubmit={() => validateAll() && dispatch({ type: 'NEXT' })}
      onBack={() => dispatch({ type: 'BACK' })}
    >
      <TextField
        ref={registerRef('dob')}
        label="Age"
        readOnlyDisplay
        placeholder="Tap to set your date of birth"
        value={displayed}
        error={showError('dob')}
        hint="We need your age to verify you're eligible and help others know who they're connecting with."
        trailing={
          <span aria-hidden="true" className="text-white/35">
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
              <rect x="2.5" y="3.75" width="15" height="13.75" rx="2.5" stroke="currentColor" strokeWidth="1.4" />
              <path d="M2.5 8h15M6.75 2.5v2.5M13.25 2.5v2.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
          </span>
        }
        onClick={() => setSheetOpen(true)}
      />

      {/* The improvement the brief names: the app collects age and never checks it. */}
      {age !== null && age < MIN_AGE ? (
        <div className="mt-4 flex items-start gap-3 rounded-2xl border border-danger/30 bg-danger/[0.07] px-4 py-3.5">
          <span aria-hidden="true" className="mt-0.5 text-base leading-none">
            ⛔
          </span>
          <p className="text-[13px] leading-relaxed text-white/70">
            Extroverts runs real-world nightlife events, so our Terms require every member to be{' '}
            <span className="font-medium text-white">{MIN_AGE} or older</span>. Come back and find us in{' '}
            {MIN_AGE - age} {MIN_AGE - age === 1 ? 'year' : 'years'}.
          </p>
        </div>
      ) : null}

      <DobSheet
        open={sheetOpen}
        onClose={() => {
          // Touch on dismiss, not on open: opening the sheet is not yet an
          // attempt, so the field should not turn red before they can type.
          setSheetOpen(false);
          touch('dob');
        }}
        initial={fromIsoDate(state.dob)}
        onConfirm={(iso) => {
          dispatch({ type: 'SET_FIELD', field: 'dob', value: iso });
          setSheetOpen(false);
          touch('dob');
        }}
      />
    </ScreenShell>
  );
}
