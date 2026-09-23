// Use Case: Erste binomische Formel – (a + b)² = a² + 2ab + b². Generator und Prüfer.
import { test } from "node:test";
import assert from "node:assert/strict";
import { erzeugeZufall } from "../../kern/js/zufall.js";
import { erzeugeAufgabe, pruefeAntwort, URL_ZAHLEN, URL_TEXTE } from "../js/aufgaben/erste-binomische.js";

test("erzeugeAufgabe: (m·var + n)² oder (m·a + n·b)², Termfeld, Tipp und Rechenweg", () => {
  const z = erzeugeZufall(5);
  for (let i = 0; i < 40; i++) {
    const a = erzeugeAufgabe(z);
    assert.equal(a.thema, "erste-binomische");
    assert.equal(a.felder[0].typ, "variablenterm");
    assert.match(a.text, /\)²/);
    assert.ok(a.tipp && a.rechenweg.length >= 3);
    assert.equal(pruefeAntwort(a, { antwort: a.loesung.antwort }).korrekt, true);
  }
});

test("Vorgaben: ?m=1&n=4 → (x + 4)², ?m=2&n=3&var=a → (2a + 3)², ?m=3&n=2&var=a&glied=variable → (3a + 2b)²", () => {
  assert.deepEqual(URL_ZAHLEN, ["m", "n"]);
  assert.deepEqual(URL_TEXTE, ["var", "glied"]);
  const a = erzeugeAufgabe(erzeugeZufall(1), { m: 1, n: 4 });
  assert.match(a.text, /\(x \+ 4\)²/);
  assert.equal(a.loesung.antwort, "x^2+8x+16");
  assert.equal(erzeugeAufgabe(erzeugeZufall(2), { m: 2, n: 3, var: "a" }).loesung.antwort, "4a^2+12a+9");
  const c = erzeugeAufgabe(erzeugeZufall(3), { m: 3, n: 2, var: "a", glied: "variable" });
  assert.equal(c.loesung.antwort, "9a^2+12ab+4b^2");
  assert.match(c.rechenweg[1], /\(3a\)² \+ 2 · 3a · 2b \+ \(2b\)²/);
});

test("Prüfer: gleichwertige Schreibweisen richtig, Klammer stehen lassen ist ein Hinweis", () => {
  const a = erzeugeAufgabe(erzeugeZufall(1), { m: 1, n: 4 });
  for (const e of ["x^2+8x+16", "x²+8x+16", "16 + 8x + x^2"]) assert.equal(pruefeAntwort(a, { antwort: e }).korrekt, true, e);
  assert.equal(pruefeAntwort(a, { antwort: "(x+4)^2" }).fehler, "nicht-ausmultipliziert");
  assert.equal(pruefeAntwort(a, { antwort: "(x+4" }).fehler, "kein-term");
});

test("typische Fehler: binom-vergessen, faktor-2-vergessen, koeffizient-nicht-quadriert", () => {
  const a = erzeugeAufgabe(erzeugeZufall(1), { m: 1, n: 4 });
  assert.equal(pruefeAntwort(a, { antwort: "x^2+16" }).fehler, "binom-vergessen");
  assert.equal(pruefeAntwort(a, { antwort: "x^2+4x+16" }).fehler, "faktor-2-vergessen");
  assert.equal(pruefeAntwort(a, { antwort: "x^2+8x+4" }).fehler, "koeffizient-nicht-quadriert");
  assert.equal(pruefeAntwort(a, { antwort: "x^2+8x+15" }).fehler, "falsch");
  const c = erzeugeAufgabe(erzeugeZufall(3), { m: 3, n: 2, var: "a", glied: "variable" });
  assert.equal(pruefeAntwort(c, { antwort: "9a^2+4b^2" }).fehler, "binom-vergessen");
  assert.equal(pruefeAntwort(c, { antwort: "9a^2+6ab+4b^2" }).fehler, "faktor-2-vergessen");
  const r = pruefeAntwort(c, { antwort: "3a^2+12ab+4b^2" });
  assert.equal(r.fehler, "koeffizient-nicht-quadriert");
  assert.match(r.meldung, /9a²/);
  assert.match(pruefeAntwort(c, { antwort: "9a^2+4b^2" }).meldung, /2ab/);
});
