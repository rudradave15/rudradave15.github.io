import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { getNow } from "@/lib/content";
import { mdxComponents } from "@/components/mdx-components";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Now",
  description: "What I'm building and thinking about right now.",
};

export default async function NowPage() {
  const now = getNow();
  const { content } = await compileMDX({
    source: now.content,
    components: mdxComponents,
    options: { mdxOptions: { remarkPlugins: [remarkGfm] } },
  });

  return (
    <div className="mx-auto max-w-[720px] px-6 py-[var(--spacing-section-sm)]">
      <p className="font-mono-label text-[12px] text-ink-muted">Now</p>
      <h1 className="mt-3 font-display text-[clamp(30px,4.6vw,48px)] font-semibold tracking-tight">
        What I&apos;m building right now.
      </h1>
      {now.updated && (
        <p className="mt-3 font-mono text-[12px] text-ink-muted">
          Last updated {now.updated}
        </p>
      )}
      <div className="mt-10">{content}</div>
    </div>
  );
}
