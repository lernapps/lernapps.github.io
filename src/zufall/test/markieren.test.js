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

// --- schmale Bildschirme, Testseite, Gegenereignis ---
import { readFile } from "node:fs/promises";
import { zeichneGegenereignis, zeichneGegenereignisMarkierbar } from "../js/vis/gegenereignis.js";
import * as gegen from "../js/aufgaben/gegenereignis.js";

const breiteVon = (svg) => Number(svg.getAttribute("width"));

test("schmal (290 px Platz): alle Arten passen ohne waagerechtes Scrollen, alle Ergebnisse bleiben Knöpfe", () => {
  const faelle = [
    [{ experiment: "karten", ereignis: "bube" }, 32], [{ experiment: "lose", lose: 50, gewinne: 5 }, 50],
    [{ experiment: "wuerfel", ereignis: "gerade" }, 6], [{ experiment: "zweiwuerfel", ereignis: "pasch" }, 36],
    [{ experiment: "urne", urne: "4r3b2g" }, 9], [{ experiment: "gluecksrad", rad: "2r1b1g" }, 4],
  ];
  for (const [vorgaben, anzahl] of faelle) {
    const svg = leeresSvg();
    svg.parentNode = { clientWidth: 290 };
    zeichneLaplaceMarkierbar(svg, laplace.erzeugeAufgabe(erzeugeZufall(1), vorgaben), undefined, () => {});
    assert.ok(breiteVon(svg) <= 290, `${vorgaben.experiment}: ${breiteVon(svg)} px`);
    assert.equal(knoepfe(alsSvgText(svg)).length, anzahl, vorgaben.experiment);
  }
});

test("breit: Karten bleiben eine Zeile je Farbe (8 Spalten)", () => {
  const svg = leeresSvg();
  svg.parentNode = { clientWidth: 900 };
  zeichneLaplaceMarkierbar(svg, laplace.erzeugeAufgabe(erzeugeZufall(1), { experiment: "karten", ereignis: "bube" }), undefined, () => {});
  assert.ok(breiteVon(svg) > 290);
});

test("Testseite: Laplace- und einfache Gegenereignis-Aufgaben ohne Vorab-Markierung", () => {
  const faelle = [
    [laplace.zeichneBild, laplace.erzeugeAufgabe(erzeugeZufall(1), { experiment: "urne", urne: "3r2b1g", ereignis: "b" })],
    [gegen.zeichneBild, gegen.erzeugeAufgabe(erzeugeZufall(1), { art: "einfach", experiment: "wuerfel", ereignis: "sechs" })],
  ];
  for (const [zeichneTest, aufgabe] of faelle) {
    const svg = leeresSvg();
    zeichneTest(svg, aufgabe);
    const text = alsSvgText(svg);
    assert.ok(!text.includes(BETONT), aufgabe.text);
    assert.ok(!text.includes('opacity="0.3"'), aufgabe.text);
    assert.equal(knoepfe(text).length, 0);
  }
});

test("Gegenereignis einfach: das Kind markiert E selbst; Lösung zeigt E und nennt „nicht E“", () => {
  const a = gegen.erzeugeAufgabe(erzeugeZufall(1), { art: "einfach", experiment: "wuerfel", ereignis: "mind5" });
  const svg = leeresSvg();
  const status = [];
  zeichneGegenereignisMarkierbar(svg, a, undefined, (t) => status.push(t));
  const text = alsSvgText(svg);
  assert.equal(knoepfe(text).length, 6);
  assert.ok(!text.includes(BETONT));
  assert.deepEqual(status, ["0 von 6 markiert"]);
  const loesung = [];
  zeichneGegenereignisMarkierbar(leeresSvg(), a, { korrekt: true, loesungGezeigt: true }, (t) => loesung.push(t));
  assert.deepEqual(loesung, ["Lösung: E hat 2 von 6 Ergebnissen, „nicht E“ die übrigen 4"]);
});

test("Gegenereignis: andere Aufgabenarten zeichnen wie bisher, das Beispielbild bleibt statisch", async () => {
  const a = gegen.erzeugeAufgabe(erzeugeZufall(1), { experiment: "wuerfel", zuege: 3, ereignis: "mind1s" });
  const svg1 = leeresSvg();
  const svg2 = leeresSvg();
  zeichneGegenereignis(svg1, a);
  zeichneGegenereignisMarkierbar(svg2, a, undefined, () => {});
  assert.equal(alsSvgText(svg2), alsSvgText(svg1));
  const md = await readFile("src/zufall/gegenereignis.md", "utf8");
  assert.match(md, /funktion: zeichneGegenereignis\n/);
  assert.match(md, /uebungFunktion: zeichneGegenereignisMarkierbar/);
});
