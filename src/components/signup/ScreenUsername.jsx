import { useEffect, useRef, useState } from 'react';
import Spinner from '../common/Spinner.jsx';
import TextField from '../common/TextField.jsx';
import ScreenShell from './ScreenShell.jsx';
import useFieldErrors from '../../lib/useFieldErrors.js';
import { validateUsername } from '../../lib/validators.js';
import { checkUsername } from '../../mock/api.js';
import { SCREENS, STEP_INDEX, USERNAME_MAX } from '../../data/constants.js';

/**
 * The app collects a username with no availability check — a clash only
 * surfaces after the whole flow is submitted. Here it is checked as you type
 * (debounced), with the result shown in the field itself and taken suggestions
 * offered as one-tap replacements.
 */
export default function ScreenUsername({ state, dispatch }) {
  const [status, setStatus] = useState('idle'); // idle | checking | available | taken
  const [suggestions, setSuggestions] = useState([]);
  const requestId = useRef(0);

  const formatError = validateUsername(state.username);

  useEffect(() => {
    if (formatError) {
      setStatus('idle');
      setSuggestions([]);
      return undefined;
    }

    setStatus('checking');
    // Each request carries a ticket; only the newest one may write state, so a
    // slow earlier response cannot overwrite a newer result.
    const ticket = ++requestId.current;
    const timer = setTimeout(async () => {
      try {
        const { available, suggestions: alternatives } = await checkUsername(state.username);
        if (ticket !== requestId.current) return;
        setStatus(available ? 'available' : 'taken');
        setSuggestions(alternatives);
      } catch {
        if (ticket === requestId.current) setStatus('idle');
      }
    }, 450);

    return () => clearTimeout(timer);
  }, [state.username, formatError]);

  const errorMap = { username: formatError };
  const { touch, showError, validateAll, registerRef } = useFieldErrors(errorMap);

  /*
   * "Taken" is deliberately NOT gated behind the touched rule. That rule exists
   * to avoid nagging someone mid-word, but this result only arrives after they
   * have stopped typing, and the suggestions below make no sense without the
   * reason above them.
   */
  const takenError = status === 'taken' ? 'That username is taken.' : null;
  const shownError = showError('username') ?? takenError;

  const trailing =
    status === 'checking' ? (
      <Spinner className="text-white/40" label="Checking availability" />
    ) : status === 'available' ? (
      <span className="text-emerald-400" aria-hidden="true">
        <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
          <path d="M1 6l4.5 4.5L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    ) : null;

  return (
    <ScreenShell
      title="Create a username that fits your vibe!"
      step={STEP_INDEX[SCREENS.USERNAME]}
      // Block Next while a check is in flight, so nobody races past an unknown
      // result, and while the name is known to be taken.
      primaryDisabled={status === 'checking' || status === 'taken'}
      onSubmit={() => status !== 'taken' && validateAll() && dispatch({ type: 'NEXT' })}
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
        trailing={trailing}
        value={state.username}
        error={shownError}
        hint="All your Superlatives and Invites will come your way with this name, so make it unforgettable!"
        // Lower-cased and stripped as they type: the field cannot hold what the
        // rule forbids, so the error never fires for a stray space or capital.
        onChange={(event) =>
          dispatch({
            type: 'SET_FIELD',
            field: 'username',
            value: event.target.value.toLowerCase().replace(/[^a-z0-9._]/g, ''),
          })
        }
        onBlur={() => touch('username')}
      />

      {status === 'available' && !formatError ? (
        <p className="mt-3 text-sm text-emerald-400">@{state.username} is yours.</p>
      ) : null}

      {status === 'taken' && suggestions.length > 0 ? (
        <div className="mt-4">
          <p className="mb-2.5 text-sm text-white/45">Try one of these instead:</p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => dispatch({ type: 'SET_FIELD', field: 'username', value: option })}
                className="rounded-full border border-white/15 px-4 py-2 text-sm text-white/80 transition-colors hover:border-white/45 hover:text-white"
              >
                @{option}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </ScreenShell>
  );
}
