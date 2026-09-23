// Use Case: UC-7 (Tutor und Mensch finden die Architektur-Doku) – Übersicht und llms.txt verlinken /docs/.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

test("Übersicht verlinkt die Architektur-Doku", () => {
  assert.match(fs.readFileSync("src/index.njk", "utf8"), /href="docs\/"/);
});

test("llms.txt der Übersicht nennt die Architektur-Doku", () => {
  assert.match(fs.readFileSync("src/llms.njk", "utf8"), /\{\{ site\.basis \}\}docs\//);
});
