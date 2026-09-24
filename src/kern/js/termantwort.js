/*
 * Terme mit Variablen prüfen: Gleichwertigkeit, Form (ausmultipliziert / faktorisiert), Fehlterme, Live-Vorschau.
 * Reine Funktionen, kein DOM. Generisch – nicht pro App ändern. Lesen und Setzen: variablenterm.js.
 * 1. Gleichwertig heißt: an allen festen Prüfstellen (8 Belegungen, keine 0, keine ±1, jede Variable anders) gleicher
 *    Wert mit relativer Toleranz 1e-9 wie in zahlantwort.js. Stellen, an denen ein Term nicht definiert ist, fallen
 *    weg; es müssen mindestens 5 übrig bleiben.
 * 2. Option form: "ausmultipliziert" (keine Klammern, Summe von Monomen, gleichartige Glieder zusammengefasst) oder
 *    "faktorisiert" (Produkt oder Potenz, kein + oder − außerhalb von Klammern). Gleichwertig, aber in falscher Form →
 *    Hinweis "nicht-ausmultipliziert" | "nicht-zusammengefasst" | "nicht-faktorisiert": neutral, zählt nicht als Fehler.
 * 3. Unlesbar oder leer → fehler "kein-term" (zählt nicht als Versuch), bei Syntaxfehlern mit kurzer Meldung.
 * Ergebnis von pruefeTermAntwort: { korrekt, fehler, wert (gesetzter Term oder NaN), meldung? } – mit ergebnisFuer
 * aus pruefung.js wird daraus { korrekt, fehler, felder, meldung }.
 */
import { leseVariablenterm, auswerten } from "./variablenterm.js";

/**
 * @typedef {import("./variablenterm.js").Knoten} Knoten
 * @typedef {import("./variablenterm.js").GelesenerTerm} GelesenerTerm
 * @typedef {Extract<GelesenerTerm, { baum: Knoten }>} LesbarerTerm
 * Ein Term als Text oder schon gelesen (Ergebnis von leseVariablenterm).
 * @typedef {string | GelesenerTerm} TermEingabe
 */

/** Fehlercodes, die nur ein Hinweis sind: neutral anzeigen, nicht als Versuch zählen (wie HINWEIS_FEHLER in zahlantwort.js). */
export const TERM_HINWEIS_FEHLER = Object.freeze(["nicht-ausmultipliziert", "nicht-zusammengefasst", "nicht-faktorisiert"]);
export const TERM_FORMEN = Object.freeze(["ausmultipliziert", "faktorisiert"]);
export const MELDUNG_KEIN_VARIABLENTERM = "Das konnte ich nicht lesen. Schreib einen Term wie x^2 + 6x + 9 oder (a+b)(a-b).";

/** @type {Record<string, string>} */
const MELDUNGEN = {
  "nicht-ausmultipliziert": "Der Term stimmt – jetzt noch ausmultiplizieren, bis keine Klammer mehr übrig ist.",
  "nicht-zusammengefasst": "Der Term stimmt – fasse noch gleichartige Glieder zusammen.",
  "nicht-faktorisiert": "Der Term stimmt – schreib ihn noch als Produkt, z. B. (a + b)(a − b).",
};
const SPIELRAUM = 1e-9;
const MIN_STELLEN = 5;
const GRUNDWERTE = [2.31, -1.73, 3.17, -2.59, 1.41, 4.03, -0.67, 2.87];

/** Feste Prüfstellen: 8 Belegungen der Variablen (in dieser Reihenfolge), ohne 0 und ±1, jede Variable mit eigenen Werten.
 * @param {string[]} variablen @returns {Record<string, number>[]} */
export function pruefstellen(variablen) {
  return GRUNDWERTE.map((_, j) => Object.fromEntries(
    variablen.map((v, k) => [v, GRUNDWERTE[(j + k) % GRUNDWERTE.length] * (1 + 0.13 * k)]),
  ));
}

