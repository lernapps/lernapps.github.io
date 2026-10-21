# Shared site frame of lernapps.net

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
| `frame.css` | Header, footer, skip link and preview banner, plain CSS on the tokens (class prefix `la-`) |
| `nav.js` | The navigation and footer links of all sites in every language (`LANGUAGES`), and which path belongs to which repo (`SITES`, `TRANSLATED_SITES`) |
| `frame.js` | `head()`, `header()`, `footer()`, `link()`, `languageOf()` and `pathIn()`: render the site frame as HTML strings |
| `eleventy.js` | Eleventy plugin: shortcodes `laHead`, `laHeader`, `laFooter`, filter `own`, copies the CSS |
| `inject.mjs` | CLI `lernapps-frame` for sites not built with Eleventy (docs): adds the site frame to built HTML |
| `check.mjs` | CLI `lernapps-check`: the deploy check of every site (no external resources, links, privacy notice and imprint linked, the usage counter only on the platform sites) |

## Use it

Eleventy site, served at `/apps/`:

```js
// eleventy.config.js
import siteFrame from "@lernapps/site/eleventy";
eleventyConfig.addPlugin(siteFrame, { site: "/apps/", source: "https://github.com/lernapps/apps" });
```

```njk
<head> … {% laHead page.url %} … </head>
<body>
  {% laHeader page.url %}
  <main id="main-content" tabindex="-1"> … </main>
  {% laFooter page.url %}
</body>
```

Built HTML (docs): `lernapps-frame --site /docs/ --source https://github.com/lernapps/docs --out _site`.

Check before deploy: `lernapps-check --site /apps/` (`--out _site` is the default).

Both read `SITE_PATH_PREFIX` (where a pull request preview is served, e.g. `/apps/pr-preview/pr-12/`) and
`SITE_PREVIEW` (show the preview banner), which the shared workflows in lernapps/tooling set.

## Languages

German is at the root of every site, English below `en/` of it: `/`, `/en/`; `/apps/`, `/apps/en/`; `/docs/`,
`/docs/en/`. The same page has the same address within each tree (`pathIn(path, "en")` maps one to the other), and
the frame reads the language of a page from its address: below the language root it is English. So the header, the
footer and the skip link speak the language of the page, the navigation leads to the same pages in that language,
the header ends with a link to the page in the other language, and `<head>` gets `hreflang` alternates. The check
(`lernapps-check`) requires `<html lang="en">` in the English tree and the privacy notice and imprint in the page's
own language (`/privacy/`, `/en/privacy/`).

- A page that exists in one language only passes it: `{% laHeader page.url, "de" %}` (and in `laHead`); it gets no
  language switch. A text that exists in one language only at an address without a language root (the tooling and
  the platform design are English) keeps the frame of its address, German, with `lang="de"` on header and footer:
  an English frame there would lead every navigation link into the English tree, and with no German page to switch
  to, the reader would have no way back. `lernapps-frame` does this by itself and shows the switch only where the
  same page exists in the other language.
- Adding a language: add it to `LANGUAGES` and to the texts in `nav.js`, then give every site a tree for it.
- Sites that are not translated yet (`/mathe-karte/`) are not in `TRANSLATED_SITES`: links to them stay as they are.

## Rules

- No dependencies, no build step: the files are used as they are.
- Links to pages of the own site go through `link()` / the filter `own`, so they stay inside a preview.
  Icons and the mark (`SHARED_ASSETS`) are always taken from the home site.
- The texts are plain (ISO 24495-1), like all texts for learners, teachers and parents: German is the source, English the translation. Both live side by side in `nav.js`.
- A change here changes every site: check it in the previews of apps and docs after Renovate bumps them.
- The frame never carries the usage counter: apps use the frame too, and apps are never counted. The platform sites
  add the counter themselves (see [Usage counter](../README.md#usage-counter)).
