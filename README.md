# lernapps.github.io

Home page of the lernapps organisation (brand: lernapps.net), served at <https://lernapps.net/> (custom domain; <https://lernapps.github.io/> redirects there).

The home page is static HTML. Its only scripts are the usage counter (once it is on) and `cat.js`, a small joke in the hero: a button "Lieber Katzenvideos" opens a 15-second cat video in a dialog, and at the end a card points to the catalog. The page is complete without it. Its story follows the [platform design](https://lernapps.net/docs/platform-design/) (agents: see the skill [`skills/pdt`](https://github.com/lernapps/docs/tree/main/skills/pdt) in lernapps/docs), solution first, and it stays calm: each section has a heading, one sentence of value and at most one link at its end; the details live on the pages behind it. The sections: the promise (learning apps with no strings attached, with red ticks and a highlighter on the key words); a gallery from the catalog (section `#beispiele`, in English `#examples`: one app large with a desktop and a phone screenshot, the others beside it as examples, switched by radio inputs without JavaScript, and the button "Mehr im App-Katalog"); what teachers and parents get; the learner's own tutor (section `#ki`, in English `#ai`: one sentence, the details on `/tutor/`); makers (section `#mitmachen`, in English `#get-involved`: the idea and the foundation, and how to join); why another platform (it belongs to no company); and a person behind it. A word in `[[double brackets]]` in a heading gets the highlighter (the filter `marked` in `eleventy.config.js`); it is drawn while it scrolls into view only where the browser can do that and the reader allows motion (`prefers-reduced-motion`), otherwise it is finished from the start. Four more pages, all in the common header, hold the details: **tutor** (`/tutor/`: the learning companion of the explainer apps, parallel to the tooling: the learning content is readable and referable, so the learner's own assistant can accompany, guide and support them, with a real example conversation; how it works from the self-assessment to "Back to the tutor", the tutor's rules, what it gets, privacy, limits), **features** (`/features/`: what the apps can do for users; what developers get: foundations or their own stack, guidance for the AI assistant, how an app is listed, ownership and licence; and what makes the platform unique: GitHub as a free backbone, no server and no data, readable for AI assistants, planned in the open, with the principles), **join** (`/join/`: one block per persona with a prompt for their AI assistant) and **about** (`/about/`: the founder's long text and an honest answer for sceptics that links to the design). It links to the sites that live in other repos on the same origin: the app overview (`/apps/`), the docs (`/docs/`) and the tooling (`/tooling/`). Apart from the four examples in the gallery it does **not** list apps itself; that is the job of the app overview in [lernapps/apps](https://github.com/lernapps/apps). See [ORGANIZATION.md](https://github.com/lernapps/.github/blob/main/ORGANIZATION.md) for how the repos fit together.

This repo also holds the **site frame shared by all sites** on lernapps.net: design tokens, header with the common navigation, footer, and the deploy check, in [`site-frame/`](site-frame/README.md). The sites use it as the npm package `@lernapps/site`, straight from git.

## Layout

| Path | Purpose |
|---|---|
| `src/index.njk`, `tutor.njk`, `features.njk`, `join.njk`, `about.njk` | Templates (Nunjucks) of the home page and of the pages "Tutor", "Features", "Mitmachen" and "Über uns". Markup and utility classes only, no texts. Each is generated once per language (pagination over `languages`): `/`, `/tutor/`, `/features/`, `/join/`, `/about/` in German, the same below `/en/` in English |
| `src/_includes/ki-dialog.njk`, `ki-flow.njk` | The example conversation with a tutor (addresses shown as links with the site's mark, no title or explanation) and the way a result takes (app, one click, the learner's assistant), used by `/tutor/`. Text only; the link to the whole conversation goes to another site and loads nothing |
| `src/join.js` | Progressive enhancement of `/join/`: a copy button for each prompt. Without it, the prompt is plain text |
| `src/home.css`, `src/media/apps/` | The styles that UnoCSS cannot generate (gallery switched by radio inputs, highlighter, red ticks) and the eight screenshots of the four example apps (desktop 1280×800 and phone 390×780 at 2×, WebP, taken from the running apps under `lernapps.net/apps/start/`; replace them when an app changes visibly). |
| `src/cat.js`, `src/media/` | The cat video (`katze.mp4`, 0.76 MB, H.264 with `faststart`) and its poster, and the script that opens it in a dialog. Nothing of it loads before the click: the video has `preload="none"`, `cat.js` sets the poster when the dialog opens. Without JavaScript the button stays hidden and a `<noscript>` poster links to the file; the scene is described in its alt text and, for assistive technology, in the dialog. With reduced motion preferred the video does not start by itself. Re-encode with `ffmpeg -crf 28 -movflags +faststart` and keep it small: every version stays in the git history |
| `src/_data/de.js`, `en.js` | All texts of these pages (German, plain language after ISO 24495-1; English is its translation, same structure) and its link targets. `languages.js` lists the languages |
| `uno.config.js` | UnoCSS presets (wind4 + typography, as in the original); CSS is generated at build time into `_site/uno.css` |
| `eleventy.config.js` | Eleventy: input `src/`, output `_site/`; only `.njk` are templates, everything else is copied as is |
| `src/404.njk` | The "not found" page of the whole origin, with the shared site frame; German and English in one page |
| `src/privacy.njk`, `imprint.njk` | Privacy notice and imprint, both languages in each page, the reader's own first: `/privacy/`, `/en/privacy/` |
| `src/llms.txt` | For AI assistants: what lernapps.net is and why, the paths (find, build, list an app), the quick path to build one, the links to the llms.txt of docs, tooling and apps, and the app list. Copied unchanged |
| `site-frame/` | The site frame shared by all sites (tokens, header, footer, Eleventy plugin, `site-check`); see [site-frame/README.md](site-frame/README.md) |
| `.github/workflows/pages.yml` | Job `site` (required status check): `npm ci`, build, check of the built site; on `main` the `deploy` job publishes `_site/` to the root of the `gh-pages` branch, which Pages serves. The steps are the shared site actions of [lernapps/tooling](https://github.com/lernapps/tooling), the same for every site |
| `.github/workflows/pr-preview.yml` | A preview per pull request at `https://lernapps.net/pr-preview/pr-<number>/`, linked in a comment, removed on close (shared action `site-preview`). Built with `SITE_PATH_PREFIX` (own links get the prefix via the filter `own`) and `SITE_PREVIEW` (banner, `noindex`) |
| `src/CNAME` | The custom domain `lernapps.net`; the `gh-pages` branch must carry it |
| `.githooks/`, `scripts/`, `test/` | The git hooks (set by `npm ci`, the `prepare` script), the pre-push hook's change scope (`scripts/pre-push.mjs`) and its tests; see Commands |

Rules for the page (org-wide): no external requests (system fonts, no CDNs; the one exception is the usage counter of the platform sites, never in an app, see [Usage counter](#usage-counter)), `referrer` meta, `lang` on `<html>` (`de`, `en` below `/en/`), skip link, WCAG 2.1 AA contrast, no horizontal scrolling at 360 px, all content readable without JavaScript.

## Commands

```sh
npm ci                      # install the exact pinned versions
npm run build               # Eleventy → _site/, then UnoCSS scans _site/**/*.html → _site/uno.css
npm run check               # site-check on _site/ (run after the build, before pushing)
npm run dev                 # build, then serve http://localhost:8080/ with live reload (HTML and CSS)
```

`npm ci` sets the git hooks in `.githooks/`. Both are quiet and log to `node_modules/.cache/lernapps/`.
**pre-commit:** no whitespace errors or conflict markers, the staged JavaScript and JSON parse. **pre-push:** the
change scope of the pushed commits (the classifier of lernapps/tooling, at the commit the workflows pin): nothing for
only the plan (`.vibe/**`), otherwise `npm run build && npm run check`. `npm test` tests the hook (CI's job `test`).

Links to `/apps/`, `/docs/` and `/tooling/` only resolve on the deployed origin. Links to pages of this repo go through the filter `own` (from `site-frame/eleventy.js`), so they also work in a preview.

## Usage counter

Purpose: to see whether the apps are used at all, nothing more. The counter is **not** part of the shared site frame,
because apps use the frame too and apps are never counted. This repo serves it as `/lernapps-count.js`
(`src/lernapps-count.njk`, endpoint in `src/_data/counter.js`), and each platform site adds it to its own pages,
outside a pull request preview:

```html
<script src="/lernapps-count.js" defer></script>
```

| Site | Where |
|---|---|
| home (this repo) | `src/_includes/counter.njk`, included after `laHead` in every page; the 404 page counts as `/404/` |
| `/apps/`, `/docs/`, `/tooling/` | in their own repos, the same tag in their own layout (not through `@lernapps/site`) |

It sends the path of the page to GoatCounter, with the origin of the website the visitor came from (only another
website's, no path or query: a link from a school platform tells nothing about the course or the pupil), and the
name of a link marked `data-la-count="<name>"` as an event: the catalog marks its "open app" links with
`data-la-count="app/<slug>"`. Nothing else: no query, title or screen size, no cookies, no localStorage; not with
Global Privacy Control or Do Not Track, not in a preview. Browser, system, language and country GoatCounter derives
itself from the request, and stores them only as totals.
`site-check` fails a site outside the platform sites whose pages carry the counter.

While `endpoint` is empty, the script does nothing and the privacy notice says the counter is planned. To turn it on,
in one commit here:

1. Make sure there is a data processing agreement (Art. 28 GDPR) with GoatCounter, and in its site settings turn
   off what is not needed (individual pageviews stay off; screen sizes are never sent).
2. Set `endpoint` in `src/_data/counter.js` to `"https://<code>.goatcounter.com/count"`.
3. Set `legal.updated` in `src/_data/legal.js`: the privacy notice now shows the section on the counter
   (`site.counter`). Check that the section still matches `src/lernapps-count.njk` and GoatCounter's privacy policy.

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
