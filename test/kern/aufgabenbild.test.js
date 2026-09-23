// Use Case: Übung – das Bild zur Aufgabe trägt eine Beschriftung, die zur aktuellen Aufgabe passt, nicht zum Beispiel.
import { test } from "node:test";
import assert from "node:assert/strict";
import { bildBeschriftung } from "../../src/kern/js/aufgabenbild.js";

test("neue Aufgabe: Beschriftung nennt die Aufgabennummer", () => {
  assert.equal(bildBeschriftung({ seed: 42 }), "Bild zur Aufgabe Nr. 42.");
});

test("richtig gelöst oder Lösung gezeigt: Beschriftung sagt das", () => {
  assert.equal(bildBeschriftung({ seed: 7 }, { korrekt: true }), "Bild zur Aufgabe Nr. 7 – gelöst.");
  assert.equal(bildBeschriftung({ seed: 7 }, { korrekt: true, loesungGezeigt: true }), "Bild zur Aufgabe Nr. 7 – mit Lösung.");
  assert.equal(bildBeschriftung({ seed: 7 }, { korrekt: false }), "Bild zur Aufgabe Nr. 7.");
});

test("ein Hinweis aus dem Front Matter (bild.uebung) steht dahinter", () => {
  assert.equal(bildBeschriftung({ seed: 3 }, undefined, "Klick auf das Ende eines Pfades."),
    "Bild zur Aufgabe Nr. 3. Klick auf das Ende eines Pfades.");
});
