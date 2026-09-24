/* Gemeinsame Bausteine für alle Prozent-Generatoren: schöne Zahlen, Kontexte, Einheiten. URL-Vorgaben liest der Kern. */
import { runde } from "../../../kern/js/zahlen.js";
import { bruch, leseTerm } from "../../../kern/js/bruch.js";

export const PROZENTSAETZE = [
  2, 3, 4, 5, 6, 8, 10, 12, 12.5, 15, 18, 20, 24, 25, 30, 35, 40, 45, 50,
  60, 65, 70, 75, 80, 85, 90, 95,
];

/** Rabatte, wie sie im Laden vorkommen (L-011): 5 bis 50 %. */
export const RABATTE = PROZENTSAETZE.filter((p) => p >= 5 && p <= 50);

/** Realistische Kontexte mit Einheit und Zahlenbereich für den Grundwert. */
export const KONTEXTE = [
  { id: "preis", einheit: "€", min: 20, max: 1500, nachkomma: 1, schritt: 5 },
  { id: "klasse", einheit: "Schüler", min: 16, max: 32, nachkomma: 0, schritt: 1 },
  { id: "umfrage", einheit: "Personen", min: 50, max: 1000, nachkomma: 0, schritt: 10 },
  { id: "akku", einheit: "mAh", min: 2000, max: 5000, nachkomma: 0, schritt: 100 },
  { id: "sport", einheit: "Würfe", min: 10, max: 60, nachkomma: 0, schritt: 1 },
];

function ggt(a, b) {
  return b === 0 ? a : ggt(b, a % b);
}

/** Kleinstes Vielfaches, das der Grundwert haben muss, damit G·p/100 höchstens `nachkomma` Stellen hat. */
export function basisFuer(prozentsatz, nachkomma = 0) {
  const p10 = Math.round(prozentsatz * 10);
  const nenner = 1000 / 10 ** nachkomma;
  return nenner / ggt(p10, nenner);
}

function kgv(a, b) {
  return (a * b) / ggt(a, b);
}

/** Zufälliger Grundwert im Bereich als Vielfaches der Basis (und des Kontext-Schritts); undefined, wenn keiner passt. */
export function waehleGrundwert(zufall, prozentsatz, { min, max, nachkomma = 0, schritt = 1 }) {
  const basis = kgv(basisFuer(prozentsatz, nachkomma), schritt);
  const kMin = Math.ceil(min / basis);
  const kMax = Math.floor(max / basis);
  if (kMin > kMax) return undefined;
  return zufall.ganzzahl(kMin, kMax) * basis;
}

/**
 * Kontext mit dem plausiblen Bereich des Dings aus dem Aufgabentext (L-011), z. B. { preis: { min: 30, max: 300,
 * saetze: RABATTE } } für eine Jacke. Kontexte ohne Eintrag bleiben, wie sie sind.
 */
export function mitBereich(kontext, bereiche = {}) {
  return bereiche[kontext.id] ? { ...kontext, ...bereiche[kontext.id] } : kontext;
}

/** Grundwert, Prozentsatz und Prozentwert, die zusammen "schön" sind. Prozentsätze: eigene des Kontexts, sonst alle. */
export function erzeugeTripel(zufall, kontext, prozentsaetze = kontext.saetze ?? PROZENTSAETZE) {
  for (let versuch = 0; versuch < 50; versuch++) {
    const prozentsatz = zufall.wahl(prozentsaetze);
    const grundwert = waehleGrundwert(zufall, prozentsatz, kontext);
    if (grundwert === undefined) continue;
    const prozentwert = runde(grundwert * prozentsatz / 100, kontext.nachkomma);
    return { grundwert, prozentsatz, prozentwert };
  }
  // Rückfallebene: 50 % von einer geraden Zahl ist immer schön.
  const grundwert = 2 * zufall.ganzzahl(Math.ceil(kontext.min / 2), Math.floor(kontext.max / 2));
  return { grundwert, prozentsatz: 50, prozentwert: grundwert / 2 };
}

export const NEUTRAL = { id: "neutral", einheit: "", min: 0, max: Infinity, nachkomma: 2 };

/** Kontext, dessen Bereich den Grundwert enthält; sonst der neutrale Kontext ohne Einheit. */
export function passenderKontext(zufall, grundwert, ids, bereiche) {
  // Nur Kontexte, deren Zahlen so aussehen können: keine 90,91 Personen (L-011).
  const kandidaten = KONTEXTE.map((k) => mitBereich(k, bereiche)).filter((k) => (!ids || ids.includes(k.id)) && grundwert >= k.min && grundwert <= k.max
    && runde(grundwert, k.nachkomma) === grundwert);
  return kandidaten.length ? zufall.wahl(kandidaten) : NEUTRAL;
}

export function waehleKontext(zufall, ids, bereiche) {
  const auswahl = ids ? KONTEXTE.filter((k) => ids.includes(k.id)) : KONTEXTE;
  return mitBereich(zufall.wahl(auswahl), bereiche);
}

/** Zahl mit Einheit ("250 €", "780,50 €", "12,5 %") und Zahl nach ihrer Art ohne Einheit kommen aus dem Kern. */
export { mitEinheit, formatWert } from "../../../kern/js/zahlen.js";

/** Erkennt eine leere oder unlesbare Eingabe. */
export function keineZahl(wert) {
  return Number.isNaN(wert);
}

/** Prüfergebnis und Standardmeldung kommen aus dem gemeinsamen Kern (js/pruefung.js). */
export { ergebnisFuer, MELDUNG_KEINE_ZAHL } from "../../../kern/js/pruefung.js";

/** Exakter Bruch einer (endlichen) Dezimalzahl, z. B. 12.5 → 25/2; damit rechnen die Generatoren exakte Lösungen. */
export function alsBruch(zahl) {
  return leseTerm(String(zahl)).wert ?? bruch(Math.round(zahl * 1e6), 1e6);
}

/** Art eines Zahlenfelds nach der Einheit des Kontexts: Euro → "geld", sonst "zahl". */
export function artFuer(einheit) {
  return einheit === "€" ? "geld" : "zahl";
}
