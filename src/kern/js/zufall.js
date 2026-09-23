/* Kleiner, deterministischer Zufallsgenerator (mulberry32) für reproduzierbare Aufgaben. Generisch – nicht pro App ändern. */

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

/** Liefert ein Zufallsobjekt. Ohne Seed wird eine zufällige Aufgabennummer gewählt. */
export function erzeugeZufall(seed) {
  const echterSeed = Number.isInteger(seed) ? seed : zufaelligeAufgabennummer();
  const naechste = mulberry32(echterSeed);
  return {
    seed: echterSeed,
    zahl: () => naechste(),
    ganzzahl(min, max) {
      return min + Math.floor(naechste() * (max - min + 1));
    },
    wahl(liste) {
      return liste[Math.floor(naechste() * liste.length)];
    },
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
 */
export function leseSeed(query) {
  const params = new URLSearchParams(query || "");
  const roh = params.get("seed") ?? params.get("nr");
  if (roh === null || !/^\d+$/.test(roh.trim())) return undefined;
  return Number(roh);
}
