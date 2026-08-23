/** Verbatim from the app's "Set the theme for your party" screen. */
export const PARTY_VIBES = [
  { id: 'tea-party', label: 'Tea Party', emoji: '🍵' },
  { id: 'dinner-event', label: 'Dinner Event', emoji: '🍽️' },
  { id: 'music-jam', label: 'Music Jam', emoji: '🎸' },
  { id: 'book-club', label: 'Book Club', emoji: '📚' },
  { id: 'brunch-outing', label: 'Brunch Outing', emoji: '🥐' },
  { id: 'networking', label: 'Networking', emoji: '🤝' },
  { id: 'movie-squad', label: 'Movie Squad', emoji: '🎬' },
  { id: 'workout-session', label: 'Workout Session', emoji: '💪' },
  { id: 'sports-fc', label: 'Sports FC', emoji: '⚽' },
  { id: 'game-night', label: 'Game Night', emoji: '🎮' },
  { id: 'karaoke-night', label: 'Karaoke Night', emoji: '🎤' },
  { id: 'picnic-day', label: 'Picnic Day', emoji: '🧺' },
  { id: 'board-games', label: 'Board Games', emoji: '🎲' },
];

export const MIN_VIBES = 3;

/** The app's "SELECT PRONOUNS" sheet list, in its original order. */
export const PRONOUNS = [
  'he',
  'him',
  'his',
  'she',
  'her',
  'hers',
  'they',
  'them',
  'theirs',
  'ze',
  'zir',
  'zirs',
  've',
  'ver',
  'vis',
];

export const MAX_PRONOUNS = 3;

/** Their own Terms require 18+; the app collects age but never enforces it. */
export const MIN_AGE = 18;
export const MAX_AGE = 100;

export const USERNAME_MIN = 3;
export const USERNAME_MAX = 20;
export const NAME_MIN = 2;
export const NAME_MAX = 50;

export const OTP_LENGTH = 6;
export const OTP_MAX_ATTEMPTS = 3;
export const OTP_RESEND_SECONDS = 30;

/**
 * The four profile steps, matching the app's screens one-for-one. Email and OTP
 * come before them; the finish screen comes after.
 */
export const TOTAL_STEPS = 4;
export const STEP_LABELS = ['Username', 'Name', 'Age', 'Pronouns'];

/** Screen ids for the wizard machine. */
export const SCREENS = {
  EMAIL: 'email',
  OTP: 'otp',
  USERNAME: 'username',
  NAME: 'name',
  AGE: 'age',
  PRONOUNS: 'pronouns',
  FINISH: 'finish',
  DONE: 'done',
};

/** Ordered walk of the flow; Back is just the previous entry. */
export const SCREEN_ORDER = [
  SCREENS.EMAIL,
  SCREENS.OTP,
  SCREENS.USERNAME,
  SCREENS.NAME,
  SCREENS.AGE,
  SCREENS.PRONOUNS,
  SCREENS.FINISH,
];

/** Which of the four numbered steps a screen represents, if any. */
export const STEP_INDEX = {
  [SCREENS.USERNAME]: 1,
  [SCREENS.NAME]: 2,
  [SCREENS.AGE]: 3,
  [SCREENS.PRONOUNS]: 4,
};
