"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { prefersReducedMotion } from "@/lib/motion";

const SIZE = 96;
const STROKE = 7;
const RADIUS = (SIZE - STROKE) / 2;
const CIRC = 2 * Math.PI * RADIUS;
const ARC = 0.75; // 270 degrees of the circle is used

export function Gauge({ value, color = "#8b6bff" }: { value: number; color?: string }) {
  const ref = useRef<SVGCircleElement | null>(null);
  const usable = CIRC * ARC;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const target = usable * (1 - value / 100);
    if (prefersReducedMotion()) {
      el.style.strokeDashoffset = String(target);
      return;
    }
    gsap.fromTo(
      el,
      { strokeDashoffset: usable },
      { strokeDashoffset: target, duration: 1.1, ease: "power2.out", delay: 0.1 }
    );
  }, [value, usable]);

  return (
    <svg
      width={SIZE}
      height={SIZE}
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      className="-rotate-[135deg]"
      aria-hidden
    >
      <circle
        cx={SIZE / 2}
        cy={SIZE / 2}
        r={RADIUS}
        fill="none"
        stroke="currentColor"
        strokeOpacity={0.15}
        strokeWidth={STROKE}
        strokeLinecap="round"
        strokeDasharray={`${usable} ${CIRC}`}
      />
      <circle
        ref={ref}
        cx={SIZE / 2}
        cy={SIZE / 2}
        r={RADIUS}
        fill="none"
        stroke={color}
        strokeWidth={STROKE}
        strokeLinecap="round"
        strokeDasharray={`${usable} ${CIRC}`}
        strokeDashoffset={usable}
      />
    </svg>
  );
}
