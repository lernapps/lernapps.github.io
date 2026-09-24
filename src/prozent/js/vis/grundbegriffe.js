/* Bild zu Grundbegriffe: das ganze Hunderterfeld ist der Grundwert, blau der Prozentwert. */
import { formatZahl } from "../../../kern/js/zahlen.js";
import { bildWert } from "../aufgaben/gemeinsam.js";
import { zeichneRaster } from "./diagramme.js";

export function zeichneGrundbegriffe(svg, aufgabe, ergebnis) {
  const zeigen = Boolean(ergebnis && ergebnis.korrekt);
  zeichneRaster(svg, aufgabe.prozentsatz, {
    titel: zeigen ? `G = ${bildWert(aufgabe.grundwert, aufgabe.einheit)}, p = ${formatZahl(aufgabe.prozentsatz)} %` : "Das ganze Feld = Grundwert",
    untertitel: zeigen ? `W = ${bildWert(aufgabe.prozentwert, aufgabe.einheit)}` : "blau = Prozentwert",
  });
}

// Das Beispiel der Seite: „Ein Fahrrad kostet 250 €. Im Angebot gibt es 12 % Rabatt.“ (L-014)
const BEISPIEL = { grundwert: 250, prozentsatz: 12, prozentwert: 30, einheit: "€" };

/** Bild dazu: zeichnet immer das Beispiel der Seite (12 von 100 Kästchen), gelöst. Die Übung nutzt zeichneGrundbegriffe. */
export function zeichneGrundbegriffeBeispiel(svg) {
  zeichneGrundbegriffe(svg, BEISPIEL, { korrekt: true });
}
