// Checks the build output in _site/ (run `npm run build` first) before deploy:
// - no external resources (scripts, styles, images, frames, fonts) in HTML or CSS
// - every relative link in HTML points to an existing file
// No dependencies on purpose; replaced by @lernapps/checks once tooling exists (lernapps/.github#5).
import { readFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import legal from "../src/_data/legal.js";

const ROOT = resolve(process.argv[2] ?? "_site");
// Paths on this origin served by other repos (checked there): map, docs, Mathe-Karte.
const OTHER_REPOS = ["/apps/", "/map/", "/docs/", "/mathe-karte"];
// "/" in production; "/pr-preview/pr-<number>/" in a pull request preview (pr-preview.yml).
const PREFIX = process.env.SITE_PATH_PREFIX ?? "/";
const OWN_ORIGIN = "https://lernapps.net/";
const errors = [];

if (!existsSync(join(ROOT, "index.html"))) {
  console.error(`${ROOT}/index.html missing – run \`npm run build\` first`);
  process.exit(1);
}

const files = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? files(join(dir, e.name)) : [join(dir, e.name)],
  );

const isExternal = (url) => /^(https?:)?\/\//i.test(url) && !url.startsWith(OWN_ORIGIN);

for (const file of files(ROOT)) {
  const text = readFileSync(file, "utf8");
  const rel = file.slice(ROOT.length + 1);

  // 404.html only acts at the root of the origin (production); in a preview it is a plain copy.
  if (PREFIX !== "/" && rel === "404.html") continue;

  if (file.endsWith(".html")) {
    // Legal pages must not go live with missing contact data (src/_data/legal.js).
    if (text.includes(legal.emailMissing)) errors.push(`${rel}: contact email missing (set email in src/_data/legal.js)`);
    // Resources: anything loaded without a click.
    for (const m of text.matchAll(/<(script|img|iframe|source|audio|video|embed)\b[^>]*\bsrc="([^"]*)"/gi)) {
      if (isExternal(m[2])) errors.push(`${rel}: external resource <${m[1]} src="${m[2]}">`);
    }
    for (const m of text.matchAll(/<link\b[^>]*\bhref="([^"]*)"/gi)) {
      if (isExternal(m[1]) && !/rel="canonical"/i.test(m[0])) errors.push(`${rel}: external <link href="${m[1]}">`);
    }
    // Relative links and resources must exist, except on paths owned by other repos.
    for (const m of text.matchAll(/\b(?:href|src)="([^"#?]+)[^"]*"/gi)) {
      const url = m[1];
      if (/^[a-z]+:/i.test(url) || url.startsWith("//")) continue;
      // Root-relative, or relative from a file at the root (e.g. "mathe-karte/" in index.html).
      // In a preview, own links carry the prefix; a root link without it would leave the preview.
      if (PREFIX !== "/" && url.startsWith("/") && !url.startsWith(PREFIX) && !OTHER_REPOS.some((p) => url.startsWith(p))) {
        errors.push(`${rel}: link "${url}" leaves the preview (use the "own" filter)`);
        continue;
      }
      const own = url.startsWith(PREFIX) ? "/" + url.slice(PREFIX.length) : url;
      const fromRoot = own.startsWith("/") ? own : "/" + own.replace(/^\.\//, "");
      if (OTHER_REPOS.some((p) => fromRoot.startsWith(p))) continue;
      const target = own.startsWith("/") ? join(ROOT, own) : join(dirname(file), own);
      const exists = existsSync(target) && (statSync(target).isFile() || existsSync(join(target, "index.html")));
      if (!exists) errors.push(`${rel}: broken link "${url}"`);
    }
  }

  if (file.endsWith(".css")) {
    for (const m of text.matchAll(/url\(\s*["']?([^"')]+)/gi)) {
      if (isExternal(m[1])) errors.push(`${rel}: external url(${m[1]})`);
    }
    if (/@import/i.test(text)) errors.push(`${rel}: @import is not allowed`);
  }
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log(`${ROOT}: no external resources, no broken relative links`);
