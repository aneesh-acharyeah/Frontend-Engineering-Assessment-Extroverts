import { useState } from 'react';
import TextField from '../common/TextField.jsx';
import ScreenShell from './ScreenShell.jsx';
import PronounSheet from './PronounSheet.jsx';
import useFieldErrors from '../../lib/useFieldErrors.js';
import { validatePronouns } from '../../lib/validators.js';
import { SCREENS, STEP_INDEX } from '../../data/constants.js';

export default function ScreenPronouns({ state, dispatch }) {
  const [sheetOpen, setSheetOpen] = useState(false);

  const errorMap = { pronouns: validatePronouns(state.pronouns) };
  const { touch, showError, validateAll, registerRef } = useFieldErrors(errorMap);

  return (
    <ScreenShell
      title="Which pronouns feel right for you?"
      step={STEP_INDEX[SCREENS.PRONOUNS]}
      onSubmit={() => validateAll() && dispatch({ type: 'NEXT' })}
      onBack={() => dispatch({ type: 'BACK' })}
    >
      <TextField
        ref={registerRef('pronouns')}
        label="Pronouns"
        readOnlyDisplay
        placeholder="Tap to choose"
        value={state.pronouns.join(' / ')}
        error={showError('pronouns')}
        hint="Select the pronouns that feel right for you."
        trailing={
          <span aria-hidden="true" className="text-white/35">
            <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
              <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </span>
        }
        onClick={() => setSheetOpen(true)}
      />

      <PronounSheet
        open={sheetOpen}
        onClose={() => {
          setSheetOpen(false);
          touch('pronouns');
        }}
        initial={state.pronouns}
        onConfirm={(value) => {
          dispatch({ type: 'SET_PRONOUNS', value });
          setSheetOpen(false);
          touch('pronouns');
        }}
      />
    </ScreenShell>
  );
}
