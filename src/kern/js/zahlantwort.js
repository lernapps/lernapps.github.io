/*
 * Zahlen eingeben: eine Rundungsregel für alle Zahlenfelder. Reine Funktionen, kein DOM. Generisch – nicht pro App ändern.
 * 1. Jedes Feld hat eine Art ("geld" | "prozent" | "zahl") und die geforderten Nachkommastellen `stellen`
 *    (Standard nach Art: geld 2, prozent 1, zahl 2). Muss gerundet werden, steht der Hinweis neben dem Feld.
 * 2. Die Toleranz folgt den getippten Stellen d einer Dezimalzahl: richtig, wenn sie exakt stimmt oder
 *    d ≥ stellen und Eingabe = exakter Wert kaufmännisch auf d Stellen gerundet (abschneiden ist falsch).
 * 3. d < stellen, aber sonst richtig gerundet → fehler "zu-grob-gerundet": ein Hinweis, kein Fehler.
 * 4. Brüche und Terme (10/3, 2*50/3, (1/2)^2, 1-1/6, 0,5*3, sqrt(40), √2, 2*pi) gelten überall und zählen als exakt;
 *    Geldfelder vergleichen sie auf den Cent. Gemischte Zahlen (3 1/3) nicht: Hinweis "gemischte-zahl".
 *    Felder mit `nurZahl: true` verlangen das ausgerechnete Ergebnis: Hinweis "ausdruck-statt-zahl".
 * Ergebnis von pruefeZahlAntwort: { korrekt, fehler: undefined | "falsch" | "keine-zahl" | Hinweis-Code, wert (Zahl, NaN
 * wenn unlesbar), bruch (exakter Wert der Eingabe oder null), typ, dezimalstellen, meldung (bei Hinweisen) }.
 */
import { runde } from "./zahlen.js";
import { bruch, leseTerm, istGleich as bruchGleich, zuDezimal, endStellen } from "./bruch.js";

/**
 * @typedef {import("./bruch.js").Bruch} Bruch
 * @typedef {"geld" | "prozent" | "zahl"} Art
 * Optionen eines Zahlenfelds (Teil von Feld, aufgabe-eingabe.js).
 * @typedef {{ art?: Art, stellen?: number, nurZahl?: boolean, bruchZuerst?: boolean, einheit?: string }} Zahloptionen
 * Gelesene Antwort (leseAntwort).
 * @typedef {{ typ: "dezimal", wert: number, dezimalstellen: number, bruch: Bruch, meldung?: undefined }
 *   | { typ: "bruch", wert: Bruch, dezimalstellen: number, bruch?: undefined, meldung?: undefined }
 *   | { typ: "term", wert: number, dezimalstellen: number, bruch?: undefined, meldung?: undefined }
 *   | { typ: "leer" | "gemischt", wert?: undefined, dezimalstellen?: undefined, bruch?: undefined, meldung?: undefined }
 *   | { typ: "ungueltig", meldung?: string, wert?: undefined, dezimalstellen?: undefined, bruch?: undefined }} Antwort
 * Ergebnis von pruefeZahlAntwort (siehe Kopf).
 * @typedef {{ korrekt: boolean, fehler?: string, wert: number, bruch: Bruch | null, typ: Antwort["typ"],
 *   dezimalstellen?: number, meldung?: string }} Zahlergebnis
 */

export const STANDARD_STELLEN = Object.freeze({ geld: 2, prozent: 1, zahl: 2 });

/** Fehlercodes, die nur ein Hinweis sind: neutral anzeigen, nicht als Versuch zählen (im Test: falsch). */
export const HINWEIS_FEHLER = Object.freeze(["zu-grob-gerundet", "gemischte-zahl", "ausdruck-statt-zahl"]);

const SPIELRAUM = 1e-9;
const MAX_STELLEN = 12;
const MAX_VORSCHAU_EXAKT = 6;
// Nur für die Anzeige (#30): Gleitkomma-Rauschen, nicht SPIELRAUM. Exakte Terme (sqrt(k)^4, pi/pi/4) rauschen gemessen
// ≤ 2,7·ε·|x|; mit 8·ε zeigt keine Wurzel sqrt(k), k ≤ 10^6, fälschlich „=“ (knappste: k = 480919 mit 8,1·ε).
const VORSCHAU_RAUSCHEN = 8 * Number.EPSILON;
/** @type {Record<number, string>} */
const WOERTER = { 1: "eine", 2: "zwei", 3: "drei", 4: "vier" };
/** @type {Record<string, string>} */
const MELDUNGEN = {
  "gemischte-zahl": "Schreib gemischte Zahlen als Bruch, z. B. 10/3.",
  "ausdruck-statt-zahl": "Rechne das Ergebnis aus.",
  "wurzel-negativ": "Aus einer negativen Zahl kann man keine Wurzel ziehen.",
};

/** Geforderte Nachkommastellen eines Feldes: eigene Angabe, sonst Standard seiner Art. @param {Zahloptionen} [feld] */
export function stellenFuer({ stellen, art = "zahl" } = {}) {
  return Number.isInteger(stellen) && stellen >= 0 ? stellen : STANDARD_STELLEN[art] ?? STANDARD_STELLEN.zahl;
}

