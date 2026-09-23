/* Übungsoberfläche: Aufgabe anzeigen, prüfen, Tipp, Lösung, Zähler. Felder baut aufgabe-eingabe.js; Fachwissen steckt in js/aufgaben/. Generisch. */
import { erzeugeZufall, zufaelligeAufgabennummer } from "./zufall.js";
import { aufgabenzeile, aufgabenHref } from "./aufgabenlink.js";
import { wirdGezaehlt, istHinweis } from "./pruefung.js";
import { LOESUNG_ZEIGEN, schalteLoesung } from "./loesung-schalter.js";
import { el, zeigeEingaben, zeigeAufgabentext, lieseAntworten, markiereFelder } from "./aufgabe-eingabe.js";

/**
 * Startet einen Trainer im Element `wurzel`.
 * modul: { erzeugeAufgabe(zufall, vorgaben), pruefeAntwort(aufgabe, antworten) }
 * seed: optionaler Seed für die erste Aufgabe; vorgaben: Zahlen aus der URL (nur erste Aufgabe).
 * visualisiere(aufgabe, ergebnis|undefined): Rückruf für die Grafik.
 */
export function starteTrainer({ wurzel, modul, seed, vorgaben = {}, visualisiere, seitenPfad = "" }) {
  const zaehler = { richtig: 0, gesamt: 0 };
  let aufgabe;
  let gezaehlt = false;
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
  wurzel.append(text, form, feedback, tippText, loesungText, zaehlerP, seedP);

  function zeige(neueAufgabe, eigeneVorgaben = {}) {
    aufgabe = neueAufgabe;
    gezaehlt = false;
    zeigeAufgabentext(text, aufgabe);
    zeigeEingaben(felder, aufgabe, praefix);
    feedback.textContent = "";
    feedback.className = "feedback";
    tippText.hidden = true;
    schalteLoesung(loesung, loesungText, false);
    seedP.replaceChildren(...aufgabenzeile(aufgabe.seed, aufgabenHref(seitenPfad, eigeneVorgaben, aufgabe.seed)));
    if (visualisiere) visualisiere(aufgabe, undefined);
    form.querySelector("input, select")?.focus({ preventScroll: true });
  }

  const markiere = (ergebnis) => markiereFelder(felder, aufgabe, ergebnis);

  function zaehle(korrekt) {
    if (gezaehlt) return;
    gezaehlt = true;
    zaehler.gesamt += 1;
    if (korrekt) zaehler.richtig += 1;
    richtigSpan.textContent = String(zaehler.richtig);
    gesamtSpan.textContent = String(zaehler.gesamt);
  }

  function erzeuge(eigenerSeed, eigeneVorgaben) {
    const zufall = erzeugeZufall(eigenerSeed);
    const a = modul.erzeugeAufgabe(zufall, eigeneVorgaben);
    a.seed = zufall.seed;
    return a;
  }

  form.addEventListener("submit", (ev) => {
    ev.preventDefault();
    const ergebnis = modul.pruefeAntwort(aufgabe, lieseAntworten(form, aufgabe));
    feedback.textContent = ergebnis.meldung;
    // Hinweise (zu grob gerundet, gemischte Zahl, Ausdruck statt Zahl) neutral statt rot; sie zählen nicht als Versuch.
    feedback.className = `feedback ${ergebnis.korrekt ? "richtig" : istHinweis(ergebnis) ? "hinweis" : "falsch"}`;
    markiere(ergebnis);
    if (wirdGezaehlt(ergebnis)) zaehle(ergebnis.korrekt);
    if (visualisiere) visualisiere(aufgabe, ergebnis);
  });
  tipp.addEventListener("click", () => {
    tippText.textContent = aufgabe.tipp;
    tippText.hidden = false;
  });
  loesung.addEventListener("click", () => {
    if (!loesungText.hidden) { schalteLoesung(loesung, loesungText, false); return; }
    zaehle(false);
    loesungText.replaceChildren(
      el("strong", { text: "Lösung" }),
      el("ol", { class: "rechenweg" }, aufgabe.rechenweg.map((s) => el("li", { html: s }))),
    );
    schalteLoesung(loesung, loesungText, true);
    if (visualisiere) visualisiere(aufgabe, { korrekt: true, loesungGezeigt: true });
  });
  neu.addEventListener("click", () => zeige(erzeuge(zufaelligeAufgabennummer(), {})));

  zeige(erzeuge(seed, vorgaben), vorgaben);
  return { neueAufgabe: () => neu.click(), aktuelle: () => aufgabe };
}
