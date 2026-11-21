import cv from "@/content/cv.json";

export function Footer() {
  return (
    <footer id="contact" className="border-t border-line bg-terminal text-terminal-ink">
      <div className="mx-auto max-w-[1240px] px-6 py-16">
        <p className="font-mono-label text-[11px] text-terminal-ink/60">Contact</p>
        <h2 className="mt-3 font-display text-[clamp(28px,4vw,44px)] font-semibold tracking-tight">
          Get in touch.
        </h2>
        <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3">
          {cv.links.map((l) => (
            <a
              key={l.label}
              href={l.href.startsWith("TODO") ? undefined : l.href}
              aria-disabled={l.href.startsWith("TODO")}
              target={l.href.startsWith("mailto") ? undefined : "_blank"}
              rel="noreferrer"
              className={`font-mono-label text-[13px] ${
                l.href.startsWith("TODO")
                  ? "text-terminal-ink/30"
                  : "link-draw text-terminal-ink hover:text-flag focus-visible:text-flag"
              }`}
            >
              {l.label}
            </a>
          ))}
        </div>
        <div className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-line-terminal pt-6 font-mono text-[11px] text-terminal-ink/50">
          <span>© {new Date().getFullYear()} Rudra Dave</span>
          <span>Built with Next.js, Tailwind, GSAP. Source on request.</span>
        </div>
      </div>
    </footer>
  );
}
