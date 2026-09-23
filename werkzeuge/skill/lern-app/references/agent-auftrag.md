# Brief for a sub-agent that builds competency slices

Sub-agents do not see the conversation. Fill the brackets and send the whole block. Keep one agent per app; parallelise across apps, not within one (shared files: `app.config.js`, `llms.njk`, `tutor.njk`). Every agent works in its own git worktree of the monorepo, on its own branch.

When agents run in parallel, give each its own port (8080, 8081, 8082, … — never the same port for all) and its own browser context; otherwise one agent tests the other's app or kills its server.

```
Build competency slices for the app src/<app>/ in the monorepo lernapps/lernapps.github.io
(main checkout: ~/projects/lern-apps — do NOT check out branches there, other agents use it).

Set up your own worktree and work only there:
  git -C ~/projects/lern-apps fetch
  git -C ~/projects/lern-apps worktree add ../lern-apps-<app>-<slice> -b <branch> origin/main   # or: existing branch <branch>
  cd ~/projects/lern-apps-<app>-<slice> && npm ci
Set the git identity: <name / email from the user's CLAUDE.md>.

Read CLAUDE.md first ("New competency in an existing app") and follow it exactly. Reference implementation:
src/binom/, page <id>.md with js/aufgaben/<id>.js and js/vis/<id>.js (closest to what you build).

Conventional Commits, add files by name (never git add -A / git add .), `npm test && npm run build` green before
every commit, push the branch at the end. <No PR, no merge. | Open a PR to main with gh pr create; do not merge.>

Competencies (in this order):
1. id <id>, Titel "<Titel>", Menü "<kurz>", kartenKnoten [<node id>] (Mathe only)
   - Rule/formula: <…>
   - Exercise types: <…>, URL parameters (URL_ZAHLEN / URL_TEXTE): <…>
   - Typical mistakes to detect (fehler ids): <…>
   - Field types: zahl (art, stellen; zahlenfeld/pruefeZahlAntwort/passtZu) | bruch/term |
     variablenterm (form: ausmultipliziert | faktorisiert) | auswahl | radio | tabelle
   - Picture: <…>
   - Video: <id + exact title + channel, verified via oEmbed> | none → ohneVideo: "<one-line note>"
   - serlo: <url + exact title, verified with curl (200, article, covers the competency)> | none → leave `serlo` out
2. …

Per competency, test-first: src/<app>/test/<id>.test.js (see it fail) → js/aufgaben/<id>.js → js/vis/<id>.js
(svgEl only, never document) → entry in KOMPETENZEN → <id>.md (front matter only) → llms.njk (page section +
parameter table row, {{ app.basisUrl }}, never a literal URL) → tutor.njk (checklist line).
Menü text is a formula or keyword, never an ordinal ("1. Formel"): the menu numbers itself.
For factorising tasks check the product structure yourself; form "faktorisiert" only checks coarsely.
Every URL parameter and fehler id in llms.njk/tutor.njk must exist in the generator/checker, and vice versa.
Never write ?v= into sources; the build adds ?v=<content hash> to every import.

Serve with `npx @11ty/eleventy --serve --port=<your port>` (your port: <8080+n>; the package is installed by
npm ci) and remember its PID; use your own browser context. Verify with Playwright at 360 px and 1280 px: each new
page with JS off (text + picture), one correct + one wrong answer, Lösung zeigen/verbergen, a deep link with
nr=, Schnelltest, zero console errors, zero external requests before a video click.
Stop your server with `kill <PID>` — never `pkill -f`, it hits other agents' servers. Delete temp files and
screenshots.

Budget: stop and report if a slice needs a change in src/kern/ — that is a separate commit or PR, decided by me.

Report: branch, commits, per competency the URL parameters and fehler ids, what you verified, open points.
```
