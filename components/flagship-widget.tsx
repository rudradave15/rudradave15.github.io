import Link from "next/link";
import { TiltCard } from "@/components/effects/tilt-card";

const NODES = [
  {
    label: "CORE",
    desc: "Deterministic scoring engine. No LLM calls anywhere in this package.",
  },
  {
    label: "REASONING",
    desc: "Local LLM (Ollama, qwen3:8b). On-demand only, narrates a score, never decides one.",
  },
  {
    label: "WEBAPP",
    desc: "FastAPI backend, vanilla JS terminal UI, price chart, filings, connected-companies graph.",
  },
];

export function FlagshipWidget() {
  return (
    <section className="mx-auto max-w-[1240px] px-6 pt-4">
      <TiltCard max={3} className="holo-panel block">
        <Link href="/work/investment-os" className="group block">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-t-[20px] border-b border-line-terminal px-5 py-3 text-terminal-ink">
            <span className="font-mono-label text-[11px] text-terminal-ink/60">
              Investment OS: system map
            </span>
            <span className="flex items-center gap-2 font-mono-label text-[11px] text-signal">
              <span className="live-dot h-1.5 w-1.5 rounded-full bg-signal" />
              Active
            </span>
          </div>

          <div className="grid grid-cols-1 gap-0 md:grid-cols-3">
            {NODES.map((n, i) => (
              <div
                key={n.label}
                className={`relative px-5 py-6 text-terminal-ink ${
                  i > 0 ? "md:border-l md:border-line-terminal" : ""
                }`}
              >
                <span className="font-mono-label text-[11px] text-flag">{n.label}</span>
                <p className="mt-2 text-[13px] leading-relaxed text-terminal-ink/70">{n.desc}</p>
                {i < NODES.length - 1 && (
                  <span
                    aria-hidden
                    className="absolute -right-2 top-1/2 hidden -translate-y-1/2 font-mono text-[14px] text-terminal-ink/30 md:block"
                  >
                    →
                  </span>
                )}
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 rounded-b-[20px] border-t border-line-terminal px-5 py-3">
            <span className="flex flex-wrap gap-2">
              {["Python", "FastAPI", "SQLite", "yfinance", "SEC EDGAR"].map((s) => (
                <span
                  key={s}
                  className="rounded-full border border-line-terminal px-2 py-0.5 font-mono text-[10px] text-terminal-ink/60"
                >
                  {s}
                </span>
              ))}
            </span>
            <span className="link-draw font-mono-label text-[11px] text-signal">
              Read the full architecture →
            </span>
          </div>
        </Link>
      </TiltCard>
    </section>
  );
}
