// Use Case: Zahlen eingeben – eine Rundungsregel für alle Zahlenfelder.
// BR-1 Jede Aufgabe nennt die geforderten Nachkommastellen (stellen, Standard nach art: geld 2, prozent 1, zahl 2).
// BR-2 Die Toleranz folgt den getippten Stellen d: richtig, wenn d ≥ stellen und Eingabe = exakter Wert kaufmännisch auf d Stellen.
// BR-3 Zu grob gerundet (d < stellen, aber sonst richtig) ist ein Hinweis, kein Fehler.
// BR-4 Brüche und Terme (auch sqrt, √, pi) gelten überall und zählen als exakt; Geldfelder vergleichen sie auf den Cent.
//      Gemischte Zahlen nicht. Felder mit nurZahl verlangen das ausgerechnete Ergebnis.
// BR-5 Vorschau: bei Termen und Brüchen zeigt das Feld beim Tippen den Wert ("= 30", "≈ 3,33").
import { test } from "node:test";
import assert from "node:assert/strict";
import { bruch } from "../../src/kern/js/bruch.js";
import {
  leseAntwort, pruefeZahlAntwort, rundungsHinweis, passtZu, zahlenfeld, vorschau, STANDARD_STELLEN, HINWEIS_FEHLER,
} from "../../src/kern/js/zahlantwort.js";

const zehnDrittel = bruch(10, 3);
const zweiDrittel = bruch(2, 3);

test("BR-1: Standardstellen je Art", () => {
  assert.deepEqual(STANDARD_STELLEN, { geld: 2, prozent: 1, zahl: 2 });
});

test("leseAntwort: Dezimalzahlen mit Komma oder Punkt, Stellen zählen auch Endnullen", () => {
  assert.deepEqual(leseAntwort("3,30"), { typ: "dezimal", wert: 3.3, dezimalstellen: 2, bruch: bruch(33, 10) });
  assert.equal(leseAntwort("12.5").wert, 12.5);
  assert.equal(leseAntwort("12.5").dezimalstellen, 1);
  assert.equal(leseAntwort("7").dezimalstellen, 0);
  assert.equal(leseAntwort("-3,5").wert, -3.5);
  assert.equal(leseAntwort("1.250,5").wert, 1250.5);
  assert.equal(leseAntwort("1.250,5").dezimalstellen, 1);
});

test("leseAntwort: Einheit und Prozentzeichen am Ende", () => {
  assert.equal(leseAntwort("30 €", { art: "geld" }).wert, 30);
  assert.equal(leseAntwort("2,5 cm").wert, 2.5);
  const p = leseAntwort("12,5 %", { art: "prozent" });
  assert.equal(p.wert, 12.5);
  assert.equal(p.dezimalstellen, 1);
  // In anderen Feldern heißt % "Hundertstel": 16,7 % = 0,167 (3 Stellen).
  const z = leseAntwort("16,7 %");
  assert.equal(z.typ, "dezimal");
  assert.equal(z.wert, 0.167);
  assert.equal(z.dezimalstellen, 3);
});

test("leseAntwort: Brüche und Terme exakt, gemischte Zahlen erkannt, Unsinn ungültig", () => {
  assert.deepEqual(leseAntwort("10/3").wert, zehnDrittel);
  assert.equal(leseAntwort("10/3").typ, "bruch");
  assert.deepEqual(leseAntwort("2*50/3").wert, bruch(100, 3));
  assert.deepEqual(leseAntwort("(1/2)^2").wert, bruch(1, 4));
  assert.deepEqual(leseAntwort("1-1/6").wert, bruch(5, 6));
  assert.deepEqual(leseAntwort("0,5*3").wert, bruch(3, 2));
  assert.deepEqual(leseAntwort("100/3 %", { art: "prozent" }).wert, bruch(100, 3));
  assert.deepEqual(leseAntwort("100/3 %").wert, bruch(1, 3));
  assert.equal(leseAntwort("3 1/3").typ, "gemischt");
  assert.equal(leseAntwort("").typ, "leer");
  assert.equal(leseAntwort("   ").typ, "leer");
  assert.equal(leseAntwort("abc").typ, "ungueltig");
  assert.equal(leseAntwort("1/0").typ, "ungueltig");
});

