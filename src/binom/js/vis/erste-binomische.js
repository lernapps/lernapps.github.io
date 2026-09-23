/*
 * Bild zur ersten binomischen Formel: Quadrat mit der Seite a + b, zerlegt in a², ab, ab und b².
 * Die zwei gleichen Streifen ab sind der Grund für das 2ab. Längen und Texte kommen aus der Aufgabe.
 */
import { zeichneProdukt } from "./flaechen.js";
import { alsAnzeige, gliedAnzeige, multipliziere } from "../aufgaben/terme.js";

export function zeichneErsteBinomische(svg, aufgabe, ergebnis) {
  const geloest = Boolean(ergebnis && ergebnis.korrekt);
  const seite = [aufgabe.u, aufgabe.v];
  zeichneProdukt(svg, {
    p: seite,
    q: seite,
    geloest,
    titel: `${aufgabe.aufgabeText} = ${geloest ? alsAnzeige(aufgabe.ergebnis) : "?"}`,
    untertitel: geloest
      ? `Zwei gleiche Streifen: 2 · ${gliedAnzeige(multipliziere([aufgabe.u], [aufgabe.v])[0])} = ${gliedAnzeige(aufgabe.mitte)}`
      : "Zwei gleiche Streifen a · b → 2ab",
  });
}
