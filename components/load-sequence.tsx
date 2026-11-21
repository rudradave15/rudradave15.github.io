"use client";

import { useLayoutEffect } from "react";
import { gsap } from "gsap";
import { prefersReducedMotion } from "@/lib/motion";

export function LoadSequence() {
  useLayoutEffect(() => {
    if (prefersReducedMotion()) return;

    const name = gsap.utils.toArray<HTMLElement>('[data-reveal="cinematic-name"]');
    const photo = gsap.utils.toArray<HTMLElement>('[data-reveal="cinematic-photo"]');
    const quote = gsap.utils.toArray<HTMLElement>('[data-reveal="cinematic-quote"]');
    const words = gsap.utils.toArray<HTMLElement>('[data-reveal="hero-word"]');
    const rule = gsap.utils.toArray<HTMLElement>('[data-reveal="hero-rule"]');

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.1 });
      tl.set(name, { opacity: 0, scale: 1.08, filter: "blur(16px)" })
        .set(photo, { opacity: 0, scale: 0.92 })
        .set(quote, { opacity: 0, y: 16 })
        .set(words, { yPercent: 110 })
        .set(rule, { scaleX: 0 })
        .to(name, {
          opacity: 1,
          scale: 1,
          filter: "blur(0px)",
          duration: 0.9,
          ease: "power3.out",
        })
        .to(
          words,
          { yPercent: 0, duration: 0.6, stagger: 0.04, ease: "power3.out" },
          "-=0.35"
        )
        .to(rule, { scaleX: 1, duration: 0.5, ease: "power2.inOut" }, "-=0.25")
        .to(
          photo,
          { opacity: 1, scale: 1, duration: 0.8, ease: "power3.out" },
          "-=0.5"
        )
        .to(quote, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }, "-=0.3");
    });

    return () => ctx.revert();
  }, []);

  return null;
}
