import Link from "next/link";
import { getAllProjects } from "@/lib/content";
import { TiltCard } from "@/components/effects/tilt-card";
import { CountUp } from "@/components/effects/count-up";

const STATUS_LABEL: Record<string, string> = {
  live: "Live",
  active: "Active",
  shipped: "Shipped",
  paused: "Paused",
  archived: "Archived",
};

export function SystemsIndex() {
  const projects = getAllProjects();

  return (
    <section id="work" className="mx-auto max-w-[1240px] px-6 pt-6">
      <div className="flex items-baseline justify-between">
        <h2 className="font-mono-label text-[12px] text-ink-muted">Systems index</h2>
        <span className="font-mono text-[12px] text-ink-muted">
          <CountUp value={projects.length} /> shipped
        </span>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {projects.map((p) => (
          <TiltCard key={p.frontmatter.slug} max={4} className="glass-card spotlight block h-full">
            <Link href={`/work/${p.frontmatter.slug}`} className="flex h-full flex-col p-5">
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono-label text-[11px] text-signal">
                  {STATUS_LABEL[p.frontmatter.status]}
                </span>
                <span className="font-mono text-[11px] text-ink-muted">{p.frontmatter.year}</span>
              </div>
              <h3 className="mt-3 font-display text-[19px] font-semibold text-ink">
                {p.frontmatter.title}
              </h3>
              <p className="font-mono text-[11px] text-ink-muted">{p.frontmatter.domain}</p>
              <p className="measure mt-3 flex-1 text-[13px] leading-relaxed text-ink-muted">
                {p.frontmatter.oneLiner}
              </p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {p.frontmatter.stack.slice(0, 4).map((s) => (
                  <span
                    key={s}
                    className="rounded-full border border-line px-2 py-0.5 font-mono text-[10px] text-ink-muted"
                  >
                    {s}
                  </span>
                ))}
              </div>
              <span className="link-draw mt-4 inline-block w-fit font-mono-label text-[11px] text-signal">
                Open case study →
              </span>
            </Link>
          </TiltCard>
        ))}
      </div>
    </section>
  );
}
