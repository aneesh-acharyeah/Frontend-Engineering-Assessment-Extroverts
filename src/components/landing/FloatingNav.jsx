import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../common/Logo.jsx';

const LINKS = [
  { label: 'Parties', href: '#events' },
  { label: 'About', href: '#about' },
  { label: 'Vibes', href: '#vibes' },
];

/**
 * Their nav mechanism: pinned to the top, transparent over the hero, then it
 * hides on scroll-down and reappears on scroll-up with a blurred pill
 * background — so the chrome is out of the way while reading but one flick
 * away at any point.
 */
export default function FloatingNav() {
  const [visible, setVisible] = useState(true);
  const [floating, setFloating] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  // Their site gates the page behind an "enable sound" screen; the same control
  // lives here instead, so entry is not blocked by a screen nobody asked for.
  const [audioOn, setAudioOn] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      // Above the fold the nav is always visible and fully transparent.
      if (y < 80) {
        setVisible(true);
        setFloating(false);
      } else {
        setFloating(true);
        setVisible(y < lastY.current);
      }
      lastY.current = y;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-4 z-50 transition-all duration-500 sm:inset-x-6 ${
        visible ? 'translate-y-0 opacity-100' : '-translate-y-24 opacity-0'
      }`}
    >
      <nav
        className={`mx-4 flex h-16 items-center justify-between rounded-2xl px-5 transition-all duration-500 sm:mx-0 sm:px-7 ${
          floating ? 'glass' : 'border border-transparent'
        }`}
      >
        <Link to="/" className="flex items-center gap-2 text-white" aria-label="Extroverts home">
          <Logo />
          <span className="text-sm font-semibold uppercase tracking-[0.18em]">Extroverts</span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <button
            type="button"
            onClick={() => setAudioOn((on) => !on)}
            aria-pressed={audioOn}
            aria-label={audioOn ? 'Mute background audio' : 'Enable background audio'}
            title={audioOn ? 'Sound on' : 'Sound off'}
            className="group flex h-9 w-9 items-center justify-center rounded-full border border-white/10 transition-colors hover:border-white/30"
          >
            {/*
              Fixed square target so the bars sit on the row's optical centre
              rather than drifting with their own heights, and a hairline ring
              so it reads as a control rather than as text.
            */}
            <span className="flex h-5 items-center gap-[3px]">
              {[0.5, 0.9, 0.65, 1].map((rest, index) => (
                <span
                  key={rest}
                  className={`indicator-line ${audioOn ? 'active' : ''}`}
                  style={{ '--rest': `${rest * 0.9}rem`, animationDelay: `${index * 0.12}s` }}
                />
              ))}
            </span>
          </button>

          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-xs uppercase tracking-[0.18em] text-white/50 transition-colors hover:text-white"
            >
              {link.label}
            </a>
          ))}
          <Link
            to="/signup"
            className="rounded-full bg-white px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-black transition-transform duration-200 hover:scale-[1.03]"
          >
            Join
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          className="flex h-10 w-10 items-center justify-center rounded-full text-white md:hidden"
        >
          <span className="relative block h-3 w-5">
            <span
              className={`absolute left-0 block h-[1.5px] w-5 bg-current transition-all duration-300 ${
                menuOpen ? 'top-1.5 rotate-45' : 'top-0'
              }`}
            />
            <span
              className={`absolute left-0 block h-[1.5px] w-5 bg-current transition-all duration-300 ${
                menuOpen ? 'top-1.5 -rotate-45' : 'top-3'
              }`}
            />
          </span>
        </button>
      </nav>

      <div
        id="mobile-nav"
        className={`glass mx-4 overflow-hidden rounded-2xl transition-all duration-300 md:hidden ${
          menuOpen ? 'mt-2 max-h-72 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="flex flex-col gap-1 p-3">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="rounded-xl px-4 py-3 text-sm uppercase tracking-[0.16em] text-white/60 transition-colors hover:bg-white/5 hover:text-white"
            >
              {link.label}
            </a>
          ))}
          <Link
            to="/signup"
            className="mt-1 rounded-xl bg-white px-4 py-3 text-center text-sm font-semibold uppercase tracking-[0.14em] text-black"
          >
            Join Extroverts
          </Link>
        </div>
      </div>
    </header>
  );
}
