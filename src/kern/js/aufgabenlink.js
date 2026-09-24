// Zeile unter jeder Aufgabe: "Aufgabe Nr. N", Link zur Aufgabe und Knopf "Link kopieren".
// Die Nummer ist das, was Kind und Tutor sich sagen; der Link trägt sie als URL-Parameter.
// Außerdem: URL-Vorgaben lesen und Aufgabenlinks bauen. Generisch – nicht pro App ändern.
import { parseZahl } from "./zahlen.js";
import { leseSeed } from "./zufall.js";

/** Zahlen und Texte aus der URL für die erste Aufgabe. @typedef {Record<string, number | string>} Vorgaben */

const KOPIEREN = "Link kopieren";
const KOPIERT = "Kopiert";

/** @param {Node} element */
function markiereText(element) {
  const auswahl = window.getSelection?.();
  if (!auswahl) return;
  const bereich = document.createRange();
  bereich.selectNodeContents(element);
  auswahl.removeAllRanges();
  auswahl.addRange(bereich);
}

/** Kopiert einen Text in die Zwischenablage; ohne Zwischenablage wird `element` markiert, damit das Kind selbst kopieren kann.
 * @param {HTMLElement} knopf @param {string} text @param {Element & { select?: () => void }} element */
export async function kopiereText(knopf, text, element) {
  const vorher = knopf.textContent;
  try {
    await navigator.clipboard.writeText(text);
    knopf.textContent = KOPIERT;
    setTimeout(() => { knopf.textContent = vorher; }, 1500);
  } catch {
    if (element.select) element.select();
    else markiereText(element);
  }
}

/** Kopiert den absoluten Link in die Zwischenablage; ohne Zwischenablage wird der Linktext markiert.
 * @param {HTMLElement} knopf @param {HTMLAnchorElement} link */
export function kopiereLink(knopf, link) {
  return kopiereText(knopf, new URL(/** @type {string} */ (link.getAttribute("href")), window.location.href).href, link);
}

/** Liefert die Kinder für die Aufgabenzeile: Text, Link, Kopierknopf.
 * @param {number} nummer @param {string} href @returns {(string | HTMLElement)[]} */
export function aufgabenzeile(nummer, href) {
  const link = document.createElement("a");
  link.href = href;
  link.textContent = "Link zu dieser Aufgabe";
  const knopf = document.createElement("button");
  knopf.type = "button";
  knopf.textContent = KOPIEREN;
  knopf.addEventListener("click", () => kopiereLink(knopf, link));
  return [`Aufgabe Nr. ${nummer} · `, link, knopf];
}

/** Liest benannte URL-Parameter: `zahlen` müssen positive Zahlen sein, `texte` nur Kleinbuchstaben, Ziffern, Bindestrich (nicht vorn).
 * @param {string | null | undefined} query @param {readonly string[]} [zahlen] @param {readonly string[]} [texte] @returns {Vorgaben} */
export function leseVorgaben(query, zahlen = [], texte = []) {
  const params = new URLSearchParams(query || "");
  /** @type {Vorgaben} */
  const vorgaben = {};
  for (const name of zahlen) {
    const zahl = parseZahl(params.get(name));
    if (!Number.isNaN(zahl) && zahl > 0 && zahl < 1e9) vorgaben[name] = zahl;
  }
  for (const name of texte) {
    const roh = (params.get(name) || "").trim().toLowerCase();
    if (/^[a-z0-9][a-z0-9-]*$/.test(roh)) vorgaben[name] = roh;
  }
  return vorgaben;
}

/** Link zu einer Aufgabe: Vorgaben (Zahlen mit Komma) und die Aufgabennummer als `seed`.
 * @param {string} seitenPfad @param {Vorgaben} vorgaben @param {number} seed */
export function aufgabenHref(seitenPfad, vorgaben, seed) {
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(vorgaben)) params.set(k, String(v).replace(".", ","));
  params.set("seed", String(seed));
  return `${seitenPfad}?${params.toString()}`;
}

/** Anker, bei denen die Übung das Ziel ist; jeder andere Anker zeigt in die Erklärung. */
const UEBUNGS_ANKER = ["", "#uebung", "#aufgabenbild", "#trainer"];

/** Deep Link auf eine Aufgabe (Nummer oder gültiger Aufgabenparameter), Anker nicht in der Erklärung → Übung im Fokus.
 * @param {string | null | undefined} query @param {string} hash @param {readonly string[]} [zahlen] @param {readonly string[]} [texte] */
export function aufgabeImFokus(query, hash, zahlen = [], texte = []) {
  if (!UEBUNGS_ANKER.includes(hash || "")) return false;
  return leseSeed(query) !== undefined || Object.keys(leseVorgaben(query, zahlen, texte)).length > 0;
}
