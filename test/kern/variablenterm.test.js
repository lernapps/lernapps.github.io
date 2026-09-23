// Use Case UC-T: Terme mit Variablen eingeben (z. B. binomische Formeln, Klasse 8).
// BR-T1 Variablen sind Einzelbuchstaben a–z (klein); gelesen wird ohne eval.
// BR-T2 Implizite Multiplikation (2x, 3ab, 2(x+1), (a+b)(a−b), x(x+1)) bindet wie "*": 1/2x = (1/2)·x.
// BR-T3 Potenzen mit ^, ² und ³ (alle Hochzahlen ⁰–⁹); Vorzeichen binden schwächer: −x² = −(x²).
// BR-T4 Malzeichen * · ×, Unicode-Minus, Dezimalkomma; sqrt/wurzel/√ und pi/π gelten weiter.
// BR-T5 "pi" ist immer die Kreiszahl π (wie in bruch.js); p·i schreibt man "p*i", "p·i" oder "p i".
// BR-T6 Die Vorschau zeigt den Term schön gesetzt (x^2 → x², 3*x → 3x) oder eine kurze Meldung.
import { test } from "node:test";
import assert from "node:assert/strict";
import { leseVariablenterm, auswerten, formatTerm } from "../../src/kern/js/variablenterm.js";

const wert = (text, belegung = {}) => {
  const t = leseVariablenterm(text);
  assert.equal(t.fehler, undefined, `${text}: ${t.meldung}`);
  return auswerten(t.baum, belegung);
};
const gesetzt = (text) => leseVariablenterm(text).text;
const nahe = (a, b) => assert.ok(Math.abs(a - b) < 1e-9 * Math.max(1, Math.abs(b)), `${a} ≠ ${b}`);

test("BR-T1: Variablen a–z, sortiert gemeldet", () => {
  const t = leseVariablenterm("3ab + c");
  assert.deepEqual(t.variablen, ["a", "b", "c"]);
  nahe(wert("3ab + c", { a: 2, b: 5, c: 7 }), 37);
  assert.equal(leseVariablenterm("X + 1").fehler, "grossbuchstabe");
  assert.equal(leseVariablenterm("2x & 3").fehler, "zeichen");
  assert.match(leseVariablenterm("2x & 3").meldung, /„&“/);
});

test("BR-T2: implizite Multiplikation", () => {
  const b = { a: 3, b: 2, x: 5 };
  nahe(wert("2x", b), 10);
  nahe(wert("3ab", b), 18);
  nahe(wert("2(x+1)", b), 12);
  nahe(wert("(a+b)(a-b)", b), 5);
  nahe(wert("x(x+1)", b), 30);
  nahe(wert("(x+1)x", b), 30);
  nahe(wert("2 x y", { x: 3, y: 4 }), 24);
});

test("BR-T2: 1/2x ist (1/2)·x, x/2y ist (x/2)·y – Bruch vor der Variablen wie ½x", () => {
  nahe(wert("1/2x", { x: 6 }), 3);
  nahe(wert("x/2y", { x: 6, y: 4 }), 12);
  nahe(wert("1/2(x+2)", { x: 6 }), 4);
  nahe(wert("x/(2y)", { x: 6, y: 4 }), 0.75);
  assert.equal(gesetzt("1/2x"), "(1/2)x");
});

test("BR-T3: Potenzen mit ^, ², ³ und Hochzahlen; −x² = −(x²)", () => {
  nahe(wert("x^2", { x: 3 }), 9);
  nahe(wert("x²", { x: 3 }), 9);
  nahe(wert("x³", { x: 2 }), 8);
  nahe(wert("x^(3)", { x: 2 }), 8);
  nahe(wert("x¹⁰", { x: 2 }), 1024);
  nahe(wert("2x^2", { x: 3 }), 18);
  nahe(wert("(x+3)²", { x: 2 }), 25);
  nahe(wert("-x^2", { x: 3 }), -9);
  nahe(wert("−x²", { x: 3 }), -9);
  nahe(wert("(-x)^2", { x: 3 }), 9);
  nahe(wert("a²b³", { a: 2, b: 3 }), 108);
  assert.equal(leseVariablenterm("x^y").fehler, "exponent");
  assert.equal(leseVariablenterm("x^65").fehler, "exponent");
  assert.equal(leseVariablenterm("x^").fehler, "exponent");
});

