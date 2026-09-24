/* Aufgaben: Grundwert berechnen — G = W · 100 / p. Reine Funktionen, kein DOM. */
import { formatZahl, gleichheitszeichen, runde } from "../../../kern/js/zahlen.js";
import { multipliziere, dividiere, bruch } from "../../../kern/js/bruch.js";
import { zahlenfeld, pruefeZahlAntwort, passtZu } from "../../../kern/js/zahlantwort.js";
import {
  erzeugeTripel, waehleKontext, RABATTE, passenderKontext, mitEinheit, formatWert, ergebnisFuer, MELDUNG_KEINE_ZAHL, alsBruch, artFuer,
} from "./gemeinsam.js";

export const THEMA = "grundwert";
// URL-Parameter (öffentlicher Vertrag, in llms.txt dokumentiert); der Kern liest sie mit leseVorgaben.
export const URL_ZAHLEN = ["w", "p"];
export const URL_TEXTE = [];
// Plausible Zahlen für das Ding im Text (L-011).
const BEREICHE = { preis: { min: 50, max: 500, saetze: RABATTE } };

const TEXTE = {
  preis: (w, p) => `Beim Kauf eines Rollers sparst du ${w}. Das sind ${p} Rabatt. Wie viel hat der Roller vorher gekostet?`,
  klasse: (w, p) => `${w} einer Klasse spielen ein Instrument. Das sind ${p} der Klasse. Wie viele Schüler hat die Klasse?`,
  umfrage: (w, p) => `${w} haben bei einer Umfrage mit „Ja“ gestimmt. Das sind ${p} aller Befragten. Wie viele Personen wurden befragt?`,
  akku: (w, p) => `Im Akku sind noch ${w} (Milliamperestunden: so viel Ladung ist gespeichert). Das sind ${p} der vollen Ladung. Wie viel mAh fasst der Akku voll?`,
  sport: (w, p) => `Mia hat ${w} erzielt. Das sind ${p} ihrer Würfe. Wie oft hat sie geworfen?`,
  neutral: (w, p) => `${w} sind ${p} einer Zahl. Wie groß ist die Zahl?`,
};

const W_EINHEIT = { klasse: "Schüler", sport: "Treffer" };

/** Erzeugt eine Grundwert-Aufgabe; Vorgaben {w, p} aus der URL werden übernommen. */
export function erzeugeAufgabe(zufall, vorgaben = {}) {
  let kontext = waehleKontext(zufall, undefined, BEREICHE);
  let { grundwert, prozentsatz, prozentwert } = erzeugeTripel(zufall, kontext);
  if (vorgaben.w && vorgaben.p) {
    prozentwert = vorgaben.w;
    prozentsatz = vorgaben.p;
    grundwert = runde(prozentwert * 100 / prozentsatz, 2);
    kontext = passenderKontext(zufall, grundwert, undefined, BEREICHE);
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
    tipp: `Gesucht ist das Ganze (100\u00a0%). Du kennst ${formatZahl(prozentsatz)}\u00a0%: das sind ${mitEinheit(prozentwert, wEinheit)}. `
      + `Rechne erst aus, was 1\u00a0% ist (durch ${formatZahl(prozentsatz)} teilen), dann mal 100.`,
    rechenweg: [
      "G = W · 100 / p",
      `G = ${formatWert(prozentwert, einheit)} · 100 / ${formatZahl(prozentsatz)}`,
      `G ${gleichheitszeichen(exakt.z / exakt.n, grundwert)} ${mitEinheit(grundwert, einheit)}`,
    ],
  };
}

const MELDUNGEN = {
  "keine-zahl": MELDUNG_KEINE_ZAHL,
  "prozentwert-statt-grundwert": "Du hast p\u00a0% vom Prozentwert berechnet. Gesucht ist aber das Ganze, von dem der Prozentwert ein Teil ist.",
  "nur-ein-prozent": "Das ist erst 1\u00a0%. Jetzt noch mal 100 nehmen, dann hast du das Ganze.",
  "falsch": "Das stimmt noch nicht. Der Grundwert muss größer sein als der Prozentwert (bei p < 100\u00a0%).",
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
