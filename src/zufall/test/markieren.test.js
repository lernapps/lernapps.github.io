// Use Case: Laplace-Übung – im Bild zur Aufgabe markiert das Kind die günstigen Ergebnisse selbst; das Beispielbild bleibt markiert.
import { test } from "node:test";
import assert from "node:assert/strict";
import { leeresSvg, alsSvgText } from "../../kern/js/svg.js";
import { erzeugeZufall } from "../../kern/js/zufall.js";
import { zeichneLaplace, zeichneLaplaceMarkierbar } from "../js/vis/laplace.js";
import { BETONT } from "../js/vis/rahmen.js";
import * as laplace from "../js/aufgaben/laplace.js";

const urne = () => laplace.erzeugeAufgabe(erzeugeZufall(1), { experiment: "urne", urne: "3r2b1g", ereignis: "b" });
const knoepfe = (text) => text.match(/role="button"/g) || [];
const gedrueckt = (text) => text.match(/aria-pressed="true"/g) || [];

function zeichne(aufgabe, ergebnis) {
  const svg = leeresSvg();
  const status = [];
  zeichneLaplaceMarkierbar(svg, aufgabe, ergebnis, (t) => status.push(t));
  return { svg, text: alsSvgText(svg), status };
}

test("neutral: kein Ergebnis vorab orange umrandet oder gedimmt, jedes Ergebnis ist ein Knopf", () => {
  const { svg, text, status } = zeichne(urne());
  assert.equal(knoepfe(text).length, 6);
  assert.equal(gedrueckt(text).length, 0);
  assert.ok(!text.includes(BETONT), "keine Vorab-Markierung");
  assert.ok(!text.includes('opacity="0.3"'), "nichts gedimmt");
  assert.equal(svg.getAttribute("role"), "group");
  assert.deepEqual(status, ["0 von 6 markiert"]);
});

test("zugängliche Namen: Farbe und Nummer bei Kugeln, Farbe und Wert bei Karten", () => {
  const { text } = zeichne(urne());
  assert.match(text, /aria-label="blaue Kugel 2"/);
  assert.match(text, /aria-label="gelbe Kugel 1"/);
  const karten = zeichne(laplace.erzeugeAufgabe(erzeugeZufall(1), { experiment: "karten", ereignis: "bube" })).text;
  assert.match(karten, /aria-label="Herz Bube"/);
  assert.equal(knoepfe(karten).length, 32);
});

test("Markierung überlebt das Neuzeichnen nach Prüfen: aus aufgabe.markiert, mit Haken", () => {
  const a = urne();
  a.markiert = new Set([a.menge.elemente[3].id]);
  const { text, status } = zeichne(a, { korrekt: false });
  assert.equal(gedrueckt(text).length, 1);
  assert.match(text, /class="markier-haken"/);
  assert.deepEqual(status, ["1 von 6 markiert"]);
});

test("Lösung gezeigt oder richtig: die günstigen Ergebnisse sind markiert, nichts mehr anklickbar", () => {
  for (const ergebnis of [{ korrekt: true, loesungGezeigt: true }, { korrekt: true }]) {
    const { text, status } = zeichne(urne(), ergebnis);
    assert.equal(knoepfe(text).length, 0);
    assert.ok(text.includes(BETONT));
    assert.deepEqual(status, ["Lösung: 2 von 6 Ergebnissen sind günstig"]);
  }
});

test("das Beispielbild (zeichneLaplace) bleibt wie bisher markiert", () => {
  const svg = leeresSvg();
  zeichneLaplace(svg, urne());
  const text = alsSvgText(svg);
  assert.ok(text.includes(BETONT));
  assert.equal(knoepfe(text).length, 0);
});
