// The built page "Get involved" (/join/), in both languages: every link of the row of roles at the top shows an icon, not
// the name of the icon as text. Runs against _site/ (npm run build first); without it the tests are skipped.
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const pages = { de: "_site/join/index.html", en: "_site/en/join/index.html" };
const built = Object.values(pages).every((p) => existsSync(p));
const skip = built ? false : "run npm run build first";

for (const [lang, file] of Object.entries(pages)) {
  test(`join (${lang}): each role in the row at the top has an icon, and no icon name is shown as text`, { skip }, () => {
    const html = readFileSync(file, "utf8");
    const roles = [...html.matchAll(/<li><a href="#([a-z-]+)" class="[^"]*rounded-full[^"]*">(.*?)<\/a><\/li>/g)];
    assert.ok(roles.length >= 4, `found ${roles.length} roles`);
    for (const [, id, inner] of roles) {
      assert.match(inner, /<svg class="icon /, `${id} has no icon`);
      assert.doesNotMatch(inner, /<span[^>]*>[a-z0-9-]+<\/span>/, `${id} shows an icon name as text`);
    }
  });
}
