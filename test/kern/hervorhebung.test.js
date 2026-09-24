// Use Case: Lösung zeigen – der Rechenweg hebt das Ergebnis fett hervor, ohne Generator-Text als HTML zu parsen (T-003).
import { test } from "node:test";
import assert from "node:assert/strict";
import { zerlegeHervorhebung } from "../../src/kern/js/aufgabe-eingabe.js";

test("Text ohne Markup bleibt ein einziger normaler Abschnitt", () => {
  assert.deepEqual(zerlegeHervorhebung("a = 3, b = 4"), [{ text: "a = 3, b = 4", fett: false }]);
});

test("<strong>…</strong> wird zum fetten Abschnitt, der Rest bleibt Text", () => {
  assert.deepEqual(zerlegeHervorhebung("= <strong>x² + 6x + 9</strong>"), [
    { text: "= ", fett: false },
    { text: "x² + 6x + 9", fett: true },
  ]);
  assert.deepEqual(zerlegeHervorhebung("<strong>1/4</strong> und <strong>3/4</strong>."), [
    { text: "1/4", fett: true },
    { text: " und ", fett: false },
    { text: "3/4", fett: true },
    { text: ".", fett: false },
  ]);
});

test("jedes andere Markup bleibt wörtlicher Text und wird nie ausgeführt", () => {
  const boese = '<img src=x onerror="alert(1)"><script>alert(2)</script>';
  assert.deepEqual(zerlegeHervorhebung(boese), [{ text: boese, fett: false }]);
  assert.deepEqual(zerlegeHervorhebung("<strong><img src=x onerror=alert(1)></strong>"), [
    { text: "<img src=x onerror=alert(1)>", fett: true },
  ]);
});

test("leerer oder fehlender Text ergibt keine Abschnitte", () => {
  assert.deepEqual(zerlegeHervorhebung(""), []);
  assert.deepEqual(zerlegeHervorhebung(undefined), []);
});
