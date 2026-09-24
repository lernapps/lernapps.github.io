// Use Case: Bild „Ohne Zurücklegen“ – Urne vorher (6) und nachher (5), zwei vollständige Bäume untereinander,
// der Pfad erster→zweiter in beiden orange; keine Beschriftung überdeckt einen Knoten.
import { test } from "node:test";
import assert from "node:assert/strict";
import { leeresSvg, alsSvgText } from "../../kern/js/svg.js";
import { erzeugeZufall } from "../../kern/js/zufall.js";
import { zeichneOhneZuruecklegen } from "../js/vis/ohne-zuruecklegen.js";
import * as ohne from "../js/aufgaben/ohne-zuruecklegen.js";

const bild = () => {
  const svg = leeresSvg();
  zeichneOhneZuruecklegen(svg, ohne.erzeugeAufgabe(erzeugeZufall(1), { urne: "3r2b1g", erster: "r", zweiter: "b", art: "pfad" }), { korrekt: true });
  return svg;
};
const verschiebung = (g) => (g.getAttribute("transform") || "translate(0 0)").match(/translate\(([-\d.]+) ([-\d.]+)\)/).slice(1).map(Number);
const alle = (e, test, x = 0, y = 0, out = []) => {
  const [dx, dy] = e.getAttribute && e.tagName === "g" ? verschiebung(e) : [0, 0];
  if (test(e)) out.push({ e, x: x + dx, y: y + dy });
  for (const c of e.children || []) alle(c, test, x + dx, y + dy, out);
  return out;
};
const text = (e) => e.childNodes[0].textContent; // ohne <title>

test("Baum ohne Zurücklegen: zweite Stufe mit Nenner 5 und Pfadwahrscheinlichkeiten an allen Blättern", () => {
  const svg = bild();
  const [, ohneBaum] = alle(svg, (e) => e.tagName === "g" && e.getAttribute("class") === "baum");
  assert.ok(ohneBaum, "zwei Baum-Gruppen");
  const labels = alle(ohneBaum.e, (e) => e.getAttribute?.("class") === "baum-label").map((l) => text(l.e));
  // gelb, dann gelb gibt es ohne Zurücklegen nicht (nur 1 gelbe Kugel): 8 Zweige mit Nenner 5.
  assert.equal(labels.filter((l) => /\/5$/.test(l)).length, 8, labels.join(" "));
  assert.equal(alle(ohneBaum.e, (e) => e.getAttribute?.("class") === "pfad-w").length, 8);
  assert.match(alsSvgText(ohneBaum.e), /= 1\/5</); // rot, dann blau: 3/6 · 2/5 = 1/5
});

test("die Bäume stehen untereinander, jeder mit orangem Pfad über zwei Stufen", () => {
  const baeume = alle(bild(), (e) => e.tagName === "g" && e.getAttribute("class") === "baum");
  assert.equal(baeume.length, 2);
  assert.equal(baeume[0].x, baeume[1].x);
  assert.ok(baeume[1].y > baeume[0].y);
  for (const b of baeume) assert.equal(alle(b.e, (e) => e.getAttribute?.("class") === "baum-zweig hervor").length, 2);
});

test("Urne vorher 6 Kugeln, Urne nachher 5 Kugeln; die gezogene liegt außerhalb", () => {
  const urnen = alle(bild(), (e) => e.tagName === "g" && /^(urne|gezogen)/.test(e.getAttribute("class") || ""));
  const kugeln = (u) => alle(u.e, (e) => e.tagName === "circle" && e.getAttribute("r") === "13").length;
  assert.deepEqual(urnen.map((u) => u.e.getAttribute("class")), ["urne-vorher", "gezogen", "urne-nachher"]);
  assert.deepEqual(urnen.map(kugeln), [6, 1, 5]);
});

test("keine Beschriftung überlappt einen Knoten (Bounding-Box, Textbreite 0,6 · Schriftgröße je Zeichen)", () => {
  const svg = bild();
  const knoten = alle(svg, (e) => e.getAttribute?.("class") === "baum-knoten").map(({ e, x, y }) => {
    const r = e.children[0];
    return r.tagName === "rect"
      ? { x1: x + Number(r.getAttribute("x")), y1: y - 11, x2: x + Number(r.getAttribute("x")) + Number(r.getAttribute("width")), y2: y + 11 }
      : { x1: x - 12, y1: y - 12, x2: x + 12, y2: y + 12 };
  });
  const texte = alle(svg, (e) => ["pfad-w", "baum-label"].includes(e.getAttribute?.("class"))).map(({ e, x, y }) => {
    const tx = x + Number(e.getAttribute("x"));
    const ty = y + Number(e.getAttribute("y"));
    const breite = text(e).length * 13 * 0.6;
    const x1 = e.getAttribute("text-anchor") === "middle" ? tx - breite / 2 : tx;
    return { t: text(e), x1, y1: ty - 10, x2: x1 + breite, y2: ty + 2 };
  });
  assert.ok(texte.length > 30 && knoten.length > 20);
  for (const t of texte) for (const k of knoten) {
    const ueber = t.x1 < k.x2 && k.x1 < t.x2 && t.y1 < k.y2 && k.y1 < t.y2;
    assert.ok(!ueber, `„${t.t}“ überlappt Knoten bei ${Math.round(k.x1)},${Math.round(k.y1)}`);
  }
});
