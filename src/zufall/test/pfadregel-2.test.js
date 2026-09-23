// Use Case: Kompetenz 6 – die zweite Pfadregel anwenden (pfadregel-2.html, art=pfade|term).
import { test } from "node:test";
import assert from "node:assert/strict";
import { erzeugeAufgabe, pruefeAntwort, testVorgaben } from "../js/aufgaben/pfadregel-2.js";
import { pruefeAuswahl } from "../js/aufgaben/pfade.js";
import { erzeugeZufall } from "../../kern/js/zufall.js";
import { bruch } from "../../kern/js/bruch.js";

const z = (s) => erzeugeZufall(s);
const pruefe = (a, antwort) => pruefeAntwort(a, { antwort });

test("art=pfade: passende Pfade und Summe", () => {
  const a = erzeugeAufgabe(z(1), { urne: "3r2b1g", zuege: 2, modus: "ohne", ereignis: "genau1r", art: "pfade" });
  assert.equal(a.thema, "pfadregel-2");
  assert.equal(a.art, "pfade");
  assert.equal(a.ereignis.name, "genau einmal rot");
  assert.deepEqual(a.pfade.map((p) => p.pfad.join("")).sort(), ["br", "gr", "rb", "rg"]);
  assert.deepEqual(a.loesungBruch, bruch(3, 5));
  assert.equal(pruefe(a, "3/6*2/5+3/6*1/5+2/6*3/5+1/6*3/5").korrekt, true);
  const f = pruefe(a, "3/6*2/5");
  assert.equal(f.korrekt, false);
  assert.match(f.meldung, /nur ein Pfad/);
  assert.match(a.rechenweg.join("\n"), /\+/);
});

test("Angeklickte Pfade (aufgabe.auswahl) liefern die Diagnose, entscheiden aber nicht", () => {
  const a = erzeugeAufgabe(z(1), { urne: "3r2b1g", zuege: 2, modus: "ohne", ereignis: "genau1r", art: "pfade" });
  const ids = a.pfade.map((p) => p.id);
  assert.equal(pruefeAuswahl(a, ids).richtig, true);
  const teil = pruefeAuswahl(a, ids.slice(0, 2));
  assert.equal(teil.fehlend, 2);
  assert.equal(pruefeAuswahl(a, [...ids, "w-r-r"]).zuviel, 1);
  a.auswahl = new Set(ids.slice(0, 2));
  assert.match(pruefe(a, "1/2").meldung, /fehlen noch 2 Pfade/);
});

test("art=term: Radiofeld mit drei Termen", () => {
  const b = erzeugeAufgabe(z(4), { art: "term" });
  assert.equal(b.art, "term");
  assert.equal(b.felder[0].typ, "radio");
  assert.equal(pruefeAntwort(b, b.loesung).korrekt, true);
});

test("Im Test immer art=pfade; Ereignisse beide gleich und mindestens einmal", () => {
  assert.equal(erzeugeAufgabe(z(3), testVorgaben(z(3))).art, "pfade");
  const g = erzeugeAufgabe(z(1), { urne: "3r2b1g", zuege: 2, modus: "mit", ereignis: "beidegleich", art: "pfade" });
  assert.deepEqual(g.loesungBruch, bruch(14, 36));
  assert.equal(g.pfade.length, 3);
  const m = erzeugeAufgabe(z(1), { muenze: 3, ereignis: "mind1k", art: "pfade" });
  assert.equal(m.pfade.length, 7);
  assert.deepEqual(m.loesungBruch, bruch(7, 8));
  assert.match(m.tipp, /Produkt, Summe oder Potenz/);
});
