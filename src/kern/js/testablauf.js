/* Test und Schnelltest: Aufgabenfolge aus der Testnummer, Bewertung, Ergebniszeile. Reine Funktionen, kein DOM. Generisch.
 * Kompetenzen und App-Titel übergibt die Seite (Dependency Inversion); der Kern importiert keine App-Konfiguration. */
import { erzeugeZufall } from "./zufall.js";

/**
 * Kompetenz aus der App-Konfiguration (KOMPETENZEN in js/app.config.js).
 * @typedef {{ id: string, titel: string, seite?: string }} Kompetenz
 * @typedef {Kompetenz & { nr: number }} NummerierteKompetenz
 * @typedef {{ kompetenz: string, index: number, seed: number }} Testschritt
 */

/**
 * Kompetenzen aus der App-Konfiguration in Checklisten-Reihenfolge, ergänzt um die Nummer 1, 2, …
 * @template {Kompetenz} K @param {readonly K[]} konfig @returns {(K & { nr: number })[]}
 */
export const nummeriere = (konfig) => konfig.map((k, i) => ({ ...k, nr: i + 1 }));

/** Modus → Aufgaben je Kompetenz. @type {Record<string, number>} */
export const MODI = { voll: 2, schnell: 1 };
/** @type {Record<string, string>} */
export const MODUS_NAMEN = { voll: "Test", schnell: "Schnelltest" };
/** @type {Record<string, string>} */
export const SYMBOLE = { S: "✓", T: "~", Ü: "✗" };
/** @type {Record<string, string>} */
export const STUFEN_NAMEN = { S: "sicher", T: "teils", Ü: "üben" };
const MAX_JE_KOMPETENZ = Math.max(...Object.values(MODI));

/** Liest ?modus=voll|schnell; alles andere ist "voll". @param {string | null | undefined} query @returns {string} */
export function leseModus(query) {
  // Fehlt der Parameter (null), ist er kein eigener Schlüssel – also "voll". `in` fände auch geerbte wie `toString`.
  const modus = /** @type {string} */ (new URLSearchParams(query || "").get("modus"));
  return Object.hasOwn(MODI, modus) ? modus : "voll";
}

/**
 * Leitet aus der Testnummer die Aufgabenfolge ab: je Kompetenz feste Seeds in Checklisten-Reihenfolge.
 * Der Schnelltest nimmt die erste Aufgabe jeder Kompetenz, der Test beide.
 * @param {number} nr @param {string} modus @param {readonly Kompetenz[]} kompetenzen @returns {Testschritt[]}
 */
export function testAufgaben(nr, modus, kompetenzen) {
  const zufall = erzeugeZufall(nr);
  const anzahl = MODI[modus] ?? MODI.voll;
  /** @type {Testschritt[]} */
  const folge = [];
  for (const k of kompetenzen) {
    /** @type {number[]} */
    const seeds = [];
    while (seeds.length < MAX_JE_KOMPETENZ) {
      const seed = zufall.ganzzahl(1, 9999);
      if (!seeds.includes(seed)) seeds.push(seed);
    }
    seeds.slice(0, anzahl).forEach((seed, index) => folge.push({ kompetenz: k.id, index, seed }));
  }
  return folge;
}

/** Stufe aus richtigen und gestellten Aufgaben einer Kompetenz: alle → S, keine → Ü, dazwischen → T.
 * @param {number} richtig @param {number} gesamt @returns {"S" | "T" | "Ü"} */
export function bewerte(richtig, gesamt) {
  if (richtig >= gesamt) return "S";
  if (richtig === 0) return "Ü";
  return "T";
}

/**
 * Bündelt [{kompetenz, korrekt}] zu {kompetenz: Stufe}.
 * @param {readonly { kompetenz: string, korrekt: boolean }[]} antworten @returns {Record<string, string>}
 */
export function fasseZusammen(antworten) {
  /** @type {Record<string, { richtig: number, gesamt: number }>} */
  const zaehler = {};
  for (const { kompetenz, korrekt } of antworten) {
    zaehler[kompetenz] ??= { richtig: 0, gesamt: 0 };
    zaehler[kompetenz].gesamt += 1;
    if (korrekt) zaehler[kompetenz].richtig += 1;
  }
  return Object.fromEntries(Object.entries(zaehler).map(([id, z]) => [id, bewerte(z.richtig, z.gesamt)]));
}

/** Eine Zeile, die das Kind dem Tutor schickt: "Test Nr. 4711 (<App-Titel>, Schnelltest): 1 ✓ 2 ✓ 3 ✗ …".
 * @param {number} nr @param {string} modus @param {Record<string, string>} ergebnis
 * @param {readonly NummerierteKompetenz[]} kompetenzen @param {string} appTitel */
export function ergebnisZeile(nr, modus, ergebnis, kompetenzen, appTitel) {
  const teile = kompetenzen.map((k) => `${k.nr} ${SYMBOLE[ergebnis[k.id]] ?? "–"}`);
  return `Test Nr. ${nr} (${appTitel}, ${MODUS_NAMEN[modus] ?? MODUS_NAMEN.voll}): ${teile.join(" ")}`;
}

/** Link, der denselben Test noch einmal öffnet. @param {number} nr @param {string} modus */
export function testLink(nr, modus) {
  return `test.html?nr=${nr}&modus=${Object.hasOwn(MODI, modus) ? modus : "voll"}`;
}

/** ISO-Datum → "23.09.2026" (Ortszeit); leer bei Unsinn. @param {string} iso */
export function formatDatum(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  /** @param {number} n */
  const zwei = (n) => String(n).padStart(2, "0");
  return `${zwei(d.getDate())}.${zwei(d.getMonth() + 1)}.${d.getFullYear()}`;
}
