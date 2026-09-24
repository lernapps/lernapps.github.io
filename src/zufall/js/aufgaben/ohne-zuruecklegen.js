/*
 * Kompetenz 5: Ziehen ohne Zurücklegen – dieselbe Urne mit und ohne Zurücklegen vergleichen. Zwei Arten:
 *   zweig – P(2. Kugel = Y | 1. Kugel = X);  pfad – P(X, dann Y)
 * URL-Parameter (llms.txt): urne, erster, zweiter, art=zweig|pfad, seed/nr.
 */
import { formatBruch, multipliziere, istGleich } from "../../../kern/js/bruch.js";
import { ergebnisAusFeldern } from "../../../kern/js/pruefung.js";
import { urne, parseUrne, entferne, wahrscheinlichkeit, gesamtAnzahl, kugelListe } from "../modell/experimente.js";
import { baueBaum } from "../modell/baum.js";
import { pruefeWahrscheinlichkeit, wahrscheinlichkeitsFeld, trifft, gekuerzt, URNEN_VORLAGEN, MELDUNG_UNLESBAR } from "./gemeinsam.js";

export { zeichneOhneZuruecklegen as zeichneBild } from "../vis/ohne-zuruecklegen.js";

export const THEMA = "ohne-zuruecklegen";
export const URL_ZAHLEN = [];
export const URL_TEXTE = ["urne", "erster", "zweiter", "art"];

export function erzeugeAufgabe(zufall, vorgaben = {}) {
  const spec = parseUrne(vorgaben.urne) ? vorgaben.urne : zufall.wahl(URNEN_VORLAGEN);
  const exp = urne(spec);
  const ids = exp.ergebnisse.map((e) => e.id);
  const erster = ids.includes(vorgaben.erster) ? vorgaben.erster : zufall.wahl(ids);
  const zweiter = ids.includes(vorgaben.zweiter) ? vorgaben.zweiter : zufall.wahl(ids);
  const art = ["zweig", "pfad"].includes(vorgaben.art) ? vorgaben.art : zufall.wahl(["zweig", "zweig", "pfad"]);
  const urneDanach = entferne(exp, erster);
  const pErster = wahrscheinlichkeit(exp, erster);
  const zweigMit = wahrscheinlichkeit(exp, zweiter);
  const zweigOhne = wahrscheinlichkeit(urneDanach, zweiter);
  const nameE = exp.ergebnisse.find((e) => e.id === erster).name;
  const nameZ = exp.ergebnisse.find((e) => e.id === zweiter).name;
  const gesamt = gesamtAnzahl(exp);
  const anzE = exp.ergebnisse.find((e) => e.id === erster).anzahl;
  const anzZ = exp.ergebnisse.find((e) => e.id === zweiter).anzahl;
  const anzZDanach = anzZ - (erster === zweiter ? 1 : 0);
  const kontext = `In einer Urne liegen ${kugelListe(exp.ergebnisse)} (${gesamt} insgesamt). Du ziehst zweimal.`;
  const zweig = art === "zweig";
  const loesungMit = zweig ? zweigMit : multipliziere(pErster, zweigMit);
  const loesungOhne = zweig ? zweigOhne : multipliziere(pErster, zweigOhne);
  const beschriftung = zweig ? `P(2. Kugel ${nameZ})` : `P(${nameE}, dann ${nameZ})`;
  return {
    thema: THEMA, art, experiment: exp, urneDanach, erster, zweiter, nameE, nameZ, loesungMit, loesungOhne,
    baumMit: baueBaum(exp, 2, true), baumOhne: baueBaum(exp, 2, false),
    text: zweig
      ? `${kontext} Die erste Kugel ist ${nameE}. Wie groß ist jetzt die Wahrscheinlichkeit, dass die zweite Kugel ${nameZ} ist – (1) mit Zurücklegen und (2) ohne Zurücklegen?`
      : `${kontext} Wie groß ist P(${nameE}, dann ${nameZ}) – (1) mit Zurücklegen und (2) ohne Zurücklegen?`,
    felder: [
      wahrscheinlichkeitsFeld("mit", `(1) ${beschriftung} mit Zurücklegen =`, loesungMit, "z. B. 2/6"),
      wahrscheinlichkeitsFeld("ohne", `(2) ${beschriftung} ohne Zurücklegen =`, loesungOhne, "z. B. 2/5"),
    ],
    loesung: { mit: formatBruch(loesungMit), ohne: formatBruch(loesungOhne) },
    tipp: zweig
      ? `Mit Zurücklegen ist die Urne beim zweiten Zug wie am Anfang. Ohne Zurücklegen fehlt die ${nameE}e Kugel: nur noch ${gesamt - 1} Kugeln${erster === zweiter ? ` und nur noch ${anzZDanach} ${nameZ}e` : ""}.`
      : "Beide Male: 1. Pfadregel, also multiplizieren. Nur der zweite Zweig unterscheidet sich: ohne Zurücklegen fehlt eine Kugel in der Urne.",
    rechenweg: zweig
      ? [
        `Mit Zurücklegen: ${anzZ} ${nameZ}e von ${gesamt} Kugeln → ${gekuerzt(anzZ, gesamt, true)}`,
        `Ohne Zurücklegen: die ${nameE}e Kugel ist weg → ${anzZDanach} ${nameZ}e von ${gesamt - 1} Kugeln → ${gekuerzt(anzZDanach, gesamt - 1, true)}`,
      ]
      : [
        `Mit Zurücklegen: ${anzE}/${gesamt} · ${anzZ}/${gesamt} = <strong>${formatBruch(loesungMit)}</strong>`,
        `Ohne Zurücklegen: ${anzE}/${gesamt} · ${anzZDanach}/${gesamt - 1} = <strong>${formatBruch(loesungOhne)}</strong>`,
      ],
  };
}

export function pruefeAntwort(aufgabe, antworten) {
  const mit = pruefeWahrscheinlichkeit(antworten.mit, aufgabe.loesungMit);
  const ohne = pruefeWahrscheinlichkeit(antworten.ohne, aufgabe.loesungOhne);
  const verwechselt = ohne.korrekt !== true && !istGleich(aufgabe.loesungMit, aufgabe.loesungOhne) && trifft(ohne, aufgabe.loesungMit);
  const teile = [
    mit.korrekt !== true && mit.fehler === "falsch" ? "Der Wert mit Zurücklegen stimmt noch nicht." : "",
    verwechselt ? "Ohne Zurücklegen hast du den Wert mit Zurücklegen genommen. Es fehlt eine Kugel – der Nenner wird kleiner."
      : ohne.korrekt !== true && ohne.fehler === "falsch" ? "Der Wert ohne Zurücklegen stimmt noch nicht." : "",
    [mit, ohne].some((t) => t.fehler === "keine-zahl" && t.typ !== "leer") ? MELDUNG_UNLESBAR : "",
  ];
  return ergebnisAusFeldern({ mit, ohne }, {
    richtig: "Beide Werte stimmen. Du siehst den Unterschied!",
    falsch: teile.filter(Boolean).join(" ") || "Noch nicht alles richtig.",
  });
}
