import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { PARTIES } from '../../data/parties.js';

function PartyCard({ party, offset }) {
  return (
    <article
      className="group relative w-[74vw] shrink-0 overflow-hidden rounded-3xl border border-white/10 bg-[#0B0B0B] sm:w-[19rem]"
      style={{ transform: `translateY(${offset}px)` }}
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        <img
          src={party.image}
          alt=""
          aria-hidden="true"
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
        <span className="absolute left-4 top-4 rounded-full bg-black/60 px-3 py-1.5 text-[10px] uppercase tracking-[0.16em] text-white/80 backdrop-blur">
          {party.tag}
        </span>
      </div>

      <div className="p-5">
        <h3 className="text-lg font-semibold leading-snug text-white">{party.title}</h3>
        <p className="mt-1 text-xs uppercase tracking-[0.16em] text-vibe-300">{party.host}</p>

        <p className="mt-3 flex items-center gap-1.5 text-sm text-white/50">
          <span aria-hidden="true">📍</span> {party.venue}
        </p>
        <p className="mt-1 flex items-center gap-1.5 text-sm text-white/50">
          <span aria-hidden="true">🕘</span> {party.time}
        </p>

        <Link
          to="/signup"
          className="mt-5 flex min-h-[44px] w-full items-center justify-center rounded-full bg-white py-3 text-sm font-semibold text-black transition-colors duration-300 hover:bg-white/90"
        >
          Join
        </Link>
      </div>
    </article>
  );
}

/**
 * Infinite marquee of tonight's parties, matching their site's `carousel-track`
 * mechanism: the list is tripled and the track translates by exactly -33.3333%,
 * so the loop point is invisible.
 */
export default function PartyCarousel() {
  const tripled = useMemo(() => [...PARTIES, ...PARTIES, ...PARTIES], []);
  // Fixed pseudo-random vertical offsets give the row a hand-placed feel.
  const offsets = useMemo(() => PARTIES.map((_, index) => ((index * 37) % 44) - 22), []);

  return (
    <section
      id="events"
      aria-label="Parties happening tonight"
      className="relative w-screen overflow-hidden bg-black py-20 sm:py-24"
    >
      <div aria-hidden="true" className="blob left-[-10rem] top-1/3 h-96 w-96 bg-vibe-600/20" />

      {/* Heading sits in flow above the track, so the offset cards cannot collide with it. */}
      <div className="relative z-10 mb-12 px-6 text-center">
        <p className="eyebrow mb-3">Tonight in your city</p>
        <h2 className="display-title text-3xl sm:text-5xl">Pick a vibe. Show up.</h2>
      </div>

      <div
        className="carousel-track py-10"
        style={{ animation: 'carousel-scroll 80s linear infinite' }}
      >
        {tripled.map((party, index) => (
          <PartyCard
            // eslint-disable-next-line react/no-array-index-key
            key={`${party.id}-${index}`}
            party={party}
            offset={offsets[index % PARTIES.length]}
          />
        ))}
      </div>
    </section>
  );
}
