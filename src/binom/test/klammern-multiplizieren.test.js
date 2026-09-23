// Use Case: Zwei Klammern multiplizieren – (a + b)(c + d) = ac + ad + bc + bd. Generator und Prüfer.
// Muster: 1. Generator liefert gültige Aufgaben, 2. URL-Vorgaben wirken, 3. Prüfer erkennt richtig, Form und typische Fehler.
import { test } from "node:test";
import assert from "node:assert/strict";
import { erzeugeZufall } from "../../kern/js/zufall.js";
import { erzeugeAufgabe, pruefeAntwort, URL_ZAHLEN, URL_TEXTE } from "../js/aufgaben/klammern-multiplizieren.js";

test("erzeugeAufgabe: zwei Klammern mit kleinen Zahlen, Termfeld, Tipp und Rechenweg", () => {
  const z = erzeugeZufall(3);
  const vorzeichen = new Set();
  for (let i = 0; i < 60; i++) {
    const a = erzeugeAufgabe(z);
    assert.equal(a.thema, "klammern-multiplizieren");
    for (const m of [a.m1, a.m2]) assert.ok(m >= 1 && m <= 3, `m=${m}`);
    for (const n of [a.n1, a.n2]) assert.ok(n >= 1 && n <= 9, `n=${n}`);
    vorzeichen.add(`${a.op1}-${a.op2}`);
    assert.equal(a.felder.length, 1);
    assert.equal(a.felder[0].typ, "variablenterm");
    assert.ok(a.text && a.tipp && a.rechenweg.length >= 3);
    assert.equal(pruefeAntwort(a, { antwort: a.loesung.antwort }).korrekt, true);
  }
  assert.equal(vorzeichen.size, 4, "alle Vorzeichen-Kombinationen kommen vor");
});

test("Vorgaben ?m1=1&n1=3&m2=1&n2=5 → (x + 3)(x + 5) = x² + 8x + 15", () => {
  assert.deepEqual(URL_ZAHLEN, ["m1", "n1", "m2", "n2"]);
  assert.deepEqual(URL_TEXTE, ["op1", "op2"]);
  for (let s = 1; s <= 10; s++) {
    const a = erzeugeAufgabe(erzeugeZufall(s), { m1: 1, n1: 3, m2: 1, n2: 5 });
    assert.match(a.text, /\(x \+ 3\)\(x \+ 5\)/);
    assert.equal(a.loesung.antwort, "x^2+8x+15");
  }
});

test("Vorgaben ?m1=2&n1=1&op1=minus&m2=1&n2=4 → (2x − 1)(x + 4) = 2x² + 7x − 4", () => {
  const a = erzeugeAufgabe(erzeugeZufall(1), { m1: 2, n1: 1, op1: "minus", m2: 1, n2: 4 });
  assert.match(a.text, /\(2x − 1\)\(x \+ 4\)/);
  assert.equal(a.loesung.antwort, "2x^2+7x-4");
  assert.match(a.rechenweg[0], /2x · x/);
  for (const e of ["2x^2+7x-4", "2x²+7x-4", "7x + 2x^2 - 4", "2x^2+7*x-4"]) assert.equal(pruefeAntwort(a, { antwort: e }).korrekt, true, e);
});

test("Prüfer: Form, unlesbare Eingabe und falsch", () => {
  const a = erzeugeAufgabe(erzeugeZufall(1), { m1: 1, n1: 3, m2: 1, n2: 5 });
  assert.equal(pruefeAntwort(a, { antwort: "(x+3)(x+5)" }).fehler, "nicht-ausmultipliziert");
  assert.equal(pruefeAntwort(a, { antwort: "x^2+5x+3x+15" }).fehler, "nicht-zusammengefasst");
  const leer = pruefeAntwort(a, { antwort: "" });
  assert.equal(leer.fehler, "kein-term");
  assert.match(leer.meldung, /Term/);
  assert.match(pruefeAntwort(a, { antwort: "x^2+8x+" }).meldung, /unvollständig/);
  assert.equal(pruefeAntwort(a, { antwort: "x^2+7x+15" }).fehler, "falsch");
  assert.match(pruefeAntwort(a, { antwort: "x^2+8x+15" }).meldung, /^Richtig!/);
});

test("typischer Fehler nur-aussen-glieder: (x + 3)(x + 5) → x² + 15", () => {
  const a = erzeugeAufgabe(erzeugeZufall(1), { m1: 1, n1: 3, m2: 1, n2: 5 });
  const r = pruefeAntwort(a, { antwort: "x^2+15" });
  assert.equal(r.fehler, "nur-aussen-glieder");
  assert.match(r.meldung, /jedes/i);
  const b = erzeugeAufgabe(erzeugeZufall(1), { m1: 2, n1: 1, op1: "minus", m2: 1, n2: 4 });
  assert.equal(pruefeAntwort(b, { antwort: "2x^2-4" }).fehler, "nur-aussen-glieder");
});

test("typischer Fehler vorzeichenfehler: (2x − 1)(x + 4) → 2x² + 9x − 4 oder 2x² + 7x + 4", () => {
  const a = erzeugeAufgabe(erzeugeZufall(1), { m1: 2, n1: 1, op1: "minus", m2: 1, n2: 4 });
  for (const e of ["2x^2+9x-4", "2x^2+7x+4", "2x^2-7x-4", "2x^2-9x+4"]) {
    assert.equal(pruefeAntwort(a, { antwort: e }).fehler, "vorzeichenfehler", e);
  }
  assert.match(pruefeAntwort(a, { antwort: "2x^2+7x+4" }).meldung, /Vorzeichen/);
});
