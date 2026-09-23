// Use Case: Test und Schnelltest – jede Kompetenz JEDER App liefert über ihren Generator prüfbare Testaufgaben.
// Ein neuer Generator muss diesen Vertrag erfüllen; der Test läuft automatisch für neue Apps mit.
import { test } from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { ladeApps } from "../../lib/apps.js";
import { leiteAdressenAb } from "../../lib/adressen.js";
import { erzeugeZufall } from "../../src/kern/js/zufall.js";
import { erzeugeTestaufgabe, pruefeTestaufgabe } from "../../src/kern/js/testaufgaben.js";

const apps = await ladeApps({ quelle: "src", adressen: leiteAdressenAb("https://example.github.io/x/") });

for (const app of apps) {
  const generatoren = {};
  for (const k of app.kompetenzen) {
    generatoren[k.id] = await import(pathToFileURL(path.resolve("src", app.pfad, "js", k.generator)).href);
  }

  test(`${app.pfad}: jede Kompetenz liefert deterministische Aufgaben mit Feldern`, () => {
    for (const k of app.kompetenzen) {
      const a = erzeugeTestaufgabe(generatoren, k.id, erzeugeZufall(7));
      const b = erzeugeTestaufgabe(generatoren, k.id, erzeugeZufall(7));
      assert.equal(a.thema, k.id);
      assert.equal(a.seed, 7);
      assert.ok(a.felder.length >= 1, k.id);
      assert.ok(a.text || a.html, k.id);
      assert.deepEqual(a.loesung, b.loesung);
    }
  });

  test(`${app.pfad}: die Lösung ist korrekt, Unsinn nicht`, () => {
    for (const k of app.kompetenzen) {
      for (let s = 1; s <= 20; s++) {
        const a = erzeugeTestaufgabe(generatoren, k.id, erzeugeZufall(s));
        const richtig = Object.fromEntries(Object.entries(a.loesung).map(([id, w]) => [id, String(w).replace(".", ",")]));
        assert.equal(pruefeTestaufgabe(generatoren, a, richtig), true, `${k.id} Seed ${s}`);
        const falsch = Object.fromEntries(a.felder.map((f) => [f.id, "999999"]));
        assert.equal(pruefeTestaufgabe(generatoren, a, falsch), false, `${k.id} Seed ${s}`);
      }
    }
  });
}
