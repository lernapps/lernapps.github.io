/*
 * Kompetenz: Zwei Klammern multiplizieren – (a + b)(c + d) = ac + ad + bc + bd.
 * Reine Funktionen, kein DOM, deterministisch über `zufall`. Vertrag: js/aufgaben/beispiel.js der Lern-App-Vorlage.
 * Aufgabe: (m1·x ± n1)(m2·x ± n2) ausmultiplizieren und zusammenfassen; Termfeld, Form "ausmultipliziert".
 * URL-Parameter (öffentlicher Vertrag, in llms.txt dokumentiert): m1, n1, m2, n2 (positive ganze Zahlen),
 * op1, op2 = plus | minus (Rechenzeichen in der ersten bzw. zweiten Klammer), seed.
 */
import { pruefeTermAntwort, passtZuTerm, sindGleichwertig, MELDUNG_KEIN_VARIABLENTERM } from "../../../kern/js/termantwort.js";
import { ergebnisFuer } from "../../../kern/js/pruefung.js";
import { glied, multipliziere, addiere, negiere, alsEingabe, alsAnzeige, gliedAnzeige, binomAnzeige } from "./terme.js";

export const THEMA = "klammern-multiplizieren";
export const URL_ZAHLEN = ["m1", "n1", "m2", "n2"];
export const URL_TEXTE = ["op1", "op2"];
export const TERM_HINWEIS = "Hoch 2 tippst du als ^2, z. B. a^2 oder x^2 + 8x + 15";

const OPS = ["plus", "minus"];
const ganz = (w, max) => (Number.isInteger(w) && w >= 1 && w <= max ? w : undefined);

/** Die vier Teilprodukte in Rechenreihenfolge: erstes·erstes, erstes·zweites, zweites·erstes, zweites·zweites. */
export function teilprodukte(p, q) {
  return p.flatMap((g) => q.map((h) => ({ g, h, produkt: multipliziere([g], [h])[0] })));
}

/** Rechenweg-Zeile 1: "2x · x + 2x · 4 − 1 · x − 1 · 4". */
function produktZeile(teile) {
  return teile.map(({ g, h }, i) => {
    const negativ = g.k * h.k < 0;
    const text = `${gliedAnzeige({ ...g, k: Math.abs(g.k) })} · ${gliedAnzeige({ ...h, k: Math.abs(h.k) })}`;
    if (i === 0) return negativ ? `−${text}` : text;
    return `${negativ ? " − " : " + "}${text}`;
  }).join("");
}

export function erzeugeAufgabe(zufall, vorgaben = {}) {
  const ausUrl = URL_ZAHLEN.some((n) => vorgaben[n] !== undefined);
  const m1 = ganz(vorgaben.m1, 5) ?? zufall.wahl([1, 1, 1, 2, 3]);
  const n1 = ganz(vorgaben.n1, 20) ?? zufall.ganzzahl(1, m1 === 1 ? 9 : 5);
  const m2 = ganz(vorgaben.m2, 5) ?? zufall.wahl([1, 1, 1, 2, 3]);
  const n2 = ganz(vorgaben.n2, 20) ?? zufall.ganzzahl(1, m2 === 1 ? 9 : 5);
  const zufallsOp = () => (ausUrl ? "plus" : zufall.wahl(OPS));
  const op1 = OPS.includes(vorgaben.op1) ? vorgaben.op1 : zufallsOp();
  const op2 = OPS.includes(vorgaben.op2) ? vorgaben.op2 : zufallsOp();
  const p = [glied(m1, "x"), glied(op1 === "minus" ? -n1 : n1)];
  const q = [glied(m2, "x"), glied(op2 === "minus" ? -n2 : n2)];
  const teile = teilprodukte(p, q);
  const ergebnis = multipliziere(p, q);
  const aufgabeText = `${binomAnzeige(p)}${binomAnzeige(q)}`;
  return {
    thema: THEMA,
    m1, n1, op1, m2, n2, op2, p, q, teile, ergebnis,
    aufgabeText,
    text: `Multipliziere aus und fasse zusammen: ${aufgabeText}`,
    felder: [{ id: "antwort", typ: "variablenterm", label: `${aufgabeText} =`, hinweis: TERM_HINWEIS }],
    loesung: { antwort: alsEingabe(ergebnis) },
    tipp: "Jedes Glied der ersten Klammer mal jedes Glied der zweiten Klammer – das sind vier Produkte. Achte auf die Vorzeichen, dann fasse die Glieder mit x zusammen.",
    rechenweg: [
      `${aufgabeText} = ${produktZeile(teile)}`,
      `= ${alsAnzeige(teile.map((t) => t.produkt))}`,
      `= <strong>${alsAnzeige(ergebnis)}</strong>`,
    ],
  };
}

const MELDUNGEN = {
  "kein-term": MELDUNG_KEIN_VARIABLENTERM,
  "nur-aussen-glieder": "Du hast nur Erstes mal Erstes und Letztes mal Letztes gerechnet. Es fehlen die gemischten Glieder: jedes Glied der einen Klammer mal jedes Glied der anderen – vier Produkte.",
  vorzeichenfehler: "Fast: Die Zahlen stimmen, aber ein Vorzeichen nicht. Plus mal Minus gibt Minus, Minus mal Minus gibt Plus.",
  falsch: "Das stimmt noch nicht. Schreib die vier Produkte einzeln auf und fasse dann zusammen.",
};

/** Typische Fehlterme: nur die äußeren Glieder; ein oder mehrere Teilprodukte mit falschem Vorzeichen. */
function diagnose(aufgabe, eingabe) {
  const [a, , , d] = aufgabe.teile.map((t) => t.produkt);
  if ([[a, d], [a, ...negiere([d])]].some((k) => passtZuTerm(eingabe, alsEingabe(k)))) return "nur-aussen-glieder";
  const richtig = alsEingabe(aufgabe.ergebnis);
  for (let maske = 1; maske < 16; maske++) {
    const produkte = aufgabe.teile.map((t, i) => (maske & (1 << i) ? negiere([t.produkt])[0] : t.produkt));
    const kandidat = alsEingabe(addiere(produkte, []));
    if (!sindGleichwertig(kandidat, richtig) && passtZuTerm(eingabe, kandidat)) return "vorzeichenfehler";
  }
  return "falsch";
}

export function pruefeAntwort(aufgabe, antworten) {
  const eingabe = antworten.antwort;
  const ergebnis = pruefeTermAntwort(eingabe, aufgabe.loesung.antwort, { form: "ausmultipliziert" });
  const fehler = ergebnis.fehler === "falsch" ? diagnose(aufgabe, eingabe) : ergebnis.fehler;
  return ergebnisFuer("antwort", ergebnis, fehler, MELDUNGEN, `${aufgabe.aufgabeText} = ${alsAnzeige(aufgabe.ergebnis)}.`);
}
