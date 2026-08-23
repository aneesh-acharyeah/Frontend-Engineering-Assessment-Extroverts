import {
  MAX_AGE,
  MAX_PRONOUNS,
  MIN_AGE,
  MIN_VIBES,
  NAME_MAX,
  NAME_MIN,
  USERNAME_MAX,
  USERNAME_MIN,
} from '../data/constants.js';

/**
 * Every validator is a pure (value, ...deps) -> string | null function.
 * `null` means valid; a string is the message rendered beneath the field.
 * Keeping them pure means the wizard can validate a whole step in one pass
 * (on Next) using the exact same code path as the per-field blur handler.
 */

// Deliberately pragmatic rather than RFC 5322: one @, a dot-separated domain,
// no whitespace, no consecutive dots. Catches every realistic typo without
// rejecting valid-but-unusual addresses.
const EMAIL_RE = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/;

export function validateEmail(raw) {
  const value = (raw ?? '').trim();
  if (!value) return 'Email is required.';
  if (/\s/.test(raw ?? '')) return 'Email cannot contain spaces.';
  if (!EMAIL_RE.test(value)) return 'Enter a valid email address, like you@example.com';
  if (value.length > 254) return 'That email is too long.';
  return null;
}

export function validateConsent(checked) {
  return checked ? null : 'Please accept the Terms to continue.';
}

export function validateOtp(code, length) {
  const value = (code ?? '').trim();
  if (!value) return 'Enter the code we sent you.';
  if (value.length < length) return `Enter all ${length} digits.`;
  if (!/^\d+$/.test(value)) return 'The code is digits only.';
  return null;
}

export function validateName(raw) {
  const value = (raw ?? '').trim();
  if (!value) return 'Name is required.';
  // Guards the whitespace-only case: raw had content, trimmed does not.
  if (value.length < NAME_MIN) return `Name must be at least ${NAME_MIN} characters.`;
  if (value.length > NAME_MAX) return `Name must be ${NAME_MAX} characters or fewer.`;
  if (!/^[\p{L}][\p{L}\s'.-]*$/u.test(value)) {
    return 'Use letters, spaces, hyphens and apostrophes only.';
  }
  if (/\d/.test(value)) return 'Name cannot contain numbers.';
  return null;
}

/** Whole years between `dob` and today. */
export function ageFrom(dob) {
  if (!dob) return null;
  const birth = new Date(dob);
  if (Number.isNaN(birth.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDelta = today.getMonth() - birth.getMonth();
  if (monthDelta < 0 || (monthDelta === 0 && today.getDate() < birth.getDate())) age -= 1;
  return age;
}

export function validateDob(dob) {
  if (!dob) return 'Date of birth is required.';
  const birth = new Date(dob);
  if (Number.isNaN(birth.getTime())) return 'Enter a valid date.';
  if (birth > new Date()) return 'Date of birth cannot be in the future.';

  const age = ageFrom(dob);
  // The improvement the brief asks for: the app accepts under-18 silently.
  if (age < MIN_AGE) return `You must be ${MIN_AGE} or older to join Extroverts.`;
  if (age > MAX_AGE) return 'Please check your date of birth.';
  return null;
}

export function validateUsername(raw) {
  const value = (raw ?? '').trim();
  if (!value) return 'Pick a username.';
  if (value.length < USERNAME_MIN) return `At least ${USERNAME_MIN} characters.`;
  if (value.length > USERNAME_MAX) return `${USERNAME_MAX} characters or fewer.`;
  if (!/^[a-z0-9._]+$/i.test(value)) return 'Letters, numbers, dots and underscores only.';
  if (!/^[a-z0-9]/i.test(value)) return 'Start with a letter or a number.';
  if (/[._]{2,}/.test(value)) return 'No repeated dots or underscores.';
  if (/[._]$/.test(value)) return 'Cannot end with a dot or underscore.';
  return null;
}

export function validatePronouns(list) {
  const selected = list ?? [];
  if (selected.length === 0) return 'Pick at least one pronoun.';
  if (selected.length > MAX_PRONOUNS) return `Pick up to ${MAX_PRONOUNS}.`;
  return null;
}

/**
 * Validates the DD / MM / YYYY sheet as a unit.
 *
 * Checked as a real calendar date rather than by range alone, so 31/02/2000 is
 * rejected instead of silently rolling over to 2 March.
 */
export function validateDateParts({ day, month, year }) {
  if (!day && !month && !year) return 'Enter your date of birth.';
  if (!day || !month || !year) return 'Fill in the day, month and year.';

  const d = Number(day);
  const m = Number(month);
  const y = Number(year);

  if (m < 1 || m > 12) return 'Month must be between 01 and 12.';
  if (d < 1 || d > 31) return 'Day must be between 01 and 31.';
  if (year.length < 4) return 'Enter a four-digit year.';

  const currentYear = new Date().getFullYear();
  if (y < currentYear - MAX_AGE || y > currentYear) return 'Please check the year.';

  const date = new Date(y, m - 1, d);
  if (date.getFullYear() !== y || date.getMonth() !== m - 1 || date.getDate() !== d) {
    return 'That date does not exist.';
  }
  if (date > new Date()) return 'Date of birth cannot be in the future.';

  return null;
}

/** Assembles validated parts into the ISO string the rest of the app stores. */
export const toIsoDate = ({ day, month, year }) =>
  `${year.padStart(4, '0')}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;

export const fromIsoDate = (iso) => {
  if (!iso) return { day: '', month: '', year: '' };
  const [year, month, day] = iso.split('-');
  return { day: day ?? '', month: month ?? '', year: year ?? '' };
};

export function validateInviteCode(raw) {
  const value = (raw ?? '').trim();
  if (!value) return null; // optional
  if (!/^[A-Z0-9]{4,10}$/i.test(value)) return 'Invite codes are 4-10 letters or numbers.';
  return null;
}

export const validateState = (v) => (v ? null : 'Select your state.');
export const validateCity = (v) => (v ? null : 'Select your city.');
export const validateCollege = (v) => (v ? null : 'Select your college.');

export function validateVibes(list) {
  const count = (list ?? []).length;
  if (count < MIN_VIBES) {
    const missing = MIN_VIBES - count;
    return `Pick ${missing} more ${missing === 1 ? 'vibe' : 'vibes'} (at least ${MIN_VIBES}).`;
  }
  return null;
}

/** Strips everything but digits, then clamps to `maxLength`. Used on change, not on submit. */
export const digitsOnly = (value, maxLength = Infinity) =>
  (value ?? '').replace(/\D/g, '').slice(0, maxLength);

/** Collapses runs of whitespace so " John   Doe " reads as "John Doe". */
export const collapseSpaces = (value) => (value ?? '').replace(/\s+/g, ' ');
