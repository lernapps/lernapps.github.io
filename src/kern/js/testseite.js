/*
 * Testseite: Aufgabenfolge aus der Testnummer abarbeiten, am Ende je Kompetenz bewerten und das Ergebnis merken. Generisch.
 * Die Seite übergibt App, Kompetenzen und die statisch importierten Generatoren (Dependency Inversion).
 */
import { erzeugeZufall, leseSeed, zufaelligeAufgabennummer } from "./zufall.js";
import {
  nummeriere, MODI, MODUS_NAMEN, SYMBOLE, STUFEN_NAMEN, leseModus, testAufgaben, fasseZusammen, ergebnisZeile, testLink,
} from "./testablauf.js";
import { erzeugeTestaufgabe, pruefeTestaufgabe, istLeer, bildFuer } from "./testaufgaben.js";
import { el, zeigeEingaben, zeigeAufgabentext, lieseAntworten } from "./aufgabe-eingabe.js";
import { kopiereText } from "./aufgabenlink.js";
import { erzeugeSpeicher } from "./storage.js";
import { vomTutor, zurueckKnopf } from "./zurueck.js";

/**
 * app: APP, kompetenzen: KOMPETENZEN aus js/app.config.js; generatoren: { kompetenzId: Generator-Modul }.
 * @param {{ app: import("./seite.js").App, kompetenzen: readonly import("./testablauf.js").Kompetenz[],
 *   generatoren: import("./testaufgaben.js").Generatoren }} seite
 */
