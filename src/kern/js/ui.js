/* Übungsoberfläche: Aufgabe anzeigen, prüfen, Tipp, Lösung, Zähler. Felder baut aufgabe-eingabe.js; Fachwissen steckt in js/aufgaben/. Generisch. */
import { erzeugeZufall, zufaelligeAufgabennummer } from "./zufall.js";
import { aufgabenzeile, aufgabenHref } from "./aufgabenlink.js";
import { wirdGezaehlt, istHinweis } from "./pruefung.js";
import { LOESUNG_ZEIGEN, schalteLoesung } from "./loesung-schalter.js";
import { bildBeschriftung } from "./aufgabenbild.js";
import { leeresSvg } from "./svg.js";
import { nachVersuch, uebungsStatus } from "./zurueck.js";
import { el, hervorgehoben, zeigeEingaben, zeigeAufgabentext, lieseAntworten, markiereFelder } from "./aufgabe-eingabe.js";

/**
 * @typedef {import("./aufgabe-eingabe.js").Aufgabe} Aufgabe
 * @typedef {import("./aufgabe-eingabe.js").NummerierteAufgabe} NummerierteAufgabe
 * @typedef {import("./aufgabe-eingabe.js").Antworten} Antworten
 * @typedef {import("./pruefung.js").Pruefergebnis} Pruefergebnis
 * @typedef {import("./aufgabenlink.js").Vorgaben} Vorgaben
 * @typedef {import("./zufall.js").Zufall} Zufall
 * Was das Bild zur Aufgabe über den Stand weiß: das Prüfergebnis oder, nach "Lösung zeigen", nur das.
 * @typedef {Pruefergebnis | { korrekt: true, loesungGezeigt: true }} Bildstand
 * @typedef {(svg: SVGElement, aufgabe: Aufgabe, ergebnis?: Bildstand, status?: (text: string) => void) => void} Zeichner
 */
/**
 * Generator einer Kompetenz (js/aufgaben/<id>.js), vom Kern nur über diese Schnittstelle benutzt.
 * @typedef {object} Generator
 * @property {(zufall: Zufall, vorgaben: Vorgaben) => Aufgabe} erzeugeAufgabe
 * @property {(aufgabe: Aufgabe, antworten: Antworten) => Pruefergebnis} pruefeAntwort
 * @property {(zufall: Zufall) => Vorgaben} [testVorgaben] erzwingt im Test bestimmte Aufgabentypen
 * @property {Zeichner} [zeichneBild] Bild zur Testaufgabe
 * @property {readonly string[]} [URL_ZAHLEN] URL-Parameter mit Zahlen, die er als Vorgaben annimmt
 * @property {readonly string[]} [URL_TEXTE] URL-Parameter mit Text, die er als Vorgaben annimmt
 */

/**
 * Startet einen Trainer im Element `wurzel`.
 * modul: { erzeugeAufgabe(zufall, vorgaben), pruefeAntwort(aufgabe, antworten) }
 * seed: optionaler Seed für die erste Aufgabe; vorgaben: Zahlen aus der URL (nur erste Aufgabe).
 * zeichne(svg, aufgabe, ergebnis|undefined, status): Zeichenfunktion für das Bild zur Aufgabe (optional); status(text)
 * schreibt eine Zeile unter das Bild (aria-live), z. B. "2 von 6 markiert";
 * bildHinweis: Satz hinter der Beschriftung (Front Matter bild.uebung, optional).
 * @param {{ wurzel: HTMLElement, modul: Generator, seed?: number, vorgaben?: Vorgaben, zeichne?: Zeichner,
 *   bildHinweis?: string, seitenPfad?: string }} auftrag
 */
