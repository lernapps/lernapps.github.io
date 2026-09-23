/*
 * Bild zur zweiten binomischen Formel: Vom Quadrat a² werden zwei Streifen a·b abgezogen (rot). Die Ecke b² steckt
 * in beiden Streifen, ist also doppelt abgezogen – deshalb kommt + b² einmal zurück. Übrig bleibt das Quadrat (a − b)².
 */
import { zeichneQuadratMinus, laengeVon } from "./flaechen.js";
import { alsAnzeige, gliedAnzeige } from "../aufgaben/terme.js";
import { quadratAnzeige } from "../aufgaben/binom.js";

export function zeichneZweiteBinomische(svg, aufgabe, ergebnis) {
  const geloest = Boolean(ergebnis && ergebnis.korrekt);
  const { u, v, streifen } = aufgabe;
  const ecke = { ...v, k: v.k * v.k, e: Object.fromEntries(Object.entries(v.e).map(([n, e]) => [n, 2 * e])) };
  zeichneQuadratMinus(svg, {
    a: { text: gliedAnzeige(u), laenge: laengeVon(u) },
    b: { text: gliedAnzeige(v), laenge: laengeVon(v) },
    texte: {
      rest: aufgabe.aufgabeText,
      streifen: geloest ? gliedAnzeige(streifen) : `${gliedAnzeige(u)} · ${gliedAnzeige(v)}`,
      ecke: geloest ? gliedAnzeige(ecke) : quadratAnzeige(v),
    },
    titel: `${aufgabe.aufgabeText} = ${geloest ? alsAnzeige(aufgabe.ergebnis) : "?"}`,
    untertitel: `${quadratAnzeige(u)} − zwei Streifen + Ecke zurück`,
  });
}
