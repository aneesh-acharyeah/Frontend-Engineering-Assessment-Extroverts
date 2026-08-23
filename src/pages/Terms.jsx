import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/common/Button.jsx';
import Logo from '../components/common/Logo.jsx';

/**
 * The app's terms screen is a single bold statement, not a document: one block
 * of uppercase copy with the key word picked out in violet, then ACCEPT.
 *
 * That mechanism is reproduced here. The detail sections beneath it are the
 * improvement — the app asks you to agree to Terms it never actually shows.
 * The section list mirrors the published extroverts.app/terms page; the wording
 * is written fresh rather than copied, since their own Intellectual Property
 * clause forbids reproducing it.
 */
const SECTIONS = [
  {
    heading: 'Acceptance of Terms',
    body: 'Installing or using Extroverts means you accept these Terms. If any part of them does not work for you, please do not use the app. We revise them occasionally, and continuing to use Extroverts after a revision means you accept the updated version.',
  },
  {
    heading: 'Eligibility',
    body: 'Extroverts is strictly for adults aged 18 and over. By creating an account you confirm you meet that requirement. We build for real-world nightlife, and that carries responsibilities we can only ask of adults.',
  },
  {
    heading: 'User Conduct',
    body: 'Treat other Extroverts the way you would want to be treated at someone else’s party. Harassment, hate speech, impersonation and spam are not tolerated. We may suspend or remove any account that makes other people feel unsafe, and we may do so without warning.',
  },
  {
    heading: 'Events & Meetups',
    body: 'Parties on Extroverts are created and run by independent hosts. We neither own nor operate them, and we do not vet every gathering. Attending is your own decision and your own risk — use your judgement, obey local law, and look out for the people around you.',
  },
  {
    heading: 'Intellectual Property',
    body: 'The Extroverts name, logo, interface and content belong to Extroverts and its licensors. You are welcome to use the app; you are not permitted to copy, adapt, redistribute or build derivative products from it without written permission.',
  },
  {
    heading: 'Limitation of Liability',
    body: 'Extroverts is provided as is, with no warranty of any kind. We are not liable for loss, injury, property damage or distress arising from your use of the app or from any event you discover through it. Use it at your own discretion.',
  },
  {
    heading: 'Termination',
    body: 'You can walk away at any time. We may suspend or end your access if we believe you have broken these Terms or put other people at risk. Once access ends, your right to use Extroverts ends with it.',
  },
  {
    heading: 'Governing Law',
    body: 'These Terms are governed by the laws of India, and the courts of Bengaluru, Karnataka have exclusive jurisdiction over any dispute arising from them.',
  },
];

const LAST_UPDATED = new Date('2026-08-01').toLocaleDateString('en-IN', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});

export default function Terms() {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);

  return (
    <main className="relative min-h-dvh bg-black">
      <div className="mx-auto flex min-h-dvh w-full max-w-lg flex-col px-6 py-8 sm:py-12">
        <header className="mb-14">
          <Logo size="lg" />
        </header>

        {/* The app's statement block, reproduced. */}
        <h1 className="text-[26px] font-extrabold uppercase leading-[1.25] tracking-[-0.005em] text-white sm:text-[30px]">
          By using this app, you&apos;re agreeing to keep things fun, safe, and respectful… and also
          agreeing to our terms and conditions. Politeness is a must—treat others how you&apos;d want to
          be treated. Everyone here is looking for reasons to{' '}
          <span className="text-vibe-500">party</span>, so bring your best vibe and expect the same from
          others. Let&apos;s party responsibly and make every experience a great one!
        </h1>

        {/*
         * The improvement: the app links to Terms it never displays. These are
         * one tap away, in the same screen, without leaving the flow.
         */}
        <div className="mt-10">
          <button
            type="button"
            onClick={() => setExpanded((open) => !open)}
            aria-expanded={expanded}
            aria-controls="terms-detail"
            className="flex w-full items-center justify-between gap-4 rounded-2xl border border-white/15 px-5 py-4 text-left transition-colors hover:border-white/35"
          >
            <span>
              <span className="block text-sm font-semibold uppercase tracking-[0.04em] text-white">
                Read the full terms
              </span>
              <span className="mt-0.5 block text-xs text-white/40">
                {SECTIONS.length} sections · updated {LAST_UPDATED}
              </span>
            </span>
            <span
              aria-hidden="true"
              className={`shrink-0 text-white/40 transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}
            >
              <svg width="14" height="9" viewBox="0 0 12 8" fill="none">
                <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </span>
          </button>

          {expanded ? (
            <div id="terms-detail" className="mt-6 space-y-8 text-white/65">
              {SECTIONS.map((section) => (
                <section key={section.heading}>
                  <h2 className="mb-2 text-base font-semibold text-white">{section.heading}</h2>
                  <p className="text-[15px] leading-relaxed">{section.body}</p>
                </section>
              ))}

              <section>
                <h2 className="mb-2 text-base font-semibold text-white">Contact</h2>
                <p className="text-[15px] leading-relaxed">
                  Questions? Write to{' '}
                  <a
                    href="mailto:hello@extroverts.app"
                    className="text-white underline decoration-white/40 underline-offset-4"
                  >
                    hello@extroverts.app
                  </a>
                  .
                </p>
              </section>

              <p className="border-t border-white/10 pt-6 text-xs leading-relaxed text-white/25">
                Part of a front-end engineering exercise. This page reproduces the structure of the
                published Extroverts terms, not their wording.
              </p>
            </div>
          ) : null}
        </div>

        <div className="mt-12 space-y-4 pb-2">
          <p className="text-[15px] text-white/45">
            To proceed, accept{' '}
            <button
              type="button"
              onClick={() => setExpanded(true)}
              className="text-white underline decoration-white/40 underline-offset-4 transition-colors hover:decoration-white"
            >
              Terms and Conditions
            </button>
          </p>

          <Button onClick={() => navigate('/signup')}>Accept</Button>
          <Link
            to="/"
            className="block py-2 text-center text-sm uppercase tracking-[0.08em] text-white/35 transition-colors hover:text-white"
          >
            Not now
          </Link>
        </div>
      </div>
    </main>
  );
}
