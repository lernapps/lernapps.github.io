/*
 * Testaufgaben: je Kompetenz ihr Generator, ohne Tipp und Lösung. Kein DOM. Generisch.
 * Die Generatoren übergibt die Testseite als { kompetenzId: modul } (statisch importiert, Dependency Inversion).
 * Ein Generator darf `testVorgaben(zufall)` exportieren, um im Test bestimmte Aufgabentypen zu erzwingen;
 * sonst bekommt er leere Vorgaben wie bei "Neue Aufgabe". Exportiert er `zeichneBild(svg, aufgabe)`, zeigt der Test
 * das Bild zur Aufgabe (ohne Lösung).
 */

/**
 * @typedef {import("./ui.js").Generator} Generator
 * @typedef {import("./aufgabe-eingabe.js").Aufgabe} Aufgabe
 * @typedef {Record<string, Generator>} Generatoren
 */

/** Erzeugt die Aufgabe einer Kompetenz aus dem Zufallsobjekt; `thema` muss die Kompetenz-id sein.
 * @param {Generatoren} generatoren @param {string} kompetenzId @param {import("./zufall.js").Zufall} zufall
 * @returns {import("./aufgabe-eingabe.js").NummerierteAufgabe}
 */
export function erzeugeTestaufgabe(generatoren, kompetenzId, zufall) {
  const modul = generatoren[kompetenzId];
  const aufgabe = modul.erzeugeAufgabe(zufall, modul.testVorgaben ? modul.testVorgaben(zufall) : {});
  aufgabe.seed = zufall.seed;
  return /** @type {import("./aufgabe-eingabe.js").NummerierteAufgabe} */ (aufgabe);
}

/**
 * true, wenn die Antwort vollständig richtig ist.
 * @param {Generatoren} generatoren @param {Aufgabe} aufgabe @param {import("./aufgabe-eingabe.js").Antworten} antworten
 */
export function pruefeTestaufgabe(generatoren, aufgabe, antworten) {
  return generatoren[/** @type {string} */ (aufgabe.thema)].pruefeAntwort(aufgabe, antworten).korrekt === true;
}

/** true, wenn in keinem Feld etwas steht. @param {import("./aufgabe-eingabe.js").Antworten} antworten */
export function istLeer(antworten) {
  return Object.values(antworten).every((w) => String(w ?? "").trim() === "");
}

/** Zeichenfunktion für das Bild einer Testaufgabe oder undefined, wenn der Generator keine exportiert.
 * @param {Generatoren} generatoren @param {Aufgabe} aufgabe */
export function bildFuer(generatoren, aufgabe) {
  return generatoren[/** @type {string} */ (aufgabe.thema)]?.zeichneBild;
}