test("BR-2: 10/3 – richtig gerundet mit mindestens so vielen Stellen wie gefordert", () => {
  for (const e of ["3,33", "3,333", "3,3333", "3.33"]) {
    assert.equal(pruefeZahlAntwort(e, zehnDrittel, { stellen: 2 }).korrekt, true, e);
  }
  assert.equal(pruefeZahlAntwort("3,3", zehnDrittel, { stellen: 1 }).korrekt, true);
  assert.equal(pruefeZahlAntwort("3,34", zehnDrittel, { stellen: 2 }).fehler, "falsch");
  assert.equal(pruefeZahlAntwort("3,334", zehnDrittel, { stellen: 2 }).fehler, "falsch");
});

test("BR-2: 2/3 – abschneiden ist falsch, runden richtig", () => {
  assert.equal(pruefeZahlAntwort("0,67", zweiDrittel, { stellen: 2 }).korrekt, true);
  assert.equal(pruefeZahlAntwort("0,667", zweiDrittel, { stellen: 2 }).korrekt, true);
  assert.equal(pruefeZahlAntwort("0,66", zweiDrittel, { stellen: 2 }).fehler, "falsch");
  assert.equal(pruefeZahlAntwort("0,6", zweiDrittel, { stellen: 2 }).fehler, "falsch");
});

test("BR-2: erwarteter Wert als Zahl (float) statt Bruch", () => {
  assert.equal(pruefeZahlAntwort("33,3", 100 / 3, { art: "prozent" }).korrekt, true);
  assert.equal(pruefeZahlAntwort("33,33", 100 / 3, { art: "prozent" }).korrekt, true);
  assert.equal(pruefeZahlAntwort("33,4", 100 / 3, { art: "prozent" }).fehler, "falsch");
  assert.equal(pruefeZahlAntwort("2,35", 2.345, { stellen: 2 }).korrekt, true);
});

test("BR-2: exakte Werte gelten immer, auch ohne Endnullen", () => {
  assert.equal(pruefeZahlAntwort("30", 30, { art: "geld" }).korrekt, true);
  assert.equal(pruefeZahlAntwort("30 €", 30, { art: "geld" }).korrekt, true);
  assert.equal(pruefeZahlAntwort("30,00", 30, { art: "geld" }).korrekt, true);
  assert.equal(pruefeZahlAntwort("12,5", 12.5, { art: "geld" }).korrekt, true);
  assert.equal(pruefeZahlAntwort("25", 25, { art: "prozent" }).korrekt, true);
  assert.equal(pruefeZahlAntwort("12,5 %", 12.5, { art: "prozent" }).korrekt, true);
  assert.equal(pruefeZahlAntwort("12.5", 12.5, { art: "prozent" }).korrekt, true);
  assert.equal(pruefeZahlAntwort("1.250,5", 1250.5, { art: "geld" }).korrekt, true);
  assert.equal(pruefeZahlAntwort("13", 12.5, { art: "geld" }).korrekt, false);
});

test("BR-3: zu grob gerundet ist ein Hinweis mit der geforderten Stellenzahl", () => {
  const r = pruefeZahlAntwort("3,3", zehnDrittel, { stellen: 2 });
  assert.equal(r.korrekt, false);
  assert.equal(r.fehler, "zu-grob-gerundet");
  assert.equal(r.meldung, "Fast – runde auf zwei Nachkommastellen.");
  assert.equal(pruefeZahlAntwort("3", zehnDrittel, { stellen: 2 }).fehler, "zu-grob-gerundet");
  const p = pruefeZahlAntwort("33", 100 / 3, { art: "prozent" });
  assert.equal(p.fehler, "zu-grob-gerundet");
  assert.equal(p.meldung, "Fast – runde auf eine Nachkommastelle.");
  // Falsch gerundet und zu grob: einfach falsch.
  assert.equal(pruefeZahlAntwort("0,6", zweiDrittel, { stellen: 2 }).fehler, "falsch");
});

