// Use Case: Antwort prüfen – gemeinsames Ergebnisformat aller Generatoren { korrekt, fehler, felder, meldung }.
import { test } from "node:test";
import assert from "node:assert/strict";
import { bruch } from "../../src/kern/js/bruch.js";
import {
  ergebnisFuer, ergebnisAusFeldern, pruefeBruchEingabe, wirdGezaehlt, istHinweis, MELDUNG_KEINE_ZAHL, MELDUNG_KEIN_TERM,
} from "../../src/kern/js/pruefung.js";
import { pruefeZahlAntwort } from "../../src/kern/js/zahlantwort.js";

test("ergebnisFuer baut das Ergebnis für ein Feld", () => {
  const meldungen = { falsch: "Nein.", "keine-zahl": MELDUNG_KEINE_ZAHL };
  assert.deepEqual(ergebnisFuer("x", { korrekt: true, wert: 3 }, undefined, meldungen, "3 m."), {
    korrekt: true, fehler: undefined, felder: { x: { korrekt: true, wert: 3 } }, meldung: "Richtig! 3 m.",
  });
  assert.equal(ergebnisFuer("x", { korrekt: false, wert: NaN }, "keine-zahl", meldungen, "").meldung, MELDUNG_KEINE_ZAHL);
  assert.equal(ergebnisFuer("x", { korrekt: false, wert: 2 }, "unbekannt", meldungen, "").meldung, "Nein.");
});

test("ergebnisAusFeldern: korrekt nur, wenn alle Felder stimmen; leere Felder heißen keine-eingabe", () => {
  const alle = ergebnisAusFeldern({ a: { korrekt: true }, b: { korrekt: true } }, { richtig: "Beides richtig." });
  assert.equal(alle.korrekt, true);
  assert.equal(alle.meldung, "Richtig! Beides richtig.");
  const teil = ergebnisAusFeldern({ a: { korrekt: true }, b: { korrekt: false, wert: 5 } }, { falsch: "Schau dir b an." });
  assert.equal(teil.korrekt, false);
  assert.equal(teil.fehler, "falsch");
  assert.equal(teil.meldung, "Schau dir b an.");
  const leer = ergebnisAusFeldern({ a: { korrekt: false, wert: NaN }, b: { korrekt: false, wert: NaN } }, {});
  assert.equal(leer.fehler, "keine-eingabe");
});

test("pruefeBruchEingabe akzeptiert Bruch, Dezimalzahl, Prozent und Term", () => {
  const viertel = bruch(1, 4);
  for (const eingabe of ["1/4", "25/100", "0,25", "25 %", "1/2*1/2"]) {
    assert.equal(pruefeBruchEingabe(eingabe, viertel).korrekt, true, eingabe);
  }
  assert.equal(pruefeBruchEingabe("1/5", viertel).korrekt, false);
  assert.deepEqual(pruefeBruchEingabe("1/5", viertel).wert, bruch(1, 5));
  assert.ok(Number.isNaN(pruefeBruchEingabe("quatsch", viertel).wert));
  assert.ok(MELDUNG_KEIN_TERM.includes("3/4"));
  // Dieselbe Rundungsregel wie überall: 0,17 für 1/6 richtig, 0,16 falsch, 0,2 zu grob.
  const sechstel = bruch(1, 6);
  assert.equal(pruefeBruchEingabe("0,17", sechstel).korrekt, true);
  assert.equal(pruefeBruchEingabe("0,16", sechstel).korrekt, false);
  assert.equal(pruefeBruchEingabe("0,2", sechstel).fehler, "zu-grob-gerundet");
  assert.equal(pruefeBruchEingabe("1/6", sechstel, { nurZahl: true }).fehler, "ausdruck-statt-zahl");
});

test("ergebnisFuer: Hinweise aus der Zahlprüfung bringen ihre Meldung mit und markieren das Feld", () => {
  const meldungen = { falsch: "Nein.", "keine-zahl": MELDUNG_KEINE_ZAHL };
  const teil = pruefeZahlAntwort("3,3", bruch(10, 3), { stellen: 2 });
  const r = ergebnisFuer("x", teil, teil.fehler, meldungen, "");
  assert.equal(r.fehler, "zu-grob-gerundet");
  assert.equal(r.meldung, "Fast – runde auf zwei Nachkommastellen.");
  assert.equal(r.felder.x.fehler, "zu-grob-gerundet");
  assert.equal(istHinweis(r), true);
  const wurzel = pruefeZahlAntwort("sqrt(-1)", 1);
  assert.match(ergebnisFuer("x", wurzel, wurzel.fehler, meldungen, "").meldung, /negativ/);
  // Setzt der Generator einen eigenen Fehlercode, gilt seine Meldung.
  const falsch = pruefeZahlAntwort("25", 20);
  assert.equal(ergebnisFuer("x", falsch, "faktor-10", { ...meldungen, "faktor-10": "Faktor!" }, "").meldung, "Faktor!");
});

test("ergebnisAusFeldern: nur Hinweise und sonst richtig → Hinweis statt falsch", () => {
  const grob = pruefeZahlAntwort("3,3", bruch(10, 3), { stellen: 2 });
  const r = ergebnisAusFeldern({ a: { korrekt: true, wert: 1 }, b: grob }, {});
  assert.equal(r.korrekt, false);
  assert.equal(r.fehler, "zu-grob-gerundet");
  assert.equal(r.meldung, grob.meldung);
  assert.equal(istHinweis(r), true);
  const gemischt = ergebnisAusFeldern({ a: { korrekt: false, wert: 5 }, b: grob }, {});
  assert.equal(gemischt.fehler, "falsch");
});

test("wirdGezaehlt: unlesbare oder leere Eingaben zählen nicht als Versuch", () => {
  assert.equal(wirdGezaehlt({ korrekt: true }), true);
  assert.equal(wirdGezaehlt({ korrekt: false, fehler: "falsch" }), true);
  assert.equal(wirdGezaehlt({ korrekt: false, fehler: "keine-zahl" }), false);
  assert.equal(wirdGezaehlt({ korrekt: false, fehler: "keine-eingabe" }), false);
  for (const fehler of ["zu-grob-gerundet", "gemischte-zahl", "ausdruck-statt-zahl"]) {
    assert.equal(wirdGezaehlt({ korrekt: false, fehler }), false, fehler);
    assert.equal(istHinweis({ korrekt: false, fehler }), true, fehler);
  }
  assert.equal(istHinweis({ korrekt: false, fehler: "falsch" }), false);
});
