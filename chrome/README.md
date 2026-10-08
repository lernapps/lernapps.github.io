# Shared chrome of lernapps.net

Every site on lernapps.net (home, `/apps/`, `/docs/`, and apps that want to look like part of it) uses the
same design tokens, header, footer and checks. They live here, in the home site's repo, and are used as an
npm package straight from git, not published:

```jsonc
// package.json of a site
"devDependencies": {
  "@lernapps/site": "github:lernapps/lernapps.github.io#<commit on main>"
}
```

Renovate (preset `github>lernapps/tooling`) bumps the commit when `main` here changes, so every site picks up
a change to the navigation or the tokens with its next update pull request.

| File | What it is |
|---|---|
| `tokens.css` | Design tokens as CSS custom properties (`--la-*`): brand colours, text, links, font, widths |
| `chrome.css` | Header, footer, skip link and preview banner, plain CSS on the tokens (class prefix `la-`) |
| `nav.js` | The navigation and footer links of all sites, and which path belongs to which repo (`SITES`) |
| `chrome.js` | `head()`, `header()`, `footer()` and `link()`: render the chrome as HTML strings |
| `eleventy.js` | Eleventy plugin: shortcodes `laHead`, `laHeader`, `laFooter`, filter `own`, copies the CSS |
| `inject.mjs` | CLI `lernapps-chrome` for sites not built with Eleventy (docs): adds the chrome to built HTML |
| `check.mjs` | CLI `lernapps-check`: the deploy check of every site (no external resources, links, privacy notice and imprint linked) |

## Use it

Eleventy site, served at `/apps/`:

```js
// eleventy.config.js
import chrome from "@lernapps/site/eleventy";
eleventyConfig.addPlugin(chrome, { site: "/apps/", source: "https://github.com/lernapps/apps" });
```

```njk
<head> … {% laHead %} … </head>
<body>
  {% laHeader page.url %}
  <main id="main-content" tabindex="-1"> … </main>
  {% laFooter %}
</body>
```

Built HTML (docs): `lernapps-chrome --site /docs/ --source https://github.com/lernapps/docs --out _site`.

Check before deploy: `lernapps-check --site /apps/` (`--out _site` is the default).

Both read `SITE_PATH_PREFIX` (where a pull request preview is served, e.g. `/apps/pr-preview/pr-12/`) and
`SITE_PREVIEW` (show the preview banner), which the shared workflows in lernapps/tooling set.

## Rules

- No dependencies, no build step: the files are used as they are.
- Links to pages of the own site go through `link()` / the filter `own`, so they stay inside a preview.
  Icons and the mark (`SHARED_ASSETS`) are always taken from the home site.
- The texts are German and plain (ISO 24495-1), like all texts for learners, teachers and parents.
- A change here changes every site: check it in the previews of apps and docs after Renovate bumps them.
