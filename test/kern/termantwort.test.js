// Use Case UC-T: Terme mit Variablen eingeben und prüfen (z. B. binomische Formeln, Klasse 8).
// BR-T7 Gleichwertig heißt: gleicher Wert an mindestens 5 festen Prüfstellen (keine 0, keine 1), relative Toleranz.
// BR-T8 Formprüfung per Option form: "ausmultipliziert" | "faktorisiert". Gleichwertig in falscher Form ist ein
//       neutraler Hinweis (nicht-ausmultipliziert, nicht-zusammengefasst, nicht-faktorisiert), kein Fehler.
// BR-T9 passtZuTerm erkennt typische Fehlterme, z. B. (a+b)² → a² + b².
// BR-T6 Vorschau: gesetzter Term oder kurze Meldung.
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  pruefstellen, sindGleichwertig, formFehler, pruefeTermAntwort, passtZuTerm, termVorschau, TERM_HINWEIS_FEHLER,
  MELDUNG_KEIN_VARIABLENTERM,
} from "../../src/kern/js/termantwort.js";
import { ergebnisFuer, istHinweis, wirdGezaehlt, ergebnisAusFeldern } from "../../src/kern/js/pruefung.js";

test("BR-T7: mindestens 5 feste Prüfstellen ohne 0 und 1, Variablen verschieden", () => {
  const stellen = pruefstellen(["a", "b", "x"]);
  assert.ok(stellen.length >= 5);
  assert.deepEqual(pruefstellen(["a", "b", "x"]), stellen, "deterministisch");
  for (const s of stellen) {
    for (const v of Object.values(s)) assert.ok(v !== 0 && v !== 1 && v !== -1, String(v));
    assert.notEqual(s.a, s.b);
  }
});

test("BR-T7: Gleichwertigkeit", () => {
  assert.equal(sindGleichwertig("(x+3)^2", "x^2+6x+9"), true);
  assert.equal(sindGleichwertig("(a+b)(a-b)", "a²-b²"), true);
  assert.equal(sindGleichwertig("(a-b)^2", "a^2-2ab+b^2"), true);
  assert.equal(sindGleichwertig("1/2x", "x/2"), true);
  assert.equal(sindGleichwertig("0,5x", "x/2"), true);
  assert.equal(sindGleichwertig("(x+3)^2", "x^2+9"), false);
  assert.equal(sindGleichwertig("(a+b)^2", "4ab"), false, "a = b darf an keiner Stelle alles entscheiden");
  assert.equal(sindGleichwertig("x", "y"), false);
  assert.equal(sindGleichwertig("x^2", "x"), false, "0 und 1 sind keine Prüfstellen");
  assert.equal(sindGleichwertig("x^2+1", "x^2+1,0001"), false);
  assert.equal(sindGleichwertig("(x+1000)^2", "x^2+2000x+1000000"), true);
});

test("BR-T8: Form ausmultipliziert", () => {
  assert.equal(formFehler("x^2+6x+9", "ausmultipliziert"), undefined);
  assert.equal(formFehler("-x^2 + 1/2x - 3", "ausmultipliziert"), undefined);
  assert.equal(formFehler("a²-2ab+b²", "ausmultipliziert"), undefined);
  assert.equal(formFehler("(x+3)^2", "ausmultipliziert"), "nicht-ausmultipliziert");
  assert.equal(formFehler("x(x+6)+9", "ausmultipliziert"), "nicht-ausmultipliziert");
  assert.equal(formFehler("x^2+3x+3x+9", "ausmultipliziert"), "nicht-zusammengefasst");
  assert.equal(formFehler("x·x+6x+9", "ausmultipliziert"), "nicht-zusammengefasst");
  assert.equal(formFehler("x^2+2·3x+9", "ausmultipliziert"), "nicht-zusammengefasst");
  assert.equal(formFehler("x^2+6x+4+5", "ausmultipliziert"), "nicht-zusammengefasst");
  assert.equal(formFehler("ab+ba", "ausmultipliziert"), "nicht-zusammengefasst");
});

