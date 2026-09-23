// Use Case: Bild dazu – beim Build zeichnet dieselbe Funktion wie im Browser das statische SVG (ohne JS sichtbar).
import { test } from "node:test";
import assert from "node:assert/strict";
import { zeichneBild } from "../../lib/bild.js";

const binom = { ordner: "src/binom", kompetenz: { id: "erste-binomische", generator: "./aufgaben/erste-binomische.js" } };

test("zeichneBild liefert SVG-Markup mit id vis, role img und der Aufgabe aus den Vorgaben", async () => {
  const svg = await zeichneBild({ ...binom, bild: { funktion: "zeichneErsteBinomische", seed: 1, geloest: true, vorgaben: { m: 1, n: 4, var: "x" } } });
  assert.match(svg, /^<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg" class="vis" id="vis"/);
  assert.match(svg, /role="img"/);
  assert.match(svg, /\(x \+ 4\)² = x² \+ 8x \+ 16/);
});

test("ungelöst zeigt das Bild ein Fragezeichen statt des Ergebnisses", async () => {
  const svg = await zeichneBild({ ...binom, bild: { funktion: "zeichneErsteBinomische", seed: 1, vorgaben: { m: 1, n: 4, var: "x" } } });
  assert.match(svg, /= \?/);
});

test("eine unbekannte Zeichenfunktion ist ein Build-Fehler mit Datei und Namen", async () => {
  await assert.rejects(zeichneBild({ ...binom, bild: { funktion: "gibtsNicht", seed: 1 } }), /gibtsNicht.*erste-binomische\.js/);
});
