import { notFound } from "next/navigation";
import Link from "next/link";
import { compileMDX } from "next-mdx-remote/rsc";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { getAllProjects, getProject } from "@/lib/content";
import { mdxComponents } from "@/components/mdx-components";
import { Toc } from "@/components/toc";
import type { Metadata } from "next";

export function generateStaticParams() {
  return getAllProjects().map((p) => ({ slug: p.frontmatter.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return {
    title: project.frontmatter.title,
    description: project.frontmatter.oneLiner,
    openGraph: { title: project.frontmatter.title, description: project.frontmatter.oneLiner },
  };
}

const STATUS_LABEL: Record<string, string> = {
  live: "Live",
  active: "Active",
  shipped: "Shipped",
  paused: "Paused",
  archived: "Archived",
};

const ARTIFACT_LABEL: Record<string, string> = {
  repo: "Repo",
  screenshot: "Screenshot",
  recording: "Recording",
  "live-demo": "Live demo",
  doc: "Doc",
};

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const { content } = await compileMDX({
    source: project.content,
    components: mdxComponents,
    options: {
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [rehypeSlug],
      },
    },
  });

  const fm = project.frontmatter;

  return (
    <article className="mx-auto max-w-[1240px] px-6 py-[var(--spacing-section-sm)]">
      <Link
        href="/#work"
        className="link-draw font-mono-label text-[11px] text-ink-muted"
      >
        ← Systems index
      </Link>

      <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono-label text-[11px] text-ink-muted">
        <span className="text-signal">{STATUS_LABEL[fm.status]}</span>
        <span>{fm.year}</span>
        <span>{fm.domain}</span>
        {!fm.contentComplete && (
          <span className="rounded-full border border-flag/40 px-2 py-0.5 text-flag">
            Content gaps, see notes
          </span>
        )}
      </div>

      <h1 className="mt-4 max-w-3xl font-display text-[clamp(30px,4.6vw,52px)] font-semibold tracking-tight">
        {fm.title}
      </h1>
      <p className="measure mt-4 text-[18px] leading-relaxed text-ink-muted">{fm.oneLiner}</p>

      <div className="mt-6 flex flex-wrap gap-2">
        {fm.stack.map((s) => (
          <span
            key={s}
            className="rounded-full border border-line px-2.5 py-1 font-mono text-[11px] text-ink-muted"
          >
            {s}
          </span>
        ))}
      </div>

      {fm.artifacts.length > 0 && (
        <div className="mt-8 flex flex-wrap gap-3">
          {fm.artifacts.map((a, i) => (
            <a
              key={i}
              href={a.href}
              target={a.href ? "_blank" : undefined}
              rel="noreferrer"
              className={`link-draw font-mono-label text-[11px] ${
                a.href ? "text-signal" : "text-ink-muted"
              }`}
            >
              {ARTIFACT_LABEL[a.kind]}: {a.label}
            </a>
          ))}
        </div>
      )}

      <div className="mt-16 hairline flex gap-16 pt-10">
        <Toc articleId="case-study-body" />
        <div id="case-study-body" className="min-w-0 flex-1">
          {content}

          {fm.gaps.length > 0 && (
            <div className="measure mt-16 rounded-[4px] border border-flag/40 bg-paper-2 p-5">
              <p className="font-mono-label text-[11px] text-flag">Content gaps</p>
              <ul className="mt-3 list-disc space-y-1.5 pl-5 text-[14px] leading-relaxed text-ink-muted">
                {fm.gaps.map((g, i) => (
                  <li key={i}>{g}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
