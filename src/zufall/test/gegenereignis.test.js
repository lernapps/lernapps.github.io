// Use Case: Kompetenz 2 – die Gegenwahrscheinlichkeit 1 − p berechnen (gegenereignis.html).
import { test } from "node:test";
import assert from "node:assert/strict";
import { erzeugeAufgabe, pruefeAntwort, bruchAusZahl, URL_ZAHLEN, URL_TEXTE } from "../js/aufgaben/gegenereignis.js";
import { erzeugeZufall } from "../../kern/js/zufall.js";
import { bruch } from "../../kern/js/bruch.js";

const z = (s) => erzeugeZufall(s);
const pruefe = (a, antwort) => pruefeAntwort(a, { antwort });

test("Direkte Angabe von P(E): p kommt als Zahl aus der URL", () => {
  const a = erzeugeAufgabe(z(1), { p: 1 / 6 });
  assert.equal(a.art, "direkt");
  assert.match(a.text, /P\(E\) = 1\/6/);
  assert.deepEqual(a.loesungBruch, bruch(5, 6));
  assert.equal(pruefe(a, "1-1/6").korrekt, true);
  const f = pruefe(a, "1/6");
  assert.equal(f.korrekt, false);
  assert.match(f.meldung, /Gegenereignis|1 − P\(E\)/);
});

test("p über 1 ist Prozent (p=45 %), bruchAusZahl findet den Bruch", () => {
  assert.deepEqual(erzeugeAufgabe(z(1), { p: 45 }).p, bruch(9, 20));
  assert.deepEqual(bruchAusZahl(0.3), bruch(3, 10));
  assert.deepEqual(bruchAusZahl(5 / 12), bruch(5, 12));
});

test("Gegenereignis eines Laplace-Ereignisses", () => {
  const a = erzeugeAufgabe(z(1), { experiment: "urne", urne: "3r2b1g", ereignis: "r" });
  assert.equal(a.art, "einfach");
  assert.match(a.text, /nicht rot/);
  assert.deepEqual(a.loesungBruch, bruch(1, 2));
  assert.deepEqual(erzeugeAufgabe(z(1), { experiment: "wuerfel", ereignis: "sechs" }).loesungBruch, bruch(5, 6));
});

test("Mindestens einmal über das Gegenereignis", () => {
  const a = erzeugeAufgabe(z(1), { experiment: "wuerfel", zuege: 3, ereignis: "mind1s" });
  assert.equal(a.art, "mindestens");
  assert.deepEqual(a.loesungBruch, bruch(91, 216));
  assert.equal(pruefe(a, "1-(5/6)^3").korrekt, true);
  assert.equal(pruefe(a, "1-5/6*5/6*5/6").korrekt, true);
  assert.match(pruefe(a, "125/216").meldung, /1 −/);
  assert.match(a.tipp, /Gegenereignis/);
  assert.deepEqual(erzeugeAufgabe(z(1), { experiment: "urne", urne: "3r2b1g", zuege: 2, modus: "ohne", ereignis: "mind1r" }).loesungBruch, bruch(4, 5));
  assert.deepEqual(erzeugeAufgabe(z(1), { experiment: "muenze", zuege: 2, ereignis: "mind1k" }).loesungBruch, bruch(3, 4));
});

test("Zufallsaufgaben sind gültig und decken alle drei Arten ab", () => {
  const arten = new Set();
  for (let s = 0; s < 40; s++) {
    const a = erzeugeAufgabe(z(s));
    arten.add(a.art);
    assert.ok(a.loesungBruch.z > 0 && a.loesungBruch.z < a.loesungBruch.n, `Seed ${s}`);
  }
  assert.equal(arten.size, 3);
  assert.ok(URL_ZAHLEN.includes("p") && URL_ZAHLEN.includes("zuege"));
  for (const p of ["experiment", "ereignis", "urne", "modus", "art"]) assert.ok(URL_TEXTE.includes(p), p);
});

test("L-043: Nicht die Ereignisse ergeben 1, sondern ihre Wahrscheinlichkeiten", () => {
  const a = erzeugeAufgabe(z(1), { p: 1 / 6 });
  assert.doesNotMatch(a.tipp, /„nicht E“ zusammen ergeben/);
  assert.match(a.tipp, /Wahrscheinlichkeiten von E und „nicht E“ ergeben zusammen 1/);
});

test("L-041: Gegenereignis von „mindestens einmal keine 6“ steht positiv da – keine doppelte Verneinung", () => {
  for (const zuege of [2, 3]) {
    const a = erzeugeAufgabe(z(1), { experiment: "wuerfel", zuege, ereignis: "mind1k" });
    assert.match(a.text, /mindestens einmal „keine 6“/);
    const texte = [a.tipp, ...a.rechenweg, pruefe(a, "1/36").meldung, pruefe(a, "1/216").meldung].join(" ");
    assert.match(texte, /jedes Mal eine 6/);
    assert.doesNotMatch(texte, /kein(?:en|e)?\s+(?:einziges\s+)?Mal\s+keine/i);
  }
  for (let s = 0; s < 200; s++) {
    const a = erzeugeAufgabe(z(s), { art: "mindestens" });
    assert.doesNotMatch([a.text, a.tipp, ...a.rechenweg].join(" "), /Mal\s+keine/, `Seed ${s}`);
  }
});
