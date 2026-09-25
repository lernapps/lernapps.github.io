// Use Case: Architektur-Doku pflegen – Kontext (arc42 3) und Level-1-Bausteinsicht (arc42 5) haben dieselbe Systemgrenze.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const KAPITEL = "src/docs/arc42/chapters";
const datei = (praefix) => fs.readdirSync(KAPITEL).find((f) => f.startsWith(praefix) && f.endsWith(".adoc"));

/** Aliase aller Person(...), Person_Ext(...) und System_Ext(...) in den PlantUML-Blöcken einer Datei. */
export function aussenwelt(adoc) {
  const bloecke = [...adoc.matchAll(/^@startuml[\s\S]*?^@enduml/gm)].map((m) => m[0]);
  return new Set(bloecke.flatMap((b) => [...b.matchAll(/^\s*(?:Person|Person_Ext|System_Ext)\(\s*(\w+)/gm)]
    .map((m) => m[1])));
}

test("aussenwelt findet Personen und Fremdsysteme, aber keine eigenen Systeme", () => {
  const probe = "@startuml\nPerson(kind, \"K\")\nSystem(eigen, \"E\")\n  System_Ext(yt, \"Y\")\n" +
    "Person_Ext(gast, \"G\")\n@enduml\nPerson(ausserhalb, \"kein Diagramm\")";
  assert.deepEqual([...aussenwelt(probe)].sort(), ["gast", "kind", "yt"]);
});

test("Kapitel 3 und 5 nennen dieselben Personen und Fremdsysteme", () => {
  const kontext = aussenwelt(fs.readFileSync(`${KAPITEL}/${datei("03_")}`, "utf8"));
  const bausteine = aussenwelt(fs.readFileSync(`${KAPITEL}/${datei("05_")}`, "utf8"));
  assert.ok(kontext.size > 0, "Kapitel 3 hat kein Kontextdiagramm");
  assert.deepEqual([...bausteine].sort(), [...kontext].sort());
});
