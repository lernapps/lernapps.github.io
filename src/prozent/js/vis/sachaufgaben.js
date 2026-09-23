/* Bild zu Sachaufgaben: ein Kästchen = 1 %; gelöst stehen 1 % und p % darunter. */
import { formatZahl } from "../../../kern/js/zahlen.js";
import { zeichneRaster } from "./diagramme.js";

export function zeichneSachaufgaben(svg, aufgabe, ergebnis) {
  const zeigen = Boolean(ergebnis && ergebnis.korrekt);
  const { grundwert, prozentsatz, prozentwert, einheit } = aufgabe;
  zeichneRaster(svg, prozentsatz, {
    titel: `${formatZahl(prozentsatz)} % von ${formatZahl(grundwert)} ${einheit}`.trim(),
    untertitel: zeigen ? `1 % = ${formatZahl(grundwert / 100)} ${einheit}, ${formatZahl(prozentsatz)} % = ${formatZahl(prozentwert)} ${einheit}` : "ein Kästchen = 1 %",
  });
}
