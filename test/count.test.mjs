// The usage counter of the platform sites (src/lernapps-count.njk): not part of the shared site frame, so an app
// never gets it, and site-check fails an app that carries it.
import { spawnSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";
import assert from "node:assert/strict";
import { head, header, footer } from "../site-frame/frame.js";
import { SITES, LANGUAGE_KEY } from "../site-frame/nav.js";

const repo = resolve(dirname(fileURLToPath(import.meta.url)), "..");

test("the site frame never carries the counter", () => {
  for (const site of ["/", ...SITES]) {
    const frame = head({ site, path: site }) + header({ site, path: site }) + footer({ site, path: site });
    // The one script the frame may carry is the language switch's (frame.js, languageScript).
    const scripts = frame.match(/<script\b[\s\S]*?<\/script>/gi) ?? [];
    for (const script of scripts) assert.ok(script.startsWith("<script>") && script.includes(LANGUAGE_KEY), script);
    assert.doesNotMatch(frame, /lernapps-count|goatcounter/i, site);
  }
});

test("site-check fails an app that carries the counter, and lets a platform site have it", () => {
  const out = mkdtempSync(join(tmpdir(), "count-check-"));
  try {
    writeFileSync(
      join(out, "index.html"),
      '<!doctype html><html lang="de"><head><script src="/lernapps-count.js" defer></script></head>' +
        '<body><a href="/privacy/">Datenschutz</a> <a href="/imprint/">Impressum</a></body></html>',
    );
    const env = Object.fromEntries(Object.entries(process.env).filter(([k]) => k !== "SITE_PATH_PREFIX"));
    const check = (site) =>
      spawnSync(process.execPath, [join(repo, "site-frame", "check.mjs"), "--site", site, "--out", out], {
        encoding: "utf8",
        env,
      });
    const app = check("/mathe-karte/");
    assert.equal(app.status, 1, app.stdout);
    assert.match(app.stderr, /usage counter outside the platform sites/);
    for (const site of ["/apps/", "/docs/", "/tooling/"]) assert.equal(check(site).status, 0, site);
  } finally {
    rmSync(out, { recursive: true, force: true });
  }
});
