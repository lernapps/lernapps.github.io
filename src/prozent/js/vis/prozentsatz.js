/* Bild zum Prozentsatz: Prozentbalken bis p %; ungelöst ist der Balken leer und es steht "? %" – an der Skala ließe sich p sonst
 * ablesen (L-026). Der Teil trägt seine Einheit (L-017). */
import { formatZahl } from "../../../kern/js/zahlen.js";
import { bildWert } from "../aufgaben/gemeinsam.js";
import { zeichneProzentbalken } from "./diagramme.js";

export function zeichneProzentsatz(svg, aufgabe, ergebnis) {
  const zeigen = Boolean(ergebnis && ergebnis.korrekt);
  zeichneProzentbalken(svg, zeigen ? aufgabe.prozentsatz : 0, {
    links: "0 %",
    rechts: `100 % = ${bildWert(aufgabe.grundwert, aufgabe.einheit)}`,
    mitte: `${bildWert(aufgabe.prozentwert, aufgabe.wEinheit ?? aufgabe.einheit)} = ${zeigen ? formatZahl(aufgabe.prozentsatz) : "?"} %`,
  });
}
