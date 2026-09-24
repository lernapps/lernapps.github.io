/*
 * Bild zur Aufgabe in der Übung: Beschriftung passend zur aktuellen Aufgabe. Das Bild im Abschnitt "Bild dazu" zeigt
 * dagegen fest das Beispiel (zur Build-Zeit gezeichnet) und ändert sich nie. Generisch.
 */

/** aufgabe: mit seed; ergebnis: undefined | { korrekt, loesungGezeigt }; hinweis: optional (Front Matter bild.uebung).
 * @param {{ seed?: number }} aufgabe @param {{ korrekt?: boolean, loesungGezeigt?: boolean } | undefined} ergebnis
 * @param {string} [hinweis] */
export function bildBeschriftung(aufgabe, ergebnis, hinweis) {
  const zustand = ergebnis?.loesungGezeigt ? " – mit Lösung" : ergebnis?.korrekt ? " – gelöst" : "";
  const satz = `Bild zur Aufgabe Nr. ${aufgabe.seed}${zustand}.`;
  return hinweis ? `${satz} ${hinweis}` : satz;
}
