// Use Case: Neue App anlegen – die Farbe folgt aus dem Fach; weiße Schrift bleibt lesbar (WCAG AA).
import { test } from "node:test";
import assert from "node:assert/strict";
import { FACHFARBEN, kontrast, fachfarbe } from "../../lib/fachfarben.js";

test("die Tabelle nennt fünf Fächer mit Primär- und Dunkelfarbe", () => {
  assert.deepEqual(Object.keys(FACHFARBEN), ["mathe", "physik", "chemie", "biologie", "informatik"]);
  assert.deepEqual(FACHFARBEN.mathe, { name: "Mathematik", primaer: "#1d4ed8", dunkel: "#1e3a8a" });
});

test("kontrast rechnet nach WCAG 2.x", () => {
  assert.equal(kontrast("#000000", "#ffffff"), 21);
  assert.equal(kontrast("#fff", "#000"), 21);
  assert.equal(Math.round(kontrast("#ffffff", "#1d4ed8") * 100) / 100, 6.7);
});

test("weiße Schrift erreicht auf Primär- und Dunkelfarbe jedes Fachs WCAG AA (≥ 4,5:1)", () => {
  for (const [fach, f] of Object.entries(FACHFARBEN)) {
    assert.ok(kontrast("#ffffff", f.primaer) >= 4.5, `${fach} primaer`);
    assert.ok(kontrast("#ffffff", f.dunkel) >= 4.5, `${fach} dunkel`);
  }
});

test("fachfarbe liefert die Farben eines Fachs; ein unbekanntes Fach ist ein Build-Fehler", () => {
  assert.equal(fachfarbe("physik").primaer, "#c2410c");
  assert.throws(() => fachfarbe("kunst"), /Fach "kunst".*mathe/);
});
