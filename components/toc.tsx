"use client";

import { useEffect, useState } from "react";

type Heading = { id: string; text: string };

export function Toc({ articleId }: { articleId: string }) {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const article = document.getElementById(articleId);
    if (!article) return;
    const els = Array.from(article.querySelectorAll("h2[id]")) as HTMLElement[];

    const frame = requestAnimationFrame(() => {
      setHeadings(els.map((el) => ({ id: el.id, text: el.textContent ?? "" })));
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: "-15% 0px -70% 0px" }
    );
    els.forEach((el) => observer.observe(el));
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [articleId]);

  if (headings.length === 0) return null;

  return (
    <nav
      aria-label="Section navigation"
      className="sticky top-24 hidden w-48 shrink-0 self-start lg:block"
    >
      <ol className="flex flex-col gap-3 border-l border-line pl-4">
        {headings.map((h) => (
          <li key={h.id}>
            <a
              href={`#${h.id}`}
              className={`font-mono-label text-[11px] leading-snug transition-colors ${
                activeId === h.id ? "text-signal" : "text-ink-muted hover:text-ink"
              }`}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
