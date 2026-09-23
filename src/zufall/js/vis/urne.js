/*
 * Urne mit farbigen Kugeln. zeichneUrneIn(g, exp, { entfernt, beschriftung }) → { breite, hoehe };
 * entfernt: Ergebnis-Id, von der eine Kugel als "gezogen" neben der Urne liegt.
 */
import { svgEl } from "../../../kern/js/svg.js";
import { elementarErgebnisse } from "../modell/experimente.js";
import { kugel } from "./rahmen.js";

export function zeichneUrneIn(g, exp, optionen = {}) {
  const kugeln = elementarErgebnisse(exp);
  const proZeile = Math.max(3, Math.ceil(Math.sqrt(kugeln.length)));
  const r = 13;
  const abstand = r * 2 + 4;
  const innenBreite = proZeile * abstand + 10;
  const oben = optionen.beschriftung ? 22 : 8;
  const hoehe = oben + Math.ceil(kugeln.length / proZeile) * abstand + 16;
  const extra = optionen.entfernt ? 70 : 0;
  const textBreite = optionen.beschriftung ? optionen.beschriftung.length * 6.5 + 20 : 0;
  g.append(svgEl("path", { d: `M10 ${oben} L10 ${hoehe - 8} Q10 ${hoehe - 2} 16 ${hoehe - 2} L${innenBreite + 4} ${hoehe - 2} Q${innenBreite + 10} ${hoehe - 2} ${innenBreite + 10} ${hoehe - 8} L${innenBreite + 10} ${oben}`, fill: "#eceff1", stroke: "#455a64", "stroke-width": 2 }));
  kugeln.forEach((k, i) => g.append(kugel(15 + r + (i % proZeile) * abstand, hoehe - 10 - r - Math.floor(i / proZeile) * abstand, r, k.farbe)));
  if (optionen.entfernt) {
    const e = exp.ergebnisse.find((x) => x.id === optionen.entfernt) || { farbe: "#999" };
    const cx = innenBreite + 50;
    g.append(svgEl("path", { d: `M${innenBreite + 14} ${oben + 20} L${cx - 16} ${oben + 20}`, stroke: "#455a64", "stroke-width": 2 }));
    g.append(kugel(cx, oben + 20, r, e.farbe, { betont: true }));
    g.append(svgEl("text", { x: cx, y: oben + 52, "text-anchor": "middle", "font-size": 11, fill: "#1a1a1a" }, "gezogen"));
  }
  if (optionen.beschriftung) g.append(svgEl("text", { x: 10, y: 14, "font-size": 12, fill: "#1a1a1a", "font-weight": 600 }, optionen.beschriftung));
  return { breite: Math.max(innenBreite + 20 + extra, textBreite), hoehe };
}
