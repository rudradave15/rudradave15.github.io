# DESIGN.md — Rudra Dave / personal site

Single source of truth for the visual and motion system. If code and this
file disagree, this file wins — fix the code.

**Direction: "Signal, not gradient."** v1 (light parchment + blue) read as
flat and generic. v2 (dark + cyan/magenta gradient glow, a rotating 3D
orb) read as the exact template every AI page builder defaults to right
now, gradient-on-black is the new "stock photo of a handshake." v3 drops
gradients and soft glow entirely: flat, near-black base, one acid-lime
accent, one flat red-orange for receipts and live-status, hard offset
shadows instead of blur, monochrome technical diagrams instead of colored
neon, and a chromatic-glitch effect (built from the site's own two
accents, not literal RGB) as the one signature motion move instead of a
rotating hologram. Restraint is still the baseline; the two accent colors
are what's allowed to be loud, and only in their assigned roles.

## Color tokens

Defined once in `app/globals.css` as CSS custom properties, then mapped into
Tailwind v4 via `@theme inline`. Never hardcode a hex value in a component,
reference the token. No gradients on color tokens anywhere in the system;
every fill is flat.

```
--paper      #0A0A0A   page base, near-black
--paper-2    #171717   raised surfaces, table stripes
--ink        #F5F5F0   primary text, off-white
--ink-muted  #8A8A82   secondary text, labels
--signal     #D7FF3D   the one interactive accent: links, focus rings, active states
--flag       #FF3B1F   provenance chips AND live/status micro-signals, nowhere else
--terminal   #000000   true black, the demo/footer sections
--terminal-2 #111111   terminal raised surface
--terminal-ink #F5F5F0 text on --terminal
--line       rgba(245,245,240,.14)   hairline rule color
```

Rule: exactly two accent colors exist. `--signal` (lime) is every
interactive/informational accent. `--flag` (red-orange) is reserved for
receipts and "this is live" micro-signals, never a generic accent, button,
or link color. If a third accent color shows up anywhere, that's a bug,
not a design decision.

## Type

```
Display   Bricolage Grotesque   600/700, tight tracking (-0.01em to -0.02em)
                                H1/H2 only. Never body text.
Body      Inter                 400/500, 17px base, 68ch max measure, 1.6 line-height
Utility   JetBrains Mono        500, uppercase, letter-spacing .04em–.08em
                                nav, labels, numbers, tags, receipts, table headers,
                                status pills, dates
```

Loaded via `next/font/google` with `display: "swap"` and subset to `latin`.
If Bricolage Grotesque ever feels too loud in-browser, the fallback is
**Instrument Serif** for display — never fall back to Inter for headings,
that erases the personality and makes the site look like a template.

Font stacks always carry real fallbacks (system-ui / ui-monospace) so a
slow font load never produces invisible text (`font-display: swap` handles
this at the CSS level too).

## Layout

- 12-column grid, 1240px max width, hard left alignment. No centered hero,
  no centered section headers.
- Hairline rules (`1px solid var(--line)`) as the only structural divider —
  no drop shadows, no card borders unless it's a receipt chip.
- Radii: 4px on surfaces (panels, images, code blocks). 999px on chips
  only. No soft blobby cards, no glassmorphism.
- Vertical rhythm: 128px between major sections on desktop, 72px on
  mobile. Defined as Tailwind spacing tokens `section` (128) / `section-sm` (72).