/** @param {Bruch | number} x */
const zahlVon = (x) => (typeof x === "number" ? x : x.z / x.n);
/** @param {any} x beliebiger Wert @returns {x is Bruch} */
const istBruch = (x) => typeof x === "object" && x !== null && Number.isInteger(x.z) && Number.isInteger(x.n);
/** @param {number} a @param {number} b */
const nahe = (a, b) => Math.abs(a - b) <= SPIELRAUM * Math.max(1, Math.abs(a), Math.abs(b));
/** @param {number | string} s */
const deutsch = (s) => String(s).replace(".", ",");

/**
 * Liest eine Antwort. Einheit am Ende ("€", "cm", "Schüler") wird ignoriert; "%" ist im Prozentfeld die Einheit,
 * sonst heißt es Hundertstel (16,7 % = 0,167 mit 3 Stellen).
 * → { typ: "dezimal", wert: Zahl, dezimalstellen, bruch } | { typ: "bruch", wert: {z, n}, dezimalstellen }
 *   | { typ: "term", wert: Zahl (Wurzel, pi), dezimalstellen } | { typ: "leer" | "gemischt" } | { typ: "ungueltig", meldung? }
 * @param {unknown} text @param {Zahloptionen} [optionen] @returns {Antwort}
 */
export function leseAntwort(text, { art = "zahl" } = {}) {
  let s = String(text ?? "").trim();
  if (s === "") return { typ: "leer" };
  s = s.replace(/\s*prozent$/i, " %").replace(/\s*(?:€|euro|[a-zäöüßµ°²³]+\.?)$/i, (einheit) => (/^\s*(pi|sqrt|wurzel)$/i.test(einheit) ? einheit : "")).trim();
  const prozent = /%$/.test(s);
  if (prozent) s = s.slice(0, -1).trim();
  if (s === "") return { typ: "ungueltig" };
  if (/^-?\d+\s+\d+\s*\/\s*\d+$/.test(s)) return { typ: "gemischt" };
  if (/^-?\d{1,3}(?:\.\d{3})+,\d+$/.test(s)) s = s.replace(/\./g, "");
  const info = leseTerm(s);
  if (info.fehler) return info.fehler === "wurzel-negativ" ? { typ: "ungueltig", meldung: MELDUNGEN["wurzel-negativ"] } : { typ: "ungueltig" };
  // Bruch, wenn info.exakt, sonst Zahl. tsc verfolgt diese Kopplung über die Zuweisungen nicht, daher bewusst any.
  /** @type {any} */
  let wert = info.exakt ? info.wert : info.zahl;
  let dezimalstellen = Math.max(info.stellen, 0);
  if (prozent && art !== "prozent") {
    wert = info.exakt ? bruch(wert.z, wert.n * 100) : wert / 100;
    dezimalstellen += 2;
  }
  if (/^-?\d+(?:[.,]\d+)?$/.test(s)) return { typ: "dezimal", wert: zuDezimal(wert), dezimalstellen, bruch: wert };
  return { typ: info.exakt ? "bruch" : "term", wert, dezimalstellen: info.stellen };
}

/** @param {number} n */
function stellenText(n) {
  return `${WOERTER[n] ?? n} Nachkommastelle${n === 1 ? "" : "n"}`;
}

/** "Fast – runde auf zwei Nachkommastellen." @param {number} stellen */
export function meldungZuGrob(stellen) {
  return `Fast – runde auf ${stellenText(stellen)}.`;
}

/** Prüft eine Zahleneingabe nach der Rundungsregel. erwartet: exakter Wert als Bruch {z, n} oder Zahl.
 * @param {unknown} text @param {Bruch | number} erwartet @param {Zahloptionen} [optionen] @returns {Zahlergebnis} */
export function pruefeZahlAntwort(text, erwartet, optionen = {}) {
  const art = optionen.art ?? "zahl";
  const stellen = stellenFuer(optionen);
  const a = leseAntwort(text, { art });
  const basis = { typ: a.typ, dezimalstellen: a.dezimalstellen };
  if (a.typ === "leer" || a.typ === "ungueltig") {
    return { ...basis, korrekt: false, fehler: "keine-zahl", wert: NaN, bruch: null, ...(a.meldung && { meldung: a.meldung }) };
  }
  const exakt = a.typ === "dezimal" ? a.bruch : a.typ === "bruch" ? a.wert : null;
  // Dezimalzahlen und Brüche haben immer einen exakten Wert, exakt ist hier also nie null.
  const wert = a.typ === "gemischt" ? NaN : a.typ === "term" ? a.wert : zuDezimal(/** @type {Bruch} */ (exakt));
  /** @param {string} fehler @param {string} [meldung] */
  const hinweis = (fehler, meldung = MELDUNGEN[fehler]) => ({ ...basis, korrekt: false, fehler, meldung, wert, bruch: exakt });
  const ausdruck = a.typ !== "dezimal";
  if (optionen.nurZahl && ausdruck) return hinweis("ausdruck-statt-zahl");
  if (a.typ === "gemischt") return hinweis("gemischte-zahl");
  const ziel = zahlVon(erwartet);
  let gleich = exakt && istBruch(erwartet) ? bruchGleich(exakt, erwartet) : nahe(wert, ziel);
  if (!gleich && ausdruck && art === "geld") gleich = nahe(runde(wert, stellen), runde(ziel, stellen));
  let fehler;
  if (gleich) fehler = undefined;
  else if (ausdruck) fehler = "falsch";
  else {
    const d = a.dezimalstellen;
    const passt = d <= MAX_STELLEN && Math.abs(wert - runde(ziel, d)) <= SPIELRAUM;
    if (!passt) fehler = "falsch";
    else if (d < stellen) return hinweis("zu-grob-gerundet", meldungZuGrob(stellen));
  }
  return { ...basis, korrekt: fehler === undefined, fehler, wert, bruch: exakt };
}

