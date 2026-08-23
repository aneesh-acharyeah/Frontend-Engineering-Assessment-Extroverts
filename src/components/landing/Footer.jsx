import { Link } from 'react-router-dom';
import Logo from '../common/Logo.jsx';

export default function Footer() {
  return (
    <footer className="w-screen border-t border-white/10 bg-black px-5 py-14 sm:px-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 md:flex-row md:items-start md:justify-between">
        <div className="max-w-xs">
          <div className="flex items-center gap-2 text-white">
            <Logo size="lg" />
            <span className="text-sm font-semibold uppercase tracking-[0.18em]">Extroverts</span>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-white/40">
            Find spontaneous parties, meet like-minded people, and make every night an adventure.
          </p>
        </div>

        <nav className="flex flex-wrap gap-x-10 gap-y-4">
          <div className="flex flex-col gap-3">
            <p className="eyebrow">Product</p>
            <a href="#events" className="text-sm text-white/50 transition-colors hover:text-white">
              Parties
            </a>
            <a href="#vibes" className="text-sm text-white/50 transition-colors hover:text-white">
              Vibes
            </a>
            <Link to="/signup" className="text-sm text-white/50 transition-colors hover:text-white">
              Join
            </Link>
          </div>

          <div className="flex flex-col gap-3">
            <p className="eyebrow">Legal</p>
            <Link to="/terms" className="text-sm text-white/50 transition-colors hover:text-white">
              Terms &amp; Conditions
            </Link>
            <a
              href="mailto:hello@extroverts.app"
              className="text-sm text-white/50 transition-colors hover:text-white"
            >
              Contact
            </a>
          </div>
        </nav>
      </div>

      <div className="mx-auto mt-12 flex max-w-6xl flex-col gap-2 border-t border-white/10 pt-8 text-xs text-white/25 sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} Extroverts. Front-end engineering exercise.</p>
        <p>Photography via Pexels · Type set in Poppins</p>
      </div>
    </footer>
  );
}
