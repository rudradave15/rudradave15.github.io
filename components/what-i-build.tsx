import { TiltCard } from "@/components/effects/tilt-card";

const AREAS = [
  {
    label: "Deterministic tooling",
    body: "I'm allergic to tools that make things up. Investment OS has one hard rule baked into it: never invent a number, and show your work every time. The scoring engine and the LLM layer that explains it live in physically separate code paths, on purpose.",
  },
  {
    label: "Agent orchestration",
    body: "Claude Code, MCP servers, local LLMs. I use these daily, not as a demo. Most agent setups waste tokens re-explaining context they already had. The ones I build don't.",
  },
  {
    label: "Production integrations",
    body: "Endpoint caps, pagination, rate limits, auth that expires at the worst time. That unglamorous 20% is where I actually spend my time, on dashboards that people other than me check every morning.",
  },
];

export function WhatIBuild() {
  return (
    <section className="mx-auto max-w-[1240px] px-6">
      <h2 className="font-mono-label text-[12px] text-ink-muted">What I actually build</h2>
      <div className="mt-8 grid grid-cols-1 gap-6 pt-2 md:grid-cols-3">
        {AREAS.map((a) => (
          <TiltCard key={a.label} max={5} className="glass-card spotlight p-6">
            <h3 className="font-display text-[18px] font-semibold">{a.label}</h3>
            <p className="mt-3 text-[15px] leading-relaxed text-ink-muted">{a.body}</p>
          </TiltCard>
        ))}
      </div>
    </section>
  );
}
