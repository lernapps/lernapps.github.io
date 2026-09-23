---
name: lern-app
description: Build an interactive, static learning web app plus an AI-tutor prompt for one school topic (Mathe, Physik, Chemie, other sciences) from a curriculum reference. Use when the user names a topic from a German Lehrplan ("Klasse 8 Hessen Prozentrechnung", "Optik Klasse 7", "Stöchiometrie") or hands over a worksheet/checklist and wants an app for a learner. Produces a new app folder src/<app>/ in the monorepo lernapps/lernapps.github.io (Eleventy, one shared kern), on a feature branch in its own git worktree with a PR to main, with exercise generators, visualisations, a diagnostic test, llms.txt, a claude.ai tutor link and a Mathe-Karte entry.
---

# Lern-App: from a curriculum topic to a new app in the monorepo with an AI tutor

The result is a static app the learner uses together with Claude. Claude teaches in dialogue (tutor.md) and keeps linking into the app for exercises, pictures and a test. The app never talks to a server.

All apps live in one repository: `lernapps/lernapps.github.io` (GitHub, public, site https://lernapps.github.io/, local checkout usually `~/projects/lern-apps`). A new topic is a new folder `src/<app>/` — no new repo, no template, no separate Pages setup. The repo's `CLAUDE.md` is the contract for everything inside it (sections "New app" and "New competency in an existing app"); this skill covers the steps around it. Read it before building anything.

The reference app shows the finished pattern: `src/binom/` (https://lernapps.github.io/binom/) — six competencies, term fields with variables, flat-area pictures. Copy its structure. `src/prozent/` (number fields, hundred-square) and `src/zufall/` (fractions, clickable tree diagram) show other field types and pictures.

## Phase 0 — Clarify (one message, at most three questions)

You need: **topic**, **Land**, **Schulform**, **Jahrgang**, and whether the user has a **source** (worksheet, checklist, test topics). If the user gave a file, read it; never commit it and never quote personal data from it. Ask only what you cannot infer. Typical questions:
1. Which competencies exactly — or may I derive them from the Lehrplan?
2. Is there a deadline (Klassenarbeit, Wettbewerb) that should shape the order?
3. App folder name (`pfad`, short, German, kebab-case, e.g. `optik`) and whether it gets a sibling app.

## Phase 1 — Competencies (the Definition of Done)

1. Find the curriculum reference. Prefer the official PDF of the Land (Kerncurriculum, Lehrplan) over publishers; cite page and unit. For Mathe, check the Mathe-Karte first: nodes in `src/karte/daten/kompetenzen/<id>.md`, Hessen units in `src/karte/daten/zuordnungen/` (live: https://lernapps.github.io/karte/data.json). The node may already exist.
2. If the learner's source differs from the Lehrplan (class behind or ahead), follow the source and say so in one sentence.
3. Write 5–9 competencies as "Ich kann …" statements, one observable skill each. More than 9 → split into two sibling apps (Prozent and Zufall were one worksheet, two apps).
4. Show the list to the user and get a yes before Phase 2.

## Phase 2 — Videos (optional, verified)

Search the channel the user trusts (default: Lehrerschmidt; ask for Physik/Chemie, e.g. "Lehrerschmidt", "musstewissen Physik/Chemie", "simpleclub"). Verify every ID with `curl -s "https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=<id>&format=json"` and check `author_name`. Never use an ID you did not verify. No verified video → no card; set `ohneVideo: "<one-line note>"` in the front matter instead. Details: `references/videos.md`.

## Phase 3 — App folder on a feature branch in its own worktree

Other agents work in the same repository at the same time. Never check out a branch in the main checkout; always work in a worktree of your own:

```bash
git -C ~/projects/lern-apps fetch
git -C ~/projects/lern-apps worktree add ../lern-apps-<app> -b feat/<app> origin/main
cd ~/projects/lern-apps-<app> && npm ci   # set the git identity the user's CLAUDE.md prescribes
```

Then follow "New app" in `CLAUDE.md`:
- `src/<app>/js/app.config.js` with `APP = { id, pfad, titel, kurzname, fach, klasse, beschreibung, intro, kartenEintrag }` and `KOMPETENZEN`. `id` is the localStorage prefix (convention `<thema>-trainer`) — never change it after launch. `pfad` equals the folder name.
- `src/<app>/<app>.11tydata.js` (one line, `appDaten("<app>")`).
- **The colour is not a choice**: `APP.fach` selects it from `lib/fachfarben.js` (mathe `#1d4ed8`, physik `#c2410c`, chemie `#6d28d9`, biologie `#15803d`, informatik `#0f766e`). An unknown subject fails the build. A new subject means a new row there (WCAG AA with white text, `test/build/fachfarben.test.js`).
- Draw a subject glyph in `favicon.svg` in that primary colour; render `icon-192.png`, `icon-512.png` and `apple-touch-icon.png` from it locally (Playwright/Chromium screenshot — no online converters).
- `llms.njk` and `tutor.njk`: copy from `src/binom/` and adapt.

Address, canonicals, source link and the claude.ai link are derived from `src/_data/site.js` — never write a literal base URL into an app. Start page, test page, manifest, overview entry and root `llms.txt` come for free.

**Version**: the footer shows the site version from `package.json`; bump it (SemVer, minor for a new app) in the PR. Cache busting is automatic: the build appends `?v=<content hash>` to every local import, `<script src>` and stylesheet. Never write `?v=` into sources.

## Phase 4 — One vertical slice per competency

Follow "New competency" in `CLAUDE.md`, test-first:
- **Test** `src/<app>/test/<id>.test.js` first; see it fail.
- **Generator + checker** (`src/<app>/js/aufgaben/<id>.js`, pure): `erzeugeAufgabe(zufall, vorgaben)` and `pruefeAntwort(aufgabe, antworten)`; random but "nice" numbers, realistic contexts from the learner's world, deterministic from the Aufgabennummer, `URL_ZAHLEN`/`URL_TEXTE` for every free value, `fehler` ids for the typical mistakes (these feed the tutor). `test/apps/vertrag.test.js` checks the contract automatically.
- **Numbers**: one rule for numeric answers (`src/kern/js/zahlantwort.js`): declare `art` and `stellen`, build with `zahlenfeld`, check with `pruefeZahlAntwort`, diagnose with `passtZu`. No per-call tolerances.
- **Algebra**: field type `variablenterm` with `form: "ausmultipliziert"` or `"faktorisiert"`, and `passtZuTerm` to diagnose typical wrong terms. A wrong form is only a neutral hint, and "faktorisiert" is coarse — for factorising tasks also check the product structure in the app's checker.
- **Picture** (`src/<app>/js/vis/<id>.js`, `zeichne…(svg, aufgabe, ergebnis)` with `svgEl`): the same function renders the static SVG at build time and redraws it in the browser; never touch `document`. Sciences live here — see `references/visualisierungen.md`.
- **Page** `src/<app>/<id>.md`, front matter only (layout `kompetenz.njk`): `kompetenz`, `beschreibung`, `warum` (2–3 sentences), `regel`, `beispiel`, `video: { id, titel, kanal }` or `ohneVideo`, `bild: { text, funktion, seed, … }`. The page shows Warum, Regel, Beispiel, Bild, Video, Übung in this order. Everything but the exercise reads without JavaScript.
- **Config**: entry in `KOMPETENZEN` (`id`, `titel`, `kurz`, `seite`, `generator`, for Mathe `kartenKnoten`). The menu numbers entries itself, so `kurz` is a formula or keyword ("(a+b)²", "Ausklammern"), never an ordinal like "1. Formel".
- `npm test && npm run build` green, commit, next competency.

Brief sub-agents with `references/agent-auftrag.md` when you parallelise. Rough effort: an app with 6 competencies takes about 25–40 minutes of agent time.

**Missing kern building block** (as term fields once were): stop the slice and build it in `src/kern/` as its own PR (with an ADR in `src/docs/arc42`, chapter 9), or at least as its own commit in the app PR with a test in `test/kern/`. The kern never imports an app config; pages pass `APP`, `KOMPETENZEN` and generators in.

## Phase 5 — Tutor layer

- `llms.njk` (→ `llms.txt`): every page with its URL (`{{ app.basisUrl }}`, never a literal), rule, URL parameters with one example link, typical mistakes, answer formats, test section. The tutor must be able to build a link to a specific task from this file alone. The build fails if a page is missing.
- **Tutor links and llms.txt must match the generators**: every parameter documented there must exist in `URL_ZAHLEN`/`URL_TEXTE` and vice versa, every `fehler` id named must be one the checker returns. A build check for this is coming (PR `feat/pruefungen`); until it lands, check by hand.
- `tutor.njk` (→ `tutor.md`): keep the generic method block from `src/binom/tutor.njk` verbatim; fill topic, the competency checklist, a subject-specific "Warum hinter dem Warum" example, and the video rule. Under 120 lines, German, second person singular.
- The claude.ai link (`https://claude.ai/new?q=` + URL-encoded `Lade <app-URL>tutor.md und unterrichte mich danach. …`) is rendered by the start page via TalkItOver with a plain `<a>` fallback; nothing to do per app.
- URL parameters, anchors and `seed`/`nr` are a public contract: never rename existing ones.

## Phase 6 — Map entry (from the app config)

The Mathe-Karte at `/karte/` is built from the app configs; there is no separate map repo.
- `APP.kartenEintrag` with the edugo fields: `aktiv-level`, `backend: "none"`, `external-requests: "on-consent"` if videos, else `"none"`, `dsgvo: "amber"` (green only after an audit, never self-declared), `evidence`, `jahrgaenge`, `lizenz`, `stand` (today).
- Each competency lists `kartenKnoten: [<node id>]`. Unknown ids fail the build. A missing node goes to `src/karte/daten/kompetenzen/<id>.md` with a traceable Lehrplan source, plus its row in `src/karte/daten/zuordnungen/`; see `src/karte/daten/README.md`.
- Physik and Chemie have no map yet: leave out `kartenEintrag` and `kartenKnoten`, mention it once and stop.

## Phase 7 — Verify, PR, check live

1. `npm test && npm run build` green.
2. Browser check (Playwright) against `npm run serve -- --port=<your port>` (remember the PID), at 360 px and 1280 px: each page with JS off (text + picture visible), one correct and one wrong answer, Lösung zeigen/verbergen, a deep link with `nr=`, the Schnelltest, zero console errors, **zero requests to other hosts before a video click**.
3. Push the branch, `gh pr create` to `main` with a short "Was / Geprüft" body. `main` is protected: the check `test-und-build` must pass (`gh pr checks <nr> --watch`). Merge only when the user has said so in this conversation.
4. After the merge, `pages.yml` deploys. Wait for the run (`gh run list --workflow pages.yml`), then check that `<app>/index.html`, one deep link, `<app>/llms.txt`, `<app>/tutor.md` and the app on `/karte/apps.html` return 200.
5. Remove the worktree: `git -C ~/projects/lern-apps worktree remove ../lern-apps-<app>`.

## Deliver

End with: app URL, the PR URL, the claude.ai tutor link, the Schnelltest link, and one suggestion how the learner should start ("Mit dem Schnelltest beginnen und die Ergebniszeile an Claude schicken"). Report where things live (GitHub `lernapps/lernapps.github.io`, public repo, GitHub Pages, reachable from the internet), never just "veröffentlicht".

## Rules that came from mistakes

- Never guess YouTube IDs, Lehrplan units, or curriculum wording — look them up and cite.
- "seed" never appears in learner-facing text; it is "Aufgabe Nr. 42". The URL keeps `seed=`/`nr=`.
- No thumbnails from ytimg before the click — that already sends the IP to Google. Videos use the two-click embed in `src/kern/js/video.js`.
- `backend: none` is not "DSGVO-safe"; declare `external-requests` honestly.
- A worksheet the user provides stays local; only the derived competency list goes into the repo.
- Every agent (and every sub-agent) works in its own git worktree and never checks out branches in the main checkout — other agents share it.
- Parallel agents each get their own port (8080, 8081, 8082, …) and their own browser context; otherwise one agent tests the other's app.
- Stop dev servers by PID (`kill <PID>`), never with `pkill -f` — it kills other agents' servers (and on the Pironman your own SSH session).
- Imports carry `?v=<content hash>`, added by the build. A hand-written `?v=` or a stale cached module means one module loads twice under two URLs.
- The old single-app repos (`raifdmueller.github.io/*-trainer`, `mathe-karte`, `lern-app-template`) are being deleted (decided 23.09.2026). Never link to them or copy from them; everything lives in the monorepo.
- Enable Pages only after the first merge: a deploy of placeholder content gets cached (max-age=600) and later mixes with the real app — dead test buttons. For the existing monorepo Pages is already on; this matters only for a new site.
- A repo named `<org>.github.io` gets Pages auto-enabled in legacy branch mode. Switch it to GitHub Actions with `gh api -X PUT repos/<o>/<r>/pages -f build_type=workflow` (POST fails because Pages already exists). Only relevant when setting up a new org site.
