/*
 * Kompetenz 3: Baumdiagramm zeichnen – einige Zweigwahrscheinlichkeiten sind versteckt (a, b, c, d), das Kind
 * trägt sie ein. URL-Parameter (llms.txt): experiment, urne, zuege, modus, Kurzformen muenze=<Züge>, wuerfel=<Züge>, seed/nr.
 */
import { formatBruch } from "../../../kern/js/bruch.js";
import { ergebnisAusFeldern } from "../../../kern/js/pruefung.js";
import { alleKnoten } from "../modell/baum.js";
import { pruefeWahrscheinlichkeit, wahrscheinlichkeitsFeld, versuchAusVorgaben, versuchText, zweigBruch, stufenWort, VERSUCH_ZAHLEN, VERSUCH_TEXTE, MELDUNG_UNLESBAR } from "./gemeinsam.js";

export { zeichneBaumdiagramm as zeichneBild } from "../vis/baumdiagramm.js";

export const THEMA = "baumdiagramm";
export const URL_ZAHLEN = VERSUCH_ZAHLEN;
export const URL_TEXTE = VERSUCH_TEXTE;

const BUCHSTABEN = ["a", "b", "c", "d"];

function waehleVersteckte(baum, zufall) {
  const knoten = alleKnoten(baum);
  const stufe2 = knoten.filter((k) => k.stufe >= 2);
  const stufe1 = knoten.filter((k) => k.stufe === 1);
  const anzahl = Math.min(knoten.length, zufall.wahl([2, 3, 3, 4]));
  const gewaehlt = [zufall.wahl(stufe2)];
  if (anzahl > 1 && stufe1.length) gewaehlt.push(zufall.wahl(stufe1));
  const rest = zufall.mischen(knoten.filter((k) => !gewaehlt.includes(k)));
  while (gewaehlt.length < anzahl && rest.length) gewaehlt.push(rest.pop());
  // Reihenfolge im Baum (von oben nach unten) für die Buchstaben
  gewaehlt.sort((x, y) => knoten.indexOf(x) - knoten.indexOf(y));
  const nameVon = (id) => baum.experiment.ergebnisse.find((e) => e.id === id)?.name ?? id;
  return gewaehlt.map((k, i) => {
    const vorher = k.pfad.slice(0, -1).map(nameVon);
    const beschreibung = `${k.stufe}. ${stufenWort(baum.experiment)}: ${k.name}${vorher.length ? ` (nach ${vorher.join(", ")})` : ""}`;
    return { knotenId: k.id, buchstabe: BUCHSTABEN[i], stufe: k.stufe, pfad: k.pfad, name: k.name, beschreibung, anzahl: k.anzahl, gesamt: k.gesamt, loesung: k.wahrscheinlichkeit };
  });
}

export function erzeugeAufgabe(zufall, vorgaben = {}) {
  const { exp, zuege, mitZuruecklegen, baum } = versuchAusVorgaben(vorgaben, zufall);
  const versteckt = waehleVersteckte(baum, zufall);
  return {
    thema: THEMA, experiment: exp, zuege, mitZuruecklegen, baum, versteckt,
    text: `${versuchText(exp, zuege, mitZuruecklegen)} Im Baumdiagramm fehlen ${versteckt.length} Zweigwahrscheinlichkeiten (${versteckt.map((v) => v.buchstabe).join(", ")}). Trag sie ein.`,
    felder: versteckt.map((v) => wahrscheinlichkeitsFeld(v.buchstabe, `${v.buchstabe}) ${v.beschreibung} =`, v.loesung, "z. B. 3/6")),
    loesung: Object.fromEntries(versteckt.map((v) => [v.buchstabe, formatBruch(v.loesung)])),
    tipp: exp.typ !== "urne"
      ? `Jeder Zweig zeigt die Wahrscheinlichkeit eines Ergebnisses. ${exp.typ === "gluecksrad" ? "Jede Drehung ist wie die erste" : "Jeder Wurf ist wie der erste"}: Die Zweige sind auf jeder Stufe gleich. Die Zweige an einem Knoten ergeben zusammen 1.`
      : mitZuruecklegen
      ? "Jeder Zweig zeigt: Anzahl der passenden Kugeln geteilt durch alle Kugeln. Mit Zurücklegen bleibt das auf jeder Stufe gleich. Die Zweige an einem Knoten ergeben zusammen 1."
      : "Ohne Zurücklegen fehlt auf der nächsten Stufe eine Kugel: Der Nenner wird um 1 kleiner – und der Zähler einer Farbe auch, wenn vorher eine Kugel dieser Farbe gezogen wurde. Die Zweige an einem Knoten ergeben zusammen 1.",
    rechenweg: versteckt.map((v) => `${v.buchstabe}) ${v.beschreibung}: ${v.anzahl} von ${v.gesamt} → ${zweigBruch(v)}${v.loesung.n !== v.gesamt ? ` = ${formatBruch(v.loesung)}` : ""}`),
  };
}

export function pruefeAntwort(aufgabe, antworten) {
  const felder = Object.fromEntries(aufgabe.versteckt.map((v) => [v.buchstabe, pruefeWahrscheinlichkeit(antworten[v.buchstabe], v.loesung)]));
  const falsche = Object.entries(felder).filter(([, t]) => t.korrekt !== true).map(([b]) => b);
  return ergebnisAusFeldern(felder, {
    richtig: "Alle Zweige stimmen. Der Baum ist vollständig!",
    falsch: `Noch nicht richtig: ${falsche.join(", ")}. Prüfe Zähler und Nenner. ${Object.values(felder).some((t) => t.fehler === "keine-zahl") ? MELDUNG_UNLESBAR : ""}`.trim(),
  });
}
