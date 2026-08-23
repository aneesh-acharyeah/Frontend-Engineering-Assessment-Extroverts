import { OTP_LENGTH } from '../data/constants.js';

/**
 * Simulated backend. This is a front-end-only exercise, so every call resolves
 * locally after a realistic delay.
 *
 * Failures are DETERMINISTIC, not random, so each error path can be demonstrated
 * on cue during the screen recording instead of waiting for a dice roll.
 *
 *   taken@extroverts.app  -> step 1, "already registered" (field-level)
 *   fail@extroverts.app   -> step 1, network error        (global toast)
 *   OTP 123456            -> the only accepted code
 *   name contains "errortest" -> step 4, server 500       (global toast + retry)
 */

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** Error carrying a `field` hint so the caller knows whether to render inline or as a toast. */
export class ApiError extends Error {
  constructor(message, { field = null, retryable = false } = {}) {
    super(message);
    this.name = 'ApiError';
    this.field = field;
    this.retryable = retryable;
  }
}

export const DEMO = {
  takenEmail: 'taken@extroverts.app',
  networkEmail: 'fail@extroverts.app',
  validOtp: '123456',
  serverErrorName: 'errortest',
  takenUsernames: ['party', 'extrovert', 'admin', 'himanshu', 'vaibhav', 'anish'],
};

/**
 * Username availability.
 *
 * The app has no availability check at all — you only discover a clash after
 * submitting everything. Checking here, debounced while typing, means the
 * problem surfaces at the field that caused it.
 */
export async function checkUsername(username) {
  await delay(700);
  const normalised = username.trim().toLowerCase();
  const taken = DEMO.takenUsernames.includes(normalised);
  return {
    available: !taken,
    // Something to click rather than a dead end.
    suggestions: taken
      ? [`${normalised}_`, `${normalised}${new Date().getFullYear() % 100}`, `the${normalised}`]
      : [],
  };
}

export async function requestOtp(email) {
  await delay(1200);
  const normalised = email.trim().toLowerCase();

  if (normalised === DEMO.networkEmail) {
    throw new ApiError("Couldn't reach Extroverts. Check your connection and try again.", {
      retryable: true,
    });
  }
  if (normalised === DEMO.takenEmail) {
    throw new ApiError('An account already exists with this email. Try logging in instead.', {
      field: 'email',
    });
  }

  return { sent: true, email: normalised, length: OTP_LENGTH };
}

export async function verifyOtp(code) {
  await delay(1000);
  if (code !== DEMO.validOtp) {
    throw new ApiError('That code is not right.', { field: 'otp' });
  }
  return { verified: true };
}

export async function submitProfile(profile) {
  await delay(1500);
  if ((profile.name ?? '').toLowerCase().includes(DEMO.serverErrorName)) {
    throw new ApiError('Something went wrong on our end. Your details are safe — try again.', {
      retryable: true,
    });
  }
  return {
    ok: true,
    handle: `@${(profile.name ?? 'extrovert')
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '')
      .slice(0, 14) || 'extrovert'}`,
  };
}
