/* Bild zum Prozentsatz: Prozentbalken bis p %; ungelöst steht "? %". */
import { formatZahl } from "../../../kern/js/zahlen.js";
import { zeichneProzentbalken } from "./diagramme.js";

export function zeichneProzentsatz(svg, aufgabe, ergebnis) {
  const zeigen = Boolean(ergebnis && ergebnis.korrekt);
  zeichneProzentbalken(svg, aufgabe.prozentsatz, {
    links: "0 %",
    rechts: `100 % = ${formatZahl(aufgabe.grundwert)} ${aufgabe.einheit}`.trim(),
    mitte: `${formatZahl(aufgabe.prozentwert)} = ${zeigen ? formatZahl(aufgabe.prozentsatz) : "?"} %`,
  });
}
