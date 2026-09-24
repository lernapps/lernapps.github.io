/*
 * Kompetenz: Binome rückwärts – eine Summe als binomische Formel erkennen und als Produkt schreiben
 * (x² + 6x + 9 = (x + 3)², x² − 16 = (x + 4)(x − 4)) und Lücken ergänzen (x² + □x + 25, x² + 8x + □).
 * Reine Funktionen, kein DOM, deterministisch über `zufall`. Vertrag: js/aufgaben/beispiel.js der Lern-App-Vorlage.
 * Faktorisieren: Termfeld, Form "faktorisiert" und zusätzlich Binom-Struktur (istBinomProdukt) – 1·(x² + 6x + 9)
 * ist zwar ein Produkt, aber keine binomische Formel. Lücke: Zahlenfeld, nurZahl.
 * URL-Parameter (öffentlicher Vertrag, in llms.txt dokumentiert): typ = faktorisieren | luecke, formel = 1 | 2 | 3,
 * luecke = mitte | ende, m, n, var = x | a, glied = zahl | variable, seed.
 */
import { pruefeTermAntwort, MELDUNG_KEIN_VARIABLENTERM } from "../../../kern/js/termantwort.js";
import { zahlenfeld, pruefeZahlAntwort, passtZu } from "../../../kern/js/zahlantwort.js";
import { ergebnisFuer, MELDUNG_KEINE_ZAHL } from "../../../kern/js/pruefung.js";
import { glied, multipliziere, negiere, alsAnzeige, gliedAnzeige, binomAnzeige, binomEingabe, istBinomProdukt } from "./terme.js";
import { BINOM_URL_ZAHLEN, BINOM_URL_TEXTE, waehleBinom, diagnose, ganz, quadratAnzeige } from "./binom.js";

export const THEMA = "binome-rueckwaerts";
export const URL_ZAHLEN = ["formel", ...BINOM_URL_ZAHLEN];
export const URL_TEXTE = ["typ", "luecke", ...BINOM_URL_TEXTE];
const TYPEN = ["faktorisieren", "luecke"];
const LUECKEN = ["mitte", "ende"];
export const MELDUNG_NICHT_BINOM = "Der Term stimmt – schreib ihn als binomische Formel, z. B. (x + 3)² oder (x + 4)(x − 4).";

const mal = (g, k) => ({ ...g, k: g.k * k });
const variablenteil = (g) => (Object.keys(g.e).length ? gliedAnzeige({ ...g, k: 1 }) : "");

function faktorisieren(b, formel, summe, uu, vv) {
  const { u, v } = b;
  const mv = negiere([v])[0];
  const loesung = formel === 1 ? `${binomEingabe([u, v])}^2` : formel === 2 ? `${binomEingabe([u, mv])}^2` : `${binomEingabe([u, v])}${binomEingabe([u, mv])}`;
  const loesungAnzeige = formel === 1 ? `${binomAnzeige([u, v])}²` : formel === 2 ? `${binomAnzeige([u, mv])}²` : `${binomAnzeige([u, v])}${binomAnzeige([u, mv])}`;
  const quadrate = `${gliedAnzeige(uu)} = ${quadratAnzeige(u)} und ${gliedAnzeige(vv)} = ${quadratAnzeige(v)}, also a = ${gliedAnzeige(u)}, b = ${gliedAnzeige(v)}`;
  const mitte = mal(multipliziere([u], [v])[0], 2);
  return {
    text: `Schreib als Produkt mit einer binomischen Formel: ${alsAnzeige(summe)}`,
    felder: [{ id: "antwort", typ: "variablenterm", label: `${alsAnzeige(summe)} =`, hinweis: "Schreib ein Produkt, z. B. (x+3)^2 oder (x+4)(x-4)" }],
    loesung: { antwort: loesung },
    loesungAnzeige,
    tipp: formel === 3
      ? "Kein Mittelglied, dazwischen ein Minus: Das ist die 3. Formel. Welche Terme ergeben quadriert die beiden Glieder?"
      : "Welche Terme ergeben quadriert das erste und das letzte Glied? Prüf dann das Mittelglied: Ist es 2 · a · b? Sein Vorzeichen sagt dir, ob + oder −.",
    rechenweg: formel === 3
      ? [quadrate, "Kein Mittelglied und ein Minus dazwischen → 3. Formel: a² − b² = (a + b)(a − b)", `${alsAnzeige(summe)} = <strong>${loesungAnzeige}</strong>`]
      : [quadrate, `Probe Mittelglied: 2 · ${gliedAnzeige(u)} · ${gliedAnzeige(v)} = ${gliedAnzeige(mitte)} ✓, Vorzeichen ${formel === 1 ? "+ → 1. Formel" : "− → 2. Formel"}`, `${alsAnzeige(summe)} = <strong>${loesungAnzeige}</strong>`],
  };
}

