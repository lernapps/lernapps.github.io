/*
 * Eingabefelder einer Aufgabe: bauen, auslesen, markieren — ohne Feedback, Tipp oder Lösung. Kein Fachwissen. Generisch.
 * Feldtypen (aufgabe.felder[i].typ):
 *   "zahl" (Standard)  { id, label, einheit?, art?, stellen?, hinweis?, nurZahl? }  Einheit rechts, Rundungshinweis darunter
 *   "bruch" | "term"   { id, label, hinweis? }            Textfeld für 3/4, 0,75, 75 % oder 1/2*3/4 (siehe bruch.js)
 * Zahlen-, Bruch- und Termfelder zeigen beim Tippen eines Terms dessen Wert ("= 30 €", "≈ 3,33"), siehe zahlantwort.js.
 *   "variablenterm"    { id, label, hinweis? }            Textfeld für Terme mit Variablen, z. B. x^2 + 6x + 9 (termantwort.js);
 *                      die Vorschau zeigt den gelesenen Term ("Gelesen: x² + 6x + 9") oder eine kurze Syntaxmeldung.
 *   "auswahl"          { id, label, optionen: [{ wert, text }] }
 *   "radio"            { id, label, optionen: [{ wert, text | html }] }
 * "html" (Aufgabentext, Radio-Option) und die Zeilen von aufgabe.rechenweg dürfen nur <strong>…</strong> enthalten; jedes
 * andere Markup erscheint als Text. Nichts davon wird als HTML geparst (Bedrohung T-003), siehe zerlegeHervorhebung.
 * Tabelle: aufgabe.tabelle = [{ links, rechts } | { links, feld: feldId }] stellt Felder in eine Tabelle (z. B. Dreisatz).
 */

import { vorschau, HINWEIS_FEHLER } from "./zahlantwort.js";
import { termVorschau, TERM_HINWEIS_FEHLER } from "./termantwort.js";

/**
 * @typedef {import("./zahlantwort.js").Zahloptionen} Zahloptionen
 * @typedef {{ wert: string, text?: string, html?: string }} Option
 * @typedef {{ id: string, label: string, hinweis?: string }} Feldbasis
 * @typedef {Feldbasis & Zahloptionen & { typ?: "zahl" }} Zahlfeld
 * Je Feldtyp ein eigenes Unionsglied, damit tsc in baueFeld über feld.typ verengt.
 * @typedef {Feldbasis & Zahloptionen & ({ typ: "bruch" } | { typ: "term" } | { typ: "variablenterm" })} Termfeld
 * @typedef {Feldbasis & { optionen: Option[] } & ({ typ: "auswahl" } | { typ: "radio" })} Auswahlfeld
 * Eingabefeld einer Aufgabe, Feldtypen siehe oben.
 * @typedef {Zahlfeld | Termfeld | Auswahlfeld} Feld
 * @typedef {{ links: string, rechts?: string, feld?: string }} Tabellenzeile
 */
/**
 * Aufgabe, wie sie ein Generator liefert (erzeugeAufgabe). Weitere Eigenschaften gehören dem Generator (z. B. fürs Bild).
 * @typedef {object} Aufgabe
 * @property {string} [thema] Kompetenz-id; im Test Pflicht (testaufgaben.js)
 * @property {string} [text] Aufgabentext
 * @property {string} [html] Aufgabentext, darf <strong>…</strong> enthalten
 * @property {Feld[]} felder
 * @property {Tabellenzeile[]} [tabelle]
 * @property {string} tipp
 * @property {string[]} rechenweg Lösungsschritte, dürfen <strong>…</strong> enthalten
 * @property {number} [seed] Aufgabennummer; setzt der Kern nach dem Erzeugen
 */
/** Aufgabe, nachdem der Kern ihre Nummer gesetzt hat. @typedef {Aufgabe & { seed: number }} NummerierteAufgabe */
/** Eingaben des Kindes: { feldId: Text }. @typedef {Record<string, string>} Antworten */

const VORSCHAU_VERZOEGERUNG_MS = 150;

/**
 * @template {keyof HTMLElementTagNameMap} K
 * @param {K} tag
 * @param {Record<string, string | boolean | undefined>} [attrs] true = leeres Attribut, false/undefined = weglassen, text = Textinhalt
 * @param {(Node | string)[]} [kinder]
 * @returns {HTMLElementTagNameMap[K]}
 */
export function el(tag, attrs = {}, kinder = []) {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === "text") e.textContent = /** @type {string} */ (v);
    else if (v !== undefined && v !== false) e.setAttribute(k, v === true ? "" : v);
  }
  for (const kind of kinder) e.append(kind);
  return e;
}

/** Zerlegt einen Generator-Text in Abschnitte { text, fett }: nur <strong>…</strong> wird fett, alles andere bleibt Text.
 * @param {unknown} text */
