/*
 * Bild zu Kompetenz 1: die Ergebnismenge. zeichneLaplace (Beispielbild, Test): günstige Ergebnisse orange umrandet,
 * die übrigen gedimmt. zeichneLaplaceMarkierbar (Übung): alles neutral, das Kind markiert selbst; die Markierung liegt
 * in aufgabe.markiert und wird nicht geprüft. Richtig gelöst oder "Lösung zeigen": die richtige Markierung.
 * zeichneLaplaceNeutral (Testseite): nichts hervorgehoben, nichts anklickbar – die Markierung wäre die Antwort.
 */
import { gruppe, rahmen } from "./rahmen.js";
import { zeichneMengeIn, MENGEN_TITEL, platzFuer } from "./menge.js";

export function zeichneLaplace(svg, aufgabe) {
  const g = gruppe();
  const { breite, hoehe } = zeichneMengeIn(g, aufgabe.menge);
  rahmen(svg, breite, hoehe, `${MENGEN_TITEL[aufgabe.menge.art]}; orange umrandet: ${aufgabe.menge.ereignisName}`, g);
}

export function zeichneLaplaceNeutral(svg, aufgabe) {
  const g = gruppe();
  const { breite, hoehe } = zeichneMengeIn(g, aufgabe.menge, { neutral: true, maxBreite: platzFuer(svg) });
  rahmen(svg, breite, hoehe, MENGEN_TITEL[aufgabe.menge.art], g);
}

const RAND = 6; // Platz für Haken und Rahmen am Bildrand

/** Ergebnismenge zum Markieren; status(text) meldet den Zähler. Auch für Gegenereignis "einfach". */
export function zeichneMengeMarkierbar(svg, aufgabe, status, titel) {
  if (!aufgabe.markiert) aufgabe.markiert = new Set();
  const n = aufgabe.menge.elemente.length;
  const melde = () => status(`${aufgabe.markiert.size} von ${n} markiert`);
  const g = gruppe(RAND, RAND);
  const markierung = { markiert: aufgabe.markiert, geaendert: melde };
  const { breite, hoehe } = zeichneMengeIn(g, aufgabe.menge, { markierung, maxBreite: platzFuer(svg, RAND) });
  rahmen(svg, breite + 2 * RAND, hoehe + 2 * RAND, `${MENGEN_TITEL[aufgabe.menge.art]} – ${titel}`, g);
  svg.setAttribute("role", "group");
  melde();
}

export function zeichneLaplaceMarkierbar(svg, aufgabe, ergebnis, status = () => {}) {
  if (!ergebnis?.korrekt) {
    zeichneMengeMarkierbar(svg, aufgabe, status, `klick die Ergebnisse an, die zu „${aufgabe.menge.ereignisName}“ passen`);
    return;
  }
  const g = gruppe();
  const { breite, hoehe } = zeichneMengeIn(g, aufgabe.menge, { maxBreite: platzFuer(svg) });
  rahmen(svg, breite, hoehe, `${MENGEN_TITEL[aufgabe.menge.art]}; orange umrandet: ${aufgabe.menge.ereignisName}`, g);
  status(`Lösung: ${aufgabe.guenstig} von ${aufgabe.moeglich} Ergebnissen sind günstig`);
}
