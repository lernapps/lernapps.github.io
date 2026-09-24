/* Aufgaben: Prozentsatz berechnen — p = W / G · 100. Reine Funktionen, kein DOM. */
import { formatZahl, gleichheitszeichen, runde } from "../../../kern/js/zahlen.js";
import { multipliziere, dividiere, bruch } from "../../../kern/js/bruch.js";
import { zahlenfeld, pruefeZahlAntwort, passtZu } from "../../../kern/js/zahlantwort.js";
import {
  erzeugeTripel, waehleKontext, passenderKontext, mitEinheit, formatWert, ergebnisFuer, MELDUNG_KEINE_ZAHL, alsBruch,
} from "./gemeinsam.js";

export const THEMA = "prozentsatz";
// URL-Parameter (öffentlicher Vertrag, in llms.txt dokumentiert); der Kern liest sie mit leseVorgaben.
export const URL_ZAHLEN = ["g", "w"];
export const URL_TEXTE = [];

const TEXTE = {
  preis: (g, w) => `Eine Jacke kostet ${g}. Der Rabatt beträgt ${w}. Wie viel Prozent Rabatt sind das?`,
  klasse: (g, w) => `In einer Klasse sind ${g}. ${w} davon haben ein Haustier. Wie viel Prozent der Klasse sind das?`,
  umfrage: (g, w) => `${g} wurden befragt, ${w} davon mögen Pizza am liebsten. Wie viel Prozent sind das?`,
  akku: (g, w) => `Ein Akku fasst ${g}. Er ist noch mit ${w} geladen. Wie viel Prozent sind das?`,
  sport: (g, w) => `Tom wirft ${g} auf den Korb, ${w} davon treffen. Wie viel Prozent seiner Würfe treffen?`,
  neutral: (g, w) => `Wie viel Prozent sind ${w} von ${g}?`,
};

/** Erzeugt eine Prozentsatz-Aufgabe; Vorgaben {g, w} aus der URL werden übernommen. */
export function erzeugeAufgabe(zufall, vorgaben = {}) {
  let kontext = waehleKontext(zufall);
  let { grundwert, prozentsatz, prozentwert } = erzeugeTripel(zufall, kontext);
  if (vorgaben.g && vorgaben.w) {
    grundwert = vorgaben.g;
    prozentwert = vorgaben.w;
    prozentsatz = runde(prozentwert / grundwert * 100, 2);
    kontext = passenderKontext(zufall, grundwert);
  }
  const einheit = kontext.einheit;
  const wEinheit = kontext.id === "sport" ? "Treffer" : einheit;
  const exakt = multipliziere(dividiere(alsBruch(prozentwert), alsBruch(grundwert)), bruch(100));
  const text = TEXTE[kontext.id](mitEinheit(grundwert, einheit), mitEinheit(prozentwert, wEinheit));
  const zeichen = gleichheitszeichen(exakt.z / exakt.n, prozentsatz);
  return {
    thema: "prozentsatz",
    kontext: kontext.id,
    text,
    grundwert,
    prozentsatz,
    prozentwert,
    einheit,
    exakt,
    gesucht: "prozentsatz",
    felder: [zahlenfeld({ id: "prozentsatz", label: "Prozentsatz p", einheit: "%", art: "prozent" }, exakt)],
    loesung: { prozentsatz },
    tipp: `Der Grundwert ist das Ganze: ${mitEinheit(grundwert, einheit)} sind 100\u00a0%. `
      + `Teile den Teil (${mitEinheit(prozentwert, wEinheit)}) durch das Ganze und nimm das Ergebnis mal 100.`,
    rechenweg: [
      "p = W / G · 100",
      `p = ${formatWert(prozentwert, einheit)} / ${formatWert(grundwert, einheit)} · 100 ${zeichen} ${formatZahl(prozentsatz)}`,
      `p\u00a0% ${zeichen} ${formatZahl(prozentsatz)}\u00a0%`,
    ],
  };
}

const MELDUNGEN = {
  "keine-zahl": MELDUNG_KEINE_ZAHL,
  "dezimal-statt-prozent": "Das ist der Anteil als Dezimalzahl. Mal 100 nehmen, dann hast du den Prozentsatz.",
  "bezugsgroesse-verwechselt": "Du hast das Ganze durch den Teil geteilt. Richtig ist: Teil durch Ganzes (W / G).",
  "falsch": "Das stimmt noch nicht. Rechne: Teil geteilt durch Ganzes, dann mal 100.",
};

/** Prüft die Eingabe nach der Rundungsregel und erkennt typische Fehler. */
export function pruefeAntwort(aufgabe, antworten) {
  const feld = aufgabe.felder[0];
  const eingabe = antworten.prozentsatz;
  const ergebnis = pruefeZahlAntwort(eingabe, aufgabe.exakt, feld);
  const passt = (x) => passtZu(eingabe, x, { art: feld.art });
  let fehler = ergebnis.fehler;
  if (fehler === "falsch") {
    if (passt(dividiere(aufgabe.exakt, bruch(100)))) fehler = "dezimal-statt-prozent";
    else if (passt(aufgabe.grundwert / aufgabe.prozentwert * 100)) fehler = "bezugsgroesse-verwechselt";
  }
  return ergebnisFuer("prozentsatz", ergebnis, fehler, MELDUNGEN, `${formatZahl(aufgabe.prozentsatz)}\u00a0%.`);
}
