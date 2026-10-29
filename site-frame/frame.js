// Renders the site frame of every lernapps.net site as HTML strings: skip link, preview banner, header with the
// shared navigation and language switch, footer with privacy notice and imprint (required on every page). No
// dependencies, so it runs in Eleventy (eleventy.js) and in plain build scripts (inject.mjs).
//
//   import { head, header, footer } from "@lernapps/site/frame";
//   header({ site: "/apps/", path: "/apps/enter/", prefix: "/apps/" })
//
// site: the path prefix this repo is served at on lernapps.net ("/", "/apps/", "/docs/").
// prefix: where this build is served; differs from site only in a pull request preview
//   ("/apps/pr-preview/pr-12/"). Links to pages of this site get it, links to other sites don't.
// path: the canonical path of the page (site + page URL), to mark the current navigation entry. German is at the
//   root of a site, English below its language root (site + "en/" + …): that is how the frame knows the language
//   of a page, and where the same page is in the other languages.
// lang: the language of the frame (default: from path). The frame always speaks the language of the tree, also
//   around a text in another language (the tooling and the platform design are English in the German tree too).
//   Header, footer, skip link and banner carry lang, so they are read right inside a page of another language.
// languages: the languages the page exists in, German first (default: all of LANGUAGES). The language switch links
//   to the same page in the others; a page that exists in one language shows no switch.
// textLang: the language of the text (default: lang). If it differs, a line above the content says that the page
//   is not available in the language of the frame.
//
// The language a reader sees is the language of their browser, until they choose another with the switch: on a
// page with a language switch, a small script in <head> goes to the same page in that language. Only a choice that
// differs from the browser is kept (localStorage, LANGUAGE_KEY); choosing the browser's language again removes it.
import {
  SITES,
  LANGUAGES,
  TRANSLATED_SITES,
  LANGUAGE_KEY,
  languageRoot,
  languageName,
  nav,
  footer as foot,
  texts,
} from "./nav.js";

const ORIGIN = "https://lernapps.net";

/** Files of the home site that every site links root-relative, also from a preview (icons, the mark). */
export const SHARED_ASSETS = ["/favicon.ico", "/favicon.svg", "/apple-touch-icon.png", "/brand/"];

const esc = (s) =>
  String(s).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");

/** The site (repo) a root-relative path belongs to. */
export const siteOf = (href) => SITES.filter((s) => href.startsWith(s)).sort((a, b) => b.length - a.length)[0] ?? "/";

/** The language of a page, from its path: below the language root of its site, else German. */
export function languageOf(path) {
  const site = siteOf(path);
  return LANGUAGES.find((lang) => lang !== "de" && path.startsWith(site + languageRoot(lang))) ?? "de";
}

/**
 * The path of the same page in `lang`, from a path in any language. Sites without a tree in `lang` (and external
 * links) stay as they are.
 */
export function pathIn(path, lang) {
  if (!path.startsWith("/") || path.startsWith("//")) return path;
  const site = siteOf(path);
  const own = languageOf(path);
  const german = own === "de" ? path : site + path.slice((site + languageRoot(own)).length);
  if (lang === "de" || !TRANSLATED_SITES.includes(site)) return german;
  return site + languageRoot(lang) + german.slice(site.length);
}

/** A text from a map by language, or a plain text that is the same in every language. */
const pick = (value, lang) => (typeof value === "string" ? value : (value[lang] ?? value.de));

/** Href for a link: pages of this site get the build's prefix, everything else stays as it is. */
export function link(href, { site = "/", prefix = site } = {}) {
  if (!href.startsWith("/") || href.startsWith("//") || siteOf(href) !== site) return href;
  return prefix + href.slice(site.length);
}

/** The address of a navigation or footer entry for a reader of `lang`: the same page in `lang`, or the one given. */
const entryHref = (l, lang) => (typeof l.href === "string" ? pathIn(l.href, lang) : pick(l.href, lang));

/** The navigation entry a page belongs to: the longest href that the page's German path starts with. */
const currentHref = (path) =>
  nav.links
    .map((l) => pick(l.href, "de"))
    .filter((h) => h.startsWith("/") && pathIn(path, "de").startsWith(h))
    .sort((a, b) => b.length - a.length)[0];

/** The files a site serves next to its pages: source in this folder → published name. */
export const STYLES = { "tokens.css": "lernapps-tokens.css", "frame.css": "lernapps-frame.css" };

/**
 * The other languages the page exists in, from `languages` (default: all): [{ lang, path }]. A page that has the
 * same address in the other language (a text that exists in one language only) has none.
 */
const otherLanguages = (path, lang, languages = LANGUAGES) =>
  TRANSLATED_SITES.includes(siteOf(path))
    ? languages
        .filter((l) => l !== lang && pathIn(path, l) !== path)
        .map((l) => ({ lang: l, path: pathIn(path, l) }))
    : [];

/**
 * The script of the language choice: on a page in `lang` with the same page at `alternates` ({ lang: href }), go to
 * the language the reader chose, else to their browser's; remember a choice by the switch only if it differs from
 * the browser. Nothing happens for crawlers, so that search engines see every language at its address.
 */
const languageScript = (lang, alternates) => `<script>(() => {
  const key = ${JSON.stringify(LANGUAGE_KEY)}, here = ${JSON.stringify(lang)}, pages = ${JSON.stringify(alternates)};
  const known = ${JSON.stringify(LANGUAGES)};
  const browser = (navigator.languages || [navigator.language]).map((l) => String(l).slice(0, 2).toLowerCase()).find((l) => known.includes(l));
  let chosen = null;
  try { chosen = localStorage.getItem(key); } catch {}
  const wanted = known.includes(chosen) ? chosen : browser;
  if (wanted && wanted !== here && pages[wanted] && !/bot|crawl|spider|slurp/i.test(navigator.userAgent)) {
    location.replace(pages[wanted] + location.search + location.hash);
    return;
  }
  document.addEventListener("click", (e) => {
    const a = e.target.closest && e.target.closest("a[data-la-lang]");
    if (!a) return;
    try { a.dataset.laLang === browser ? localStorage.removeItem(key) : localStorage.setItem(key, a.dataset.laLang); } catch {}
  });
})();</script>`;

