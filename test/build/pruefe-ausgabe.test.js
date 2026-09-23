// Use Case: Architektur-Doku ausliefern (TD-22/23) – dieselbe Regel "keine fremden Ressourcen" gilt für jede
// gebaute Ausgabe, auch für die Doku aus docToolchain, die nicht durch Eleventy läuft.
import { test } from "node:test";
import assert from "node:assert/strict";
import { pruefeAusgabe } from "../../lib/pruefe-ausgabe.js";

const dateien = {
  "o/index.html": `<link rel="stylesheet" href="css/a.css"><a href="https://github.com/x">Quelle</a>`,
  "o/css/a.css": "body { color: red; }",
  "o/bild.png": "PNG",
};
const lies = (p) => dateien[p];

test("eine Ausgabe ohne fremde Ressourcen ist in Ordnung; Links sind erlaubt", () => {
  assert.deepEqual(pruefeAusgabe(Object.keys(dateien), lies), []);
});

test("fremde Skripte, Stylesheets, Bilder und CSS-Importe sind Fehler", () => {
  const schlecht = {
    ...dateien,
    "o/a.html": `<img src="https://kroki.io/plantuml/svg/xyz">`,
    "o/b.html": `<script src="//cdn.example.org/x.js"></script>`,
    "o/css/b.css": `@import url("https://fonts.googleapis.com/css?family=X");`,
  };
  const fehler = pruefeAusgabe(Object.keys(schlecht), (p) => schlecht[p]);
  assert.equal(fehler.length, 3);
  assert.match(fehler.join("\n"), /kroki\.io/);
});
