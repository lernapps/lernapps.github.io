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
import { readFileSync, writeFileSync, readdirSync, copyFileSync, existsSync } from "node:fs";
import { join, relative, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";
import { head, header, footer, STYLES, languageOf, pathIn } from "./frame.js";
import { LANGUAGES } from "./nav.js";

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

let n = 0;
for (const file of files(a.out)) {
  let html = readFileSync(file, "utf8");
  if (html.includes(MARK) || !/<body[^>]*>/i.test(html)) continue;
  const rel = relative(a.out, dirname(file)).split("\\").join("/");
  const path = site + (rel ? rel + "/" : "");
  // The frame speaks the language of the address, not of the text: a text that exists in one language only, at an
  // address without a language root (the tooling and the platform design are English), keeps the German frame, so
  // that its navigation does not take the reader into the English tree with no way back.
  const lang = languageOf(path);
  const languages = LANGUAGES.filter((l) => l === lang || pageExists(pathIn(path, l)));
  // The skip link's target: --main, else the page's <main id>, else an anchor right after the header.
  const main = a.main ?? html.match(/<main[^>]*\bid="([^"]+)"/i)?.[1];
  const anchor = main ? "" : '\n<div id="main-content" tabindex="-1"></div>';
  html = html
    .replace(/<\/head>/i, `${MARK}\n${preview ? '<meta name="robots" content="noindex">\n' : ""}${head({ site, prefix, path, lang, languages })}\n</head>`)
    .replace(/<body[^>]*>/i, (body) => `${body}\n${header({ site, prefix, path, lang, preview, languages, main: main ?? "main-content" })}${anchor}`)
    .replace(/<\/body>(?![\s\S]*<\/body>)/i, `${footer({ site, prefix, path, lang, source: a.source })}\n</body>`);
  writeFileSync(file, html);
  n++;
}
console.log(`lernapps-frame: ${n} pages in ${a.out}`);
