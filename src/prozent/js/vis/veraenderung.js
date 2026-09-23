/* Bild zur Zu- und Abnahme: alter Wert (100 %) und neuer Wert als Balken; der gesuchte bleibt bis zur Lösung offen. */
import { formatZahl } from "../../../kern/js/zahlen.js";
import { zeichneBalken } from "./diagramme.js";

export function zeichneVeraenderung(svg, aufgabe, ergebnis) {
  const zeigen = Boolean(ergebnis && ergebnis.korrekt);
  const gesuchtNeu = aufgabe.typ === "neu";
  const plus = aufgabe.richtung === "plus";
  const faktor = plus ? 100 + aufgabe.prozentsatz : 100 - aufgabe.prozentsatz;
  zeichneBalken(svg, [
    { label: gesuchtNeu || zeigen ? "Alter Wert (100 %)" : "Alter Wert (100 %) = ?", wert: gesuchtNeu || zeigen ? aufgabe.alt : undefined, farbe: "#6b7280" },
    { label: !gesuchtNeu || zeigen ? `Neuer Wert (${formatZahl(faktor)} %)` : "Neuer Wert = ?", wert: !gesuchtNeu || zeigen ? aufgabe.neu : undefined },
  ], { einheit: aufgabe.einheit, titel: `${plus ? "+" : "−"} ${formatZahl(aufgabe.prozentsatz)} %` });
}
