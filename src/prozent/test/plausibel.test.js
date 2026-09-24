// Use Case: Aufgaben erzeugen – Sachzahlen bleiben im Alltag plausibel (L-011): Rabatte 5–50 %, Preise je Ding,
// Körpergrößen 120–200 cm. Eine 2,66 m große Schwester oder eine Hose für 430 € nimmt der Aufgabe den Alltagsbezug.
import { test } from "node:test";
import assert from "node:assert/strict";
import { erzeugeZufall } from "../../kern/js/zufall.js";
import * as grundbegriffe from "../js/aufgaben/grundbegriffe.js";
import * as prozentwert from "../js/aufgaben/prozentwert.js";
import * as grundwert from "../js/aufgaben/grundwert.js";
import * as prozentsatz from "../js/aufgaben/prozentsatz.js";
import * as vergleich from "../js/aufgaben/vergleich.js";
import * as veraenderung from "../js/aufgaben/veraenderung.js";
import * as sachaufgaben from "../js/aufgaben/sachaufgaben.js";

const LAEUFE = 400;
const aufgaben = (modul, vorgaben = {}) => Array.from({ length: LAEUFE }, (_, i) => modul.erzeugeAufgabe(erzeugeZufall(i + 1), vorgaben));
const zwischen = (x, min, max) => x >= min && x <= max;

test("L-011: Rabatte liegen zwischen 5 und 50 %, Preise passen zum Ding", () => {
  const faelle = [
    ["prozentwert (Fahrrad)", aufgaben(prozentwert), 150, 1500],
    ["grundbegriffe (Fahrrad)", aufgaben(grundbegriffe), 150, 1500],
    ["prozentsatz (Jacke)", aufgaben(prozentsatz), 30, 300],
    ["grundwert (Roller)", aufgaben(grundwert), 50, 500],
    ["sachaufgaben (Skateboard)", aufgaben(sachaufgaben, { typ: "gleichung" }), 30, 300],
  ];
  for (const [name, liste, min, max] of faelle) {
    const preise = liste.filter((a) => a.kontext === "preis");
    assert.ok(preise.length > 20, `${name}: zu wenige Preisaufgaben`);
    for (const a of preise) {
      assert.ok(zwischen(a.prozentsatz, 5, 50), `${name}: ${a.prozentsatz} % Rabatt – ${a.text}`);
      assert.ok(zwischen(a.grundwert, min, max), `${name}: ${a.grundwert} € – ${a.text}`);
    }
  }
});

test("L-011: der Laptop im Dreisatz kostet mindestens 300 €", () => {
  for (const a of aufgaben(sachaufgaben, { typ: "dreisatz" }).filter((x) => x.kontext === "preis")) {
    assert.ok(zwischen(a.grundwert, 300, 1500), a.text);
  }
});

test("L-011: die Hose im Ausverkauf kostet 20–120 €, der Rabatt ist 5–50 %", () => {
  const hosen = aufgaben(veraenderung).filter((a) => a.kontext === "rabatt");
  assert.ok(hosen.length > 20);
  for (const a of hosen) {
    assert.ok(zwischen(a.prozentsatz, 5, 50), a.text);
    assert.ok(zwischen(a.alt, 20, 120) && zwischen(a.neu, 10, 120), a.text);
  }
});

test("L-011: im Vergleich liegen beide Werte im Bereich ihres Kontexts, Körpergrößen 120–200 cm", () => {
  const BEREICH = { groesse: [120, 200], laeden: [20, 500], punkte: [20, 200], schueler: [200, 1000] };
  for (const a of aufgaben(vergleich)) {
    const [min, max] = BEREICH[a.kontext];
    assert.ok(zwischen(a.a, min, max) && zwischen(a.b, min, max), `${a.kontext}: ${a.text}`);
  }
});
