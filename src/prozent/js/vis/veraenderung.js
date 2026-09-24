/* Bild zur Zu- und Abnahme: alter Wert (100 %) und neuer Wert als Balken; der gesuchte bleibt bis zur Lösung offen. */
import { formatZahl } from "../../../kern/js/zahlen.js";
import { bildWert } from "../aufgaben/gemeinsam.js";
import { zeichneBalken } from "./diagramme.js";

// Bei Preisen heißt der Balken „Preis“, sonst „Wert“ (L-022).
const PREISE = ["ticket", "rabatt", "mwst"];

export function zeichneVeraenderung(svg, aufgabe, ergebnis) {
  const zeigen = Boolean(ergebnis && ergebnis.korrekt);
  const gesuchtNeu = aufgabe.typ === "neu";
  const plus = aufgabe.richtung === "plus";
  const faktor = plus ? 100 + aufgabe.prozentsatz : 100 - aufgabe.prozentsatz;
  const wort = PREISE.includes(aufgabe.kontext) ? "Preis" : "Wert";
  const altBekannt = gesuchtNeu || zeigen;
  const neuBekannt = !gesuchtNeu || zeigen;
  zeichneBalken(svg, [
    { label: `Alter ${wort}`, wert: altBekannt ? aufgabe.alt : undefined, farbe: "#6b7280",
      text: `Alter ${wort} (100 %): ${altBekannt ? bildWert(aufgabe.alt, aufgabe.einheit) : "?"}` },
    { label: `Neuer ${wort}`, wert: neuBekannt ? aufgabe.neu : undefined,
      text: neuBekannt ? `Neuer ${wort} (${formatZahl(faktor)} %): ${bildWert(aufgabe.neu, aufgabe.einheit)}` : `Neuer ${wort}: ?` },
  ], { einheit: aufgabe.einheit, titel: `${plus ? "+" : "−"} ${formatZahl(aufgabe.prozentsatz)} %` });
}
