/* Aufgaben: Sachaufgabe übersetzen — Typ "gleichung" (richtige Formel wählen + rechnen) und Typ "dreisatz" (Tabelle). */
import { formatZahl, runde } from "../../../kern/js/zahlen.js";
import { multipliziere, dividiere, bruch } from "../../../kern/js/bruch.js";
import { zahlenfeld, pruefeZahlAntwort, HINWEIS_FEHLER } from "../../../kern/js/zahlantwort.js";
import {
  erzeugeTripel, waehleKontext, mitEinheit, MELDUNG_KEINE_ZAHL, PROZENTSAETZE, alsBruch, artFuer,
} from "./gemeinsam.js";

export const THEMA = "sachaufgaben";
// URL-Parameter (öffentlicher Vertrag, in llms.txt dokumentiert); der Kern liest sie mit leseVorgaben.
export const URL_ZAHLEN = ["g", "p"];
export const URL_TEXTE = ["typ", "gesucht"];

const TEXTE = {
  preis: {
    W: (g, w, p) => `Ein Skateboard kostet ${g}. Es gibt ${p} Rabatt. Wie viel Euro Rabatt sind das?`,
    p: (g, w) => `Ein Skateboard kostet ${g}. Der Rabatt beträgt ${w}. Wie viel Prozent sind das?`,
    G: (g, w, p) => `Beim Kauf eines Skateboards sparst du ${w}. Das sind ${p} Rabatt. Wie viel hat es vorher gekostet?`,
  },
  umfrage: {
    W: (g, w, p) => `${g} wurden befragt. ${p} davon treiben regelmäßig Sport. Wie viele Personen sind das?`,
    p: (g, w) => `${g} wurden befragt. ${w} davon treiben regelmäßig Sport. Wie viel Prozent sind das?`,
    G: (g, w, p) => `${w} treiben regelmäßig Sport. Das sind ${p} aller Befragten. Wie viele Personen wurden befragt?`,
  },
};

/** Richtige Gleichung und zwei Fallen (Formeln verwechselt) für die gesuchte Größe. */
function gleichungen(gesucht, g, w, p) {
  const G = formatZahl(g);
  const W = formatZahl(w);
  const P = formatZahl(p);
  if (gesucht === "W") return { richtig: `W = ${G} · ${P} / 100`, falsch: [`W = ${G} · 100 / ${P}`, `W = ${P} / ${G} · 100`] };
  if (gesucht === "G") return { richtig: `G = ${W} · 100 / ${P}`, falsch: [`G = ${W} · ${P} / 100`, `G = ${P} / ${W} · 100`] };
  return { richtig: `p = ${W} / ${G} · 100`, falsch: [`p = ${G} / ${W} · 100`, `p = ${G} · ${W} / 100`] };
}

const GESUCHT = { g: "G", w: "W", p: "p" };
const EINHEIT_W = { umfrage: "Personen" };

function aufgabeGleichung(zufall, vorgaben) {
  const kontext = waehleKontext(zufall, Object.keys(TEXTE));
  const { grundwert, prozentsatz, prozentwert } = erzeugeTripel(zufall, kontext);
  const gesucht = GESUCHT[vorgaben.gesucht] || zufall.wahl(["W", "G", "p"]);
  const einheit = kontext.einheit;
  const text = TEXTE[kontext.id][gesucht](mitEinheit(grundwert, einheit), mitEinheit(prozentwert, EINHEIT_W[kontext.id] || einheit), mitEinheit(prozentsatz, "%"));
  const gl = gleichungen(gesucht, grundwert, prozentwert, prozentsatz);
  const optionen = zufall.mischen([gl.richtig, ...gl.falsch]).map((t) => ({ wert: t, text: t }));
  const ergebnis = { W: prozentwert, G: grundwert, p: prozentsatz }[gesucht];
  const ergebnisEinheit = gesucht === "p" ? "%" : einheit;
  const [G, W, P, hundert] = [alsBruch(grundwert), alsBruch(prozentwert), alsBruch(prozentsatz), bruch(100)];
  const exakt = {
    W: dividiere(multipliziere(G, P), hundert),
    G: dividiere(multipliziere(W, hundert), P),
    p: multipliziere(dividiere(W, G), hundert),
  }[gesucht];
  const art = gesucht === "p" ? "prozent" : artFuer(einheit);
  return {
    thema: "sachaufgaben", typ: "gleichung", kontext: kontext.id, text, grundwert, prozentsatz, prozentwert, einheit, gesucht,
    exakt: { ergebnis: exakt },
    felder: [
      { id: "gleichung", typ: "radio", label: "Welche Gleichung passt?", optionen },
      zahlenfeld({ id: "ergebnis", label: `Ergebnis (${gesucht === "p" ? "p" : gesucht})`, einheit: ergebnisEinheit, art }, exakt),
    ],
    loesung: { gleichung: gl.richtig, ergebnis },
    tipp: `Gesucht ist ${gesucht === "G" ? "das Ganze (Grundwert)" : gesucht === "W" ? "der Teil (Prozentwert)" : "der Anteil in Prozent (Prozentsatz)"}. `
      + "Schreibe zuerst auf, was G, W und p sind, dann passt nur eine Gleichung.",
    rechenweg: [`Gesucht: ${gesucht}`, `Gleichung: ${gl.richtig}`, `Ergebnis: ${mitEinheit(ergebnis, ergebnisEinheit)}`],
  };
}

