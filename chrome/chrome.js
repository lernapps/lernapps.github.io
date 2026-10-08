// Renders the chrome of every lernapps.net site as HTML strings: skip link, preview banner, header with the
// shared navigation, footer with privacy notice and imprint (required on every page). No dependencies, so
// it runs in Eleventy (eleventy.js) and in plain build scripts (inject.mjs).
//
//   import { head, header, footer } from "@lernapps/site/chrome";
//   header({ site: "/apps/", path: "/apps/eintragen/", prefix: "/apps/" })
//
// site: the path prefix this repo is served at on lernapps.net ("/", "/apps/", "/docs/").
// prefix: where this build is served; differs from site only in a pull request preview
//   ("/apps/pr-preview/pr-12/"). Links to pages of this site get it, links to other sites don't.
// path: the canonical path of the page (site + page URL), to mark the current navigation entry.
import { SITES, nav, footer as foot, texts } from "./nav.js";

const ORIGIN = "https://lernapps.net";

/** Files of the home site that every site links root-relative, also from a preview (icons, the mark). */
export const SHARED_ASSETS = ["/favicon.ico", "/favicon.svg", "/apple-touch-icon.png", "/brand/"];

const esc = (s) =>
  String(s).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");

/** The site (repo) a root-relative path belongs to. */
export const siteOf = (href) => SITES.filter((s) => href.startsWith(s)).sort((a, b) => b.length - a.length)[0] ?? "/";

/** Href for a link: pages of this site get the build's prefix, everything else stays as it is. */
export function link(href, { site = "/", prefix = site } = {}) {
  if (!href.startsWith("/") || href.startsWith("//") || siteOf(href) !== site) return href;
  return prefix + href.slice(site.length);
}

/** The navigation entry a page belongs to: the longest href that the path starts with. */
const currentHref = (path) =>
  nav.links
    .map((l) => l.href)
    .filter((h) => h.startsWith("/") && path.startsWith(h))
    .sort((a, b) => b.length - a.length)[0];

/** The files a site serves next to its pages: source in this folder → published name. */
export const STYLES = { "tokens.css": "lernapps-tokens.css", "chrome.css": "lernapps-chrome.css" };

/** For <head>: icons (served by the home site), the tokens and the chrome's stylesheet. */
export function head({ site = "/", prefix = site } = {}) {
  return [
    '<link rel="icon" href="/favicon.ico" sizes="32x32">',
    '<link rel="icon" href="/favicon.svg" type="image/svg+xml">',
    '<link rel="apple-touch-icon" href="/apple-touch-icon.png">',
    ...Object.values(STYLES).map((css) => `<link rel="stylesheet" href="${esc(prefix + css)}">`),
  ].join("\n");
}

/** Skip link, preview banner (only if preview), header with the shared navigation. */
export function header({ site = "/", prefix = site, path = site, preview = false, main = "main-content" } = {}) {
  const current = currentHref(path);
  const items = nav.links
    .map((l) => {
      const externalAttrs = /^https?:/.test(l.href) ? ' rel="noopener"' : "";
      const cur = l.href === current ? ' aria-current="page"' : "";
      return `<li><a href="${esc(link(l.href, { site, prefix }))}"${cur}${externalAttrs}>${esc(l.label)}</a></li>`;
    })
    .join("");
  const banner = preview
    ? `<p class="la-preview">${esc(texts.preview)} <a href="${esc(ORIGIN + path)}">lernapps.net${esc(path)}</a></p>`
    : "";
  return `<a class="la-skip" href="#${esc(main)}">${esc(texts.skipLink)}</a>
${banner}<header class="la-header">
  <div class="la-header__inner">
    <a class="la-brand" href="${esc(link("/", { site, prefix }))}" aria-label="${esc(nav.homeLabel)}"${path === "/" ? ' aria-current="page"' : ""}><img src="/brand/mark-plain.svg" alt=""><span>lernapps<span class="la-brand__tld">.net</span></span></a>
    <nav class="la-nav" aria-label="${esc(nav.ariaLabel)}"><ul>${items}</ul></nav>
  </div>
</header>`;
}

/** Footer: the free-and-thanks line, privacy notice, imprint, platform design and this site's source. */
export function footer({ site = "/", prefix = site, source } = {}) {
  const links = [...foot.links, ...(source ? [{ label: foot.sourceLabel, href: source }] : [])]
    .map((l) => `<li><a href="${esc(link(l.href, { site, prefix }))}">${esc(l.label)}</a></li>`)
    .join("");
  return `<footer class="la-footer">
  <div class="la-footer__inner">
    <p>${esc(foot.free)}</p>
    <nav aria-label="${esc(foot.ariaLabel)}"><ul>${links}</ul></nav>
  </div>
</footer>`;
}
