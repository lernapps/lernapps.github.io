// The design tokens: the dark mode (opt-in with data-la-theme="auto") changes only tokens that exist, and the colours of the page reach AA contrast on
// the dark surface, as they do on the light one.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const css = readFileSync(new URL("../site-frame/tokens.css", import.meta.url), "utf8");
const block = (re) => css.match(re)?.[1] ?? "";
const tokens = (text) => Object.fromEntries([...text.matchAll(/(--la-[a-z-]+):\s*([^;]+);/g)].map((m) => [m[1], m[2].trim()]));

const light = tokens(block(/:root\s*\{([\s\S]*?)\n\}/));
const dark = tokens(block(/prefers-color-scheme:\s*dark\)\s*\{\s*:root\[data-la-theme="auto"\]\s*\{([\s\S]*?)\}/));

const luminance = (hex) => {
  const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
const contrast = (a, b) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

test("the dark mode overrides only tokens that exist", () => {
  assert.ok(Object.keys(dark).length > 0, "no dark tokens found");
  for (const name of Object.keys(dark)) assert.ok(name in light, `${name} is not a token`);
});

test("text, muted text and links reach 4.5:1 on the surface, light and dark", () => {
  for (const [mode, t] of [["light", light], ["dark", { ...light, ...dark }]]) {
    for (const name of ["--la-text", "--la-muted", "--la-link"]) {
      const ratio = contrast(t[name], t["--la-surface"]);
      assert.ok(ratio >= 4.5, `${mode}: ${name} on the surface is ${ratio.toFixed(2)}:1`);
    }
  }
});

test("the header, the footer and the dark sections stay dark in both modes", () => {
  for (const name of ["--la-ink", "--la-ink-soft", "--la-on-ink", "--la-on-ink-muted", "--la-accent"]) {
    assert.ok(!(name in dark), `${name} must not change in the dark mode`);
  }
});

test("the dark mode is opt-in: no dark token applies to a plain :root", () => {
  assert.doesNotMatch(css, /prefers-color-scheme:\s*dark\)\s*\{\s*:root\s*\{/);
});