export function zerlegeHervorhebung(text) {
  return String(text ?? "").split(/<strong>([\s\S]*?)<\/strong>/)
    .map((teil, i) => ({ text: teil, fett: i % 2 === 1 }))
    .filter((abschnitt) => abschnitt.text !== "");
}

/** DOM-Knoten zu zerlegeHervorhebung: Textknoten und <strong>-Elemente, ohne HTML zu parsen.
 * @param {unknown} text @returns {(HTMLElement | string)[]} */
export function hervorgehoben(text) {
  return zerlegeHervorhebung(text).map((a) => (a.fett ? el("strong", { text: a.text }) : a.text));
}

/** Live-Vorschau unter dem Feld: zeigt den Wert eines Terms oder Bruchs, verzögert während des Tippens. */
/**
 * @param {HTMLInputElement} input @param {Zahloptionen} feld @param {string} id
 * @param {(text: string) => string} [zeige]
 */
function mitVorschau(input, feld, id, zeige = (text) => vorschau(text, feld)) {
  const anzeige = el("span", { class: "eingabe-vorschau", id: `${id}-vorschau`, "aria-live": "polite" });
  /** @type {ReturnType<typeof setTimeout> | undefined} */
  let timer;
  input.addEventListener("input", () => {
    clearTimeout(timer);
    timer = setTimeout(() => { anzeige.textContent = zeige(input.value); }, VORSCHAU_VERZOEGERUNG_MS);
  });
  return anzeige;
}

/** @param {Zahlfeld} feld @param {string} praefix */
function feldZahl(feld, praefix) {
  const id = `${praefix}-${feld.id}`;
  const beschreibung = [`${id}-einheit`, feld.hinweis ? `${id}-hinweis` : ""].filter(Boolean).join(" ");
  // Außer bei nurZahl sind Brüche und Terme erlaubt – dafür braucht es "/" und "*" auf der Handytastatur.
  const nurZiffern = feld.nurZahl || !feld.art;
  const input = el("input", {
    type: "text", id, name: feld.id, inputmode: nurZiffern ? "decimal" : "text", autocomplete: "off", spellcheck: "false",
    "aria-describedby": beschreibung,
  });
  const einheit = el("span", { class: "einheit", id: `${id}-einheit`, text: feld.einheit || "" });
  /** @type {HTMLElement[]} */
  const kinder = [el("label", { for: id, text: feld.label }), el("div", { class: "eingabe" }, [input, einheit])];
  if (feld.hinweis) kinder.push(el("span", { class: "eingabe-hinweis", id: `${id}-hinweis`, text: feld.hinweis }));
  if (!feld.nurZahl) kinder.push(mitVorschau(input, feld, id));
  return el("div", { class: "feld", "data-feld": feld.id }, kinder);
}

/** @type {Record<Termfeld["typ"], string>} */
const HINWEISE = {
  bruch: "z. B. 3/4, 0,75 oder 75 %", term: "z. B. 1/2*3/4 oder 3/8", variablenterm: "z. B. x^2 + 6x + 9 oder (a+b)(a-b)",
};

/** @param {Termfeld} feld @param {string} praefix */
function feldTerm(feld, praefix) {
  const id = `${praefix}-${feld.id}`;
  const variablen = feld.typ === "variablenterm";
  const input = el("input", {
    type: "text", id, name: feld.id, inputmode: "text", autocomplete: "off", spellcheck: "false", "aria-describedby": `${id}-hinweis`,
    autocapitalize: variablen ? "none" : undefined,
  });
  const hinweis = el("span", { class: "eingabe-hinweis", id: `${id}-hinweis`, text: feld.hinweis ?? HINWEISE[feld.typ] });
  return el("div", { class: "feld", "data-feld": feld.id }, [
    el("label", { for: id, text: feld.label }), el("div", { class: "eingabe" }, [input]), hinweis, mitVorschau(input, feld, id, variablen ? termVorschau : undefined),
  ]);
}

/** @param {Auswahlfeld} feld @param {string} praefix */
function feldAuswahl(feld, praefix) {
  const id = `${praefix}-${feld.id}`;
  const select = el("select", { id, name: feld.id }, [
    el("option", { value: "", text: "Bitte wählen …" }),
    ...feld.optionen.map((o) => el("option", { value: o.wert, text: o.text })),
  ]);
  return el("div", { class: "feld", "data-feld": feld.id }, [el("label", { for: id, text: feld.label }), select]);
}

/** @param {Auswahlfeld} feld @param {string} praefix */
function feldRadio(feld, praefix) {
  const gruppe = el("fieldset", { class: "feld", "data-feld": feld.id }, [el("legend", { text: feld.label })]);
  feld.optionen.forEach((o, i) => {
    const id = `${praefix}-${feld.id}-${i}`;
    gruppe.append(el("label", { for: id }, [
      el("input", { type: "radio", id, name: feld.id, value: o.wert }),
      el("span", {}, o.html ? hervorgehoben(o.html) : [o.text ?? ""]),
    ]));
  });
  return gruppe;
}

