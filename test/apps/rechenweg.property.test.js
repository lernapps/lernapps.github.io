// Property-Based Test (fast-check): Jede Rechnung im Lösungsweg lässt sich mit den gezeigten Zahlen nachrechnen (L-021).
// Use Case: Lösung zeigen (alle Apps). Ein Kind rechnet den gezeigten Weg nach; „=“ muss exakt stimmen, „≈“ auf die
// gezeigten Stellen. Ein gerundeter Zwischenwert, mit dem weitergerechnet wird („1,13“ statt 1,125), fällt hier auf.
// Risiko: R-025 (falsches Feedback lehrt Falsches).
import { test } from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import { pathToFileURL } from "node:url";
import fc from "fast-check";
import { OPTIONEN } from "../kern/property-einstellungen.js";
import { ladeApps } from "../../lib/apps.js";
import { leiteAdressenAb } from "../../lib/adressen.js";
import { erzeugeZufall } from "../../src/kern/js/zufall.js";
import { rechnungenIn } from "./rechenweg-pruefer.js";

const apps = await ladeApps({ quelle: "src", adressen: leiteAdressenAb("https://example.github.io/x/") });
const EINSTELLUNGEN = { ...OPTIONEN, numRuns: 150, includeErrorInReport: true };

function pruefeAufgabe(aufgabe, wo) {
  for (const r of rechnungenIn(aufgabe.rechenweg ?? [])) {
    assert.ok(r.stimmt, `${wo}: „${r.links} ${r.zeichen} ${r.rechts}“ stimmt nicht (${r.wertLinks} statt ${r.wertRechts}) in ${JSON.stringify(aufgabe.rechenweg)}`);
  }
}

for (const app of apps) {
  for (const k of app.kompetenzen) {
    const generator = await import(pathToFileURL(path.resolve("src", app.pfad, "js", k.generator)).href);
    test(`${app.pfad}/${k.id}: gezeigte Rechnungen im Lösungsweg stimmen (zufällige Aufgaben)`, () => {
      fc.assert(fc.property(fc.integer({ min: 1, max: 1e6 }), (seed) => {
        pruefeAufgabe(generator.erzeugeAufgabe(erzeugeZufall(seed)), `${k.id} Seed ${seed}`);
      }), EINSTELLUNGEN);
    });
  }
}

// URL-Vorgaben liefern beliebige Zahlen – dort entstehen gerundete Zwischenwerte am ehesten (Prozent-Trainer).
const zahl = fc.oneof(fc.integer({ min: 1, max: 2000 }), fc.integer({ min: 10, max: 20000 }).map((n) => n / 10), fc.integer({ min: 100, max: 200000 }).map((n) => n / 100));
const prozent = apps.find((a) => a.pfad === "prozent");
for (const k of prozent.kompetenzen) {
  const generator = await import(pathToFileURL(path.resolve("src", "prozent", "js", k.generator)).href);
  if (!generator.URL_ZAHLEN?.length) continue;
  test(`prozent/${k.id}: gezeigte Rechnungen stimmen auch mit URL-Vorgaben`, () => {
    const vorgaben = fc.record(Object.fromEntries(generator.URL_ZAHLEN.map((n) => [n, n === "p" ? fc.integer({ min: 10, max: 999 }).map((x) => x / 10) : zahl])));
    const texte = fc.record(Object.fromEntries((generator.URL_TEXTE ?? []).map((n) => [n, fc.constantFrom("plus", "minus", "neu", "alt", "gleichung", "dreisatz", "groesser", "kleiner", "g", "w", "p")])));
    fc.assert(fc.property(fc.integer({ min: 1, max: 1e6 }), vorgaben, texte, (seed, v, t) => {
      pruefeAufgabe(generator.erzeugeAufgabe(erzeugeZufall(seed), { ...v, ...t }), `${k.id} Seed ${seed} ${JSON.stringify({ ...v, ...t })}`);
    }), EINSTELLUNGEN);
  });
}
