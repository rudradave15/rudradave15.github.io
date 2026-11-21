@AGENTS.md

## Security rules

This repo is public and deploys to https://rudradave15.github.io via GitHub Pages
(static export, no server, no database, no auth). Keep it that way unless the owner
explicitly decides otherwise.

- **No secrets, ever.** Nothing goes in source, `content/`, `public/`, or any
  `NEXT_PUBLIC_*` variable that isn't meant for every visitor. Everything in the
  built `out/` folder is public. `.env*` stays in `.gitignore`.
- **If a secret is ever committed, rotate it at the provider first.** Deleting the
  file or commit is not enough.
- **Before every push:** run `git status`, scan staged files and the built `out/`
  for keys (`sk-`, `sk_live_`, `AKIA`, `AIza`, `ghp_`, `service_role`, `PRIVATE KEY`),
  personal data (phone, address, IDs, financial files) and local paths (`C:\Users\...`).
- **No personal or financial data** in the repo. Holdings, broker files, ID
  documents and anything under NDA (Tatvic internals) never get published.
- **CSP stays on.** `app/layout.tsx` ships a Content-Security-Policy meta tag that
  blocks third-party scripts/styles/fonts. Don't add external CDNs, analytics or
  embeds without asking; if one is approved, add only its exact origin to the CSP.
- **No `dangerouslySetInnerHTML`, `innerHTML`, `eval` or `new Function`.** MDX in
  `content/` is trusted, owner-written content only; never render MDX from user input.
- **Adding a backend later** (API route, form, login, database, LLM call) means a new
  security review first: server-side auth on every handler, schema validation,
  rate limits, owner-scoped DB policies, and secrets only on the server.
- **Dependencies:** don't add a package without telling the owner its name, weekly
  downloads and repo link. Keep `npm audit` at 0 high/critical; CI fails on high.
  Lockfile stays committed.
- **GitHub Actions** stay pinned to full commit SHAs with least-privilege
  `permissions`.
- **Dev server** binds to `127.0.0.1` only (`npm run dev`). Don't expose it on the LAN.
- **Never run anything against production**, and never run destructive commands
  without asking. Security fixes go on a branch, one small commit per issue, and
  nothing is called fixed until a command or test shows it.
