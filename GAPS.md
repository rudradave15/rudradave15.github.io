# Content gaps — read before publishing

Everything the site is missing or is drafted-not-confirmed, in one place.
Per your instructions, nothing below was invented — every gap is either an
empty placeholder or content I drafted from real material (your resume,
your Investment OS project files) that needs your sign-off before it's
public.

## Blocking (site will look obviously unfinished without these)

1. ~~**Headshot**~~ RESOLVED 2026-08-20 — real photo now running through
   the dot-portrait effect in the hero (`public/rudra-dave.png`), sourced
   from the file you shared.
2. **First-person bio** — none. I deliberately did not write this in your
   voice. A few honest lines on how you think about building is enough.
3. **GitHub link** — unknown. `content/cv.json` has a `TODO` in its
   `links` array (and it's rendered as a disabled, greyed-out link in the
   footer right now).
4. **Real domain** — `app/layout.tsx` currently hardcodes
   `https://rudradave.dev` as a placeholder for `metadataBase` / OG URLs.
   Needs your actual domain before this goes live, or the OG previews and
   canonical URLs will be wrong.
5. **Case studies for 4 of 5 systems** — Investment OS is fully written
   from real project files. **OpenClaw agent systems, Brevo automation
   analytics, client-pulse-report, and Global → India Startup Radar** are
   all stubs with only the one-liner you already gave me. Each page lists
   exactly what it needs (problem, architecture, one hard decision +
   tradeoff, your specific contribution, artifacts) — see
   `content/projects/*.mdx` frontmatter `gaps` arrays, or just open the
   page, it's shown inline in ochre.

## Needs your review (drafted from real material, not invented, but not your words)

6. **Investment OS case study** (`content/projects/investment-os.mdx`) —
   written entirely from your project's own `CLAUDE.md` / `DECISIONS.md`.
   Facts are real and receipt-backed, but the "My specific contribution"
   section characterizes your role — read it and correct anything that's
   off.
7. **cv.json `headline`** — I drafted one line, flagged `TODO` in the
   file itself. Needs your sign-off or your own line.
8. **Hero copy and "What I build" section** — synthesized from your real
   skill set, not literal quotes from you. Read `components/hero.tsx` and
   `components/what-i-build.tsx` before launch.
9. **`/now` page** — placeholder only says "I'm building this site,"
   which is true today but not much of a "now" page. Needs your actual
   current focus.
10. **One seed writing post** (`content/writing/excluded-vs-gap.mdx`) — I
    wrote this from real Investment OS project notes so `/writing` had at
    least one real post (a static export needs ≥1 route param, and I
    didn't want to fake that with placeholder MDX). Read it — if the
    voice is wrong or you'd rather it not exist yet, tell me and I'll
    pull it or rewrite it in your voice.
11. **NDA caution on OpenClaw** — your resume mentions OpenClaw
    orchestration and MCP integration as part of Tatvic Analytics work
    that includes "NDA-protected initiatives." I did not pull any of that
    detail into the OpenClaw case study stub. Confirm what's actually
    clearable before I add anything beyond the one-liner you gave me in
    the brief.
12. **Employer/client work publishability** — Brevo and client-pulse-report
    both read like client or employer deliverables. Confirm they're
    actually yours to publish before I write full case studies.

## Nice-to-have, not blocking

13. **OG image is SVG, not PNG** (`public/og.svg`) — some platforms
    (notably older LinkedIn crawlers) render SVG `og:image` inconsistently.
    Works, but a rasterized PNG would be safer. I can generate one once a
    real domain/headshot exist.
14. **cv.pdf** is auto-generated from `content/cv.json`
    (`npm run cv` / runs automatically on `npm run build`) so it can never
    drift from the site — but its content inherits every gap above (no
    headline sign-off, no GitHub link, etc.).
15. **Live demo scope** — I built the in-browser demo around Investment OS
    since I had real, verifiable detail for it. The brief also named
    Startup Radar's fit-scoring as a candidate — if you'd rather that be
    the live demo, I need its real scoring logic and a small sample
    dataset.
16. **Lighthouse / device testing** — I could not get true mobile-viewport
    screenshots in this environment (window resize wasn't taking effect
    in the sandboxed browser), so 390px/768px were reviewed via the
    Tailwind responsive classes in code, not pixel-verified visually.
    Everything is built mobile-first with explicit `md:` breakpoints, but
    please spot-check on an actual phone before launch. Likewise, I didn't
    run a Lighthouse pass — recommend `npm run build && npx serve out`,
    then Lighthouse in Chrome DevTools, once real images (headshot, OG
    PNG) are in.
