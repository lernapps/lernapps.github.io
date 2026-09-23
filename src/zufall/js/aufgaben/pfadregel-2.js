/*
 * Kompetenz 6: Zweite Pfadregel – Pfade eines Ereignisses addieren. art=pfade (Pfade anklicken, P(E) rechnen) oder
 * art=term (Term wählen); ohne art wählt der Zufall. Im Test immer art=pfade.
 * URL-Parameter (llms.txt): experiment, urne, zuege, modus, ereignis, art=pfade|term, Kurzformen muenze/wuerfel, seed/nr.
 */
import { aufgabePfade, aufgabeTerm, pruefePfade, pruefeTerm } from "./pfade.js";
import { VERSUCH_ZAHLEN, VERSUCH_TEXTE } from "./gemeinsam.js";

export { zeichnePfadregel2 as zeichneBild } from "../vis/pfadregel-2.js";

export const THEMA = "pfadregel-2";
export const URL_ZAHLEN = VERSUCH_ZAHLEN;
export const URL_TEXTE = [...VERSUCH_TEXTE, "ereignis", "art"];

export const testVorgaben = () => ({ art: "pfade" });

export function erzeugeAufgabe(zufall, vorgaben = {}) {
  const art = ["pfade", "term"].includes(vorgaben.art) ? vorgaben.art : zufall.wahl(["pfade", "term"]);
  return art === "term" ? aufgabeTerm(THEMA, zufall, vorgaben) : aufgabePfade(THEMA, zufall, vorgaben);
}

export function pruefeAntwort(aufgabe, antworten) {
  return aufgabe.art === "term" ? pruefeTerm(aufgabe, antworten) : pruefePfade(aufgabe, antworten);
}
