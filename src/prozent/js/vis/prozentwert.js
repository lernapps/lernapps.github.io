/* Bild zum Prozentwert: p von 100 Kästchen; gelöst steht der Prozentwert darunter. */
import { formatZahl } from "../../../kern/js/zahlen.js";
import { bildWert, imDativ } from "../aufgaben/gemeinsam.js";
import { zeichneRaster } from "./diagramme.js";

export function zeichneProzentwert(svg, aufgabe, ergebnis) {
  const zeigen = Boolean(ergebnis && ergebnis.korrekt);
  zeichneRaster(svg, aufgabe.prozentsatz, {
    titel: `${formatZahl(aufgabe.prozentsatz)} % von ${bildWert(aufgabe.grundwert, imDativ(aufgabe.einheit))}`,
    untertitel: zeigen ? `= ${bildWert(aufgabe.prozentwert, aufgabe.wEinheit ?? aufgabe.einheit)}` : "100 Kästchen = Grundwert",
  });
}
