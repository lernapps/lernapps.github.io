// Use Case: Sachaufgaben übersetzen – Generator und Prüfer.
import { test } from "node:test";
import assert from "node:assert/strict";
import { erzeugeZufall } from "../../kern/js/zufall.js";
import { istSchoen } from "../../kern/js/zahlen.js";
import { erzeugeAufgabe, pruefeAntwort } from "../js/aufgaben/sachaufgaben.js";

test("erzeugeAufgabe liefert beide Typen", () => {
  const z = erzeugeZufall(51);
  const typen = new Set();
  for (let i = 0; i < 60; i++) {
    const a = erzeugeAufgabe(z);
    typen.add(a.typ);
    assert.equal(a.thema, "sachaufgaben");
    if (a.typ === "gleichung") {
      assert.equal(a.felder[0].id, "gleichung");
      assert.equal(a.felder[0].typ, "radio");
      assert.equal(a.felder[0].optionen.length, 3);
      assert.ok(a.felder[0].optionen.some((o) => o.wert === a.loesung.gleichung));
      assert.equal(a.felder[1].id, "ergebnis");
      assert.ok(istSchoen(a.loesung.ergebnis));
    } else {
      assert.equal(a.typ, "dreisatz");
      assert.equal(a.tabelle.length, 3);
      assert.equal(a.tabelle[0].links, "100 %");
      assert.equal(a.tabelle[1].feld, "eins");
      assert.equal(a.tabelle[2].feld, "prozent");
      assert.equal(a.grundwert % 100, 0);
      assert.ok(istSchoen(a.loesung.prozent));
    }
  }
  assert.deepEqual([...typen].sort(), ["dreisatz", "gleichung"]);
});

test("die richtige Gleichung steht nicht immer an derselben Stelle", () => {
  const z = erzeugeZufall(52);
  const positionen = new Set();
  for (let i = 0; i < 40; i++) {
    const a = erzeugeAufgabe(z, { typ: "gleichung" });
    positionen.add(a.felder[0].optionen.findIndex((o) => o.wert === a.loesung.gleichung));
  }
  assert.equal(positionen.size, 3);
});

test("Vorgaben: typ, gesucht, g und p", () => {
  const a = erzeugeAufgabe(erzeugeZufall(1), { typ: "gleichung", gesucht: "g" });
  assert.equal(a.gesucht, "G");
  const d = erzeugeAufgabe(erzeugeZufall(1), { typ: "dreisatz", g: 300, p: 12 });
  assert.deepEqual([d.grundwert, d.prozentsatz, d.loesung.eins, d.loesung.prozent], [300, 12, 3, 36]);
});

test("pruefeAntwort (gleichung) bewertet Gleichung und Ergebnis getrennt", () => {
  const a = erzeugeAufgabe(erzeugeZufall(1), { typ: "gleichung", gesucht: "w" });
  const richtig = { gleichung: a.loesung.gleichung, ergebnis: String(a.loesung.ergebnis).replace(".", ",") };
  assert.equal(pruefeAntwort(a, richtig).korrekt, true);
  const falscheGleichung = a.felder[0].optionen.find((o) => o.wert !== a.loesung.gleichung).wert;
  const e = pruefeAntwort(a, { ...richtig, gleichung: falscheGleichung });
  assert.equal(e.korrekt, false);
  assert.equal(e.fehler, "gleichung-falsch");
  assert.equal(e.felder.ergebnis.korrekt, true);
  assert.equal(pruefeAntwort(a, { ...richtig, ergebnis: "1" }).fehler, "ergebnis-falsch");
  assert.equal(pruefeAntwort(a, { gleichung: "", ergebnis: "" }).fehler, "unvollstaendig");
});

test("pruefeAntwort (dreisatz) prüft beide Zeilen", () => {
  const d = erzeugeAufgabe(erzeugeZufall(1), { typ: "dreisatz", g: 300, p: 12 });
  assert.equal(pruefeAntwort(d, { eins: "3", prozent: "36" }).korrekt, true);
  const e = pruefeAntwort(d, { eins: "3", prozent: "12" });
  assert.equal(e.korrekt, false);
  assert.equal(e.felder.eins.korrekt, true);
  assert.equal(e.felder.prozent.korrekt, false);
  assert.equal(pruefeAntwort(d, { eins: "", prozent: "" }).fehler, "unvollstaendig");
});
