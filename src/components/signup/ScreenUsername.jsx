import TextField from '../common/TextField.jsx';
import ScreenShell from './ScreenShell.jsx';
import useFieldErrors from '../../lib/useFieldErrors.js';
import { validateUsername } from '../../lib/validators.js';
import { STEP_INDEX, SCREENS, USERNAME_MAX } from '../../data/constants.js';

export default function ScreenUsername({ state, dispatch }) {
  const errorMap = { username: validateUsername(state.username) };
  const { touch, showError, validateAll, registerRef } = useFieldErrors(errorMap);

  return (
    <ScreenShell
      title="Create a username that fits your vibe!"
      step={STEP_INDEX[SCREENS.USERNAME]}
      onSubmit={() => validateAll() && dispatch({ type: 'NEXT' })}
      onBack={() => dispatch({ type: 'BACK' })}
    >
      <TextField
        ref={registerRef('username')}
        label="Username"
        autoComplete="username"
        autoCapitalize="none"
        spellCheck={false}
        enterKeyHint="next"
        placeholder="partyanimal"
        maxLength={USERNAME_MAX}
        showCounter
        leading={<span className="text-white/35">@</span>}
        value={state.username}
        error={showError('username')}
        hint="All your Superlatives and Invites will come your way with this name, so make it unforgettable!"
        // Lower-cased and stripped as they type: a username cannot contain what
        // the rule forbids, so the error never has to fire for a stray space.
        onChange={(event) =>
          dispatch({
            type: 'SET_FIELD',
            field: 'username',
            value: event.target.value.toLowerCase().replace(/[^a-z0-9._]/g, ''),
          })
        }
        onBlur={() => touch('username')}
      />
    </ScreenShell>
  );
}
