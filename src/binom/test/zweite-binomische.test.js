// Use Case: Zweite binomische Formel – (a − b)² = a² − 2ab + b². Generator und Prüfer.
import { test } from "node:test";
import assert from "node:assert/strict";
import { erzeugeZufall } from "../../kern/js/zufall.js";
import { erzeugeAufgabe, pruefeAntwort, URL_ZAHLEN, URL_TEXTE } from "../js/aufgaben/zweite-binomische.js";

test("erzeugeAufgabe: (m·var − n)² oder (m·a − n·b)², Termfeld, Tipp und Rechenweg", () => {
  const z = erzeugeZufall(8);
  for (let i = 0; i < 40; i++) {
    const a = erzeugeAufgabe(z);
    assert.equal(a.thema, "zweite-binomische");
    assert.equal(a.felder[0].typ, "variablenterm");
    assert.match(a.text, / − .*\)²/);
    assert.ok(a.tipp && a.rechenweg.length >= 3);
    assert.equal(pruefeAntwort(a, { antwort: a.loesung.antwort }).korrekt, true);
  }
});

test("Vorgaben: ?m=1&n=5 → (x − 5)² = x² − 10x + 25; ?m=2&n=3&var=a&glied=variable → (2a − 3b)²", () => {
  assert.deepEqual(URL_ZAHLEN, ["m", "n"]);
  assert.deepEqual(URL_TEXTE, ["var", "glied"]);
  const a = erzeugeAufgabe(erzeugeZufall(1), { m: 1, n: 5 });
  assert.match(a.text, /\(x − 5\)²/);
  assert.equal(a.loesung.antwort, "x^2-10x+25");
  assert.match(a.rechenweg[1], /x² − 2 · x · 5 \+ 5²/);
  assert.equal(erzeugeAufgabe(erzeugeZufall(2), { m: 2, n: 3, var: "a", glied: "variable" }).loesung.antwort, "4a^2-12ab+9b^2");
});

test("typische Fehler: binom-vergessen, vorzeichen-b-quadrat, faktor-2-vergessen, vorzeichen-mittelglied", () => {
  const a = erzeugeAufgabe(erzeugeZufall(1), { m: 1, n: 5 });
  assert.equal(pruefeAntwort(a, { antwort: "x^2-25" }).fehler, "binom-vergessen");
  assert.equal(pruefeAntwort(a, { antwort: "x^2+25" }).fehler, "binom-vergessen");
  const b = pruefeAntwort(a, { antwort: "x^2-10x-25" });
  assert.equal(b.fehler, "vorzeichen-b-quadrat");
  assert.match(b.meldung, /Minus mal Minus/);
  assert.equal(pruefeAntwort(a, { antwort: "x^2-5x+25" }).fehler, "faktor-2-vergessen");
  assert.equal(pruefeAntwort(a, { antwort: "x^2+10x+25" }).fehler, "vorzeichen-mittelglied");
  assert.equal(pruefeAntwort(a, { antwort: "x^2-10x+5" }).fehler, "koeffizient-nicht-quadriert");
  assert.equal(pruefeAntwort(a, { antwort: "x^2-10x+24" }).fehler, "falsch");
  assert.equal(pruefeAntwort(a, { antwort: "(x-5)(x-5)" }).fehler, "nicht-ausmultipliziert");
});
