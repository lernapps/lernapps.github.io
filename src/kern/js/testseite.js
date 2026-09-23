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

/** app: APP, kompetenzen: KOMPETENZEN aus js/app.config.js; generatoren: { kompetenzId: Generator-Modul }. */
export function starteTestseite({ app, kompetenzen, generatoren }) {
  const KOMPETENZEN = nummeriere(kompetenzen);
  const { speichereTest } = erzeugeSpeicher(app.id);
  const query = window.location.search;
  const nr = leseSeed(query) ?? zufaelligeAufgabennummer();
  let modus = leseModus(query);
  let folge = [];
  let antworten = [];
  let position = 0;
  let aufgabe;

  const $ = (selektor) => document.querySelector(selektor);
  const start = $("[data-start]");
  const aufgabeBox = $("[data-aufgabe]");
  const ergebnisBox = $("[data-ergebnis]");
  const stand = $("[data-stand]");
  const kompetenzP = $("[data-kompetenz]");
  const text = $("[data-aufgabe-text]");
  const felder = $("[data-felder]");
  const bild = $("[data-test-bild]");
  const form = aufgabeBox.querySelector("form");

  $("[data-test-nr]").textContent = String(nr);
  for (const zahl of document.querySelectorAll("[data-anzahl]")) {
    const n = KOMPETENZEN.length * (MODI[zahl.dataset.anzahl] ?? MODI.voll);
    zahl.textContent = `${n} ${n === 1 ? "Aufgabe" : "Aufgaben"}`;
  }

  function merkeUrl() {
    try { history.replaceState(null, "", testLink(nr, modus)); } catch { /* egal */ }
  }

  function zeigeAufgabe() {
    const { kompetenz, seed } = folge[position];
    const k = KOMPETENZEN.find((x) => x.id === kompetenz);
    aufgabe = erzeugeTestaufgabe(generatoren, kompetenz, erzeugeZufall(seed));
    stand.textContent = `Aufgabe ${position + 1} von ${folge.length}`;
    kompetenzP.textContent = `Kompetenz ${k.nr}: ${k.titel}`;
    zeigeAufgabentext(text, aufgabe);
    zeigeBild(aufgabe);
    zeigeEingaben(felder, aufgabe, "test");
    form.querySelector("input, select")?.focus({ preventScroll: true });
    window.scrollTo({ top: 0 });
  }

  function zeigeBild(aufgabe) {
    const zeichne = bildFuer(generatoren, aufgabe);
    if (!bild) return;
    bild.hidden = !zeichne;
    const svg = bild.querySelector("svg");
    svg.replaceChildren();
    if (zeichne) zeichne(svg, aufgabe);
  }

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
    const zeile = $("[data-ergebnis-zeile]");
    zeile.value = ergebnisZeile(nr, modus, ergebnis, KOMPETENZEN, app.titel);
    $("[data-speicherhinweis]").textContent = gespeichert
      ? "Das Ergebnis steht jetzt auch in deiner Checkliste – nur in diesem Browser."
      : "Konnte das Ergebnis nicht speichern (Browser-Speicher gesperrt). Kopier dir die Zeile.";
    $("[data-nochmal]").setAttribute("href", testLink(zufaelligeAufgabennummer(), modus));
    ergebnisBox.querySelector("h2").focus?.({ preventScroll: true });
    window.scrollTo({ top: 0 });
  }

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

  for (const knopf of start.querySelectorAll("button[data-modus]")) {
    knopf.classList.toggle("primaer", knopf.dataset.modus === modus);
    knopf.addEventListener("click", () => starte(knopf.dataset.modus));
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
    const zeile = $("[data-ergebnis-zeile]");
    kopiereText(ev.currentTarget, zeile.value, zeile);
  });

  document.title = `Test Nr. ${nr} (${MODUS_NAMEN[modus]}) – ${app.titel}`;
}
