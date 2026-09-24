/* Bild zu Sachaufgaben: ein Kästchen = 1 %; gelöst stehen 1 % und p % darunter. */
import { formatZahl, formatGenau, runde } from "../../../kern/js/zahlen.js";
import { bildWert, imDativ } from "../aufgaben/gemeinsam.js";
import { zeichneRaster } from "./diagramme.js";

export function zeichneSachaufgaben(svg, aufgabe, ergebnis) {
  const zeigen = Boolean(ergebnis && ergebnis.korrekt);
  const { grundwert, prozentsatz, prozentwert, einheit } = aufgabe;
  const eins = grundwert / 100;
  // 1 % ungerundet, wenn es keine glatten Cent sind (L-021).
  const einsText = runde(eins, 2) === eins ? bildWert(eins, einheit) : `${formatGenau(eins)} ${einheit}`.trim();
  zeichneRaster(svg, prozentsatz, {
    titel: `${formatZahl(prozentsatz)} % von ${bildWert(grundwert, imDativ(einheit))}`,
    untertitel: zeigen ? `1 % = ${einsText}, ${formatZahl(prozentsatz)} % = ${bildWert(prozentwert, einheit)}` : "ein Kästchen = 1 %",
  });
}
