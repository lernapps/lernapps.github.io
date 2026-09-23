// Use Case: Modell der Zufallsversuche und Baumdiagramme (Grundlage aller Kompetenzen).
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  parseUrne, formatUrne, urne, muenze, wuerfel, wuerfelSechs, gluecksrad,
  gesamtAnzahl, wahrscheinlichkeit, entferne, ergebnisName, elementarErgebnisse,
} from "../js/modell/experimente.js";
import { bruch } from "../../kern/js/bruch.js";

test("parseUrne liest die Kurzschreibweise", () => {
  assert.deepEqual(parseUrne("3r2b1g"), { r: 3, b: 2, g: 1 });
  assert.deepEqual(parseUrne("10r1b"), { r: 10, b: 1 });
  assert.equal(parseUrne("xyz"), null);
  assert.equal(parseUrne(""), null);
  assert.equal(formatUrne({ r: 3, b: 2 }), "3r2b");
});

test("urne ist ein Zufallsversuch mit Ergebnissen und Anzahlen", () => {
  const u = urne("3r2b1g");
  assert.equal(u.typ, "urne");
  assert.equal(gesamtAnzahl(u), 6);
  assert.deepEqual(wahrscheinlichkeit(u, "r"), bruch(1, 2));
  assert.deepEqual(wahrscheinlichkeit(u, "g"), bruch(1, 6));
  assert.equal(ergebnisName(u, "b"), "blau");
  assert.equal(elementarErgebnisse(u).length, 6);
});

test("entferne nimmt eine Kugel heraus, Original bleibt", () => {
  const u = urne("3r2b1g");
  const danach = entferne(u, "g");
  assert.equal(gesamtAnzahl(danach), 5);
  assert.equal(gesamtAnzahl(u), 6);
  assert.deepEqual(wahrscheinlichkeit(danach, "g"), bruch(0, 1));
  assert.deepEqual(wahrscheinlichkeit(danach, "r"), bruch(3, 5));
  assert.equal(entferne(danach, "g"), null);
});

test("Münze, Würfel, Glücksrad", () => {
  const m = muenze();
  assert.deepEqual(wahrscheinlichkeit(m, "k"), bruch(1, 2));
  assert.equal(ergebnisName(m, "z"), "Zahl");
  const w = wuerfel();
  assert.equal(gesamtAnzahl(w), 6);
  assert.deepEqual(wahrscheinlichkeit(w, "6"), bruch(1, 6));
  const ws = wuerfelSechs();
  assert.deepEqual(wahrscheinlichkeit(ws, "s"), bruch(1, 6));
  assert.deepEqual(wahrscheinlichkeit(ws, "k"), bruch(5, 6));
  assert.equal(ergebnisName(ws, "k"), "keine 6");
  const g = gluecksrad("2r1b1g");
  assert.equal(g.typ, "gluecksrad");
  assert.deepEqual(wahrscheinlichkeit(g, "r"), bruch(1, 2));
  assert.equal(entferne(g, "r"), null, "Glücksrad kennt kein ohne Zurücklegen");
});
