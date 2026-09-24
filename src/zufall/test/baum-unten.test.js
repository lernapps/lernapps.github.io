// Use Case: Baum hochkant (richtung "unten") – Wurzel oben, Zweige nach unten, Text waagerecht. Experiment auf der
// Seite „Ohne Zurücklegen“: passt in 279 px, nichts überlappt, alle Blätter mit richtiger Pfadwahrscheinlichkeit.
import { test } from "node:test";
import assert from "node:assert/strict";
import { leeresSvg, svgEl } from "../../kern/js/svg.js";
import { erzeugeZufall } from "../../kern/js/zufall.js";
import { formatBruch } from "../../kern/js/bruch.js";
import { baueBaum, blaetter } from "../js/modell/baum.js";
import { urne } from "../js/modell/experimente.js";
import { zeichneBaumIn } from "../js/vis/baum.js";
import { zeichneOhneZuruecklegen } from "../js/vis/ohne-zuruecklegen.js";
import { URNEN_VORLAGEN } from "../js/aufgaben/gemeinsam.js";
import { alle, klasse, text, zahl, boxen, keineUeberlappung } from "./baum-boxen.js";
import * as ohne from "../js/aufgaben/ohne-zuruecklegen.js";

// Gemessen bei 360 px Viewport: „Bild dazu“ hat 313 px, das Übungsbild nur 279 px Platz (Rahmen der Übung).
const MAX_BREITE = 279;
const zeichne = (spec, mit, optionen = {}) => {
  const g = svgEl("g");
  const baum = baueBaum(urne(spec), 2, mit);
  const groesse = zeichneBaumIn(g, baum, { richtung: "unten", zeigePfad: true, ...optionen });
  return { g, baum, groesse };
};

for (const [spec, mit] of [["3r2b1g", true], ["3r2b1g", false], ["2r1b1n", true], ["5r3b", false]]) {
  test(`hochkant ${spec} ${mit ? "mit" : "ohne"} Zurücklegen: keine Box überlappt eine andere`, () => {
    const b = boxen(zeichne(spec, mit).g);
    assert.ok(b.length > 10);
    keineUeberlappung(assert, b);
  });
}

test("hochkant: Wurzel oben, jede Stufe tiefer, alle Boxen innerhalb der gemeldeten Größe", () => {
  const { g, groesse } = zeichne("3r2b1g", true);
  const knoten = alle(g, klasse("baum-knoten"));
  const stufe = (n) => knoten.filter(({ e }) => (e.getAttribute("data-knoten") || "").split("-").length === n + 1);
  const [stufe1, stufe2] = [stufe(1), stufe(2)];
  assert.equal(stufe1.length, 3);
  assert.equal(stufe2.length, 9);
  assert.ok(Math.max(...stufe1.map((k) => k.y)) < Math.min(...stufe2.map((k) => k.y)));
  for (const b of boxen(g)) assert.ok(b.x1 >= 0 && b.x2 <= groesse.breite && b.y1 >= 0 && b.y2 <= groesse.hoehe, `${b.t} außerhalb`);
});

test("hochkant ohne Zurücklegen 3r2b1g: 8 Blätter mit richtiger Pfadwahrscheinlichkeit, höchstens 279 px breit", () => {
  const { g, baum, groesse } = zeichne("3r2b1g", false);
  const erwartet = new Map(blaetter(baum).map((b) => [b.id, formatBruch(b.pfadWahrscheinlichkeit)]));
  const gezeigt = new Map(alle(g, klasse("baum-blatt")).map(({ e }) => [e.getAttribute("data-blatt"), text(alle(e, klasse("pfad-w"))[0].e)]));
  assert.equal(gezeigt.size, 8);
  assert.deepEqual(gezeigt, erwartet);
  assert.equal(gezeigt.get("w-r-b"), "1/5");
  assert.ok(groesse.breite <= MAX_BREITE, `Breite ${groesse.breite}`);
  assert.ok(zeichne("3r2b1g", true).groesse.breite <= MAX_BREITE);
});

test("hochkant: Farbe nie allein – Kürzel im Knoten und Legende mit vollem Namen, gelb und grün unterscheidbar", () => {
  const { g } = zeichne("1r1g1n", true);
  const kuerzel = alle(g, klasse("baum-knoten")).filter(({ e }) => (e.getAttribute("data-knoten") || "").split("-").length === 2).map(({ e }) => text(e.children[1]));
  assert.equal(new Set(kuerzel).size, 3, kuerzel.join(" "));
  const legende = alle(g, klasse("baum-legende")).map(({ e }) => text(e)).join(" ");
  for (const name of ["rot", "gelb", "grün"]) assert.match(legende, new RegExp(name));
});

test("hochkant: hervorgehobener Pfad orange über zwei Stufen", () => {
  const { g } = zeichne("3r2b1g", false, { hervorgehoben: new Set(["w-r-b"]) });
  assert.deepEqual(alle(g, klasse("hervor")).map(({ e }) => e.getAttribute("data-knoten")), ["w-r", "w-r-b"]);
});

test("Bild „Ohne Zurücklegen“ passt für jede Urnenvorlage in 279 px (Beispiel und Übung)", () => {
  for (const spec of URNEN_VORLAGEN) {
    const svg = leeresSvg();
    zeichneOhneZuruecklegen(svg, ohne.erzeugeAufgabe(erzeugeZufall(3), { urne: spec }), { korrekt: true });
    assert.ok(zahl(svg, "width") <= MAX_BREITE, `${spec}: ${svg.getAttribute("width")} px`);
  }
});
