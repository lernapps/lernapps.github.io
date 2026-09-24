// Use Case: Site ausliefern – jeder interne Link und jede interne Ressource in _site führt auf eine Datei, die es
// gibt, und ein #anker auf eine id in dieser Seite (Harness-Rad: link-checker). Externe Links prüft der Build nicht.
import { test } from "node:test";
import assert from "node:assert/strict";
import { pruefeLinks, zielVon } from "../../lib/pruefe-links.js";

const BASIS = "https://lernapps.github.io/";
const SEITEN = {
  "index.html": '<a href="binom/">Binom</a><a href="binom/regel.html#beispiel">B</a><a href="#oben">o</a><h1 id="oben">x</h1>',
  "binom/index.html": '<link rel="stylesheet" href="../kern/css/stil.css?v=abc"><a href="regel.html">r</a>',
  "binom/regel.html": '<section id="beispiel"></section><img src="/binom/bild.svg"><a href="https://lernapps.github.io/binom/">abs</a>',
  "binom/bild.svg": "<svg/>",
  "kern/css/stil.css": "",
};
const pruefe = (seiten) => pruefeLinks(seiten, BASIS);

test("eine heile Site hat keine toten Links: relativ, wurzelrelativ, absolut, Ordner, Query, Anker", () => {
  assert.deepEqual(pruefe(SEITEN), []);
});

test("ein Link auf eine fehlende Seite ist ein Fehler", () => {
  const fehler = pruefe({ ...SEITEN, "index.html": '<a href="binom/gibtsnicht.html">x</a>' });
  assert.equal(fehler.length, 1);
  assert.match(fehler[0], /index\.html: toter Link binom\/gibtsnicht\.html/);
});

test("eine fehlende Ressource (src) und ein fehlender Ordner-Index sind Fehler", () => {
  const fehler = pruefe({ ...SEITEN, "binom/regel.html": '<p id="beispiel"></p><img src="fehlt.svg"><a href="../physik/">p</a>' });
  assert.equal(fehler.length, 2);
});

test("ein Anker, den die Zielseite nicht hat, ist ein Fehler – auch auf derselben Seite", () => {
  const fehler = pruefe({ ...SEITEN, "index.html": '<a href="binom/regel.html#weg">x</a><a href="#nirgends">y</a>' });
  assert.equal(fehler.length, 2);
  assert.match(fehler[0], /#weg/);
  assert.match(fehler[1], /#nirgends/);
});

test("absolute Links auf die eigene Site zählen als intern", () => {
  const fehler = pruefe({ ...SEITEN, "index.html": '<a href="https://lernapps.github.io/weg.html">x</a>' });
  assert.equal(fehler.length, 1);
});

test("externe Links, mailto:, tel:, javascript:, data: und ein nacktes # prüft der Build nicht", () => {
  const html = '<a href="https://de.serlo.org/x">s</a><a href="//example.org/">e</a><a href="mailto:a@b.de">m</a>' +
    '<a href="tel:123">t</a><a href="javascript:void(0)">j</a><img src="data:image/png;base64,AAA"><a href="#">n</a>';
  assert.deepEqual(pruefe({ ...SEITEN, "index.html": html }), []);
});

test("zielVon löst Pfade auf und lässt Fremdes weg", () => {
  assert.deepEqual(zielVon("binom/regel.html", "../kern/x.js?v=1#a", BASIS), { datei: "kern/x.js", anker: "a" });
  assert.deepEqual(zielVon("binom/regel.html", "#a", BASIS), { datei: "binom/regel.html", anker: "a" });
  assert.deepEqual(zielVon("a/b.html", "/", BASIS), { datei: "index.html", anker: "" });
  assert.equal(zielVon("a/b.html", "https://example.org/", BASIS), null);
});

test("ausser: Pfade, die ein anderer Build liefert (die Doku unter docs/), prüft der Link-Checker nicht", () => {
  const seiten = { "index.html": '<a href="docs/arc42/arc42.html">Doku</a>' };
  assert.equal(pruefeLinks(seiten, BASIS).length, 1);
  assert.deepEqual(pruefeLinks(seiten, BASIS, { ausser: ["docs/"] }), []);
});
