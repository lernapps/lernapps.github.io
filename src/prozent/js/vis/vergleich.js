/* Bild zum Vergleich: Bezugsgröße (100 %) und Vergleichswert als Balken. */
import { formatZahl } from "../../../kern/js/zahlen.js";
import { bildWert } from "../aufgaben/gemeinsam.js";
import { zeichneBalken } from "./diagramme.js";

export function zeichneVergleich(svg, aufgabe, ergebnis) {
  const zeigen = Boolean(ergebnis && ergebnis.korrekt);
  const wort = aufgabe.wort ?? (aufgabe.frage === "groesser" ? "größer" : "kleiner");
  const richtung = aufgabe.frage === "groesser" ? "mehr" : "weniger";
  zeichneBalken(svg, [
    { label: "Bezugsgröße", wert: aufgabe.bezug, farbe: "#6b7280", text: `Bezugsgröße (100 %): ${bildWert(aufgabe.bezug, aufgabe.einheit)}` },
    { label: "Vergleichswert", wert: aufgabe.vergleich,
      text: `Vergleichswert ${bildWert(aufgabe.vergleich, aufgabe.einheit)} – ${zeigen ? formatZahl(aufgabe.prozentsatz) : "?"} % ${richtung}` },
  ], { einheit: aufgabe.einheit, titel: `Um wie viel Prozent ${wort}?` });
}
