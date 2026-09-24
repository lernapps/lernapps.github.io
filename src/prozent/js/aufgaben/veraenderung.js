/* Aufgaben: prozentuale Zu- und Abnahme. Typ "neu": neuer Wert gesucht. Typ "alt": alter Wert gesucht. */
import { formatZahl, formatGenau, gleichheitszeichen, runde } from "../../../kern/js/zahlen.js";
import { addiere, subtrahiere, multipliziere, dividiere, bruch, EINS } from "../../../kern/js/bruch.js";
import { zahlenfeld, pruefeZahlAntwort, passtZu } from "../../../kern/js/zahlantwort.js";
import {
  waehleGrundwert, mitEinheit, formatWert, ergebnisFuer, MELDUNG_KEINE_ZAHL, PROZENTSAETZE, RABATTE, alsBruch, artFuer,
} from "./gemeinsam.js";

export const THEMA = "veraenderung";
// URL-Parameter (öffentlicher Vertrag, in llms.txt dokumentiert); der Kern liest sie mit leseVorgaben.
export const URL_ZAHLEN = ["alt", "neu", "p"];
export const URL_TEXTE = ["richtung", "typ"];

const KONTEXTE = [
  { id: "ticket", einheit: "€", min: 20, max: 500, nachkomma: 1, schritt: 5, richtung: "plus",
    neu: (alt, p) => `Ein Konzertticket kostet ${alt}. Der Preis steigt um ${p}. Wie viel kostet es danach?`,
    alt: (neu, p) => `Der Preis eines Konzerttickets steigt um ${p}. Danach kostet es ${neu}. Wie viel hat es vorher gekostet?` },
  { id: "rabatt", einheit: "€", min: 20, max: 120, nachkomma: 1, schritt: 5, richtung: "minus", saetze: RABATTE,
    neu: (alt, p) => `Eine Hose kostet ${alt}. Im Ausverkauf gibt es ${p} Rabatt. Wie viel kostet sie jetzt?`,
    alt: (neu, p) => `Nach ${p} Rabatt kostet eine Hose ${neu}. Wie viel hat sie vorher gekostet?` },
  { id: "mwst", einheit: "€", min: 100, max: 1500, nachkomma: 0, schritt: 100, richtung: "plus", saetze: [19],
    neu: (alt) => `Ein Fahrrad kostet netto ${alt}. Dazu kommen 19\u00a0% Mehrwertsteuer. Wie viel kostet es brutto?`,
    alt: (neu) => `Ein Fahrrad kostet brutto ${neu}. Darin sind 19\u00a0% Mehrwertsteuer enthalten. Wie hoch ist der Nettopreis?` },
  { id: "gehalt", einheit: "€", min: 2000, max: 5000, nachkomma: 0, schritt: 100, richtung: "plus",
    neu: (alt, p) => `Frau Berg verdient ${alt} im Monat. Sie bekommt ${p} mehr. Wie viel verdient sie danach?`,
    alt: (neu, p) => `Nach einer Gehaltserhöhung um ${p} verdient Frau Berg ${neu} im Monat. Wie viel hat sie vorher verdient?` },
  { id: "verein", einheit: "Mitglieder", min: 50, max: 1000, nachkomma: 0, schritt: 10, richtung: "minus",
    neu: (alt, p) => `Ein Sportverein hat ${alt}. Im nächsten Jahr sinkt die Zahl um ${p}. Wie viele Mitglieder hat er dann?`,
    alt: (neu, p) => `Die Mitgliederzahl eines Sportvereins ist um ${p} gesunken. Jetzt hat er ${neu}. Wie viele Mitglieder hatte er vorher?` },
];
const NEUTRAL = {
  id: "neutral", einheit: "", nachkomma: 2,
  neu: (alt, p, r) => `Ein Wert von ${alt} wird um ${p} ${r === "plus" ? "erhöht" : "gesenkt"}. Wie groß ist der neue Wert?`,
  alt: (neu, p, r) => `Ein Wert wurde um ${p} ${r === "plus" ? "erhöht" : "gesenkt"} und beträgt jetzt ${neu}. Wie groß war er vorher?`,
};
const SAETZE = PROZENTSAETZE.filter((p) => p <= 50);

/**
 * Erzeugt eine Veränderungsaufgabe. Vorgaben: {alt, p, richtung} → Typ "neu";
 * {neu, p, richtung} → Typ "alt"; {typ} erzwingt den Typ mit Zufallszahlen.
 */