test("BR-4: Brüche und Terme werden exakt verglichen", () => {
  for (const e of ["10/3", "20/6", "2*5/3", "3+1/3", "(10/3)^1"]) {
    assert.equal(pruefeZahlAntwort(e, zehnDrittel).korrekt, true, e);
  }
  assert.equal(pruefeZahlAntwort("1/3", bruch(1, 3)).korrekt, true);
  assert.equal(pruefeZahlAntwort("(1/2)^2", bruch(1, 4)).korrekt, true);
  assert.equal(pruefeZahlAntwort("1-1/6", bruch(5, 6)).korrekt, true);
  assert.equal(pruefeZahlAntwort("0,5*3", 1.5).korrekt, true);
  assert.equal(pruefeZahlAntwort("100/3 %", 100 / 3, { art: "prozent" }).korrekt, true);
  assert.equal(pruefeZahlAntwort("100/3", 100 / 3, { art: "prozent" }).korrekt, true);
  assert.equal(pruefeZahlAntwort("2*50/3", 100 / 3, { art: "prozent" }).korrekt, true);
  assert.equal(pruefeZahlAntwort("1/3 %", 1 / 3, { art: "zahl" }).korrekt, false);
  assert.equal(pruefeZahlAntwort("11/3", zehnDrittel).fehler, "falsch");
  const b = pruefeZahlAntwort("10/3", zehnDrittel);
  assert.deepEqual(b.bruch, zehnDrittel);
  assert.ok(Math.abs(b.wert - 10 / 3) < 1e-12);
});

test("BR-4: Wurzel und pi – Kommazahl-Ergebnis, Vergleich mit relativer Toleranz", () => {
  const t = leseAntwort("sqrt((2+3)*8)");
  assert.equal(t.typ, "term");
  assert.ok(Math.abs(t.wert - Math.sqrt(40)) < 1e-12);
  assert.equal(pruefeZahlAntwort("sqrt((2+3)*8)", Math.sqrt(40)).korrekt, true);
  assert.equal(pruefeZahlAntwort("√40", Math.sqrt(40)).korrekt, true);
  assert.equal(pruefeZahlAntwort("6,32", Math.sqrt(40)).korrekt, true);
  assert.equal(pruefeZahlAntwort("√2*√2", bruch(2, 1)).korrekt, true);
  assert.equal(pruefeZahlAntwort("√(9)", bruch(3, 1)).korrekt, true);
  assert.equal(pruefeZahlAntwort("2*pi", 2 * Math.PI).korrekt, true);
  assert.equal(pruefeZahlAntwort("2*π*1000", 2000 * Math.PI).korrekt, true);
  assert.equal(pruefeZahlAntwort("√3", Math.sqrt(2)).fehler, "falsch");
  const neg = pruefeZahlAntwort("sqrt(-1)", 1);
  assert.equal(neg.fehler, "keine-zahl");
  assert.match(neg.meldung, /negativ/);
  assert.equal(leseAntwort("sqrt(-1)").typ, "ungueltig");
});

test("BR-4: ein getippter Term zählt als exakt – keine Stellenregel für Terme", () => {
  assert.equal(pruefeZahlAntwort("1/3", 0.33).fehler, "falsch");
  assert.equal(pruefeZahlAntwort("0,33*1", bruch(1, 3)).fehler, "falsch");
});

test("BR-4: Geldfelder nehmen Terme und Brüche, verglichen auf den Cent", () => {
  assert.equal(pruefeZahlAntwort("80*0,75", 60, { art: "geld" }).korrekt, true);
  assert.equal(pruefeZahlAntwort("25/2", 12.5, { art: "geld" }).korrekt, true);
  assert.equal(pruefeZahlAntwort("100/3", 33.33, { art: "geld" }).korrekt, true);
  assert.equal(pruefeZahlAntwort("100/3", bruch(100, 3), { art: "geld" }).korrekt, true);
  assert.equal(pruefeZahlAntwort("10/3", 3.34, { art: "geld" }).fehler, "falsch");
  assert.equal(pruefeZahlAntwort("1/3", 0.33).korrekt, false);
});

test("BR-4: gemischte Zahlen sind ein Hinweis", () => {
  const g = pruefeZahlAntwort("3 1/3", zehnDrittel);
  assert.equal(g.korrekt, false);
  assert.equal(g.fehler, "gemischte-zahl");
  assert.equal(g.meldung, "Schreib gemischte Zahlen als Bruch, z. B. 10/3.");
  assert.equal(pruefeZahlAntwort("3 1/3", zehnDrittel, { art: "geld" }).fehler, "gemischte-zahl");
});

