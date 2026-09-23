// Use Case: Kompetenzseite – die Erklärung steht vollständig im HTML, aufgeklappt; die Übung liegt außerhalb.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const layout = await readFile("src/_includes/kompetenz.njk", "utf8");

test("Warum, Regel, Beispiel, Video und Bild stehen in einem offenen <details id=\"erklaerung\">", () => {
  const start = layout.indexOf('<details id="erklaerung"');
  const ende = layout.indexOf("</details>");
  assert.ok(start > 0 && ende > start);
  assert.match(layout.slice(start, layout.indexOf(">", start)), /\sopen\b/);
  const innen = layout.slice(start, ende);
  for (const id of ["warum", "regel", "beispiel", "video", "visualisierung"]) assert.ok(innen.includes(`id="${id}"`), id);
  assert.ok(layout.indexOf('id="uebung"') > ende);
});