export function erzeugeAufgabe(zufall, vorgaben = {}) {
  let typ = vorgaben.typ === "alt" || vorgaben.typ === "neu" ? vorgaben.typ : zufall.wahl(["neu", "alt"]);
  let kontext = zufall.wahl(KONTEXTE);
  let richtung = kontext.richtung;
  let prozentsatz = zufall.wahl(kontext.saetze || SAETZE);
  let alt = waehleGrundwert(zufall, prozentsatz, kontext) ?? kontext.min;
  const faktor = (r, p) => (r === "plus" ? 1 + p / 100 : 1 - p / 100);
  let neu = runde(alt * faktor(richtung, prozentsatz), kontext.nachkomma);
  const vorgegeben = (vorgaben.alt || vorgaben.neu) && vorgaben.p;
  if (vorgegeben) {
    typ = vorgaben.alt ? "neu" : "alt";
    richtung = vorgaben.richtung === "plus" ? "plus" : "minus";
    prozentsatz = vorgaben.p;
    if (richtung === "minus" && prozentsatz >= 100) prozentsatz = 50;
    const passend = KONTEXTE.filter((k) => k.richtung === richtung && k.id !== "mwst");
    kontext = zufall.wahl(passend);
    if (vorgaben.alt) {
      alt = vorgaben.alt;
      neu = runde(alt * faktor(richtung, prozentsatz), 2);
    } else {
      neu = vorgaben.neu;
      alt = runde(neu / faktor(richtung, prozentsatz), 2);
    }
    if (alt < kontext.min || alt > kontext.max) kontext = { ...NEUTRAL, richtung };
  }
  const einheit = kontext.einheit;
  // Exakte Lösung aus den Zahlen, die im Aufgabentext stehen: Faktor 1 ± p/100 als Bruch.
  const anteil = dividiere(alsBruch(prozentsatz), bruch(100));
  const faktorExakt = richtung === "plus" ? addiere(EINS, anteil) : subtrahiere(EINS, anteil);
  const exakt = typ === "neu" ? multipliziere(alsBruch(alt), faktorExakt) : dividiere(alsBruch(neu), faktorExakt);
  const text = typ === "neu"
    ? kontext.neu(mitEinheit(alt, einheit), mitEinheit(prozentsatz, "%"), richtung)
    : kontext.alt(mitEinheit(neu, einheit), mitEinheit(prozentsatz, "%"), richtung);
  const vorzeichen = richtung === "plus" ? "+" : "−";
  // Der Faktor steht ungerundet (1,125, nicht 1,13): Das Kind rechnet mit genau dieser Zahl weiter (L-021).
  const f = formatGenau(faktor(richtung, prozentsatz));
  const ergebnis = typ === "neu" ? neu : alt;
  const zeichen = gleichheitszeichen(exakt.z / exakt.n, ergebnis);
  const rechenweg = typ === "neu"
    ? [`Neuer Wert = alter Wert · (1 ${vorzeichen} p/100)`, `Faktor: 1 ${vorzeichen} ${formatZahl(prozentsatz)}/100 = ${f}`,
      `${formatWert(alt, einheit)} · ${f} ${zeichen} ${mitEinheit(neu, einheit)}`]
    : [`Alter Wert = neuer Wert : (1 ${vorzeichen} p/100)`, `Faktor: 1 ${vorzeichen} ${formatZahl(prozentsatz)}/100 = ${f}`,
      `${formatWert(neu, einheit)} : ${f} ${zeichen} ${mitEinheit(alt, einheit)}`];
  const tipp = typ === "neu"
    ? `Der alte Wert (${mitEinheit(alt, einheit)}) ist 100\u00a0%. Nach der Änderung sind es ${richtung === "plus" ? 100 + prozentsatz : 100 - prozentsatz}\u00a0%. Rechne den Prozentwert aus und ${richtung === "plus" ? "addiere" : "subtrahiere"} ihn – oder nimm gleich den Faktor ${f}.`
    : `Vorsicht: Die ${formatZahl(prozentsatz)}\u00a0% beziehen sich auf den <strong>alten</strong> Wert, nicht auf ${mitEinheit(neu, einheit)}. Der neue Wert entspricht ${richtung === "plus" ? 100 + prozentsatz : 100 - prozentsatz}\u00a0%. Teile durch den Faktor ${f}.`;
  return {
    thema: "veraenderung", typ, kontext: kontext.id, text, alt, neu, prozentsatz, richtung, einheit, exakt,
    gesucht: typ,
    felder: [zahlenfeld({ id: typ, label: typ === "neu" ? "Neuer Wert" : "Alter Wert", einheit, art: artFuer(einheit) }, exakt)],
    loesung: { [typ]: typ === "neu" ? neu : alt },
    tipp,
    rechenweg,
  };
}

const MELDUNGEN = {
  "keine-zahl": MELDUNG_KEINE_ZAHL,
  "richtung-verwechselt": "Du hast in die falsche Richtung gerechnet. Lies noch einmal: steigt oder sinkt der Wert?",
  "nur-prozentwert": "Das ist nur die Veränderung (der Prozentwert). Gefragt ist der neue Wert: alter Wert plus/minus Veränderung.",
  "grundwert-neuer-wert": "Die Prozente beziehen sich auf den alten Wert, nicht auf den neuen. Der neue Wert ist nicht 100\u00a0%.",
  "falsch": "Das stimmt noch nicht. Bestimme zuerst den Faktor (1 plus/minus p/100) und rechne dann.",
};

/** Prüft die Eingabe nach der Rundungsregel und erkennt typische Fehler. */
export function pruefeAntwort(aufgabe, antworten) {
  const { typ, alt, neu, prozentsatz, richtung } = aufgabe;
  const erwartet = typ === "neu" ? neu : alt;
  const feld = aufgabe.felder[0];
  const eingabe = antworten[typ];
  const ergebnis = pruefeZahlAntwort(eingabe, aufgabe.exakt, feld);
  const passt = (x) => passtZu(eingabe, x, { art: feld.art });
  const anteil = (basis) => multipliziere(alsBruch(basis), dividiere(alsBruch(prozentsatz), bruch(100)));
  const gegenRichtung = (basis) => (richtung === "plus" ? subtrahiere : addiere)(alsBruch(basis), anteil(basis));
  let fehler = ergebnis.fehler;
  if (fehler === "falsch") {
    if (typ === "neu" && passt(gegenRichtung(alt))) fehler = "richtung-verwechselt";
    else if (typ === "neu" && passt(anteil(alt))) fehler = "nur-prozentwert";
    else if (typ === "alt" && passt(gegenRichtung(neu))) fehler = "grundwert-neuer-wert";
  }
  return ergebnisFuer(typ, ergebnis, fehler, MELDUNGEN, `${mitEinheit(erwartet, aufgabe.einheit)}.`);
}