/**
 * Für Fehlerdiagnosen: passt die Eingabe (nach derselben Stellenregel, Standard ohne Mindeststellen) zu `wert`?
 * Eine Eingabe, die nur durch Runden zu 0 passt, zählt nicht ("0" ist keine Diagnose für 0,25).
 * @param {unknown} text @param {Bruch | number} wert @param {Zahloptionen} [optionen]
 */
export function passtZu(text, wert, { art = "zahl", stellen = 0 } = {}) {
  const r = pruefeZahlAntwort(text, wert, { art, stellen });
  return r.korrekt && !(r.wert === 0 && zahlVon(wert) !== 0);
}

/** @param {string} s */
const gross = (s) => s.charAt(0).toUpperCase() + s.slice(1);

/** Hinweis neben dem Feld, z. B. "Runde auf eine Nachkommastelle oder gib einen Bruch an."; "", wenn nichts zu runden ist.
 * @param {Zahloptionen} [optionen] @param {Bruch | number} [erwartet] */
export function rundungsHinweis(optionen = {}, erwartet) {
  const art = optionen.art ?? "zahl";
  const stellen = stellenFuer(optionen);
  if (erwartet !== undefined) {
    const x = zahlVon(erwartet);
    if (Math.abs(runde(x, stellen) - x) <= SPIELRAUM) return "";
  }
  const runden = stellen === 0 ? "runde auf eine ganze Zahl" : `runde auf ${stellenText(stellen)}`;
  if (art === "geld") return `${gross(runden)}.`;
  if (optionen.bruchZuerst) return `Gib einen Bruch an oder ${runden}.`;
  return `${gross(runden)} oder gib einen Bruch an.`;
}

/** Zahlenfeld mit Art, Stellen und Rundungshinweis: zahlenfeld({ id, label, einheit, art, stellen?, nurZahl? }, exakterWert).
 * @param {import("./aufgabe-eingabe.js").Zahlfeld | import("./aufgabe-eingabe.js").Termfeld} feld @param {Bruch | number} [erwartet] */
export function zahlenfeld(feld, erwartet) {
  const art = feld.art ?? "zahl";
  const stellen = stellenFuer(feld);
  return { ...feld, typ: feld.typ ?? "zahl", art, stellen, hinweis: feld.hinweis ?? rundungsHinweis({ ...feld, art, stellen }, erwartet) };
}

// Stellen, mit denen ein Term-Wert (Wurzel, pi) als Dezimalzahl exakt ist, bis MAX_VORSCHAU_EXAKT; sonst null.
/** @param {number} x */
function termStellen(x) {
  for (let d = 0; d <= MAX_VORSCHAU_EXAKT; d++) {
    if (Math.abs(x - runde(x, d)) <= VORSCHAU_RAUSCHEN * Math.max(1, Math.abs(x))) return d;
  }
  return null;
}

/**
 * Live-Vorschau für Terme und Brüche: "= 30 €", "= 12,5", "≈ 3,33"; "" für Dezimalzahlen, leere und ungültige Eingaben.
 * "=" genau dann, wenn der Wert mit höchstens MAX_VORSCHAU_EXAKT Nachkommastellen exakt dargestellt wird (1/4 = 0,25),
 * sonst "≈" mit den geforderten Stellen, mindestens 2, höchstens 4 (1/3 ≈ 0,33).
 * @param {unknown} text @param {Zahloptionen} [feld]
 */
export function vorschau(text, { stellen, einheit = "", art = "zahl" } = {}) {
  const a = leseAntwort(text, { art });
  if (a.typ !== "bruch" && a.typ !== "term") return "";
  const x = a.typ === "term" ? a.wert : zuDezimal(a.wert);
  const ende = a.typ === "bruch" ? endStellen(a.wert) : termStellen(x);
  const anzeige = ende !== null && ende <= MAX_VORSCHAU_EXAKT
    ? `= ${deutsch(runde(x, ende))}`
    : `≈ ${deutsch(x.toFixed(Math.min(4, Math.max(2, stellenFuer({ stellen, art })))))}`;
  return einheit ? `${anzeige} ${einheit}` : anzeige;
}
