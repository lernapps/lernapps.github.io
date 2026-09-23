// Use Case: Kompetenz 1 – die Laplace-Formel anwenden (laplace.html).
import { test } from "node:test";
import assert from "node:assert/strict";
import { erzeugeAufgabe, pruefeAntwort, ergebnismengeAus, LAPLACE_EREIGNISSE, URL_ZAHLEN, URL_TEXTE } from "../js/aufgaben/laplace.js";
import { erzeugeZufall } from "../../kern/js/zufall.js";
import { bruch } from "../../kern/js/bruch.js";

const z = (s) => erzeugeZufall(s);
const pruefe = (a, antwort) => pruefeAntwort(a, { antwort });

test("Würfel: gerade Zahl", () => {
  const a = erzeugeAufgabe(z(1), { experiment: "wuerfel", ereignis: "gerade" });
  assert.equal(a.thema, "laplace");
  assert.deepEqual(a.p, bruch(1, 2));
  assert.equal(a.loesung.antwort, "1/2");
  assert.equal(a.menge.elemente.filter((e) => e.guenstig).length, 3);
  assert.match(a.text, /gerade/);
  assert.equal(pruefe(a, "3/6").korrekt, true);
  assert.equal(pruefe(a, "50%").korrekt, true);
  assert.equal(pruefe(a, "1/3").korrekt, false);
  assert.equal(pruefe(a, "?").fehler, "keine-zahl");
  assert.ok(a.rechenweg.length >= 2);
});

test("Kurzform wuerfel=gerade", () => {
  assert.equal(erzeugeAufgabe(z(1), { wuerfel: "gerade" }).menge.code, "gerade");
});

test("Würfel-Ereignisse decken die Checkliste ab", () => {
  const erwartet = { mind5: bruch(1, 3), sechs: bruch(1, 6), hoechstens2: bruch(1, 3), prim: bruch(1, 2), ungerade: bruch(1, 2) };
  for (const [code, w] of Object.entries(erwartet)) {
    assert.deepEqual(erzeugeAufgabe(z(3), { experiment: "wuerfel", ereignis: code }).p, w, code);
  }
  assert.ok(Object.keys(LAPLACE_EREIGNISSE.wuerfel).includes("gerade"));
});

test("Urne und Glücksrad", () => {
  const a = erzeugeAufgabe(z(1), { experiment: "urne", urne: "3r2b1g", ereignis: "b" });
  assert.deepEqual(a.p, bruch(1, 3));
  assert.equal(a.menge.elemente.length, 6);
  const g = erzeugeAufgabe(z(1), { experiment: "gluecksrad", rad: "2r1b1g", ereignis: "r" });
  assert.deepEqual(g.p, bruch(1, 2));
  assert.equal(g.menge.art, "gluecksrad");
});

test("Karten, Lose und zwei Würfel", () => {
  assert.deepEqual(erzeugeAufgabe(z(1), { experiment: "karten", ereignis: "bild" }).p, bruch(12, 32));
  assert.deepEqual(erzeugeAufgabe(z(1), { experiment: "lose", lose: 20, gewinne: 5 }).p, bruch(1, 4));
  const zw = erzeugeAufgabe(z(1), { experiment: "zweiwuerfel", ereignis: "summe7" });
  assert.deepEqual(zw.p, bruch(1, 6));
  assert.equal(zw.menge.elemente.length, 36);
  assert.deepEqual(erzeugeAufgabe(z(1), { experiment: "zweiwuerfel", ereignis: "pasch" }).p, bruch(1, 6));
});

test("Zufallsaufgabe ist mit Seed reproduzierbar und gültig", () => {
  assert.equal(erzeugeAufgabe(z(99)).text, erzeugeAufgabe(z(99)).text);
  for (let s = 0; s < 40; s++) {
    const x = erzeugeAufgabe(z(s));
    assert.ok(x.p.z > 0 && x.p.z < x.p.n, `Seed ${s}: ${x.text}`);
  }
});

test("Farben statt Kugeln gezählt bekommt eine gezielte Rückmeldung", () => {
  const a = erzeugeAufgabe(z(1), { experiment: "urne", urne: "3r2b1g", ereignis: "b" });
  const r = pruefe(a, "1/3 ");
  assert.equal(r.korrekt, true);
  const f = erzeugeAufgabe(z(1), { experiment: "urne", urne: "3r2b1g", ereignis: "r" });
  assert.match(pruefe(f, "1/3").meldung, /Kugel/);
});

test("ergebnismengeAus fällt bei Unsinn auf Standard zurück; URL-Parameter bleiben dieselben", () => {
  assert.ok(ergebnismengeAus({ experiment: "urne", urne: "kaputt", ereignis: "r" }, z(1)).elemente.length > 0);
  for (const p of ["experiment", "ereignis", "urne", "rad", "wuerfel"]) assert.ok(URL_TEXTE.includes(p), p);
  for (const p of ["lose", "gewinne", "schwer"]) assert.ok(URL_ZAHLEN.includes(p), p);
});

test("TD-18: Rückmeldung schreibt \"=\" bei exakten Werten", () => {
  const halb = erzeugeAufgabe(z(1), { experiment: "wuerfel", ereignis: "gerade" });
  assert.match(pruefe(halb, "1/2").meldung, /1\/2 = 0,5 = 50 %/);
  assert.doesNotMatch(pruefe(halb, "1/2").meldung, /≈/);
});