test("BR-4: nurZahl verlangt das ausgerechnete Ergebnis", () => {
  const feld = { art: "zahl", stellen: 2, nurZahl: true };
  for (const e of ["10/3", "2*5/3", "3 1/3", "√9"]) {
    const r = pruefeZahlAntwort(e, zehnDrittel, feld);
    assert.equal(r.korrekt, false, e);
    assert.equal(r.fehler, "ausdruck-statt-zahl", e);
    assert.equal(r.meldung, "Rechne das Ergebnis aus.", e);
  }
  assert.equal(pruefeZahlAntwort("3,33", zehnDrittel, feld).korrekt, true);
  assert.equal(pruefeZahlAntwort("3,3", zehnDrittel, feld).fehler, "zu-grob-gerundet");
  assert.equal(pruefeZahlAntwort("10/3", zehnDrittel, { ...feld, nurZahl: false }).korrekt, true);
});

test("Hinweis-Codes: zu grob, gemischte Zahl, Ausdruck statt Zahl", () => {
  assert.deepEqual([...HINWEIS_FEHLER].sort(), ["ausdruck-statt-zahl", "gemischte-zahl", "zu-grob-gerundet"]);
});

test("Wie der alte Bruchprüfer: 1/6 als Dezimalzahl oder Prozent", () => {
  const sechstel = bruch(1, 6);
  for (const e of ["1/6", "2/12", "1/2*1/3", "0,1667", "0,17", "16,7 %", "17%"]) {
    assert.equal(pruefeZahlAntwort(e, sechstel).korrekt, true, e);
  }
  assert.equal(pruefeZahlAntwort("0,16", sechstel).fehler, "falsch");
  assert.equal(pruefeZahlAntwort("0,2", sechstel).fehler, "zu-grob-gerundet");
  assert.equal(pruefeZahlAntwort("0,3", bruch(1, 3)).fehler, "zu-grob-gerundet");
});

test("BR-5: vorschau zeigt den Wert von Termen und Brüchen, sonst nichts", () => {
  assert.equal(vorschau("250*12/100", { einheit: "€", art: "geld" }), "= 30 €");
  assert.equal(vorschau("10/3"), "≈ 3,33");
  assert.equal(vorschau("25/2"), "= 12,5");
  assert.equal(vorschau("1/4", { einheit: "%", art: "prozent" }), "= 0,25 %");
  assert.equal(vorschau("100/4", { einheit: "%", art: "prozent" }), "= 25 %");
  assert.equal(vorschau("100/3", { einheit: "€", art: "geld" }), "≈ 33,33 €");
  assert.equal(vorschau("100/3", { stellen: 1, art: "prozent", einheit: "%" }), "≈ 33,33 %");
  assert.equal(vorschau("1/7", { stellen: 6 }), "≈ 0,1429");
  assert.equal(vorschau("sqrt(40)"), "≈ 6,32");
  assert.equal(vorschau("√9"), "= 3");
  assert.equal(vorschau("1/1024"), "≈ 0,00");
  for (const leer of ["", "12,5", "3", "abc", "1/", "sqrt(-1)", "3 1/3"]) assert.equal(vorschau(leer), "", leer);
});

test("BR-5/TD-18: vorschau zeigt \"=\" genau dann, wenn die Dezimalanzeige den Wert exakt trifft", () => {
  // Abbrechende Dezimalbrüche sind exakt, auch aus Termen mit Wurzel oder pi.
  assert.equal(vorschau("1/4"), "= 0,25");
  assert.equal(vorschau("1/8"), "= 0,125");
  assert.equal(vorschau("1/64"), "= 0,015625");
  assert.equal(vorschau("pi/pi/4"), "= 0,25");
  assert.equal(vorschau("sqrt(2)*sqrt(2)/4"), "= 0,5");
  assert.equal(vorschau("sqrt(2)^2/8", { einheit: "%", art: "prozent" }), "= 0,25 %");
  assert.equal(vorschau("sqrt(2)*sqrt(8)/5"), "= 0,8");
  // Periodische und irrationale Werte sowie Brüche mit mehr als sechs Stellen werden gerundet.
  assert.equal(vorschau("1/3"), "≈ 0,33");
  assert.equal(vorschau("2*pi"), "≈ 6,28");
  assert.equal(vorschau("1/1024"), "≈ 0,00");
});

