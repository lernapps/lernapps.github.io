# lernapps.github.io

Home page of the lernapps organisation (brand: lernapps.net), served at <https://lernapps.net/> (custom domain; <https://lernapps.github.io/> redirects there).

The home page is static HTML, readable without JavaScript. Its story follows the [platform design](https://lernapps.net/docs/platform-design/) (agents: see the skill [`skills/pdt`](https://github.com/lernapps/docs/tree/main/skills/pdt) in lernapps/docs): problems and portraits for teachers, parents, people who build apps and learners; the principles (free, open counting instead of tracking, thanks as what keeps it alive); why it is free, with a personal word; and an honest answer for sceptics that links to the design. It links to the sites that live in other repos on the same origin: the app overview (`/apps/`), the docs (`/docs/`) and the Mathe-Karte (`/mathe-karte/`). It does **not** list apps itself; that is the job of the map. See [ORGANIZATION.md](https://github.com/lernapps/.github/blob/main/ORGANIZATION.md) for the target structure.

## Layout

| Path | Purpose |
|---|---|
| `src/index.njk` | Home page template (Nunjucks). Markup and utility classes only, no texts |
| `src/_data/de.js` | All texts of the home page (German, plain language after ISO 24495-1) and its link targets |
| `src/start.js` | Progressive enhancement: turns the stacked persona quotes/portraits into tabs (ARIA tabs pattern, arrow keys, auto-advance). Without it, everything is shown stacked |
| `src/start.css` | The few rules utilities don't cover (tab panel animation) |
| `uno.config.js` | UnoCSS presets (wind4 + typography, as in the original); CSS is generated at build time into `_site/uno.css` |
| `eleventy.config.js` | Eleventy: input `src/`, output `_site/`; only `.njk` are templates, everything else is copied as is |
| `src/404.html` | A plain "not found" page with links to the apps and the home page. Styled by `src/stil.css` |
| `src/llms.txt` | Describes lernapps for AI assistants and points to the apps. Copied unchanged |
| `scripts/check.mjs` | CI check on the build output: no external resources, no broken relative links (`/map/`, `/docs/`, `/mathe-karte/` are skipped, they belong to other repos) |
| `.github/workflows/pages.yml` | Job `check` (required status check): `npm ci`, build, check; on `main` the `deploy` job publishes `_site/` to the root of the `gh-pages` branch, which Pages serves |
| `.github/workflows/pr-preview.yml` | A preview per pull request at `https://lernapps.net/pr-preview/pr-<number>/`, linked in a comment, removed on close. Built with `SITE_PATH_PREFIX` (own links get the prefix via the filter `own`) and `SITE_PREVIEW` (banner, `noindex`) |
| `src/CNAME` | The custom domain `lernapps.net`; the `gh-pages` branch must carry it |

Rules for the page (org-wide): no external requests (system fonts, no CDNs), `referrer` meta, `lang="de"`, skip link, WCAG 2.1 AA contrast, no horizontal scrolling at 360 px, all content readable without JavaScript.

## Commands

```sh
npm ci                      # install the exact pinned versions
npm run build               # Eleventy → _site/, then UnoCSS scans _site/**/*.html → _site/uno.css
node scripts/check.mjs      # check _site/ (run after the build, before pushing)
npm run dev                 # build, then serve http://localhost:8080/ with live reload (HTML and CSS)
```

Links to `/apps/`, `/docs/` and `/mathe-karte/` only resolve on the deployed origin. Links to pages of this repo go through the filter `own` (`eleventy.config.js`), so they also work in a preview.

## No forwards

Old addresses (the Mathe-Karte at the root until 2026-09-27, the map at `/map/`) are not forwarded: at
this early stage nothing needs to stay compatible. `404.html` is a plain "not found" page.

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
