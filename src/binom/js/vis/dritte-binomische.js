/*
 * Bild zur dritten binomischen Formel: oben das Quadrat a² ohne die Ecke b² (zwei Teile), unten dieselben zwei Teile
 * umgelegt zum Rechteck (a + b) × (a − b). Gleiche Fläche, also (a + b)(a − b) = a² − b².
 */
import { zeichneUmlegen, laengeVon } from "./flaechen.js";
import { alsAnzeige, gliedAnzeige, negiere, binomAnzeige, multipliziere } from "../aufgaben/terme.js";
import { quadratAnzeige } from "../aufgaben/binom.js";

export function zeichneDritteBinomische(svg, aufgabe, ergebnis) {
  const geloest = Boolean(ergebnis && ergebnis.korrekt);
  const { u, v } = aufgabe;
  const minusV = negiere([v])[0];
  zeichneUmlegen(svg, {
    a: { text: gliedAnzeige(u), laenge: laengeVon(u) },
    b: { text: gliedAnzeige(v), laenge: laengeVon(v) },
    texte: {
      ecke: geloest ? `− ${gliedAnzeige(multipliziere([v], [v])[0])}` : `− ${quadratAnzeige(v)}`,
      oben: `${quadratAnzeige(u)} ohne die Ecke ${quadratAnzeige(v)}`,
      unten: `umgelegt: ${binomAnzeige([u, v])}${binomAnzeige([u, minusV])}`,
      rest: alsAnzeige([u, minusV]),
    },
    titel: `${aufgabe.aufgabeText} = ${geloest ? alsAnzeige(aufgabe.ergebnis) : "?"}`,
    untertitel: "Gleiche Teile, gleiche Fläche",
  });
}
