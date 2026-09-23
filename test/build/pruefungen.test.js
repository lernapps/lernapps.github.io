// Use Case: Build bricht ab, wenn eine Regel verletzt ist (früher scripts/pruefe.mjs).
import { test } from "node:test";
import assert from "node:assert/strict";
import { pruefeExterneRessourcen, pruefeExterneImporte, pruefeZeilen, pruefeLlms, pruefeKompetenzen } from "../../lib/pruefungen.js";

test("externe Ressourcen in script/link/img/iframe sind Fehler, Links und Canonical nicht", () => {
  assert.deepEqual(pruefeExterneRessourcen("a.html", `<link rel="canonical" href="https://x.org/"><a href="https://x.org">x</a>`), []);
  assert.equal(pruefeExterneRessourcen("a.html", `<script src="https://cdn.x/y.js"></script>`).length, 1);
  assert.equal(pruefeExterneRessourcen("a.html", `<link rel="stylesheet" href="//fonts.x/y.css">`).length, 1);
  assert.equal(pruefeExterneRessourcen("a.html", `<img src="https://x/y.png">`).length, 1);
});

test("externe Importe in JS und CSS sind Fehler", () => {
  assert.equal(pruefeExterneImporte("a.js", `import x from "https://esm.sh/x";`).length, 1);
  assert.equal(pruefeExterneImporte("a.css", `@import url("https://fonts.x/y.css");`).length, 1);
  assert.deepEqual(pruefeExterneImporte("a.js", `const u = "https://www.youtube-nocookie.com/embed/";`), []);
});

test("höchstens 500 Zeilen je Datei", () => {
  assert.deepEqual(pruefeZeilen("a.js", "x\n".repeat(500)), []);
  assert.match(pruefeZeilen("a.js", "x\n".repeat(501))[0], /501 Zeilen/);
});

test("llms.txt nennt jede Seite", () => {
  assert.deepEqual(pruefeLlms("binom/llms.txt", "… index.html test.html a.html", ["index.html", "test.html", "a.html"]), []);
  assert.match(pruefeLlms("binom/llms.txt", "index.html", ["index.html", "b.html"])[0], /b\.html/);
});

test("je Kompetenz: Markdown-Seite, Generator, Test und (bei Bild) Zeichenmodul; ids eindeutig", () => {
  const vorhanden = new Set(["a.md", "js/aufgaben/a.js", "test/a.test.js", "js/vis/a.js"]);
  const existiert = (p) => vorhanden.has(p);
  const ok = [{ id: "a", seite: "a.html", generator: "./aufgaben/a.js" }];
  assert.deepEqual(pruefeKompetenzen("binom", ok, existiert), []);
  const fehler = pruefeKompetenzen("binom", [...ok, { id: "b", seite: "b.html", generator: "./aufgaben/b.js" }, ok[0]], existiert);
  assert.ok(fehler.some((f) => /b: .*b\.md fehlt/.test(f)));
  assert.ok(fehler.some((f) => /Generator js\/aufgaben\/b\.js fehlt/.test(f)));
  assert.ok(fehler.some((f) => /test\/b\.test\.js fehlt/.test(f)));
  assert.ok(fehler.some((f) => /a doppelt/.test(f)));
  assert.ok(pruefeKompetenzen("binom", [{ id: "B_x", seite: "B_x.html", generator: "./x.js" }], () => true).some((f) => /a-z/.test(f)));
});
