// Use Case: Tutor-Deep-Link – öffnet der Link eine bestimmte Aufgabe, steht die Übung im Fokus, die Erklärung ist eingeklappt.
import { test } from "node:test";
import assert from "node:assert/strict";
import { aufgabeImFokus } from "../../src/kern/js/aufgabenlink.js";

test("ohne Aufgabennummer und ohne Aufgabenparameter bleibt die Seite wie sie ist", () => {
  assert.equal(aufgabeImFokus("", ""), false);
  assert.equal(aufgabeImFokus("?unbekannt=1", "", ["g"], ["art"]), false);
  assert.equal(aufgabeImFokus("?seed=abc", ""), false);
});

test("Aufgabennummer (seed oder nr) oder ein gültiger Aufgabenparameter ist ein Deep Link", () => {
  assert.equal(aufgabeImFokus("?seed=4", ""), true);
  assert.equal(aufgabeImFokus("?nr=12", "#uebung"), true);
  assert.equal(aufgabeImFokus("?g=250", "", ["g"]), true);
  assert.equal(aufgabeImFokus("?urne=3r2b1g", "#aufgabenbild", [], ["urne"]), true);
});

test("zeigt der Anker auf einen Teil der Erklärung, bleibt sie offen", () => {
  assert.equal(aufgabeImFokus("?seed=4", "#visualisierung"), false);
  assert.equal(aufgabeImFokus("?seed=4", "#regel"), false);
});
