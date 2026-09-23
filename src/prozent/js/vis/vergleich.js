/* Bild zum Vergleich: Bezugsgröße (100 %) und Vergleichswert als Balken. */
import { formatZahl } from "../../../kern/js/zahlen.js";
import { zeichneBalken } from "./diagramme.js";

export function zeichneVergleich(svg, aufgabe, ergebnis) {
  const zeigen = Boolean(ergebnis && ergebnis.korrekt);
  const wort = aufgabe.frage === "groesser" ? "größer" : "kleiner";
  zeichneBalken(svg, [
    { label: "Bezugsgröße (100 %)", wert: aufgabe.bezug, farbe: "#6b7280" },
    { label: `Vergleichswert: ${zeigen ? formatZahl(aufgabe.prozentsatz) : "?"} % ${wort}`, wert: aufgabe.vergleich },
  ], { einheit: aufgabe.einheit, titel: `Um wie viel Prozent ${wort}?` });
}
