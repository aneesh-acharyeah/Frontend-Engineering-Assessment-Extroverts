import { Link } from 'react-router-dom';
import Logo from '../common/Logo.jsx';

/**
 * The app's entry screen, rebuilt for the web: a vivid blurred colour mesh over
 * a dark silhouette, the wordmark centred, then the "AN APP ONLY FOR /
 * EXTROVERTS" lockup, the warning line and a full-width CONTINUE.
 *
 * The mesh is pure CSS radial gradients rather than an image, so it scales to
 * any viewport without pixelation and costs nothing to download.
 */
export default function Hero() {
  return (
    <section className="relative flex h-dvh w-screen flex-col overflow-hidden bg-black">
      {/* Colour mesh. Each stop is one blurred blob; together they read as the app's splash. */}
      <div aria-hidden="true" className="absolute inset-0">
        <div
          className="absolute inset-0 scale-125 blur-[70px]"
          style={{
            background: `
              radial-gradient(38% 44% at 12% 26%, #FF3B1F 0%, transparent 70%),
              radial-gradient(34% 38% at 30% 16%, #FFB020 0%, transparent 72%),
              radial-gradient(40% 40% at 8% 46%, #E01B60 0%, transparent 70%),
              radial-gradient(42% 46% at 74% 20%, #2563EB 0%, transparent 72%),
              radial-gradient(38% 42% at 92% 34%, #06B6D4 0%, transparent 70%),
              radial-gradient(34% 36% at 84% 52%, #10B981 0%, transparent 72%),
              radial-gradient(30% 30% at 50% 30%, #A855F7 0%, transparent 76%)
            `,
          }}
        />
        {/* The silhouette that swallows the bottom two-thirds. */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(120% 62% at 50% 118%, #000 46%, rgba(0,0,0,0.82) 62%, transparent 82%)',
          }}
        />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black to-transparent" />
      </div>

      <div className="relative z-10 flex flex-1 items-center justify-center">
        <Logo size="lg" className="scale-[1.8] drop-shadow-[0_2px_24px_rgba(0,0,0,0.5)] sm:scale-[2.2]" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-lg px-6 pb-[max(2rem,env(safe-area-inset-bottom))] text-center">
        <p className="text-lg font-bold uppercase tracking-[0.01em] text-white sm:text-xl">
          An app only for
        </p>
        <h1 className="mt-1 text-[42px] font-extrabold uppercase leading-none tracking-[-0.01em] text-white sm:text-6xl">
          Extroverts
        </h1>

        <p className="mx-auto mt-6 max-w-sm text-[15px] leading-relaxed text-white/85 sm:text-base">
          <span className="text-[#FF6B4A]">Warning:</span> Entering may lead to spontaneous dancing and
          unsolicited high-fives!
        </p>

        <Link
          to="/signup"
          className="mt-7 flex min-h-[60px] w-full items-center justify-center rounded-2xl bg-white text-[15px] font-semibold uppercase tracking-[0.06em] text-black transition-all duration-200 hover:bg-white/90 active:scale-[0.995]"
        >
          Continue
        </Link>

        <a
          href="#events"
          className="mt-5 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-white/40 transition-colors hover:text-white"
        >
          Or see tonight&apos;s parties <span aria-hidden="true">↓</span>
        </a>
      </div>
    </section>
  );
}
