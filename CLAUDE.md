# Lern-Apps (Monorepo) – instructions for AI agents

All learning apps (Mathe, Physik, Chemie; about 20 per school year) and later the Mathe-Karte live in this one
repository: one shared kern, one layout, one build (Eleventy 3.1.6), deployed to GitHub Pages at
`https://lernapps.github.io/`. The old single-app repos (`raifdmueller.github.io/*-trainer`, `mathe-karte`,
`lern-app-template`) were deleted on 23.09.2026: never link to them or rely on them.

## Project rules
- Output is static HTML. Every page is fully readable without JavaScript – text AND picture. JS only powers exercises,
  checking, the test, self-assessment and the interactive redraw of pictures. Vanilla ES modules, no framework.
- No external requests before the learner clicks a video card; then only youtube-nocookie.com (two-click embed in
  `src/kern/js/video.js`). No CDN, no web fonts, no analytics, no cookies. localStorage only for self-assessment, the
  last test result and the video preference, always wrapped in try/catch.
- Mature libraries only. Eleventy is pinned exactly (`npm install --save-dev --save-exact @11ty/eleventy@<version>`);
  never run `npx eleventy` without the installed package (use `npm run build`).
- Mobile-first (360 px), WCAG-friendly, `lang="de"`, German UI, German domain terms in identifiers (Ubiquitous
  Language), English for generic structure.
- Every file under 500 lines (the build fails otherwise). SOLID, DRY, KISS.
- TDD: write the test first, see it fail, implement, see it pass. `npm test` and `npm run build` green at every commit.
  Conventional Commits, small steps, add files by name (never `git add -A` / `git add .`), feature branches.
- URL parameters, anchors and `seed`/`nr` are a public contract used by the AI tutor: document every change in the
  app's `llms.njk`, never rename existing ones. `tutor.njk` is the learner-facing prompt; under 120 lines, German.
- Verify UI changes in a browser (Playwright) before reporting them done: without JS (text + picture visible),
  360 px and 1280 px, zero console errors, zero external requests before the video click.
