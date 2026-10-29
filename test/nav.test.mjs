// The navigation of the frame: the row of links for a wide screen and the menu for a phone have the same links, in
// both languages, and the groups of the menu cover every link exactly once.
import { test } from "node:test";
import assert from "node:assert/strict";
import { nav, LANGUAGES } from "../site-frame/nav.js";
import { header } from "../site-frame/frame.js";

const hrefs = (html) => [...html.matchAll(/<a href="([^"]+)"/g)].map((m) => m[1]);
const parts = (html) => ({
  bar: html.match(/<nav class="la-nav la-nav--bar"[\s\S]*?<\/nav>/)[0],
  menu: html.match(/<details class="la-menu">[\s\S]*?<\/details>/)[0],
});

test("every link is in exactly one group", () => {
  const grouped = nav.groups.flatMap((g) => g.links.map((l) => l.href)).sort();
  assert.deepEqual(grouped, nav.links.map((l) => l.href).sort());
});

test("groups have a name in every language, and no group is named like one of its links", () => {
  for (const g of nav.groups) {
    for (const lang of LANGUAGES) {
      assert.ok(g.label[lang], `a group has no name in ${lang}`);
      assert.ok(!g.links.some((l) => l.label[lang] === g.label[lang]), `${g.label[lang]} is also a link`);
    }
  }
});

for (const [lang, path] of [["de", "/features/"], ["en", "/en/features/"]]) {
  test(`header (${lang}): the row and the menu have the same links, and mark the current page`, () => {
    const html = header({ site: "/", path });
    const { bar, menu } = parts(html);
    assert.equal((html.match(/<nav /g) ?? []).length, 2);
    assert.deepEqual(hrefs(menu).sort(), hrefs(bar).sort());
    assert.ok(hrefs(menu).length > nav.links.length, "the language switch is in the menu too");
    for (const part of [bar, menu]) {
      assert.equal((part.match(/aria-current="page"/g) ?? []).length, 1);
      assert.match(part, /data-la-lang=/);
    }
  });
}

test("header: the menu button speaks the language of the page", () => {
  assert.match(header({ site: "/", path: "/" }), /<summary>Menü<\/summary>/);
  assert.match(header({ site: "/", path: "/en/" }), /<summary>Menu<\/summary>/);
});

test("header: the menu names its groups and labels each list with its name", () => {
  const { menu } = parts(header({ site: "/", path: "/tutor/" }));
  for (const [i, g] of nav.groups.entries()) {
    assert.ok(menu.includes(`id="la-menu-${i}">${g.label.de}</p>`));
    assert.ok(menu.includes(`<ul aria-labelledby="la-menu-${i}">`));
  }
});
