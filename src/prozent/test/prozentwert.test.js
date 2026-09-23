// Use Case: Prozentwert berechnen – Generator und Prüfer.
import { test } from "node:test";
import assert from "node:assert/strict";
import { erzeugeZufall } from "../../kern/js/zufall.js";
import { istSchoen } from "../../kern/js/zahlen.js";
import { erzeugeAufgabe, pruefeAntwort } from "../js/aufgaben/prozentwert.js";

test("erzeugeAufgabe liefert eine vollständige Aufgabe mit schönen Zahlen", () => {
  const z = erzeugeZufall(3);
  for (let i = 0; i < 50; i++) {
    const a = erzeugeAufgabe(z);
    assert.equal(a.thema, "prozentwert");
    assert.ok(a.text.includes(String(a.grundwert).replace(".", ",")));
    assert.ok(istSchoen(a.prozentwert));
    assert.ok(a.grundwert > 0 && a.prozentsatz > 0);
    assert.equal(a.felder.length, 1);
    assert.equal(a.felder[0].id, "prozentwert");
    assert.ok(a.tipp.length > 10);
    assert.ok(a.rechenweg.length >= 2);
  }
});

test("erzeugeAufgabe nutzt Vorgaben aus der URL", () => {
  const a = erzeugeAufgabe(erzeugeZufall(1), { g: 250, p: 12 });
  assert.equal(a.grundwert, 250);
  assert.equal(a.prozentsatz, 12);
  assert.equal(a.prozentwert, 30);
});

test("erzeugeAufgabe ignoriert unvollständige Vorgaben", () => {
  const a = erzeugeAufgabe(erzeugeZufall(1), { g: 250 });
  assert.ok(a.grundwert > 0);
  assert.ok(a.prozentsatz > 0);
});

test("pruefeAntwort erkennt richtig, falsch und typische Fehler", () => {
  const a = erzeugeAufgabe(erzeugeZufall(1), { g: 250, p: 12 });
  assert.equal(pruefeAntwort(a, { prozentwert: "30" }).korrekt, true);
  assert.equal(pruefeAntwort(a, { prozentwert: "30,00 €" }).korrekt, true);
  assert.equal(pruefeAntwort(a, { prozentwert: "31" }).korrekt, false);
  const dezimal = pruefeAntwort(a, { prozentwert: "3000" });
  assert.equal(dezimal.korrekt, false);
  assert.equal(dezimal.fehler, "prozent-statt-dezimal");
  const rest = pruefeAntwort(a, { prozentwert: "220" });
  assert.equal(rest.fehler, "rest-statt-anteil");
  const leer = pruefeAntwort(a, { prozentwert: "" });
  assert.equal(leer.korrekt, false);
  assert.equal(leer.fehler, "keine-zahl");
  assert.ok(leer.meldung.length > 0);
});
