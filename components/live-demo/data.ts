// Sample data, bundled locally. This is NOT live output from Investment OS.
// It's a frozen, fictional readout shaped like the real Assessment model
// (core/models.py: Metric / Check / Gap / Assessment) so the interaction
// can be tried in-browser with zero API keys and zero network calls.
// The real system pulls yfinance + SEC EDGAR live and never invents a number.

export type CheckResult = "pass" | "fail" | "gap";

export type Check = {
  label: string;
  tier: "critical" | "high" | "medium" | "supporting" | "informational";
  result: CheckResult;
  detail: string;
};

export type DemoProfile = {
  id: string;
  ticker: string;
  name: string;
  sector: string;
  tier: "Strong" | "Watch" | "Weak";
  score: number;
  confidence: number; // coverage, 0-1
  conviction: "Very High" | "High" | "Moderate" | "Low" | "Insufficient Confidence";
  action: "Buy More" | "Hold" | "Reduce" | "Watch";
  checks: Check[];
};

export const DEMO_PROFILES: DemoProfile[] = [
  {
    id: "demo-a",
    ticker: "DEMOX",
    name: "Demo Corp (fictional)",
    sector: "Industrials",
    tier: "Strong",
    score: 82,
    confidence: 0.91,
    conviction: "High",
    action: "Hold",
    checks: [
      {
        label: "Debt / equity",
        tier: "critical",
        result: "pass",
        detail: "0.34 vs. sector-scoped ceiling 0.60. Passes with margin.",
      },
      {
        label: "Free cash flow, trailing 4Q",
        tier: "critical",
        result: "pass",
        detail: "Positive for 4/4 quarters, coverage ratio 2.1x.",
      },
      {
        label: "Insider transactions, 6mo",
        tier: "high",
        result: "pass",
        detail: "Net-buy cluster from 2 officers, Form 4. A validated evidence source.",
      },
      {
        label: "Revenue concentration",
        tier: "medium",
        result: "gap",
        detail: "No reliable structured source for customer concentration. Honest Gap, not scraped or guessed.",
      },
      {
        label: "PEG (computed, not provider field)",
        tier: "supporting",
        result: "pass",
        detail: "1.4, inside sector band. Computed from raw growth/earnings fields; provider's own pegRatio field is not trusted.",
      },
    ],
  },
  {
    id: "demo-b",
    ticker: "SMPLY",
    name: "Sampleworks Ltd. (fictional)",
    sector: "Financial Services",
    tier: "Watch",
    score: 54,
    confidence: 0.62,
    conviction: "Insufficient Confidence",
    action: "Watch",
    checks: [
      {
        label: "Debt / equity",
        tier: "critical",
        result: "gap",
        detail: "Excluded for this sector (leverage reads differently for financials). A structural exclusion, not a failed check, and it caps Conviction at a hard floor regardless of what else passes.",
      },
      {
        label: "Free cash flow, trailing 4Q",
        tier: "critical",
        result: "fail",
        detail: "Negative in 2/4 quarters, coverage ratio 0.6x.",
      },
      {
        label: "Insider transactions, 6mo",
        tier: "high",
        result: "gap",
        detail: "No Form 4 activity in window. Absence of evidence, not treated as a signal either way.",
      },
      {
        label: "13F institutional flow",
        tier: "medium",
        result: "pass",
        detail: "Net-add across tracked managers, most recent quarter.",
      },
    ],
  },
];