- No `01 / 02 / 03` step numbering unless content is a genuine sequence
  (it mostly isn't here). Use year markers, status labels, stack tags —
  they carry real information instead of decorative sequencing.

## Signature elements

**0. Hero frame: grain, ghost type, HUD ticks, status readout.**
Reference points: bleibtgleich.dev's oversized ghost typography bleeding
off screen edges (huge, ~5% opacity, first/last name split left/right),
Omnira's film-grain texture and bracket-corner HUD framing. Adapted, not
copied: `body::before` is a fixed, fullscreen feTurbulence noise tile at
4.5% opacity (`mix-blend-mode: overlay`), the hero has all four
`.tick-*` corners instead of two, and a full-bleed ghost "RUDRA" / "DAVE"
sits behind the hero content (`components/hero.tsx`, break-out-of-container
trick via `left-1/2 right-1/2 -mx-[50vw] w-screen`, not literal edge
positioning, so it still clips inside the section's `overflow-hidden`).
The bottom status row (`● Status: N systems shipped`, count pulled live
from `getAllProjects().length`, never hardcoded) replaces what would
otherwise be an unverifiable "available for hire" claim.

**1. Receipt system** — every factual claim gets a small mono chip in
`--flag`. Click (or Enter/Space when focused) slides in a right-side panel
with the actual evidence: repo path, endpoint name, screenshot, date range,
commit. Keyboard accessible (`role="button"`, focusable, `Escape` closes,
focus returns to the trigger chip on close). Panel is an `aside` with
`aria-live="polite"` region for the content swap, backdrop click also
closes.

**2. Systems index** — flagship work presented as a dense table, not a card
grid: `SYSTEM / DOMAIN / STACK / STATUS / YEAR`, mono uppercase headers,
hairline row rules, no zebra shadows (paper-2 stripe only). Row hover
expands in place (height auto-animate, GSAP) to show a one-line summary +
"open case study" — click anywhere in the row routes to `/work/[slug]`.

**3. Live demo** — one real, working, client-side demo on a canned local
dataset. No API keys in the client, ever. Explicitly labeled as sample
data so it never reads as a live/invented claim. Runs inside a flat black
panel with a hard lime offset shadow (`.holo-panel`, `box-shadow: 6px 6px
0 var(--signal)`, no blur, no gradient) over a monochrome particle-network
background, so the one section that invites touching still reads as
"instrument," not "hologram."

**4. A cursor-reactive 3D object in the hero** — a wireframe icosahedron
(three.js), mostly desaturated white/gray with a single flat-lime
wireframe core, auto-rotating, that leans toward the pointer. It's
decorative, not a data visualization, so it never claims anything, and
it's monochrome-plus-one-accent rather than a colored glowing orb, which
is its own overused AI-hero cliché now.

**5. 3D tilt + spotlight on interactive surfaces** — systems-index rows
and the "what I build" cards tilt subtly toward the cursor (small angle,
2.5–5°) and get a soft radial highlight that follows the pointer. Applied
narrowly — table rows and cards only, never body text or nav.

**6. Chromatic glitch** — `components/effects/glitch-text.tsx`. Fires once
(hero headline's last line, ~950ms after load) via two mistimed duplicate
text layers colored `--signal` and `--flag`, `mix-blend-mode: screen`,
clipped and offset then resolved. Not literal RGB red/cyan split, built
from the site's own two accents so it reads as "this site's signature,"
not "generic glitch effect." Fully removed under reduced motion.

Everything else on the page stays quiet so these six land.

## Motion

One orchestrated page-load, then restraint everywhere else.

- **Load** (GSAP timeline, `power3`/custom ease, home page only): hero
  headline sets in a staggered mask-up reveal (~40ms stagger per word,
  ~600ms per element), the hairline rule under the hero draws left-to-right,
  then systems-index rows fade/slide in sequentially (60ms stagger).
- **Scroll** (GSAP ScrollTrigger + Lenis for smooth scroll): section
  kicker labels pin briefly at the top of their section then release;
  systems-index rows and writing-index rows reveal once on enter
  (`toggleActions: "play none none none"` — never replay on scroll back up,
  that reads as gimmicky).
  Lenis is used only for scroll smoothing — it's not decorative, it just
  makes ScrollTrigger's pinning/reveal math consistent. Disabled entirely
  under reduced motion (native scroll takes over).
- **Hover**: index row expansion, receipt chip background, link-underline
  draw, 3D tilt + spotlight on cards/rows, count-up numbers on scroll into
  view. 150–200ms for discrete transitions, `ease-out`.
- **Cursor**: a soft signal-colored glow trails the pointer site-wide
  (`components/effects/cursor-glow.tsx`, `gsap.quickTo`), off entirely on
  touch devices (`pointer: coarse`) and under reduced motion.
- **Reduced motion**: `prefers-reduced-motion: reduce` disables every
  animation — GSAP timelines are skipped entirely (`gsap.set` to end-state
  instead of `.to`/`.from`), ScrollTrigger reveals render content visible
  by default, Lenis is not initialized, the hero 3D object and vanta
  network background never mount, cursor glow never mounts, ordinary
  anchor/native scroll takes over. This is a hard branch in
  `lib/motion.ts` (`prefersReducedMotion()`), checked at the top of every
  effect component before any GSAP/three.js/vanta code runs.

Everything above is deliberate and scoped to a named component — the
rule isn't "no motion," it's "every motion has a job and a component that
owns it." No parallax on scroll, no marquees, no on-load confetti, no
per-word scroll-jacking outside the hero, no motion with no component
behind it. Scattered, purposeless animation is the tell of an AI-generated
portfolio — motion with a clear owner and a reduced-motion fallback is
the actual signal of craft, not the absence of motion.

## Components → tokens map

| Component | Rule |
|---|---|
| Nav | mono uppercase, 4 items max, hairline bottom border, `--signal` on active/hover |
| Systems index | mono headers, `--paper-2` row stripe, hairline rules, no shadow |
| Receipt chip | mono, `--flag` text on transparent, 999px pill, hairline `--flag` border at 40% opacity |
| Receipt panel | `--paper` surface, hairline left border, `--terminal`-weight header bar |
| Case study | `--signal` for section-nav active state, code blocks on `--paper-2` |
| Live demo | lives on `--terminal` / `--terminal-ink`, mono throughout, `--signal` for interactive affordances |
| Buttons/links | underline draw on hover, `--signal`, no filled pill buttons anywhere |
| Focus ring | `2px solid var(--signal)`, `2px` offset, visible on every interactive element, never removed |

## Non-negotiables

- No invented copy, metrics, or logos. A missing section is a visible TODO
  in dev, never filled with placeholder marketing language.
- No centered hero, no big-number-with-tiny-label template.
- `--flag` is reserved for receipts. `--pulse` is reserved for live/status
  micro-signals. `--signal`/`--signal-2` are the interactive accents
  everywhere else.
- Every effect component (`components/effects/*`) checks
  `prefersReducedMotion()` before doing anything — no exceptions, even for
  "just a glow."
