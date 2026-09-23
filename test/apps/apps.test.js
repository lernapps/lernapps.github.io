// Use Case: Übersicht und Build – alle Apps kommen aus ihren Konfigurationen src/<app>/js/app.config.js.
import { test } from "node:test";
import assert from "node:assert/strict";
import { ladeApps } from "../../lib/apps.js";
import { leiteAdressenAb } from "../../lib/adressen.js";

const adressen = leiteAdressenAb("https://lernapps.github.io/");
const apps = await ladeApps({ quelle: "src", adressen });

test("ladeApps findet jede App mit Konfiguration, sortiert nach Pfad", () => {
  assert.ok(apps.length >= 1);
  assert.deepEqual(apps.map((a) => a.pfad), [...apps.map((a) => a.pfad)].sort());
  assert.ok(apps.every((a) => !["kern", "_data", "_includes"].includes(a.pfad)));
});

test("Binom: abgeleitete Adressen, Fachfarbe, nummerierte Kompetenzen, altes Speicher-Präfix", () => {
  const binom = apps.find((a) => a.pfad === "binom");
  assert.equal(binom.id, "binom-trainer");
  assert.equal(binom.basisUrl, "https://lernapps.github.io/binom/");
  assert.equal(binom.quellcode, "https://github.com/lernapps/lernapps.github.io/tree/main/src/binom");
  assert.equal(binom.farbe.primaer, "#1d4ed8");
  assert.deepEqual(binom.kompetenzen.map((k) => k.nr), [1, 2, 3, 4, 5, 6]);
  assert.equal(binom.kompetenzen[1].seite, "erste-binomische.html");
});

test("pfad muss dem Ordnernamen entsprechen und id gesetzt sein", async () => {
  const { pruefeAppKonfig } = await import("../../lib/apps.js");
  assert.deepEqual(pruefeAppKonfig("binom", { id: "x", pfad: "binom", titel: "T", fach: "mathe" }), []);
  assert.equal(pruefeAppKonfig("binom", { id: "", pfad: "andere", titel: "T", fach: "mathe" }).length, 2);
});
