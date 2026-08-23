import SignupWizard from '../components/signup/SignupWizard.jsx';

/**
 * The app puts each signup screen edge to edge on a black field, with the
 * actions resting on the bottom safe area. That is kept on phones; on wider
 * viewports the column is centred and capped so the line length stays readable
 * instead of stretching across a desktop monitor.
 */
export default function Signup() {
  return (
    <main className="min-h-dvh bg-black">
      <div className="mx-auto flex min-h-dvh w-full max-w-lg flex-col px-6 py-8 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:py-12">
        <SignupWizard />
      </div>
    </main>
  );
}
