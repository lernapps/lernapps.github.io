/*
 * Gemeinsame Helfer der Zufall-Generatoren: Wahrscheinlichkeitsfeld, Prüfung nach der Rundungsregel des Kerns,
 * Versuch aus den Vorgaben (URL-Parameter), Texte. Reine Funktionen, kein DOM.
 * Vorgaben-Namen sind öffentlicher Vertrag (llms.txt): experiment, urne, rad, zuege, modus, muenze, wuerfel, ereignis, art …
 */
import { formatBruch, formatAlle, istGleich } from "../../../kern/js/bruch.js";
import { zahlenfeld, rundungsHinweis } from "../../../kern/js/zahlantwort.js";
import { pruefeBruchEingabe, ergebnisFuer } from "../../../kern/js/pruefung.js";
import { experimentAusVorgaben, urne, muenze, wuerfelSechs } from "../modell/experimente.js";
import { baueBaum, zweigeEntlang } from "../modell/baum.js";

/** Jedes Wahrscheinlichkeitsfeld: Bruch bevorzugt, sonst auf zwei Nachkommastellen runden. */
export const FELD_WAHRSCHEINLICHKEIT = Object.freeze({ art: "zahl", stellen: 2, bruchZuerst: true });
export const BEISPIEL = "z. B. 1/6, 0,17 oder 17 %";
export const MELDUNG_UNLESBAR = "Das konnte ich nicht lesen. Schreib einen Bruch wie 1/6, eine Dezimalzahl wie 0,17 oder Prozent wie 17 %.";
export const MELDUNG_FALSCH = "Das stimmt noch nicht. Schau dir den Tipp an oder rechne noch einmal.";

/** Die Urnen, aus denen der Zufall wählt, wenn die URL keine vorgibt. */
export const URNEN_VORLAGEN = ["3r2b1g", "2r3b", "4r1b", "2r2b2g", "5r3b", "1r2b3g", "3r3b", "2r1b1n", "4r2g"];
/** URL-Parameter der Baum-Seiten. */
export const VERSUCH_ZAHLEN = ["zuege", "muenze", "wuerfel"];
export const VERSUCH_TEXTE = ["experiment", "urne", "modus", "wuerfel"];

/** Eingabefeld für eine Wahrscheinlichkeit mit Beispiel und (falls nötig) Rundungshinweis. */
export function wahrscheinlichkeitsFeld(id, label, loesung, beispiel = BEISPIEL) {
  const rundung = rundungsHinweis(FELD_WAHRSCHEINLICHKEIT, loesung);
  return zahlenfeld({ id, label, ...FELD_WAHRSCHEINLICHKEIT, hinweis: rundung ? `${beispiel}. ${rundung}` : beispiel }, loesung);
}

/** Prüft eine Eingabe gegen einen Bruch: { korrekt, fehler, wert (Bruch oder NaN), typ, meldung? }. */
export function pruefeWahrscheinlichkeit(eingabe, loesung) {
  return pruefeBruchEingabe(eingabe ?? "", loesung, FELD_WAHRSCHEINLICHKEIT);
}

/** true, wenn die (lesbare) Eingabe genau den Bruch `b` trifft. */
export function trifft(teil, b) {
  return Boolean(teil.bruch) && istGleich(teil.bruch, b);
}

/** Text hinter "Richtig!": alle Schreibweisen der Lösung, bei gerundeter Eingabe mit "(gerundet)". */
export function richtigText(teil, loesung) {
  const gerundet = teil.typ === "dezimal" && !trifft(teil, loesung);
  return gerundet ? `(gerundet) Genau: ${formatAlle(loesung)}` : formatAlle(loesung);
}

/**
 * Ein Feld "antwort" gegen `loesung` prüfen. diagnosen: [{ fehler, passt(teil, eingabe), meldung }] – die erste
 * passende ersetzt "falsch" durch eine gezielte Rückmeldung.
 */
export function pruefeEinFeld(antworten, loesung, diagnosen = []) {
  const eingabe = antworten.antwort ?? "";
  const teil = pruefeWahrscheinlichkeit(eingabe, loesung);
  const meldungen = { "keine-zahl": MELDUNG_UNLESBAR, falsch: MELDUNG_FALSCH };
  let fehler = teil.fehler;
  if (fehler === "falsch") {
    const d = diagnosen.find((x) => x.passt(teil, eingabe));
    if (d) { fehler = d.fehler; meldungen[d.fehler] = d.meldung; }
  }
  return ergebnisFuer("antwort", teil, fehler, meldungen, richtigText(teil, loesung));
}

/** Ein Wert aus den Vorgaben oder der Standard. */
export function vorgabeOder(vorgaben, name, standard) {
  const v = vorgaben[name];
  return v === undefined || v === null || v === "" ? standard : v;
}

/** Zufallsversuch und Baum aus den Vorgaben; fehlende Angaben wählt der Zufall. */
export function versuchAusVorgaben(vorgaben, zufall, optionen = {}) {
  const kurz = ["muenze", "wuerfel"].find((k) => /^\d+$/.test(String(vorgaben[k] ?? "")));
  let exp = experimentAusVorgaben(vorgaben);
  let zuege = Number(vorgaben.zuege) || (kurz ? Number(vorgaben[kurz]) : 0);
  let modus = vorgaben.modus;
  if (!exp) {
    const wahl = zufall.wahl(["urne", "urne", "muenze", "wuerfel"]);
    exp = wahl === "urne" ? urne(zufall.wahl(URNEN_VORLAGEN)) : wahl === "muenze" ? muenze() : wuerfelSechs();
  }
  if (![2, 3].includes(zuege)) zuege = optionen.zuegeStandard || zufall.wahl([2, 2, 3]);
  if (!["mit", "ohne"].includes(modus)) modus = exp.typ === "urne" ? zufall.wahl(["mit", "ohne"]) : "mit";
  const mitZuruecklegen = modus !== "ohne" || !exp.ohneZuruecklegenMoeglich;
  return { exp, zuege, mitZuruecklegen, baum: baueBaum(exp, zuege, mitZuruecklegen) };
}

export function versuchText(exp, zuege, mitZuruecklegen) {
  const male = zuege === 2 ? "zweimal" : `${zuege}-mal`;
  if (exp.typ === "urne") {
    const inhalt = exp.ergebnisse.map((e) => `${e.anzahl} ${e.name}e`).join(", ");
    return `In einer Urne liegen ${inhalt} Kugeln. Du ziehst ${male} nacheinander ${mitZuruecklegen ? "mit" : "ohne"} Zurücklegen.`;
  }
  if (exp.typ === "muenze") return `Du wirfst eine Münze ${male}.`;
  return `Du würfelst ${male}. Es zählt nur: 6 oder keine 6.`;
}

/** Name einer Stufe: Aus der Urne wird gezogen, Münze und Würfel werden geworfen, das Glücksrad gedreht. */
export function stufenWort(exp) {
  return exp.typ === "urne" ? "Zug" : exp.typ === "gluecksrad" ? "Drehung" : "Wurf";
}

export function zweigBruch(knoten) { return `${knoten.anzahl}/${knoten.gesamt}`; }

export function pfadTerm(knoten, baum) {
  return zweigeEntlang(baum, knoten.pfad).map(zweigBruch).join(" · ");
}

export { formatBruch };