function aufgabeDreisatz(zufall, vorgaben) {
  const kontext = waehleKontext(zufall, ["preis", "umfrage", "akku"]);
  let grundwert = 100 * zufall.ganzzahl(Math.max(1, Math.ceil(kontext.min / 100)), Math.floor(kontext.max / 100));
  let prozentsatz = zufall.wahl(PROZENTSAETZE);
  if (vorgaben.g && vorgaben.p) {
    grundwert = vorgaben.g;
    prozentsatz = vorgaben.p;
  }
  const einsExakt = dividiere(alsBruch(grundwert), bruch(100));
  const prozentExakt = multipliziere(einsExakt, alsBruch(prozentsatz));
  const eins = runde(grundwert / 100, 2);
  const prozentwert = runde(grundwert * prozentsatz / 100, 2);
  const einheit = kontext.einheit;
  const ding = { preis: "Ein Laptop kostet", umfrage: "Befragt wurden", akku: "Der Akku fasst" }[kontext.id];
  const text = `${ding} ${mitEinheit(grundwert, einheit)}. Rechne mit dem Dreisatz aus, wie viel ${formatZahl(prozentsatz)} % davon sind.`;
  return {
    thema: "sachaufgaben", typ: "dreisatz", kontext: kontext.id, text, grundwert, prozentsatz, prozentwert, einheit, gesucht: "W",
    exakt: { eins: einsExakt, prozent: prozentExakt },
    tabelle: [
      { links: "100 %", rechts: mitEinheit(grundwert, einheit) },
      { links: "1 %", feld: "eins" },
      { links: `${formatZahl(prozentsatz)} %`, feld: "prozent" },
    ],
    felder: [
      zahlenfeld({ id: "eins", label: "1 %", einheit, art: "zahl" }, einsExakt),
      zahlenfeld({ id: "prozent", label: `${formatZahl(prozentsatz)} %`, einheit, art: "zahl" }, prozentExakt),
    ],
    loesung: { eins, prozent: prozentwert },
    tipp: "Von 100 % auf 1 %: durch 100 teilen. Von 1 % auf p %: mal p nehmen.",
    rechenweg: [
      `100 % = ${mitEinheit(grundwert, einheit)}`,
      `1 % = ${formatZahl(grundwert)} : 100 = ${mitEinheit(eins, einheit)}`,
      `${formatZahl(prozentsatz)} % = ${formatZahl(eins)} · ${formatZahl(prozentsatz)} = ${mitEinheit(prozentwert, einheit)}`,
    ],
  };
}

/** Erzeugt eine Sachaufgabe. Vorgaben: {typ: "gleichung" | "dreisatz", gesucht, g, p}. */
export function erzeugeAufgabe(zufall, vorgaben = {}) {
  const typ = vorgaben.typ === "gleichung" || vorgaben.typ === "dreisatz" ? vorgaben.typ : zufall.wahl(["gleichung", "dreisatz"]);
  return typ === "gleichung" ? aufgabeGleichung(zufall, vorgaben) : aufgabeDreisatz(zufall, vorgaben);
}

const MELDUNGEN = {
  unvollstaendig: "Bitte fülle alle Felder aus.",
  "gleichung-falsch": "Die Gleichung passt nicht. Überlege: Ist das Gesuchte das Ganze, der Teil oder der Prozentsatz?",
  "ergebnis-falsch": "Die Gleichung stimmt, aber das Ergebnis noch nicht. Rechne noch einmal nach.",
  falsch: "Das stimmt noch nicht. Prüfe jede Zeile: durch 100 teilen, dann mal p nehmen.",
};

/** Prüft je nach Typ die Gleichung und das Ergebnis bzw. beide Dreisatz-Zeilen, Zahlen nach der Rundungsregel. */
export function pruefeAntwort(aufgabe, antworten) {
  const felder = {};
  const zahl = (id) => {
    const r = pruefeZahlAntwort(antworten[id], aufgabe.exakt[id], aufgabe.felder.find((f) => f.id === id));
    return HINWEIS_FEHLER.includes(r.fehler) ? { korrekt: false, wert: r.wert, fehler: r.fehler, meldung: r.meldung } : { korrekt: r.korrekt, wert: r.wert };
  };
  if (aufgabe.typ === "gleichung") {
    const gleichung = antworten.gleichung || "";
    felder.gleichung = { korrekt: gleichung === aufgabe.loesung.gleichung, wert: gleichung };
    felder.ergebnis = zahl("ergebnis");
  } else {
    felder.eins = zahl("eins");
    felder.prozent = zahl("prozent");
  }
  const alle = Object.values(felder).every((f) => f.korrekt);
  // Ist kein Feld falsch, aber eines nur ein Hinweis (z. B. zu grob gerundet), ist das ganze Ergebnis dieser Hinweis.
  const hinweis = Object.values(felder).find((f) => f.fehler);
  if (!alle && hinweis && Object.values(felder).every((f) => f.korrekt || f.fehler)) {
    return { korrekt: false, fehler: hinweis.fehler, felder, meldung: hinweis.meldung };
  }
  const leer = Object.entries(felder).some(([id, f]) => (id === "gleichung" ? f.wert === "" : Number.isNaN(f.wert) && !f.fehler));
  let fehler;
  if (alle) fehler = undefined;
  else if (leer) fehler = "unvollstaendig";
  else if (aufgabe.typ === "gleichung") fehler = felder.gleichung.korrekt ? "ergebnis-falsch" : "gleichung-falsch";
  else fehler = "falsch";
  const richtigText = aufgabe.typ === "gleichung"
    ? `${mitEinheit(aufgabe.loesung.ergebnis, aufgabe.gesucht === "p" ? "%" : aufgabe.einheit)}.`
    : `${formatZahl(aufgabe.prozentsatz)} % sind ${mitEinheit(aufgabe.loesung.prozent, aufgabe.einheit)}.`;
  return { korrekt: alle, fehler, felder, meldung: alle ? `Richtig! ${richtigText}` : MELDUNGEN[fehler] || MELDUNG_KEINE_ZAHL };
}
