/*
 * "Zurück zu Claude" (ADR-021): Öffnet der KI-Tutor die App mit ?von=tutor in einem neuen Tab, zeigt die Seite einen
 * Knopf. Er kopiert eine Ergebniszeile, schließt den Tab mit window.close() und prüft danach, ob der Tab wirklich zu
 * ist – vorher lässt sich das nicht erkennen (document.referrer und window.opener helfen nicht). Bleibt der Tab offen,
 * sagt eine Zeile (aria-live), was zu tun ist. Die Zeile geht nur in die Zwischenablage, nie ins Netz. Generisch.
 */
/**
 * Stand der aktuellen Aufgabe für die Ergebniszeile.
 * @typedef {{ versuche?: number, richtigImVersuch?: number, loesungGezeigt?: boolean }} Uebungsstand
 */
export const WARTEZEIT_MS = 300;
/** Pause zwischen Kopieren und Schließen: Schloss der Tab sofort, verlor Headless-Chromium 6 von 20 Zeilen, mit 50 ms keine. */
export const PAUSE_VOR_SCHLIESSEN_MS = 100;
export const KNOPF_TEXT = "Zurück zu Claude";
export const MELDUNG_KOPIERT = "Ergebnis kopiert. Schließ diesen Tab und füge es bei Claude ein.";
export const MELDUNG_NICHT_KOPIERT = "Kopieren ging nicht. Kopier die markierte Zeile, schließ diesen Tab und füge sie bei Claude ein.";

/** true, wenn der Tutor die Seite geöffnet hat (`von=tutor`, genau so geschrieben). @param {string | null | undefined} query */
export function vomTutor(query) {
  return new URLSearchParams(query || "").get("von") === "tutor";
}

/** Stand der aktuellen Aufgabe als Text. stand: { versuche, richtigImVersuch?, loesungGezeigt? }. @param {Uebungsstand} stand */
export function uebungsStatus({ versuche = 0, richtigImVersuch, loesungGezeigt = false }) {
  if (richtigImVersuch) return `richtig im ${richtigImVersuch}. Versuch`;
  if (loesungGezeigt) return "Lösung angesehen";
  if (!versuche) return "noch nicht gelöst";
  return `noch nicht gelöst (${versuche} ${versuche === 1 ? "Versuch" : "Versuche"})`;
}

/** "Binomische Formeln, Kompetenz 2 „Erste binomische Formel“, Aufgabe Nr. 4: richtig im 2. Versuch (Sitzung: 3 von 4 richtig)".
 * @param {{ appTitel: string, kompetenz: { nr: number, titel: string }, nummer: number, status: string,
 *   sitzung?: { richtig: number, gesamt: number } }} zeile */
export function uebungsZeile({ appTitel, kompetenz, nummer, status, sitzung }) {
  const zusatz = sitzung?.gesamt ? ` (Sitzung: ${sitzung.richtig} von ${sitzung.gesamt} richtig)` : "";
  return `${appTitel}, Kompetenz ${kompetenz.nr} „${kompetenz.titel}“, Aufgabe Nr. ${nummer}: ${status}${zusatz}`;
}

/**
 * Ablauf beim Klick. Ohne kopierte Zeile schließt der Tab nicht (das Ergebnis wäre sonst weg): Das Feld zeigt die
 * Zeile markiert. Sonst nach PAUSE_VOR_SCHLIESSEN_MS window.close() und nach WARTEZEIT_MS die Prüfung, ob der Browser den Tab geschlossen hat.
 * Liefert "geschlossen", "offen" oder "feld". Alle Abhängigkeiten kommen herein (testbar ohne Browser).
 * @param {{ text: string, kopiere: (text: string) => Promise<boolean>, fenster: { close(): void, closed: boolean },
 *   zeigeMeldung: (text: string) => void, zeigeFeld: () => void, timer?: (tu: (wert?: unknown) => void, ms: number) => unknown }} ablauf
 * @returns {Promise<"geschlossen" | "offen" | "feld">}
 */
export async function zurueckZuClaude({ text, kopiere, fenster, zeigeMeldung, zeigeFeld, timer = setTimeout }) {
  if (!(await kopiere(text))) {
    zeigeFeld();
    zeigeMeldung(MELDUNG_NICHT_KOPIERT);
    return "feld";
  }
  await new Promise((weiter) => timer(weiter, PAUSE_VOR_SCHLIESSEN_MS));
  fenster.close();
  return new Promise((fertig) => {
    timer(() => {
      if (fenster.closed) return fertig("geschlossen");
      zeigeMeldung(MELDUNG_KOPIERT);
      return fertig("offen");
    }, WARTEZEIT_MS);
  });
}

/** @param {string} text */
async function inZwischenablage(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

/**
 * Baut Knopf, Meldungszeile (aria-live) und – falls die Seite keines hat – ein schreibgeschütztes Feld für die Zeile.
 * zeile(): liefert die aktuelle Ergebniszeile. Rückgabe: Elemente zum Einhängen, in dieser Reihenfolge.
 * @param {{ zeile: () => string, feld?: HTMLInputElement }} optionen @returns {HTMLElement[]}
 */
export function zurueckKnopf({ zeile, feld }) {
  const knopf = document.createElement("button");
  knopf.type = "button";
  knopf.className = "zurueck-knopf";
  knopf.textContent = KNOPF_TEXT;
  const meldung = document.createElement("p");
  meldung.className = "zurueck-meldung";
  meldung.setAttribute("role", "status");
  meldung.setAttribute("aria-live", "polite");
  let eigenesFeld;
  if (!feld) {
    eigenesFeld = document.createElement("input");
    eigenesFeld.type = "text";
    eigenesFeld.readOnly = true;
    eigenesFeld.hidden = true;
    eigenesFeld.className = "zurueck-zeile";
    eigenesFeld.setAttribute("aria-label", "Ergebniszeile für Claude");
  }
  const textFeld = /** @type {HTMLInputElement} */ (feld ?? eigenesFeld); // ohne feld gibt es eigenesFeld
  knopf.addEventListener("click", () => {
    const text = zeile();
    meldung.textContent = "";
    zurueckZuClaude({
      text,
      kopiere: inZwischenablage,
      fenster: window,
      zeigeMeldung: (t) => { meldung.textContent = t; },
      zeigeFeld: () => {
        textFeld.value = text;
        textFeld.hidden = false;
        textFeld.focus();
        textFeld.select();
      },
    });
  });
  return eigenesFeld ? [knopf, eigenesFeld, meldung] : [knopf, meldung];
}

/** Stand nach einem gewerteten Versuch (pruefung.js: wirdGezaehlt). Nach "richtig" oder angesehener Lösung zählt nichts mehr.
 * @param {Uebungsstand} stand @param {boolean} korrekt @returns {Uebungsstand} */
export function nachVersuch(stand, korrekt) {
  if (stand.richtigImVersuch || stand.loesungGezeigt) return stand;
  const versuche = (stand.versuche || 0) + 1;
  return korrekt ? { ...stand, versuche, richtigImVersuch: versuche } : { ...stand, versuche };
}
