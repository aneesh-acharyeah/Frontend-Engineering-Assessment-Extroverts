# Screen recording script

**Target 4:40. Hard limit 5:00.** The brief asks for a recording "covering the form,
errors, validation, etc." — so the wizard is the subject. The landing page is scene-setting,
not the point; keep it short.

## Before you record

```bash
npm run build && npm run preview     # record the built app, not the dev server
```

The dev server can serve a stale HMR module after edits; the preview build cannot.

- Resize the browser to roughly **420px wide** so it reads as the app. Widen only for the
  responsive beat at the end.
- Open `/signup` and clear state: DevTools → Application → Session Storage → delete
  `extroverts.signup.v2`. (Or finish a run and hit **Start over**.)
- Have `999999` and `+91 98765-43210` ready to paste — pasting is more convincing than typing.
- Hide bookmarks, close other tabs, silence notifications.

## Shot list

| Time | Screen | What to do | Say this |
|---|---|---|---|
| 0:00–0:25 | `/` | Splash, then scroll: nav hides on the way down and returns on the way up, party carousel, the pinned clip-path reveal, bento grid. Click **Continue**. | "This is the app's own entry screen, rebuilt for web." |
| 0:25–0:40 | `/terms` | The statement with `PARTY` in violet. Expand **Read the full terms**. | "First improvement — the app asks you to accept Terms it never actually shows you." |
| 0:40–1:20 | Email | `not-an-email` → blur → inline error. Press **Send OTP** unticked → consent error. Tick, then `taken@extroverts.app` → inline "already exists". Then type `anish@gmial.com` → **"Did you mean anish@gmail.com?"**, tap it. Then `fail@extroverts.app` → **global toast**. Finally a real address → spinner. | "Field problems go under the field. Submission failures go to a toast. They never compete." |
| 1:20–2:00 | OTP | Paste `999999` (fills all six at once) → error + "2 tries left". Point at the countdown blocking resend, the masked address, "Wrong address?". Then paste `123456` → **auto-submits**, no button press. | "The brief calls this screen out. The app has no auto-advance, no paste, no resend timer, and prints your full email under the buttons." |
| 2:00–2:30 | Step 1 · Username | Type `ab` → too short. Try typing a space or `!` → nothing happens. Type `anish` → spinner → **taken**, with tappable suggestions. Tap one → green tick. | "The app never checks availability, so a clash only surfaces after you've filled in everything else." |
| 2:30–2:45 | Step 2 · Name | Press **Next** empty → error, focus jumps to the field. Type `John   Doe` with extra spaces → watch it normalise. Show the counter. | |
| 2:45–3:20 | Step 3 · Age | Open the sheet. `31 / 02 / 2000` → "that date does not exist". Then a date under 18 → **the 18+ block**. Then a valid date → age appears. | "The app collects age and accepts anything — while its own Terms require 18+." |
| 3:20–3:40 | Step 4 · Pronouns | Open the sheet. Tap **they / them** → fills all three at once. Show the rest disable at the cap. Tap **"Did we miss anything?"** → the add-your-own field. | "In the app that line is dead text, and the sets cost three taps each." |
| 3:40–4:25 | Finish | The manifesto. **Review summary** — tap an **Edit**, change it, and show **Next** returning straight here. **Cascade:** Karnataka → Bengaluru → PES University, then change the state and show city *and* college both clear. Fewer than 3 vibes → error. Paste `+91 98765-43210` into mobile → normalises to 10 digits. Use the review summary's **Edit** to set the name to contain `errortest` → **Sign Up** → **error toast, form intact**. Edit the name again to remove it → **Sign Up** → success. | "The app asks you to sign up without showing what you entered four screens ago." |
| 4:25–4:40 | Responsive + back | Widen to tablet, then desktop. Hit **Back** twice — nothing is lost. Refresh mid-flow — it restores. | |

## What each beat is proving

The brief grades specific things. Make sure each one is visibly on screen:

| Brief requirement | Where it happens |
|---|---|
| Real-time validation (on blur / on change) | Email, username, name |
| Contextual errors beneath fields | Everywhere |
| Global alerts for failed submissions | `fail@` toast, `errortest` toast |
| Character limits | Username and name counters |
| Numeric-only for years / phones | DOB year boxes, mobile paste |
| No whitespace-only submissions | Name step |
| Loading states preventing duplicates | Send OTP spinner, username check spinner |
| Cross-field dependency | State → City → College |
| Going backward | Back buttons, review-summary Edit |
| Success feedback | Final screen |
| Responsive | Last 15 seconds |

## If you run long

Cut in this order — earliest cuts first, they cost the least:

1. The landing scroll (drop to splash + Continue, saves ~15s).
2. The terms expand (saves ~10s).
3. The email typo suggestion (saves ~8s).

**Never cut:** the OTP screen or the 18+ block. The brief names both by hand, so they are
the two moments the grader is explicitly looking for.

## Submitting

Upload unlisted to YouTube or Drive, **set the link to public/anyone-with-link**, then
open it in a private window to confirm it actually plays before you submit.

Form: https://forms.gle/UFK1tUAzVBfStptf9
