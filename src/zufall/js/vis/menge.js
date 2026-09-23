/*
 * Ergebnismenge einer Laplace-Aufgabe: Würfelseiten, Kugeln, Glücksrad, Karten, Lose, zwei Würfel.
 * Günstige Ergebnisse sind orange umrandet, die übrigen gedimmt. zeichneMengeIn(g, menge) → { breite, hoehe }.
 */
import { svgEl } from "../../../kern/js/svg.js";
import { BETONT, gruppe, kugel, wuerfelSeite } from "./rahmen.js";

function wuerfel(g, menge) {
  menge.elemente.forEach((e, i) => g.append(wuerfelSeite(Number(e.label), 8 + i * 56, 8, 44, { betont: e.guenstig, gedimmt: !e.guenstig })));
  return { breite: 6 * 56 + 8, hoehe: 64 };
}

function kugeln(g, menge) {
  const proZeile = Math.min(menge.elemente.length, 8);
  menge.elemente.forEach((e, i) => g.append(kugel(24 + (i % proZeile) * 34, 24 + Math.floor(i / proZeile) * 34, 14, e.farbe, { betont: e.guenstig, gedimmt: !e.guenstig })));
  return { breite: proZeile * 34 + 14, hoehe: Math.ceil(menge.elemente.length / proZeile) * 34 + 14 };
}

function rad(g, menge) {
  const n = menge.elemente.length;
  const R = 70;
  menge.elemente.forEach((e, i) => {
    const a0 = (i / n) * 2 * Math.PI - Math.PI / 2;
    const a1 = ((i + 1) / n) * 2 * Math.PI - Math.PI / 2;
    const d = `M80 88 L${80 + R * Math.cos(a0)} ${88 + R * Math.sin(a0)} A${R} ${R} 0 0 1 ${80 + R * Math.cos(a1)} ${88 + R * Math.sin(a1)} Z`;
    g.append(svgEl("path", { d, fill: e.farbe, stroke: "#fff", "stroke-width": 2, opacity: e.guenstig ? 1 : 0.3 }));
    if (e.guenstig) g.append(svgEl("path", { d, fill: "none", stroke: BETONT, "stroke-width": 4 }));
  });
  g.append(svgEl("polygon", { points: "80,20 74,6 86,6", fill: "#1a1a1a" }));
  return { breite: 160, hoehe: 168 };
}

function raster(g, menge, spalten, breite, hoehe, farbeVon) {
  menge.elemente.forEach((e, i) => {
    const feld = gruppe(4 + (i % spalten) * (breite + 4), 4 + Math.floor(i / spalten) * (hoehe + 4), { opacity: e.guenstig ? undefined : 0.3 });
    feld.append(svgEl("rect", { width: breite, height: hoehe, rx: 4, fill: "#fff", stroke: e.guenstig ? BETONT : "#455a64", "stroke-width": e.guenstig ? 3 : 1 }));
    feld.append(svgEl("text", { x: breite / 2, y: hoehe / 2 + 4, "text-anchor": "middle", "font-size": 11, fill: farbeVon(e) }, e.label));
    g.append(feld);
  });
  return { breite: spalten * (breite + 4) + 4, hoehe: Math.ceil(menge.elemente.length / spalten) * (hoehe + 4) + 4 };
}

export const MENGEN_TITEL = {
  wuerfel: "Die sechs Seiten des Würfels", urne: "Die Kugeln in der Urne", gluecksrad: "Das Glücksrad mit seinen Feldern",
  karten: "Die 32 Karten", lose: "Alle Lose", zweiwuerfel: "Alle 36 Würfelpaare (rot|blau)",
};

export function zeichneMengeIn(g, menge) {
  if (menge.art === "wuerfel") return wuerfel(g, menge);
  if (menge.art === "urne") return kugeln(g, menge);
  if (menge.art === "gluecksrad") return rad(g, menge);
  if (menge.art === "karten") return raster(g, menge, 8, 36, 30, (e) => e.farbe);
  if (menge.art === "lose") return raster(g, menge, 10, 30, 24, () => "#1a1a1a");
  return raster(g, menge, 6, 40, 26, () => "#1a1a1a");
}