/**
 * For <head>: icons (served by the home site), the tokens and the site frame's stylesheet; with `path`, also
 * links to the page in its languages (hreflang), for search engines, and the script of the language choice.
 */
export function head({ site = "/", prefix = site, path, lang = path && languageOf(path), languages } = {}) {
  const others = path ? otherLanguages(path, lang, languages) : [];
  const alternates = others.length
    ? [{ lang, path }, ...others].map(
        (o) => `<link rel="alternate" hreflang="${o.lang}" href="${esc(link(o.path, { site, prefix }))}">`,
      )
    : [];
  return [
    '<link rel="icon" href="/favicon.ico" sizes="32x32">',
    '<link rel="icon" href="/favicon.svg" type="image/svg+xml">',
    '<link rel="apple-touch-icon" href="/apple-touch-icon.png">',
    ...Object.values(STYLES).map((css) => `<link rel="stylesheet" href="${esc(prefix + css)}">`),
    ...alternates,
    ...(others.length
      ? [languageScript(lang, Object.fromEntries(others.map((o) => [o.lang, link(o.path, { site, prefix })])))]
      : []),
  ].join("\n");
}

/** Skip link, preview banner (only if preview), header with the shared navigation and language switch. */
export function header({
  site = "/",
  prefix = site,
  path = site,
  preview = false,
  main = "main-content",
  lang = languageOf(path),
  languages,
  textLang = lang,
} = {}) {
  const t = texts[lang];
  const current = currentHref(path);
  const entry = (l) => {
    const href = entryHref(l, lang);
    const external = /^https?:/.test(href) ? ' rel="noopener"' : "";
    const cur = pick(l.href, "de") === current ? ' aria-current="page"' : "";
    return `<a href="${esc(link(href, { site, prefix }))}"${cur}${external}>${esc(pick(l.label, lang))}</a>`;
  };
  const switchItems = otherLanguages(path, lang, languages).map(
    (o) =>
      `<li class="la-lang"><a href="${esc(link(o.path, { site, prefix }))}" hreflang="${o.lang}" lang="${o.lang}" data-la-lang="${o.lang}" aria-label="${esc(texts[o.lang].languageSwitch)}: ${esc(languageName[o.lang])}">${esc(languageName[o.lang])}</a></li>`,
  );
  // Two navigations with the same links, one of them hidden by CSS (display: none, so that assistive technology
  // sees only one): the row of links for a wide screen, and the menu for a phone. A closed <details> hides its
  // content on every screen, and without a script it cannot be closed on a phone only.
  const bar = [...nav.links.map((l) => `<li>${entry(l)}</li>`), ...switchItems];
  const groups = nav.groups
    .map(
      (g, i) =>
        `<div class="la-menu__group"><p class="la-menu__title" id="la-menu-${i}">${esc(pick(g.label, lang))}</p><ul aria-labelledby="la-menu-${i}">${g.links.map((l) => `<li>${entry(l)}</li>`).join("")}</ul></div>`,
    )
    .join("");
  const menuLang = switchItems.length ? `<ul class="la-menu__lang">${switchItems.join("")}</ul>` : "";
  const banner = preview
    ? `<p class="la-preview" lang="${lang}">${esc(t.preview)} <a href="${esc(ORIGIN + path)}">lernapps.net${esc(path)}</a></p>`
    : "";
  const fallback =
    textLang !== lang
      ? `\n<p class="la-fallback" lang="${lang}">${esc(t.fallback)}</p>`
      : "";
  const home = pathIn("/", lang);
  return `<a class="la-skip" href="#${esc(main)}" lang="${lang}">${esc(t.skipLink)}</a>
${banner}<header class="la-header" lang="${lang}">
  <div class="la-header__inner">
    <a class="la-brand" href="${esc(link(home, { site, prefix }))}" aria-label="${esc(nav[lang].homeLabel)}"${path === home ? ' aria-current="page"' : ""}><img src="/brand/mark-plain.svg" alt=""><span>lernapps<span class="la-brand__tld">.net</span></span></a>
    <nav class="la-nav la-nav--bar" aria-label="${esc(nav[lang].ariaLabel)}"><ul>${bar.join("")}</ul></nav>
    <details class="la-menu"><summary>${esc(t.menu)}</summary><nav class="la-nav la-nav--menu" aria-label="${esc(nav[lang].ariaLabel)}">${groups}${menuLang}</nav></details>
  </div>
</header>${fallback}`;
}

/** Footer: the free-and-thanks line, privacy notice, imprint, platform design and this site's source. */
export function footer({ site = "/", prefix = site, source, path = site, lang = languageOf(path) } = {}) {
  const f = foot[lang];
  const links = [
    ...foot.links.map((l) => ({
      href: entryHref(l, lang),
      text: pick(l.label, lang),
    })),
    ...(source ? [{ href: source, text: f.sourceLabel }] : []),
  ]
    .map((l) => `<li><a href="${esc(link(l.href, { site, prefix }))}">${esc(l.text)}</a></li>`)
    .join("");
  return `<footer class="la-footer" lang="${lang}">
  <div class="la-footer__inner">
    <p>${esc(f.free)}</p>
    <nav aria-label="${esc(f.ariaLabel)}"><ul>${links}</ul></nav>
  </div>
</footer>`;
}
