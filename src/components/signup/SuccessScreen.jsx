import { useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import Button from '../common/Button.jsx';
import { PARTY_VIBES } from '../../data/constants.js';
import { ageFrom } from '../../lib/validators.js';
import useReducedMotion from '../../lib/useReducedMotion.js';

const COLORS = ['#A855F7', '#EC4899', '#FBBF24', '#34D399', '#60A5FA', '#F472B6'];

function Confetti() {
  const reduced = useReducedMotion();
  const pieces = useMemo(
    () =>
      Array.from({ length: 44 }, (_, index) => ({
        id: index,
        left: Math.random() * 100,
        delay: Math.random() * 0.6,
        duration: 2.4 + Math.random() * 1.8,
        color: COLORS[index % COLORS.length],
        size: 5 + Math.random() * 6,
        rotate: Math.random() * 360,
      })),
    []
  );

  if (reduced) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {pieces.map((piece) => (
        <span
          key={piece.id}
          className="absolute top-[-8%] block rounded-[2px]"
          style={{
            left: `${piece.left}%`,
            width: piece.size,
            height: piece.size * 1.8,
            backgroundColor: piece.color,
            animation: `confetti-fall ${piece.duration}s linear ${piece.delay}s forwards`,
            transform: `rotate(${piece.rotate}deg)`,
          }}
        />
      ))}
    </div>
  );
}

export default function SuccessScreen({ state, onRestart }) {
  const headingRef = useRef(null);
  const age = ageFrom(state.dob);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  const pronounLabel = state.pronouns.length > 0 ? state.pronouns.join(' / ') : '—';

  const vibeLabels = state.vibes
    .map((id) => PARTY_VIBES.find((vibe) => vibe.id === id))
    .filter(Boolean);

  return (
    <div className="relative isolate flex flex-1 flex-col items-center justify-center py-10 text-center">
      <Confetti />

      <div className="relative z-10 w-full">
        <div className="mx-auto mb-7 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-vibe-500 via-pink-500 to-amber-400 shadow-glow">
          <svg width="30" height="24" viewBox="0 0 30 24" fill="none" aria-hidden="true">
            <path
              d="M2 12.5L10.5 21L28 3"
              stroke="white"
              strokeWidth="3.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <h1
          ref={headingRef}
          tabIndex={-1}
          className="display-title text-3xl outline-none sm:text-4xl"
        >
          You&apos;re on the list
        </h1>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-white/45">
          Welcome to Extroverts, {state.name.split(' ')[0]}. Your city&apos;s nightlife just got a lot
          easier to find.
        </p>

        <dl className="mx-auto mt-9 grid w-full gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10 text-left sm:grid-cols-2">
          {[
            ['Username', `@${state.username}`],
            ['Email', state.email],
            ['Pronouns', pronounLabel],
            ['Age', age !== null ? `${age}` : '—'],
            ['City', `${state.city}, ${state.locationState}`],
            ['College', state.college],
          ].map(([label, value]) => (
            <div key={label} className="bg-[#0B0B0B] px-5 py-4">
              <dt className="eyebrow">{label}</dt>
              <dd className="mt-1 truncate text-sm text-white" title={value}>
                {value}
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-6">
          <p className="eyebrow mb-3 text-left">Your vibe</p>
          <div className="flex flex-wrap gap-2">
            {vibeLabels.map((vibe) => (
              <span
                key={vibe.id}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/12 bg-white/[0.04] px-3.5 py-1.5 text-sm text-white/80"
              >
                <span aria-hidden="true">{vibe.emoji}</span>
                {vibe.label}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center gap-1">
          <Link
            to="/"
            className="inline-flex min-h-[44px] w-full items-center justify-center rounded-full bg-white px-8 py-4 text-sm font-semibold uppercase tracking-[0.14em] text-black shadow-[0_10px_40px_-15px_rgba(255,255,255,0.5)] transition-all duration-200 hover:bg-white/90 active:scale-[0.99]"
          >
            Find parties near me
          </Link>
          <Button variant="ghost" size="sm" onClick={onRestart}>
            Start over
          </Button>
        </div>
      </div>
    </div>
  );
}
