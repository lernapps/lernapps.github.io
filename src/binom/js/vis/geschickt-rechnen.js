/*
 * Bild zu "Geschickt rechnen": die Flächenbilder der drei Formeln mit Zahlen statt Variablen.
 * 51²: Quadrat 50 + 1; 49²: Quadrat 50 minus zwei Streifen 50 · 1, Ecke 1² zurück; 21 · 19: 20² ohne Ecke 1², umgelegt.
 * Vor dem Prüfen zeigt das Bild nur die Aufgabe als neutrale Fläche ("91 · 89 = ?"), damit es die Frage „Welche Formel
 * hilft?“ nicht vorwegnimmt (L-007). Nach „Prüfen“ oder „Lösung zeigen“ folgen Zerlegung und Formelbild: vor der
 * richtigen Antwort mit den Rechnungen ("50 · 1"), danach mit den Werten ("50").
 */
import { zeichneRaster, zeichneQuadratMinus, zeichneUmlegen } from "./flaechen.js";

/** Neutrale Fläche: Rechteck (bzw. Quadrat) mit den Seiten der Aufgabe, ohne Zerlegung. */
function zeichneNeutral(svg, aufgabe) {
  const { formel, basis: B, abstand: A } = aufgabe;
  const breite = formel === 2 ? B - A : B + A;
  const hoehe = formel === 1 ? B + A : B - A;
  zeichneRaster(svg, {
    zeilen: [{ text: String(hoehe), laenge: hoehe }],
    spalten: [{ text: String(breite), laenge: breite }],
    zellen: [[{ art: "leer", text: "?" }]],
    titel: `${aufgabe.rechnung} = ?`,
  });
}

export function zeichneGeschicktRechnen(svg, aufgabe, ergebnis) {
  if (!ergebnis || ergebnis.fehler === "keine-eingabe") {
    zeichneNeutral(svg, aufgabe);
    return;
  }
  const geloest = Boolean(ergebnis && ergebnis.korrekt);
  const { formel, basis: B, abstand: A } = aufgabe;
  const wert = (rechnung, zahl) => (geloest ? String(zahl) : rechnung);
  const titel = `${aufgabe.rechnung} = ${geloest ? aufgabe.ergebnis : "?"}`;
  if (formel === 1) {
    zeichneRaster(svg, {
      zeilen: [{ text: String(B), laenge: B }, { text: String(A), laenge: A }],
      spalten: [{ text: String(B), laenge: B }, { text: String(A), laenge: A }],
      zellen: [
        [{ art: "a", text: wert(`${B}²`, B * B) }, { art: "ab", text: wert(`${B} · ${A}`, A * B) }],
        [{ art: "ab", text: wert(`${A} · ${B}`, A * B) }, { art: "b", text: wert(`${A}²`, A * A) }],
      ],
      titel,
      untertitel: `${B + A}² = (${B} + ${A})²`,
    });
  } else if (formel === 2) {
    zeichneQuadratMinus(svg, {
      a: { text: String(B), laenge: B },
      b: { text: String(A), laenge: A },
      texte: { rest: `${B - A}²`, restSeite: String(B - A), streifen: wert(`${B} · ${A}`, A * B), ecke: wert(`${A}²`, A * A) },
      titel,
      untertitel: `${B}² − zwei Streifen + Ecke zurück`,
    });
  } else {
    zeichneUmlegen(svg, {
      a: { text: String(B), laenge: B },
      b: { text: String(A), laenge: A },
      texte: {
        ecke: `− ${wert(`${A}²`, A * A)}`,
        oben: `${B}² ohne die Ecke ${A}²`,
        unten: `umgelegt: ${B + A} · ${B - A}`,
        rest: String(B - A),
      },
      titel,
      untertitel: `${B + A} · ${B - A} = ${B}² − ${A}²`,
    });
  }
}
