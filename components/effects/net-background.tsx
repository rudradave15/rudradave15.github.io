"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/motion";

type VantaEffect = { destroy: () => void };

export function NetBackground({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const effectRef = useRef<VantaEffect | null>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    let cancelled = false;

    Promise.all([
      import("three"),
      import("vanta/dist/vanta.net.min"),
    ]).then(([THREE, mod]) => {
      if (cancelled || !ref.current) return;
      const NET = (mod as unknown as { default: (opts: Record<string, unknown>) => VantaEffect })
        .default;
      effectRef.current = NET({
        el: ref.current,
        THREE,
        color: 0x8b6bff,
        color2: 0xff6b81,
        backgroundColor: 0x050409,
        points: 9.0,
        maxDistance: 22.0,
        spacing: 17.0,
        showDots: true,
        mouseControls: true,
        touchControls: false,
        gyroControls: false,
        minHeight: 200.0,
        minWidth: 200.0,
        scale: 1.0,
        scaleMobile: 1.0,
      });
    });

    return () => {
      cancelled = true;
      effectRef.current?.destroy();
      effectRef.current = null;
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className={`absolute inset-0 opacity-70 ${className}`}
    />
  );
}
