/* Aufgaben: Grundwert berechnen — G = W · 100 / p. Reine Funktionen, kein DOM. */
import { formatZahl, runde } from "../../../kern/js/zahlen.js";
import { multipliziere, dividiere, bruch } from "../../../kern/js/bruch.js";
import { zahlenfeld, pruefeZahlAntwort, passtZu } from "../../../kern/js/zahlantwort.js";
import {
  erzeugeTripel, waehleKontext, passenderKontext, mitEinheit, ergebnisFuer, MELDUNG_KEINE_ZAHL, alsBruch, artFuer,
} from "./gemeinsam.js";

export const THEMA = "grundwert";
// URL-Parameter (öffentlicher Vertrag, in llms.txt dokumentiert); der Kern liest sie mit leseVorgaben.
export const URL_ZAHLEN = ["w", "p"];
export const URL_TEXTE = [];

const TEXTE = {
  preis: (w, p) => `Beim Kauf eines Rollers sparst du ${w}. Das sind ${p} Rabatt. Wie viel hat der Roller vorher gekostet?`,
  klasse: (w, p) => `${w} einer Klasse spielen ein Instrument. Das sind ${p} der Klasse. Wie viele Schüler hat die Klasse?`,
  umfrage: (w, p) => `${w} haben bei einer Umfrage mit „Ja“ gestimmt. Das sind ${p} aller Befragten. Wie viele Personen wurden befragt?`,
  akku: (w, p) => `Im Akku sind noch ${w}. Das sind ${p} der vollen Ladung. Wie viel mAh fasst der Akku voll?`,
  sport: (w, p) => `Mia hat ${w} erzielt. Das sind ${p} ihrer Würfe. Wie oft hat sie geworfen?`,
  neutral: (w, p) => `${w} sind ${p} einer Zahl. Wie groß ist die Zahl?`,
};

const W_EINHEIT = { klasse: "Schüler", sport: "Treffer" };

/** Erzeugt eine Grundwert-Aufgabe; Vorgaben {w, p} aus der URL werden übernommen. */
export function erzeugeAufgabe(zufall, vorgaben = {}) {
  let kontext = waehleKontext(zufall);
  let { grundwert, prozentsatz, prozentwert } = erzeugeTripel(zufall, kontext);
  if (vorgaben.w && vorgaben.p) {
    prozentwert = vorgaben.w;
    prozentsatz = vorgaben.p;
    grundwert = runde(prozentwert * 100 / prozentsatz, 2);
    kontext = passenderKontext(zufall, grundwert);
  }
  const einheit = kontext.einheit;
  const wEinheit = W_EINHEIT[kontext.id] || einheit;
  const exakt = dividiere(multipliziere(alsBruch(prozentwert), bruch(100)), alsBruch(prozentsatz));
  const text = TEXTE[kontext.id](mitEinheit(prozentwert, wEinheit), mitEinheit(prozentsatz, "%"));
  return {
    thema: "grundwert",
    kontext: kontext.id,
    text,
    grundwert,
    prozentsatz,
    prozentwert,
    einheit,
    exakt,
    gesucht: "grundwert",
    felder: [zahlenfeld({ id: "grundwert", label: "Grundwert G", einheit, art: artFuer(einheit) }, exakt)],
    loesung: { grundwert },
    tipp: `Gesucht ist das Ganze (100 %). Du kennst ${formatZahl(prozentsatz)} %: das sind ${mitEinheit(prozentwert, wEinheit)}. `
      + `Rechne erst aus, was 1 % ist (durch ${formatZahl(prozentsatz)} teilen), dann mal 100.`,
    rechenweg: [
      "G = W · 100 / p",
      `G = ${formatZahl(prozentwert)} · 100 / ${formatZahl(prozentsatz)}`,
      `G = ${mitEinheit(grundwert, einheit)}`,
    ],
  };
}

const MELDUNGEN = {
  "keine-zahl": MELDUNG_KEINE_ZAHL,
  "prozentwert-statt-grundwert": "Du hast p % vom Prozentwert berechnet. Gesucht ist aber das Ganze, von dem der Prozentwert ein Teil ist.",
  "nur-ein-prozent": "Das ist erst 1 %. Jetzt noch mal 100 nehmen, dann hast du das Ganze.",
  "falsch": "Das stimmt noch nicht. Der Grundwert muss größer sein als der Prozentwert (bei p < 100 %).",
};

/** Prüft die Eingabe nach der Rundungsregel und erkennt typische Fehler. */
export function pruefeAntwort(aufgabe, antworten) {
  const feld = aufgabe.felder[0];
  const eingabe = antworten.grundwert;
  const ergebnis = pruefeZahlAntwort(eingabe, aufgabe.exakt, feld);
  const passt = (x) => passtZu(eingabe, x, { art: feld.art });
  let fehler = ergebnis.fehler;
  if (fehler === "falsch") {
    if (passt(aufgabe.prozentwert * aufgabe.prozentsatz / 100)) fehler = "prozentwert-statt-grundwert";
    else if (passt(dividiere(aufgabe.exakt, bruch(100)))) fehler = "nur-ein-prozent";
  }
  return ergebnisFuer("grundwert", ergebnis, fehler, MELDUNGEN, `${mitEinheit(aufgabe.grundwert, aufgabe.einheit)}.`);
}
