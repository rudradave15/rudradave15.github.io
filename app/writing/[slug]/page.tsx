import { notFound } from "next/navigation";
import Link from "next/link";
import { compileMDX } from "next-mdx-remote/rsc";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { getAllPosts, getPost } from "@/lib/content";
import { mdxComponents } from "@/components/mdx-components";
import type { Metadata } from "next";

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.frontmatter.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: post.frontmatter.title,
    description: post.frontmatter.summary,
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const { content } = await compileMDX({
    source: post.content,
    components: mdxComponents,
    options: {
      mdxOptions: { remarkPlugins: [remarkGfm], rehypePlugins: [rehypeSlug] },
    },
  });

  const fm = post.frontmatter;

  return (
    <article className="mx-auto max-w-[720px] px-6 py-[var(--spacing-section-sm)]">
      <Link href="/writing" className="link-draw font-mono-label text-[11px] text-ink-muted">
        ← Writing
      </Link>
      <div className="mt-6 flex flex-wrap items-center gap-3 font-mono-label text-[11px] text-ink-muted">
        <span>{fm.date}</span>
        <span>·</span>
        <span>{post.readingTime}</span>
      </div>
      <h1 className="mt-3 font-display text-[clamp(28px,4.6vw,44px)] font-semibold tracking-tight">
        {fm.title}
      </h1>
      <div className="mt-3 flex flex-wrap gap-2">
        {fm.tags.map((t) => (
          <span
            key={t}
            className="rounded-full border border-line px-2.5 py-1 font-mono text-[11px] text-ink-muted"
          >
            {t}
          </span>
        ))}
      </div>
      <div className="mt-12">{content}</div>
    </article>
  );
}