- Browser tests (`e2e/`, Playwright + axe-core, #26) automate most of that check in the `browser` workflow. Run them
  locally with `npm run build && npm run test:browser` (once: `npx --package=@playwright/test playwright install
  chromium`; never `npx playwright`). They derive the page list from `lib/apps.js`, so new apps are covered.

## Layout of the repository
- `src/_data/site.js` – THE one place holding the base URL. `lib/adressen.js` derives pathPrefix, canonicals, app
  URLs, repository and source links from it. Moving the repo (e.g. into an organisation) means changing one line.
  Keep a single default export (Eleventy reads data files with named exports differently).
- `src/kern/` – the generic kern, shipped once at `/kern/` (`js/`, `css/stil.css`, `vendor/talkitover.js`). Apps
  import it relatively (`../kern/js/seite.js` from a page, `../../../kern/js/zahlantwort.js` from `js/aufgaben/`). No
  symlinks, no copies per app. The kern NEVER imports an app configuration: pages pass `APP`, `KOMPETENZEN` and
  generators in (`starteSeite`, `starteStartseite`, `starteTestseite`, `erzeugeSpeicher(praefix)`,
  `initVideos(praefix)`) – Dependency Inversion.
- `src/<app>/` – one folder per app: `js/app.config.js` (APP + KOMPETENZEN), `<id>.md` per competency,
  `js/aufgaben/<id>.js` (generator + checker), `js/vis/<id>.js` (picture), `test/<id>.test.js`, `llms.njk`,
  `tutor.njk`, `<app>.11tydata.js` (one line), `favicon.svg`, `icon-192.png`, `icon-512.png`,
  `apple-touch-icon.png`, optional `css/<app>.css`.
- `src/_includes/basis.njk` (head, menu with number badges, footer with site version, subject colour) and
  `kompetenz.njk` (Warum / Regel / Beispiel / Bild / Video / Übung from front matter). `src/start.njk`,
  `src/test.njk` and `src/manifest.njk` paginate over all apps; `src/index.njk` and `src/llms.njk` are the overview.
- `src/karte/` – the Mathe-Karte at `/karte/` (not an app: no `app.config.js`). Curriculum data as flat-front-matter
  Markdown in `src/karte/daten/` (ignored as pages, read by `karte.11tydata.js` → `lib/karte/laden.js`; data model in
  `src/karte/daten/README.md`). Pages are static (`index`, `karte-statisch`, `apps`, `laender`, `ueber`, `llms.txt`,
  `data.json`); `js/start.js` turns the static list into the interactive map. URL parameters `land`, `jahrgang`,
  `leitidee`, `luecken`, `knoten` and the shape of `data.json` are a public contract (`src/karte/llms.njk`).
- An app appears on the map when its config has `APP.kartenEintrag` (edugo fields: `aktiv-level`, `backend`,
  `external-requests`, `dsgvo`, `evidence`, `jahrgaenge`, `lizenz`, `stand`) and competencies carry `kartenKnoten: [<node
  id>]`. Unknown node ids fail the build. Apps outside the repo: `src/karte/daten/externe-eintraege.js`.
- `lib/` – build-time Node code: `apps.js` (loads every `src/*/js/app.config.js`), `bild.js` (static SVG),
  `fachfarben.js`, `versionierung.js`, `pruefungen.js`, `adressen.js`, `app-daten.js`.
- `werkzeuge/skill/lern-app/` – the Claude skill that turns a curriculum topic into a new app here (workflow around
  this file: worktree, competencies, videos, PR). Outside `src/`, so Eleventy ignores it; the line limit still applies.
  Install: `ln -s <repo>/werkzeuge/skill/lern-app ~/.claude/skills/lern-app`.
- `test/kern/`, `test/build/`, `test/apps/` (generator contract for every competency of every app) and
  `src/<app>/test/`.
- `src/docs/`, `src/site/`, `docToolchainConfig.groovy`, `dtcw`, `scripts/dtc-v4.sh` – architecture docs (see
  "Architecture").

## Build rules (enforced by `npm run build`)
- The required check `test-und-build` (`pruefen.yml`) also runs `npm audit --audit-level=high` and `npm run lint`
  (ESLint flat config: `no-eval`, `no-implied-eval`, `no-unsanitized` against T-003). Never set `innerHTML`; build DOM.
- `npm run typecheck` (`tsc --checkJs`, `strict`, `jsconfig.json`) checks `src/kern/js` only, also in the required check.
  Type kern code with JSDoc (`@param`, `@returns`, `@typedef`); cast with `/** @type {…} */ (x)` only where the DOM or a
  contract guarantees more than tsc can see, and say why in a comment.
- After writing `_site`, `eleventy.config.js` runs `lib/pruefungen.js`: no external resources in HTML, no external
  imports in JS/CSS, every source file under 500 lines, per competency `<id>.md` + generator + `test/<id>.test.js`,
  the app's `llms.txt` mentions every page. Any violation fails the build.
- Tutor link allowlist (ADR-023, `pruefeTutorLinks`): `tutor.md` and `llms.txt` of every app, the root `llms.txt` and
  `karte/llms.txt` may link only to relative targets, `https://lernapps.github.io/`, the own repository,
  `https://de.serlo.org/` and `https://www.youtube.com/watch?v=`. Any other URL fails the build. These files are
  prompts in a child's chat; widen the allowlist only with an ADR.
- The tutor contract (`lib/llms-vertrag.js`, TD-3): every deep link in an app's `llms.txt` and `tutor.md` must hit an
  existing page and anchor, use only parameters the generator exports (`URL_ZAHLEN`, `URL_TEXTE`, plus `seed`/`nr`;
  `test.html`: `nr`, `seed`, `modus`), and each value must change the task (a default is fine if another documented
  value, e.g. from `zuege=2|3`, changes it for every task number). Every generator parameter must appear in the page's
  `###` section, the `## URL-Parameter …` section or the page's row in the parameter table; that row may name only
  accepted parameters.
- Cache busting: the build appends `?v=<hash over all shipped JS/CSS>` to every local import, `<script src>` and
  stylesheet. Never write `?v=` in sources. The footer shows the site version from `package.json`; bump it
  (SemVer) on user-visible changes.
- Pictures: the same drawing function renders the static SVG at build time (mini DOM in `src/kern/js/svg.js`) and
  redraws it in the browser. Use `svgEl` from `svg.js`; never touch `document` in `js/vis/`. No hand-drawn SVGs.
- Subject colour: `APP.fach` selects the colour from `lib/fachfarben.js` (mathe `#1d4ed8`, physik `#c2410c`,
  chemie `#6d28d9`, biologie `#15803d`, informatik `#0f766e`); white text meets WCAG AA. Unknown subject = build error.
- Numeric answers follow one rule (`src/kern/js/zahlantwort.js`): declare `art` and, if needed, `stellen`; build
  fields with `zahlenfeld`, check with `pruefeZahlAntwort`, diagnose with `passtZu`. No per-call tolerances.

## New competency in an existing app
1. Test first: `src/<app>/test/<id>.test.js` for the generator (and pure helpers); see it fail.
2. `src/<app>/js/aufgaben/<id>.js`: `erzeugeAufgabe(zufall, vorgaben)` and `pruefeAntwort(aufgabe, antworten)`,
   optional `URL_ZAHLEN`, `URL_TEXTE`, `testVorgaben`. `test/apps/vertrag.test.js` checks it automatically.
3. Picture: `src/<app>/js/vis/<id>.js` exporting `zeichne…(svg, aufgabe, ergebnis)`.
4. Add the entry to `KOMPETENZEN` in `src/<app>/js/app.config.js` (`id`, `titel`, `kurz`, `seite: "<id>.html"`,
   `generator: "./aufgaben/<id>.js"`). Menu, checklist, test and overview pick it up.
5. `src/<app>/<id>.md` with front matter only: `kompetenz`, `beschreibung`, `warum`, `regel`, `beispiel` (Markdown or
   HTML), `video: { id, titel, kanal, hinweis? }` (`hinweis`: one optional sentence shown in the video box) or, for several videos, `videos: [{ ueberschrift, id, titel, kanal, hinweis? }]` (one card `#video-1`, `#video-2` … each under „Video dazu“), or without a video either `videoVerweis` (one learner-facing sentence linking a related page's `#video`) or nothing (no video section; see `werkzeuge/skill/lern-app/references/videos.md`), optional `serlo: { url, titel }` (a verified `https://de.serlo.org/…` article, rendered as a plain link after the video; the build rejects other hosts), `bild: { text, funktion, seed, geloest, vorgaben, uebung, uebungFunktion }` (`text` describes the example only – the picture never changes; the exercise draws its own picture captioned "Bild zur Aufgabe Nr. N", `uebung` is an optional extra sentence for that caption; `uebungFunktion` optionally draws the exercise picture with a different function from the same module).
6. Document page, URL parameters and deep links in `src/<app>/llms.njk` (use `{{ app.basisUrl }}`, never a
   literal URL); mention it in `tutor.njk` if the tutor should send learners there.
7. `npm test && npm run build`, then check the page in the browser.

## New app
1. `src/<pfad>/js/app.config.js` with `APP = { id, pfad, titel, kurzname, fach, klasse, beschreibung, intro }` and
   `KOMPETENZEN`. `id` is the localStorage prefix – never change it after launch. `pfad` equals the folder name.
2. `src/<pfad>/<pfad>.11tydata.js`: `import { appDaten } from "../../lib/app-daten.js"; export default appDaten("<pfad>");`
3. Icons (`favicon.svg`, `icon-192.png`, `icon-512.png`, `apple-touch-icon.png`) in the subject colour.
4. `llms.njk` and `tutor.njk` (front matter: `permalink: "{{ page.filePathStem }}.txt"` resp. `.md`,
   `layout: false`, `eleventyExcludeFromCollections: true`); copy `src/binom/` as the pattern.
5. Add competencies as above. Start page, test page, manifest, overview entry and root `llms.txt` come for free.

## Build, test, deploy
- `npm ci`, `npm test`, `npm run build` (output `_site/`), `npm run serve` (dev server under `/lern-apps/`).
- `.github/workflows/pruefen.yml`: test + build on every push and PR. `.github/workflows/pages.yml`: on push to
  `main`, test + build, then build the arc42 docs (`scripts/dtc-v4.sh generateSite`), copy them to `_site/docs/` and
  deploy both as ONE artifact via `actions/upload-pages-artifact` + `actions/deploy-pages`. A repo named
  `<org>.github.io` gets Pages auto-enabled in legacy branch mode; switch it once to source "GitHub Actions" with
  `gh api -X PUT repos/<owner>/<repo>/pages -f build_type=workflow` (POST fails because Pages already exists).

## AI review before every merge (#24, ADR-027)
- Before a PR is proposed for merge, a reviewer in a FRESH context (sub-agent or new session, not the author;
  ideally another model) runs `werkzeuge/review/ki-review.md`: Fagan-style checklist (correctness, tests trace to
  the issue, OWASP incl. `innerHTML`/`eval`/external requests/tutor-link allowlist, static first, privacy, teacher
  voice and maths, ADR/docs/version). The author never writes the verdict.
- The reviewer posts a PR review (type comment) starting with `## KI-Review`, with the lines `Stand: <head SHA>` and
  `Ergebnis: freigegeben` or `Ergebnis: Änderungen nötig`, and the findings. Unfixed findings get a reason in the PR.
- The check `ki-review` (`.github/workflows/ki-review.yml`, read-only token, no LLM call) is green only if the newest
  such review from `raifdmueller` came after the last commit and names the head SHA. Every new commit needs a new review.

## Architecture
- arc42 documentation (German) lives in `src/docs/arc42/` (chapters in `chapters/`, ADRs in `chapters/_adr-*.adoc`,
  index in chapter 9); theme overrides without CDN resources in `src/site/`; config `docToolchainConfig.groovy`.
  Eleventy ignores `src/docs/` and `src/site/`. Live at `https://lernapps.github.io/docs/`.
- Build locally: `scripts/dtc-v4.sh generateSite` (docToolchain v4 pinned to `main-4.x@6de96fb7`, needs Java 17 and
  Graphviz; first run clones and builds docToolchain). Output: `build/microsite/output/` (git-ignored). Check nav,
  chapter pages, rendered diagrams and links there before pushing.
- Every decision about the kern, the layout, the build, deployment or a new dependency needs an ADR in chapter 9
  (Nygard, Pugh matrix against QZ-1…QZ-5, consequences naming risk IDs from chapter 11). Superseded ADRs stay in the
  index with status "Superseded by ADR-0xx". Diagrams: PlantUML with `!include <C4/...>`, never a URL.
- Inter-page links: `xref:NN_file.adoc#anchor[]`, never `link:foo.adoc[]`.

## Risk Radar Assessment

_Assessed on 2026-09-24 against the Vibe-Coding Risk Radar (https://llm-coding.github.io/vibe-coding-risk-radar/), confirmed by the Product Owner_
_Architecture Decision: See [ADR-023](src/docs/arc42/chapters/_adr-risiko.adoc) (arc42 chapter 9)_

### Module: lernapps.github.io

**LLM Runtime Integration:** L0 (No LLM) — no LLM SDK in the code; the external claude.ai tutor (loads `tutor.md`) is effectively L2 (Generate) but runs outside the repo and does not raise the tier

| Dimension        | Score | Level                  | Evidence                                                                 |
| ---------------- | ----- | ---------------------- | ------------------------------------------------------------------------ |
| Code Type        | 2     | Business Logic         | term parser and rounding in `src/kern/js/`, generators and checkers per app |
| Language         | 2     | Dynamically typed      | JavaScript ES modules; `tsc --checkJs` only for `src/kern`               |
| Deployment       | 2     | Public-facing app      | user input: public GitHub Pages site, no accounts, no personal data      |
| Data Sensitivity | 0     | Public data            | user input: no data storage; localStorage holds only self-assessment levels |
| Blast Radius     | 1     | Performance / DoS      | user input: a broken app is unavailable or wrong, no data loss           |

**Tier: 2 — Moderate** (determined by Code Type = 2, Language = 2, Deployment = 2)

Known model gap: educational harm (wrong feedback silently teaches a child something wrong; R-025), mitigated by
property-based tests. Special risk: `tutor.md` is a prompt in a child's chat session (T-015, R-024), mitigated by
branch protection, secret scanning with push protection, org-wide 2FA and the tutor link allowlist in the build.

### Mitigations: lernapps.github.io (Tier 2)

| Measure                | Status  | Details                                                                        |
| ---------------------- | ------- | ------------------------------------------------------------------------------ |
| Linter & Formatter     | Present | ESLint flat config `eslint.config.js` in required check (#21); no formatter     |
| Type Checking          | Present | `tsc --checkJs` (strict) in required check, scope `src/kern` (#25)              |
| Pre-Commit Hooks       | N/A     | Won't (#27): the required check runs the same gates                             |
| Dependency Check       | Present | `npm audit --audit-level=high` in `pruefen.yml` (#20); exact pins, `npm ci`     |
| CI Build & Unit Tests  | Present | `pruefen.yml`, required check `test-und-build`                                  |
| SAST                   | Present | CodeQL default setup, secret scanning with push protection, Dependabot (#19)    |
| AI Code Review         | Present | fresh-context review before every merge, check `ki-review` (#24, ADR-027)       |
| Property-Based Tests   | Present | fast-check, `test/kern/*.property.test.js` (#22; found and fixed #30)           |
| SonarQube Quality Gate | N/A     | Won't (#28): file length ≤ 500 lines and ESLint cover it                        |
| Sampling Review (~20%) | Present | 100 %: the PO merges every PR; not enforceable (a single maintainer cannot approve their own PR) |
| Tutor link allowlist   | Present | `pruefeTutorLinks` in `lib/pruefungen.js` (ADR-023, M-22)                       |
| Org 2FA requirement    | Present | decided and enabled 2026-09-24 (R-017, M-21)                                    |

## Semantic Contracts
Source: https://llm-coding.github.io/Semantic-Anchors/contracts/ — copied from lern-app-template so the repo is self-contained.

### Code Quality
Our code follows:
- SOLID principles
- DRY, KISS
- Ubiquitous Language from Domain-Driven Design (same terms in code as in the specification)

### Implement Next
For each issue:
- Create a feature branch for the EPIC
- Select next issue from backlog (respect dependencies)
- Analyze and document analysis as a comment on the issue
- Implement using TDD (London or Chicago School as appropriate)
- Each test references its Use Case ID for traceability
- Commit with Conventional Commits, reference issue number
- Check if spec or architecture docs need updating
- When EPIC is complete, create a Pull Request

### Vertical Slicing
Build the first increment as a walking skeleton: a deployable end-to-end slice that wires every architectural layer together and does almost nothing else.

Grow the system as thin vertical slices — each slice cuts through all layers and delivers one small piece of user value. Slices are tracer bullets: kept and refined, never thrown away.

When a technical unknown blocks a slice, run a spike solution first — a timeboxed, throwaway experiment that removes the risk. Spike code is discarded; only its lesson carries into the slice.

### Writing Style
Writing follows Gutes Deutsch nach Wolf Schneider (or Plain English according to Strunk & White).

Additionally:
- Technical terms stay in English (LLM, Prompt, Token, Spec, etc.)
- Address the reader directly, use first person sparingly but deliberately
- Use analogies to human thinking to explain technical concepts
- One thought per paragraph (5-8 sentences is fine)
- Section headings are statements, not topic announcements
- First sentence says what the paragraph is about
- Show code and prompts, don't just claim things work
- Conclusions make a clear statement — never end with 'it remains exciting'

### Concise Response (TLDR)
Responses lead with the conclusion first (BLUF). Keep to essential points. No filler, no preamble. Use short sentences, active voice, and no unnecessary words (Strunk & White).
