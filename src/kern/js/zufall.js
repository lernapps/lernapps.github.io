/* Kleiner, deterministischer Zufallsgenerator (mulberry32) für reproduzierbare Aufgaben. Generisch – nicht pro App ändern. */

/** @param {number} seed @returns {() => number} Zahlen in [0, 1) */
export function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Aufgabennummer, die das Kind vorlesen kann: ganze Zahl von 1 bis 9999. */
export function zufaelligeAufgabennummer() {
  return 1 + Math.floor(Math.random() * 9999);
}

/**
 * Deterministischer Zufall einer Aufgabe; Generatoren bekommen ihn als `zufall`.
 * @typedef {object} Zufall
 * @property {number} seed die Aufgabennummer
 * @property {() => number} zahl Zahl in [0, 1)
 * @property {(min: number, max: number) => number} ganzzahl ganze Zahl von min bis max (beide eingeschlossen)
 * @property {<T>(liste: readonly T[]) => T} wahl ein Element der Liste
 * @property {<T>(liste: readonly T[]) => T[]} mischen gemischte Kopie der Liste
 */

/** Liefert ein Zufallsobjekt. Ohne Seed wird eine zufällige Aufgabennummer gewählt. @param {number} [seed] @returns {Zufall} */
export function erzeugeZufall(seed) {
  const echterSeed = Number.isInteger(seed) ? seed : zufaelligeAufgabennummer();
  const naechste = mulberry32(echterSeed);
  return {
    seed: echterSeed,
    zahl: () => naechste(),
    /** @param {number} min @param {number} max */
    ganzzahl(min, max) {
      return min + Math.floor(naechste() * (max - min + 1));
    },
    /** @template T @param {readonly T[]} liste @returns {T} */
    wahl(liste) {
      return liste[Math.floor(naechste() * liste.length)];
    },
    /** @template T @param {readonly T[]} liste @returns {T[]} */
    mischen(liste) {
      const kopie = [...liste];
      for (let i = kopie.length - 1; i > 0; i--) {
        const j = Math.floor(naechste() * (i + 1));
        [kopie[i], kopie[j]] = [kopie[j], kopie[i]];
      }
      return kopie;
    },
  };
}

/**
 * Liest die Aufgabennummer aus einem Query-String: ?seed=<zahl> oder das Alias ?nr=<zahl>
 * (seed gewinnt). undefined, wenn nicht vorhanden oder ungültig.
 * @param {string | null | undefined} query @returns {number | undefined}
 */
export function leseSeed(query) {
  const params = new URLSearchParams(query || "");
  const roh = params.get("seed") ?? params.get("nr");
  if (roh === null || !/^\d+$/.test(roh.trim())) return undefined;
  return Number(roh);
}
