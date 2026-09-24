/*
 * Zweite Pfadregel: die Wahrscheinlichkeiten aller Pfade eines Ereignisses addieren. Zwei Aufgabenarten, die sich
 * die Kompetenzen 6–8 teilen:
 *   pfade – Ereignis in Worten, P(E) berechnen; die angeklickten Pfade (aufgabe.auswahl, gesetzt vom Bild) helfen bei der Diagnose
 *   term  – den passenden Term aus drei Vorschlägen wählen (Radiofeld "wahl"); die falschen bilden typische Fehler ab
 * Reine Funktionen, kein DOM.
 */
import { formatBruch } from "../../../kern/js/bruch.js";
import { ereignisPfade, ereignisWahrscheinlichkeit, blaetter, baueBaum } from "../modell/baum.js";
import { parseEreignis, moeglicheEreignisse } from "../modell/ereignis.js";
import { pruefeEinFeld, wahrscheinlichkeitsFeld, versuchAusVorgaben, versuchText, pfadTerm, zweigBruch, trifft } from "./gemeinsam.js";

export const TIPP_FORMEN = "Deine Antwort darf als Produkt, Summe oder Potenz stehen bleiben.";

function waehleEreignis(vorgaben, exp, zuege, baum, zufall, maxPfade) {
  let ereignis = parseEreignis(vorgaben.ereignis || "", exp, zuege);
  const passt = (e) => e.gueltig && ereignisPfade(baum, e).length >= 2 && ereignisPfade(baum, e).length <= maxPfade;
  if (!passt(ereignis)) {
    const kandidaten = moeglicheEreignisse(exp, zuege).filter(passt);
    ereignis = kandidaten.length ? zufall.wahl(kandidaten) : parseEreignis("allegleich", exp, zuege);
  }
  return ereignis;
}

const summenTerm = (pfade, baum) => pfade.map((p) => pfadTerm(p, baum)).join(" + ");
const pfadNamen = (exp, pfade) => pfade.map((p) => p.pfad.map((id) => exp.ergebnisse.find((e) => e.id === id)?.name ?? id).join("-")).join(", ");

export function aufgabePfade(thema, zufall, vorgaben) {
  const { exp, zuege, mitZuruecklegen, baum } = versuchAusVorgaben(vorgaben, zufall);
  const ereignis = waehleEreignis(vorgaben, exp, zuege, baum, zufall, 8);
  const pfade = ereignisPfade(baum, ereignis);
  const loesung = ereignisWahrscheinlichkeit(baum, ereignis);
  return {
    thema, art: "pfade", experiment: exp, zuege, mitZuruecklegen, baum, ereignis, pfade, loesungBruch: loesung,
    text: `${versuchText(exp, zuege, mitZuruecklegen)} Ereignis E: „${ereignis.name}“. Klick im Baum die Pfade an, die zu E gehören, und berechne dann P(E).`,
    felder: [wahrscheinlichkeitsFeld("antwort", "P(E) =", loesung, "z. B. 3/6*2/5+2/6*3/5")],
    loesung: { antwort: formatBruch(loesung) },
    tipp: `Schreib zu jedem Pfad das Produkt seiner Zweige auf (1. Pfadregel). Dann addiere die Produkte aller passenden Pfade (2. Pfadregel). ${TIPP_FORMEN}`,
    rechenweg: [
      `Passende Pfade (${pfade.length}): ${pfadNamen(exp, pfade)}`,
      `Jeder Pfad als Produkt: ${pfade.map((p) => `${pfadTerm(p, baum)} = ${formatBruch(p.pfadWahrscheinlichkeit)}`).join("; ")}`,
      `2. Pfadregel: P(E) = ${summenTerm(pfade, baum)} = <strong>${formatBruch(loesung)}</strong>`,
    ],
  };
}

function zweigAn(baum, pfad, i) {
  let k = baum.wurzel;
  for (let j = 0; j <= i; j++) k = k.kinder.find((c) => c.ergebnis === pfad[j]);
  return k;
}

// Falsche Terme, die typische Fehler abbilden.
function distraktoren(baum, exp, zuege, pfade, ereignis) {
  const liste = [];
  if (pfade.length > 1) liste.push({ text: pfadTerm(pfade[0], baum), fehler: "Nur ein Pfad – die anderen passenden Pfade (z. B. andere Reihenfolge) fehlen." });
  liste.push({ text: pfade.map((p) => p.pfad.map((_, i) => zweigBruch(zweigAn(baum, p.pfad, i))).join(" + ")).join(" + "), fehler: "Entlang eines Pfades wird multipliziert, nicht addiert." });
  const gegen = blaetter(baum).filter((b) => !pfade.includes(b));
  if (gegen.length >= 1 && gegen.length <= 4) liste.push({ text: summenTerm(gegen, baum), fehler: "Das sind die Pfade des Gegenereignisses." });
  if (exp.ohneZuruecklegenMoeglich) {
    const anderer = baueBaum(exp, zuege, !baum.mitZuruecklegen);
    liste.push({ text: summenTerm(ereignisPfade(anderer, ereignis), anderer), fehler: baum.mitZuruecklegen ? "Hier wurde ohne Zurücklegen gerechnet, die Aufgabe ist aber mit." : "Hier wurde mit Zurücklegen gerechnet – der Nenner muss aber kleiner werden." });
  }
  return liste;
}

