import cv from "@/content/cv.json";

type Entry = { org: string; role: string; period: string; bullets: string[] };

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <h2 className="font-mono-label text-[12px] text-ink-muted">{children}</h2>;
}

function EntryCard({ e }: { e: Entry }) {
  return (
    <div className="glass-card p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h3 className="font-display text-[19px] font-semibold text-ink">{e.role}</h3>
        {e.period && <span className="font-mono text-[12px] text-ink-muted">{e.period}</span>}
      </div>
      <p className="mt-1 font-mono text-[12px] text-signal">{e.org}</p>
      <ul className="mt-4 list-disc space-y-2 pl-5 text-[15px] leading-relaxed text-ink-muted">
        {e.bullets.map((b, i) => (
          <li key={i}>{b}</li>
        ))}
      </ul>
    </div>
  );
}

export function Summary() {
  return (
    <section className="mx-auto w-full max-w-[1240px] px-6">
      <SectionLabel>Summary</SectionLabel>
      <p className="mt-3 font-display text-[clamp(18px,2.2vw,24px)] font-semibold leading-snug text-ink">
        {cv.headline}
      </p>
      <p className="measure mt-4 text-[16px] leading-relaxed text-ink-muted">{cv.summary}</p>
    </section>
  );
}

export function Experience() {
  return (
    <section id="experience" className="mx-auto w-full max-w-[1240px] px-6">
      <SectionLabel>Experience</SectionLabel>
      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-2">
        {cv.experience.map((e) => (
          <EntryCard key={e.role + e.period} e={e} />
        ))}
      </div>
    </section>
  );
}

export function Skills() {
  return (
    <section className="mx-auto w-full max-w-[1240px] px-6">
      <SectionLabel>Skills</SectionLabel>
      <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
        {cv.skills.map((g) => (
          <div key={g.group} className="glass-card p-5">
            <h3 className="font-mono-label text-[11px] text-signal">{g.group}</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {g.items.map((s) => (
                <span
                  key={s}
                  className="rounded-full border border-line px-2.5 py-1 font-mono text-[11px] text-ink-muted"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function Education() {
  return (
    <section className="mx-auto w-full max-w-[1240px] px-6">
      <SectionLabel>Education</SectionLabel>
      <div className="mt-6 flex flex-col gap-5">
        {cv.education.map((ed) => (
          <div key={ed.school} className="glass-card flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 p-6">
            <div>
              <h3 className="font-display text-[19px] font-semibold text-ink">{ed.program}</h3>
              <p className="mt-1 font-mono text-[12px] text-signal">{ed.school}</p>
            </div>
            <span className="font-mono text-[12px] text-ink-muted">{ed.period}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export function Leadership() {
  if (!cv.leadership?.length) return null;
  return (
    <section className="mx-auto w-full max-w-[1240px] px-6">
      <SectionLabel>Leadership</SectionLabel>
      <div className="mt-6 grid grid-cols-1 gap-5">
        {cv.leadership.map((e) => (
          <EntryCard key={e.role} e={e} />
        ))}
      </div>
    </section>
  );
}
