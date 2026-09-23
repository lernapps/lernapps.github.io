// Use Case: Zwei Werte vergleichen – Generator und Prüfer.
import { test } from "node:test";
import assert from "node:assert/strict";
import { erzeugeZufall } from "../../kern/js/zufall.js";
import { istSchoen } from "../../kern/js/zahlen.js";
import { erzeugeAufgabe, pruefeAntwort } from "../js/aufgaben/vergleich.js";

test("erzeugeAufgabe stellt beide Fragen mit schönen Antworten", () => {
  const z = erzeugeZufall(31);
  const fragen = new Set();
  for (let i = 0; i < 80; i++) {
    const a = erzeugeAufgabe(z);
    fragen.add(a.frage);
    assert.equal(a.thema, "vergleich");
    assert.ok(istSchoen(a.a) && istSchoen(a.b));
    assert.ok(istSchoen(a.prozentsatz), `p=${a.prozentsatz}`);
    assert.ok(a.text.includes(a.frage === "groesser" ? "größer" : "kleiner"));
    assert.equal(a.felder[0].id, "prozentsatz");
    assert.ok(a.bezug === a.a || a.bezug === a.b);
  }
  assert.deepEqual([...fragen].sort(), ["groesser", "kleiner"]);
});

test("Vorgaben ?a=&b=&frage= werden übernommen", () => {
  const g = erzeugeAufgabe(erzeugeZufall(1), { a: 120, b: 150, frage: "groesser" });
  assert.equal(g.frage, "groesser");
  assert.equal(g.bezug, 120);
  assert.equal(g.prozentsatz, 25);
  const k = erzeugeAufgabe(erzeugeZufall(1), { a: 120, b: 150, frage: "kleiner" });
  assert.equal(k.bezug, 150);
  assert.equal(k.prozentsatz, 20);
  const irgendeine = erzeugeAufgabe(erzeugeZufall(1), { a: 120, b: 150 });
  assert.ok([20, 25].includes(irgendeine.prozentsatz));
});

test("pruefeAntwort erkennt die verwechselte Bezugsgröße", () => {
  const g = erzeugeAufgabe(erzeugeZufall(1), { a: 120, b: 150, frage: "groesser" });
  assert.equal(pruefeAntwort(g, { prozentsatz: "25" }).korrekt, true);
  assert.equal(pruefeAntwort(g, { prozentsatz: "20" }).fehler, "bezugsgroesse-verwechselt");
  assert.equal(pruefeAntwort(g, { prozentsatz: "30" }).fehler, "differenz-statt-prozent");
  assert.equal(pruefeAntwort(g, { prozentsatz: "125" }).fehler, "verhaeltnis-statt-unterschied");
  assert.equal(pruefeAntwort(g, { prozentsatz: "x" }).fehler, "keine-zahl");
});
