# Extroverts — Signup Wizard Replication

A front-end-only replication of the **Extroverts** app's landing screen, terms screen and
signup wizard, built for the Frontend Engineering Assessment.

**Stack:** React 18 · Vite · Tailwind CSS · GSAP · Framer Motion · React Router
(the same stack extroverts.app itself is built on).

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build && npm run preview
```

## Routes

| Route | What it is |
|---|---|
| `/` | Landing — the app's splash gate, then the scroll sections |
| `/signup` | The wizard: email → OTP → 4 profile steps → finish → success |
| `/terms` | The app's terms statement, with the full terms expandable |

## Demo triggers

Every failure is **deterministic**, so each error path can be shown on cue rather than
waiting for a random one.

| Where | Input | What happens |
|---|---|---|
| Email | `taken@extroverts.app` | Inline field error — "account already exists" |
| Email | `fail@extroverts.app` | Global toast — network failure |
| OTP | `123456` | The only accepted code |
| OTP | anything else | Inline error, attempts counter, lockout after 3 |
| Name | anything containing `errortest` | Global toast on Sign Up — server 500, form intact |
| Date of birth | any date under 18 | Blocked in the sheet, with an explanation |

## What was replicated

Screens were matched against the app directly: the splash (`E•`, "AN APP ONLY FOR
EXTROVERTS", the warning line, `CONTINUE`), the terms statement with `PARTY` in violet,
the OTP screen, and the four `GETTING READY` steps — Username, Name, Age, Pronouns —
each with a full-width white `NEXT` over an outlined `BACK`, plus the `DATE OF BIRTH`
and `SELECT PRONOUNS` bottom sheets.

## What was improved

The brief asks for more than a copy. These are deliberate departures:

1. **18+ is enforced.** The app collects a date of birth and accepts any age, while its
   own Terms require 18+. The DOB sheet now refuses under-18 dates and says why.
2. **The OTP screen was rebuilt.** The app gives six bare underlines with no auto-advance,
   no paste handling, no resend timer and the destination address printed in full below
   the buttons. This version has auto-advance, Backspace-to-previous, arrow-key
   navigation, paste-to-fill, `one-time-code` autofill, auto-submit on the last digit, a
   30s resend countdown, a masked address and an attempt counter.
3. **Progress is visible.** The app gives no sense of how many steps remain; there is now
   a "Step X of 4" indicator.
4. **The date sheet is validated as a calendar.** `31/02/2000` is rejected rather than
   rolling over to 2 March, and the stray `0` in the app's day box is gone.
5. **The pronoun cap is visible.** The app silently ignores a fourth selection; the
   remaining options now disable and the count is shown.
6. **The terms are actually readable.** The app asks you to accept Terms it never shows.
   They expand in place here.
7. **Accessibility throughout.** Focus moves to each screen's heading, errors are wired
   through `aria-invalid` / `aria-describedby`, sheets trap focus and close on Escape,
   the whole flow is keyboard-operable, and every animation respects
   `prefers-reduced-motion`.

## Notes

- Front-end only. `src/mock/api.js` simulates the backend with realistic latency.
- Wizard state lives in one reducer (`src/state/signupReducer.js`), so **Back never
  loses data** and a mid-flow refresh restores where you were.
- Photography from Pexels (free for commercial use). Type set in Poppins, per the brief.
- The `E•` wordmark is an original approximation, not the company's logo file.
