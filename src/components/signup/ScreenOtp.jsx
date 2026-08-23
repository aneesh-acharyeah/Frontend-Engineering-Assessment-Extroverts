import { useCallback, useState } from 'react';
import OtpInput from '../common/OtpInput.jsx';
import ScreenShell from './ScreenShell.jsx';
import { useToast } from '../common/Toast.jsx';
import useCountdown from '../../lib/useCountdown.js';
import { validateOtp } from '../../lib/validators.js';
import { ApiError, DEMO, requestOtp, verifyOtp } from '../../mock/api.js';
import { OTP_LENGTH, OTP_MAX_ATTEMPTS, OTP_RESEND_SECONDS } from '../../data/constants.js';

/** you@example.com -> y•••@example.com — recognisable, but not readable over a shoulder. */
function maskEmail(email) {
  const [user, domain] = (email ?? '').split('@');
  if (!domain) return email;
  return `${user.slice(0, 1)}${'•'.repeat(Math.max(2, user.length - 1))}@${domain}`;
}

export default function ScreenOtp({ state, dispatch }) {
  const toast = useToast();
  const [busy, setBusy] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState(null);
  const [seconds, restartCountdown] = useCountdown(OTP_RESEND_SECONDS);

  const attemptsLeft = OTP_MAX_ATTEMPTS - state.otpAttempts;
  const locked = attemptsLeft <= 0;

  const submit = useCallback(
    async (code) => {
      if (busy || locked) return;

      const formatError = validateOtp(code, OTP_LENGTH);
      if (formatError) {
        setError(formatError);
        return;
      }

      setBusy(true);
      setError(null);
      try {
        await verifyOtp(code);
        dispatch({ type: 'OTP_VERIFIED' });
        dispatch({ type: 'NEXT' });
      } catch (caught) {
        if (caught instanceof ApiError && caught.field === 'otp') {
          const remaining = attemptsLeft - 1;
          dispatch({ type: 'OTP_FAILED' });
          if (remaining > 0) {
            setError(`That code is not right. ${remaining} ${remaining === 1 ? 'try' : 'tries'} left.`);
          } else {
            // Locking the user out while the resend timer is still running would
            // tell them to do the one thing they cannot do. Free the timer so the
            // instruction is actionable the moment it appears.
            restartCountdown(0);
            setError('Too many incorrect attempts. Request a new code to continue.');
          }
        } else {
          toast.error(caught.message);
        }
      } finally {
        setBusy(false);
      }
    },
    [busy, locked, attemptsLeft, dispatch, toast, restartCountdown]
  );

  const handleResend = async () => {
    if (seconds > 0 || resending) return;
    setResending(true);
    setError(null);
    try {
      await requestOtp(state.email);
      dispatch({ type: 'OTP_RESENT' });
      restartCountdown(OTP_RESEND_SECONDS);
      toast.success('New code sent.');
    } catch (caught) {
      toast.error(caught.message);
    } finally {
      setResending(false);
    }
  };

  return (
    <ScreenShell
      title="Enter the code we just sent"
      phase="Verify"
      onSubmit={() => submit(state.otp)}
      primaryLabel="Verify"
      secondaryLabel="Go Back"
      loading={busy}
      primaryDisabled={locked || state.otp.length < OTP_LENGTH}
      onBack={() => dispatch({ type: 'CHANGE_EMAIL' })}
    >
      <div className="space-y-5">
        <p className="text-[15px] leading-relaxed text-white/55">
          A {OTP_LENGTH}-digit code is on its way to{' '}
          <span className="font-medium text-white">{maskEmail(state.email)}</span>.{' '}
          <button
            type="button"
            onClick={() => dispatch({ type: 'CHANGE_EMAIL' })}
            className="text-white underline decoration-white/40 underline-offset-4 transition-colors hover:decoration-white"
          >
            Wrong address?
          </button>
        </p>

        <OtpInput
          length={OTP_LENGTH}
          value={state.otp}
          disabled={busy || locked}
          error={error}
          onChange={(value) => {
            if (error) setError(null);
            dispatch({ type: 'SET_FIELD', field: 'otp', value });
          }}
          // Auto-submit as the last digit lands: no dead "now press verify" beat.
          onComplete={submit}
        />

        <div className="flex items-center justify-between gap-3 text-sm">
          <span className="text-white/35">
            {seconds > 0 ? (
              <>
                Resend in <span className="tabular-nums text-white/60">{seconds}s</span>
              </>
            ) : (
              'Didn’t get it?'
            )}
          </span>
          <button
            type="button"
            onClick={handleResend}
            disabled={seconds > 0 || resending}
            className="text-white underline decoration-white/40 underline-offset-4 transition-colors hover:decoration-white disabled:cursor-not-allowed disabled:text-white/25 disabled:no-underline"
          >
            {resending ? 'Sending…' : 'Resend OTP'}
          </button>
        </div>

        <p className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-xs leading-relaxed text-white/35">
          <span className="font-medium text-white/60">Demo:</span> the code is{' '}
          <span className="font-semibold tabular-nums text-vibe-300">{DEMO.validOtp}</span>.
        </p>
      </div>
    </ScreenShell>
  );
}
