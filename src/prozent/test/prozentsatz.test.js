// Use Case: Prozentsatz berechnen – Generator und Prüfer.
import { test } from "node:test";
import assert from "node:assert/strict";
import { erzeugeZufall } from "../../kern/js/zufall.js";
import { istSchoen } from "../../kern/js/zahlen.js";
import { erzeugeAufgabe, pruefeAntwort } from "../js/aufgaben/prozentsatz.js";

test("erzeugeAufgabe liefert schöne Prozentsätze", () => {
  const z = erzeugeZufall(11);
  for (let i = 0; i < 50; i++) {
    const a = erzeugeAufgabe(z);
    assert.equal(a.thema, "prozentsatz");
    assert.ok(istSchoen(a.prozentsatz));
    assert.ok(a.prozentwert <= a.grundwert);
    assert.equal(a.felder[0].id, "prozentsatz");
    assert.equal(a.felder[0].einheit, "%");
    assert.ok(a.text.length > 20);
  }
});

test("Vorgaben ?g=&w= werden übernommen", () => {
  const a = erzeugeAufgabe(erzeugeZufall(1), { g: 80, w: 20 });
  assert.equal(a.grundwert, 80);
  assert.equal(a.prozentwert, 20);
  assert.equal(a.prozentsatz, 25);
});

test("pruefeAntwort erkennt typische Fehler", () => {
  const a = erzeugeAufgabe(erzeugeZufall(1), { g: 80, w: 20 });
  assert.equal(pruefeAntwort(a, { prozentsatz: "25 %" }).korrekt, true);
  assert.equal(pruefeAntwort(a, { prozentsatz: "0,25" }).fehler, "dezimal-statt-prozent");
  assert.equal(pruefeAntwort(a, { prozentsatz: "400" }).fehler, "bezugsgroesse-verwechselt");
  assert.equal(pruefeAntwort(a, { prozentsatz: "" }).fehler, "keine-zahl");
  assert.equal(pruefeAntwort(a, { prozentsatz: "30" }).fehler, "falsch");
});

test("L-008: Rechenweg schreibt p = W / G · 100 und das Ergebnis als p % = … %", () => {
  const z = erzeugeZufall(5);
  for (let i = 0; i < 20; i++) {
    const a = erzeugeAufgabe(z);
    assert.equal(a.rechenweg[0], "p = W / G · 100");
    assert.ok(a.rechenweg.filter((z) => z.includes("· 100")).every((z) => z.startsWith("p = ")), a.rechenweg.join(" | "));
    assert.match(a.rechenweg.at(-1), /^p % = [\d,]+ %$/);
  }
});
