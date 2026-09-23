// Use Case: Grundwert berechnen – Generator und Prüfer.
import { test } from "node:test";
import assert from "node:assert/strict";
import { erzeugeZufall } from "../../kern/js/zufall.js";
import { istSchoen } from "../../kern/js/zahlen.js";
import { erzeugeAufgabe, pruefeAntwort } from "../js/aufgaben/grundwert.js";

test("erzeugeAufgabe liefert schöne Grundwerte", () => {
  const z = erzeugeZufall(12);
  for (let i = 0; i < 50; i++) {
    const a = erzeugeAufgabe(z);
    assert.equal(a.thema, "grundwert");
    assert.ok(istSchoen(a.grundwert));
    assert.ok(istSchoen(a.prozentwert));
    assert.equal(a.felder[0].id, "grundwert");
    assert.ok(a.rechenweg[0].includes("100"));
  }
});

test("Vorgaben ?w=&p= werden übernommen", () => {
  const a = erzeugeAufgabe(erzeugeZufall(1), { w: 30, p: 12 });
  assert.equal(a.prozentwert, 30);
  assert.equal(a.prozentsatz, 12);
  assert.equal(a.grundwert, 250);
});

test("pruefeAntwort erkennt typische Fehler", () => {
  const a = erzeugeAufgabe(erzeugeZufall(1), { w: 30, p: 12 });
  assert.equal(pruefeAntwort(a, { grundwert: "250" }).korrekt, true);
  assert.equal(pruefeAntwort(a, { grundwert: "3,6" }).fehler, "prozentwert-statt-grundwert");
  assert.equal(pruefeAntwort(a, { grundwert: "2,5" }).fehler, "nur-ein-prozent");
  assert.equal(pruefeAntwort(a, { grundwert: "x" }).fehler, "keine-zahl");
});