export function aufgabeTerm(thema, zufall, vorgaben) {
  const { exp, zuege, mitZuruecklegen, baum } = versuchAusVorgaben(vorgaben, zufall, { zuegeStandard: 2 });
  const ereignis = waehleEreignis(vorgaben, exp, zuege, baum, zufall, 4);
  const pfade = ereignisPfade(baum, ereignis);
  const loesung = ereignisWahrscheinlichkeit(baum, ereignis);
  const richtig = { text: summenTerm(pfade, baum), richtig: true, fehler: "" };
  const falsche = [];
  for (const d of zufall.mischen(distraktoren(baum, exp, zuege, pfade, ereignis))) {
    if (d.text !== richtig.text && !falsche.some((f) => f.text === d.text)) falsche.push({ ...d, richtig: false });
    if (falsche.length === 2) break;
  }
  while (falsche.length < 2) falsche.push({ text: `${richtig.text} + ${falsche.length + 1}`, richtig: false, fehler: "Die Summe wäre größer als 1." });
  const position = zufall.ganzzahl(0, 2);
  const optionen = [...falsche];
  optionen.splice(position, 0, richtig);
  return {
    thema, art: "term", experiment: exp, zuege, mitZuruecklegen, baum, ereignis, pfade, loesungBruch: loesung, optionen,
    text: `${versuchText(exp, zuege, mitZuruecklegen)} Ereignis E: „${ereignis.name}“. Welcher Term berechnet P(E)?`,
    felder: [{ id: "wahl", typ: "radio", label: "Welcher Term berechnet P(E)?", optionen: optionen.map((o, i) => ({ wert: String(i), text: o.text })) }],
    loesung: { wahl: String(position) },
    tipp: `Zähle zuerst die Pfade, die zu „${ereignis.name}“ passen. Jeder Pfad ist ein Produkt, die Pfade werden addiert. ${TIPP_FORMEN}`,
    rechenweg: [`Passende Pfade: ${pfadNamen(exp, pfade)}`, `P(E) = ${richtig.text} = <strong>${formatBruch(loesung)}</strong>`],
  };
}

/** Vergleicht angeklickte Blatt-Ids mit den Pfaden des Ereignisses. */
export function pruefeAuswahl(aufgabe, ausgewaehlt) {
  const soll = new Set(aufgabe.pfade.map((p) => p.id));
  const ist = new Set(ausgewaehlt);
  const fehlend = [...soll].filter((id) => !ist.has(id)).length;
  const zuviel = [...ist].filter((id) => !soll.has(id)).length;
  const richtig = fehlend === 0 && zuviel === 0;
  const meldung = richtig
    ? `Genau die ${soll.size} Pfade – richtig ausgewählt.`
    : `${fehlend ? `Es fehlen noch ${fehlend} Pfade. ` : ""}${zuviel ? `${zuviel} Pfade gehören nicht zu E. ` : ""}Lies das Ereignis noch einmal genau.`;
  return { richtig, fehlend, zuviel, meldung };
}

export function pruefePfade(aufgabe, antworten) {
  const auswahl = aufgabe.auswahl?.size ? pruefeAuswahl(aufgabe, aufgabe.auswahl) : null;
  return pruefeEinFeld(antworten, aufgabe.loesungBruch, [
    { fehler: "auswahl", passt: () => Boolean(auswahl && !auswahl.richtig), meldung: auswahl?.meldung },
    {
      fehler: "nur-ein-pfad",
      passt: (teil) => aufgabe.pfade.some((p) => trifft(teil, p.pfadWahrscheinlichkeit)),
      meldung: "Das ist nur ein Pfad. Addiere die Wahrscheinlichkeiten aller passenden Pfade (2. Pfadregel).",
    },
  ]);
}

export function pruefeTerm(aufgabe, antworten) {
  const wahl = String(antworten.wahl ?? "");
  const o = aufgabe.optionen[Number(wahl)];
  if (wahl === "" || !o) {
    return { korrekt: false, fehler: wahl === "" ? "keine-eingabe" : "falsch", felder: { wahl: { korrekt: false, wert: NaN } }, meldung: "Wähl einen Term aus." };
  }
  return {
    korrekt: o.richtig,
    fehler: o.richtig ? undefined : "falsch",
    felder: { wahl: { korrekt: o.richtig, wert: Number(wahl) } },
    meldung: o.richtig ? `Richtig! P(E) = ${formatBruch(aufgabe.loesungBruch)}` : `Nicht ganz. ${o.fehler}`,
  };
}
