/* Bild zu Kompetenz 1: die Ergebnismenge, günstige Ergebnisse orange umrandet, die übrigen gedimmt. */
import { gruppe, rahmen } from "./rahmen.js";
import { zeichneMengeIn, MENGEN_TITEL } from "./menge.js";

export function zeichneLaplace(svg, aufgabe) {
  const g = gruppe();
  const { breite, hoehe } = zeichneMengeIn(g, aufgabe.menge);
  rahmen(svg, breite, hoehe, `${MENGEN_TITEL[aufgabe.menge.art]}; orange umrandet: ${aufgabe.menge.ereignisName}`, g);
}
