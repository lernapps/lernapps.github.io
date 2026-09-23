// Use Case: Zahlen eingeben – die Rundungsregel in allen Generatoren mit Zahlenfeldern.
// BR-1 art/stellen je Feld: Prozentsatz → prozent/1; Prozentwert, Grundwert, neuer/alter Wert → geld/2 bei €, sonst zahl/2;
//      Dreisatz-Zellen → zahl/2. BR-2/3 Toleranz nach getippten Stellen, zu grob = Hinweis. BR-4 Brüche/Terme überall.
import { test } from "node:test";
import assert from "node:assert/strict";
import { erzeugeZufall } from "../../kern/js/zufall.js";
import * as prozentwert from "../js/aufgaben/prozentwert.js";
import * as grundwert from "../js/aufgaben/grundwert.js";
import * as prozentsatz from "../js/aufgaben/prozentsatz.js";
import * as vergleich from "../js/aufgaben/vergleich.js";
import * as veraenderung from "../js/aufgaben/veraenderung.js";
import * as sachaufgaben from "../js/aufgaben/sachaufgaben.js";

const z = () => erzeugeZufall(1);
const pruefe = (modul, a, eingabe, feld = a.felder[0].id) => modul.pruefeAntwort(a, { [feld]: eingabe });

test("BR-1: Felder deklarieren art und stellen passend zur Einheit", () => {
  for (const [modul, feld] of [[prozentwert, "prozentwert"], [grundwert, "grundwert"]]) {
    for (let s = 1; s <= 40; s++) {
      const a = modul.erzeugeAufgabe(erzeugeZufall(s));
      const f = a.felder.find((x) => x.id === feld);
      assert.equal(f.art, a.einheit === "€" ? "geld" : "zahl", `${feld} Seed ${s}`);
      assert.equal(f.stellen, 2);
    }
  }
  for (let s = 1; s <= 40; s++) {
    for (const modul of [prozentsatz, vergleich]) {
      const f = modul.erzeugeAufgabe(erzeugeZufall(s)).felder[0];
      assert.deepEqual([f.art, f.stellen], ["prozent", 1]);
    }
    const v = veraenderung.erzeugeAufgabe(erzeugeZufall(s));
    assert.equal(v.felder[0].art, v.einheit === "€" ? "geld" : "zahl");
    const d = sachaufgaben.erzeugeAufgabe(erzeugeZufall(s), { typ: "dreisatz" });
    for (const f of d.felder) assert.deepEqual([f.art, f.stellen], ["zahl", 2]);
    const g = sachaufgaben.erzeugeAufgabe(erzeugeZufall(s), { typ: "gleichung" });
    const e = g.felder.find((f) => f.id === "ergebnis");
    assert.equal(e.art, g.gesucht === "p" ? "prozent" : g.einheit === "€" ? "geld" : "zahl");
  }
});

test("Prozentsatz 10 von 30: 33,3 richtig, 33 zu grob, 33,4 falsch, 100/3 richtig, Hinweis sichtbar", () => {
  const a = prozentsatz.erzeugeAufgabe(z(), { g: 30, w: 10 });
  assert.equal(a.felder[0].hinweis, "Runde auf eine Nachkommastelle oder gib einen Bruch an.");
  assert.equal(pruefe(prozentsatz, a, "33,3").korrekt, true);
  assert.equal(pruefe(prozentsatz, a, "33,33 %").korrekt, true);
  assert.equal(pruefe(prozentsatz, a, "100/3").korrekt, true);
  assert.equal(pruefe(prozentsatz, a, "10/30*100").korrekt, true);
  const grob = pruefe(prozentsatz, a, "33");
  assert.equal(grob.fehler, "zu-grob-gerundet");
  assert.equal(grob.meldung, "Fast – runde auf eine Nachkommastelle.");
  assert.equal(pruefe(prozentsatz, a, "33,4").fehler, "falsch");
  assert.equal(pruefe(prozentsatz, a, "0,33").fehler, "dezimal-statt-prozent");
  assert.equal(pruefe(prozentsatz, a, "300").fehler, "bezugsgroesse-verwechselt");
  assert.equal(prozentsatz.erzeugeAufgabe(z(), { g: 200, w: 50 }).felder[0].hinweis, "");
});

test("Vergleich 120 zu 90 (größer): 33,3 % richtig, Diagnosen mit gerundeten Werten", () => {
  const a = vergleich.erzeugeAufgabe(z(), { a: 120, b: 90, frage: "groesser" });
  assert.equal(a.felder[0].hinweis, "Runde auf eine Nachkommastelle oder gib einen Bruch an.");
  assert.equal(pruefe(vergleich, a, "33,3").korrekt, true);
  assert.equal(pruefe(vergleich, a, "33,34").fehler, "falsch");
  assert.equal(pruefe(vergleich, a, "33").fehler, "zu-grob-gerundet");
  assert.equal(pruefe(vergleich, a, "30/90*100").korrekt, true);
  assert.equal(pruefe(vergleich, a, "25").fehler, "bezugsgroesse-verwechselt");
  assert.equal(pruefe(vergleich, a, "30").fehler, "differenz-statt-prozent");
  assert.equal(pruefe(vergleich, a, "133,3").fehler, "verhaeltnis-statt-unterschied");
  assert.equal(pruefe(vergleich, a, "133").fehler, "verhaeltnis-statt-unterschied");
});

