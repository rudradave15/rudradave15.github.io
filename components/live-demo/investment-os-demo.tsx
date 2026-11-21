"use client";

import { useState } from "react";
import { DEMO_PROFILES, type DemoProfile, type CheckResult } from "./data";
import { Gauge } from "@/components/effects/gauge";
import { CountUp } from "@/components/effects/count-up";

const TIER_COLOR: Record<DemoProfile["tier"], string> = {
  Strong: "#8FD19E",
  Watch: "#D8C078",
  Weak: "#E48A8A",
};

const RESULT_LABEL: Record<CheckResult, string> = {
  pass: "PASS",
  fail: "FAIL",
  gap: "GAP",
};

const RESULT_COLOR: Record<CheckResult, string> = {
  pass: "text-[#8FD19E]",
  fail: "text-[#E48A8A]",
  gap: "text-[#D8C078]",
};

export function InvestmentOsDemo() {
  const [selected, setSelected] = useState<DemoProfile | null>(null);
  const [loading, setLoading] = useState(false);

  function run(profile: DemoProfile) {
    setLoading(true);
    setSelected(null);
    window.setTimeout(() => {
      setSelected(profile);
      setLoading(false);
    }, 550);
  }

  return (
    <div className="holo-panel">
      <div className="flex items-center justify-between rounded-t-[20px] border-b border-line-terminal px-5 py-3">
        <span className="font-mono-label text-[11px] text-terminal-ink/60">
          Investment OS: single-stock readout
        </span>
        <span className="flex items-center gap-1.5 font-mono-label text-[10px] text-flag">
          <span className="live-dot h-1.5 w-1.5 rounded-full bg-flag" />
          Sample data · offline demo
        </span>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-line-terminal px-5 py-4">
        {DEMO_PROFILES.map((p) => (
          <button
            key={p.id}
            onClick={() => run(p)}
            className={`rounded-full border px-3 py-1.5 font-mono text-[12px] transition-colors ${
              selected?.id === p.id
                ? "border-signal text-signal"
                : "border-line-terminal text-terminal-ink/80 hover:border-terminal-ink/40"
            }`}
          >
            {p.ticker}
          </button>
        ))}
      </div>

      <div className="min-h-[280px] px-5 py-6">
        {!loading && !selected && (
          <p className="font-mono text-[13px] text-terminal-ink/50">
            Pick a sample ticker above and it&apos;ll run through the same
            rule set the real engine uses. No API keys, no network calls.
            The live version pulls yfinance and SEC EDGAR for real.
          </p>
        )}

        {loading && (
          <div className="flex items-center gap-2 font-mono text-[13px] text-terminal-ink/60">
            <span className="inline-block h-3 w-3 animate-pulse rounded-full bg-signal" />
            Scoring against rule set…
          </div>
        )}

        {!loading && selected && (
          <div>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="font-display text-[22px] font-semibold">
                  {selected.ticker}{" "}
                  <span className="font-mono text-[13px] font-normal text-terminal-ink/60">
                    {selected.name}
                  </span>
                </p>
                <p className="mt-1 font-mono-label text-[11px] text-terminal-ink/50">
                  {selected.sector}
                </p>
              </div>
              <div className="relative flex h-24 w-24 items-center justify-center">
                <Gauge value={selected.score} color={TIER_COLOR[selected.tier]} />
                <div className="absolute flex flex-col items-center">
                  <span className="font-mono text-[22px] font-medium leading-none">
                    <CountUp value={selected.score} />
                  </span>
                  <span className="mt-1 font-mono-label text-[9px] text-terminal-ink/50">
                    {selected.tier.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-3 border-y border-line-terminal py-4 font-mono text-[12px]">
              <div>
                <p className="text-terminal-ink/50">Action</p>
                <p className="mt-1 text-signal">{selected.action}</p>
              </div>
              <div>
                <p className="text-terminal-ink/50">Conviction</p>
                <p className="mt-1">{selected.conviction}</p>
              </div>
              <div>
                <p className="text-terminal-ink/50">Confidence</p>
                <p className="mt-1">{Math.round(selected.confidence * 100)}% coverage</p>
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-3">
              {selected.checks.map((c) => (
                <div key={c.label} className="flex gap-3 font-mono text-[12px]">
                  <span className={`w-10 shrink-0 ${RESULT_COLOR[c.result]}`}>
                    {RESULT_LABEL[c.result]}
                  </span>
                  <div>
                    <p className="text-terminal-ink">
                      {c.label}{" "}
                      <span className="text-terminal-ink/40">[{c.tier}]</span>
                    </p>
                    <p className="mt-0.5 text-terminal-ink/55">{c.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
