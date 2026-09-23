// Use Case: Kompetenz 5 – beim Ziehen ohne Zurücklegen die Wahrscheinlichkeiten bestimmen (ohne-zuruecklegen.html).
import { test } from "node:test";
import assert from "node:assert/strict";
import { erzeugeAufgabe, pruefeAntwort } from "../js/aufgaben/ohne-zuruecklegen.js";
import { erzeugeZufall } from "../../kern/js/zufall.js";
import { bruch } from "../../kern/js/bruch.js";

const z = (s) => erzeugeZufall(s);

test("Zweig-Vergleich mit und ohne Zurücklegen", () => {
  const a = erzeugeAufgabe(z(1), { urne: "3r2b1g", erster: "r", zweiter: "b", art: "zweig" });
  assert.equal(a.thema, "ohne-zuruecklegen");
  assert.equal(a.art, "zweig");
  assert.deepEqual(a.loesungMit, bruch(2, 6));
  assert.deepEqual(a.loesungOhne, bruch(2, 5));
  assert.equal(a.urneDanach.ergebnisse.find((e) => e.id === "r").anzahl, 2);
  assert.equal(pruefeAntwort(a, { mit: "2/6", ohne: "2/5" }).korrekt, true);
  const f = pruefeAntwort(a, { mit: "2/6", ohne: "2/6" });
  assert.equal(f.korrekt, false);
  assert.equal(f.felder.ohne.korrekt, false);
  assert.match(f.meldung, /Nenner/);
});

test("Pfad-Vergleich", () => {
  const a = erzeugeAufgabe(z(1), { urne: "3r2b1g", erster: "r", zweiter: "r", art: "pfad" });
  assert.equal(a.art, "pfad");
  assert.deepEqual(a.loesungMit, bruch(1, 4));
  assert.deepEqual(a.loesungOhne, bruch(1, 5));
  assert.equal(pruefeAntwort(a, { mit: "3/6*3/6", ohne: "3/6*2/5" }).korrekt, true);
});

test("Zufall: gültige Urnen, erster Zug existiert, Unterschied sichtbar", () => {
  for (let s = 0; s < 30; s++) {
    const x = erzeugeAufgabe(z(s));
    assert.ok(x.experiment.ergebnisse.some((e) => e.id === x.erster));
    assert.notDeepEqual(x.loesungMit, x.loesungOhne, `Seed ${s}`);
  }
});
