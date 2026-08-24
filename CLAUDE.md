# CLAUDE.md

Guidance for Claude Code when working in this repository.

## What this is

A front-end-only replication of the **Extroverts** mobile app (`com.pro.nubpack`) — its
landing splash, terms screen, and signup wizard — built as a Frontend Engineering
Assessment. There is no backend and no real authentication; `src/mock/api.js` simulates
every network call.

The deliverable is a **screen recording**, not the source. Fidelity to the app and the
robustness of the form logic are what get graded.

## Commands

```bash
npm run dev      # Vite dev server on :5173
npm run build    # production build to dist/
npm run preview  # serve the built output
```

There is no test runner and no linter configured. Verify changes by running the app.

## Branching

`develop` is the working branch. **Implement everything on `develop`, then merge into
`main`.** Never commit directly to `main`.

Merges to `main` use `--no-ff` so each release boundary stays visible. Because that
leaves `main` with a merge commit `develop` does not have, **back-merge `main` into
`develop` afterwards** (a fast-forward) so the branches do not drift apart.

## Architecture

**Stack:** React 18 · Vite · Tailwind · GSAP · Framer Motion · React Router.
Chosen to mirror extroverts.app's own stack.

Three routes, in `src/pages/`: `/` (Landing), `/signup` (Signup), `/terms` (Terms).

### The wizard is a screen machine, not a step counter

`src/state/signupReducer.js` holds **every screen's data in one reducer**. Screens are
ordered by `SCREEN_ORDER` in `src/data/constants.js`; `NEXT`/`BACK` move an index along
it. No screen component owns field state of its own.

This is load-bearing: it is why **Back never loses data**. If you add a field, put it in
the reducer's initial state — never in a screen's `useState`.

The flow is: `email → otp → username → name → age → pronouns → finish → done`. Only the
middle four are numbered steps (`STEP_INDEX`), matching the app's own four screens.

`usePersistedReducer` mirrors state to `sessionStorage` so a mid-flow refresh restores.
All storage access is wrapped in `try/catch` — never assume it is available.

### Validation

All validators live in `src/lib/validators.js` as **pure `(value) => string | null`
functions**. `null` means valid. Add new ones there, not inline in components.

`src/lib/useFieldErrors.js` owns *when* an error is shown, not whether one exists:
on blur first, then on every keystroke once touched; `validateAll()` touches everything
and focuses the first offender. Screens recompute their whole `errorMap` each render and
hand it to the hook.

**Field-level errors render under the field. Submission-level failures go to the global
toast** (`useToast`). Keep that split — they must never compete.

### Cross-field cascade

State → City → College lives in `src/data/locations.js` as a nested map. The clearing
rule is in the **reducer** (`SET_STATE_FIELD` clears city + college, `SET_CITY` clears
college), deliberately not at the call site, so it cannot be forgotten.

## Conventions

- **Fields the app lacks but the brief requires** live on the finish screen, not in the
  four numbered steps: the State/City/College cascade, the vibe picker, and the
  optional mobile number (§3.B asks for numeric-only phone input explicitly). Keep
  new brief-driven fields there so the four app steps stay faithful.
- **Design tokens** are Tailwind theme extensions in `tailwind.config.js` (`ink`, `vibe`,
  `danger`). Do not hardcode hex values in components.
- **Field surfaces use `.field-surface` / `.field-surface-raised`** (in `index.css`), which
  paint a 1px inset top highlight. These are applied via `@apply shadow-[...]`, never as a
  raw `box-shadow` declaration: Tailwind composes `--tw-shadow` with `--tw-ring-shadow`, so
  the highlight and the focus ring coexist. A plain `box-shadow` in the components layer
  would silently wipe the focus ring off every field in the app.
- **`BottomSheet`'s scroll container needs its `pt-2`.** It is `overflow-y-auto`, which clips
  at its own edge; without that padding the first child's top border and focus ring sit on
  the clip boundary and get cut. This is not decorative spacing — do not remove it.
- **`SearchSelect` opens on click and keypress, never on focus.** Focus-to-open looks
  harmless but breaks two things: committing an option refocuses the input, which
  re-opens the list in the same batch that closed it; and `useFieldErrors` focusing an
  invalid field would blast a dropdown open over the error it just rendered. Its `query`
  state uses `null` to mean "not typing" so the input keeps showing the committed value
  while the list is open — with `''` there, a fresh selection renders as an empty field.
- **Buttons are rounded rectangles, not pills.** `rounded-2xl`, full-width, stacked —
  white primary over outlined secondary. This matches the app; earlier guesses at
  circular pills were wrong.
- `Button`'s `loading` prop is the **only** duplicate-submit guard: it disables the
  button and sets `aria-busy`. Use it rather than hand-rolling a submitting flag.
- **Numeric input is sanitised on change, not blocked by `pattern`**, so pasted values are
  cleaned rather than rejected. Use `digitsOnly` for plain digit fields, but `normalisePhone`
  for phone numbers — it also strips a leading `91`/`0` that would otherwise overflow the
  10-digit cap and leave the user with a silently wrong number.
- Every GSAP timeline must be gated on `useReducedMotion()` — GSAP writes inline styles
  and ignores the CSS media query.
- Type is Poppins (per the brief); the `E•` wordmark alone is set in a serif stack.

## Mock API

Failures are **deterministic**, so each error path can be demonstrated on cue during the
recording. Do not make them random.

| Trigger | Result |
|---|---|
| `taken@extroverts.app` | inline field error |
| `fail@extroverts.app` | global toast |
| OTP `123456` | the only accepted code |
| name containing `errortest` | server 500 → global toast |
| DOB under 18 | blocked in the sheet |
| username in `DEMO.takenUsernames` (`anish`, `party`, …) | taken, with one-tap suggestions |
| email with a typo'd domain (`gmial.com`) | one-tap correction offered |

Keep `README.md` and `RECORDING.md` in sync if these change.

## Deliberate departures from the app

These are graded improvements, not bugs. Do not "fix" them back:

1. **18+ is enforced.** The app accepts any age despite its own Terms requiring 18+.
2. **The OTP screen was rebuilt** — paste-to-fill, auto-advance, resend countdown,
   masked address, attempt lockout. The app has none of this.
3. **A "Step X of 4" indicator** exists; the app gives no sense of progress.
4. **The DOB sheet validates as a calendar** (`31/02` is rejected).
5. **The pronoun cap is visible** — the app silently ignores a 4th selection — and the
   common sets are one tap via `PRONOUN_SETS`.
6. **The full terms are expandable** — the app asks you to accept Terms it never shows.
7. **Username availability is checked** (debounced, `checkUsername`), with one-tap
   suggestions. The "taken" message is deliberately NOT gated behind the touched rule —
   it arrives after typing stops, and the suggestions make no sense without it.
8. **Email domain typos** get a one-tap correction (`suggestEmail`) — a suggestion, not
   a block, since the address may be right.
9. **A review summary** on the finish screen. Its Edit buttons use `GOTO` with
   `returnTo`, so the next `NEXT` returns straight to finish instead of walking forward.
10. **OTP lockout clears the resend timer**, so "request a new code" is actionable the
   moment it appears.
11. **Copy fixes** — the app's "upto" and "shown as on members" are corrected. Its
   `EARLLY IS ICONIC` typo is an intentional joke and stays.

## Copy policy

Reproduce the app's **UI strings verbatim** — the brief demands fidelity. But the
long-form legal terms on `/terms` are **paraphrased**, because Extroverts' own
Intellectual Property clause forbids reproducing them and the brief only asks for a
"similar" page. Keep that line.
