// Use Case: Dritte binomische Formel – (a + b)(a − b) = a² − b². Generator und Prüfer.
import { test } from "node:test";
import assert from "node:assert/strict";
import { erzeugeZufall } from "../../kern/js/zufall.js";
import { erzeugeAufgabe, pruefeAntwort, URL_ZAHLEN, URL_TEXTE } from "../js/aufgaben/dritte-binomische.js";

test("erzeugeAufgabe: (a + b)(a − b) in beiden Reihenfolgen, Termfeld, Tipp und Rechenweg", () => {
  const z = erzeugeZufall(4);
  const reihenfolgen = new Set();
  for (let i = 0; i < 40; i++) {
    const a = erzeugeAufgabe(z);
    reihenfolgen.add(a.reihenfolge);
    assert.equal(a.thema, "dritte-binomische");
    assert.equal(a.felder[0].typ, "variablenterm");
    assert.ok(a.tipp && a.rechenweg.length >= 3);
    assert.equal(pruefeAntwort(a, { antwort: a.loesung.antwort }).korrekt, true);
  }
  assert.deepEqual([...reihenfolgen].sort(), ["minusplus", "plusminus"]);
});

test("Vorgaben: ?m=1&n=4 → (x + 4)(x − 4) = x² − 16; reihenfolge=minusplus dreht die Klammern", () => {
  assert.deepEqual(URL_ZAHLEN, ["m", "n"]);
  assert.deepEqual(URL_TEXTE, ["var", "glied", "reihenfolge"]);
  const a = erzeugeAufgabe(erzeugeZufall(1), { m: 1, n: 4 });
  assert.match(a.text, /\(x \+ 4\)\(x − 4\)/);
  assert.equal(a.loesung.antwort, "x^2-16");
  const b = erzeugeAufgabe(erzeugeZufall(1), { m: 3, n: 2, var: "a", glied: "variable", reihenfolge: "minusplus" });
  assert.match(b.text, /\(3a − 2b\)\(3a \+ 2b\)/);
  assert.equal(b.loesung.antwort, "9a^2-4b^2");
});

test("typische Fehler: mittelglied-geschrieben, vorzeichen, koeffizient-nicht-quadriert", () => {
  const a = erzeugeAufgabe(erzeugeZufall(1), { m: 1, n: 4 });
  for (const e of ["x^2+8x-16", "x^2-8x-16", "x^2+8x+16", "x^2-8x+16"]) {
    assert.equal(pruefeAntwort(a, { antwort: e }).fehler, "mittelglied-geschrieben", e);
  }
  const r = pruefeAntwort(a, { antwort: "x^2+16" });
  assert.equal(r.fehler, "vorzeichen");
  assert.match(r.meldung, /Minus/);
  assert.equal(pruefeAntwort(a, { antwort: "16-x^2" }).fehler, "vorzeichen");
  assert.equal(pruefeAntwort(a, { antwort: "x^2-4" }).fehler, "koeffizient-nicht-quadriert");
  assert.equal(pruefeAntwort(a, { antwort: "x^2-15" }).fehler, "falsch");
  assert.equal(pruefeAntwort(a, { antwort: "(x+4)(x-4)" }).fehler, "nicht-ausmultipliziert");
});
