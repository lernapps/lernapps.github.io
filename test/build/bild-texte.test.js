// Use Case: Bild dazu – das statische Bild zeigt immer das Beispiel; seine Beschriftung spricht nicht von der Übung.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const apps = ["binom", "prozent", "zufall"];
const seiten = [];
for (const app of apps) {
  for (const datei of await readdir(path.join("src", app))) {
    if (datei.endsWith(".md")) seiten.push([`${app}/${datei}`, await readFile(path.join("src", app, datei), "utf8")]);
  }
}

test("keine Beispiel-Beschriftung verweist auf die Übung (dafür gibt es bild.uebung)", () => {
  const falsch = seiten.filter(([, text]) => /^\s+text:.*In der Übung/m.test(text)).map(([name]) => name);
  assert.deepEqual(falsch, []);
});

test("die Kompetenzseite zeichnet das Beispielbild nicht neu, die Übung bekommt ein eigenes Bild", async () => {
  const layout = await readFile("src/_includes/kompetenz.njk", "utf8");
  assert.doesNotMatch(layout, /getElementById\("vis"\)/);
  assert.match(layout, /zeichne:/);
});
