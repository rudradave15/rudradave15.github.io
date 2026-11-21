"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { prefersReducedMotion } from "@/lib/motion";

export function CursorGlow() {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const el = ref.current;
    if (!el) return;

    const xTo = gsap.quickTo(el, "x", { duration: 0.65, ease: "power3" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.65, ease: "power3" });

    function onMove(e: MouseEvent) {
      xTo(e.clientX);
      yTo(e.clientY);
    }

    function onEnter() {
      gsap.to(el, { opacity: 1, duration: 0.3 });
    }
    function onLeave() {
      gsap.to(el, { opacity: 0, duration: 0.3 });
    }

    window.addEventListener("mousemove", onMove);
    document.documentElement.addEventListener("mouseenter", onEnter);
    document.documentElement.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.documentElement.removeEventListener("mouseenter", onEnter);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[60] h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0 mix-blend-plus-lighter"
      style={{
        background:
          "radial-gradient(circle, color-mix(in srgb, var(--signal) 14%, transparent) 0%, transparent 70%)",
      }}
    />
  );
}
