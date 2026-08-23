import { useState } from 'react';
import { Link } from 'react-router-dom';
import Checkbox from '../common/Checkbox.jsx';
import TextField from '../common/TextField.jsx';
import ScreenShell from './ScreenShell.jsx';
import useFieldErrors from '../../lib/useFieldErrors.js';
import { validateConsent, validateEmail } from '../../lib/validators.js';
import { ApiError, DEMO, requestOtp } from '../../mock/api.js';
import { useToast } from '../common/Toast.jsx';

export default function ScreenEmail({ state, dispatch }) {
  const toast = useToast();
  const [busy, setBusy] = useState(false);
  // Server rejections ("already registered") render inline like any other email
  // error, but must clear the moment the address is edited.
  const [serverError, setServerError] = useState(null);

  const errorMap = {
    email: serverError ?? validateEmail(state.email),
    consent: validateConsent(state.consent),
  };
  const { touch, showError, validateAll, registerRef } = useFieldErrors(errorMap);

  const handleSubmit = async () => {
    if (busy || !validateAll()) return;
    setBusy(true);
    try {
      await requestOtp(state.email);
      dispatch({ type: 'NEXT' });
    } catch (error) {
      if (error instanceof ApiError && error.field === 'email') {
        // Tied to a specific field -> inline, next to the thing to fix.
        setServerError(error.message);
        touch('email');
      } else {
        // Submission-level failure -> global alert.
        toast.error(error.message);
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <ScreenShell
      title="What's your email, party person?"
      phase="Let's Start"
      onSubmit={handleSubmit}
      primaryLabel="Send OTP"
      loading={busy}
    >
      <div className="space-y-7">
        <TextField
          ref={registerRef('email')}
          label="Email"
          type="email"
          inputMode="email"
          autoComplete="email"
          enterKeyHint="go"
          placeholder="you@example.com"
          maxLength={254}
          value={state.email}
          error={showError('email')}
          hint="We'll send a 6-digit code to confirm it's really you. No spam, ever."
          onChange={(event) => {
            setServerError(null);
            dispatch({ type: 'SET_FIELD', field: 'email', value: event.target.value });
          }}
          onBlur={() => touch('email')}
        />

        <Checkbox
          ref={registerRef('consent')}
          checked={state.consent}
          error={showError('consent')}
          onChange={(event) => {
            dispatch({ type: 'SET_FIELD', field: 'consent', value: event.target.checked });
            touch('consent');
          }}
        >
          I&apos;m 18 or older and I accept the{' '}
          <Link
            to="/terms"
            className="text-white underline decoration-white/40 underline-offset-4 transition-colors hover:decoration-white"
          >
            Terms and Conditions
          </Link>
          .
        </Checkbox>

        <p className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-xs leading-relaxed text-white/35">
          <span className="font-medium text-white/60">Demo:</span> try{' '}
          <span className="text-vibe-300">{DEMO.takenEmail}</span> for a taken address, or{' '}
          <span className="text-vibe-300">{DEMO.networkEmail}</span> for a network failure.
        </p>
      </div>
    </ScreenShell>
  );
}
