/*
 * Kompetenz 8: „genau einmal“, „beide gleich“, „mindestens einmal“ in Pfade übersetzen – zwei Züge mit Zurücklegen,
 * die Urne passt zur Farbe im Ereignis. URL-Parameter (llms.txt) wie pfadregel-2.html ohne art; sie ersetzen die Zufallswahl.
 */
import { aufgabePfade, pruefePfade } from "./pfade.js";
import { VERSUCH_ZAHLEN, VERSUCH_TEXTE, URNEN_VORLAGEN } from "./gemeinsam.js";

export { zeichnePfadregel2 as zeichneBild } from "../vis/pfadregel-2.js";

export const THEMA = "pfade-uebersetzen";
export const URL_ZAHLEN = VERSUCH_ZAHLEN;
export const URL_TEXTE = [...VERSUCH_TEXTE, "ereignis"];

function uebersetzungsVorgaben(zufall) {
  const urne = zufall.wahl(URNEN_VORLAGEN);
  const farbe = urne.match(/\d+([a-z])/)[1];
  const ereignis = zufall.wahl([`genau1${farbe}`, "beidegleich", `mind1${farbe}`]);
  return { experiment: "urne", urne, zuege: 2, modus: "mit", ereignis };
}

export function erzeugeAufgabe(zufall, vorgaben = {}) {
  const eigene = Object.keys(vorgaben).length ? vorgaben : uebersetzungsVorgaben(zufall);
  return aufgabePfade(THEMA, zufall, eigene);
}

export const pruefeAntwort = pruefePfade;
