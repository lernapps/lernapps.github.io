// Use Case: Geschickt rechnen – Quadrate und Produkte mit den binomischen Formeln im Kopf ausrechnen (49², 21 · 19, 102²).
import { test } from "node:test";
import assert from "node:assert/strict";
import { erzeugeZufall } from "../../kern/js/zufall.js";
import { erzeugeAufgabe, pruefeAntwort, URL_ZAHLEN, URL_TEXTE } from "../js/aufgaben/geschickt-rechnen.js";

test("erzeugeAufgabe: alle drei Formeln, glatte Zehner als Basis, Auswahl- und Zahlenfeld", () => {
  const z = erzeugeZufall(2);
  const formeln = new Set();
  for (let i = 0; i < 60; i++) {
    const a = erzeugeAufgabe(z);
    formeln.add(a.formel);
    assert.equal(a.thema, "geschickt-rechnen");
    assert.ok(a.basis % 10 === 0 && a.basis >= 20 && a.basis <= 100, `basis ${a.basis}`);
    assert.ok(a.abstand >= 1 && a.abstand <= 3, `abstand ${a.abstand}`);
    assert.deepEqual(a.felder.map((f) => f.typ), ["auswahl", "zahl"]);
    assert.equal(a.felder[1].nurZahl, true);
    assert.ok(a.tipp && a.rechenweg.length >= 3);
    assert.equal(pruefeAntwort(a, { formel: String(a.loesung.formel), ergebnis: String(a.loesung.ergebnis) }).korrekt, true);
  }
  assert.deepEqual([...formeln].sort(), [1, 2, 3]);
});

test("Vorgaben: 49² = (50 − 1)², 21 · 19 = 20² − 1², 102² = (100 + 2)²", () => {
  assert.deepEqual(URL_ZAHLEN, ["formel", "basis", "abstand"]);
  assert.deepEqual(URL_TEXTE, []);
  const a = erzeugeAufgabe(erzeugeZufall(1), { formel: 2, basis: 50, abstand: 1 });
  assert.match(a.text, /49²/);
  assert.deepEqual(a.loesung, { formel: "2", ergebnis: 2401 });
  const b = erzeugeAufgabe(erzeugeZufall(1), { formel: 3, basis: 20, abstand: 1 });
  assert.match(b.text, /21 · 19/);
  assert.equal(b.loesung.ergebnis, 399);
  assert.match(b.rechenweg[0], /\(20 \+ 1\)\(20 − 1\)/);
  const c = erzeugeAufgabe(erzeugeZufall(1), { formel: 1, basis: 100, abstand: 2 });
  assert.match(c.text, /102²/);
  assert.equal(c.loesung.ergebnis, 10404);
});

test("Prüfer: richtig, falsche-formel, zerlegung-falsch, leere Eingabe, Ausdruck statt Zahl", () => {
  const a = erzeugeAufgabe(erzeugeZufall(1), { formel: 2, basis: 50, abstand: 1 });
  assert.match(pruefeAntwort(a, { formel: "2", ergebnis: "2401" }).meldung, /^Richtig!/);
  const f = pruefeAntwort(a, { formel: "1", ergebnis: "2401" });
  assert.equal(f.fehler, "falsche-formel");
  assert.equal(f.felder.formel.korrekt, false);
  assert.match(f.meldung, /Minus/);
  for (const e of ["2499", "2501", "2451", "2601"]) assert.equal(pruefeAntwort(a, { formel: "2", ergebnis: e }).fehler, "zerlegung-falsch", e);
  assert.equal(pruefeAntwort(a, { formel: "2", ergebnis: "2400" }).fehler, "falsch");
  assert.equal(pruefeAntwort(a, { formel: "", ergebnis: "" }).fehler, "keine-eingabe");
  assert.equal(pruefeAntwort(a, { formel: "2", ergebnis: "49*49" }).fehler, "ausdruck-statt-zahl");
  const b = erzeugeAufgabe(erzeugeZufall(1), { formel: 3, basis: 20, abstand: 1 });
  assert.equal(pruefeAntwort(b, { formel: "3", ergebnis: "401" }).fehler, "zerlegung-falsch");
});

test("L-006: Tipp und Rückmeldung sprechen von einer glatten Zahl (Zehner oder Hunderter), nicht nur vom Zehner", () => {
  const a = erzeugeAufgabe(erzeugeZufall(1), { formel: 1, basis: 100, abstand: 3 });
  assert.match(a.tipp, /glatte Zahl \(Zehner oder Hunderter\)/);
  assert.match(pruefeAntwort(a, { formel: "1", ergebnis: "1" }).meldung, /glatte Zahl/);
  for (const f of [1, 2]) {
    const b = erzeugeAufgabe(erzeugeZufall(1), { formel: f, basis: 100, abstand: 3 });
    assert.doesNotMatch(pruefeAntwort(b, { formel: "3", ergebnis: "1" }).meldung, /Zehner\b(?! oder)/);
  }
});
