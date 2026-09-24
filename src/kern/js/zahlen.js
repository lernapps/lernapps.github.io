/* Zahlen lesen, schreiben, runden und vergleichen — deutsche Schreibweise. Antworten prüft zahlantwort.js. Generisch – nicht pro App ändern. */

/** Liest "12,5", "12.5", "12,5 %", "1.250,50", "1/8", "3 cm" als Zahl. Einheit am Ende wird ignoriert. NaN bei Unsinn.
 * @param {unknown} text @returns {number} */
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

/** Kaufmännisch runden, robust gegen 1.005-Fälle. @param {number} zahl @param {number} [stellen] */
export function runde(zahl, stellen = 2) {
  const faktor = 10 ** stellen;
  return Math.round((zahl + Number.EPSILON) * faktor + 1e-9 * Math.sign(zahl)) / faktor;
}

/** Schreibt eine Zahl deutsch: Komma, höchstens `stellen` Nachkommastellen. @param {number} zahl @param {number} [stellen] */
export function formatZahl(zahl, stellen) {
  if (stellen === undefined) {
    const gerundet = runde(zahl, 2);
    return String(gerundet).replace(".", ",");
  }
  return runde(zahl, stellen).toFixed(stellen).replace(".", ",");
}

/** Zwischenwert ohne sichtbare Rundung (L-021): bis zu `stellen` Nachkommastellen, Nullen am Ende fallen weg. 1,125 bleibt 1,125.
 * @param {number} zahl @param {number} [stellen] */
export function formatGenau(zahl, stellen = 6) {
  return String(runde(zahl, stellen)).replace(".", ",");
}

/** "=" nur, wenn die gezeigte Zahl den exakten Wert trifft; sonst "≈". So stimmt jede gezeigte Rechnung beim Nachrechnen.
 * @param {number} exakt @param {number} gezeigt */
export function gleichheitszeichen(exakt, gezeigt) {
  return Math.abs(exakt - gezeigt) <= 1e-9 * Math.max(1, Math.abs(exakt)) ? "=" : "≈";
}

/** Zahl ohne Einheit, aber nach ihrer Art geschrieben: Geld (€) mit zwei Nachkommastellen (780,50), ganze Beträge ohne Komma.
 * @param {number} zahl @param {string} [einheit] */
export function formatWert(zahl, einheit) {
  if (einheit === "€") return Number.isInteger(runde(zahl, 2)) ? formatZahl(zahl, 0) : formatZahl(zahl, 2);
  return formatZahl(zahl);
}

/** Zahl mit Einheit, z. B. "250 €", "780,50 €", "1,5 m" oder nur "12". Geschütztes Leerzeichen: kein Umbruch vor der Einheit.
 * @param {number} zahl @param {string} [einheit] */
export function mitEinheit(zahl, einheit) {
  return einheit ? `${formatWert(zahl, einheit)}\u00a0${einheit}` : formatZahl(zahl);
}

/** Vergleich mit absoluter Toleranz (Standard: eine halbe Hundertstel-Stelle). @param {number} a @param {number} b @param {number} [toleranz] */
export function istGleich(a, b, toleranz = 0.005) {
  return Math.abs(a - b) <= toleranz + 1e-9;
}

/** "Schön" heißt: ganzzahlig oder höchstens eine Nachkommastelle. @param {number} zahl */
export function istSchoen(zahl) {
  return istGleich(zahl, runde(zahl, 1), 1e-9);
}
