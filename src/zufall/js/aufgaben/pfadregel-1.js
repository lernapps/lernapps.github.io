/*
 * Kompetenz 4: Erste Pfadregel – entlang eines Pfades werden die Zweigwahrscheinlichkeiten multipliziert.
 * URL-Parameter (llms.txt): experiment, urne, zuege, modus, ereignis=<Reihenfolge> (rb, kzk, sk), seed/nr.
 */
import { formatBruch } from "../../../kern/js/bruch.js";
import { blaetter, zweigeEntlang } from "../modell/baum.js";
import { parseEreignis } from "../modell/ereignis.js";
import { pruefeEinFeld, wahrscheinlichkeitsFeld, versuchAusVorgaben, versuchText, zweigBruch, VERSUCH_ZAHLEN, VERSUCH_TEXTE } from "./gemeinsam.js";

export { zeichnePfadregel1 as zeichneBild } from "../vis/pfadregel-1.js";

export const THEMA = "pfadregel-1";
export const URL_ZAHLEN = VERSUCH_ZAHLEN;
export const URL_TEXTE = [...VERSUCH_TEXTE, "ereignis"];

export function erzeugeAufgabe(zufall, vorgaben = {}) {
  const { exp, zuege, mitZuruecklegen, baum } = versuchAusVorgaben(vorgaben, zufall);
  let ereignis = parseEreignis(vorgaben.ereignis || "", exp, zuege);
  if (!ereignis.gueltig || !ereignis.pfad || !zweigeEntlang(baum, ereignis.pfad)) {
    ereignis = parseEreignis(zufall.wahl(blaetter(baum)).pfad.join(""), exp, zuege);
  }
  const zweige = zweigeEntlang(baum, ereignis.pfad);
  const loesung = zweige[zweige.length - 1].pfadWahrscheinlichkeit;
  const term = zweige.map(zweigBruch).join(" · ");
  const namen = zweige.map((z) => z.name);
  return {
    thema: THEMA, experiment: exp, zuege, mitZuruecklegen, baum, ereignis, pfad: ereignis.pfad, zweige, loesungBruch: loesung,
    text: `${versuchText(exp, zuege, mitZuruecklegen)} Wie groß ist P(${namen.join(", ")})? Also: ${ereignis.name}.`,
    felder: [wahrscheinlichkeitsFeld("antwort", `P(${namen.join(", ")}) =`, loesung, "z. B. 3/6*2/5 oder 1/5")],
    loesung: { antwort: formatBruch(loesung) },
    tipp: "Folge dem Pfad vom Start bis zum Ende und multipliziere die Wahrscheinlichkeiten der Zweige. Du darfst das Produkt so stehen lassen.",
    rechenweg: [
      `Pfad: Start → ${namen.join(" → ")}`,
      `Zweige: ${zweige.map((z) => `P(${z.name}) = ${zweigBruch(z)}`).join(", ")}`,
      `1. Pfadregel: P = ${term} = <strong>${formatBruch(loesung)}</strong>`,
    ],
  };
}

export function pruefeAntwort(aufgabe, antworten) {
  return pruefeEinFeld(antworten, aufgabe.loesungBruch, [{
    fehler: "addiert",
    passt: (_teil, eingabe) => /\+/.test(eingabe),
    meldung: "Du hast addiert. Entlang eines Pfades wird multipliziert (1. Pfadregel).",
  }]);
}
