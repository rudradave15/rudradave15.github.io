"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/lib/motion";

export function CountUp({
  value,
  duration = 1.1,
  className = "",
  suffix = "",
}: {
  value: number;
  duration?: number;
  className?: string;
  suffix?: string;
}) {
  const ref = useRef<HTMLSpanElement | null>(null);
  // Always starts at the final value so server and client agree on first
  // paint. The count-from-zero only happens client-side, post-mount.
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    if (prefersReducedMotion() || !ref.current) return;
    gsap.registerPlugin(ScrollTrigger);
    setDisplay(0);
    const obj = { v: 0 };
    const tween = gsap.to(obj, {
      v: value,
      duration,
      ease: "power2.out",
      onUpdate: () => setDisplay(Math.round(obj.v)),
      scrollTrigger: {
        trigger: ref.current,
        start: "top 90%",
        once: true,
      },
    });
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [value, duration]);

  return (
    <span ref={ref} className={className}>
      {display}
      {suffix}
    </span>
  );
}
