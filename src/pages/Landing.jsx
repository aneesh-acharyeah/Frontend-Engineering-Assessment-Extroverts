import { Link } from 'react-router-dom';
import AboutClip from '../components/landing/AboutClip.jsx';
import BentoGrid from '../components/landing/BentoGrid.jsx';
import FloatingNav from '../components/landing/FloatingNav.jsx';
import Footer from '../components/landing/Footer.jsx';
import Hero from '../components/landing/Hero.jsx';
import PartyCarousel from '../components/landing/PartyCarousel.jsx';

/**
 * The app opens on a splash that gates entry behind CONTINUE, so `Hero` plays
 * that role here rather than stacking a second loading screen in front of it.
 * The site's audio gate survives as the toggle in the floating nav.
 */
export default function Landing() {
  return (
    <>
      <main className="relative min-h-dvh w-screen overflow-x-hidden bg-black">
        <FloatingNav />
        <Hero />

        <div className="flex w-screen justify-center bg-black py-4">
          <Link
            to="/signup"
            className="group flex items-center gap-2 rounded-full border border-white/10 px-5 py-2 text-xs uppercase tracking-[0.18em] text-white/40 transition-all duration-300 hover:border-vibe-500/50 hover:text-white/70"
          >
            <span aria-hidden="true">🎉</span>
            <span>What&apos;s your party vibe?</span>
            <span className="text-vibe-400 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden="true">
              →
            </span>
          </Link>
        </div>

        <PartyCarousel />
        <AboutClip />
        <BentoGrid />
        <Footer />
      </main>
    </>
  );
}
