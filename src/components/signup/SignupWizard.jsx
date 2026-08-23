import { AnimatePresence, motion } from 'framer-motion';
import ScreenEmail from './ScreenEmail.jsx';
import ScreenOtp from './ScreenOtp.jsx';
import ScreenUsername from './ScreenUsername.jsx';
import ScreenName from './ScreenName.jsx';
import ScreenAge from './ScreenAge.jsx';
import ScreenPronouns from './ScreenPronouns.jsx';
import ScreenFinish from './ScreenFinish.jsx';
import SuccessScreen from './SuccessScreen.jsx';
import usePersistedReducer, { clearPersisted } from '../../lib/usePersistedReducer.js';
import useReducedMotion from '../../lib/useReducedMotion.js';
import { initialSignupState, signupReducer, STORAGE_KEY } from '../../state/signupReducer.js';
import { SCREENS } from '../../data/constants.js';

const SCREEN_COMPONENTS = {
  [SCREENS.EMAIL]: ScreenEmail,
  [SCREENS.OTP]: ScreenOtp,
  [SCREENS.USERNAME]: ScreenUsername,
  [SCREENS.NAME]: ScreenName,
  [SCREENS.AGE]: ScreenAge,
  [SCREENS.PRONOUNS]: ScreenPronouns,
  [SCREENS.FINISH]: ScreenFinish,
};

export default function SignupWizard() {
  const [state, dispatch] = usePersistedReducer(signupReducer, initialSignupState, STORAGE_KEY);
  const reduced = useReducedMotion();

  const handleRestart = () => {
    clearPersisted(STORAGE_KEY);
    dispatch({ type: 'RESET' });
  };

  if (state.completed) {
    return <SuccessScreen state={state} onRestart={handleRestart} />;
  }

  const ScreenComponent = SCREEN_COMPONENTS[state.screen] ?? ScreenEmail;

  // Forward and back both cross-fade with a small vertical offset, which reads
  // as "same form, new content" rather than implying separate pages.
  const transition = reduced ? { duration: 0 } : { duration: 0.26, ease: [0.22, 1, 0.36, 1] };

  return (
    <div className="flex flex-1 flex-col">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={state.screen}
          initial={{ opacity: 0, y: reduced ? 0 : 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: reduced ? 0 : -8 }}
          transition={transition}
          className="flex flex-1 flex-col"
        >
          <ScreenComponent state={state} dispatch={dispatch} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
