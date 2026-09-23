/*
 * Ergebnismenge einer Laplace-Aufgabe: Würfelseiten, Kugeln, Glücksrad, Karten, Lose, zwei Würfel.
 * Ohne markierung: günstige Ergebnisse orange umrandet, die übrigen gedimmt (Beispielbild, Test).
 * Mit markierung { markiert: Set, geaendert() }: alle neutral, jedes Ergebnis ein Knopf (role=button, aria-pressed),
 * markiert = dunkelblauer Rahmen plus Haken (nicht nur Farbe). zeichneMengeIn(g, menge, markierung?) → { breite, hoehe }.
 */
import { svgEl } from "../../../kern/js/svg.js";
import { BETONT, gruppe, kugel, wuerfelSeite } from "./rahmen.js";

export const MARKIERT = "#1d4ed8";

function haken(x, y) {
  const h = svgEl("g", { class: "markier-haken", "aria-hidden": "true" });
  h.append(svgEl("circle", { cx: x, cy: y, r: 8, fill: MARKIERT, stroke: "#fff", "stroke-width": 1.5 }),
    svgEl("path", { d: `M${x - 4} ${y} l3 3 l5 -6`, fill: "none", stroke: "#fff", "stroke-width": 2 }));
  return h;
}

/**
 * Hüllt ein gezeichnetes Ergebnis in einen Knopf. neueForm() liefert die Rahmenform (rect/path) – zweimal: ein weißer
 * Saum darunter, damit der blaue Rahmen auch auf blauen Kugeln und Feldern sichtbar ist. punkt: Ort des Hakens.
 */
function knopf(e, knoten, neueForm, punkt, markierung) {
  const g = svgEl("g", { class: "markierbar", role: "button", tabindex: 0, "aria-label": e.name ?? e.label, "data-ergebnis": e.id });
  const saum = neueForm();
  saum.setAttribute("fill", "none");
  saum.setAttribute("stroke-width", 7);
  const form = neueForm();
  form.setAttribute("class", "markier-rahmen");
  form.setAttribute("fill", "transparent");
  form.setAttribute("stroke-width", 3);
  g.append(knoten, saum, form);
  let h;
  const setze = (an) => {
    g.setAttribute("aria-pressed", an ? "true" : "false");
    form.setAttribute("stroke", an ? MARKIERT : "none");
    saum.setAttribute("stroke", an ? "#fff" : "none");
    if (an && !h) { h = haken(...punkt); g.append(h); } else if (!an && h) { h.remove(); h = undefined; }
  };
  setze(markierung.markiert.has(e.id));
  const umschalten = () => {
    const an = !markierung.markiert.has(e.id);
    if (an) markierung.markiert.add(e.id); else markierung.markiert.delete(e.id);
    setze(an);
    markierung.geaendert();
  };
  g.addEventListener("click", umschalten);
  g.addEventListener("keydown", (ev) => { if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); umschalten(); } });
  return g;
}

/** Hängt ein Ergebnis an: als Knopf mit rechteckigem Rahmen (box) oder, ohne markierung, so wie gezeichnet. */
function setzeEin(g, e, knoten, box, markierung, rand = 3) {
  if (!markierung) { g.append(knoten); return; }
  const form = () => svgEl("rect", { x: box.x - rand, y: box.y - rand, width: box.w + 2 * rand, height: box.h + 2 * rand, rx: 6 });
  g.append(knopf(e, knoten, form, [box.x + box.w - 2, box.y + 2], markierung));
}

const hervor = (e, markierung) => (markierung ? { betont: false, gedimmt: false } : { betont: e.guenstig, gedimmt: !e.guenstig });

function wuerfel(g, menge, markierung) {
  menge.elemente.forEach((e, i) => setzeEin(g, e, wuerfelSeite(Number(e.label), 8 + i * 56, 8, 44, hervor(e, markierung)), { x: 8 + i * 56, y: 8, w: 44, h: 44 }, markierung));
  return { breite: 6 * 56 + 8, hoehe: 64 };
}

