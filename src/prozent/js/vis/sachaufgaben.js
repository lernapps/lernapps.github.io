/*
 * Bild zu Sachaufgaben: ein Kästchen = 1 %. Die gesuchte Größe steht bis zur Lösung als „?“ im Bild (L-026):
 * Grundwert gesucht → „18 % = 259,20 €“ und „100 % = ?“; Prozentsatz gesucht → leeres Feld, „100 % = 100 Personen“ und
 * „10 Personen = ? %“ (die Füllung verriete p). Nach richtiger Antwort oder „Lösung zeigen“ stehen die Zahlen da.
 */
import { formatZahl, formatGenau, runde } from "../../../kern/js/zahlen.js";
import { bildWert, imDativ } from "../aufgaben/gemeinsam.js";
import { zeichneRaster } from "./diagramme.js";

const EINHEIT_W = { umfrage: "Personen" };

export function zeichneSachaufgaben(svg, aufgabe, ergebnis) {
  const zeigen = Boolean(ergebnis && ergebnis.korrekt);
  const { grundwert, prozentsatz, prozentwert, einheit } = aufgabe;
  const p = `${formatZahl(prozentsatz)} %`;
  const G = bildWert(grundwert, einheit);
  const W = bildWert(prozentwert, EINHEIT_W[aufgabe.kontext] ?? einheit);
  if (aufgabe.gesucht === "G") {
    zeichneRaster(svg, prozentsatz, { titel: `${p} = ${W}`, untertitel: `100 % = ${zeigen ? G : "?"}` });
    return;
  }
  if (aufgabe.gesucht === "p") {
    zeichneRaster(svg, zeigen ? prozentsatz : 0, { titel: `100 % = ${G}`, untertitel: `${W} = ${zeigen ? p : "? %"}` });
    return;
  }
  const eins = grundwert / 100;
  // 1 % ungerundet, wenn es keine glatten Cent sind (L-021).
  const einsText = runde(eins, 2) === eins ? bildWert(eins, einheit) : `${formatGenau(eins)} ${einheit}`.trim();
  zeichneRaster(svg, prozentsatz, {
    titel: `${p} von ${bildWert(grundwert, imDativ(einheit))}`,
    untertitel: zeigen ? `1 % = ${einsText}, ${p} = ${bildWert(prozentwert, einheit)}` : `ein Kästchen = 1 %, ${p} = ?`,
  });
}
