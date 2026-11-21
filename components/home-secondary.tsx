import Link from "next/link";
import { getAllPosts, getNow } from "@/lib/content";
import { InvestmentOsDemo } from "@/components/live-demo/investment-os-demo";
import { NetBackground } from "@/components/effects/net-background";

export function LiveDemoSection() {
  return (
    <section
      id="chapter-demo"
      className="relative flex min-h-screen flex-col justify-center overflow-hidden border-y border-line bg-terminal py-20 text-terminal-ink"
    >
      <NetBackground className="[mask-image:radial-gradient(ellipse_60%_60%_at_50%_20%,black,transparent)]" />
      <div className="relative mx-auto w-full max-w-[1240px] px-6">
        <p className="font-mono-label text-[12px] text-terminal-ink/60">Try it</p>
        <h2 className="text-gradient-terminal mt-3 max-w-2xl font-display text-[clamp(24px,3.4vw,36px)] font-semibold tracking-tight">
          You could read about the scoring engine. Or you could just run it.
        </h2>
        <div className="mt-10">
          <InvestmentOsDemo />
        </div>
      </div>
    </section>
  );
}

export function WritingPreview() {
  const posts = getAllPosts().slice(0, 3);
  return (
    <section className="mx-auto max-w-[1240px] px-6">
      <div className="flex items-baseline justify-between">
        <h2 className="font-mono-label text-[12px] text-ink-muted">Writing</h2>
        <Link href="/writing" className="link-draw font-mono-label text-[11px] text-signal">
          All writing →
        </Link>
      </div>
      {posts.length === 0 ? (
        <p className="measure mt-6 text-[15px] text-ink-muted">
          Nothing published yet. The index is live and wired to{" "}
          <code className="rounded bg-paper-2 px-1 py-0.5 font-mono text-[13px]">
            /content/writing
          </code>
          , first posts are queued.
        </p>
      ) : (
        <div className="mt-6 flex flex-col gap-3">
          {posts.map((p) => (
            <Link
              key={p.frontmatter.slug}
              href={`/writing/${p.frontmatter.slug}`}
              className="glass-card flex items-baseline justify-between gap-4 px-5 py-4 hover:text-signal"
            >
              <span className="font-display text-[16px] font-semibold">{p.frontmatter.title}</span>
              <span className="font-mono text-[11px] text-ink-muted">{p.frontmatter.date}</span>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}

export function NowPreview() {
  const now = getNow();
  const firstLine = (now.content.trim().split("\n").find((l) => l.trim().length > 0) ?? "")
    .replace(/^#+\s*/, "")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/[*_`]/g, "");
  return (
    <section className="mx-auto max-w-[1240px] px-6">
      <div className="glass-card flex flex-wrap items-center justify-between gap-4 p-5">
        <div>
          <h2 className="font-mono-label text-[12px] text-ink-muted">Now</h2>
          <p className="measure mt-3 text-[15px] text-ink-muted">{firstLine}</p>
        </div>
        <Link href="/now" className="link-draw font-mono-label text-[11px] text-signal shrink-0">
          What I&apos;m building →
        </Link>
      </div>
    </section>
  );
}
