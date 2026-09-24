// Use Case: Kompetenz 7 – Wahrscheinlichkeiten als Produkt, Summe oder Potenz angeben (ergebnisformen.html).
import { test } from "node:test";
import assert from "node:assert/strict";
import { erzeugeAufgabe, pruefeAntwort } from "../js/aufgaben/ergebnisformen.js";
import { erzeugeZufall } from "../../kern/js/zufall.js";

test("Passenden Term wählen, richtige Position variiert", () => {
  const positionen = new Set();
  for (let s = 0; s < 30; s++) {
    const b = erzeugeAufgabe(erzeugeZufall(s));
    assert.equal(b.thema, "ergebnisformen");
    assert.equal(b.optionen.length, 3);
    assert.equal(b.optionen.filter((o) => o.richtig).length, 1, `Seed ${s}`);
    assert.equal(new Set(b.optionen.map((o) => o.text)).size, 3, `Seed ${s}: Optionen verschieden`);
    const idx = b.optionen.findIndex((o) => o.richtig);
    positionen.add(idx);
    assert.equal(pruefeAntwort(b, { wahl: String(idx) }).korrekt, true);
    const f = pruefeAntwort(b, { wahl: String((idx + 1) % 3) });
    assert.equal(f.korrekt, false);
    assert.match(f.meldung, /Nicht ganz/);
  }
  assert.equal(positionen.size, 3);
});

test("Ohne Auswahl: Hinweis, kein Fehlversuch", () => {
  const b = erzeugeAufgabe(erzeugeZufall(1));
  const r = pruefeAntwort(b, { wahl: "" });
  assert.equal(r.korrekt, false);
  assert.equal(r.fehler, "keine-eingabe");
});