/** @param {Feld} feld @param {string} praefix @returns {HTMLElement} */
export function baueFeld(feld, praefix) {
  if (feld.typ === "auswahl") return feldAuswahl(feld, praefix);
  if (feld.typ === "radio") return feldRadio(feld, praefix);
  if (feld.typ === "bruch" || feld.typ === "term" || feld.typ === "variablenterm") return feldTerm(feld, praefix);
  return feldZahl(feld, praefix);
}

/** Tabelle (z. B. Dreisatz): Zeilen mit festem Text oder einem Eingabefeld.
 * @param {Aufgabe & { tabelle: Tabellenzeile[] }} aufgabe @param {string} praefix */
export function baueTabelle(aufgabe, praefix) {
  const zeilen = aufgabe.tabelle.map((zeile) => {
    /** @type {HTMLElement} */
    let rechts = el("span", { text: zeile.rechts });
    if (zeile.feld) {
      // Jede Tabellenzeile mit feld verweist auf ein Feld der Aufgabe (Vertrag des Generators).
      rechts = baueFeld(/** @type {Feld} */ (aufgabe.felder.find((f) => f.id === zeile.feld)), praefix);
      rechts.querySelector("label")?.classList.add("nur-vorlesen");
    }
    return el("tr", {}, [el("th", { scope: "row", text: zeile.links }), el("td", {}, [rechts])]);
  });
  return el("table", { class: "feldtabelle" }, [el("tbody", {}, zeilen)]);
}

/** Füllt `felder` mit allen Eingaben der Aufgabe (Tabelle zuerst, dann die übrigen Felder).
 * @param {HTMLElement} felder @param {Aufgabe} aufgabe @param {string} praefix */
export function zeigeEingaben(felder, aufgabe, praefix) {
  felder.replaceChildren();
  if (aufgabe.tabelle) felder.append(baueTabelle(/** @type {Aufgabe & { tabelle: Tabellenzeile[] }} */ (aufgabe), praefix));
  const inTabelle = new Set((aufgabe.tabelle || []).map((z) => z.feld));
  for (const feld of aufgabe.felder) {
    if (!inTabelle.has(feld.id)) felder.append(baueFeld(feld, praefix));
  }
  felder.classList.toggle("nebeneinander", aufgabe.felder.length > 1 && !aufgabe.tabelle);
}

/** Schreibt den Aufgabentext (HTML, wenn vorhanden, sonst Text).
 * @param {HTMLElement} element @param {Aufgabe} aufgabe */
export function zeigeAufgabentext(element, aufgabe) {
  element.replaceChildren(...(aufgabe.html ? hervorgehoben(aufgabe.html) : [aufgabe.text ?? ""]));
}

/**
 * Liest die Antworten aus dem Formular: { feldId: Text }.
 * @param {HTMLFormElement} form @param {Aufgabe} aufgabe @returns {Antworten}
 */
export function lieseAntworten(form, aufgabe) {
  /** @type {Antworten} */
  const antworten = {};
  const daten = new FormData(form);
  for (const feld of aufgabe.felder) {
    // Das Formular hat keine Datei-Felder, jeder Wert ist Text.
    antworten[feld.id] = /** @type {string} */ (daten.get(feld.id) ?? "");
  }
  return antworten;
}

/** Färbt jedes Feld nach dem Prüfergebnis (Hinweise neutral, nicht rot) und setzt aria-invalid für Screenreader.
 * @param {HTMLElement} felder @param {Aufgabe} aufgabe @param {import("./pruefung.js").Pruefergebnis} ergebnis */
export function markiereFelder(felder, aufgabe, ergebnis) {
  for (const feld of aufgabe.felder) {
    const box = felder.querySelector(`[data-feld="${feld.id}"]`);
    const teil = ergebnis.felder?.[feld.id];
    if (!box || !teil) continue;
    // Ohne fehler (undefined) findet includes nichts – das ist gewollt; die Listen enthalten nur Text.
    const hinweis = HINWEIS_FEHLER.includes(/** @type {string} */ (teil.fehler))
      || TERM_HINWEIS_FEHLER.includes(/** @type {string} */ (teil.fehler));
    const falsch = teil.korrekt === false && !hinweis;
    box.classList.toggle("richtig", teil.korrekt === true);
    box.classList.toggle("falsch", falsch);
    box.classList.toggle("hinweis", hinweis);
    box.querySelectorAll("input:not([type=radio]), select").forEach((e) => e.setAttribute("aria-invalid", falsch ? "true" : "false"));
  }
}
