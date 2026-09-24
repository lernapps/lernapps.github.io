// Use Case: Architektur-Doku pflegen – das Harness-Rad (arc42 8.16) zeigt den echten Stand und bleibt synchron.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { SCHICHTEN, ABSCHNITTE, zeichneRad, schreibeInventar, abdeckung, ZIELE } from "../../scripts/harness-rad.js";
import { baueOriginalUrl, schreibeOriginalAbschnitt } from "../../scripts/harness-rad-original.js";

test("das Inventar nennt alle 69 Schichten des Harness Coverage Wheel in neun Abschnitten", () => {
  assert.equal(SCHICHTEN.length, 69);
  assert.equal(ABSCHNITTE.length, 9);
  assert.equal(new Set(SCHICHTEN.map((s) => s.id)).size, 69);
  for (const s of SCHICHTEN) assert.ok(ABSCHNITTE.some((a) => a.name === s.abschnitt), s.id);
});

test("jede Schicht hat einen bekannten Status, und was vorhanden ist, nennt einen Beleg", () => {
  const erlaubt = ["vorhanden", "in Arbeit", "geplant", "offen", "verworfen", "entfällt"];
  for (const s of SCHICHTEN) {
    assert.ok(erlaubt.includes(s.status), `${s.id}: ${s.status}`);
    if (s.status !== "offen") assert.ok(s.beleg, `${s.id} braucht einen Beleg`);
  }
});

test("Abdeckung zählt nur Schichten bis Tier 2 und lässt entfallene weg", () => {
  const a = abdeckung(SCHICHTEN, 2);
  assert.ok(a.relevant > 0 && a.vorhanden <= a.relevant);
  assert.ok(a.relevant < SCHICHTEN.filter((s) => s.tier <= 2).length);
});

test("das SVG lädt nichts von außen und nennt die Quelle", () => {
  const svg = zeichneRad(SCHICHTEN);
  assert.match(svg, /^<svg [^>]*xmlns="http:\/\/www\.w3\.org\/2000\/svg"/);
  assert.doesNotMatch(svg, /(href|src)="(https?:)?\/\//);
  assert.match(svg, /Harness Coverage Wheel/);
});

test("die eingecheckten Dateien entsprechen dem Generator (node scripts/harness-rad.js)", () => {
  assert.equal(fs.readFileSync(ZIELE.svg, "utf8"), zeichneRad(SCHICHTEN));
  assert.equal(fs.readFileSync(ZIELE.adoc, "utf8"), schreibeInventar(SCHICHTEN));
  const original = fs.readFileSync(ZIELE.original, "utf8");
  assert.equal(original, schreibeOriginalAbschnitt(SCHICHTEN, abdeckung(SCHICHTEN)));
  assert.ok(original.includes(`link:${baueOriginalUrl(SCHICHTEN)}[`), "Link zum Original zeigt den aktuellen Stand");
});
