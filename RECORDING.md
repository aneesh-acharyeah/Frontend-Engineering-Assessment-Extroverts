# Screen recording script (target 4:30, max 5:00)

Reset before recording: open `/signup`, click **Start over** if you see the success
screen, or clear `sessionStorage`. Record at a phone-ish window width (~420px) so it
reads as the app, then widen once at the end for the responsive beat.

| Time | Screen | Say / do |
|---|---|---|
| 0:00–0:35 | `/` | Splash: `E•`, "AN APP ONLY FOR EXTROVERTS", the warning line. Note this is the app's own entry screen. Scroll: nav hides going down and returns coming up, party carousel, the pinned clip-path reveal, the bento grid. |
| 0:35–0:50 | `/terms` | The terms statement with `PARTY` in violet. **Call out the improvement:** the app asks you to accept Terms it never shows — expand "Read the full terms". |
| 0:50–1:35 | Step: email | Type `not-an-email`, blur → inline error. Press Send OTP with the box unticked → consent error. Tick it, use `taken@extroverts.app` → inline "already exists". Then `fail@extroverts.app` → **global toast** (say: field problems go under the field, submission failures go to a toast). Then a real address → spinner, button disabled. |
| 1:35–2:20 | OTP | **Call out the improvement:** this is the screen the brief flags. Paste `999999` in one go (paste fills all six) → error + "2 tries left". Show the resend countdown blocking early resend. Show the masked address and "Wrong address?". Then type `123456` → auto-submits on the last digit, no button press. |
| 2:20–2:45 | Step 1 & 2 | Username: type `ab` → too short; show the live counter and that spaces/symbols cannot be typed at all. Then a valid one. Name: press Next empty → error + focus jumps to the field. Type a name with double spaces to show it normalising. |
| 2:45–3:20 | Step 3 (Age) | Open the DOB sheet. Enter `31 / 02 / 2000` → "that date does not exist". Then a date under 18 → **the 18+ block** (say: the app accepts this silently, and its own Terms require 18+). Then a valid date → age appears. |
| 3:20–3:35 | Step 4 (Pronouns) | Open the sheet, pick three, show the rest disable and the count update. Proceed. |
| 3:35–4:15 | Finish | The house-rules manifesto. **Cross-field logic:** pick Karnataka → Bengaluru → PES University, then change the state and show city *and* college both clear. Pick fewer than 3 vibes → error. Set the name to include `errortest` and Sign Up → **server error toast, form intact**, then retry → success screen. |
| 4:15–4:30 | Responsive + back | Widen the window to tablet and desktop. Then hit Back a few times to show nothing is lost, and refresh mid-flow to show it restores. |

Submit the public recording link at https://forms.gle/UFK1tUAzVBfStptf9
