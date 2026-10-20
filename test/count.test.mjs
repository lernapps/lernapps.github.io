// The usage counter (site-frame/count.js): only on the platform's own sites, never in an app or a preview.
import { spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";
import assert from "node:assert/strict";
import { head, COUNT_SCRIPT } from "../site-frame/frame.js";
import { COUNTER, COUNTED_SITES, SITES } from "../site-frame/nav.js";

const repo = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const counter = "https://example.goatcounter.com/count";

test("off while COUNTER is empty", () => {
  if (COUNTER) return;
  for (const site of COUNTED_SITES) assert.ok(!head({ site, path: site }).includes(COUNT_SCRIPT), site);
});

test("on the platform sites, it counts the canonical path of the page", () => {
  for (const site of COUNTED_SITES) {
    const html = head({ site, path: `${site}en/`, counter });
    assert.ok(html.includes(`<script src="${COUNT_SCRIPT}" data-endpoint="${counter}" data-path="${site}en/" defer>`), site);
  }
});

test("never in an app, never in a preview", () => {
  for (const site of SITES.filter((s) => !COUNTED_SITES.includes(s))) {
    assert.ok(!head({ site, path: site, counter }).includes(COUNT_SCRIPT), site);
  }
  assert.ok(!head({ site: "/apps/", path: "/apps/", counter, preview: true }).includes(COUNT_SCRIPT));
});

test("lernapps-check fails an app that carries the counter", () => {
  const out = mkdtempSync(join(tmpdir(), "count-check-"));
  try {
    const page = (body) =>
      `<!doctype html><html lang="de"><head>${body}</head><body><a href="/privacy/">Datenschutz</a> <a href="/imprint/">Impressum</a></body></html>`;
    mkdirSync(out, { recursive: true });
    writeFileSync(join(out, "index.html"), page(`<script src="${COUNT_SCRIPT}" data-endpoint="${counter}" defer></script>`));
    const check = (site) =>
      spawnSync(process.execPath, [join(repo, "site-frame", "check.mjs"), "--site", site, "--out", out], {
        encoding: "utf8",
        env: Object.fromEntries(Object.entries(process.env).filter(([k]) => k !== "SITE_PATH_PREFIX")),
      });
    const app = check("/mathe-karte/");
    assert.equal(app.status, 1, app.stdout);
    assert.match(app.stderr, /usage counter outside the platform sites/);
    assert.equal(check("/apps/").status, 0);
  } finally {
    rmSync(out, { recursive: true, force: true });
  }
});
