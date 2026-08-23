import { SCREEN_ORDER, SCREENS } from '../data/constants.js';

export const STORAGE_KEY = 'extroverts.signup.v2';

/**
 * One reducer holds every screen's data.
 *
 * That is what makes Back lossless: navigating is an index move along
 * SCREEN_ORDER, and no screen component owns field state of its own, so
 * nothing is unmounted and lost.
 */
export const initialSignupState = {
  screen: SCREENS.EMAIL,

  email: '',
  consent: false,

  otp: '',
  otpAttempts: 0,
  otpVerified: false,

  username: '',
  name: '',
  dob: '', // ISO yyyy-mm-dd, assembled from the DD/MM/YYYY sheet
  pronouns: [],

  locationState: '',
  city: '',
  college: '',
  vibes: [],
  inviteCode: '',

  // Set when jumping back from the review summary, so the next Next returns
  // straight to it instead of walking forward through every screen again.
  returnTo: null,

  completed: false,
  handle: null,
};

const indexOf = (screen) => Math.max(0, SCREEN_ORDER.indexOf(screen));

export function signupReducer(state, action) {
  switch (action.type) {
    case 'SET_FIELD':
      return { ...state, [action.field]: action.value };

    // Cascade: changing a parent invalidates every child below it. Handled here
    // rather than at the call site so the rule cannot be forgotten.
    case 'SET_STATE_FIELD':
      if (action.value === state.locationState) return state;
      return { ...state, locationState: action.value, city: '', college: '' };

    case 'SET_CITY':
      if (action.value === state.city) return state;
      return { ...state, city: action.value, college: '' };

    case 'SET_VIBES':
      return { ...state, vibes: action.value };

    case 'SET_PRONOUNS':
      return { ...state, pronouns: action.value };

    case 'OTP_FAILED':
      return { ...state, otp: '', otpAttempts: state.otpAttempts + 1 };

    case 'OTP_VERIFIED':
      return { ...state, otpVerified: true };

    // Resending invalidates whatever the user already typed, and resets attempts.
    case 'OTP_RESENT':
      return { ...state, otp: '', otpAttempts: 0 };

    case 'NEXT': {
      // A pending return target wins once, then clears.
      if (state.returnTo) return { ...state, screen: state.returnTo, returnTo: null };
      const next = SCREEN_ORDER[Math.min(SCREEN_ORDER.length - 1, indexOf(state.screen) + 1)];
      return { ...state, screen: next };
    }

    case 'BACK': {
      // Going back by hand abandons the return jump; they are navigating freely now.
      const previous = SCREEN_ORDER[Math.max(0, indexOf(state.screen) - 1)];
      return { ...state, screen: previous, returnTo: null };
    }

    case 'GOTO':
      return { ...state, screen: action.value, returnTo: action.returnTo ?? null };

    // Going back to change the email voids the code that was already sent.
    case 'CHANGE_EMAIL':
      return { ...state, screen: SCREENS.EMAIL, otp: '', otpAttempts: 0, otpVerified: false };

    case 'COMPLETE':
      return { ...state, completed: true, handle: action.handle, screen: SCREENS.DONE };

    case 'RESET':
      return { ...initialSignupState };

    default:
      return state;
  }
}
