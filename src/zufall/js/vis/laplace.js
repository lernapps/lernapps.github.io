/*
 * Bild zu Kompetenz 1: die Ergebnismenge. zeichneLaplace (Beispielbild, Test): günstige Ergebnisse orange umrandet,
 * die übrigen gedimmt. zeichneLaplaceMarkierbar (Übung): alles neutral, das Kind markiert selbst; die Markierung liegt
 * in aufgabe.markiert und wird nicht geprüft. Richtig gelöst oder "Lösung zeigen": die richtige Markierung.
 */
import { gruppe, rahmen } from "./rahmen.js";
import { zeichneMengeIn, MENGEN_TITEL } from "./menge.js";

export function zeichneLaplace(svg, aufgabe) {
  const g = gruppe();
  const { breite, hoehe } = zeichneMengeIn(g, aufgabe.menge);
  rahmen(svg, breite, hoehe, `${MENGEN_TITEL[aufgabe.menge.art]}; orange umrandet: ${aufgabe.menge.ereignisName}`, g);
}

const RAND = 6; // Platz für Haken und Rahmen am Bildrand

export function zeichneLaplaceMarkierbar(svg, aufgabe, ergebnis, status = () => {}) {
  if (ergebnis?.korrekt) {
    zeichneLaplace(svg, aufgabe);
    status(`Lösung: ${aufgabe.guenstig} von ${aufgabe.moeglich} Ergebnissen sind günstig`);
    return;
  }
  if (!aufgabe.markiert) aufgabe.markiert = new Set();
  const melde = () => status(`${aufgabe.markiert.size} von ${aufgabe.moeglich} markiert`);
  const g = gruppe(RAND, RAND);
  const { breite, hoehe } = zeichneMengeIn(g, aufgabe.menge, { markiert: aufgabe.markiert, geaendert: melde });
  rahmen(svg, breite + 2 * RAND, hoehe + 2 * RAND, `${MENGEN_TITEL[aufgabe.menge.art]} – klick die Ergebnisse an, die zu „${aufgabe.menge.ereignisName}“ passen`, g);
  svg.setAttribute("role", "group");
  melde();
}
