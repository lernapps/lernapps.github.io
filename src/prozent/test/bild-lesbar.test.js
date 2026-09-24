// Use Case: Bild zur Aufgabe – Balkenbilder sind auf dem Handy lesbar (L-013): Schrift ≥ 15 (≈ 14,5 px bei 360 px,
// so groß wie die Bildunterschrift), keine Beschriftung berührt eine andere, keine ragt aus dem Bild.
// Textbreite grob geschätzt: 0,6 · Schriftgröße je Zeichen.
import { test } from "node:test";
import assert from "node:assert/strict";
import { erzeugeZufall } from "../../kern/js/zufall.js";
import { leeresSvg } from "../../kern/js/svg.js";
import * as prozentsatz from "../js/aufgaben/prozentsatz.js";
import * as veraenderung from "../js/aufgaben/veraenderung.js";
import * as vergleich from "../js/aufgaben/vergleich.js";
import { zeichneProzentsatz } from "../js/vis/prozentsatz.js";
import { zeichneVeraenderung } from "../js/vis/veraenderung.js";
import { zeichneVergleich } from "../js/vis/vergleich.js";

/** Texte eines gezeichneten SVG als Boxen { t, x1, y1, x2, y2, groesse }. */
function textBoxen(svg) {
  return svg.children.filter((e) => e.tagName === "text").map((e) => {
    const groesse = Number(e.getAttribute("font-size"));
    const breite = e.textContent.length * groesse * 0.6;
    const x = Number(e.getAttribute("x"));
    const y = Number(e.getAttribute("y"));
    const anker = e.getAttribute("text-anchor");
    const x1 = anker === "middle" ? x - breite / 2 : anker === "end" ? x - breite : x;
    return { t: e.textContent, x1, x2: x1 + breite, y1: y - groesse * 0.8, y2: y + groesse * 0.2, groesse };
  });
}

function pruefeLesbar(svg, wo) {
  const breite = Number(svg.getAttribute("viewBox").split(" ")[2]);
  const boxen = textBoxen(svg).filter((b) => b.t !== "");
  for (const b of boxen) {
    assert.ok(b.groesse >= 15, `${wo}: „${b.t}“ mit Schriftgröße ${b.groesse}`);
    assert.ok(b.x1 >= 0 && b.x2 <= breite, `${wo}: „${b.t}“ ragt aus dem Bild (${b.x1}–${b.x2} von ${breite})`);
  }
  for (let i = 0; i < boxen.length; i++) for (let j = i + 1; j < boxen.length; j++) {
    const [s, t] = [boxen[i], boxen[j]];
    const ueber = s.x1 < t.x2 && t.x1 < s.x2 && s.y1 < t.y2 && t.y1 < s.y2;
    assert.ok(!ueber, `${wo}: „${s.t}“ berührt „${t.t}“`);
  }
}

const FAELLE = [["prozentsatz", prozentsatz, zeichneProzentsatz], ["veraenderung", veraenderung, zeichneVeraenderung], ["vergleich", vergleich, zeichneVergleich]];

test("L-013: Balkenbilder – Schrift groß genug, nichts überlappt, nichts ragt heraus (ungelöst und gelöst)", () => {
  for (const [name, modul, zeichne] of FAELLE) {
    for (let s = 1; s <= 200; s++) {
      const a = modul.erzeugeAufgabe(erzeugeZufall(s));
      for (const ergebnis of [undefined, { korrekt: true }]) {
        const svg = leeresSvg();
        zeichne(svg, a, ergebnis);
        pruefeLesbar(svg, `${name} Seed ${s}`);
      }
    }
  }
});

test("L-017: der Prozentwert im Prozentbalken trägt seine Einheit", () => {
  const svg = leeresSvg();
  zeichneProzentsatz(svg, { grundwert: 24, prozentwert: 18, prozentsatz: 75, einheit: "Schüler" }, { korrekt: true });
  const texte = textBoxen(svg).map((b) => b.t);
  assert.ok(texte.includes("18 Schüler = 75 %"), texte.join(" | "));
  assert.ok(texte.includes("100 % = 24 Schüler"), texte.join(" | "));
});
