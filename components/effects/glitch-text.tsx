"use client";

import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "@/lib/motion";

export function GlitchText({
  text,
  className = "",
  delay = 0,
  repeatEvery,
}: {
  text: string;
  className?: string;
  delay?: number;
  /** If set, re-triggers the glitch on an interval (ms). Off by default. */
  repeatEvery?: number;
}) {
  const [run, setRun] = useState(false);
  const ref = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    function fire() {
      setRun(false);
      requestAnimationFrame(() => setRun(true));
    }

    const t = window.setTimeout(fire, delay);
    const interval = repeatEvery ? window.setInterval(fire, repeatEvery) : undefined;
    return () => {
      window.clearTimeout(t);
      if (interval) window.clearInterval(interval);
    };
  }, [delay, repeatEvery]);

  return (
    <span
      ref={ref}
      data-text={text}
      className={`glitch ${run ? "glitch-run" : ""} ${className}`}
      onAnimationEnd={() => setRun(false)}
    >
      {text}
    </span>
  );
}
