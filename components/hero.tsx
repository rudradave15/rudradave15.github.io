import { LoadSequence } from "@/components/load-sequence";
import { DotPortrait } from "@/components/effects/dot-portrait";
import { GlitchText } from "@/components/effects/glitch-text";
import { getAllProjects } from "@/lib/content";
import cv from "@/content/cv.json";

function MaskLine({ text }: { text: string }) {
  const words = text.split(" ");
  return (
    <span className="block">
      {words.map((word, i) => (
        <span key={i}>
          <span className="inline-block overflow-hidden align-bottom">
            <span data-reveal="hero-word" className="inline-block will-change-transform">
              {word}
            </span>
          </span>
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </span>
  );
}

const SKILLS = cv.skills.flatMap((g) => g.items);

const QUOTES = [
  "With great power comes great responsibility.",
  "Jack of all trades, master of none, exploration of all, not a prisoner of one.",
];

export function Hero() {
  const shippedCount = getAllProjects().length;
  const edu = cv.education[0];

  return (
    <section
      id="chapter-hero"
      className="relative flex min-h-screen flex-col overflow-hidden"
    >
      <LoadSequence />

      <div
        aria-hidden
        className="pointer-events-none absolute bottom-24 left-1/2 right-1/2 z-0 -mx-[50vw] flex w-screen justify-between whitespace-nowrap px-6 select-none md:px-10"
      >
        <span className="font-display text-[13vw] font-bold leading-none text-ink/[0.04]">
          RUDRA
        </span>
        <span className="font-display text-[13vw] font-bold leading-none text-ink/[0.04]">
          DAVE
        </span>
      </div>

      <div className="relative z-10 flex flex-1 flex-col justify-center py-10 md:py-16">
      <div className="flex flex-col md:flex-row md:items-stretch">
        <div className="flex flex-col justify-center px-6 md:max-w-[560px] md:px-10 lg:px-16">
          <h1
            data-reveal="cinematic-name"
            className="font-display text-[clamp(44px,7vw,84px)] font-bold leading-[0.95] tracking-tight text-ink"
          >
            <GlitchText text="Rudra Dave" delay={550} />
          </h1>
          <div className="text-gradient mt-4 font-display text-[clamp(22px,3vw,30px)] font-semibold leading-tight tracking-tight">
            <MaskLine text="Builds systems that run" />
            <MaskLine text="against real data and real constraints." />
          </div>
          <p className="measure mt-6 text-[16px] leading-relaxed text-ink-muted">
            I&apos;m a B.Tech Computer Engineering student at {edu.school},
            class of {edu.period}, based in {cv.location}. I like building
            things that have to actually work. Nothing here is a tutorial
            clone. Scroll down and try one yourself.
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            {SKILLS.map((t) => (
              <span
                key={t}
                className="rounded-full border border-line bg-paper-2/40 px-2.5 py-1 font-mono text-[11px] text-ink-muted"
              >
                {t}
              </span>
            ))}
          </div>

          <a
            href={`mailto:${cv.email}`}
            className="link-draw mt-5 inline-block font-mono-label text-[12px] text-signal"
          >
            {cv.email} →
          </a>

          <div data-reveal="cinematic-quote" className="glass-card mt-6 p-5">
            {QUOTES.map((q) => (
              <p
                key={q}
                className="font-display text-[15px] italic leading-snug text-ink-muted first:mt-0 mt-3"
              >
                &ldquo;{q}&rdquo;
              </p>
            ))}
          </div>
        </div>

        <div
          data-reveal="cinematic-photo"
          className="order-first flex min-h-[55vh] flex-1 py-2 pl-4 pr-2 md:order-none md:min-h-0 md:py-0 md:pl-6 md:pr-3"
        >
          <DotPortrait
            src="/rudra-dave.png"
            fill
            mono
            className="h-full w-full"
          />
        </div>
      </div>
      </div>

      <div className="relative z-10 w-full px-6 pb-6">
        <div className="mx-auto w-full max-w-[1240px]">
          <div data-reveal="hero-rule" className="h-px w-full origin-left bg-line" />
          <div className="mt-4 flex items-center justify-between font-mono-label text-[11px] text-ink-muted">
            <span className="flex items-center gap-2">
              <span className="live-dot h-1.5 w-1.5 rounded-full bg-flag" />
              Status: {shippedCount} systems shipped
            </span>
            <span>Scroll to explore ↓</span>
          </div>
        </div>
      </div>
    </section>
  );
}
