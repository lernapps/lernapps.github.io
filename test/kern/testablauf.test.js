// Use Case: Test und Schnelltest – Aufgabenfolge aus der Testnummer, Bewertung, Ergebniszeile für den Tutor.
// Der Kern kennt keine App: Kompetenzen und App-Titel kommen als Argumente (Dependency Inversion).
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  MODI, nummeriere, leseModus, testAufgaben, bewerte, fasseZusammen, ergebnisZeile, testLink, formatDatum, SYMBOLE,
} from "../../src/kern/js/testablauf.js";

const SIEBEN = nummeriere(["a", "b", "c", "d", "e", "f", "g"].map((id) => ({ id, titel: id })));

test("nummeriere: Nummer 1, 2, … aus der Checklisten-Reihenfolge, Konfiguration bleibt unverändert", () => {
  const konfig = [{ id: "x" }, { id: "y" }];
  assert.deepEqual(nummeriere(konfig), [{ id: "x", nr: 1 }, { id: "y", nr: 2 }]);
  assert.equal(konfig[0].nr, undefined);
});

test("leseModus: voll ist Standard, schnell nur bei ?modus=schnell", () => {
  assert.equal(leseModus(""), "voll");
  assert.equal(leseModus("?nr=42"), "voll");
  assert.equal(leseModus("?modus=schnell"), "schnell");
  assert.equal(leseModus("?modus=unsinn"), "voll");
  assert.deepEqual(MODI, { voll: 2, schnell: 1 });
});

test("testAufgaben: deterministisch, Länge je Modus, Reihenfolge nach Checkliste", () => {
  const voll = testAufgaben(42, "voll", SIEBEN);
  const schnell = testAufgaben(42, "schnell", SIEBEN);
  assert.equal(voll.length, 14);
  assert.equal(schnell.length, 7);
  assert.deepEqual(voll, testAufgaben(42, "voll", SIEBEN));
  assert.deepEqual(voll.map((a) => a.kompetenz), SIEBEN.flatMap((k) => [k.id, k.id]));
  assert.ok(voll.every((a) => Number.isInteger(a.seed) && a.seed >= 1 && a.seed <= 9999));
  assert.notDeepEqual(voll.map((a) => a.seed), testAufgaben(43, "voll", SIEBEN).map((a) => a.seed));
  for (let i = 0; i < 7; i++) {
    assert.notEqual(voll[2 * i].seed, voll[2 * i + 1].seed, "zwei verschiedene Aufgaben je Kompetenz");
    assert.equal(schnell[i].seed, voll[2 * i].seed, "Schnelltest ist die erste Aufgabe je Kompetenz");
  }
});

test("bewerte: 2/2 sicher, 1/2 teils, 0/2 üben; 1/1 sicher, 0/1 üben", () => {
  assert.equal(bewerte(2, 2), "S");
  assert.equal(bewerte(1, 2), "T");
  assert.equal(bewerte(0, 2), "Ü");
  assert.equal(bewerte(1, 1), "S");
  assert.equal(bewerte(0, 1), "Ü");
  assert.deepEqual(SYMBOLE, { S: "✓", T: "~", Ü: "✗" });
});

test("fasseZusammen bündelt Antworten je Kompetenz", () => {
  const antworten = [
    { kompetenz: "a", korrekt: true }, { kompetenz: "a", korrekt: true },
    { kompetenz: "b", korrekt: false }, { kompetenz: "b", korrekt: true },
    { kompetenz: "c", korrekt: false }, { kompetenz: "c", korrekt: false },
  ];
  assert.deepEqual(fasseZusammen(antworten), { a: "S", b: "T", c: "Ü" });
});

test("ergebnisZeile: Format für den Tutor, App-Titel kommt von der Seite", () => {
  const ergebnis = { a: "S", b: "S", c: "Ü", d: "S", e: "T", f: "S", g: "S" };
  assert.equal(ergebnisZeile(4711, "schnell", ergebnis, SIEBEN, "Binomische Formeln"),
    "Test Nr. 4711 (Binomische Formeln, Schnelltest): 1 ✓ 2 ✓ 3 ✗ 4 ✓ 5 ~ 6 ✓ 7 ✓");
  assert.equal(ergebnisZeile(12, "voll", { a: "T" }, SIEBEN, "X"), "Test Nr. 12 (X, Test): 1 ~ 2 – 3 – 4 – 5 – 6 – 7 –");
});

test("testLink und formatDatum", () => {
  assert.equal(testLink(4711, "schnell"), "test.html?nr=4711&modus=schnell");
  assert.equal(testLink(5, "quatsch"), "test.html?nr=5&modus=voll");
  assert.equal(formatDatum("2026-09-23T10:00:00.000Z"), "23.09.2026");
  assert.equal(formatDatum("kaputt"), "");
});
