/* Bild zum Prozentwert: p von 100 Kästchen; gelöst steht der Prozentwert darunter. */
import { formatZahl } from "../../../kern/js/zahlen.js";
import { zeichneRaster } from "./diagramme.js";

export function zeichneProzentwert(svg, aufgabe, ergebnis) {
  const zeigen = Boolean(ergebnis && ergebnis.korrekt);
  zeichneRaster(svg, aufgabe.prozentsatz, {
    titel: `${formatZahl(aufgabe.prozentsatz)} % von ${formatZahl(aufgabe.grundwert)} ${aufgabe.einheit}`.trim(),
    untertitel: zeigen ? `= ${formatZahl(aufgabe.prozentwert)} ${aufgabe.einheit}`.trim() : "100 Kästchen = Grundwert",
  });
}
