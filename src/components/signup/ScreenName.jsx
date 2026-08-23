import TextField from '../common/TextField.jsx';
import ScreenShell from './ScreenShell.jsx';
import useFieldErrors from '../../lib/useFieldErrors.js';
import { collapseSpaces, validateName } from '../../lib/validators.js';
import { NAME_MAX, SCREENS, STEP_INDEX } from '../../data/constants.js';

export default function ScreenName({ state, dispatch }) {
  const errorMap = { name: validateName(state.name) };
  const { touch, showError, validateAll, registerRef } = useFieldErrors(errorMap);

  const handleSubmit = () => {
    if (!validateAll()) return;
    // Normalise before it leaves the screen, so nothing downstream sees " John  Doe ".
    dispatch({ type: 'SET_FIELD', field: 'name', value: collapseSpaces(state.name).trim() });
    dispatch({ type: 'NEXT' });
  };

  return (
    <ScreenShell
      title={'"Name, please, for the party check!"'}
      step={STEP_INDEX[SCREENS.NAME]}
      onSubmit={handleSubmit}
      onBack={() => dispatch({ type: 'BACK' })}
    >
      <TextField
        ref={registerRef('name')}
        label="Name"
        autoComplete="name"
        enterKeyHint="next"
        placeholder="Vaibhav Mishra"
        maxLength={NAME_MAX}
        showCounter
        value={state.name}
        error={showError('name')}
        hint="This is the name shown on members and requests. Cannot be changed later."
        // Leading space and double spaces are blocked as they type; a single
        // trailing space survives so "John " can still become "John Doe".
        onChange={(event) =>
          dispatch({
            type: 'SET_FIELD',
            field: 'name',
            value: event.target.value.replace(/^\s+/, '').replace(/\s{2,}/g, ' '),
          })
        }
        onBlur={() => touch('name')}
      />
    </ScreenShell>
  );
}
