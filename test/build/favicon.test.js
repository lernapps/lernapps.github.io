// Use Case: UC-7 (Tutor und Mensch finden die Architektur-Doku) – Doku und Übersicht tragen dasselbe "L"-Symbol.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const wurzelSvg = fs.readFileSync("src/favicon.svg", "utf8");

test("Doku-favicon.svg ist das lernapps-L, kein Vorlagen-Platzhalter", () => {
  const doku = fs.readFileSync("src/site/assets/favicon.svg", "utf8");
  assert.doesNotMatch(doku, /TODO/);
  assert.equal(doku, wurzelSvg);
});

function icoGroessen(datei) {
  const b = fs.readFileSync(datei);
  assert.equal(b.readUInt16LE(2), 1, `${datei} ist keine ICO-Datei`);
  return Array.from({ length: b.readUInt16LE(4) }, (_, i) => b[6 + 16 * i] || 256);
}

test("favicon.ico der Wurzel enthält 16, 32 und 48 px", () => {
  assert.deepEqual(icoGroessen("src/favicon.ico"), [16, 32, 48]);
});

test("Eleventy kopiert favicon.ico in die Wurzel der Ausgabe", () => {
  assert.match(fs.readFileSync("eleventy.config.js", "utf8"), /"src\/favicon\.ico": "favicon\.ico"/);
});

test("Doku-favicon.ico ist dasselbe wie das der Wurzel", () => {
  assert.ok(fs.readFileSync("src/site/assets/favicon.ico").equals(fs.readFileSync("src/favicon.ico")));
});
