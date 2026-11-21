"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/lib/motion";

const CHAPTER_IDS = [
  "chapter-hero",
  "chapter-about",
  "chapter-systems",
  "chapter-demo",
  "chapter-writing",
];

/**
 * Scroll-scrubbed "portal" transition between every full-viewport chapter
 * on the homepage: the outgoing chapter scales up and fades as it scrolls
 * past, the incoming one scales in from slightly small, and a brief
 * signal-colored flash bridges each seam. No pinning (fragile combined
 * with the Lenis smooth-scroller already running) — everything is tied
 * directly to scroll position on the real chapter elements.
 */
export function WorldShift() {
  const flashRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const flash = flashRef.current;
    if (!flash) return;

    const chapters = CHAPTER_IDS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => !!el
    );
    if (chapters.length < 2) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      for (let i = 0; i < chapters.length - 1; i++) {
        const outgoing = chapters[i];
        const incoming = chapters[i + 1];

        gsap.fromTo(
          outgoing,
          { scale: 1, opacity: 1 },
          {
            scale: 1.06,
            opacity: 0.15,
            ease: "none",
            scrollTrigger: {
              trigger: outgoing,
              start: "top top",
              end: "bottom top",
              scrub: true,
            },
          }
        );

        gsap.fromTo(
          incoming,
          { scale: 0.94, opacity: 0.3 },
          {
            scale: 1,
            opacity: 1,
            ease: "none",
            scrollTrigger: {
              trigger: incoming,
              start: "top bottom",
              end: "top 55%",
              scrub: true,
            },
          }
        );

        gsap
          .timeline({
            scrollTrigger: {
              trigger: outgoing,
              start: "bottom 95%",
              end: "bottom 35%",
              scrub: true,
            },
          })
          .to(flash, { opacity: 0.14, duration: 0.5 })
          .to(flash, { opacity: 0, duration: 0.5 });
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={flashRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[70] opacity-0"
      style={{
        background: "radial-gradient(circle at 50% 100%, var(--signal), transparent 60%)",
      }}
    />
  );
}
