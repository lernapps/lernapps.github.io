// Property-Based Tests (fast-check) für Zahlen: Round-Trip, monotone Rundung, Stellenregel, "=" nur bei exakten Werten.
// Use Case: Zahlen eingeben (BR-2, BR-5 aus zahlantwort.test.js). Qualität: QZ-3 (QS-6, QS-7). Risiko: R-004.
import { test } from "node:test";
import assert from "node:assert/strict";
import fc from "fast-check";
import { OPTIONEN } from "./property-einstellungen.js";
import { runde, formatZahl, parseZahl } from "../../src/kern/js/zahlen.js";
import { bruch, formatAlle, istGleich as bruchGleich } from "../../src/kern/js/bruch.js";
import { leseAntwort, pruefeZahlAntwort, vorschau, STANDARD_STELLEN } from "../../src/kern/js/zahlantwort.js";

const ARTEN = Object.keys(STANDARD_STELLEN);
const art = fc.constantFrom(...ARTEN);
const stellen = fc.integer({ min: 0, max: 6 });
const betrag = fc.double({ min: -1e6, max: 1e6, noNaN: true, noDefaultInfinity: true });
const nenner = fc.integer({ min: 1, max: 2000 });
const zaehler = fc.integer({ min: -100000, max: 100000 });

// Unabhängiges Orakel: z/n hat höchstens d Nachkommastellen, wenn n die Zahl z·10^d teilt.
const endetNach = (z, n, d) => (z * 10 ** d) % n === 0;

test("QZ-3/R-004: Round-Trip – eine deutsch formatierte Dezimalzahl liest sich als derselbe Wert", () => {
  fc.assert(fc.property(fc.integer({ min: -1e9, max: 1e9 }), stellen, (k, d) => {
    const text = formatZahl(k / 10 ** d, d);
    assert.equal(parseZahl(text), k / 10 ** d, text);
    const a = leseAntwort(text);
    assert.equal(a.typ, "dezimal", text);
    assert.ok(bruchGleich(a.bruch, bruch(k, 10 ** d)), text);
  }), OPTIONEN);
});

test("QZ-3/R-004: Round-Trip – formatZahl(x, d) liest sich als runde(x, d)", () => {
  fc.assert(fc.property(betrag, stellen, (x, d) => {
    // === statt Object.is: -0 und 0 sind derselbe Wert (runde(-1e-300, 0) ist -0, angezeigt wird "0").
    assert.ok(parseZahl(formatZahl(x, d)) === runde(x, d), `${x} auf ${d} Stellen: ${formatZahl(x, d)}`);
  }), OPTIONEN);
});

test("QZ-3/R-004: Rundung ist monoton – x ≤ y ⇒ runde(x) ≤ runde(y) für geld 2, prozent 1, zahl 2", () => {
  fc.assert(fc.property(betrag, betrag, art, (a, b, feldArt) => {
    const [x, y] = a <= b ? [a, b] : [b, a];
    const d = STANDARD_STELLEN[feldArt];
    assert.ok(runde(x, d) <= runde(y, d), `runde(${x}) = ${runde(x, d)} > runde(${y}) = ${runde(y, d)}`);
  }), OPTIONEN);
});

test("QZ-3/R-004: BR-2 – mehr Stellen als gefordert, richtig gerundet, sind immer richtig", () => {
  fc.assert(fc.property(zaehler, nenner, art, fc.integer({ min: 0, max: 4 }), (z, n, feldArt, mehr) => {
    const d = STANDARD_STELLEN[feldArt] + mehr;
    const text = formatZahl(z / n, d);
    const r = pruefeZahlAntwort(text, bruch(z, n), { art: feldArt });
    assert.equal(r.korrekt, true, `${z}/${n} als ${text} (${feldArt})`);
  }), OPTIONEN);
});

test("QZ-3/R-004: BR-2 – abgeschnitten statt gerundet ist falsch, wenn es sich unterscheidet", () => {
  fc.assert(fc.property(zaehler, nenner, art, fc.integer({ min: 0, max: 3 }), (z, n, feldArt, mehr) => {
    const d = STANDARD_STELLEN[feldArt] + mehr;
    const abgeschnitten = Math.trunc((z / n) * 10 ** d) / 10 ** d;
    fc.pre(Math.abs(abgeschnitten - runde(z / n, d)) > 1e-9);
    const text = abgeschnitten.toFixed(d).replace(".", ",");
    const r = pruefeZahlAntwort(text, bruch(z, n), { art: feldArt });
    assert.equal(r.fehler, "falsch", `${z}/${n} als ${text} (${feldArt})`);
  }), OPTIONEN);
});

test("QZ-3/R-004: BR-2 – zu wenige Stellen sind höchstens ein Hinweis, nie „richtig“ bei periodischem Wert", () => {
  fc.assert(fc.property(zaehler, nenner, art, (z, n, feldArt) => {
    const gefordert = STANDARD_STELLEN[feldArt];
    fc.pre(gefordert > 0 && !endetNach(z, n, gefordert));
    const text = formatZahl(z / n, gefordert - 1);
    const r = pruefeZahlAntwort(text, bruch(z, n), { art: feldArt });
    assert.equal(r.korrekt, false, `${z}/${n} als ${text} (${feldArt})`);
  }), OPTIONEN);
});

test("QZ-3/R-004: BR-5 – die Vorschau zeigt „=“ genau dann, wenn der Bruch höchstens 6 Nachkommastellen hat", () => {
  fc.assert(fc.property(zaehler, nenner, (z, n) => {
    const anzeige = vorschau(`${z}/${n}`);
    assert.equal(anzeige.startsWith("= "), endetNach(z, n, 6), `${z}/${n} → ${anzeige}`);
    if (anzeige.startsWith("= ")) assert.ok(bruchGleich(leseAntwort(anzeige.slice(2)).bruch, bruch(z, n)), anzeige);
  }), OPTIONEN);
});

test("QZ-3/R-004: formatAlle – „=“ genau dann, wenn Dezimal- bzw. Prozentanzeige exakt ist", () => {
  fc.assert(fc.property(zaehler, nenner, (z, n) => {
    const [, dezimal, prozent] = formatAlle(bruch(z, n)).match(/^\S+ ([=≈]) \S+ ([=≈]) /);
    assert.equal(dezimal === "=", endetNach(z, n, 3), `${z}/${n}`);
    assert.equal(prozent === "=", endetNach(z, n, 3), `${z}/${n}`);
  }), OPTIONEN);
});

// Fand einen echten Fehler: vorschau("sqrt(38)") zeigte "= 6,164414" (Toleranz der Antwortprüfung statt
// Gleitkomma-Rauschen). Behoben in https://github.com/lernapps/lernapps.github.io/issues/30
test("QZ-3/R-004: BR-5 – die Vorschau einer Wurzel aus einer Nicht-Quadratzahl zeigt „≈“", () => {
  fc.assert(fc.property(fc.integer({ min: 2, max: 100000 }), (k) => {
    fc.pre(!Number.isInteger(Math.sqrt(k)));
    assert.match(vorschau(`sqrt(${k})`), /^≈ /, `sqrt(${k})`);
  }), OPTIONEN);
});

test("QZ-3/R-004: BR-5 – ein Term mit exaktem Wert trotz Rundungsrauschen zeigt „=“", () => {
  fc.assert(fc.property(fc.integer({ min: 2, max: 100000 }), (k) => {
    assert.equal(vorschau(`sqrt(${k})*sqrt(${k})`), `= ${k}`);
  }), OPTIONEN);
});
