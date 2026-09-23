// Use Case: Bilder – dieselbe Zeichnung beim Build (Mini-DOM) und im Browser; Baum: erst Linien, dann Knoten, dann Beschriftungen.
import { test } from "node:test";
import assert from "node:assert/strict";
import { leeresSvg, alsSvgText } from "../../kern/js/svg.js";
import { erzeugeZufall } from "../../kern/js/zufall.js";
import { zeichneBaumdiagramm } from "../js/vis/baumdiagramm.js";
import { zeichneLaplace } from "../js/vis/laplace.js";
import { zeichneGegenereignis } from "../js/vis/gegenereignis.js";
import { zeichneOhneZuruecklegen } from "../js/vis/ohne-zuruecklegen.js";
import { zeichnePfadregel2 } from "../js/vis/pfadregel-2.js";
import * as laplace from "../js/aufgaben/laplace.js";
import * as gegen from "../js/aufgaben/gegenereignis.js";
import * as baumA from "../js/aufgaben/baumdiagramm.js";
import * as ohne from "../js/aufgaben/ohne-zuruecklegen.js";
import * as p2 from "../js/aufgaben/pfadregel-2.js";

const z = (s) => erzeugeZufall(s);

test("Baum: Ebenen in der Reihenfolge Linien, Knoten, Beschriftungen", () => {
  const svg = leeresSvg();
  zeichneBaumdiagramm(svg, baumA.erzeugeAufgabe(z(5), { urne: "3r2b1g", zuege: 2, modus: "mit" }));
  const text = alsSvgText(svg);
  const linien = text.indexOf("baum-ebene-linien");
  const knoten = text.indexOf("baum-ebene-knoten");
  const labels = text.indexOf("baum-ebene-labels");
  assert.ok(linien > 0 && linien < knoten && knoten < labels, `${linien} ${knoten} ${labels}`);
  assert.match(text, /viewBox="0 0 \d+/);
});

test("Gelöst zeigt der Baum die versteckten Werte", () => {
  const a = baumA.erzeugeAufgabe(z(5), { urne: "3r2b1g", zuege: 2, modus: "mit" });
  const svg = leeresSvg();
  zeichneBaumdiagramm(svg, a, { korrekt: true });
  assert.match(alsSvgText(svg), new RegExp(`a\\) ${a.versteckt[0].anzahl}/${a.versteckt[0].gesamt}`));
});

test("Alle Bilder zeichnen ohne document", () => {
  const faelle = [
    [zeichneLaplace, laplace.erzeugeAufgabe(z(1), { experiment: "karten", ereignis: "herz" })],
    [zeichneLaplace, laplace.erzeugeAufgabe(z(1), { experiment: "gluecksrad", rad: "2r1b1g", ereignis: "r" })],
    [zeichneGegenereignis, gegen.erzeugeAufgabe(z(1), { p: 1 / 6 })],
    [zeichneGegenereignis, gegen.erzeugeAufgabe(z(1), { experiment: "wuerfel", ereignis: "sechs" })],
    [zeichneGegenereignis, gegen.erzeugeAufgabe(z(1), { experiment: "wuerfel", zuege: 3, ereignis: "mind1s" })],
    [zeichneOhneZuruecklegen, ohne.erzeugeAufgabe(z(1), { urne: "3r2b1g", erster: "r", zweiter: "b", art: "zweig" })],
    [zeichnePfadregel2, p2.erzeugeAufgabe(z(1), { art: "term" })],
  ];
  for (const [zeichne, aufgabe] of faelle) {
    const svg = leeresSvg();
    zeichne(svg, aufgabe);
    assert.ok(svg.children.length > 0, aufgabe.text);
    assert.ok(svg.getAttribute("aria-label"), aufgabe.text);
  }
});

test("Pfade anklicken: markierte Blätter kommen aus aufgabe.auswahl", () => {
  const a = p2.erzeugeAufgabe(z(1), { urne: "3r2b1g", zuege: 2, modus: "ohne", ereignis: "genau1r", art: "pfade" });
  a.auswahl = new Set([a.pfade[0].id]);
  const svg = leeresSvg();
  zeichnePfadregel2(svg, a);
  const text = alsSvgText(svg);
  assert.match(text, new RegExp(`data-blatt="${a.pfade[0].id}"[^>]*aria-pressed="true"`));
  assert.equal((text.match(/aria-pressed="true"/g) || []).length, 1);
});
