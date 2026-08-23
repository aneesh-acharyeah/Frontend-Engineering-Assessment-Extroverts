import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import useReducedMotion from '../../lib/useReducedMotion.js';

/**
 * Tilt-on-hover card. Their site calls this `bento-tilt`; the transform is
 * driven from the pointer's position within the card's own bounds, so the tilt
 * always points away from the cursor.
 */
function TiltCard({ children, className = '' }) {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const [transform, setTransform] = useState('');

  const handleMove = (event) => {
    if (reduced || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    setTransform(
      `perspective(900px) rotateX(${(-y * 8).toFixed(2)}deg) rotateY(${(x * 8).toFixed(2)}deg) scale(0.98)`
    );
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={() => setTransform('')}
      style={{ transform, transition: transform ? 'none' : 'transform 500ms ease-out' }}
      className={`relative overflow-hidden rounded-3xl border border-white/10 ${className}`}
    >
      {children}
    </div>
  );
}

function ImageTile({ src, eyebrow, title, body, className = '' }) {
  return (
    <TiltCard className={className}>
      <img src={src} alt="" aria-hidden="true" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
      <div className="relative flex h-full flex-col justify-end p-6">
        <p className="eyebrow mb-2">{eyebrow}</p>
        <h3 className="text-2xl font-bold leading-tight text-white sm:text-3xl">{title}</h3>
        <p className="mt-2 max-w-xs text-sm leading-relaxed text-white/55">{body}</p>
      </div>
    </TiltCard>
  );
}

export default function BentoGrid() {
  return (
    <section id="vibes" className="w-screen bg-black px-5 pb-28 pt-20 sm:px-10">
      <div className="mx-auto max-w-6xl">
        <p className="eyebrow mb-3">Into the vibe</p>
        <h2 className="display-title max-w-2xl text-3xl sm:text-5xl">Endless excuses to party</h2>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-white/45">
          Tea parties to karaoke nights to 2 AM board games. If it is happening near you, it is on
          Extroverts.
        </p>

        <div className="mt-12 grid auto-rows-[15rem] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <ImageTile
            className="sm:col-span-2 sm:row-span-2"
            src="/img/bento-1.jpg"
            eyebrow="Host"
            title="Throw a party in your city"
            body="Set the theme, set the guest count, and let the right people find you."
          />

          {/* Flat violet block, exactly as in the app's create-party screens. */}
          <TiltCard className="bg-vibe-300 text-black">
            <div className="flex h-full flex-col justify-between p-6">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] opacity-60">
                Infinite people
              </p>
              <div>
                <h3 className="text-3xl font-black uppercase leading-none tracking-tight">
                  Party
                  <br />
                  with
                </h3>
                <p className="mt-3 text-sm leading-snug opacity-70">
                  From intimate gatherings of 3 to festive occasions of 25+.
                </p>
              </div>
            </div>
          </TiltCard>

          <ImageTile
            src="/img/bento-2.jpg"
            eyebrow="Chat"
            title="Break the ice early"
            body="Plan and vibe with the guest list before you even arrive."
          />

          <ImageTile
            className="sm:col-span-2"
            src="/img/bento-3.jpg"
            eyebrow="Memories"
            title="Rate the night, award the vibes"
            body="Best dance moves, best vibes, unforgettable moments — decided by everyone who was there."
          />

          <TiltCard className="bg-gradient-to-br from-vibe-500 via-fuchsia-600 to-amber-400">
            <Link to="/signup" className="flex h-full flex-col justify-between p-6 text-white">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] opacity-70">
                Free forever
              </p>
              <div>
                <h3 className="text-3xl font-black uppercase leading-none tracking-tight">
                  Join
                  <br />
                  now
                </h3>
                <p className="mt-3 inline-flex items-center gap-2 text-sm opacity-80">
                  Takes 60 seconds <span aria-hidden="true">→</span>
                </p>
              </div>
            </Link>
          </TiltCard>
        </div>
      </div>
    </section>
  );
}
