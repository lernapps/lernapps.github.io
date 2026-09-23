// Use Case: KI-Tutor verlinkt Aufgaben – die URL-Parameter der alten App bleiben öffentlicher Vertrag (llms.txt).
import { test } from "node:test";
import assert from "node:assert/strict";
import * as grundbegriffe from "../js/aufgaben/grundbegriffe.js";
import * as prozentsatz from "../js/aufgaben/prozentsatz.js";
import * as prozentwert from "../js/aufgaben/prozentwert.js";
import * as grundwert from "../js/aufgaben/grundwert.js";
import * as veraenderung from "../js/aufgaben/veraenderung.js";
import * as vergleich from "../js/aufgaben/vergleich.js";
import * as sachaufgaben from "../js/aufgaben/sachaufgaben.js";

const VERTRAG = [
  [grundbegriffe, "grundbegriffe", [], ["gesucht"]],
  [prozentsatz, "prozentsatz", ["g", "w"], []],
  [prozentwert, "prozentwert", ["g", "p"], []],
  [grundwert, "grundwert", ["w", "p"], []],
  [veraenderung, "veraenderung", ["alt", "neu", "p"], ["richtung", "typ"]],
  [vergleich, "vergleich", ["a", "b"], ["frage"]],
  [sachaufgaben, "sachaufgaben", ["g", "p"], ["typ", "gesucht"]],
];

for (const [modul, id, zahlen, texte] of VERTRAG) {
  test(`${id}: URL_ZAHLEN und URL_TEXTE wie in der alten App`, () => {
    assert.deepEqual(modul.URL_ZAHLEN ?? [], zahlen);
    assert.deepEqual(modul.URL_TEXTE ?? [], texte);
    assert.equal(modul.THEMA, id);
  });
}