export function starteTestseite({ app, kompetenzen, generatoren }) {
  const KOMPETENZEN = nummeriere(kompetenzen);
  const { speichereTest } = erzeugeSpeicher(app.id);
  const query = window.location.search;
  const nr = leseSeed(query) ?? zufaelligeAufgabennummer();
  let modus = leseModus(query);
  const tutor = vomTutor(query);
  /** @type {import("./testablauf.js").Testschritt[]} */
  let folge = [];
  /** @type {{ kompetenz: string, korrekt: boolean }[]} */
  let antworten = [];
  let position = 0;
  /** @type {import("./aufgabe-eingabe.js").NummerierteAufgabe} */
  let aufgabe;

  // test.njk hat alle diese Elemente; nur [data-test-bild] ist optional (siehe zeigeBild).
  /** @param {string} selektor */
  const $ = (selektor) => /** @type {HTMLElement} */ (document.querySelector(selektor));
  const start = $("[data-start]");
  const aufgabeBox = $("[data-aufgabe]");
  const ergebnisBox = $("[data-ergebnis]");
  const stand = $("[data-stand]");
  const kompetenzP = $("[data-kompetenz]");
  const text = $("[data-aufgabe-text]");
  const felder = $("[data-felder]");
  const bild = /** @type {HTMLElement | null} */ ($("[data-test-bild]"));
  const form = /** @type {HTMLFormElement} */ (aufgabeBox.querySelector("form"));

  $("[data-test-nr]").textContent = String(nr);
  for (const zahl of /** @type {NodeListOf<HTMLElement>} */ (document.querySelectorAll("[data-anzahl]"))) {
    const n = KOMPETENZEN.length * (MODI[/** @type {string} */ (zahl.dataset.anzahl)] ?? MODI.voll);
    zahl.textContent = `${n} ${n === 1 ? "Aufgabe" : "Aufgaben"}`;
  }

  function merkeUrl() {
    try { history.replaceState(null, "", testLink(nr, modus) + (tutor ? "&von=tutor" : "")); } catch { /* egal */ }
  }

  function zeigeAufgabe() {
    const { kompetenz, seed } = folge[position];
    // Die Folge entsteht aus KOMPETENZEN, jede Kompetenz-id ist darin.
    const k = /** @type {import("./testablauf.js").NummerierteKompetenz} */ (KOMPETENZEN.find((x) => x.id === kompetenz));
    aufgabe = erzeugeTestaufgabe(generatoren, kompetenz, erzeugeZufall(seed));
    stand.textContent = `Aufgabe ${position + 1} von ${folge.length}`;
    kompetenzP.textContent = `Kompetenz ${k.nr}: ${k.titel}`;
    zeigeAufgabentext(text, aufgabe);
    zeigeBild(aufgabe);
    zeigeEingaben(felder, aufgabe, "test");
    /** @type {HTMLElement | null} */ (form.querySelector("input, select"))?.focus({ preventScroll: true });
    window.scrollTo({ top: 0 });
  }

  /** @param {import("./aufgabe-eingabe.js").Aufgabe} aufgabe */
  function zeigeBild(aufgabe) {
    const zeichne = bildFuer(generatoren, aufgabe);
    if (!bild) return;
    bild.hidden = !zeichne;
    const svg = /** @type {SVGSVGElement} */ (bild.querySelector("svg")); // test.njk: [data-test-bild] enthält ein <svg>
    svg.replaceChildren();
    if (zeichne) zeichne(svg, aufgabe);
  }

  /** @param {import("./testablauf.js").NummerierteKompetenz} k @param {string | undefined} stufe */
  function ergebnisZeileFuer(k, stufe) {
    const symbol = stufe ? `${SYMBOLE[stufe]} ${STUFEN_NAMEN[stufe]}` : "–";
    return el("tr", {}, [
      el("td", {}, [`${k.nr}. `, el("a", { href: `${k.seite}#uebung`, text: k.titel })]),
      el("td", { class: `stufe stufe-${stufe || "leer"}`, text: symbol }),
    ]);
  }

  function zeigeErgebnis() {
    const ergebnis = fasseZusammen(antworten);
    const gespeichert = speichereTest({ nr, modus, datum: new Date().toISOString(), ergebnis });
    aufgabeBox.hidden = true;
    stand.hidden = true;
    ergebnisBox.hidden = false;
    $("[data-ergebnis-zeilen]").replaceChildren(...KOMPETENZEN.map((k) => ergebnisZeileFuer(k, ergebnis[k.id])));
    const zeile = /** @type {HTMLInputElement} */ ($("[data-ergebnis-zeile]"));
    zeile.value = ergebnisZeile(nr, modus, ergebnis, KOMPETENZEN, app.titel);
    $("[data-speicherhinweis]").textContent = gespeichert
      ? "Das Ergebnis steht jetzt auch in deiner Checkliste – nur in diesem Browser."
      : "Konnte das Ergebnis nicht speichern (Browser-Speicher gesperrt). Kopier dir die Zeile.";
    $("[data-nochmal]").setAttribute("href", testLink(zufaelligeAufgabennummer(), modus));
    /** @type {HTMLElement} */ (ergebnisBox.querySelector("h2")).focus?.({ preventScroll: true });
    window.scrollTo({ top: 0 });
  }

  /** @param {string} gewaehlterModus */
  function starte(gewaehlterModus) {
    modus = gewaehlterModus;
    folge = testAufgaben(nr, modus, KOMPETENZEN);
    antworten = [];
    position = 0;
    merkeUrl();
    start.hidden = true;
    ergebnisBox.hidden = true;
    aufgabeBox.hidden = false;
    stand.hidden = false;
    zeigeAufgabe();
  }

  for (const knopf of /** @type {NodeListOf<HTMLButtonElement>} */ (start.querySelectorAll("button[data-modus]"))) {
    knopf.classList.toggle("primaer", knopf.dataset.modus === modus);
    knopf.addEventListener("click", () => starte(/** @type {string} */ (knopf.dataset.modus)));
  }

  form.addEventListener("submit", (ev) => {
    ev.preventDefault();
    const eingaben = lieseAntworten(form, aufgabe);
    const leer = istLeer(eingaben);
    if (leer && !window.confirm("Ohne Antwort weiter?")) return;
    antworten.push({ kompetenz: folge[position].kompetenz, korrekt: !leer && pruefeTestaufgabe(generatoren, aufgabe, eingaben) });
    position += 1;
    if (position < folge.length) zeigeAufgabe();
    else zeigeErgebnis();
  });

  $("[data-kopieren]").addEventListener("click", (ev) => {
    const zeile = /** @type {HTMLInputElement} */ ($("[data-ergebnis-zeile]"));
    kopiereText(/** @type {HTMLElement} */ (ev.currentTarget), zeile.value, zeile);
  });

  if (tutor) {
    // ADR-021: neben der Ergebniszeile; ohne Zwischenablage markiert der Knopf das vorhandene Feld.
    const zeile = /** @type {HTMLInputElement} */ ($("[data-ergebnis-zeile]"));
    const [knopf, meldung] = zurueckKnopf({ zeile: () => zeile.value, feld: zeile });
    /** @type {HTMLElement} */ (zeile.parentElement).append(knopf);
    /** @type {HTMLElement} */ (zeile.parentElement).after(meldung);
  }

  document.title = `Test Nr. ${nr} (${MODUS_NAMEN[modus]}) – ${app.titel}`;
}
