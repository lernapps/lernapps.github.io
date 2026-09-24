/* Aufgaben: Prozentwert berechnen — W = G · p / 100. Reine Funktionen, kein DOM. */
import { formatZahl, gleichheitszeichen, runde } from "../../../kern/js/zahlen.js";
import { multipliziere, dividiere, subtrahiere, bruch } from "../../../kern/js/bruch.js";
import { zahlenfeld, pruefeZahlAntwort, passtZu } from "../../../kern/js/zahlantwort.js";
import {
  erzeugeTripel, waehleKontext, RABATTE, passenderKontext, mitEinheit, formatWert, alsBruch, artFuer, ergebnisFuer,
} from "./gemeinsam.js";

export const THEMA = "prozentwert";
// URL-Parameter (öffentlicher Vertrag, in llms.txt dokumentiert); der Kern liest sie mit leseVorgaben.
export const URL_ZAHLEN = ["g", "p"];
export const URL_TEXTE = [];
// Plausible Zahlen für das Ding im Text (L-011).
const BEREICHE = { preis: { min: 150, max: 1500, saetze: RABATTE } };

const TEXTE = {
  preis: (g, p) => `Ein Fahrrad kostet ${g}. Im Angebot gibt es ${p} Rabatt. Wie viel Euro sparst du?`,
  klasse: (g, p) => `In einer Klasse sind ${g}. ${p} von ihnen fahren mit dem Rad zur Schule. Wie viele Schüler sind das?`,
  umfrage: (g, p) => `Bei einer Umfrage wurden ${g} befragt. ${p} davon lesen täglich Nachrichten. Wie viele Personen sind das?`,
  akku: (g, p) => `Ein Handy-Akku fasst ${g} (Milliamperestunden: so viel Ladung speichert der Akku). Er ist noch zu ${p} geladen. Wie viel mAh sind noch drin?`,
  sport: (g, p) => `Beim Basketball wirft Lina ${g} auf den Korb. ${p} davon treffen. Wie viele Treffer sind das?`,
  neutral: (g, p) => `Berechne ${p} von ${g}.`,
};

/**
 * Erzeugt eine Prozentwert-Aufgabe. Vorgaben {g, p} aus der URL werden übernommen,
 * wenn beide vorhanden sind; sonst werden schöne Zufallszahlen gewählt.
 */
export function erzeugeAufgabe(zufall, vorgaben = {}) {
  let kontext = waehleKontext(zufall, undefined, BEREICHE);
  let { grundwert, prozentsatz, prozentwert } = erzeugeTripel(zufall, kontext);
  if (vorgaben.g && vorgaben.p) {
    grundwert = vorgaben.g;
    prozentsatz = vorgaben.p;
    prozentwert = runde(grundwert * prozentsatz / 100, 2);
    kontext = passenderKontext(zufall, grundwert, undefined, BEREICHE);
  }
  // Gefragt sind Treffer, nicht Würfe (L-018): Die Antwort hat die Einheit des Gesuchten.
  const einheit = kontext.einheit;
  const wEinheit = kontext.id === "sport" ? "Treffer" : einheit;
  const exakt = dividiere(multipliziere(alsBruch(grundwert), alsBruch(prozentsatz)), bruch(100));
  const text = TEXTE[kontext.id](mitEinheit(grundwert, einheit), mitEinheit(prozentsatz, "%"));
  return {
    thema: "prozentwert",
    kontext: kontext.id,
    text,
    grundwert,
    prozentsatz,
    prozentwert,
    einheit,
    wEinheit,
    exakt,
    gesucht: "prozentwert",
    felder: [zahlenfeld({ id: "prozentwert", label: "Prozentwert W", einheit: wEinheit, art: artFuer(einheit) }, exakt)],
    loesung: { prozentwert },
    tipp: `Der Grundwert ist das Ganze: ${mitEinheit(grundwert, einheit)} sind 100\u00a0%. `
      + `Rechne erst 1\u00a0% aus (Grundwert geteilt durch 100) und dann mal ${formatZahl(prozentsatz)}.`,
    rechenweg: [
      "W = G · p / 100",
      `W = ${formatWert(grundwert, einheit)} · ${formatZahl(prozentsatz)} / 100`,
      `W ${gleichheitszeichen(exakt.z / exakt.n, prozentwert)} ${mitEinheit(prozentwert, wEinheit)}`,
    ],
  };
}

const MELDUNGEN = {
  "keine-zahl": "Bitte gib eine Zahl ein, zum Beispiel 12,5.",
  "prozent-statt-dezimal": "Du hast vergessen, durch 100 zu teilen: 12\u00a0% sind 12/100 = 0,12.",
  "rest-statt-anteil": "Du hast den Rest ausgerechnet, nicht den Anteil. Gefragt ist der Prozentwert selbst.",
  "falsch": "Das stimmt noch nicht. Rechne noch einmal: erst 1\u00a0%, dann den Prozentsatz mal nehmen.",
};

/** Prüft die Eingabe nach der Rundungsregel und erkennt typische Fehler. */
export function pruefeAntwort(aufgabe, antworten) {
  const feld = aufgabe.felder[0];
  const eingabe = antworten.prozentwert;
  const ergebnis = pruefeZahlAntwort(eingabe, aufgabe.exakt, feld);
  const passt = (x) => passtZu(eingabe, x, { art: feld.art });
  let fehler = ergebnis.fehler;
  if (fehler === "falsch") {
    if (passt(multipliziere(aufgabe.exakt, bruch(100)))) fehler = "prozent-statt-dezimal";
    else if (passt(subtrahiere(alsBruch(aufgabe.grundwert), aufgabe.exakt))) fehler = "rest-statt-anteil";
  }
  return ergebnisFuer("prozentwert", ergebnis, fehler, MELDUNGEN, `${mitEinheit(aufgabe.prozentwert, aufgabe.wEinheit ?? aufgabe.einheit)}.`);
}
