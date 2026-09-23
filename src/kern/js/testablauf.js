/* Test und Schnelltest: Aufgabenfolge aus der Testnummer, Bewertung, Ergebniszeile. Reine Funktionen, kein DOM. Generisch.
 * Kompetenzen und App-Titel übergibt die Seite (Dependency Inversion); der Kern importiert keine App-Konfiguration. */
import { erzeugeZufall } from "./zufall.js";

/** Kompetenzen aus der App-Konfiguration in Checklisten-Reihenfolge, ergänzt um die Nummer 1, 2, … */
export const nummeriere = (konfig) => konfig.map((k, i) => ({ ...k, nr: i + 1 }));

/** Modus → Aufgaben je Kompetenz. */
export const MODI = { voll: 2, schnell: 1 };
export const MODUS_NAMEN = { voll: "Test", schnell: "Schnelltest" };
export const SYMBOLE = { S: "✓", T: "~", Ü: "✗" };
export const STUFEN_NAMEN = { S: "sicher", T: "teils", Ü: "üben" };
const MAX_JE_KOMPETENZ = Math.max(...Object.values(MODI));

/** Liest ?modus=voll|schnell; alles andere ist "voll". */
export function leseModus(query) {
  const modus = new URLSearchParams(query || "").get("modus");
  return modus in MODI ? modus : "voll";
}

/**
 * Leitet aus der Testnummer die Aufgabenfolge ab: je Kompetenz feste Seeds in Checklisten-Reihenfolge.
 * Der Schnelltest nimmt die erste Aufgabe jeder Kompetenz, der Test beide.
 */
export function testAufgaben(nr, modus, kompetenzen) {
  const zufall = erzeugeZufall(nr);
  const anzahl = MODI[modus] ?? MODI.voll;
  const folge = [];
  for (const k of kompetenzen) {
    const seeds = [];
    while (seeds.length < MAX_JE_KOMPETENZ) {
      const seed = zufall.ganzzahl(1, 9999);
      if (!seeds.includes(seed)) seeds.push(seed);
    }
    seeds.slice(0, anzahl).forEach((seed, index) => folge.push({ kompetenz: k.id, index, seed }));
  }
  return folge;
}

/** Stufe aus richtigen und gestellten Aufgaben einer Kompetenz: alle → S, keine → Ü, dazwischen → T. */
export function bewerte(richtig, gesamt) {
  if (richtig >= gesamt) return "S";
  if (richtig === 0) return "Ü";
  return "T";
}

/** Bündelt [{kompetenz, korrekt}] zu {kompetenz: Stufe}. */
export function fasseZusammen(antworten) {
  const zaehler = {};
  for (const { kompetenz, korrekt } of antworten) {
    zaehler[kompetenz] ??= { richtig: 0, gesamt: 0 };
    zaehler[kompetenz].gesamt += 1;
    if (korrekt) zaehler[kompetenz].richtig += 1;
  }
  return Object.fromEntries(Object.entries(zaehler).map(([id, z]) => [id, bewerte(z.richtig, z.gesamt)]));
}

/** Eine Zeile, die das Kind dem Tutor schickt: "Test Nr. 4711 (<App-Titel>, Schnelltest): 1 ✓ 2 ✓ 3 ✗ …". */
export function ergebnisZeile(nr, modus, ergebnis, kompetenzen, appTitel) {
  const teile = kompetenzen.map((k) => `${k.nr} ${SYMBOLE[ergebnis[k.id]] ?? "–"}`);
  return `Test Nr. ${nr} (${appTitel}, ${MODUS_NAMEN[modus] ?? MODUS_NAMEN.voll}): ${teile.join(" ")}`;
}

/** Link, der denselben Test noch einmal öffnet. */
export function testLink(nr, modus) {
  return `test.html?nr=${nr}&modus=${modus in MODI ? modus : "voll"}`;
}

/** ISO-Datum → "23.09.2026" (Ortszeit); leer bei Unsinn. */
export function formatDatum(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const zwei = (n) => String(n).padStart(2, "0");
  return `${zwei(d.getDate())}.${zwei(d.getMonth() + 1)}.${d.getFullYear()}`;
}
