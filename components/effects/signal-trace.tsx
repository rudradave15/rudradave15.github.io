"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/motion";

/**
 * An ambient, near-subliminal line trace that drifts across the background,
 * shaped like a ticking stock chart. No axes, no numbers, no panel: it's
 * meant to read as atmosphere (alongside the aurora blobs), not as a widget.
 */
export function SignalTrace() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (prefersReducedMotion()) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let width = 0;
    let height = 0;
    let dpr = 1;

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas!.width = width * dpr;
      canvas!.height = height * dpr;
      canvas!.style.width = `${width}px`;
      canvas!.style.height = `${height}px`;
      ctx!.scale(dpr, dpr);
    }
    resize();
    window.addEventListener("resize", resize);

    const baseline = height * 0.62;
    const points: number[] = [];
    const STEP = 5.5;
    const N = Math.ceil(width / STEP) + 2;
    let level = 0;
    for (let i = 0; i < N; i++) {
      level += (Math.random() - 0.5) * 14;
      level = Math.max(-70, Math.min(70, level));
      points.push(level);
    }

    let scrollAcc = 0;
    let t = 0;

    function draw() {
      t += 1;
      scrollAcc += 0.55;
      if (scrollAcc >= STEP) {
        scrollAcc = 0;
        points.shift();
        let next = points[points.length - 1] + (Math.random() - 0.5) * 14;
        next = Math.max(-70, Math.min(70, next));
        points.push(next);
      }

      ctx!.clearRect(0, 0, width, height);

      ctx!.beginPath();
      points.forEach((p, i) => {
        const x = i * STEP - scrollAcc;
        const y = baseline + p + Math.sin(t * 0.004 + i * 0.05) * 6;
        if (i === 0) ctx!.moveTo(x, y);
        else ctx!.lineTo(x, y);
      });

      const grad = ctx!.createLinearGradient(0, 0, width, 0);
      grad.addColorStop(0, "rgba(139,107,255,0)");
      grad.addColorStop(0.5, "rgba(139,107,255,0.14)");
      grad.addColorStop(0.85, "rgba(255,107,129,0.12)");
      grad.addColorStop(1, "rgba(255,107,129,0)");
      ctx!.strokeStyle = grad;
      ctx!.lineWidth = 1.2;
      ctx!.lineJoin = "round";
      ctx!.stroke();

      raf = requestAnimationFrame(draw);
    }
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[-1]"
    />
  );
}
