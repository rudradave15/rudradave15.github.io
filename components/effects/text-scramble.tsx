"use client";

import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "@/lib/motion";

const CHARS = "!<>-_\\/[]{}=+*^?#0123456789";

export function TextScramble({
  text,
  className = "",
  delay = 0,
}: {
  text: string;
  className?: string;
  delay?: number;
}) {
  // Always starts as the real text so server and client render identically
  // on first paint. The scramble only kicks in client-side, after mount,
  // inside the effect below.
  const [display, setDisplay] = useState(text);
  const frame = useRef(0);
  const raf = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const totalFrames = text.length * 3 + 20;
    let started = false;
    const timeout = window.setTimeout(() => {
      started = true;
      const tick = () => {
        frame.current++;
        const progress = frame.current / totalFrames;
        const revealCount = Math.floor(progress * text.length);
        let out = "";
        for (let i = 0; i < text.length; i++) {
          if (i < revealCount) out += text[i];
          else if (text[i] === " ") out += " ";
          else out += CHARS[Math.floor(Math.random() * CHARS.length)];
        }
        setDisplay(out);
        if (frame.current < totalFrames) {
          raf.current = requestAnimationFrame(tick);
        } else {
          setDisplay(text);
        }
      };
      tick();
    }, delay);

    return () => {
      window.clearTimeout(timeout);
      if (started && raf.current) cancelAnimationFrame(raf.current);
    };
  }, [text, delay]);

  return (
    <span className={className} aria-label={text}>
      {display || " "}
    </span>
  );
}