/** @param {TermEingabe} term @returns {GelesenerTerm} */
function alsTerm(term) {
  return typeof term === "string" ? leseVariablenterm(term) : term;
}
/** @param {TermEingabe} term @returns {LesbarerTerm} */
function erwarteterTerm(term) {
  const t = alsTerm(term);
  if (!t || t.fehler) throw new Error(`Erwarteter Term ungültig: ${term}`);
  return t;
}
/** @param {number} a @param {number} b */
const nahe = (a, b) => Math.abs(a - b) <= SPIELRAUM * Math.max(1, Math.abs(a), Math.abs(b));

/** true, wenn beide Terme (Text oder Ergebnis von leseVariablenterm) an den Prüfstellen gleich sind.
 * @param {TermEingabe} term1 @param {TermEingabe} term2 */
export function sindGleichwertig(term1, term2) {
  const a = alsTerm(term1);
  const b = alsTerm(term2);
  if (a.fehler || b.fehler) return false;
  const variablen = [...new Set([...a.variablen, ...b.variablen])].sort();
  let gueltig = 0;
  for (const stelle of pruefstellen(variablen)) {
    const x = auswerten(a.baum, stelle);
    const y = auswerten(b.baum, stelle);
    if (!Number.isFinite(x) || !Number.isFinite(y)) continue;
    if (!nahe(x, y)) return false;
    gueltig++;
  }
  return gueltig >= MIN_STELLEN;
}

// --- Form ------------------------------------------------------------------

/** @param {Knoten} k @param {Knoten[]} [liste] @returns {Knoten[]} */
function glieder(k, liste = []) {
  if (k.art === "plus" || k.art === "minus") { glieder(k.links, liste); glieder(k.rechts, liste); }
  else if (k.art === "negativ") glieder(k.arg, liste);
  else liste.push(k);
  return liste;
}

/** @param {Knoten} k @returns {boolean} */
const hatVariable = (k) => k.art === "variable" || [k.arg, k.links, k.rechts, k.basis].some((kind) => kind && hatVariable(kind));
/** @param {Knoten} t */
const istZahlfaktor = (t) => t.art === "zahl" || (t.art === "potenz" && t.basis.art === "zahl") || (t.art === "wurzel" && !hatVariable(t.arg));

// Monom: Produkt aus höchstens einer Zahl (Zähler und Nenner je eine) und Potenzen verschiedener Variablen.
// → { signatur } oder { fehler }.
/**
 * @param {Knoten} k
 * @returns {{ signatur: string, fehler?: undefined } | { fehler: string, signatur?: undefined }}
 */
function monom(k) {
  const zahlen = [0, 0];
  /** @type {Record<string, number>} */
  const exponenten = {};
  /** @type {Record<string, number>} */
  const vorkommen = {};
  /** @type {string | undefined} */
  let fehler;
  /** @param {Knoten} t @param {number} nenner 0 im Zähler, 1 im Nenner */
  function sammle(t, nenner) {
    if (t.art === "mal") { sammle(t.links, nenner); sammle(t.rechts, nenner); }
    else if (t.art === "geteilt") { sammle(t.links, nenner); sammle(t.rechts, 1 - nenner); }
    else if (t.art === "negativ") sammle(t.arg, nenner);
    else if (t.art === "variable" || t.art === "pi" || (t.art === "potenz" && ["variable", "pi"].includes(t.basis.art))) {
      const name = t.art === "potenz" ? t.basis.name ?? "π" : t.name ?? "π";
      const e = (t.art === "potenz" ? t.exponent : 1) * (nenner ? -1 : 1);
      exponenten[name] = (exponenten[name] ?? 0) + e;
      vorkommen[name] = (vorkommen[name] ?? 0) + 1;
    } else if (istZahlfaktor(t)) zahlen[nenner]++;
    else fehler = "nicht-ausmultipliziert";
  }
  sammle(k, 0);
  if (fehler) return { fehler };
  if (zahlen[0] > 1 || zahlen[1] > 1 || Object.values(vorkommen).some((n) => n > 1)) return { fehler: "nicht-zusammengefasst" };
  const signatur = Object.keys(exponenten).sort().filter((v) => exponenten[v] !== 0).map((v) => `${v}^${exponenten[v]}`).join("*");
  return { signatur };
}

