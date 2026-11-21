import Link from "next/link";
import { getAllPosts } from "@/lib/content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Writing",
  description: "Notes, teardowns, and things worked out in public.",
};

export default function WritingIndex() {
  const posts = getAllPosts();

  return (
    <div className="mx-auto max-w-[1240px] px-6 py-[var(--spacing-section-sm)]">
      <p className="font-mono-label text-[12px] text-ink-muted">Writing</p>
      <h1 className="mt-3 max-w-2xl font-display text-[clamp(30px,4.6vw,48px)] font-semibold tracking-tight">
        Notes and teardowns.
      </h1>
      <p className="measure mt-4 text-[17px] leading-relaxed text-ink-muted">
        Short write-ups on things I figured out, problems I hit, and how I
        think about building. No fixed schedule. It fills in as it happens.
      </p>

      <div className="mt-14 hairline">
        {posts.length === 0 && (
          <div className="border-b border-line py-10">
            <p className="font-mono-label text-[11px] text-flag">Nothing here yet</p>
            <p className="measure mt-2 text-[15px] text-ink-muted">
              Coming soon.
            </p>
          </div>
        )}
        {posts.map((post) => (
          <Link
            key={post.frontmatter.slug}
            href={`/writing/${post.frontmatter.slug}`}
            className="group grid grid-cols-1 gap-2 border-b border-line py-6 transition-colors hover:bg-paper-2 md:grid-cols-[120px_1fr_auto] md:items-baseline md:gap-6"
          >
            <span className="font-mono text-[12px] text-ink-muted">
              {post.frontmatter.date}
            </span>
            <span>
              <span className="font-display text-[19px] font-semibold text-ink group-hover:text-signal">
                {post.frontmatter.title}
              </span>
              <span className="measure mt-1 block text-[14px] text-ink-muted">
                {post.frontmatter.summary}
              </span>
            </span>
            <span className="font-mono text-[11px] text-ink-muted">
              {post.readingTime}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
