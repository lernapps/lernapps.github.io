/*
 * Selbsteinschätzung und letztes Testergebnis im localStorage – der einzige Speicherort, immer mit try/catch. Generisch.
 * Der Kern kennt keine App: die Seite übergibt das Präfix (APP.id) an erzeugeSpeicher (Dependency Inversion).
 */
export const STUFEN = ["S", "T", "Ü"];

function speicher() {
  return typeof localStorage === "undefined" ? undefined : localStorage;
}

/**
 * Letztes Testergebnis im Speicher.
 * @typedef {{ nr: number, modus: string, datum: string, ergebnis: Record<string, string> }} Testergebnis
 */

/** @param {any} daten JSON aus dem Speicher, noch ungeprüft @returns {daten is Testergebnis} */
function gueltigerTest(daten) {
  return Boolean(daten) && typeof daten === "object" && Number.isInteger(daten.nr) && typeof daten.modus === "string"
    && typeof daten.datum === "string" && Boolean(daten.ergebnis) && typeof daten.ergebnis === "object";
}

/**
 * @param {string} schluessel @param {(daten: unknown) => boolean} gueltig @param {() => unknown} ersatz
 * @returns {any} die gespeicherten Daten, wenn gueltig sie annimmt, sonst ersatz()
 */
function lies(schluessel, gueltig, ersatz) {
  try {
    const roh = speicher()?.getItem(schluessel);
    const daten = roh ? JSON.parse(roh) : undefined;
    return gueltig(daten) ? daten : ersatz();
  } catch {
    return ersatz();
  }
}

/** @param {string} schluessel @param {unknown} daten */
function schreibe(schluessel, daten) {
  try {
    // Ohne localStorage wirft der Aufruf absichtlich; catch meldet dann false.
    /** @type {Storage} */ (speicher()).setItem(schluessel, JSON.stringify(daten));
    return true;
  } catch {
    return false;
  }
}

/** Speicherfunktionen für eine App; alle Schlüssel beginnen mit `<praefix>.`. */
/** @param {string} praefix */
export function erzeugeSpeicher(praefix) {
  if (typeof praefix !== "string" || praefix.trim() === "") throw new Error("Speicher braucht ein Präfix (APP.id)");
  const SCHLUESSEL = `${praefix}.selbsteinschaetzung`;
  const SCHLUESSEL_TEST = `${praefix}.test`;

  /** Liefert { kompetenz: "S" | "T" | "Ü" }; bei Fehlern ein leeres Objekt. */
  /** @type {() => Record<string, string>} */
  const ladeSelbsteinschaetzung = () => lies(SCHLUESSEL, (d) => Boolean(d) && typeof d === "object", () => ({}));

  /** Speichert eine Stufe für eine Kompetenz. Gibt true zurück, wenn es geklappt hat. */
  /** @param {string} kompetenz @param {string} stufe */
  function speichereSelbsteinschaetzung(kompetenz, stufe) {
    if (!STUFEN.includes(stufe)) return false;
    return schreibe(SCHLUESSEL, { ...ladeSelbsteinschaetzung(), [kompetenz]: stufe });
  }

  /** Liefert den letzten Test { nr, modus, datum, ergebnis: { kompetenz: Stufe } } oder undefined. */
  /** @type {() => Testergebnis | undefined} */
  const ladeLetztenTest = () => lies(SCHLUESSEL_TEST, gueltigerTest, () => undefined);

  /** Speichert das Testergebnis. Gibt true zurück, wenn es geklappt hat. */
  /** @param {unknown} daten */
  const speichereTest = (daten) => gueltigerTest(daten) && schreibe(SCHLUESSEL_TEST, daten);

  return { SCHLUESSEL, SCHLUESSEL_TEST, ladeSelbsteinschaetzung, speichereSelbsteinschaetzung, ladeLetztenTest, speichereTest };
}
