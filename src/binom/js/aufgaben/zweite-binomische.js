/*
 * Kompetenz: Zweite binomische Formel – (a − b)² = a² − 2ab + b².
 * Reine Funktionen, kein DOM, deterministisch über `zufall`. Vertrag: js/aufgaben/beispiel.js der Lern-App-Vorlage.
 * Aufgabe: (m·var − n)² oder (m·var − n·zweite)² ausmultiplizieren; Termfeld, Form "ausmultipliziert".
 * URL-Parameter (öffentlicher Vertrag, in llms.txt dokumentiert): m, n, var = x | a, glied = zahl | variable, seed.
 */
import { pruefeTermAntwort, MELDUNG_KEIN_VARIABLENTERM } from "../../../kern/js/termantwort.js";
import { ergebnisFuer } from "../../../kern/js/pruefung.js";
import { multipliziere, negiere, alsEingabe, alsAnzeige, gliedAnzeige, binomAnzeige } from "./terme.js";
import { BINOM_URL_ZAHLEN, BINOM_URL_TEXTE, waehleBinom, nichtQuadriert, diagnose, quadratAnzeige, meldungNichtQuadriert } from "./binom.js";
import { TERM_HINWEIS } from "./klammern-multiplizieren.js";

export const THEMA = "zweite-binomische";
export const URL_ZAHLEN = BINOM_URL_ZAHLEN;
export const URL_TEXTE = BINOM_URL_TEXTE;

export function erzeugeAufgabe(zufall, vorgaben = {}) {
  const binom = waehleBinom(zufall, vorgaben);
  const { u, v } = binom;
  const minusV = negiere([v])[0];
  const quadrat = `${binomAnzeige([u, minusV])}²`;
  const streifen = multipliziere([u], [v])[0];
  const ergebnis = multipliziere([u, minusV], [u, minusV]);
  return {
    thema: THEMA,
    ...binom,
    streifen,
    ergebnis,
    aufgabeText: quadrat,
    text: `Multipliziere mit der zweiten binomischen Formel aus: ${quadrat}`,
    felder: [{ id: "antwort", typ: "variablenterm", label: `${quadrat} =`, hinweis: TERM_HINWEIS }],
    loesung: { antwort: alsEingabe(ergebnis) },
    tipp: `Erstes Glied a = ${gliedAnzeige(u)}, zweites Glied b = ${gliedAnzeige(v)}. Rechne a², dann − 2 · a · b, dann + b². Das b² ist immer plus.`,
    rechenweg: [
      `a = ${gliedAnzeige(u)}, b = ${gliedAnzeige(v)}`,
      `${quadrat} = ${quadratAnzeige(u)} − 2 · ${gliedAnzeige(u)} · ${gliedAnzeige(v)} + ${quadratAnzeige(v)}`,
      `= <strong>${alsAnzeige(ergebnis)}</strong>`,
    ],
  };
}

function meldungen(aufgabe) {
  return {
    "kein-term": MELDUNG_KEIN_VARIABLENTERM,
    "binom-vergessen": `Da fehlt das Mittelglied − 2ab. ${aufgabe.aufgabeText} heißt ${binomAnzeige([aufgabe.u, negiere([aufgabe.v])[0]])} mal sich selbst – das sind vier Produkte, nicht zwei.`,
    "vorzeichen-b-quadrat": "Das letzte Glied ist (−b)² = (−b) · (−b). Minus mal Minus gibt Plus – also + b².",
    "faktor-2-vergessen": "Das Mittelglied kommt zweimal vor: a·(−b) und (−b)·a. Deshalb heißt es − 2ab.",
    "vorzeichen-mittelglied": "Das ist die erste Formel. Bei (a − b)² ist das Mittelglied negativ: − 2ab.",
    "koeffizient-nicht-quadriert": meldungNichtQuadriert(aufgabe.u, aufgabe.v),
    falsch: "Das stimmt noch nicht. Bestimme a und b und rechne a² − 2ab + b².",
  };
}

export function pruefeAntwort(aufgabe, antworten) {
  const eingabe = antworten.antwort;
  const { u, v, streifen } = aufgabe;
  const richtig = aufgabe.loesung.antwort;
  const ergebnis = pruefeTermAntwort(eingabe, richtig, { form: "ausmultipliziert" });
  const uu = multipliziere([u], [u])[0];
  const vv = multipliziere([v], [v])[0];
  const mal = (g, k) => ({ ...g, k: g.k * k });
  const fehler = ergebnis.fehler !== "falsch" ? ergebnis.fehler : diagnose(eingabe, richtig, [
    ["binom-vergessen", [[uu, mal(vv, -1)], [uu, vv]]],
    ["vorzeichen-b-quadrat", [[uu, mal(streifen, -2), mal(vv, -1)]]],
    ["faktor-2-vergessen", [[uu, mal(streifen, -1), vv]]],
    ["vorzeichen-mittelglied", [[uu, mal(streifen, 2), vv]]],
    ["koeffizient-nicht-quadriert", nichtQuadriert(u, v, mal(streifen, -2))],
  ]);
  return ergebnisFuer("antwort", ergebnis, fehler, meldungen(aufgabe), `${aufgabe.aufgabeText} = ${alsAnzeige(aufgabe.ergebnis)}.`);
}
