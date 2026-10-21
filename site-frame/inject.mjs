#!/usr/bin/env node
// Puts the shared site frame into HTML that was not built with Eleventy (the docs: biz42, pdt42, vision):
// head links (and noindex in a preview) before </head>, skip link, banner and header after <body>, footer before </body>, and copies
// the stylesheets into the output folder. Idempotent: a page that has the site frame already is left alone.
//
//   lernapps-frame --site /docs/ --source https://github.com/lernapps/docs --out _site [--main id]
//
// Takes every *.html below --out. Prefix and preview come from SITE_PATH_PREFIX and SITE_PREVIEW.
// The page path for the current navigation entry is site + the file's folder. German pages are at the root of the
// site, English ones below en/ (see frame.js); a page gets a language switch for the languages that have the same page.
//
// The frame always speaks the language the reader chose, the text falls back to the language it exists in: a page
// that exists in one language only (the tooling and the platform design are English) is first copied, with the
// files next to it, into the tree of every other language, and each copy gets the frame of its tree. So the
// navigation never takes a reader into another language, and the language switch always has a way back.
import { readFileSync, writeFileSync, readdirSync, copyFileSync, existsSync, mkdirSync, cpSync } from "node:fs";
import { join, relative, dirname, basename } from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";
import { head, header, footer, link, siteOf, STYLES, languageOf, pathIn } from "./frame.js";
import { LANGUAGES, TRANSLATED_SITES, languageRoot } from "./nav.js";

const { values: a } = parseArgs({
  options: { site: { type: "string" }, source: { type: "string" }, out: { type: "string" }, main: { type: "string" } },
});
if (!a.site || !a.out) {
  console.error("usage: lernapps-frame --site /docs/ --out _site [--source <repo url>] [--main <id>]");
  process.exit(2);
}
const site = a.site;
const prefix = process.env.SITE_PATH_PREFIX ?? site;
const preview = Boolean(process.env.SITE_PREVIEW);
const MARK = "<!-- lernapps-frame -->";

const here = dirname(fileURLToPath(import.meta.url));
for (const [src, out] of Object.entries(STYLES)) copyFileSync(join(here, src), join(a.out, out));

const files = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? files(join(dir, e.name)) : e.name.endsWith(".html") ? [join(dir, e.name)] : [],
  );

/** Is there a built page at this canonical path of the site? */
const pageExists = (path) => path.startsWith(site) && existsSync(join(a.out, path.slice(site.length), "index.html"));

// The folders of the site that hold a page, as canonical paths ("/tooling/", "/tooling/rules/").
const pageDirs = files(a.out)
  .filter((f) => basename(f) === "index.html")
  .map((f) => relative(a.out, dirname(f)).split("\\").join("/"))
  .map((rel) => site + (rel ? rel + "/" : ""));

/** Is there a page at this canonical path once every page is in every language? */
const willExist = (path) => pageDirs.some((p) => p === path || pathIn(p, languageOf(path)) === path);

/** The folder of a canonical path in the output. */
const dirOf = (path) => join(a.out, path.slice(site.length));

/**
 * Links in a copy of the page at `from`, made at `to`: a link to a page goes to the same page in the copy's
 * language (of this site if it is built, of another translated site always: those have every page in every
 * language), a file next to the page is copied along, and a file outside the page's folder keeps its address.
 */
function localize(html, from, to) {
  const lang = languageOf(to);
  const at = (url, base) => new URL(url, "https://lernapps.net" + base).pathname;
  return html.replace(/(\b(?:href|src)=")([^"#?]*)(?=[#?"])/gi, (all, attr, url) => {
    if (!url || /^[a-z][a-z0-9+.-]*:/i.test(url) || url.startsWith("//")) return all;
    if (url.startsWith("/")) {
      if (!url.endsWith("/")) return all;
      if (!url.startsWith(prefix)) {
        return siteOf(url) !== site && TRANSLATED_SITES.includes(siteOf(url)) ? attr + pathIn(url, lang) : all;
      }
      const there = pathIn(site + url.slice(prefix.length), lang);
      return willExist(there) ? attr + link(there, { site, prefix }) : all;
    }
    const original = at(url, from);
    if (original.startsWith(from)) return all; // copied along
    if (url.endsWith("/") && willExist(at(url, to))) return all;
    return attr + link(original, { site, prefix });
  });
}

// A page missing in a language is copied there with the files of its folder and its subfolders that hold no page
// of their own (assets, schemas); subfolders with a page are copied on their own, the language roots never.
const roots = LANGUAGES.filter((l) => l !== "de").map((l) => site + languageRoot(l));
let copies = 0;
if (TRANSLATED_SITES.includes(site)) {
  for (const path of pageDirs) {
    const from = languageOf(path);
    for (const lang of LANGUAGES.filter((l) => l !== from)) {
      const target = pathIn(path, lang);
      if (pageDirs.includes(target)) continue;
      const copyFolder = (src, dst, top) => {
        mkdirSync(dst, { recursive: true });
        for (const e of readdirSync(src, { withFileTypes: true })) {
          const s = join(src, e.name);
          const d = join(dst, e.name);
          if (!e.isDirectory()) {
            if (existsSync(d)) continue;
            if (e.name.endsWith(".html")) writeFileSync(d, localize(readFileSync(s, "utf8"), path, target));
            else copyFileSync(s, d);
            continue;
          }
          const sub = site + relative(a.out, s).split("\\").join("/") + "/";
          if (top && roots.includes(sub)) continue;
          if (existsSync(join(s, "index.html"))) continue;
          cpSync(s, d, { recursive: true, force: false });
        }
      };
      copyFolder(dirOf(path), dirOf(target), true);
      copies++;
    }
  }
}

let n = 0;
for (const file of files(a.out)) {
  let html = readFileSync(file, "utf8");
  if (html.includes(MARK) || !/<body[^>]*>/i.test(html)) continue;
  const rel = relative(a.out, dirname(file)).split("\\").join("/");
  const path = site + (rel ? rel + "/" : "");
  // The frame speaks the language of the tree the page is in, whatever the language of its text.
  const lang = languageOf(path);
  const textLang = html.match(/<html[^>]*\slang="([a-z]{2})/i)?.[1]?.toLowerCase() ?? lang;
  const languages = LANGUAGES.filter((l) => l === lang || pageExists(pathIn(path, l)));
  // The skip link's target: --main, else the page's <main id>, else an anchor right after the header.
  const main = a.main ?? html.match(/<main[^>]*\bid="([^"]+)"/i)?.[1];
  const anchor = main ? "" : '\n<div id="main-content" tabindex="-1"></div>';
  html = html
    .replace(/<\/head>/i, `${MARK}\n${preview ? '<meta name="robots" content="noindex">\n' : ""}${head({ site, prefix, path, lang, languages })}\n</head>`)
    .replace(/<body[^>]*>/i, (body) => `${body}\n${header({ site, prefix, path, lang, preview, languages, textLang, main: main ?? "main-content" })}${anchor}`)
    .replace(/<\/body>(?![\s\S]*<\/body>)/i, `${footer({ site, prefix, path, lang, source: a.source })}\n</body>`);
  writeFileSync(file, html);
  n++;
}
console.log(`lernapps-frame: ${n} pages in ${a.out}${copies ? `, ${copies} of them copied into another language` : ""}`);
