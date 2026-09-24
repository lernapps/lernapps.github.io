/* Aufgaben: Grundwert, Prozentwert und Prozentsatz in Textaufgaben erkennen. Reine Funktionen, kein DOM. */
import { erzeugeTripel, waehleKontext, mitEinheit } from "./gemeinsam.js";

export const THEMA = "grundbegriffe";
// URL-Parameter (öffentlicher Vertrag, in llms.txt dokumentiert); der Kern liest sie mit leseVorgaben.
export const URL_ZAHLEN = [];
export const URL_TEXTE = ["gesucht"];

export const ROLLEN = [
  { wert: "G", text: "Grundwert G (das Ganze, 100\u00a0%)" },
  { wert: "W", text: "Prozentwert W (der Teil)" },
  { wert: "p", text: "Prozentsatz p\u00a0% (der Anteil in Prozent)" },
];

/* Pro Kontext und gesuchter Größe: Text, die zwei gegebenen Größen in Textreihenfolge, die gesuchte Größe. */
const VORLAGEN = {
  preis: {
    W: (g, w, p) => ({ text: `Ein Fahrrad kostet ${g}. Im Angebot gibt es ${p} Rabatt. Wie viel Euro sparst du?`, gegeben: [[g, "G"], [p, "p"]], gesucht: "der Rabatt in Euro" }),
    p: (g, w) => ({ text: `Ein Fahrrad kostet ${g}. Der Rabatt beträgt ${w}. Wie viel Prozent Rabatt sind das?`, gegeben: [[g, "G"], [w, "W"]], gesucht: "der Rabatt in Prozent" }),
    G: (g, w, p) => ({ text: `Beim Kauf eines Fahrrads sparst du ${w}. Das sind ${p} Rabatt. Wie viel hat das Fahrrad vorher gekostet?`, gegeben: [[w, "W"], [p, "p"]], gesucht: "der alte Preis" }),
  },
  klasse: {
    W: (g, w, p) => ({ text: `In einer Klasse sind ${g}. ${p} von ihnen fahren mit dem Rad. Wie viele Schüler sind das?`, gegeben: [[g, "G"], [p, "p"]], gesucht: "die Zahl der Radfahrer" }),
    p: (g, w) => ({ text: `In einer Klasse sind ${g}. ${w} davon fahren mit dem Rad. Wie viel Prozent der Klasse sind das?`, gegeben: [[g, "G"], [w, "W"]], gesucht: "der Anteil der Radfahrer in Prozent" }),
    G: (g, w, p) => ({ text: `${w} einer Klasse fahren mit dem Rad. Das sind ${p} der Klasse. Wie viele Schüler hat die Klasse?`, gegeben: [[w, "W"], [p, "p"]], gesucht: "die Größe der Klasse" }),
  },
  umfrage: {
    W: (g, w, p) => ({ text: `${g} wurden befragt. ${p} davon lesen täglich Nachrichten. Wie viele Personen sind das?`, gegeben: [[g, "G"], [p, "p"]], gesucht: "die Zahl der Nachrichtenleser" }),
    p: (g, w) => ({ text: `${g} wurden befragt. ${w} davon lesen täglich Nachrichten. Wie viel Prozent sind das?`, gegeben: [[g, "G"], [w, "W"]], gesucht: "der Anteil in Prozent" }),
    G: (g, w, p) => ({ text: `${w} lesen täglich Nachrichten. Das sind ${p} aller Befragten. Wie viele Personen wurden befragt?`, gegeben: [[w, "W"], [p, "p"]], gesucht: "die Zahl aller Befragten" }),
  },
};

const GESUCHT = { g: "G", w: "W", p: "p" };

/** Erzeugt eine Zuordnungsaufgabe. Vorgabe {gesucht: "g" | "w" | "p"} legt die gesuchte Größe fest. */
export function erzeugeAufgabe(zufall, vorgaben = {}) {
  const kontext = waehleKontext(zufall, Object.keys(VORLAGEN));
  const { grundwert, prozentsatz, prozentwert } = erzeugeTripel(zufall, kontext);
  const gesucht = GESUCHT[vorgaben.gesucht] || zufall.wahl(["G", "W", "p"]);
  const wEinheit = kontext.id === "klasse" ? "Schüler" : kontext.einheit;
  const vorlage = VORLAGEN[kontext.id][gesucht](
    mitEinheit(grundwert, kontext.einheit), mitEinheit(prozentwert, wEinheit), mitEinheit(prozentsatz, "%"),
  );
  const felder = vorlage.gegeben.map(([anzeige], i) => ({ id: `zahl${i + 1}`, typ: "auswahl", label: anzeige, optionen: ROLLEN }));
  felder.push({ id: "gesucht", typ: "auswahl", label: `Gesucht: ${vorlage.gesucht}`, optionen: ROLLEN });
  const loesung = { zahl1: vorlage.gegeben[0][1], zahl2: vorlage.gegeben[1][1], gesucht };
  const name = (r) => ROLLEN.find((o) => o.wert === r).text;
  return {
    thema: "grundbegriffe", kontext: kontext.id, text: vorlage.text, grundwert, prozentsatz, prozentwert,
    einheit: kontext.einheit, gesucht, felder, loesung,
    tipp: "Der Grundwert ist das Ganze, auf das sich die Prozente beziehen. Die Zahl mit dem %-Zeichen ist immer der Prozentsatz. Der Prozentwert ist der Teil – er hat dieselbe Einheit wie der Grundwert.",
    rechenweg: [
      `${vorlage.gegeben[0][0]} → ${name(loesung.zahl1)}`,
      `${vorlage.gegeben[1][0]} → ${name(loesung.zahl2)}`,
      `Gesucht (${vorlage.gesucht}) → ${name(gesucht)}`,
    ],
  };
}

const MELDUNGEN = {
  unvollstaendig: "Ordne bitte alle drei Größen zu.",
  "g-w-vertauscht": "Grundwert und Prozentwert sind vertauscht. Der Grundwert ist das Ganze (100\u00a0%), der Prozentwert nur ein Teil davon.",
  falsch: "Noch nicht alles richtig. Frag dich bei jeder Zahl: Ist das das Ganze, der Teil oder der Anteil in Prozent?",
};

/** Prüft die drei Zuordnungen einzeln und erkennt vertauschte Rollen. */
export function pruefeAntwort(aufgabe, antworten) {
  const felder = {};
  let alle = true;
  let vollstaendig = true;
  for (const feld of aufgabe.felder) {
    const wert = antworten[feld.id] || "";
    if (!wert) vollstaendig = false;
    const korrekt = wert === aufgabe.loesung[feld.id];
    felder[feld.id] = { korrekt, wert };
    if (!korrekt) alle = false;
  }
  let fehler;
  if (alle) fehler = undefined;
  else if (!vollstaendig) fehler = "unvollstaendig";
  else {
    const ids = aufgabe.felder.map((f) => f.id);
    const gId = ids.find((id) => aufgabe.loesung[id] === "G");
    const wId = ids.find((id) => aufgabe.loesung[id] === "W");
    fehler = antworten[gId] === "W" && antworten[wId] === "G" ? "g-w-vertauscht" : "falsch";
  }
  const richtige = Object.values(felder).filter((f) => f.korrekt).length;
  return {
    korrekt: alle,
    fehler,
    felder,
    meldung: alle ? "Richtig! Alle drei Größen erkannt." : `${MELDUNGEN[fehler]} (${richtige} von 3 richtig)`,
  };
}
