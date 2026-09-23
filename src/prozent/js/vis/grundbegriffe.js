/* Bild zu Grundbegriffe: das ganze Hunderterfeld ist der Grundwert, blau der Prozentwert. */
import { formatZahl } from "../../../kern/js/zahlen.js";
import { zeichneRaster } from "./diagramme.js";

export function zeichneGrundbegriffe(svg, aufgabe, ergebnis) {
  const zeigen = Boolean(ergebnis && ergebnis.korrekt);
  zeichneRaster(svg, aufgabe.prozentsatz, {
    titel: zeigen ? `G = ${formatZahl(aufgabe.grundwert)} ${aufgabe.einheit}, p = ${formatZahl(aufgabe.prozentsatz)} %` : "Das ganze Feld = Grundwert",
    untertitel: zeigen ? `W = ${formatZahl(aufgabe.prozentwert)} ${aufgabe.einheit}` : "blau = Prozentwert",
  });
}
