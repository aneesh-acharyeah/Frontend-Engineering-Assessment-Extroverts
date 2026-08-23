import { useState } from 'react';
import ChipGroup from '../common/ChipGroup.jsx';
import SearchSelect from '../common/SearchSelect.jsx';
import TextField from '../common/TextField.jsx';
import ReviewSummary from './ReviewSummary.jsx';
import ScreenShell from './ScreenShell.jsx';
import { useToast } from '../common/Toast.jsx';
import useFieldErrors from '../../lib/useFieldErrors.js';
import {
  validateCity,
  validateCollege,
  validateInviteCode,
  validateState,
  validateVibes,
} from '../../lib/validators.js';
import { getCities, getColleges, STATES } from '../../data/locations.js';
import { MIN_VIBES, PARTY_VIBES } from '../../data/constants.js';
import { DEMO, submitProfile } from '../../mock/api.js';

/** The app's house rules, with the emphasised words picked out in violet. */
const MANIFESTO = [
  [['KINDNESS = GOOD ', false], ['HAIR', true], [' DAY', false]],
  [['SIP IN? ', false], ['CHIP', true], [' IN.', false]],
  [['GHOSTING IS FOR ', false], ['HALLOWEEN', true], ['.', false]],
  [['OUTFITS LOUD, ', false], ['INTENTIONS', true], [' CLEAR.', false]],
  [['JOINING? FREE. HOSTING? ', false], ['ALSO', true], [' FREE.', false]],
  [['EARLLY IS ', false], ['ICONIC', true], ['.', false]],
  [['YES. ', false], ['SPELLING', true], [' MISTAKE.', false]],
];

export default function ScreenFinish({ state, dispatch }) {
  const toast = useToast();
  const [busy, setBusy] = useState(false);

  // Derived, never stored: the option lists follow whatever the parent holds,
  // so they cannot drift out of sync with the current selection.
  const cities = getCities(state.locationState);
  const colleges = getColleges(state.locationState, state.city);

  const errorMap = {
    locationState: validateState(state.locationState),
    city: validateCity(state.city),
    college: validateCollege(state.college),
    vibes: validateVibes(state.vibes),
    inviteCode: validateInviteCode(state.inviteCode),
  };
  const { touch, showError, validateAll, registerRef } = useFieldErrors(errorMap);

  const handleSubmit = async () => {
    if (busy || !validateAll()) return;
    setBusy(true);
    try {
      const { handle } = await submitProfile({
        name: state.name,
        username: state.username,
        email: state.email,
        dob: state.dob,
        pronouns: state.pronouns,
        state: state.locationState,
        city: state.city,
        college: state.college,
        vibes: state.vibes,
        inviteCode: state.inviteCode,
      });
      dispatch({ type: 'COMPLETE', handle });
    } catch (error) {
      // A server failure with nothing to fix inline: global alert, form intact,
      // so retrying is a single click.
      toast.error(error.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <ScreenShell
      title="House rules, quickly"
      onSubmit={handleSubmit}
      primaryLabel="Sign Up"
      loading={busy}
      onBack={() => dispatch({ type: 'BACK' })}
    >
      <div className="space-y-8">
        <div className="space-y-1 text-[15px] font-bold uppercase leading-[1.45] tracking-[0.01em] text-white/45 sm:text-base">
          {MANIFESTO.map((line, lineIndex) => (
            // eslint-disable-next-line react/no-array-index-key
            <p key={lineIndex}>
              {line.map(([text, highlighted], partIndex) => (
                <span
                  // eslint-disable-next-line react/no-array-index-key
                  key={partIndex}
                  className={highlighted ? 'text-vibe-500' : undefined}
                >
                  {text}
                </span>
              ))}
            </p>
          ))}
        </div>

        <ReviewSummary state={state} dispatch={dispatch} />

        <div className="space-y-6 border-t border-white/10 pt-8">
          <p className="text-[15px] leading-relaxed text-white/55">
            Last thing — where do you party? We only use this to surface events near you.
          </p>

          <SearchSelect
            ref={registerRef('locationState')}
            label="State"
            options={STATES}
            value={state.locationState}
            error={showError('locationState')}
            placeholder="Search states…"
            onChange={(value) => {
              // The reducer clears city + college, keeping the cascade honest.
              dispatch({ type: 'SET_STATE_FIELD', value });
              touch('locationState');
            }}
            onBlur={() => touch('locationState')}
          />

          <SearchSelect
            label="City"
            options={cities}
            value={state.city}
            error={showError('city')}
            disabled={!state.locationState}
            disabledHint="Pick a state first"
            placeholder="Search cities…"
            onChange={(value) => {
              dispatch({ type: 'SET_CITY', value });
              touch('city');
            }}
            onBlur={() => touch('city')}
          />

          <SearchSelect
            label="College"
            options={colleges}
            value={state.college}
            error={showError('college')}
            disabled={!state.city}
            disabledHint="Pick a city first"
            placeholder="Search colleges…"
            onChange={(value) => {
              dispatch({ type: 'SET_FIELD', field: 'college', value });
              touch('college');
            }}
            onBlur={() => touch('college')}
          />

          <ChipGroup
            label={`Your vibe — pick at least ${MIN_VIBES}`}
            options={PARTY_VIBES}
            value={state.vibes}
            multiple
            error={showError('vibes')}
            hint={`${state.vibes.length} selected`}
            onChange={(value) => {
              dispatch({ type: 'SET_VIBES', value });
              touch('vibes');
            }}
          />

          <TextField
            ref={registerRef('inviteCode')}
            label="Enter invite code (optional)"
            autoCapitalize="characters"
            spellCheck={false}
            placeholder="PARTY26"
            maxLength={10}
            value={state.inviteCode}
            error={showError('inviteCode')}
            hint="Enter an invite code and get up to +30 HVTs!"
            onChange={(event) =>
              dispatch({
                type: 'SET_FIELD',
                field: 'inviteCode',
                value: event.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''),
              })
            }
            onBlur={() => touch('inviteCode')}
          />
        </div>

        <p className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-xs leading-relaxed text-white/35">
          <span className="font-medium text-white/60">Demo:</span> set your name to include{' '}
          <span className="text-vibe-300">{DEMO.serverErrorName}</span> to see the server-error path.
        </p>
      </div>
    </ScreenShell>
  );
}
