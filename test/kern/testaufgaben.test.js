// Use Case: Test und Schnelltest – Testaufgaben aus übergebenen Generatoren (die Seite importiert sie statisch).
import { test } from "node:test";
import assert from "node:assert/strict";
import { erzeugeZufall } from "../../src/kern/js/zufall.js";
import { erzeugeTestaufgabe, pruefeTestaufgabe, istLeer } from "../../src/kern/js/testaufgaben.js";

const generator = {
  erzeugeAufgabe: (zufall, vorgaben) => ({ thema: "k", zahl: vorgaben.zahl ?? zufall.ganzzahl(1, 9), felder: [{ id: "x" }] }),
  testVorgaben: () => ({ zahl: 5 }),
  pruefeAntwort: (a, antworten) => ({ korrekt: Number(antworten.x) === a.zahl }),
};

test("erzeugeTestaufgabe nutzt testVorgaben und merkt den Seed", () => {
  const a = erzeugeTestaufgabe({ k: generator }, "k", erzeugeZufall(7));
  assert.equal(a.zahl, 5);
  assert.equal(a.seed, 7);
});

test("pruefeTestaufgabe liefert nur bei vollständig richtiger Antwort true", () => {
  const a = erzeugeTestaufgabe({ k: generator }, "k", erzeugeZufall(7));
  assert.equal(pruefeTestaufgabe({ k: generator }, a, { x: "5" }), true);
  assert.equal(pruefeTestaufgabe({ k: generator }, a, { x: "4" }), false);
});

test("istLeer erkennt Antworten ohne jede Eingabe", () => {
  assert.equal(istLeer({ a: "", b: " " }), true);
  assert.equal(istLeer({}), true);
  assert.equal(istLeer({ a: "", b: "3" }), false);
});