/** @param {Knoten} baum @returns {string | undefined} */
function ausmultipliziertFehler(baum) {
  const monome = glieder(baum).map(monom);
  const erster = monome.find((m) => m.fehler === "nicht-ausmultipliziert") ?? monome.find((m) => m.fehler);
  if (erster) return erster.fehler;
  const signaturen = monome.map((m) => m.signatur);
  return new Set(signaturen).size < signaturen.length ? "nicht-zusammengefasst" : undefined;
}

/** @param {Knoten} k @returns {boolean} */
function istFaktorisiert(k) {
  while (k.art === "negativ") k = k.arg;
  if (k.art === "klammer") return istFaktorisiert(k.arg);
  return k.art !== "plus" && k.art !== "minus";
}

/** Formfehler eines Terms (Text oder gelesen): undefined, wenn die Form passt, sonst der Hinweis-Code.
 * @param {TermEingabe} term @param {string} form */
export function formFehler(term, form) {
  if (!TERM_FORMEN.includes(form)) throw new Error(`Unbekannte Form: ${form}`);
  const t = erwarteterTerm(term);
  if (form === "ausmultipliziert") return ausmultipliziertFehler(t.baum);
  return istFaktorisiert(t.baum) ? undefined : "nicht-faktorisiert";
}

// --- Prüfen ----------------------------------------------------------------

/**
 * Prüft eine Termeingabe gegen den erwarteten Term (Text oder gelesen). optionen: { form?: "ausmultipliziert" | "faktorisiert" }.
 * → { korrekt, fehler: undefined | "falsch" | "kein-term" | Hinweis-Code, wert: gesetzter Term (NaN, wenn unlesbar), meldung? }
 * @param {unknown} text @param {TermEingabe} erwartet @param {{ form?: string }} [optionen]
 * @returns {{ korrekt: boolean, fehler: string | undefined, wert: string | number, meldung?: string }}
 */
export function pruefeTermAntwort(text, erwartet, optionen = {}) {
  const e = erwarteterTerm(erwartet);
  if (optionen.form !== undefined && !TERM_FORMEN.includes(optionen.form)) throw new Error(`Unbekannte Form: ${optionen.form}`);
  const a = leseVariablenterm(text);
  if (a.fehler) return { korrekt: false, fehler: "kein-term", wert: NaN, ...(a.meldung && { meldung: a.meldung }) };
  if (!sindGleichwertig(a, e)) return { korrekt: false, fehler: "falsch", wert: a.text };
  const fehler = optionen.form ? formFehler(a, optionen.form) : undefined;
  if (fehler) return { korrekt: false, fehler, wert: a.text, meldung: MELDUNGEN[fehler] };
  return { korrekt: true, fehler: undefined, wert: a.text };
}

/** Für Fehlerdiagnosen: ist die Eingabe gleichwertig zum (falschen) Kandidatenterm, z. B. a^2+b^2 bei (a+b)²?
 * @param {unknown} text @param {TermEingabe} kandidat */
export function passtZuTerm(text, kandidat) {
  const a = leseVariablenterm(text);
  return !a.fehler && sindGleichwertig(a, erwarteterTerm(kandidat));
}

/** Live-Vorschau: "Gelesen: x² + 6x + 9", eine kurze Meldung bei Syntaxfehlern, "" bei leerer Eingabe.
 * @param {unknown} text @returns {string} */
export function termVorschau(text) {
  const a = leseVariablenterm(text);
  if (a.fehler) return a.meldung;
  return `Gelesen: ${a.text}`;
}
