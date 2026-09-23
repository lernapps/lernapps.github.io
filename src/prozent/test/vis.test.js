// Use Case: Bild ohne JavaScript – Hunderterfeld, Prozentbalken und Vergleichsbalken zeichnen im Mini-DOM (Build).
import { test } from "node:test";
import assert from "node:assert/strict";
import { leeresSvg, alsSvgText } from "../../kern/js/svg.js";
import { zeichneRaster, zeichneProzentbalken, zeichneBalken } from "../js/vis/diagramme.js";
import { zeichneProzentwert } from "../js/vis/prozentwert.js";
import { zeichneVeraenderung } from "../js/vis/veraenderung.js";

const zaehle = (text, muster) => (text.match(muster) || []).length;

test("Hunderterfeld: 100 Kästchen, halbe Kästchen bei 12,5 %, Titel als Text", () => {
  const svg = leeresSvg();
  zeichneRaster(svg, 12.5, { titel: "12,5 % von 80", untertitel: "= 10" });
  const t = alsSvgText(svg);
  assert.equal(zaehle(t, /<rect /g), 101);
  assert.equal(zaehle(t, /fill="#1d4ed8"/g), 13);
  assert.match(t, /12,5 % von 80/);
  assert.match(t, /role="img"/);
});

test("Prozentbalken und Balken zeichnen Beschriftungen; unbekannter Wert nur als Label", () => {
  const a = leeresSvg();
  zeichneProzentbalken(a, 40, { rechts: "100 % = 250 €", mitte: "100 = ? %" });
  assert.match(alsSvgText(a), /100 % = 250 €/);
  const b = leeresSvg();
  zeichneBalken(b, [{ label: "Alter Wert", wert: 80 }, { label: "Neuer Wert = ?", wert: undefined }], { einheit: "€", titel: "+ 25 %" });
  const t = alsSvgText(b);
  assert.match(t, /Alter Wert: 80 €/);
  assert.match(t, /Neuer Wert = \?/);
});

test("Bildfunktionen der Seiten: gelöst zeigt das Ergebnis, ungelöst nicht", () => {
  const aufgabe = { grundwert: 250, prozentsatz: 12, prozentwert: 30, einheit: "€" };
  const offen = leeresSvg();
  zeichneProzentwert(offen, aufgabe);
  assert.doesNotMatch(alsSvgText(offen), /= 30 €/);
  const geloest = leeresSvg();
  zeichneProzentwert(geloest, aufgabe, { korrekt: true });
  assert.match(alsSvgText(geloest), /= 30 €/);
  const v = leeresSvg();
  zeichneVeraenderung(v, { typ: "neu", alt: 80, neu: 100, prozentsatz: 25, richtung: "plus", einheit: "€" }, { korrekt: true });
  assert.match(alsSvgText(v), /Neuer Wert \(125 %\)/);
});
