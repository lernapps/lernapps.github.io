// Use Case: Erklärung lesen (Prozent-Trainer) – Regeln aus dem Lektorat, die nicht zurückkommen sollen.
// L-010: Zahl und %-/€-Zeichen trennt kein Zeilenumbruch (geschütztes Leerzeichen &nbsp; bzw. U+00A0).
import { test } from "node:test";
import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const ordner = path.join("src", "prozent");
const seiten = [];
for (const datei of await readdir(ordner)) {
  if (datei.endsWith(".md")) seiten.push([datei, await readFile(path.join(ordner, datei), "utf8")]);
}
// Metadaten (Beschreibung, Video- und serlo-Titel) sind kein Fließtext.
const fliesstext = (text) => text.split("\n").filter((z) => !/^\s*(beschreibung|titel|serlo|kompetenz|kanal|id):/.test(z)).join("\n");

test("L-010: kein normales Leerzeichen zwischen Zahl (oder p) und % bzw. €", () => {
  const funde = seiten.flatMap(([name, text]) => (fliesstext(text).match(/.{0,20}(?:\d|\bp) [%€].{0,10}/g) ?? []).map((f) => `${name}: ${f}`));
  assert.deepEqual(funde, []);
});