export function starteTrainer({ wurzel, modul, seed, vorgaben = {}, zeichne, bildHinweis, seitenPfad = "" }) {
  const zaehler = { richtig: 0, gesamt: 0 };
  /** @type {NummerierteAufgabe} */
  let aufgabe;
  let gezaehlt = false;
  /** @type {import("./zurueck.js").Uebungsstand} */
  let stand = { versuche: 0 }; // Stand der aktuellen Aufgabe für die Ergebniszeile an den Tutor (zurueck.js)
  const praefix = wurzel.id || "trainer";

  wurzel.replaceChildren();
  const text = el("p", { class: "aufgabe-text", "data-aufgabe-text": true });
  const felder = el("div", { class: "felder" });
  const pruefen = el("button", { type: "submit", class: "primaer", text: "Prüfen" });
  const tipp = el("button", { type: "button", text: "Tipp" });
  const loesung = el("button", { type: "button", text: LOESUNG_ZEIGEN, "aria-expanded": "false" });
  const neu = el("button", { type: "button", text: "Neue Aufgabe" });
  const form = el("form", { novalidate: true }, [felder, el("div", { class: "aktionen" }, [pruefen, tipp, loesung, neu])]);
  const feedback = el("p", { class: "feedback", role: "status", "aria-live": "polite" });
  const tippText = el("div", { class: "tipp-text", hidden: true });
  const loesungText = el("div", { class: "loesung-text", hidden: true });
  const richtigSpan = el("span", { "data-richtig": true, text: "0" });
  const gesamtSpan = el("span", { "data-gesamt": true, text: "0" });
  const zaehlerP = el("p", { class: "zaehler" }, ["Richtig: ", richtigSpan, " von ", gesamtSpan, " Aufgaben in dieser Sitzung."]);
  const seedP = el("p", { class: "aufgabenlink" });
  const bildSvg = leeresSvg({ class: "vis" });
  const bildStatus = el("p", { class: "bild-status", "aria-live": "polite" });
  const bildText = el("figcaption", { class: "vis-beschriftung" });
  const bild = zeichne ? [el("figure", { class: "aufgabe-bild", id: "aufgabenbild" }, [bildSvg, bildStatus, bildText])] : [];
  wurzel.append(text, ...bild, form, feedback, tippText, loesungText, zaehlerP, seedP);

  /** @param {NummerierteAufgabe} a @param {Bildstand | undefined} ergebnis */
  function visualisiere(a, ergebnis) {
    if (!zeichne) return;
    bildSvg.replaceChildren();
    bildStatus.textContent = "";
    zeichne(bildSvg, a, ergebnis, (t) => { bildStatus.textContent = t; });
    bildText.textContent = bildBeschriftung(a, ergebnis, bildHinweis);
  }

  /** @param {NummerierteAufgabe} neueAufgabe @param {Vorgaben} [eigeneVorgaben] */
  function zeige(neueAufgabe, eigeneVorgaben = {}) {
    aufgabe = neueAufgabe;
    gezaehlt = false;
    stand = { versuche: 0 };
    zeigeAufgabentext(text, aufgabe);
    zeigeEingaben(felder, aufgabe, praefix);
    feedback.textContent = "";
    feedback.className = "feedback";
    tippText.hidden = true;
    schalteLoesung(loesung, loesungText, false);
    seedP.replaceChildren(...aufgabenzeile(aufgabe.seed, aufgabenHref(seitenPfad, eigeneVorgaben, aufgabe.seed)));
    visualisiere(aufgabe, undefined);
    /** @type {HTMLElement | null} */ (form.querySelector("input, select"))?.focus({ preventScroll: true });
  }

  /** @param {Pruefergebnis} ergebnis */
  const markiere = (ergebnis) => markiereFelder(felder, aufgabe, ergebnis);

  /** @param {boolean} korrekt */
  function zaehle(korrekt) {
    if (gezaehlt) return;
    gezaehlt = true;
    zaehler.gesamt += 1;
    if (korrekt) zaehler.richtig += 1;
    richtigSpan.textContent = String(zaehler.richtig);
    gesamtSpan.textContent = String(zaehler.gesamt);
  }

  /** @param {number | undefined} eigenerSeed @param {Vorgaben} eigeneVorgaben @returns {NummerierteAufgabe} */
  function erzeuge(eigenerSeed, eigeneVorgaben) {
    const zufall = erzeugeZufall(eigenerSeed);
    const a = modul.erzeugeAufgabe(zufall, eigeneVorgaben);
    a.seed = zufall.seed;
    return /** @type {NummerierteAufgabe} */ (a);
  }

  form.addEventListener("submit", (ev) => {
    ev.preventDefault();
    const ergebnis = modul.pruefeAntwort(aufgabe, lieseAntworten(form, aufgabe));
    feedback.textContent = ergebnis.meldung;
    // Hinweise (zu grob gerundet, gemischte Zahl, Ausdruck statt Zahl) neutral statt rot; sie zählen nicht als Versuch.
    feedback.className = `feedback ${ergebnis.korrekt ? "richtig" : istHinweis(ergebnis) ? "hinweis" : "falsch"}`;
    markiere(ergebnis);
    if (wirdGezaehlt(ergebnis)) {
      zaehle(ergebnis.korrekt);
      stand = nachVersuch(stand, ergebnis.korrekt);
    }
    visualisiere(aufgabe, ergebnis);
  });
  tipp.addEventListener("click", () => {
    tippText.replaceChildren(...hervorgehoben(aufgabe.tipp));
    tippText.hidden = false;
  });
  loesung.addEventListener("click", () => {
    if (!loesungText.hidden) { schalteLoesung(loesung, loesungText, false); return; }
    zaehle(false);
    if (!stand.richtigImVersuch) stand = { ...stand, loesungGezeigt: true };
    loesungText.replaceChildren(
      el("strong", { text: "Lösung" }),
      el("ol", { class: "rechenweg" }, aufgabe.rechenweg.map((s) => el("li", {}, hervorgehoben(s)))),
    );
    schalteLoesung(loesung, loesungText, true);
    visualisiere(aufgabe, { korrekt: true, loesungGezeigt: true });
  });
  neu.addEventListener("click", () => zeige(erzeuge(zufaelligeAufgabennummer(), {})));

  zeige(erzeuge(seed, vorgaben), vorgaben);
  return {
    neueAufgabe: () => neu.click(),
    aktuelle: () => aufgabe,
    stand: () => ({ nummer: aufgabe.seed, status: uebungsStatus(stand), sitzung: { ...zaehler } }),
  };
}
