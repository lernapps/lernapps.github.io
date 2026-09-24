// Use Case: Architektur-Doku pflegen – das Harness-Rad (arc42 8.16) zeigt den echten Stand und bleibt synchron.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { SCHICHTEN, ABSCHNITTE, zeichneRad, schreibeInventar, abdeckung, ZIELE } from "../../scripts/harness-rad.js";
import { baueOriginalUrl, schreibeOriginalAbschnitt } from "../../scripts/harness-rad-original.js";
import { BELEGE, pruefeBeleg, jobsVon } from "../../scripts/harness-belege.js";
import eslintConfig from "../../eslint.config.js";

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

// Belege (scripts/harness-belege.js): was „vorhanden“ heißt, muss im Repo stehen – nicht nur im Text.
const VORHANDEN = SCHICHTEN.filter((s) => s.status === "vorhanden");

test("jede vorhandene Schicht nennt mindestens einen maschinenprüfbaren Beleg, und kein Beleg ist verwaist", () => {
  for (const s of VORHANDEN) assert.ok(BELEGE[s.id]?.length, `${s.id} braucht einen Eintrag in BELEGE`);
  for (const id of Object.keys(BELEGE)) {
    assert.ok(VORHANDEN.some((s) => s.id === id), `BELEGE.${id}: keine vorhandene Schicht mit dieser id`);
  }
});

test("jeder Beleg außer github: löst sich im Repo auf (Datei, npm-Skript, Workflow-Job, ESLint-Regel, Export)", () => {
  const fehler = VORHANDEN.flatMap((s) => (BELEGE[s.id] ?? [])
    .map((b) => [b, pruefeBeleg(b, eslintConfig)])
    .filter(([, e]) => e && e !== "github")
    .map(([b, e]) => `${s.id} – ${b}: ${e}`));
  assert.deepEqual(fehler, []);
});

test("Schichten, die nur github:-Belege haben, prüft allein das Audit (arc42 8.16)", (t) => {
  const nurGithub = VORHANDEN.filter((s) => BELEGE[s.id]?.every((b) => b.startsWith("github:"))).map((s) => s.id);
  t.diagnostic(`nur per GitHub-Audit prüfbar: ${nurGithub.join(", ")}`);
  assert.deepEqual(nurGithub, ["secret-scanning", "sast"]);
});

test("pruefeBeleg meldet fehlende Datei, fehlenden Job, fehlendes Skript und unbekannte Art", () => {
  assert.match(pruefeBeleg("datei:e2e/gibt-es-nicht.spec.js", eslintConfig), /Datei fehlt/);
  assert.match(pruefeBeleg("job:pruefen.yml#gibt-es-nicht", eslintConfig), /Job gibt-es-nicht fehlt/);
  assert.match(pruefeBeleg("skript:gibt-es-nicht", eslintConfig), /npm-Skript fehlt/);
  assert.match(pruefeBeleg("regel:no-debugger-gibt-es-nicht", eslintConfig), /nicht eingeschaltet/);
  assert.match(pruefeBeleg("funktion:lib/pruefungen.js#gibtEsNicht", eslintConfig), /exportiert gibtEsNicht nicht/);
  assert.match(pruefeBeleg("irgendwas:x", eslintConfig), /unbekannte Beleg-Art/);
  assert.deepEqual(jobsVon("on:\n  push:\njobs:\n  a-b:\n    steps:\n  c:\n"), ["a-b", "c"]);
});
