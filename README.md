# lernapps.github.io

Home page of the lernapps organisation (brand: lernapps.net), served at <https://lernapps.net/> (custom domain; <https://lernapps.github.io/> redirects there).

The home page is the former edugo landing page, rebuilt as static HTML: same texts (brand renamed), same look, readable without JavaScript. It links to the sites that live in other repos on the same origin: the map (`/map/`), the docs (`/docs/`) and the Mathe-Karte (`/mathe-karte/`). It does **not** list apps itself; that is the job of the map. See [ORGANIZATION.md](https://github.com/lernapps/.github/blob/main/ORGANIZATION.md) for the target structure.

## Layout

| Path | Purpose |
|---|---|
| `src/index.njk` | Home page template (Nunjucks). Markup and utility classes only, no texts |
| `src/_data/de.js` | All texts of the home page (German) and its link targets |
| `src/start.js` | Progressive enhancement: turns the stacked persona quotes/cards into tabs (ARIA tabs pattern, arrow keys, auto-advance). Without it, everything is shown stacked |
| `src/start.css` | The few rules utilities don't cover (tab panel animation) |
| `uno.config.js` | UnoCSS presets (wind4 + typography, as in the original); CSS is generated at build time into `_site/uno.css` |
| `eleventy.config.js` | Eleventy: input `src/`, output `_site/`; only `.njk` are templates, everything else is copied as is |
| `src/404.html` | Forwards old addresses of the Mathe-Karte (see below), otherwise a plain "not found" page. Styled by `src/stil.css` |
| `src/{binom,prozent,zufall,karte}/*.{md,txt}`, `src/llms.txt` | "Moved" notes for AI tutors that fetch the old `tutor.md`/`llms.txt` addresses (fetchers don't run the JS in `404.html`). Copied unchanged, never rendered |
| `scripts/check.mjs` | CI check on the build output: no external resources, no broken relative links (`/map/`, `/docs/`, `/mathe-karte/` are skipped, they belong to other repos) |
| `.github/workflows/pages.yml` | Job `check` (required status check): `npm ci`, build, check; on `main` it uploads `_site/` and the `deploy` job publishes it |

Rules for the page (org-wide): no external requests (system fonts, no CDNs), `referrer` meta, `lang="de"`, skip link, WCAG 2.1 AA contrast, no horizontal scrolling at 360 px, all content readable without JavaScript.

## Commands

```sh
npm ci                      # install the exact pinned versions
npm run build               # Eleventy → _site/, then UnoCSS scans _site/**/*.html → _site/uno.css
node scripts/check.mjs      # check _site/ (run after the build, before pushing)
npm run dev                 # build, then serve http://localhost:8080/ with live reload (HTML and CSS)
```

Links to `/map/`, `/docs/` and `/mathe-karte/` only resolve on the deployed origin.

## Old addresses of the Mathe-Karte

Until 2026-09-27 the Mathe-Karte lived at the root (`lernapps.github.io/binom/…`). It now lives at `/mathe-karte/`. Tutor links with that old prefix are already in learners' chats, so this repo keeps them working:

- **Browsers:** `404.html` forwards `/binom/`, `/prozent/`, `/zufall/`, `/karte/`, `/kern/` to `/mathe-karte/…`, keeping query and hash (e.g. `?seed=42&von=tutor`).
- **AI tutors fetching files:** the stubs at the old `tutor.md`/`llms.txt` paths name the new address. The root `llms.txt` describes lernapps and points to the Mathe-Karte; it stays.
- The old root `index.html` is now the lernapps home page, which links to the Mathe-Karte.

Remove both once the old links have died out. Old `/docs/…` links are forwarded by the `404.html` of [lernapps/docs](https://github.com/lernapps/docs), which owns `/docs/` since 2026-09-27.

## Brand mark

The mark is a lowercase "l" drawn as a route from a start point to a goal: white line, blue points (`#60a5fa`) on dark slate (`#0f172a`). It was chosen on 2026-09-28 over more geometric variants because it is the calmest; keep it unchanged.

| File | Use |
|---|---|
| `src/brand/mark.svg` | Master, rounded tile. Source for everything else. |
| `src/brand/mark-plain.svg` | Mark without tile, for the wordmark on dark backgrounds (nav, footer): same height as the text, on its baseline, gap ≈ 0.8 em |
| `src/brand/mark-square.svg` | Square tile, for places that round corners themselves |
| `src/brand/avatar-500.png` | GitHub org avatar (from `mark-square.svg`) |
| `src/brand/mark-512.png` | Raster version of the master, transparent corners |
| `src/favicon.svg`, `src/favicon.ico` (16/32/48), `src/apple-touch-icon.png` (180) | Browser icons |

Deployed under `https://lernapps.net/brand/`, so other repos can link the mark instead of copying it. The PNG and ICO files are rendered from the SVGs with a headless browser; re-render them whenever the SVG changes.

## License

[MIT](LICENSE), for the code and the texts in this repo. Contributions are made under the same license.
