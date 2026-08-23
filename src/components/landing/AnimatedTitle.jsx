import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import useReducedMotion from '../../lib/useReducedMotion.js';

gsap.registerPlugin(ScrollTrigger);

/**
 * Word-by-word 3D reveal, as on their landing page.
 *
 * `title` accepts <br /> to split lines. Each word is its own inline-block so
 * it can rotate in 3D independently while the line stays on the baseline.
 */
export default function AnimatedTitle({ title, className = '', as: Tag = 'h2' }) {
  const containerRef = useRef(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced || !containerRef.current) return undefined;

    const context = gsap.context(() => {
      gsap.from('.animated-word', {
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 82%',
          toggleActions: 'play none none reverse',
        },
        opacity: 0,
        y: 40,
        rotateX: -60,
        transformOrigin: '50% 100%',
        stagger: 0.035,
        duration: 0.75,
        ease: 'power3.out',
      });
    }, containerRef);

    return () => context.revert();
  }, [reduced]);

  const lines = title.split('<br />');

  return (
    <Tag ref={containerRef} className={`display-title ${className}`} style={{ perspective: '900px' }}>
      {lines.map((line, lineIndex) => (
        // eslint-disable-next-line react/no-array-index-key
        <span key={lineIndex} className="flex flex-wrap justify-center gap-x-[0.25em]">
          {line
            .trim()
            .split(' ')
            .filter(Boolean)
            .map((word, wordIndex) => (
              <span
                // eslint-disable-next-line react/no-array-index-key
                key={`${lineIndex}-${wordIndex}`}
                className="animated-word inline-block"
                dangerouslySetInnerHTML={{ __html: word }}
              />
            ))}
        </span>
      ))}
    </Tag>
  );
}
