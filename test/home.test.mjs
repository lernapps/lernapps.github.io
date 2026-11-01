// The built home page, in both languages: the gallery is complete, images are there, nothing loads from elsewhere,
// the two languages are in step and every anchor leads somewhere. Runs against _site/ (npm run build first); without it
// the tests are skipped.
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";

const pages = { de: "_site/index.html", en: "_site/en/index.html" };
const built = Object.values(pages).every((p) => existsSync(p));
const skip = built ? false : "run npm run build first";
const html = (lang) => readFileSync(pages[lang], "utf8");
const count = (s, re) => (s.match(re) ?? []).length;

for (const lang of Object.keys(pages)) {
  test(`home (${lang}): the gallery has one stage and one thumbnail per radio input, one checked`, { skip }, () => {
    const s = html(lang);
    const inputs = count(s, /<input type="radio" name="gallery"/g);
    assert.ok(inputs >= 2);
    assert.equal(count(s, /class="gal-panel"/g), inputs);
    assert.equal(count(s, /<label for="gal-\d+"/g), inputs);
    assert.equal(count(s, /<input type="radio" name="gallery"[^>]*checked/g), 1);
    for (const [, id] of s.matchAll(/<label for="(gal-\d+)"/g)) assert.ok(s.includes(`id="${id}"`), `${id} has an input`);
  });

  test(`home (${lang}): every image has alt text and its file is in the build; the app images have a size`, { skip }, () => {
    for (const [tag] of html(lang).matchAll(/<img [^>]*>/g)) {
      assert.match(tag, /\salt="/, tag);
      const src = tag.match(/\ssrc="([^"]+)"/)?.[1];
      if (src?.startsWith("/")) assert.ok(existsSync(`_site${src}`), `${src} is missing`);
      if (src?.startsWith("/media/apps/")) {
        assert.match(tag, /\swidth="\d+"/, tag);
        assert.match(tag, /\sheight="\d+"/, tag);
      }
    }
  });

  test(`home (${lang}): the dark screenshots exist`, { skip }, () => {
    const sources = [...html(lang).matchAll(/<source [^>]*srcset="([^"]+)"/g)].map((m) => m[1]);
    assert.ok(sources.length > 0);
    for (const src of sources) assert.ok(existsSync(`_site${src}`), `${src} is missing`);
  });

  test(`home (${lang}): nothing is loaded from another address`, { skip }, () => {
    const s = html(lang);
    assert.equal(count(s, /\s(?:src|srcset|poster)="https?:/g), 0);
    assert.equal(count(s, /<link [^>]*href="https?:(?!\/\/lernapps\.net\/)/g), 0);
  });

  test(`home (${lang}): every anchor leads to an id on the page`, { skip }, () => {
    const s = html(lang);
    for (const [, id] of s.matchAll(/href="#([^"]+)"/g)) assert.ok(s.includes(`id="${id}"`), `#${id} has no target`);
  });

  test(`home (${lang}): filled buttons stay few (hero and final call to action only)`, { skip }, () => {
    assert.ok(count(html(lang), /bg-blue-600/g) <= 3);
  });
}

test("home: both languages have the same structure", { skip }, () => {
  const de = html("de");
  const en = html("en");
  for (const re of [/<section /g, /<h2 /g, /<img /g, /<source /g, /<li[ >]/g, /<a /g, /class="mark"/g, /class="tick"/g]) {
    assert.equal(count(de, re), count(en, re), String(re));
  }
});

// Icons instead of emoji: no pictograph is left in the text of any page, and a page with icons defines the filter
// "rough" that the icons use.
const allPages = () => (built ? readdirSync("_site", { recursive: true }).filter((f) => f.endsWith(".html")) : []);

test("pages: no emoji in the built HTML", { skip }, () => {
  for (const f of allPages()) {
    const found = readFileSync(`_site/${f}`, "utf8").match(/\p{Extended_Pictographic}/gu);
    assert.equal(found, null, `${f} has ${found}`);
  }
});

test("pages: a page with icons defines the filter they use", { skip }, () => {
  for (const f of allPages()) {
    const s = readFileSync(`_site/${f}`, "utf8");
    if (s.includes('<svg class="icon')) assert.ok(s.includes('<filter id="rough"'), `${f} has icons but no filter`);
  }
});

// The role card of the hero: one tab and one panel per radio input, one checked, and few buttons per role.
for (const lang of Object.keys(pages)) {
  test(`home (${lang}): the role card has a tab and a panel per role, one checked, at most two buttons each`, { skip }, () => {
    const s = html(lang);
    const inputs = count(s, /<input type="radio" name="role"/g);
    assert.equal(inputs, 3);
    assert.equal(count(s, /<input type="radio" name="role"[^>]*checked/g), 1);
    assert.equal(count(s, /class="roles-panel"/g), inputs);
    for (const [, id] of s.matchAll(/<input type="radio" name="role" id="([^"]+)"/g)) assert.ok(s.includes(`<label for="${id}"`), `${id} has no tab`);
    for (const panel of s.split('class="roles-panel"').slice(1)) {
      const own = panel.split("</div>\n            {%")[0];
      assert.ok(count(own.split('class="roles-more"')[0], /class="roles-btn"/g) <= 2);
    }
  });
}

// The role pages: built in both languages, the two languages in step, and every anchor has a target.
const rolePages = ["teachers", "parents", "students"].flatMap((r) => [`_site/${r}/index.html`, `_site/en/${r}/index.html`]);
const rolesBuilt = rolePages.every((p) => existsSync(p));

test("role pages: both languages have the same structure and every anchor has a target", { skip: rolesBuilt ? false : "run npm run build first" }, () => {
  for (const r of ["teachers", "parents", "students"]) {
    const de = readFileSync(`_site/${r}/index.html`, "utf8");
    const en = readFileSync(`_site/en/${r}/index.html`, "utf8");
    for (const re of [/<section /g, /<h2 /g, /<h3 /g, /<li[ >]/g, /<a /g, /class="mark"/g]) assert.equal(count(de, re), count(en, re), `${r}: ${re}`);
    for (const s of [de, en]) for (const [, id] of s.matchAll(/href="#([^"]+)"/g)) assert.ok(s.includes(`id="${id}"`), `${r}: #${id} has no target`);
  }
});
