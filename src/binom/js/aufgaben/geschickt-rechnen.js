/*
 * Kompetenz: Geschickt rechnen – Quadrate und Produkte nahe an glatten Zehnern mit den binomischen Formeln im Kopf:
 * 51² = (50 + 1)², 49² = (50 − 1)², 21 · 19 = (20 + 1)(20 − 1) = 20² − 1².
 * Reine Funktionen, kein DOM, deterministisch über `zufall`. Vertrag: js/aufgaben/beispiel.js der Lern-App-Vorlage.
 * Felder: Auswahl "Welche Formel hilft?" (1 | 2 | 3) und das Ergebnis als Zahl (nurZahl – das Kopfrechnen ist die Übung).
 * URL-Parameter (öffentlicher Vertrag, in llms.txt dokumentiert): formel = 1 | 2 | 3, basis (glatter Zehner 10–200),
 * abstand (1–9), seed.
 */
import { zahlenfeld, pruefeZahlAntwort, passtZu } from "../../../kern/js/zahlantwort.js";
import { ergebnisAusFeldern } from "../../../kern/js/pruefung.js";
import { ganz } from "./binom.js";

export const THEMA = "geschickt-rechnen";
export const URL_ZAHLEN = ["formel", "basis", "abstand"];
export const URL_TEXTE = [];
const BASEN = [20, 30, 40, 50, 60, 70, 80, 90, 100];
const NAMEN = { 1: "1. Formel: (a + b)²", 2: "2. Formel: (a − b)²", 3: "3. Formel: (a + b)(a − b)" };

function aufgabeZu(formel, B, A) {
  if (formel === 1) return { rechnung: `${B + A}²`, zerlegung: `${B + A} = ${B} + ${A}`, formelText: `(${B} + ${A})²`, ergebnis: (B + A) ** 2 };
  if (formel === 2) return { rechnung: `${B - A}²`, zerlegung: `${B - A} = ${B} − ${A}`, formelText: `(${B} − ${A})²`, ergebnis: (B - A) ** 2 };
  return { rechnung: `${B + A} · ${B - A}`, zerlegung: `${B + A} = ${B} + ${A} und ${B - A} = ${B} − ${A}`, formelText: `(${B} + ${A})(${B} − ${A})`, ergebnis: (B + A) * (B - A) };
}

function rechenweg(formel, B, A, t) {
  const zahl = (n) => String(n); // ohne Tausenderpunkt: "2.401" liest die Zahleingabe als 2,401
  if (formel === 3) {
    return [`${t.rechnung} = ${t.formelText} → 3. Formel`, `= ${B}² − ${A}² = ${zahl(B * B)} − ${A * A}`, `= <strong>${zahl(t.ergebnis)}</strong>`];
  }
  const op = formel === 1 ? "+" : "−";
  return [
    `${t.zerlegung}, also ${t.rechnung} = ${t.formelText} → ${formel}. Formel`,
    `= ${B}² ${op} 2 · ${B} · ${A} + ${A}² = ${zahl(B * B)} ${op} ${2 * A * B} + ${A * A}`,
    `= <strong>${zahl(t.ergebnis)}</strong>`,
  ];
}

export function erzeugeAufgabe(zufall, vorgaben = {}) {
  const formel = ganz(vorgaben.formel, 3) ?? zufall.wahl([1, 2, 3]);
  const basis = ganz(vorgaben.basis, 200) && vorgaben.basis % 10 === 0 ? vorgaben.basis : zufall.wahl(BASEN);
  const abstand = ganz(vorgaben.abstand, 9) && vorgaben.abstand < basis ? vorgaben.abstand : zufall.ganzzahl(1, 3);
  const t = aufgabeZu(formel, basis, abstand);
  return {
    thema: THEMA,
    formel, basis, abstand, ...t,
    text: `Rechne geschickt im Kopf: ${t.rechnung}. Welche binomische Formel hilft, und was kommt heraus?`,
    felder: [
      { id: "formel", typ: "auswahl", label: "Welche Formel hilft?", optionen: [1, 2, 3].map((f) => ({ wert: String(f), text: NAMEN[f] })) },
      zahlenfeld({ id: "ergebnis", label: `${t.rechnung} =`, art: "zahl", nurZahl: true }, t.ergebnis),
    ],
    loesung: { formel: String(formel), ergebnis: t.ergebnis },
    tipp: formel === 3
      ? "Liegen beide Zahlen gleich weit neben einer glatten Zahl?"
      : `Zerlege die Zahl in eine glatte Zahl (Zehner oder Hunderter) und einen kleinen Rest: ${t.zerlegung}.`,
    rechenweg: rechenweg(formel, basis, abstand, t),
  };
}

const MELDUNG_FORMEL = {
  1: "Die Zahl liegt knapp über einer glatten Zahl – Plus: die 1. Formel (a + b)².",
  2: "Die Zahl liegt knapp unter einer glatten Zahl – Minus: die 2. Formel (a − b)².",
  3: "Zwei verschiedene Zahlen, gleich weit neben einer glatten Zahl – einmal plus, einmal minus: die 3. Formel.",
};

/** Ergebnisse, die aus einer falsch angewendeten Formel entstehen: Mittelglied fehlt, halb, mit falschem Vorzeichen; b² mit falschem Vorzeichen. */
function fehlErgebnisse(B, A, richtig) {
  const liste = [];
  for (const mitte of [2 * A * B, -2 * A * B, A * B, -A * B, 0]) {
    for (const ende of [A * A, -A * A]) liste.push(B * B + mitte + ende);
  }
  return liste.filter((w) => w !== richtig);
}

export function pruefeAntwort(aufgabe, antworten) {
  const wahl = String(antworten.formel ?? "").trim();
  const feld = aufgabe.felder[1];
  const zahl = pruefeZahlAntwort(antworten.ergebnis, aufgabe.ergebnis, feld);
  const formelRichtig = wahl === String(aufgabe.formel);
  const felder = {
    formel: { korrekt: formelRichtig, wert: wahl || NaN },
    ergebnis: { korrekt: zahl.korrekt, wert: zahl.wert, fehler: zahl.fehler, meldung: zahl.meldung },
  };
  const ergebnis = ergebnisAusFeldern(felder, {
    richtig: `${aufgabe.rechnung} = ${aufgabe.formelText} = ${aufgabe.ergebnis}.`,
    falsch: "Das stimmt noch nicht. Zerlege die Zahl in eine glatte Zahl (Zehner oder Hunderter) und einen kleinen Rest.",
  });
  if (ergebnis.korrekt || ergebnis.fehler === "keine-eingabe") return ergebnis;
  if (wahl && !formelRichtig) return { ...ergebnis, fehler: "falsche-formel", meldung: MELDUNG_FORMEL[aufgabe.formel] };
  if (zahl.fehler === "falsch" && fehlErgebnisse(aufgabe.basis, aufgabe.abstand, aufgabe.ergebnis).some((w) => passtZu(antworten.ergebnis, w, { art: "zahl" }))) {
    return { ...ergebnis, fehler: "zerlegung-falsch", meldung: `Die Zerlegung stimmt, aber die Formel ist nicht ganz richtig angewendet. Schreib alle Glieder auf: ${aufgabe.rechenweg[1].replace(/^= /, "").split(" = ")[0]}.` };
  }
  return ergebnis;
}