test("BR-T4: Malzeichen, Unicode-Minus, Dezimalkomma", () => {
  const b = { a: 3, b: 2, x: 4 };
  nahe(wert("a*b", b), 6);
  nahe(wert("a·b", b), 6);
  nahe(wert("a×b", b), 6);
  nahe(wert("a − b", b), 1);
  nahe(wert("a – b", b), 1);
  nahe(wert("2,5x", b), 10);
  nahe(wert("2.5x", b), 10);
  nahe(wert("x:2", b), 2);
});

test("BR-T4: sqrt, wurzel, √ und pi/π bleiben lesbar", () => {
  nahe(wert("sqrt(9)x", { x: 2 }), 6);
  nahe(wert("wurzel(x)", { x: 16 }), 4);
  nahe(wert("√x", { x: 16 }), 4);
  nahe(wert("√(x+7)", { x: 9 }), 4);
  nahe(wert("pi r^2", { r: 2 }), 4 * Math.PI);
  nahe(wert("πr²", { r: 2 }), 4 * Math.PI);
  nahe(wert("2*PI"), 2 * Math.PI);
  assert.ok(Number.isNaN(wert("sqrt(x)", { x: -4 })));
  assert.equal(leseVariablenterm("sqrt x").fehler, "wurzel-klammer");
});

test("BR-T5: 'pi' ist die Kreiszahl, nicht p·i – p·i braucht Malzeichen oder Leerzeichen", () => {
  assert.deepEqual(leseVariablenterm("pi").variablen, []);
  nahe(wert("pi"), Math.PI);
  for (const text of ["p*i", "p·i", "p i"]) {
    assert.deepEqual(leseVariablenterm(text).variablen, ["i", "p"], text);
    nahe(wert(text, { p: 2, i: 5 }), 10);
    assert.equal(gesetzt(text), "p·i", text); // nie "pi" setzen: das läse sich als π
  }
  // Wörter werden gierig gelesen: "api" = a·π, "sqrt" ist immer die Wurzel.
  assert.deepEqual(leseVariablenterm("api").variablen, ["a"]);
});

test("Syntaxfehler liefern Code und kurze Meldung", () => {
  const faelle = {
    "": "leer", "(x+1": "klammer-fehlt", "x+1)": "klammer-zu-viel", "x+": "unvollstaendig", "*x": "unvollstaendig",
    "()": "unvollstaendig", "x2": "zahl-dahinter", "(x+1)2": "zahl-dahinter",
  };
  for (const [text, fehler] of Object.entries(faelle)) {
    const r = leseVariablenterm(text);
    assert.equal(r.fehler, fehler, text);
    if (text) assert.ok(r.meldung.length > 0, text);
  }
});

test("BR-T6: schön gesetzt", () => {
  const faelle = {
    "x^2": "x²", "3*x": "3x", "x*3": "x·3", "2*3": "2·3", "a*b": "ab", "3ab": "3ab", "(x+3)^2": "(x + 3)²",
    "x^2+6x+9": "x² + 6x + 9", "2(x+1)": "2(x + 1)", "(a+b)(a-b)": "(a + b)(a − b)", "a-(-b)": "a − (−b)",
    "-x^2": "−x²", "2*-x": "2·(−x)", "a+-b": "a + (−b)", "2,5x": "2,5x", "2.5x": "2,5x", "x^10": "x¹⁰", "pi r^2": "πr²",
    "√2x": "√2·x", "sqrt(2)x": "√(2)x", "x/2": "x/2", "(√2)^2": "(√2)²", "x^2^3": "(x²)³", "a × b": "ab",
  };
  for (const [text, erwartet] of Object.entries(faelle)) assert.equal(gesetzt(text), erwartet, text);
});

test("formatTerm setzt einen Baum; gesetzter Text liest sich wieder gleich", () => {
  for (const text of ["(x+3)^2", "1/2x", "p*i", "√2x", "-x^2+2x-1", "2*-x", "x^2^3"]) {
    const t = leseVariablenterm(text);
    assert.equal(formatTerm(t.baum), t.text);
    const wieder = leseVariablenterm(t.text);
    assert.equal(wieder.text, t.text, text);
  }
});
