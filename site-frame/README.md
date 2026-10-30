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
| `nav.js` | The navigation and footer links of all sites in every language (`LANGUAGES`), the groups of the navigation links for the menu on a phone, and which path belongs to which repo (`SITES`, `TRANSLATED_SITES`) |
| `frame.js` | `head()`, `header()`, `footer()`, `link()`, `languageOf()` and `pathIn()`: render the site frame as HTML strings |
| `eleventy.js` | Eleventy plugin: shortcodes `laHead`, `laHeader`, `laFooter`, filter `own`, copies the CSS |
| `inject.mjs` | CLI `lernapps-frame` for sites not built with Eleventy (docs): adds the site frame to built HTML |
| `check.mjs` | CLI `site-check`: the deploy check of every site (no external resources, links, privacy notice and imprint linked, the usage counter only on the platform sites) |

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

Check before deploy: `site-check --site /apps/` (`--out _site` is the default). The old name `lernapps-check` still works until
every repository uses `site-check`.

Both read `SITE_PATH_PREFIX` (where a pull request preview is served, e.g. `/apps/pr-preview/pr-12/`) and
`SITE_PREVIEW` (show the preview banner), which the shared workflows in lernapps/tooling set.

## Languages

German is at the root of every site, English below `en/` of it: `/`, `/en/`; `/apps/`, `/apps/en/`; `/docs/`,
`/docs/en/`. The same page has the same address within each tree (`pathIn(path, "en")` maps one to the other), and
the frame reads the language of a page from its address: below the language root it is English. So the header, the
footer and the skip link speak the language of the page, the navigation leads to the same pages in that language,
the header ends with a link to the page in the other language, and `<head>` gets `hreflang` alternates. The check
(`site-check`) requires `<html lang="en">` in the English tree and the privacy notice and imprint in the page's
own language (`/privacy/`, `/en/privacy/`).

- The frame always speaks the language the reader chose, the text falls back to the language it exists in. A text
  that exists in one language only (the tooling and the platform design are English) is served in every tree:
  `lernapps-frame` copies its page, with the files of its folder, into the trees it is missing from, and every copy
  gets the frame of its tree and a language switch; links to pages in a copy go to the same page in its language.
  `/tooling/` and `/tooling/en/` show the same English text, one with the German, one with the English frame.
  Where the text is in another language than the frame, a line above the content says so ("Diese Seite gibt es
  nicht auf Deutsch."; `header({ textLang })`, from the page's `<html lang>`).
- The language chosen is the browser's, until the reader picks another with the switch. On every page with a
  language switch, a small inline script in `<head>` goes to the same page in that language (not for crawlers, so
  search engines find every language at its address). A choice by the switch is kept in `localStorage`
  (`lernapps-lang`) only if it differs from the browser's language; choosing the browser's language removes it.
  The privacy notice says so.
  An Eleventy page that exists in one language only passes it: `{% laHeader page.url, "de" %}` (and in `laHead`);
  it gets no language switch (only the 404 page does this).
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

## The header on a phone

On a wide screen the header shows the links in one row. Up to 40 rem it shows a "Menu" button instead, which opens the
links in groups (`nav.groups` in `nav.js`: for learners, for makers, understand and join in). It is a `<details>`, so it
needs no script. A closed `<details>` hides its content on every screen and cannot be closed on a phone only, so
`header()` writes two navigations with the same links, the row (`la-nav--bar`) and the menu (`la-menu`), and
`frame.css` shows one of them (`display: none` on the other, so that assistive technology reads only one). A new link
goes into `links` and into exactly one group; `test/nav.test.mjs` checks both. A link may have a `menuLabel`: the
longer name in the menu, where there is more room than in the row ("Katalog" in the row, "App Katalog" in the menu).

## Dark mode of the tokens (opt-in)

`tokens.css` has dark values for the tokens of the page itself (`--la-text`, `--la-muted`, `--la-link`,
`--la-surface`, `--la-border`). They apply only to a site that sets `data-la-theme="auto"` on `<html>`, and then only
when the system asks for a dark mode (`prefers-color-scheme`). They are opt-in because a site that uses the text token
but paints its own background would get light text on white: /practice/ does. A site that opts in also sets
`color-scheme: light dark` for itself and checks every colour of its own next to the tokens. The header, the footer and
the dark sections are dark in both modes. The pages of the home site do not use the tokens for their page colours; they
follow the dark mode with their own rules (`uno.config.js`, `src/home.css`).
