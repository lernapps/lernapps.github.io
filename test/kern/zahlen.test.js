import { test } from "node:test";
import assert from "node:assert/strict";
import {
  parseZahl, formatZahl, runde, istGleich, istSchoen, mitEinheit,
} from "../../src/kern/js/zahlen.js";

test("parseZahl liest deutsche Schreibweisen", () => {
  assert.equal(parseZahl("12,5"), 12.5);
  assert.equal(parseZahl("12.5"), 12.5);
  assert.equal(parseZahl("12,5 %"), 12.5);
  assert.equal(parseZahl("12,50"), 12.5);
  assert.equal(parseZahl(" 250 € "), 250);
  assert.equal(parseZahl("1.250,50"), 1250.5);
  assert.equal(parseZahl("-3"), -3);
  assert.equal(parseZahl("1/8"), 0.125);
  assert.equal(parseZahl("3/4"), 0.75);
  assert.equal(parseZahl("30 mAh"), 30);
  assert.equal(parseZahl("5 Schüler"), 5);
  assert.equal(parseZahl("12,5 Prozent"), 12.5);
  assert.equal(parseZahl("2,5 cm"), 2.5);
});

test("parseZahl gibt NaN bei Unsinn", () => {
  assert.ok(Number.isNaN(parseZahl("")));
  assert.ok(Number.isNaN(parseZahl("abc")));
  assert.ok(Number.isNaN(parseZahl("1/0")));
  assert.ok(Number.isNaN(parseZahl(null)));
});

test("formatZahl schreibt deutsch mit Komma", () => {
  assert.equal(formatZahl(12.5), "12,5");
  assert.equal(formatZahl(250), "250");
  assert.equal(formatZahl(0.125), "0,13");
  assert.equal(formatZahl(1234.5), "1234,5");
  assert.equal(formatZahl(2.5, 2), "2,50");
  assert.equal(mitEinheit(12.5, "m"), "12,5 m");
  assert.equal(mitEinheit(3, ""), "3");
});

test("runde rundet kaufmaennisch", () => {
  assert.equal(runde(1.005, 2), 1.01);
  assert.equal(runde(2.345, 2), 2.35);
  assert.equal(runde(7.25, 1), 7.3);
  assert.equal(runde(10, 0), 10);
});

test("istGleich vergleicht mit Toleranz", () => {
  assert.ok(istGleich(12.5, 12.5));
  assert.ok(istGleich(12.504, 12.5));
  assert.ok(!istGleich(12.6, 12.5));
  assert.ok(istGleich(33.3, 33.333, 0.05));
});

test("istSchoen erkennt ganze Zahlen und eine Nachkommastelle", () => {
  assert.ok(istSchoen(12));
  assert.ok(istSchoen(12.5));
  assert.ok(!istSchoen(12.55));
  assert.ok(!istSchoen(1 / 3));
});