test("Prozentwert 12,5 % von 7: 0,88 richtig, 0,87 falsch, 0,9 zu grob, Term richtig", () => {
  const a = prozentwert.erzeugeAufgabe(z(), { g: 7, p: 12.5 });
  assert.equal(a.felder[0].hinweis, "Runde auf zwei Nachkommastellen oder gib einen Bruch an.");
  assert.equal(pruefe(prozentwert, a, "0,88").korrekt, true);
  assert.equal(pruefe(prozentwert, a, "0,875").korrekt, true);
  assert.equal(pruefe(prozentwert, a, "0,87").fehler, "falsch");
  assert.equal(pruefe(prozentwert, a, "0,9").fehler, "zu-grob-gerundet");
  assert.equal(pruefe(prozentwert, a, "7*12,5/100").korrekt, true);
  assert.equal(pruefe(prozentwert, a, "87,5").fehler, "prozent-statt-dezimal");
  assert.equal(pruefe(prozentwert, a, "88").fehler, "prozent-statt-dezimal");
  assert.equal(pruefe(prozentwert, a, "6,13").fehler, "rest-statt-anteil");
});

test("Geld: Terme auf den Cent, Hinweis ohne Bruch", () => {
  let a;
  for (let s = 1; !a || a.einheit !== "€"; s++) a = prozentwert.erzeugeAufgabe(erzeugeZufall(s), { g: 250, p: 12 });
  assert.equal(pruefe(prozentwert, a, "250*12/100").korrekt, true);
  assert.equal(pruefe(prozentwert, a, "30 €").korrekt, true);
  assert.equal(a.felder[0].hinweis, "");
});

test("Grundwert 10 sind 30 %: 33,33 richtig, 33,3 zu grob, 1000/30 richtig", () => {
  const a = grundwert.erzeugeAufgabe(z(), { w: 10, p: 30 });
  assert.equal(pruefe(grundwert, a, "33,33").korrekt, true);
  assert.equal(pruefe(grundwert, a, "33,3").fehler, "zu-grob-gerundet");
  assert.equal(pruefe(grundwert, a, "33,34").fehler, "falsch");
  assert.equal(pruefe(grundwert, a, "1000/30").korrekt, true);
  assert.equal(pruefe(grundwert, a, "3").fehler, "prozentwert-statt-grundwert");
  assert.equal(pruefe(grundwert, a, "0,33").fehler, "nur-ein-prozent");
});

test("Veränderung: alter Wert nach +3 % ist 100 → 97,09", () => {
  const a = veraenderung.erzeugeAufgabe(z(), { neu: 100, p: 3, richtung: "plus" });
  assert.equal(a.typ, "alt");
  assert.equal(pruefe(veraenderung, a, "97,09").korrekt, true);
  assert.equal(pruefe(veraenderung, a, "97,08").fehler, "falsch");
  assert.equal(pruefe(veraenderung, a, "97,1").fehler, "zu-grob-gerundet");
  assert.equal(pruefe(veraenderung, a, "100/1,03").korrekt, true);
  // "97" wäre nur zu grob gerundet; mit zwei Stellen ist 97,00 die Verwechslung.
  assert.equal(pruefe(veraenderung, a, "97").fehler, "zu-grob-gerundet");
  assert.equal(pruefe(veraenderung, a, "97,00").fehler, "grundwert-neuer-wert");
});

test("Dreisatz 12,5 % von 125: 1 % = 1,25, 12,5 % = 15,63; zu grob ist ein Hinweis", () => {
  const a = sachaufgaben.erzeugeAufgabe(z(), { typ: "dreisatz", g: 125, p: 12.5 });
  assert.equal(sachaufgaben.pruefeAntwort(a, { eins: "1,25", prozent: "15,63" }).korrekt, true);
  assert.equal(sachaufgaben.pruefeAntwort(a, { eins: "125/100", prozent: "125/8" }).korrekt, true);
  assert.equal(sachaufgaben.pruefeAntwort(a, { eins: "1,25", prozent: "15,62" }).fehler, "falsch");
  const grob = sachaufgaben.pruefeAntwort(a, { eins: "1,25", prozent: "15,6" });
  assert.equal(grob.korrekt, false);
  assert.equal(grob.fehler, "zu-grob-gerundet");
  assert.equal(grob.felder.prozent.fehler, "zu-grob-gerundet");
  assert.equal(sachaufgaben.pruefeAntwort(a, { eins: "1,2", prozent: "15,6" }).fehler, "falsch");
  assert.equal(a.felder[1].hinweis, "Runde auf zwei Nachkommastellen oder gib einen Bruch an.");
});
