// The landing look (landing.css): every colour reaches WCAG AA in the light and the dark scheme, the tokens it names
// exist, and its dark values win over tokens.css whatever the order of the links.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { head, OPT_IN_STYLES } from "../site-frame/frame.js";

const read = (f) => readFileSync(new URL(`../site-frame/${f}`, import.meta.url), "utf8");
const [tokensCss, pageCss, landingCss] = ["tokens.css", "page.css", "landing.css"].map(read);
const vars = (text) => Object.fromEntries([...text.matchAll(/(--[a-z-]+):\s*([^;]+);/g)].map((m) => [m[1], m[2].trim()]));

const lightTokens = vars(tokensCss.match(/:root\s*\{([\s\S]*?)\n\}/)[1]);
const darkTokens = vars(pageCss.match(/prefers-color-scheme:\s*dark\)\s*\{\s*html:root\s*\{([\s\S]*?)\}/)[1]);
const lightLanding = vars(landingCss.match(/:root\s*\{([\s\S]*?)\n\}/)[1]);
const darkLanding = vars(landingCss.match(/prefers-color-scheme:\s*dark\)\s*\{\s*html:root\s*\{([\s\S]*?)\}/)[1]);

const scheme = (mode) => ({ ...lightTokens, ...lightLanding, ...(mode === "dark" ? { ...darkTokens, ...darkLanding } : {}) });
const resolve = (all, name) => {
  let v = all[name];
  for (let i = 0; i < 5 && v?.startsWith("var("); i++) v = all[v.slice(4, -1)];
  return v;
};
const lum = (hex) => {
  const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
const contrast = (a, b) => {
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

test("the dark values override only palette names that exist", () => {
  for (const name of Object.keys(darkLanding)) assert.ok(name in lightLanding, `${name} has no light value`);
});

test("landing.css names only tokens that exist", () => {
  for (const [, name] of landingCss.matchAll(/var\((--la-[a-z-]+)[,)]/g)) assert.ok(name in lightTokens, `${name} is not a token`);
});

test("text, muted text and the accent reach 4.5:1 on the page and on a card, light and dark", () => {
  for (const mode of ["light", "dark"]) {
    const all = scheme(mode);
    const c = (n) => resolve(all, n);
    for (const bg of ["--lc-bg", "--lc-card", "--lc-tint"]) {
      for (const fg of ["--lc-text", "--lc-muted", "--lc-accent"]) {
        const r = contrast(c(fg), c(bg));
        assert.ok(r >= 4.5, `${mode}: ${fg} on ${bg} is ${r.toFixed(2)}:1`);
      }
    }
    const on = contrast(c("--lc-on"), c("--lc-accent"));
    assert.ok(on >= 4.5, `${mode}: --lc-on on --lc-accent is ${on.toFixed(2)}:1`);
  }
});

test("the hero text reaches 4.5:1 on the hero in both schemes", () => {
  for (const mode of ["light", "dark"]) {
    const hero = resolve(scheme(mode), "--lc-hero");
    for (const text of ["#f1f5f9", "#cbd5e1", "#93c5fd"]) {
      const r = contrast(text, hero);
      assert.ok(r >= 4.5, `${mode}: ${text} on the hero is ${r.toFixed(2)}:1`);
    }
  }
});

test("landing.css is opt-in: served, but not linked by head()", () => {
  assert.equal(OPT_IN_STYLES["landing.css"], "lernapps-landing.css");
  assert.doesNotMatch(head({ site: "/docs/" }), /lernapps-landing\.css/);
});
