/*
 * Kompetenz 2: Gegenwahrscheinlichkeit P(nicht E) = 1 − P(E). Drei Aufgabenarten:
 *   direkt      – P(E) ist gegeben (p=1/6; p über 1 gilt als Prozent: p=45 heißt 45 %)
 *   einfach     – Gegenereignis eines Laplace-Ereignisses (Parameter wie auf laplace.html)
 *   mindestens  – "mindestens einmal" bei mehreren Zügen über das Gegenereignis
 * URL-Parameter (llms.txt): p, art, experiment, urne, rad, zuege, modus, ereignis, lose, gewinne, wuerfel, seed/nr.
 */
import { bruch, subtrahiere, EINS, formatBruch } from "../../../kern/js/bruch.js";
import { urne, muenze, wuerfelSechs, ergebnisName, experimentAusVorgaben } from "../modell/experimente.js";
import { baueBaum, ereignisWahrscheinlichkeit, ereignisPfade } from "../modell/baum.js";
import { parseEreignis } from "../modell/ereignis.js";
import { ergebnismengeAus, frageText } from "./laplace.js";
import { pruefeEinFeld, wahrscheinlichkeitsFeld, vorgabeOder, trifft, URNEN_VORLAGEN } from "./gemeinsam.js";

// Testseite: bei "einfach" neutral – die Markierung von „nicht E“ würde die Antwort verraten.
export { zeichneGegenereignisTest as zeichneBild } from "../vis/gegenereignis.js";

export const THEMA = "gegenereignis";
export const URL_ZAHLEN = ["p", "zuege", "lose", "gewinne"];
export const URL_TEXTE = ["art", "experiment", "urne", "rad", "modus", "ereignis", "wuerfel"];

const P_VORLAGEN = [bruch(1, 6), bruch(1, 4), bruch(2, 5), bruch(3, 8), bruch(1, 3), bruch(5, 12), bruch(7, 10), bruch(3, 10), bruch(9, 20), bruch(1, 2)];

/** Kleinster Bruch (Nenner bis 1000) zu einer Dezimalzahl aus der URL, z. B. 0,1666… → 1/6. */
export function bruchAusZahl(x) {
  for (let n = 1; n <= 1000; n++) {
    const z = Math.round(x * n);
    if (Math.abs(z / n - x) < 1e-9) return bruch(z, n);
  }
  return bruch(Math.round(x * 1000), 1000);
}

function aufgabe(art, p, loesung, teile) {
  return {
    thema: THEMA, art, p, loesungBruch: loesung,
    loesung: { antwort: formatBruch(loesung) },
    felder: [wahrscheinlichkeitsFeld("antwort", art === "mindestens" ? "P(mindestens einmal) =" : "P(nicht E) =", loesung)],
    ...teile,
  };
}

function direkt(zufall, vorgaben) {
  const roh = Number(vorgaben.p);
  const zahl = roh > 1 && roh <= 100 ? roh / 100 : roh;
  const p = zahl > 0 && zahl < 1 ? bruchAusZahl(zahl) : zufall.wahl(P_VORLAGEN);
  const loesung = subtrahiere(EINS, p);
  return aufgabe("direkt", p, loesung, {
    text: `Für ein Ereignis E gilt: P(E) = ${formatBruch(p)}. Wie groß ist die Gegenwahrscheinlichkeit P(nicht E)?`,
    tipp: "E und „nicht E“ zusammen ergeben immer 1 (also 100 %). Rechne 1 − P(E).",
    rechenweg: [`P(nicht E) = 1 − P(E) = 1 − ${formatBruch(p)} = <strong>${formatBruch(loesung)}</strong>`],
  });
}

function einfach(zufall, vorgaben) {
  const menge = ergebnismengeAus(vorgaben, zufall);
  const guenstig = menge.elemente.filter((e) => e.guenstig).length;
  const moeglich = menge.elemente.length;
  const p = bruch(guenstig, moeglich);
  const loesung = subtrahiere(EINS, p);
  const frage = frageText(menge).replace("Wie groß ist die Wahrscheinlichkeit, dass du", "Wie groß ist die Wahrscheinlichkeit, dass du NICHT");
  return aufgabe("einfach", p, loesung, {
    menge,
    text: `${menge.kontext} ${frage} (Ereignis: nicht ${menge.ereignisName.replace(/^(eine|einen|ein) /, "")})`,
    tipp: `Rechne zuerst P(E) mit der Laplace-Formel: ${guenstig}/${moeglich}. Dann 1 − P(E).`,
    rechenweg: [
      `P(E) = ${guenstig}/${moeglich} = ${formatBruch(p)}`,
      `P(nicht E) = 1 − ${formatBruch(p)} = <strong>${formatBruch(loesung)}</strong>`,
      `Kontrolle: ${moeglich - guenstig} von ${moeglich} Ergebnissen sind „nicht E“.`,
    ],
  });
}

