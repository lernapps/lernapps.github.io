// The language of the frame: the reader's browser language until they choose another with the switch, and a line
// above a page whose text is in another language than the frame (site-frame/frame.js).
import { test } from "node:test";
import assert from "node:assert/strict";
import { runInNewContext } from "node:vm";
import { head, header } from "../site-frame/frame.js";

/** Runs the language script of a page's <head> in a browser stand-in; returns where it went and what it kept. */
function visit(path, { languages, stored = null, userAgent = "Mozilla/5.0", click } = {}) {
  const script = head({ site: "/", path }).match(/<script>([\s\S]*?)<\/script>/)?.[1];
  const store = new Map(stored ? [["lernapps-lang", stored]] : []);
  let went = null;
  let onClick = null;
  runInNewContext(script ?? "", {
    navigator: { languages, language: languages[0], userAgent },
    localStorage: {
      getItem: (k) => store.get(k) ?? null,
      setItem: (k, v) => store.set(k, v),
      removeItem: (k) => store.delete(k),
    },
    location: { search: "", hash: "", replace: (url) => (went = url) },
    document: { addEventListener: (_, f) => (onClick = f) },
  });
  if (click) {
    const a = { dataset: { laLang: click } };
    onClick?.({ target: { closest: () => a } });
  }
  return { script, went, stored: store.get("lernapps-lang") ?? null };
}

test("a reader with an English browser goes to the English page, a German one stays", () => {
  assert.equal(visit("/features/", { languages: ["en-GB", "de"] }).went, "/en/features/");
  assert.equal(visit("/features/", { languages: ["de-DE", "en"] }).went, null);
  assert.equal(visit("/en/features/", { languages: ["de-DE"] }).went, "/features/");
  assert.equal(visit("/features/", { languages: ["fr-FR"] }).went, null, "no known language: stay");
});

test("a language chosen by the switch wins over the browser, and only a different one is kept", () => {
  assert.equal(visit("/features/", { languages: ["en-US"], stored: "de" }).went, null);
  assert.equal(visit("/features/", { languages: ["de-DE"], click: "en" }).stored, "en");
  assert.equal(visit("/en/features/", { languages: ["de-DE"], stored: "en", click: "de" }).stored, null);
});

test("crawlers see every language at its address", () => {
  assert.equal(visit("/features/", { languages: ["en-US"], userAgent: "Mozilla/5.0 (compatible; Googlebot/2.1)" }).went, null);
});

test("a page without a language switch has no language script", () => {
  assert.doesNotMatch(head({ site: "/", path: "/404/", languages: ["de"] }), /<script/);
});

test("a page whose text is in another language says so above the content, in the frame's language", () => {
  const de = header({ site: "/tooling/", path: "/tooling/", textLang: "en" });
  assert.match(de, /<p class="la-fallback" lang="de">Diese Seite gibt es nicht auf Deutsch\. Du siehst sie auf Englisch\.<\/p>/);
  const en = header({ site: "/docs/", path: "/docs/en/", textLang: "de" });
  assert.match(en, /This page is not available in English\. You see it in German\./);
  assert.doesNotMatch(header({ site: "/docs/", path: "/docs/en/", textLang: "en" }), /la-fallback/);
  assert.match(header({ site: "/", path: "/features/" }), /data-la-lang="en"/);
});
