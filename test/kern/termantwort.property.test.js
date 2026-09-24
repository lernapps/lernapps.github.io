// Property-Based Tests (fast-check) für Terme mit Variablen: Gleichwertigkeit, Fehlterme, Form.
// Use Case: Terme eingeben (BR-T7 Gleichwertigkeit, BR-T8 Form aus termantwort.test.js). Qualität: QZ-3 (QS-19). Risiko: R-012.
import { test } from "node:test";
import assert from "node:assert/strict";
import fc from "fast-check";
import { OPTIONEN } from "./property-einstellungen.js";
import { leseVariablenterm, auswerten } from "../../src/kern/js/variablenterm.js";
import { pruefeTermAntwort, sindGleichwertig, formFehler } from "../../src/kern/js/termantwort.js";

// Variablen ohne "p": "p" vor "i" läse der Tokenizer als π (dokumentiert in variablenterm.js).
const variable = fc.constantFrom(..."abcdefghjkmnrstuvwxyz");
const koeffizient = fc.integer({ min: -12, max: 12 }).filter((k) => k !== 0);
const reell = fc.double({ min: -1000, max: 1000, noNaN: true, noDefaultInfinity: true });

// Glied mit Vorzeichen, wie Lernende es tippen: "+ 4x^2", "- x", "+ 9".
function glied(k, variablen = "", erstes = false) {
  const betrag = Math.abs(k) === 1 && variablen ? "" : String(Math.abs(k));
  const vorzeichen = k < 0 ? (erstes ? "-" : " - ") : erstes ? "" : " + ";
  return `${vorzeichen}${betrag}${variablen}`;
}
const summe = (...glieder) => glieder.map(([k, v], i) => glied(k, v, i === 0)).join("");
const linear = (k, x, q) => `(${summe([k, x], [q, ""])})`;

// Paare (faktorisiert, ausmultipliziert) für (kx+q)², (kx−q)², (kx+q)(kx−q), (kx+q)(mx+r).
const binom = fc.record({ k: koeffizient, q: koeffizient, m: koeffizient, r: koeffizient, x: variable, fall: fc.integer({ min: 0, max: 3 }) })
  .map(({ k, q, m, r, x, fall }) => {
    if (fall === 0) return { faktorisiert: `${linear(k, x, q)}^2`, koeffizienten: [k * k, 2 * k * q, q * q], x };
    if (fall === 1) return { faktorisiert: `${linear(k, x, -q)}²`, koeffizienten: [k * k, -2 * k * q, q * q], x };
    if (fall === 2) return { faktorisiert: `${linear(k, x, q)}${linear(k, x, -q)}`, koeffizienten: [k * k, 0, -q * q], x };
    return { faktorisiert: `${linear(k, x, q)}*${linear(m, x, r)}`, koeffizienten: [k * m, k * r + q * m, q * r], x };
  })
  .map((b) => ({ ...b, ausmultipliziert: ausmultipliziert(b.koeffizienten, b.x) }));

function ausmultipliziert([a, b, c], x) {
  const glieder = [[a, `${x}^2`], [b, x], [c, ""]].filter(([k]) => k !== 0);
  return summe(...glieder);
}

test("R-012/QZ-3: BR-T7 – (a+b)², (a−b)², (a+b)(a−b) sind an jeder Stelle gleich ihrer ausmultiplizierten Form", () => {
  const paare = [
    ["(a+b)^2", "a^2 + 2ab + b^2"],
    ["(a-b)^2", "a^2 - 2ab + b^2"],
    ["(a+b)(a-b)", "a^2 - b^2"],
  ].map(([f, a]) => [leseVariablenterm(f).baum, leseVariablenterm(a).baum]);
  fc.assert(fc.property(reell, reell, (a, b) => {
    const toleranz = 1e-9 * Math.max(1, a * a + b * b);
    for (const [f, aus] of paare) {
      const [x, y] = [auswerten(f, { a, b }), auswerten(aus, { a, b })];
      assert.ok(Math.abs(x - y) <= toleranz, `a=${a}, b=${b}: ${x} ≠ ${y}`);
    }
  }), OPTIONEN);
});

test("R-012/QZ-3: BR-T7 – ausmultiplizierte und faktorisierte Binome werden als gleichwertig akzeptiert", () => {
  fc.assert(fc.property(binom, ({ faktorisiert, ausmultipliziert: aus }) => {
    assert.ok(sindGleichwertig(faktorisiert, aus), `${faktorisiert} ≟ ${aus}`);
    assert.equal(pruefeTermAntwort(aus, faktorisiert).korrekt, true, `${aus} für ${faktorisiert}`);
    assert.equal(pruefeTermAntwort(faktorisiert, aus).korrekt, true, `${faktorisiert} für ${aus}`);
  }), OPTIONEN);
});

test("R-012/QZ-3: BR-T7 – ein um eins verschobener Koeffizient wird abgelehnt", () => {
  fc.assert(fc.property(binom, fc.integer({ min: 0, max: 2 }), fc.constantFrom(-1, 1), (b, stelle, delta) => {
    const falsch = b.koeffizienten.map((k, i) => (i === stelle ? k + delta : k));
    fc.pre(falsch.some((k) => k !== 0));
    const text = ausmultipliziert(falsch, b.x);
    assert.equal(pruefeTermAntwort(text, b.faktorisiert).fehler, "falsch", `${text} für ${b.faktorisiert}`);
  }), OPTIONEN);
});

test("R-012/QZ-3: BR-T7 – die Reihenfolge der Glieder ändert nichts (Kommutativgesetz)", () => {
  fc.assert(fc.property(binom, (b) => {
    const glieder = [[b.koeffizienten[2], ""], [b.koeffizienten[1], b.x], [b.koeffizienten[0], `${b.x}^2`]].filter(([k]) => k !== 0);
    const text = summe(...glieder);
    assert.equal(pruefeTermAntwort(text, b.faktorisiert, { form: "ausmultipliziert" }).korrekt, true, `${text} für ${b.faktorisiert}`);
  }), OPTIONEN);
});

test("R-012/QZ-3: BR-T8 – Formprüfung erkennt ausmultipliziert und faktorisiert", () => {
  fc.assert(fc.property(binom, ({ faktorisiert, ausmultipliziert: aus }) => {
    assert.equal(formFehler(aus, "ausmultipliziert"), undefined, aus);
    assert.equal(formFehler(faktorisiert, "faktorisiert"), undefined, faktorisiert);
    assert.equal(formFehler(faktorisiert, "ausmultipliziert"), "nicht-ausmultipliziert", faktorisiert);
    if (aus.includes("+") || aus.slice(1).includes("-")) assert.equal(formFehler(aus, "faktorisiert"), "nicht-faktorisiert", aus);
    const r = pruefeTermAntwort(faktorisiert, aus, { form: "ausmultipliziert" });
    assert.deepEqual([r.korrekt, r.fehler], [false, "nicht-ausmultipliziert"], faktorisiert);
  }), OPTIONEN);
});
