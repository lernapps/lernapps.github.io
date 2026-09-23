/*
 * Selbsteinschätzung und letztes Testergebnis im localStorage – der einzige Speicherort, immer mit try/catch. Generisch.
 * Der Kern kennt keine App: die Seite übergibt das Präfix (APP.id) an erzeugeSpeicher (Dependency Inversion).
 */
export const STUFEN = ["S", "T", "Ü"];

function speicher() {
  return typeof localStorage === "undefined" ? undefined : localStorage;
}

function gueltigerTest(daten) {
  return Boolean(daten) && typeof daten === "object" && Number.isInteger(daten.nr) && typeof daten.modus === "string"
    && typeof daten.datum === "string" && Boolean(daten.ergebnis) && typeof daten.ergebnis === "object";
}

function lies(schluessel, gueltig, ersatz) {
  try {
    const roh = speicher()?.getItem(schluessel);
    const daten = roh ? JSON.parse(roh) : undefined;
    return gueltig(daten) ? daten : ersatz();
  } catch {
    return ersatz();
  }
}

function schreibe(schluessel, daten) {
  try {
    speicher().setItem(schluessel, JSON.stringify(daten));
    return true;
  } catch {
    return false;
  }
}

/** Speicherfunktionen für eine App; alle Schlüssel beginnen mit `<praefix>.`. */
export function erzeugeSpeicher(praefix) {
  if (typeof praefix !== "string" || praefix.trim() === "") throw new Error("Speicher braucht ein Präfix (APP.id)");
  const SCHLUESSEL = `${praefix}.selbsteinschaetzung`;
  const SCHLUESSEL_TEST = `${praefix}.test`;

  /** Liefert { kompetenz: "S" | "T" | "Ü" }; bei Fehlern ein leeres Objekt. */
  const ladeSelbsteinschaetzung = () => lies(SCHLUESSEL, (d) => Boolean(d) && typeof d === "object", () => ({}));

  /** Speichert eine Stufe für eine Kompetenz. Gibt true zurück, wenn es geklappt hat. */
  function speichereSelbsteinschaetzung(kompetenz, stufe) {
    if (!STUFEN.includes(stufe)) return false;
    return schreibe(SCHLUESSEL, { ...ladeSelbsteinschaetzung(), [kompetenz]: stufe });
  }

  /** Liefert den letzten Test { nr, modus, datum, ergebnis: { kompetenz: Stufe } } oder undefined. */
  const ladeLetztenTest = () => lies(SCHLUESSEL_TEST, gueltigerTest, () => undefined);

  /** Speichert das Testergebnis. Gibt true zurück, wenn es geklappt hat. */
  const speichereTest = (daten) => gueltigerTest(daten) && schreibe(SCHLUESSEL_TEST, daten);

  return { SCHLUESSEL, SCHLUESSEL_TEST, ladeSelbsteinschaetzung, speichereSelbsteinschaetzung, ladeLetztenTest, speichereTest };
}