function kugeln(g, menge, markierung) {
  const proZeile = Math.min(menge.elemente.length, 8);
  menge.elemente.forEach((e, i) => {
    const cx = 24 + (i % proZeile) * 34;
    const cy = 24 + Math.floor(i / proZeile) * 34;
    setzeEin(g, e, kugel(cx, cy, 14, e.farbe, hervor(e, markierung)), { x: cx - 14, y: cy - 14, w: 28, h: 28 }, markierung);
  });
  return { breite: proZeile * 34 + 14, hoehe: Math.ceil(menge.elemente.length / proZeile) * 34 + 14 };
}

function rad(g, menge, markierung) {
  const n = menge.elemente.length;
  const R = 70;
  menge.elemente.forEach((e, i) => {
    const a0 = (i / n) * 2 * Math.PI - Math.PI / 2;
    const a1 = ((i + 1) / n) * 2 * Math.PI - Math.PI / 2;
    const d = `M80 88 L${80 + R * Math.cos(a0)} ${88 + R * Math.sin(a0)} A${R} ${R} 0 0 1 ${80 + R * Math.cos(a1)} ${88 + R * Math.sin(a1)} Z`;
    const feld = svgEl("path", { d, fill: e.farbe, stroke: "#fff", "stroke-width": 2, opacity: markierung || e.guenstig ? 1 : 0.3 });
    if (markierung) {
      const mitte = (a0 + a1) / 2;
      g.append(knopf(e, feld, () => svgEl("path", { d }), [80 + 0.6 * R * Math.cos(mitte), 88 + 0.6 * R * Math.sin(mitte)], markierung));
      return;
    }
    g.append(feld);
    if (e.guenstig) g.append(svgEl("path", { d, fill: "none", stroke: BETONT, "stroke-width": 4 }));
  });
  g.append(svgEl("polygon", { points: "80,20 74,6 86,6", fill: "#1a1a1a" }));
  return { breite: 160, hoehe: 168 };
}

function raster(g, menge, spalten, breite, hoehe, farbeVon, markierung) {
  menge.elemente.forEach((e, i) => {
    const x = 4 + (i % spalten) * (breite + 4);
    const y = 4 + Math.floor(i / spalten) * (hoehe + 4);
    const betont = !markierung && e.guenstig;
    const feld = gruppe(x, y, { opacity: markierung || e.guenstig ? undefined : 0.3 });
    feld.append(svgEl("rect", { width: breite, height: hoehe, rx: 4, fill: "#fff", stroke: betont ? BETONT : "#455a64", "stroke-width": betont ? 3 : 1 }));
    feld.append(svgEl("text", { x: breite / 2, y: hoehe / 2 + 4, "text-anchor": "middle", "font-size": 11, fill: farbeVon(e) }, e.label));
    setzeEin(g, e, feld, { x, y, w: breite, h: hoehe }, markierung, 2);
  });
  return { breite: spalten * (breite + 4) + 4, hoehe: Math.ceil(menge.elemente.length / spalten) * (hoehe + 4) + 4 };
}

export const MENGEN_TITEL = {
  wuerfel: "Die sechs Seiten des Würfels", urne: "Die Kugeln in der Urne", gluecksrad: "Das Glücksrad mit seinen Feldern",
  karten: "Die 32 Karten", lose: "Alle Lose", zweiwuerfel: "Alle 36 Würfelpaare (rot|blau)",
};

export function zeichneMengeIn(g, menge, markierung) {
  if (menge.art === "wuerfel") return wuerfel(g, menge, markierung);
  if (menge.art === "urne") return kugeln(g, menge, markierung);
  if (menge.art === "gluecksrad") return rad(g, menge, markierung);
  if (menge.art === "karten") return raster(g, menge, 8, 36, 30, (e) => e.farbe, markierung);
  if (menge.art === "lose") return raster(g, menge, 10, 30, 24, () => "#1a1a1a", markierung);
  return raster(g, menge, 6, 40, 26, () => "#1a1a1a", markierung);
}
