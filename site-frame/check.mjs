#!/usr/bin/env node
// Checks a built lernapps.net site before it is deployed; the same rules for every site on the origin:
// - no external resources (scripts, styles, images, frames, fonts) in HTML or CSS: nothing is loaded
//   from another server without a click
// - every link to a page of this site points to an existing file; in a pull request preview, no link
//   leaves the preview by accident
// - every page links the privacy notice and the imprint (required by law on every page)
// - none of the --forbid markers is left in a page (e.g. a placeholder for missing contact data)
//
//   lernapps-check --site /apps/ [--out _site] [--forbid TODO-EMAIL]
//
// The build's prefix comes from SITE_PATH_PREFIX, as in the build. No dependencies.
import { readFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { parseArgs } from "node:util";
import { siteOf, link, SHARED_ASSETS } from "./frame.js";

const { values: a } = parseArgs({
  options: {
    site: { type: "string" },
    out: { type: "string", default: "_site" },
    forbid: { type: "string", multiple: true, default: [] },
  },
});
if (!a.site) {
  console.error("usage: lernapps-check --site /apps/ [--out _site] [--forbid <text>]");
  process.exit(2);
}
const site = a.site;
const prefix = process.env.SITE_PATH_PREFIX ?? site;
const ROOT = resolve(a.out);
const OWN_ORIGIN = "https://lernapps.net/";
const LEGAL = ["/privacy/", "/imprint/"].map((p) => link(p, { site, prefix }));
const errors = [];

if (!existsSync(join(ROOT, "index.html"))) {
  console.error(`${ROOT}/index.html missing: build first`);
  process.exit(1);
}

const files = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? files(join(dir, e.name)) : [join(dir, e.name)]));
const isExternal = (url) => /^(https?:)?\/\//i.test(url) && !url.startsWith(OWN_ORIGIN);
const exists = (p) => existsSync(p) && (statSync(p).isFile() || existsSync(join(p, "index.html")));

for (const file of files(ROOT)) {
  const rel = file.slice(ROOT.length + 1);
  if (!/\.(html|css)$/.test(rel)) continue;
  const raw = readFileSync(file, "utf8");
  // Inline scripts are code, not markup: strings like `<img src="${x}">` in them are not links.
  const text = rel.endsWith(".html") ? raw.replace(/(<script\b[^>]*>)[\s\S]*?<\/script>/gi, "$1</script>") : raw;

  if (rel.endsWith(".css")) {
    for (const m of text.matchAll(/url\(\s*["']?([^"')]+)/gi)) {
      if (isExternal(m[1])) errors.push(`${rel}: external url(${m[1]})`);
    }
    for (const m of text.matchAll(/@import\s+(?:url\()?\s*["']?([^"');]+)/gi)) {
      if (isExternal(m[1])) errors.push(`${rel}: external @import ${m[1]}`);
    }
    continue;
  }

  // 404.html only acts at the root of the origin; in a preview it is a plain copy.
  if (prefix !== site && rel === "404.html") continue;

  for (const marker of a.forbid) if (text.includes(marker)) errors.push(`${rel}: contains "${marker}"`);

  for (const m of text.matchAll(/<(script|img|iframe|source|audio|video|embed)\b[^>]*\bsrc="([^"]*)"/gi)) {
    if (isExternal(m[2])) errors.push(`${rel}: external resource <${m[1]} src="${m[2]}">`);
  }
  for (const m of text.matchAll(/<link\b[^>]*\bhref="([^"]*)"/gi)) {
    if (isExternal(m[1]) && !/rel="canonical"/i.test(m[0])) errors.push(`${rel}: external <link href="${m[1]}">`);
  }

  for (const href of LEGAL) if (!text.includes(`href="${href}"`)) errors.push(`${rel}: no link to ${href}`);

  for (const m of text.matchAll(/\b(?:href|src)="([^"#?]*)[^"]*"/gi)) {
    const url = m[1];
    if (!url || /^[a-z][a-z0-9+.-]*:/i.test(url) || url.startsWith("//")) continue;
    if (url.startsWith("/")) {
      if (siteOf(url) !== site) continue; // another repo on the same origin, checked there
      if (url.startsWith(prefix)) {
        if (!exists(join(ROOT, url.slice(prefix.length)))) errors.push(`${rel}: broken link "${url}"`);
      } else if (!SHARED_ASSETS.some((p) => url.startsWith(p))) {
        // A page of this site without the prefix: fine in production (prefix = site), but in a preview it
        // would leave the preview. Use link() / the filter "own".
        errors.push(`${rel}: link "${url}" leaves the preview (use the filter "own")`);
      }
      continue;
    }
    if (!exists(join(dirname(file), url))) errors.push(`${rel}: broken link "${url}"`);
  }
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log(`lernapps-check: ${ROOT} ok (no external resources, links resolve, privacy notice and imprint linked)`);
