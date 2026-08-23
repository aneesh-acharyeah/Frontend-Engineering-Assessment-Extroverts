import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import AnimatedTitle from './AnimatedTitle.jsx';
import useReducedMotion from '../../lib/useReducedMotion.js';

gsap.registerPlugin(ScrollTrigger);

/**
 * Their signature scroll moment: the section pins, and a rounded card expands
 * to fill the viewport as you scroll through it. Rebuilt with the same
 * ScrollTrigger recipe (pin + scrub) they use.
 */
export default function AboutClip() {
  const sectionRef = useRef(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced || !sectionRef.current) return undefined;

    const context = gsap.context(() => {
      gsap
        .timeline({
          scrollTrigger: {
            trigger: '#clip',
            start: 'center center',
            end: '+=800 center',
            scrub: 0.5,
            pin: true,
            pinSpacing: true,
          },
        })
        .to('.mask-clip-path', {
          width: '100vw',
          height: '100vh',
          borderRadius: 0,
          ease: 'none',
        });
    }, sectionRef);

    return () => context.revert();
  }, [reduced]);

  return (
    <section id="about" ref={sectionRef} className="min-h-dvh w-screen bg-black">
      <div className="relative mb-10 mt-28 flex flex-col items-center gap-5 px-6 sm:mt-36">
        <p className="eyebrow">Welcome, Extrovert</p>
        <AnimatedTitle
          title="Discover the nightlife,<br />brunches and hangouts<br />of your city"
          className="max-w-4xl text-center text-3xl sm:text-5xl md:text-6xl"
        />
        <p className="mt-2 max-w-md text-center text-sm leading-relaxed text-white/45">
          One feed of everything happening around you tonight — hosted by real people, minutes away.
        </p>
      </div>

      {/* The pinned stage. `mask-clip-path` is what grows to fill the screen. */}
      <div className="relative h-dvh w-screen" id="clip">
        <div className="mask-clip-path">
          <img
            src="/img/about.jpg"
            alt=""
            aria-hidden="true"
            className="absolute left-0 top-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/25" />
        </div>
      </div>
    </section>
  );
}