test("BR-5/#30: eine Wurzel, die zufällig nahe an einer sechsstelligen Dezimalzahl liegt, zeigt „≈“", () => {
  // √38 = 6,16441400296…, √1000001 = 1000,000499999875… – beide irrational, nicht exakt darstellbar.
  assert.equal(vorschau("sqrt(38)"), "≈ 6,16");
  assert.equal(vorschau("sqrt(1000001)"), "≈ 1000,00");
  // Gleitkomma-Rauschen bei exakten Werten bleibt „=“.
  assert.equal(vorschau("sqrt(2)*sqrt(2)/4"), "= 0,5");
  assert.equal(vorschau("pi/pi/4"), "= 0,25");
  assert.equal(vorschau("sqrt(9)"), "= 3");
});

test("leere oder unlesbare Eingabe: keine-zahl, wert NaN", () => {
  for (const e of ["", "abc", "1/0", null, undefined]) {
    const r = pruefeZahlAntwort(e, 3);
    assert.equal(r.korrekt, false);
    assert.equal(r.fehler, "keine-zahl");
    assert.ok(Number.isNaN(r.wert));
  }
});

test("passtZu: dieselbe Stellenregel für Fehlerdiagnosen, ohne Mindeststellen", () => {
  assert.equal(passtZu("25", 24.6), true);
  assert.equal(passtZu("24,6", 24.6), true);
  assert.equal(passtZu("24", 24.6), false);
  assert.equal(passtZu("0,33", 1 / 3), true);
  assert.equal(passtZu("1/3", 1 / 3), true);
  assert.equal(passtZu("0,34", 1 / 3), false);
  assert.equal(passtZu("", 1), false);
  assert.equal(passtZu("12,5 %", 12.5, { art: "prozent" }), true);
  assert.equal(passtZu("3,3", 10 / 3, { stellen: 2 }), false);
  // Eine auf 0 gerundete Eingabe passt nicht zu jedem kleinen Kandidaten.
  assert.equal(passtZu("0", 0.25), false);
  assert.equal(passtZu("0", 0), true);
});

test("rundungsHinweis: nur wenn gerundet werden muss; Bruch nicht bei Geld", () => {
  assert.equal(rundungsHinweis({ art: "prozent" }, 100 / 3), "Runde auf eine Nachkommastelle oder gib einen Bruch an.");
  assert.equal(rundungsHinweis({ art: "zahl" }, zehnDrittel), "Runde auf zwei Nachkommastellen oder gib einen Bruch an.");
  assert.equal(rundungsHinweis({ art: "geld" }, 10 / 3), "Runde auf zwei Nachkommastellen.");
  assert.equal(rundungsHinweis({ art: "zahl", stellen: 3 }, 1 / 7), "Runde auf drei Nachkommastellen oder gib einen Bruch an.");
  assert.equal(rundungsHinweis({ art: "zahl", bruchZuerst: true }, bruch(1, 6)), "Gib einen Bruch an oder runde auf zwei Nachkommastellen.");
  assert.equal(rundungsHinweis({ art: "geld" }, 30), "");
  assert.equal(rundungsHinweis({ art: "prozent" }, 25), "");
  assert.equal(rundungsHinweis({ art: "prozent" }, 12.5), "");
  assert.equal(rundungsHinweis({ art: "zahl" }, bruch(1, 4)), "");
});

test("zahlenfeld ergänzt Typ, Art, Stellen und Hinweis", () => {
  assert.deepEqual(zahlenfeld({ id: "p", label: "Prozentsatz", einheit: "%", art: "prozent" }, 100 / 3), {
    id: "p", label: "Prozentsatz", einheit: "%", typ: "zahl", art: "prozent", stellen: 1,
    hinweis: "Runde auf eine Nachkommastelle oder gib einen Bruch an.",
  });
  const f = zahlenfeld({ id: "x", label: "x" }, 4);
  assert.equal(f.art, "zahl");
  assert.equal(f.stellen, 2);
  assert.equal(f.hinweis, "");
  assert.equal(zahlenfeld({ id: "g", label: "g", art: "geld", stellen: 0 }, 2.5).stellen, 0);
});