test("BR-T8: Form faktorisiert", () => {
  assert.equal(formFehler("(x+3)^2", "faktorisiert"), undefined);
  assert.equal(formFehler("(a+b)(a-b)", "faktorisiert"), undefined);
  assert.equal(formFehler("2(x+1)", "faktorisiert"), undefined);
  assert.equal(formFehler("x(x+1)", "faktorisiert"), undefined);
  assert.equal(formFehler("-(x-1)^2", "faktorisiert"), undefined);
  assert.equal(formFehler("x^2+6x+9", "faktorisiert"), "nicht-faktorisiert");
  assert.equal(formFehler("(x^2+6x+9)", "faktorisiert"), "nicht-faktorisiert");
  assert.equal(formFehler("x(x+6)+9", "faktorisiert"), "nicht-faktorisiert");
  assert.throws(() => formFehler("x", "gekuerzt"), /Form/);
});

test("BR-T8: pruefeTermAntwort – richtig, falsch, Hinweis, unlesbar", () => {
  const form = { form: "ausmultipliziert" };
  assert.deepEqual(pruefeTermAntwort("x^2+6x+9", "(x+3)^2", form), { korrekt: true, fehler: undefined, wert: "x² + 6x + 9" });
  assert.deepEqual(pruefeTermAntwort("x^2+9", "(x+3)^2", form), { korrekt: false, fehler: "falsch", wert: "x² + 9" });
  const h = pruefeTermAntwort("(x+3)(x+3)", "(x+3)^2", form);
  assert.equal(h.korrekt, false);
  assert.equal(h.fehler, "nicht-ausmultipliziert");
  assert.match(h.meldung, /ausmultiplizieren/);
  assert.equal(pruefeTermAntwort("(x+3)(x+3)", "(x+3)^2").korrekt, true, "ohne form zählt nur die Gleichwertigkeit");
  const leer = pruefeTermAntwort("  ", "(x+3)^2");
  assert.equal(leer.fehler, "kein-term");
  assert.ok(Number.isNaN(leer.wert));
  const kaputt = pruefeTermAntwort("(x+3", "(x+3)^2");
  assert.equal(kaputt.fehler, "kein-term");
  assert.match(kaputt.meldung, /Klammer/);
  assert.throws(() => pruefeTermAntwort("x", "(x+"), /Erwarteter Term/);
});

test("BR-T8: Hinweise sind im Ergebnisformat von pruefung.js neutral und zählen nicht", () => {
  assert.deepEqual([...TERM_HINWEIS_FEHLER].sort(), ["nicht-ausmultipliziert", "nicht-faktorisiert", "nicht-zusammengefasst"]);
  const meldungen = { falsch: "Nein.", "kein-term": MELDUNG_KEIN_VARIABLENTERM };
  const teil = pruefeTermAntwort("x^2+3x+3x+9", "(x+3)^2", { form: "ausmultipliziert" });
  const r = ergebnisFuer("t", teil, teil.fehler, meldungen, "");
  assert.equal(r.korrekt, false);
  assert.equal(r.fehler, "nicht-zusammengefasst");
  assert.deepEqual(r.felder.t, { korrekt: false, wert: "x² + 3x + 3x + 9", fehler: "nicht-zusammengefasst" });
  assert.equal(istHinweis(r), true);
  assert.equal(wirdGezaehlt(r), false);
  const unlesbar = pruefeTermAntwort("", "x");
  assert.equal(ergebnisFuer("t", unlesbar, unlesbar.fehler, meldungen, "").meldung, MELDUNG_KEIN_VARIABLENTERM);
  assert.equal(wirdGezaehlt({ korrekt: false, fehler: "kein-term" }), false);
  assert.equal(ergebnisAusFeldern({ t: unlesbar }).fehler, "keine-eingabe");
  assert.equal(ergebnisAusFeldern({ t: teil }).fehler, "nicht-zusammengefasst");
});

test("BR-T9: passtZuTerm erkennt typische Fehlterme", () => {
  assert.equal(passtZuTerm("a²+b²", "a^2+b^2"), true);
  assert.equal(passtZuTerm("b^2+a^2", "a^2+b^2"), true);
  assert.equal(passtZuTerm("a²+2ab+b²", "a^2+b^2"), false);
  assert.equal(passtZuTerm("x^2+9", "x^2+3^2"), true);
  assert.equal(passtZuTerm("(x+", "x^2+9"), false);
  assert.equal(passtZuTerm("", "x^2+9"), false);
});

test("BR-T6: termVorschau", () => {
  assert.equal(termVorschau(""), "");
  assert.equal(termVorschau("x^2+6*x+9"), "Gelesen: x² + 6x + 9");
  assert.equal(termVorschau("p*i"), "Gelesen: p·i");
  assert.match(termVorschau("(x+3"), /Klammer/);
});
