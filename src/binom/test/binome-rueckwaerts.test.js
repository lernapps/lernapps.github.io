// Use Case: Binome rückwärts – eine Summe als binomische Formel erkennen und als Produkt schreiben; Lücken ergänzen.
import { test } from "node:test";
import assert from "node:assert/strict";
import { erzeugeZufall } from "../../kern/js/zufall.js";
import { erzeugeAufgabe, pruefeAntwort, URL_ZAHLEN, URL_TEXTE } from "../js/aufgaben/binome-rueckwaerts.js";

test("erzeugeAufgabe: beide Typen, alle drei Formeln, Lösung wird akzeptiert", () => {
  const z = erzeugeZufall(6);
  const arten = new Set();
  for (let i = 0; i < 80; i++) {
    const a = erzeugeAufgabe(z);
    arten.add(`${a.typ}-${a.formel}`);
    assert.equal(a.thema, "binome-rueckwaerts");
    assert.ok(a.text && a.tipp && a.rechenweg.length >= 3);
    assert.equal(a.felder[0].typ, a.typ === "luecke" ? "zahl" : "variablenterm");
    assert.equal(pruefeAntwort(a, { antwort: String(a.loesung.antwort) }).korrekt, true, a.text);
  }
  for (const art of ["faktorisieren-1", "faktorisieren-2", "faktorisieren-3", "luecke-1", "luecke-2"]) assert.ok(arten.has(art), art);
});

test("Vorgaben: ?typ=faktorisieren&formel=1&m=1&n=3 → x² + 6x + 9 = (x + 3)²", () => {
  assert.deepEqual(URL_ZAHLEN, ["formel", "m", "n"]);
  assert.deepEqual(URL_TEXTE, ["typ", "luecke", "var", "glied"]);
  const a = erzeugeAufgabe(erzeugeZufall(1), { typ: "faktorisieren", formel: 1, m: 1, n: 3 });
  assert.match(a.text, /x² \+ 6x \+ 9/);
  assert.equal(a.loesung.antwort, "(x+3)^2");
  for (const e of ["(x+3)^2", "(x+3)²", "(3+x)^2", "(x+3)(x+3)"]) assert.equal(pruefeAntwort(a, { antwort: e }).korrekt, true, e);
  assert.match(erzeugeAufgabe(erzeugeZufall(1), { formel: 2, m: 1, n: 5 }).text, /x² − 10x \+ 25/);
  const c = erzeugeAufgabe(erzeugeZufall(1), { formel: 3, m: 1, n: 4 });
  assert.match(c.text, /x² − 16/);
  assert.equal(pruefeAntwort(c, { antwort: "(x-4)(x+4)" }).korrekt, true);
});

test("Form: ausmultipliziert oder 1·(…) ist ein Hinweis, kein Fehler", () => {
  const a = erzeugeAufgabe(erzeugeZufall(1), { typ: "faktorisieren", formel: 1, m: 1, n: 3 });
  for (const e of ["x^2+6x+9", "1*(x^2+6x+9)", "(x^2+6x+9)"]) {
    const r = pruefeAntwort(a, { antwort: e });
    assert.equal(r.korrekt, false, e);
    assert.equal(r.fehler, "nicht-faktorisiert", e);
    assert.match(r.meldung, /binomische Formel/, e);
  }
});

test("typische Fehler beim Faktorisieren: falsches-vorzeichen, nicht-halbiert, falsche-formel", () => {
  const a = erzeugeAufgabe(erzeugeZufall(1), { typ: "faktorisieren", formel: 1, m: 1, n: 3 });
  assert.equal(pruefeAntwort(a, { antwort: "(x-3)^2" }).fehler, "falsches-vorzeichen");
  assert.equal(pruefeAntwort(a, { antwort: "(x+6)^2" }).fehler, "nicht-halbiert");
  assert.equal(pruefeAntwort(a, { antwort: "(x+3)(x-3)" }).fehler, "falsche-formel");
  assert.equal(pruefeAntwort(a, { antwort: "(x+9)^2" }).fehler, "falsch");
  const b = erzeugeAufgabe(erzeugeZufall(1), { formel: 2, m: 1, n: 5 });
  assert.equal(pruefeAntwort(b, { antwort: "(x+5)^2" }).fehler, "falsches-vorzeichen");
  assert.equal(pruefeAntwort(b, { antwort: "(x-10)^2" }).fehler, "nicht-halbiert");
  const c = erzeugeAufgabe(erzeugeZufall(1), { formel: 3, m: 1, n: 4 });
  assert.equal(pruefeAntwort(c, { antwort: "(x-4)^2" }).fehler, "falsche-formel");
  assert.equal(pruefeAntwort(c, { antwort: "(x+4)^2" }).fehler, "falsche-formel");
});

test("Lücken: ?typ=luecke&luecke=mitte&formel=1&m=1&n=5 → x² + □x + 25, Lücke 10; luecke=ende → x² + 8x + □, Lücke 16", () => {
  const a = erzeugeAufgabe(erzeugeZufall(1), { typ: "luecke", luecke: "mitte", formel: 1, m: 1, n: 5 });
  assert.match(a.text, /x² \+ □x \+ 25/);
  assert.equal(a.loesung.antwort, 10);
  assert.equal(a.felder[0].nurZahl, true);
  assert.equal(pruefeAntwort(a, { antwort: "10" }).korrekt, true);
  assert.equal(pruefeAntwort(a, { antwort: "5" }).fehler, "faktor-2-vergessen");
  assert.equal(pruefeAntwort(a, { antwort: "2*5" }).fehler, "ausdruck-statt-zahl");
  const b = erzeugeAufgabe(erzeugeZufall(1), { typ: "luecke", luecke: "ende", formel: 1, m: 1, n: 4 });
  assert.match(b.text, /x² \+ 8x \+ □/);
  assert.equal(b.loesung.antwort, 16);
  assert.equal(pruefeAntwort(b, { antwort: "64" }).fehler, "nicht-halbiert");
  assert.equal(pruefeAntwort(b, { antwort: "4" }).fehler, "nicht-quadriert");
  assert.equal(pruefeAntwort(b, { antwort: "15" }).fehler, "falsch");
  const c = erzeugeAufgabe(erzeugeZufall(1), { typ: "luecke", luecke: "mitte", formel: 2, m: 1, n: 5 });
  assert.match(c.text, /x² − □x \+ 25/);
  assert.equal(c.loesung.antwort, 10);
});
