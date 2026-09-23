// Use Case: Kompetenz 4 – die erste Pfadregel anwenden (pfadregel-1.html).
import { test } from "node:test";
import assert from "node:assert/strict";
import { erzeugeAufgabe, pruefeAntwort } from "../js/aufgaben/pfadregel-1.js";
import { erzeugeZufall } from "../../kern/js/zufall.js";
import { bruch } from "../../kern/js/bruch.js";

const z = (s) => erzeugeZufall(s);
const pruefe = (a, antwort) => pruefeAntwort(a, { antwort });

test("Pfad aus Vorgaben", () => {
  const a = erzeugeAufgabe(z(1), { urne: "3r2b1g", zuege: 2, modus: "ohne", ereignis: "rb" });
  assert.equal(a.thema, "pfadregel-1");
  assert.deepEqual(a.pfad, ["r", "b"]);
  assert.deepEqual(a.loesungBruch, bruch(1, 5));
  assert.match(a.text, /erst rot, dann blau/);
  assert.equal(pruefe(a, "3/6*2/5").korrekt, true);
  const f = pruefe(a, "3/6+2/5");
  assert.equal(f.korrekt, false);
  assert.match(f.meldung, /addiert/);
  assert.match(a.rechenweg.join(" "), /3\/6 · 2\/5/);
});

test("Ungültiges Ereignis wird ersetzt, Zufall bleibt gültig", () => {
  assert.equal(erzeugeAufgabe(z(1), { urne: "3r2b1g", zuege: 2, ereignis: "genau1r" }).pfad.length, 2);
  for (let s = 0; s < 30; s++) {
    const x = erzeugeAufgabe(z(s));
    assert.equal(x.pfad.length, x.zuege);
    assert.ok(x.loesungBruch.z > 0);
  }
});
