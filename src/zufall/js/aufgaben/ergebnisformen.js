/*
 * Kompetenz 7: Wahrscheinlichkeiten als Produkt, Summe oder Potenz – den Term wählen, der P(E) berechnet.
 * Dieselbe Aufgabe wie pfadregel-2.html?art=term. URL-Parameter (llms.txt): experiment, urne, zuege, modus, ereignis, seed/nr.
 */
import { aufgabeTerm, pruefeTerm } from "./pfade.js";
import { VERSUCH_ZAHLEN, VERSUCH_TEXTE } from "./gemeinsam.js";

export { zeichnePfadregel2 as zeichneBild } from "../vis/pfadregel-2.js";

export const THEMA = "ergebnisformen";
export const URL_ZAHLEN = VERSUCH_ZAHLEN;
export const URL_TEXTE = [...VERSUCH_TEXTE, "ereignis"];

export const erzeugeAufgabe = (zufall, vorgaben = {}) => aufgabeTerm(THEMA, zufall, vorgaben);
export const pruefeAntwort = pruefeTerm;
