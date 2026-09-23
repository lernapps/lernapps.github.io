/*
 * Terme für die binomischen Formeln bauen: Glieder, Ausmultiplizieren, Eingabe- und Anzeigeform, Binom-Struktur.
 * Reine Funktionen, kein DOM; gemeinsam für alle Generatoren dieser App. Prüfen der Eingabe: js/kern/termantwort.js.
 * Ein Glied ist { k: Koeffizient, e: { variable: Hochzahl } }, ein Polynom eine Liste von Gliedern.
 */
import { leseVariablenterm } from "../../../kern/js/variablenterm.js";

const HOCH = "⁰¹²³⁴⁵⁶⁷⁸⁹";
const MINUS = "−";

/** glied(3, "a", "b") = 3ab, glied(1, "x", "x") = x², glied(5) = 5. */
export function glied(k, ...variablen) {
  const e = {};
  for (const v of variablen) e[v] = (e[v] ?? 0) + 1;
  return { k, e };
}

const schluessel = (g) => Object.keys(g.e).sort().map((v) => `${v}${g.e[v]}`).join("");

function zusammenfassen(glieder) {
  const summe = new Map();
  for (const g of glieder) {
    const s = schluessel(g);
    const alt = summe.get(s);
    summe.set(s, alt ? { k: alt.k + g.k, e: alt.e } : { k: g.k, e: { ...g.e } });
  }
  return [...summe.values()].filter((g) => g.k !== 0);
}

/** Jedes Glied von p mal jedes Glied von q, gleichartige Glieder zusammengefasst (Reihenfolge wie beim Rechnen). */
export function multipliziere(p, q) {
  const produkte = [];
  for (const g of p) {
    for (const h of q) {
      const e = { ...g.e };
      for (const [v, n] of Object.entries(h.e)) e[v] = (e[v] ?? 0) + n;
      produkte.push({ k: g.k * h.k, e });
    }
  }
  return zusammenfassen(produkte);
}

export const addiere = (p, q) => zusammenfassen([...p, ...q]);
export const negiere = (p) => p.map((g) => ({ k: -g.k, e: { ...g.e } }));

function variablenteil(g, hoch) {
  return Object.keys(g.e).sort().filter((v) => g.e[v] > 0).map((v) => (g.e[v] === 1 ? v : `${v}${hoch(g.e[v])}`)).join("");
}
const hochAnzeige = (n) => [...String(n)].map((z) => HOCH[z]).join("");
const hochEingabe = (n) => `^${n}`;

function betrag(g, hoch) {
  const teil = variablenteil(g, hoch);
  const k = Math.abs(g.k);
  return teil && k === 1 ? teil : `${k}${teil}`;
}

/** Ein Glied mit Vorzeichen, z. B. "−x²", "12ab", "−3". */
export function gliedAnzeige(g) {
  return `${g.k < 0 ? MINUS : ""}${betrag(g, hochAnzeige)}`;
}

function setze(p, hoch, plus, minus, vorneMinus) {
  if (p.length === 0) return "0";
  return p.map((g, i) => {
    const b = betrag(g, hoch);
    if (i === 0) return g.k < 0 ? `${vorneMinus}${b}` : b;
    return `${g.k < 0 ? minus : plus}${b}`;
  }).join("");
}

/** Eingabeform für Prüfer und URL-Beispiele: "2x^2+7x-4". */
export const alsEingabe = (p) => setze(p, hochEingabe, "+", "-", "-");
/** Anzeigeform für Aufgabentext und Rechenweg: "2x² + 7x − 4". */
export const alsAnzeige = (p) => setze(p, hochAnzeige, " + ", ` ${MINUS} `, MINUS);
/** "(2x − 1)" */
export const binomAnzeige = (p) => `(${alsAnzeige(p)})`;
/** "(2x-1)" */
export const binomEingabe = (p) => `(${alsEingabe(p)})`;

// --- Binom-Struktur ----------------------------------------------------------

const ohneKlammer = (k) => (k.art === "klammer" ? ohneKlammer(k.arg) : k);
const anzahlGlieder = (k) => (k.art === "plus" || k.art === "minus" ? anzahlGlieder(k.links) + anzahlGlieder(k.rechts) : 1);
const istBinomKlammer = (k) => k.art === "klammer" && anzahlGlieder(ohneKlammer(k)) === 2;

/**
 * true, wenn der Term als Binom-Produkt dasteht: (x + 3)², (x + 4)(x − 4), (x + 3)(x + 3).
 * Nicht: 1·(x² + 6x + 9), 2(x + 3)², (x + 3)³ – dort ist die Form zwar ein Produkt, aber keine binomische Formel.
 */
export function istBinomProdukt(text) {
  const t = leseVariablenterm(text);
  if (t.fehler) return false;
  const k = ohneKlammer(t.baum);
  if (k.art === "potenz") return k.exponent === 2 && istBinomKlammer(k.basis);
  if (k.art === "mal") return istBinomKlammer(k.links) && istBinomKlammer(k.rechts);
  return false;
}
