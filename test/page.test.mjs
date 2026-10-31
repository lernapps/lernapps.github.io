// The page base (page.css) and the button classes: the dark values are those of tokens.css, and every text colour of
// the buttons and the page reaches WCAG AA (4.5:1 text, 3:1 border of a control) in the light and the dark scheme.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { head, OPT_IN_STYLES } from "../site-frame/frame.js";

const read = (f) => readFileSync(new URL(`../site-frame/${f}`, import.meta.url), "utf8");
const tokensCss = read("tokens.css");
const pageCss = read("page.css");
const vars = (text) => Object.fromEntries([...text.matchAll(/(--la-[a-z-]+):\s*([^;]+);/g)].map((m) => [m[1], m[2].trim()]));

const light = vars(tokensCss.match(/:root\s*\{([\s\S]*?)\n\}/)[1]);
const darkTokens = vars(tokensCss.match(/:root\[data-la-theme="auto"\]\s*\{([\s\S]*?)\}/)[1]);
const darkPage = vars(pageCss.match(/prefers-color-scheme:\s*dark\)\s*\{\s*html:root\s*\{([\s\S]*?)\}/)[1]);

const lum = (hex) => {
  const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
const contrast = (a, b) => {
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

test("page.css gives the same dark values as the opt-in of tokens.css", () => {
  assert.deepEqual(darkPage, darkTokens);
});

test("page.css uses only tokens that exist", () => {
  for (const [, name] of pageCss.matchAll(/var\((--la-[a-z-]+)\)/g)) assert.ok(name in light, `${name} is not a token`);
});

test("text, links and buttons reach AA, light and dark", () => {
  for (const [mode, t] of [["light", light], ["dark", { ...light, ...darkPage }]]) {
    const pairs = [
      ["--la-text", "--la-bg", 4.5],
      ["--la-text", "--la-box", 4.5],
      ["--la-muted", "--la-bg", 4.5],
      ["--la-link", "--la-bg", 4.5],
      ["--la-link", "--la-box", 4.5],
      ["--la-on-button", "--la-button", 4.5],
      ["--la-on-button", "--la-button-hover", 4.5],
      ["--la-control", "--la-bg", 3],
      ["--la-line", "--la-bg", mode === "dark" ? 3 : 1], // quiet lines only structure; in the dark they stay visible
    ];
    for (const [fg, bg, min] of pairs) {
      const r = contrast(t[fg], t[bg]);
      assert.ok(r >= min, `${mode}: ${fg} on ${bg} is ${r.toFixed(2)}:1, needs ${min}:1`);
    }
  }
});

test("page.css is opt-in: the frame serves it but head() does not link it", () => {
  assert.equal(OPT_IN_STYLES["page.css"], "lernapps-page.css");
  assert.doesNotMatch(head({ site: "/docs/" }), /lernapps-page\.css/);
});

test("the dark values win over tokens.css whatever the order of the links", () => {
  assert.match(pageCss, /html:root\s*\{/, "page.css must be more specific than the :root of tokens.css");
});
