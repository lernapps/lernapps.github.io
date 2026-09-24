// Use Case: Checkliste, Menü und Test folgen der Lernreihenfolge. L-038: Das Gegenereignis steht hinter der ersten
// Pfadregel, weil sein Trick „mindestens einmal“ einen Pfad multipliziert. Die Seitenadressen bleiben.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { KOMPETENZEN } from "../js/app.config.js";

const REIHENFOLGE = ["laplace", "baumdiagramm", "pfadregel-1", "gegenereignis", "ohne-zuruecklegen", "pfadregel-2", "ergebnisformen", "pfade-uebersetzen"];

test("L-038: Reihenfolge der Kompetenzen – Gegenereignis direkt hinter der 1. Pfadregel", () => {
  assert.deepEqual(KOMPETENZEN.map((k) => k.id), REIHENFOLGE);
  assert.equal(KOMPETENZEN.find((k) => k.id === "gegenereignis").seite, "gegenereignis.html");
});

test("L-038: llms.txt nummeriert die Seiten in derselben Reihenfolge", () => {
  const llms = fs.readFileSync("src/zufall/llms.njk", "utf8");
  const seiten = [...llms.matchAll(/^### (\d) .* – \{\{ app\.basisUrl \}\}([a-z0-9-]+)\.html$/gm)];
  assert.deepEqual(seiten.map((m) => [Number(m[1]), m[2]]), REIHENFOLGE.map((id, i) => [i + 1, id]));
});

test("L-038: die Checkliste im Tutor-Prompt folgt derselben Reihenfolge", () => {
  const tutor = fs.readFileSync("src/zufall/tutor.njk", "utf8");
  const zeilen = [...tutor.matchAll(/^(\d)\. (.+)$/gm)].slice(0, 8).map((m) => m[2]);
  assert.match(zeilen[1], /^Baumdiagramm/);
  assert.match(zeilen[2], /^Erste Pfadregel/);
  assert.match(zeilen[3], /^Gegenwahrscheinlichkeit/);
});
