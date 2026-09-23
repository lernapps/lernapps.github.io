/*
 * Kompetenz: Dritte binomische Formel – (a + b)(a − b) = a² − b².
 * Reine Funktionen, kein DOM, deterministisch über `zufall`. Vertrag: js/aufgaben/beispiel.js der Lern-App-Vorlage.
 * Aufgabe: (m·var + n)(m·var − n) oder mit n·zweite ausmultiplizieren; Termfeld, Form "ausmultipliziert".
 * URL-Parameter (öffentlicher Vertrag, in llms.txt dokumentiert): m, n, var = x | a, glied = zahl | variable,
 * reihenfolge = plusminus | minusplus (welche Klammer vorn steht; mit m oder n in der URL ist plusminus Standard), seed.
 */
import { pruefeTermAntwort, MELDUNG_KEIN_VARIABLENTERM } from "../../../kern/js/termantwort.js";
import { ergebnisFuer } from "../../../kern/js/pruefung.js";
import { multipliziere, negiere, alsEingabe, alsAnzeige, gliedAnzeige, binomAnzeige } from "./terme.js";
import { BINOM_URL_ZAHLEN, BINOM_URL_TEXTE, waehleBinom, nichtQuadriert, diagnose, quadratAnzeige, meldungNichtQuadriert } from "./binom.js";
import { TERM_HINWEIS } from "./klammern-multiplizieren.js";

export const THEMA = "dritte-binomische";
export const URL_ZAHLEN = BINOM_URL_ZAHLEN;
export const URL_TEXTE = [...BINOM_URL_TEXTE, "reihenfolge"];
const REIHENFOLGEN = ["plusminus", "minusplus"];

export function erzeugeAufgabe(zufall, vorgaben = {}) {
  const binom = waehleBinom(zufall, vorgaben);
  const ausUrl = URL_ZAHLEN.some((k) => vorgaben[k] !== undefined);
  const reihenfolge = REIHENFOLGEN.includes(vorgaben.reihenfolge) ? vorgaben.reihenfolge : ausUrl ? "plusminus" : zufall.wahl(REIHENFOLGEN);
  const { u, v } = binom;
  const minusV = negiere([v])[0];
  const plus = [u, v];
  const minus = [u, minusV];
  const [p, q] = reihenfolge === "plusminus" ? [plus, minus] : [minus, plus];
  const produkt = `${binomAnzeige(p)}${binomAnzeige(q)}`;
  const streifen = multipliziere([u], [v])[0];
  const ergebnis = multipliziere(p, q);
  const einzeln = p.flatMap((g) => q.map((h) => multipliziere([g], [h])[0]));
  return {
    thema: THEMA,
    ...binom,
    reihenfolge,
    streifen,
    ergebnis,
    aufgabeText: produkt,
    text: `Multipliziere mit der dritten binomischen Formel aus: ${produkt}`,
    felder: [{ id: "antwort", typ: "variablenterm", label: `${produkt} =`, hinweis: TERM_HINWEIS }],
    loesung: { antwort: alsEingabe(ergebnis) },
    tipp: `Einmal plus, einmal minus mit denselben Gliedern: a = ${gliedAnzeige(u)}, b = ${gliedAnzeige(v)}. Die Mittelglieder heben sich auf – es bleibt a² − b².`,
    rechenweg: [
      `a = ${gliedAnzeige(u)}, b = ${gliedAnzeige(v)}`,
      `${produkt} = ${alsAnzeige(einzeln)} – die Mittelglieder heben sich auf`,
      `= ${quadratAnzeige(u)} − ${quadratAnzeige(v)} = <strong>${alsAnzeige(ergebnis)}</strong>`,
    ],
  };
}

function meldungen(aufgabe) {
  return {
    "kein-term": MELDUNG_KEIN_VARIABLENTERM,
    "mittelglied-geschrieben": `Hier gibt es kein Mittelglied: + ${gliedAnzeige(aufgabe.streifen)} und − ${gliedAnzeige(aufgabe.streifen)} heben sich auf. Es bleibt a² − b².`,
    vorzeichen: "Achte auf das Minus: Das letzte Produkt ist (+b) · (−b) = − b². Also a² − b², nicht a² + b².",
    "koeffizient-nicht-quadriert": meldungNichtQuadriert(aufgabe.u, aufgabe.v),
    falsch: "Das stimmt noch nicht. Bestimme a und b und rechne a² − b².",
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
    ["mittelglied-geschrieben", [[1, -1], [-1, -1], [1, 1], [-1, 1]].map(([s, t]) => [uu, mal(streifen, 2 * s), mal(vv, t)])],
    ["vorzeichen", [[uu, vv], [mal(uu, -1), vv]]],
    ["koeffizient-nicht-quadriert", nichtQuadriert(u, v, undefined, -1)],
  ]);
  return ergebnisFuer("antwort", ergebnis, fehler, meldungen(aufgabe), `${aufgabe.aufgabeText} = ${alsAnzeige(aufgabe.ergebnis)}.`);
}
