// Use Case: Architektur-Doku pflegen – arc42 8.3: fast jede Testdatei nennt im Kopf ihren Use Case.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const MINDESTANTEIL = 0.9;

function testdateien(ordner) {
  return fs.readdirSync(ordner, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(ordner, e.name);
    if (e.isDirectory()) return e.name === "node_modules" ? [] : testdateien(p);
    return e.name.endsWith(".test.js") ? [p] : [];
  });
}

test(`mindestens ${MINDESTANTEIL * 100} % der Testdateien nennen im Kopf den Use Case (arc42 8.3)`, () => {
  const dateien = [...testdateien("test"), ...testdateien("src")];
  const mitUseCase = dateien.filter((d) => fs.readFileSync(d, "utf8").split("\n", 5).some((z) => z.includes("Use Case")));
  const ohne = dateien.filter((d) => !mitUseCase.includes(d));
  assert.ok(mitUseCase.length / dateien.length >= MINDESTANTEIL,
    `${mitUseCase.length} von ${dateien.length}; ohne Use Case: ${ohne.join(", ")}`);
});