function zweigW(baum, pfad, i) {
  let k = baum.wurzel;
  for (let j = 0; j <= i; j++) k = k.kinder.find((c) => c.ergebnis === pfad[j]);
  return k.wahrscheinlichkeit;
}

function beschreibe(exp) {
  if (exp.typ === "urne") return `In einer Urne liegen ${exp.ergebnisse.map((e) => `${e.anzahl} ${e.name}e`).join(", ")} Kugeln.`;
  if (exp.typ === "muenze") return "Du hast eine faire Münze.";
  return "Du hast einen normalen Würfel; es zählt nur „6“ oder „keine 6“.";
}

function mindestens(zufall, vorgaben) {
  let exp = experimentAusVorgaben(vorgaben);
  let modus = vorgaben.modus;
  if (!exp) {
    const wahl = zufall.wahl(["wuerfel", "muenze", "urne", "urne"]);
    exp = wahl === "wuerfel" ? wuerfelSechs() : wahl === "muenze" ? muenze() : urne(zufall.wahl(URNEN_VORLAGEN));
    modus = exp.typ === "urne" ? zufall.wahl(["mit", "ohne"]) : "mit";
  }
  const mitZuruecklegen = modus !== "ohne" || !exp.ohneZuruecklegenMoeglich;
  const zuege = Math.min(4, Math.max(2, Number(vorgabeOder(vorgaben, "zuege", zufall.wahl([2, 3])))));
  let ereignis = parseEreignis(vorgaben.ereignis || "", exp, zuege);
  if (!ereignis.gueltig || !ereignis.code.startsWith("mind1")) ereignis = parseEreignis(`mind1${zufall.wahl(exp.ergebnisse).id}`, exp, zuege);
  const id = ereignis.code.slice(5);
  const baum = baueBaum(exp, zuege, mitZuruecklegen);
  const gegen = parseEreignis(`kein${id}`, exp, zuege);
  const gegenPfade = ereignisPfade(baum, gegen);
  const pGegen = ereignisWahrscheinlichkeit(baum, gegen);
  const loesung = subtrahiere(EINS, pGegen);
  const name = ergebnisName(exp, id);
  const aktion = exp.typ === "muenze" ? "wirfst die Münze" : exp.typ === "wuerfelSechs" ? "würfelst" : "ziehst";
  const zurueck = exp.typ === "urne" ? (mitZuruecklegen ? " mit Zurücklegen" : " ohne Zurücklegen") : "";
  const faktoren = gegenPfade.length === 1 ? gegenPfade[0].pfad.map((_, i) => formatBruch(zweigW(baum, gegenPfade[0].pfad, i))) : [];
  const alleGleich = faktoren.length && faktoren.every((f) => f === faktoren[0]);
  const gegenTerm = alleGleich ? `(${faktoren[0]})^${zuege}` : faktoren.join(" · ");
  return aufgabe("mindestens", pGegen, loesung, {
    experiment: exp, baum, zuege, mitZuruecklegen, ereignis, gegen,
    text: `${beschreibe(exp)} Du ${aktion} ${zuege}-mal${zurueck}. Wie groß ist die Wahrscheinlichkeit, dass du mindestens einmal „${name}“ bekommst?`,
    tipp: `„Mindestens einmal“ hat viele Pfade. Das Gegenereignis „kein einziges Mal ${name}“ hat nur einen Pfad. Rechne P(kein Mal) und dann 1 − P(kein Mal).`,
    rechenweg: [
      `Gegenereignis: kein einziges Mal ${name}.`,
      `P(kein Mal ${name}) = ${gegenTerm} = ${formatBruch(pGegen)}`,
      `P(mindestens einmal ${name}) = 1 − ${formatBruch(pGegen)} = <strong>${formatBruch(loesung)}</strong>`,
    ],
  });
}

export function erzeugeAufgabe(zufall, vorgaben = {}) {
  let art = vorgaben.art;
  if (vorgaben.p) art = "direkt";
  else if (vorgaben.zuege || /^mind1/.test(vorgaben.ereignis || "")) art = "mindestens";
  else if (vorgaben.experiment || vorgaben.urne || vorgaben.wuerfel) art = "einfach";
  if (!["direkt", "einfach", "mindestens"].includes(art)) art = zufall.wahl(["direkt", "einfach", "mindestens", "mindestens"]);
  if (art === "direkt") return direkt(zufall, vorgaben);
  if (art === "einfach") return einfach(zufall, vorgaben);
  return mindestens(zufall, vorgaben);
}

export function pruefeAntwort(aufgabe, antworten) {
  return pruefeEinFeld(antworten, aufgabe.loesungBruch, [{
    fehler: "p-statt-gegen",
    passt: (teil) => trifft(teil, aufgabe.p),
    meldung: aufgabe.art === "mindestens"
      ? "Das ist P(kein einziges Mal) – das Gegenereignis. Jetzt noch 1 − diesen Wert."
      : "Das ist P(E). Gefragt ist das Gegenereignis: 1 − P(E).",
  }]);
}
