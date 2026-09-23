// Use Case: Kompetenz 8 – „genau einmal“, „beide gleich“, „mindestens einmal“ in Pfade übersetzen (pfade-uebersetzen.html).
import { test } from "node:test";
import assert from "node:assert/strict";
import { erzeugeAufgabe, pruefeAntwort } from "../js/aufgaben/pfade-uebersetzen.js";
import { erzeugeZufall } from "../../kern/js/zufall.js";

test("Zwei Züge mit Zurücklegen, Ereignis genau einmal, beide gleich oder mindestens einmal", () => {
  const codes = new Set();
  for (let s = 0; s < 40; s++) {
    const a = erzeugeAufgabe(erzeugeZufall(s));
    assert.equal(a.thema, "pfade-uebersetzen");
    assert.equal(a.zuege, 2);
    assert.equal(a.mitZuruecklegen, true);
    assert.match(a.ereignis.code, /^(genau1|mind1|beidegleich)/);
    codes.add(a.ereignis.code.replace(/\d?[a-z]$/, ""));
    assert.equal(pruefeAntwort(a, a.loesung).korrekt, true);
  }
  assert.ok(codes.size >= 3, [...codes].join());
});

test("Vorgaben aus der URL gelten", () => {
  const a = erzeugeAufgabe(erzeugeZufall(1), { urne: "3r2b1g", zuege: 2, modus: "ohne", ereignis: "genau1r" });
  assert.equal(a.mitZuruecklegen, false);
  assert.equal(a.pfade.length, 4);
});
