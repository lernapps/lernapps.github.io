// Use Case: Terme für die binomischen Formeln bauen – gemeinsame Hilfen aller Generatoren (js/aufgaben/terme.js).
// BR-B1 Ausmultiplizieren fasst gleichartige Glieder zusammen, Reihenfolge wie beim Rechnen (x², x, Zahl).
// BR-B2 Eingabeform (x^2, -) für Prüfer und Links, Anzeigeform (x², −) für Aufgabentext und Rechenweg.
// BR-B3 Binom-Struktur: ein Quadrat einer Klammer mit zwei Gliedern oder ein Produkt zweier solcher Klammern.
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  glied, multipliziere, addiere, negiere, alsEingabe, alsAnzeige, gliedAnzeige, binomAnzeige, binomEingabe, istBinomProdukt,
} from "../js/aufgaben/terme.js";

const x = (k) => glied(k, "x");
const zahl = (k) => glied(k);

test("BR-B1: (2x − 1)(x + 4) = 2x² + 7x − 4", () => {
  const p = multipliziere([x(2), zahl(-1)], [x(1), zahl(4)]);
  assert.equal(alsEingabe(p), "2x^2+7x-4");
  assert.equal(alsAnzeige(p), "2x² + 7x − 4");
});

test("BR-B1: (3a + 2b)² und (a + b)(a − b); Nullglieder fallen weg", () => {
  const a = glied(3, "a");
  const b = glied(2, "b");
  assert.equal(alsAnzeige(multipliziere([a, b], [a, b])), "9a² + 12ab + 4b²");
  assert.equal(alsAnzeige(multipliziere([glied(1, "a"), glied(1, "b")], [glied(1, "a"), glied(-1, "b")])), "a² − b²");
});

test("BR-B2: Glieder mit Koeffizient 1 und −1, Vorzeichen, Addieren und Negieren", () => {
  assert.equal(gliedAnzeige(glied(-1, "x", "x")), "−x²");
  assert.equal(gliedAnzeige(glied(1)), "1");
  assert.equal(gliedAnzeige(glied(-3)), "−3");
  assert.equal(alsEingabe([glied(-1, "x", "x"), zahl(9)]), "-x^2+9");
  assert.equal(alsAnzeige(addiere([x(1)], [x(2), zahl(-5)])), "3x − 5");
  assert.equal(alsAnzeige(negiere([x(1), zahl(-5)])), "−x + 5");
  assert.equal(alsAnzeige([]), "0");
});

test("BR-B2: Binome anzeigen und eingeben", () => {
  assert.equal(binomAnzeige([x(2), zahl(-1)]), "(2x − 1)");
  assert.equal(binomEingabe([x(2), zahl(-1)]), "(2x-1)");
  assert.equal(binomAnzeige([glied(3, "a"), glied(2, "b")]), "(3a + 2b)");
});

test("BR-B3: istBinomProdukt erkennt (x+3)², (x+4)(x−4), nicht aber 1·(x²+6x+9)", () => {
  for (const t of ["(x+3)^2", "(x+3)²", "(x-5)^2", "(x+4)(x-4)", "(x-4)*(x+4)", "(2a+3b)^2", "(3+x)^2", "(x+3)(x+3)", "((x+3))^2"]) {
    assert.equal(istBinomProdukt(t), true, t);
  }
  for (const t of ["1*(x^2+6x+9)", "(x^2+6x+9)", "x^2+6x+9", "(x+3)^3", "2(x+3)^2", "(x+3)(x+3)(x+3)", "(x+1+2)^2", "x(x+6)", "(x+"]) {
    assert.equal(istBinomProdukt(t), false, t);
  }
});
