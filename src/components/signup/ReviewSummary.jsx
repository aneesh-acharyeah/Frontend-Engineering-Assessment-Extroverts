import { SCREENS } from '../../data/constants.js';
import { ageFrom } from '../../lib/validators.js';

/**
 * A last look before committing.
 *
 * The app's final screen is an invite-code box and SIGN UP — you confirm details
 * entered four screens ago without being shown them, and the name screen warns
 * it "cannot be changed later". Each row jumps straight back to the screen that
 * owns it, so a correction costs one tap instead of repeated Back presses.
 */
export default function ReviewSummary({ state, dispatch }) {
  const age = ageFrom(state.dob);

  const rows = [
    { label: 'Username', value: state.username ? `@${state.username}` : '—', screen: SCREENS.USERNAME },
    { label: 'Name', value: state.name || '—', screen: SCREENS.NAME, note: 'Cannot be changed later' },
    { label: 'Age', value: age !== null ? `${age}` : '—', screen: SCREENS.AGE },
    { label: 'Pronouns', value: state.pronouns.join(' / ') || '—', screen: SCREENS.PRONOUNS },
    { label: 'Email', value: state.email || '—', screen: SCREENS.EMAIL },
  ];

  return (
    <div className="overflow-hidden rounded-2xl border border-white/12">
      <p className="border-b border-white/12 bg-white/[0.03] px-4 py-3 text-xs font-medium uppercase tracking-[0.16em] text-white/45">
        Check before you sign up
      </p>

      <ul className="divide-y divide-white/10">
        {rows.map((row) => (
          <li key={row.label} className="flex items-center gap-3 px-4 py-3">
            <div className="min-w-0 flex-1">
              <p className="text-[11px] uppercase tracking-[0.16em] text-white/35">{row.label}</p>
              <p className="truncate text-[15px] text-white">{row.value}</p>
              {row.note ? <p className="mt-0.5 text-[11px] text-amber-300/70">{row.note}</p> : null}
            </div>
            <button
              type="button"
              onClick={() => dispatch({ type: 'GOTO', value: row.screen, returnTo: SCREENS.FINISH })}
              className="shrink-0 rounded-full border border-white/15 px-3.5 py-1.5 text-xs uppercase tracking-[0.1em] text-white/60 transition-colors hover:border-white/45 hover:text-white"
            >
              Edit
              <span className="sr-only"> {row.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