function lueckenAufgabe(b, formel, luecke, uu, vv) {
  const { u, v } = b;
  const mitte = mal(multipliziere([u], [v])[0], 2);
  const op = formel === 2 ? " − " : " + ";
  const loesung = luecke === "mitte" ? mitte.k : vv.k;
  const anzeige = luecke === "mitte"
    ? `${gliedAnzeige(uu)}${op}□${variablenteil(mitte)} + ${gliedAnzeige(vv)}`
    : `${gliedAnzeige(uu)}${op}${gliedAnzeige(mitte)} + □${variablenteil(vv)}`;
  return {
    text: `Ergänze die Lücke so, dass eine binomische Formel entsteht: ${anzeige}`,
    lueckenText: anzeige,
    felder: [zahlenfeld({ id: "antwort", label: "Zahl in der Lücke", art: "zahl", nurZahl: true }, loesung)],
    loesung: { antwort: loesung },
    tipp: luecke === "mitte"
      ? "Bestimme a und b aus dem ersten und letzten Glied. Das Mittelglied ist 2 · a · b."
      : "Das Mittelglied ist 2 · a · b. Teile es durch 2 · a, dann hast du b. In die Lücke gehört b².",
    rechenweg: luecke === "mitte"
      ? [`${gliedAnzeige(uu)} = ${quadratAnzeige(u)}, ${gliedAnzeige(vv)} = ${quadratAnzeige(v)}, also a = ${gliedAnzeige(u)}, b = ${gliedAnzeige(v)}`, `Mittelglied: 2 · ${gliedAnzeige(u)} · ${gliedAnzeige(v)} = ${gliedAnzeige(mitte)}`, `Lücke: <strong>${loesung}</strong>`]
      : [`a = ${gliedAnzeige(u)}; ${gliedAnzeige(mitte)} = 2 · ${gliedAnzeige(u)} · b, also b = ${gliedAnzeige(v)}`, `b² = ${quadratAnzeige(v)} = ${gliedAnzeige(vv)}`, `Lücke: <strong>${loesung}</strong>`],
  };
}

export function erzeugeAufgabe(zufall, vorgaben = {}) {
  const ausUrl = URL_ZAHLEN.some((k) => vorgaben[k] !== undefined);
  const typ = TYPEN.includes(vorgaben.typ) ? vorgaben.typ : ausUrl ? "faktorisieren" : zufall.wahl(["faktorisieren", "faktorisieren", "luecke"]);
  const erlaubt = typ === "luecke" ? [1, 2] : [1, 2, 3];
  const formel = erlaubt.includes(ganz(vorgaben.formel, 3)) ? vorgaben.formel : ausUrl ? 1 : zufall.wahl(erlaubt);
  const luecke = LUECKEN.includes(vorgaben.luecke) ? vorgaben.luecke : zufall.wahl(LUECKEN);
  const b = waehleBinom(zufall, vorgaben);
  const uu = multipliziere([b.u], [b.u])[0];
  const vv = multipliziere([b.v], [b.v])[0];
  const mitte = mal(multipliziere([b.u], [b.v])[0], 2);
  const summe = formel === 1 ? [uu, mitte, vv] : formel === 2 ? [uu, mal(mitte, -1), vv] : [uu, mal(vv, -1)];
  const teil = typ === "luecke" ? lueckenAufgabe(b, formel, luecke, uu, vv) : faktorisieren(b, formel, summe, uu, vv);
  return { thema: THEMA, typ, formel, luecke: typ === "luecke" ? luecke : undefined, ...b, uu, vv, mitte, summe, ...teil };
}

