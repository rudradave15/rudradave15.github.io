"use client";

import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "@/lib/motion";

type Particle = {
  ox: number;
  oy: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  g: number;
  b: number;
};

/**
 * Renders either a real image (`src`, a background-removed photo works
 * best) or `text` as a field of dots that scatter away from the cursor
 * and spring back. Image mode samples the actual pixel colors so the
 * portrait reads as a real photo, not a recolored silhouette. Text mode
 * (no `src`) rasterizes the glyph to an offscreen canvas instead, no
 * network request needed.
 *
 * `fill` makes the canvas track its own wrapper element's rendered box
 * (via ResizeObserver) instead of a fixed `size` square, so it can cover
 * an entire flex/grid column edge to edge, at whatever size that column
 * actually ends up being.
 */
export function DotPortrait({
  src,
  text,
  size = 280,
  fill = false,
  mono = false,
  className = "",
}: {
  src?: string;
  text?: string;
  size?: number;
  /** Track the wrapper's own box size instead of a fixed square. */
  fill?: boolean;
  /** Render in black and white instead of the sampled photo colors. */
  mono?: boolean;
  className?: string;
}) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [box, setBox] = useState({ w: size, h: size });

  useEffect(() => {
    if (!fill) return;
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const w = Math.round(entry.contentRect.width);
      const h = Math.round(entry.contentRect.height);
      if (w > 0 && h > 0) setBox((prev) => (prev.w === w && prev.h === h ? prev : { w, h }));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [fill]);

  const width = fill ? box.w : size;
  const height = fill ? box.h : size;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || width < 2 || height < 2) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let cancelled = false;
    let raf = 0;
    let cleanupListeners = () => {};

    async function sampleSource(): Promise<ImageData | null> {
      const off = document.createElement("canvas");
      off.width = width;
      off.height = height;
      const octx = off.getContext("2d");
      if (!octx) return null;

      if (src) {
        const img = new Image();
        img.src = src;
        await img.decode().catch(() => {});
        if (!img.width) return null;
        // Cover-fit, but biased to the top with a small margin instead of a
        // centered crop: a centered crop on a portrait sliced off the top
        // of the head whenever the box was proportionally wider than the
        // photo. Any leftover overflow goes to the bottom instead.
        const scale = Math.max(width / img.width, height / img.height) * 0.96;
        const w = img.width * scale;
        const h = img.height * scale;
        octx.drawImage(img, (width - w) / 2, height * 0.025, w, h);
      } else {
        await document.fonts.ready;
        const resolvedFont = getComputedStyle(document.documentElement)
          .getPropertyValue("--font-bricolage")
          .trim();
        const fontSize = Math.round(Math.min(width, height) * 0.62);
        octx.fillStyle = "#fff";
        octx.font = `700 ${fontSize}px ${resolvedFont || "sans-serif"}, sans-serif`;
        octx.textAlign = "center";
        octx.textBaseline = "middle";
        octx.fillText(text ?? "", width / 2, height / 2 + fontSize * 0.04);
      }
      return octx.getImageData(0, 0, width, height);
    }

    sampleSource().then((imageData) => {
      if (cancelled || !imageData || !canvas || !ctx) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);

      const data = imageData.data;
      // Keep particle count roughly bounded regardless of how large the
      // canvas gets: spacing scales with size instead of staying fixed.
      const SPACING = src ? Math.max(2, Math.round(Math.min(width, height) / 300)) : 5;
      const signal =
        getComputedStyle(document.documentElement).getPropertyValue("--signal").trim() ||
        "#d7ff3d";
      const [sr, sg, sb] = signal.startsWith("#")
        ? [
            parseInt(signal.slice(1, 3), 16),
            parseInt(signal.slice(3, 5), 16),
            parseInt(signal.slice(5, 7), 16),
          ]
        : [215, 255, 61];

      const particles: Particle[] = [];
      for (let y = 0; y < height; y += SPACING) {
        for (let x = 0; x < width; x += SPACING) {
          const i = (y * width + x) * 4;
          const alpha = data[i + 3];
          if (alpha > 120) {
            let [r, g, b] = src ? [data[i], data[i + 1], data[i + 2]] : [sr, sg, sb];
            if (mono) {
              const lum = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
              // Push toward pure black/white with a bit of contrast rather
              // than flat mid-gray, so the portrait still reads as crisp.
              const boosted = Math.round(255 * Math.pow(lum / 255, 1.35));
              [r, g, b] = [boosted, boosted, boosted];
            }
            particles.push({ ox: x, oy: y, x, y, vx: 0, vy: 0, r, g, b });
          }
        }
      }

      const reduced = prefersReducedMotion();
      let mouseX = -9999;
      let mouseY = -9999;

      function onMove(e: MouseEvent) {
        const rect = canvas!.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
      }
      function onLeave() {
        mouseX = -9999;
        mouseY = -9999;
      }

      if (!reduced) {
        canvas.addEventListener("mousemove", onMove);
        canvas.addEventListener("mouseleave", onLeave);
        cleanupListeners = () => {
          canvas.removeEventListener("mousemove", onMove);
          canvas.removeEventListener("mouseleave", onLeave);
        };
      }

      const dotRadius = Math.max(1, SPACING * (src ? 0.55 : 0.26));

      function draw() {
        ctx!.clearRect(0, 0, width, height);
        for (const p of particles) {
          if (!reduced) {
            const dx = p.x - mouseX;
            const dy = p.y - mouseY;
            const dist = Math.hypot(dx, dy);
            const radius = 60;
            if (dist < radius) {
              const force = (radius - dist) / radius;
              p.vx += (dx / (dist || 1)) * force * 3.2;
              p.vy += (dy / (dist || 1)) * force * 3.2;
            }
            p.vx += (p.ox - p.x) * 0.06;
            p.vy += (p.oy - p.y) * 0.06;
            p.vx *= 0.82;
            p.vy *= 0.82;
            p.x += p.vx;
            p.y += p.vy;
          }
          ctx!.fillStyle = `rgb(${p.r},${p.g},${p.b})`;
          ctx!.beginPath();
          ctx!.arc(p.x, p.y, dotRadius, 0, Math.PI * 2);
          ctx!.fill();
        }
        if (!reduced) raf = requestAnimationFrame(draw);
      }
      draw();
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      cleanupListeners();
    };
  }, [src, text, width, height, mono]);

  if (fill) {
    return (
      <div ref={wrapRef} className={className}>
        <canvas ref={canvasRef} aria-hidden style={{ width, height, display: "block" }} />
      </div>
    );
  }

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      style={{ width: size, height: size }}
      className={className}
    />
  );
}
