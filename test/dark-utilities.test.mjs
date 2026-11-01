// The dark utility rules (site-frame/dark-utilities.js) shared by the home site and the catalog: the text colours that
// replace the light utility colours reach AA on every dark background of a light section, and the rules are in the
// system's dark scheme only.
import { test } from "node:test";
import assert from "node:assert/strict";
import { darkUtilities } from "../site-frame/dark-utilities.js";

const lum = (hex) => {
  const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
const contrast = (a, b) => {
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

// The backgrounds that a light section, a card in it, and a white button or a tinted block in it get.
const BACKGROUNDS = { page: "#0b1220", section: "#111a2e", card: "#17233b", tint: "#172554", code: "#1b2a42" };

test("everything is inside the dark scheme, and the page asks for it natively", () => {
  assert.match(darkUtilities, /:root\s*\{\s*color-scheme:\s*light dark;\s*\}/);
  const afterMedia = darkUtilities.slice(darkUtilities.indexOf("@media (prefers-color-scheme: dark)"));
  assert.ok(afterMedia.length > 0, "no dark media query");
  assert.doesNotMatch(darkUtilities.slice(0, darkUtilities.indexOf("@media")), /\.text-slate/);
});

test("the replaced text colours reach 4.5:1 on every dark background of a light section", () => {
  const colours = [...darkUtilities.matchAll(/\.text-[a-z]+-\d+(?::hover)?(?:,|\s)[^{]*\{\s*color:\s*(#[0-9a-f]{6})/gi)].map((m) => m[1]);
  assert.ok(colours.length >= 6, `found only ${colours.length} replaced text colours`);
  for (const fg of new Set(colours)) {
    for (const [name, bg] of Object.entries(BACKGROUNDS)) {
      const r = contrast(fg, bg);
      assert.ok(r >= 4.5, `${fg} on ${name} (${bg}) is ${r.toFixed(2)}:1`);
    }
  }
});

test("a white button or link in a light section takes the colour of a card", () => {
  assert.match(darkUtilities, /:is\(\.bg-white, \.bg-slate-50\) :is\(a, button\)\.bg-white \{ background-color: #17233b; \}/);
});

test("a light element with its own text colour gets the dark one, so that what inherits it stays readable", () => {
  for (const cls of ["text-slate-900", "text-slate-800", "text-slate-700"]) {
    assert.match(darkUtilities, new RegExp(`:is\\(\\.bg-white, \\.bg-slate-50\\)\\.${cls} \\{ color: #[0-9a-f]{6}; \\}`), cls);
  }
});
