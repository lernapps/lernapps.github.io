/* Zahlen lesen, schreiben, runden und vergleichen — deutsche Schreibweise. Antworten prüft zahlantwort.js. Generisch – nicht pro App ändern. */

/** Liest "12,5", "12.5", "12,5 %", "1.250,50", "1/8", "3 cm" als Zahl. Einheit am Ende wird ignoriert. NaN bei Unsinn. */
export function parseZahl(text) {
  if (text === null || text === undefined) return NaN;
  let s = String(text).trim().replace(/[%€\s]/g, "").replace(/[a-zäöüßµ°²³]+$/i, "");
  if (s === "") return NaN;
  const bruch = s.match(/^(-?\d+(?:[.,]\d+)?)\/(\d+(?:[.,]\d+)?)$/);
  if (bruch) {
    const zaehler = parseZahl(bruch[1]);
    const nenner = parseZahl(bruch[2]);
    if (!nenner) return NaN;
    return zaehler / nenner;
  }
  if (s.includes(".") && s.includes(",")) {
    s = s.replace(/\./g, "").replace(",", ".");
  } else {
    s = s.replace(",", ".");
  }
  if (!/^-?\d*\.?\d+$/.test(s) && !/^-?\d+\.?$/.test(s)) return NaN;
  return Number(s);
}

/** Kaufmännisch runden, robust gegen 1.005-Fälle. */
export function runde(zahl, stellen = 2) {
  const faktor = 10 ** stellen;
  return Math.round((zahl + Number.EPSILON) * faktor + 1e-9 * Math.sign(zahl)) / faktor;
}

/** Schreibt eine Zahl deutsch: Komma, höchstens `stellen` Nachkommastellen. */
export function formatZahl(zahl, stellen) {
  if (stellen === undefined) {
    const gerundet = runde(zahl, 2);
    return String(gerundet).replace(".", ",");
  }
  return runde(zahl, stellen).toFixed(stellen).replace(".", ",");
}

/** Zahl mit Einheit, z. B. "250 €", "1,5 m" oder nur "12" ohne Einheit. */
export function mitEinheit(zahl, einheit) {
  return einheit ? `${formatZahl(zahl)} ${einheit}` : formatZahl(zahl);
}

/** Vergleich mit absoluter Toleranz (Standard: eine halbe Hundertstel-Stelle). */
export function istGleich(a, b, toleranz = 0.005) {
  return Math.abs(a - b) <= toleranz + 1e-9;
}

/** "Schön" heißt: ganzzahlig oder höchstens eine Nachkommastelle. */
export function istSchoen(zahl) {
  return istGleich(zahl, runde(zahl, 1), 1e-9);
}
