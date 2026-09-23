import { test } from "node:test";
import assert from "node:assert/strict";
import {
  bruch, addiere, multipliziere, subtrahiere, potenz, vergleiche, istGleich,
  zuDezimal, parseBruch, formatBruch, formatDezimal, formatProzent, formatAlle, endStellen,
  auswerten, auswertenMitInfo, leseTerm,
} from "../../src/kern/js/bruch.js";

test("bruch kürzt und normalisiert das Vorzeichen", () => {
  assert.deepEqual(bruch(2, 6), { z: 1, n: 3 });
  assert.deepEqual(bruch(3, -6), { z: -1, n: 2 });
  assert.deepEqual(bruch(0, 5), { z: 0, n: 1 });
  assert.throws(() => bruch(1, 0));
});

test("Rechenarten", () => {
  assert.deepEqual(addiere(bruch(1, 6), bruch(1, 6)), { z: 1, n: 3 });
  assert.deepEqual(subtrahiere(bruch(1, 1), bruch(1, 6)), { z: 5, n: 6 });
  assert.deepEqual(multipliziere(bruch(1, 2), bruch(1, 3)), { z: 1, n: 6 });
  assert.deepEqual(potenz(bruch(5, 6), 2), { z: 25, n: 36 });
  assert.equal(vergleiche(bruch(1, 3), bruch(1, 2)), -1);
  assert.equal(vergleiche(bruch(2, 4), bruch(1, 2)), 0);
  assert.equal(istGleich(bruch(2, 4), bruch(1, 2)), true);
  assert.equal(zuDezimal(bruch(1, 4)), 0.25);
});

test("parseBruch versteht Bruch, Dezimalzahl und Prozent", () => {
  assert.deepEqual(parseBruch("1/6"), { z: 1, n: 6 });
  assert.deepEqual(parseBruch(" 2/6 "), { z: 1, n: 3 });
  assert.deepEqual(parseBruch("0,25"), { z: 1, n: 4 });
  assert.deepEqual(parseBruch("0.5"), { z: 1, n: 2 });
  assert.deepEqual(parseBruch("50 %"), { z: 1, n: 2 });
  assert.deepEqual(parseBruch("12,5%"), { z: 1, n: 8 });
  assert.equal(parseBruch("abc"), null);
  assert.equal(parseBruch(""), null);
});

test("Formatierung", () => {
  assert.equal(formatBruch(bruch(2, 6)), "1/3");
  assert.equal(formatBruch(bruch(3, 1)), "3");
  assert.equal(formatDezimal(bruch(1, 6)), "0,167");
  assert.equal(formatDezimal(bruch(1, 4)), "0,25");
  assert.equal(formatProzent(bruch(1, 6)), "16,7 %");
  assert.equal(formatProzent(bruch(1, 2)), "50 %");
});

test("TD-18: endStellen zählt die Stellen abbrechender Dezimalbrüche, null bei periodischen", () => {
  assert.equal(endStellen(bruch(1, 4)), 2);
  assert.equal(endStellen(bruch(3, 1)), 0);
  assert.equal(endStellen(bruch(1, 64)), 6);
  assert.equal(endStellen(bruch(1, 3)), null);
});

test("TD-18: formatAlle schreibt \"=\" nur, wenn Dezimal- und Prozentangabe exakt sind", () => {
  assert.equal(formatAlle(bruch(1, 4)), "1/4 = 0,25 = 25 %");
  assert.equal(formatAlle(bruch(1, 8)), "1/8 = 0,125 = 12,5 %");
  assert.equal(formatAlle(bruch(1, 1)), "1 = 1 = 100 %");
  assert.equal(formatAlle(bruch(1, 3)), "1/3 ≈ 0,333 ≈ 33,3 %");
  assert.equal(formatAlle(bruch(1, 6)), "1/6 ≈ 0,167 ≈ 16,7 %");
  // 1/16 = 0,0625: drei Dezimalstellen und eine Prozentstelle reichen nicht.
  assert.equal(formatAlle(bruch(1, 16)), "1/16 ≈ 0,063 ≈ 6,3 %");
});

test("auswerten rechnet Produkte, Summen, Potenzen und Klammern ohne eval", () => {
  assert.deepEqual(auswerten("1/2*1/3"), { z: 1, n: 6 });
  assert.deepEqual(auswerten("1/6+1/6"), { z: 1, n: 3 });
  assert.deepEqual(auswerten("1/2 · 1/3"), { z: 1, n: 6 });
  assert.deepEqual(auswerten("(5/6)^2"), { z: 25, n: 36 });
  assert.deepEqual(auswerten("1 - 5/6"), { z: 1, n: 6 });
  assert.deepEqual(auswerten("2 * 3/5 * 2/4"), { z: 3, n: 5 });
  assert.deepEqual(auswerten("0,5*0,5"), { z: 1, n: 4 });
  assert.deepEqual(auswerten("50% * 50%"), { z: 1, n: 4 });
  assert.equal(auswerten("1/2 +"), null);
  assert.equal(auswerten("alert(1)"), null);
  assert.equal(auswerten("1/0"), null);
});

test("leseTerm: Wurzel (sqrt, √) und pi liefern Kommazahlen, exakte Wurzeln bleiben Brüche", () => {
  const nahe = (a, b) => Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(b));
  const r = leseTerm("sqrt((2+3)*8)");
  assert.equal(r.exakt, false);
  assert.ok(nahe(r.zahl, Math.sqrt(40)));
  assert.equal(r.wert, null);
  assert.deepEqual(leseTerm("√(9)").wert, { z: 3, n: 1 });
  assert.deepEqual(leseTerm("√9").wert, { z: 3, n: 1 });
  assert.deepEqual(leseTerm("sqrt(9/4)").wert, { z: 3, n: 2 });
  assert.ok(nahe(leseTerm("2*pi").zahl, 2 * Math.PI));
  assert.ok(nahe(leseTerm("2·π").zahl, 2 * Math.PI));
  assert.ok(nahe(leseTerm("√2*√2").zahl, 2));
  assert.ok(nahe(leseTerm("√(2+3)").zahl, Math.sqrt(5)));
  assert.ok(nahe(leseTerm("√2^2").zahl, 2));
  assert.ok(nahe(leseTerm("SQRT(2)").zahl, Math.SQRT2));
  assert.ok(nahe(leseTerm("wurzel(2)").zahl, Math.SQRT2));
  assert.equal(leseTerm("1/3").exakt, true);
  assert.ok(nahe(leseTerm("1/3").zahl, 1 / 3));
});

test("leseTerm: ungültige Terme mit Grund", () => {
  assert.equal(leseTerm("sqrt(-1)").fehler, "wurzel-negativ");
  assert.equal(leseTerm("√-4").fehler, "wurzel-negativ");
  assert.equal(leseTerm("sqrt 2").fehler, "ungueltig");
  assert.equal(leseTerm("pi(").fehler, "ungueltig");
  assert.equal(leseTerm("1/0").fehler, "ungueltig");
  assert.equal(leseTerm("2^1000").fehler, "ungueltig");
  assert.equal(leseTerm("").fehler, "ungueltig");
  assert.equal(auswertenMitInfo("sqrt(-1)"), null);
  // Kommazahl-Ergebnisse sind kein Bruch: auswerten liefert dann null.
  assert.equal(auswerten("√2"), null);
});
