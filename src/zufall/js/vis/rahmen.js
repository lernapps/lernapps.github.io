/*
 * Gemeinsame Bausteine der Zufall-Bilder: Rahmen (viewBox, natürliche Größe, aria-label), Gruppe mit Versatz, Kugel,
 * Würfelseite, Textfarbe. Nur svgEl aus dem Kern – kein document; läuft beim Build (Mini-DOM) und im Browser.
 */
import { svgEl } from "../../../kern/js/svg.js";

export const BETONT = "#ff8f00";

/** Leert das svg und setzt Größe und Beschreibung; die Bilder behalten ihre natürliche Größe (zufall.css scrollt). */
export function rahmen(svg, breite, hoehe, titel, ...kinder) {
  svg.replaceChildren();
  svg.setAttribute("viewBox", `0 0 ${Math.ceil(breite)} ${Math.ceil(hoehe)}`);
  svg.setAttribute("width", String(Math.ceil(breite)));
  svg.setAttribute("height", String(Math.ceil(hoehe)));
  svg.setAttribute("role", "img");
  svg.setAttribute("aria-label", titel);
  svg.append(svgEl("title", {}, titel), ...kinder);
  return svg;
}

/** Gruppe, um x/y verschoben. */
export const gruppe = (x = 0, y = 0, attrs = {}) => svgEl("g", { transform: `translate(${x} ${y})`, ...attrs });

export function textFarbe(hex) {
  if (!hex || !/^#[0-9a-f]{6}$/i.test(hex)) return "#fff";
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  return (r * 299 + g * 587 + b * 114) / 1000 > 150 ? "#1a1a1a" : "#fff";
}

export function kugel(cx, cy, r, farbe, optionen = {}) {
  const g = svgEl("g", { opacity: optionen.gedimmt ? 0.3 : undefined });
  const hell = farbe === "#fafafa";
  g.append(svgEl("circle", { cx, cy, r, fill: farbe, stroke: optionen.betont ? BETONT : hell ? "#455a64" : "rgba(0,0,0,.35)", "stroke-width": optionen.betont ? 4 : 1.5 }));
  if (optionen.label) g.append(svgEl("text", { x: cx, y: cy + 4, "text-anchor": "middle", "font-size": 11, fill: hell ? "#1a1a1a" : "#fff" }, optionen.label));
  return g;
}

const AUGEN = { 1: [[1, 1]], 2: [[0, 0], [2, 2]], 3: [[0, 0], [1, 1], [2, 2]], 4: [[0, 0], [0, 2], [2, 0], [2, 2]], 5: [[0, 0], [0, 2], [1, 1], [2, 0], [2, 2]], 6: [[0, 0], [0, 1], [0, 2], [2, 0], [2, 1], [2, 2]] };

export function wuerfelSeite(zahl, x, y, groesse = 44, optionen = {}) {
  const g = gruppe(x, y, { opacity: optionen.gedimmt ? 0.3 : undefined });
  g.append(svgEl("rect", { width: groesse, height: groesse, rx: 8, fill: "#fff", stroke: optionen.betont ? BETONT : "#455a64", "stroke-width": optionen.betont ? 4 : 1.5 }));
  const schritt = groesse / 4;
  for (const [r, c] of AUGEN[zahl]) g.append(svgEl("circle", { cx: schritt + c * schritt, cy: schritt + r * schritt, r: groesse / 11, fill: "#1a1a1a" }));
  return g;
}