const MELDUNGEN = {
  "kein-term": MELDUNG_KEIN_VARIABLENTERM,
  "keine-zahl": MELDUNG_KEINE_ZAHL,
  "falsches-vorzeichen": "Schau auf das Vorzeichen des Mittelglieds: + → (a + b)², − → (a − b)².",
  "nicht-halbiert": "Das Mittelglied ist 2 · a · b – doppelt so groß wie a · b. Bei 6x ist b = 3, nicht 6.",
  "faktor-2-vergessen": "Das Mittelglied ist 2 · a · b, nicht a · b. Vergiss die 2 nicht.",
  "nicht-quadriert": "Du hast b gefunden – in die Lücke gehört aber b², also b mal b.",
  falsch: "Das stimmt noch nicht. Welche Terme ergeben quadriert das erste und das letzte Glied?",
};
const MELDUNG_FORMEL = {
  1: "Da steht ein Mittelglied – das ist die 1. oder 2. Formel, also ein Quadrat (a ± b)². (a + b)(a − b) hätte kein Mittelglied.",
  2: "Da steht ein Mittelglied – das ist die 1. oder 2. Formel, also ein Quadrat (a ± b)². (a + b)(a − b) hätte kein Mittelglied.",
  3: "Kein Mittelglied, dazwischen ein Minus: Das ist die 3. Formel, (a + b)(a − b).",
};

function pruefeFaktorisiert(aufgabe, eingabe) {
  const { u, v, n, m, formel } = aufgabe;
  const richtig = aufgabe.loesung.antwort;
  let ergebnis = pruefeTermAntwort(eingabe, richtig, { form: "faktorisiert" });
  if (ergebnis.korrekt && !istBinomProdukt(eingabe)) {
    ergebnis = { korrekt: false, fehler: "nicht-faktorisiert", wert: ergebnis.wert, meldung: MELDUNG_NICHT_BINOM };
  } else if (ergebnis.fehler === "nicht-faktorisiert") ergebnis = { ...ergebnis, meldung: MELDUNG_NICHT_BINOM };
  const mv = negiere([v])[0];
  const quadrat = (p) => `${binomEingabe(p)}^2`;
  const variable = Object.keys(v.e);
  const doppelt = [glied(2 * n, ...variable), glied(2 * m * n, ...variable)];
  const fehler = ergebnis.fehler !== "falsch" ? ergebnis.fehler : diagnose(eingabe, richtig, formel === 3
    ? [["falsche-formel", [quadrat([u, v]), quadrat([u, mv])]]]
    : [
      ["falsches-vorzeichen", [quadrat([u, formel === 1 ? mv : v])]],
      ["nicht-halbiert", doppelt.flatMap((d) => [quadrat([u, d]), quadrat([u, negiere([d])[0]])])],
      ["falsche-formel", [`${binomEingabe([u, v])}${binomEingabe([u, mv])}`]],
    ]);
  const meldungen = { ...MELDUNGEN, "falsche-formel": MELDUNG_FORMEL[formel] };
  return ergebnisFuer("antwort", ergebnis, fehler, meldungen, `${alsAnzeige(aufgabe.summe)} = ${aufgabe.loesungAnzeige}.`);
}

function pruefeLuecke(aufgabe, eingabe) {
  const feld = aufgabe.felder[0];
  const erwartet = aufgabe.loesung.antwort;
  const ergebnis = pruefeZahlAntwort(eingabe, erwartet, feld);
  const passt = (x) => passtZu(eingabe, x, { art: feld.art });
  const { mitte, m, n } = aufgabe;
  let fehler = ergebnis.fehler;
  if (fehler === "falsch") {
    if (aufgabe.luecke === "mitte" && passt(m * n)) fehler = "faktor-2-vergessen";
    else if (aufgabe.luecke === "ende" && passt(mitte.k * mitte.k)) fehler = "nicht-halbiert";
    else if (aufgabe.luecke === "ende" && (passt(mitte.k / 2) || passt(n))) fehler = "nicht-quadriert";
  }
  return ergebnisFuer("antwort", ergebnis, fehler, MELDUNGEN, `${aufgabe.lueckenText.replace("□", String(erwartet))}.`);
}

export function pruefeAntwort(aufgabe, antworten) {
  return aufgabe.typ === "luecke" ? pruefeLuecke(aufgabe, antworten.antwort) : pruefeFaktorisiert(aufgabe, antworten.antwort);
}
