// Use Case: Gegenereignis „mindestens einmal“ (L-040). Die Bäume stehen hochkant wie auf den anderen Baum-Seiten
// (ADR-024) und passen in 279 px: das Bild dazu (Würfel, 3 Würfe, „6 / keine 6“) und jede Übung. Dreistufige
// Übungen zeichnen den vereinfachten Baum „gelb / nicht gelb“ (zwei Zweige je Stufe, 8 Blätter) – das passt zum Trick
// der Seite. Kein Baum liegt quer, der Dreh-Hinweis wird hier nicht gebraucht.
import { test } from "node:test";
import assert from "node:assert/strict";
import { leeresSvg } from "../../kern/js/svg.js";
import { erzeugeZufall } from "../../kern/js/zufall.js";
import { formatBruch, subtrahiere, EINS } from "../../kern/js/bruch.js";
import { baueBaum, blaetter, ereignisWahrscheinlichkeit } from "../js/modell/baum.js";
import { urne } from "../js/modell/experimente.js";
import { parseEreignis } from "../js/modell/ereignis.js";
import { URNEN_VORLAGEN } from "../js/aufgaben/gemeinsam.js";
import * as gegen from "../js/aufgaben/gegenereignis.js";
import { zeichneGegenereignis, zeichneGegenereignisMarkierbar } from "../js/vis/gegenereignis.js";
import { alle, klasse, zahl, boxen, keineUeberlappung } from "./baum-boxen.js";

const MAX_BREITE = 279;

function hochkantUndPasst(zeichne, a, ergebnis, fall) {
  const svg = leeresSvg();
  zeichne(svg, a, ergebnis);
  assert.equal(alle(svg, klasse("baum-quer")).length, 0, `${fall}: Baum liegt quer`);
  assert.equal(alle(svg, klasse("baum-hochkant")).length, 1, `${fall}: kein Hochkant-Baum`);
  assert.ok(zahl(svg, "width") <= MAX_BREITE, `${fall}: ${svg.getAttribute("width")} px`);
  keineUeberlappung(assert, boxen(svg));
}

test("L-040: Bild dazu – Würfel, 3 Würfe, „6 / keine 6“ – hochkant in 279 px, mit Pfadwahrscheinlichkeiten", () => {
  const a = gegen.erzeugeAufgabe(erzeugeZufall(1), { experiment: "wuerfel", zuege: 3, ereignis: "mind1s" });
  assert.equal(blaetter(a.baum).length, 8);
  for (const ergebnis of [undefined, { korrekt: true }]) hochkantUndPasst(zeichneGegenereignis, a, ergebnis, `Würfel ${ergebnis ? "gelöst" : "offen"}`);
});

test("L-040: dreistufige Urnen-Aufgaben nutzen „Farbe / nicht Farbe“ (8 Blätter), die Lösung bleibt gleich", () => {
  for (const spec of URNEN_VORLAGEN) for (const modus of ["mit", "ohne"]) for (const farbe of urne(spec).ergebnisse) {
    const a = gegen.erzeugeAufgabe(erzeugeZufall(3), { urne: spec, zuege: 3, modus, ereignis: `mind1${farbe.id}` });
    const fall = `${spec} ${modus} mind1${farbe.id}`;
    assert.ok(blaetter(a.baum).length <= 8, `${fall}: ${blaetter(a.baum).length} Blätter`); // weniger, wenn eine Farbe ausgeht
    const namen = a.baum.experiment.ergebnisse.map((e) => e.name);
    // Zwei Farben bleiben, wie sie sind (blau ist schon „nicht rot“); ab drei Farben: „gelb / nicht gelb“.
    assert.deepEqual(namen, urne(spec).ergebnisse.length > 2 ? [farbe.name, `nicht ${farbe.name}`] : urne(spec).ergebnisse.map((e) => e.name), fall);
    assert.match(a.text, /In einer Urne liegen/, `${fall}: der Text nennt weiter die ganze Urne`);
    const voll = baueBaum(urne(spec), 3, modus === "mit");
    const richtig = subtrahiere(EINS, ereignisWahrscheinlichkeit(voll, parseEreignis(`kein${farbe.id}`, urne(spec), 3)));
    assert.equal(formatBruch(a.loesungBruch), formatBruch(richtig), fall);
    for (const ergebnis of [undefined, { korrekt: true }]) hochkantUndPasst(zeichneGegenereignisMarkierbar, a, ergebnis, fall);
  }
});

test("L-040: keine zufällige „mindestens“-Aufgabe (2 oder 3 Züge) zeichnet einen quer liegenden Baum", () => {
  let geprueft = 0;
  for (let s = 0; s < 400; s++) {
    const a = gegen.erzeugeAufgabe(erzeugeZufall(s), { art: "mindestens" });
    if (a.zuege > 3) continue;
    geprueft++;
    for (const ergebnis of [undefined, { korrekt: true }]) hochkantUndPasst(zeichneGegenereignisMarkierbar, a, ergebnis, `Seed ${s}`);
  }
  assert.ok(geprueft > 300);
});
