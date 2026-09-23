/*
 * Bild zu "Zwei Klammern multiplizieren": Rechteck (m1·x ± n1) × (m2·x ± n2) in vier Teilflächen.
 * Vor der richtigen Antwort stehen in den Feldern die Produkte ("2x · x"), danach die Ergebnisse ("2x²").
 */
import { zeichneProdukt } from "./flaechen.js";
import { alsAnzeige } from "../aufgaben/terme.js";

export function zeichneKlammernMultiplizieren(svg, aufgabe, ergebnis) {
  const geloest = Boolean(ergebnis && ergebnis.korrekt);
  const minus = aufgabe.op1 === "minus" || aufgabe.op2 === "minus";
  zeichneProdukt(svg, {
    p: aufgabe.p,
    q: aufgabe.q,
    geloest,
    titel: `${aufgabe.aufgabeText} = ${geloest ? alsAnzeige(aufgabe.ergebnis) : "?"}`,
    untertitel: minus ? "Feld = Zeile mal Spalte, rot = abziehen" : "Feld = Zeile mal Spalte",
  });
}
