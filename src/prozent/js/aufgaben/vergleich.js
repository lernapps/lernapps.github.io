/* Aufgaben: Um wie viel Prozent ist A größer/kleiner als B? Die Bezugsgröße steht nach "als". */
import { formatZahl, gleichheitszeichen, runde } from "../../../kern/js/zahlen.js";
import { multipliziere, dividiere, subtrahiere, bruch } from "../../../kern/js/bruch.js";
import { zahlenfeld, pruefeZahlAntwort, passtZu } from "../../../kern/js/zahlantwort.js";
import { waehleGrundwert, mitEinheit, formatWert, ergebnisFuer, MELDUNG_KEINE_ZAHL, PROZENTSAETZE, alsBruch } from "./gemeinsam.js";

export const THEMA = "vergleich";
// URL-Parameter (öffentlicher Vertrag, in llms.txt dokumentiert); der Kern liest sie mit leseVorgaben.
export const URL_ZAHLEN = ["a", "b"];
export const URL_TEXTE = ["frage"];

const KONTEXTE = [
  // Bei Preisen sagt man „teurer“ und „billiger“ (L-025).
  { id: "laeden", einheit: "€", min: 20, max: 500, nachkomma: 1, schritt: 5, nameA: "Im Laden A kostet ein Rucksack", nameB: "im Laden B", dingA: "Laden A", dingB: "Laden B",
    woerter: { groesser: "teurer", kleiner: "billiger" }, frage: (v, bezug, wort) => `Um wie viel Prozent ist der Rucksack in ${v} ${wort} als in ${bezug}?` },
  { id: "punkte", einheit: "Punkte", min: 20, max: 200, nachkomma: 0, schritt: 1, nameA: "Lena hat im ersten Spiel", nameB: "im zweiten Spiel", dingA: "das Ergebnis im ersten Spiel", dingB: "das Ergebnis im zweiten Spiel" },
  { id: "groesse", einheit: "cm", min: 120, max: 200, nachkomma: 0, schritt: 1, nameA: "Ben ist", nameB: "seine Schwester Mia", dingA: "Ben", dingB: "Mia" },
  { id: "schueler", einheit: "Schüler", min: 200, max: 1000, nachkomma: 0, schritt: 10, nameA: "Die Schule am See hat", nameB: "die Stadtschule", dingA: "die Schule am See", dingB: "die Stadtschule" },
];
const NEUTRAL = { id: "neutral", einheit: "", nameA: "Der Wert A ist", nameB: "der Wert B", dingA: "A", dingB: "B" };
const SAETZE = PROZENTSAETZE.filter((p) => p <= 60);

/** Legt fest, welcher Wert die Bezugsgröße (100\u00a0%) ist und welcher verglichen wird. */
function rollen(a, b, frage) {
  // "größer als": der kleinere Wert ist Bezug; "kleiner als": der größere Wert ist Bezug.
  const klein = Math.min(a, b);
  const gross = Math.max(a, b);
  return frage === "groesser" ? { bezug: klein, vergleich: gross } : { bezug: gross, vergleich: klein };
}

/** Erzeugt eine Vergleichsaufgabe. Vorgaben: {a, b, frage: "groesser" | "kleiner"}. */
export function erzeugeAufgabe(zufall, vorgaben = {}) {
  let frage = vorgaben.frage === "groesser" || vorgaben.frage === "kleiner" ? vorgaben.frage : zufall.wahl(["groesser", "kleiner"]);
  let kontext = zufall.wahl(KONTEXTE);
  let a;
  let b;
  if (vorgaben.a && vorgaben.b && vorgaben.a !== vorgaben.b) {
    a = vorgaben.a;
    b = vorgaben.b;
    const passend = KONTEXTE.filter((k) => a >= k.min && a <= k.max && b >= k.min && b <= k.max);
    kontext = passend.length ? zufall.wahl(passend) : NEUTRAL;
  } else {
    // Beide Werte bleiben im Bereich des Kontexts (L-011): keine 2,66 m große Schwester.
    // Rückfallebene: 10 % vom Rand des Bereichs liegt immer darin.
    let bezug = frage === "groesser" ? kontext.min : kontext.max;
    let anderer = runde(frage === "groesser" ? bezug * 1.1 : bezug * 0.9, kontext.nachkomma);
    for (let versuch = 0; versuch < 50; versuch++) {
      const p = zufall.wahl(SAETZE);
      const basis = waehleGrundwert(zufall, p, kontext) ?? kontext.min;
      const x = runde(frage === "groesser" ? basis * (1 + p / 100) : basis * (1 - p / 100), kontext.nachkomma);
      if (x >= kontext.min && x <= kontext.max) {
        [bezug, anderer] = [basis, x];
        break;
      }
    }
    [a, b] = zufall.wahl([[bezug, anderer], [anderer, bezug]]);
  }
  const { bezug, vergleich } = rollen(a, b, frage);
  const unterschied = subtrahiere(alsBruch(Math.max(a, b)), alsBruch(Math.min(a, b)));
  const exakt = multipliziere(dividiere(unterschied, alsBruch(bezug)), bruch(100));
  const prozentsatz = runde(Math.abs(a - b) / bezug * 100, 2);
  const andererSatz = runde(Math.abs(a - b) / vergleich * 100, 1);
  const einheit = kontext.einheit;
  const [dingV, dingBezug] = vergleich === a ? [kontext.dingA, kontext.dingB] : [kontext.dingB, kontext.dingA];
  const wort = kontext.woerter?.[frage] ?? (frage === "groesser" ? "größer" : "kleiner");
  const text = `${kontext.nameA} ${mitEinheit(a, einheit)}, ${kontext.nameB} ${mitEinheit(b, einheit)}. `
    + (kontext.frage ? kontext.frage(dingV, dingBezug, wort) : `Um wie viel Prozent ist ${dingV} ${wort} als ${dingBezug}?`);
  const gross = Math.max(a, b);
  const klein = Math.min(a, b);
  const zeichen = gleichheitszeichen(exakt.z / exakt.n, prozentsatz);
  const etwa = gleichheitszeichen(Math.abs(a - b) / vergleich * 100, andererSatz) === "=" ? "" : "etwa ";
  return {
    thema: "vergleich", kontext: kontext.id, text, a, b, frage, wort, bezug, vergleich, prozentsatz, einheit,
    exakt,
    gesucht: "prozentsatz",
    felder: [zahlenfeld({ id: "prozentsatz", label: `Um wie viel Prozent ${wort}?`, einheit: "%", art: "prozent" }, exakt)],
    loesung: { prozentsatz },
    tipp: `Die Bezugsgröße steht nach dem Wort „als“: ${dingBezug} = ${mitEinheit(bezug, einheit)} sind 100\u00a0%. `
      + `Teile den Unterschied (${mitEinheit(gross - klein, einheit)}) durch die Bezugsgröße, nicht durch den anderen Wert – sonst kommt ${etwa}${formatZahl(andererSatz)}\u00a0% heraus, und das wäre die Antwort auf die andere Frage.`,
    rechenweg: [
      `Unterschied: ${formatWert(gross, einheit)} − ${formatWert(klein, einheit)} = ${formatWert(gross - klein, einheit)}`,
      `Bezugsgröße (steht nach „als“): ${mitEinheit(bezug, einheit)} = 100\u00a0%`,
      `p = ${formatWert(gross - klein, einheit)} / ${formatWert(bezug, einheit)} · 100 ${zeichen} ${formatZahl(prozentsatz)}`,
      `p\u00a0% ${zeichen} ${formatZahl(prozentsatz)}\u00a0%`,
    ],
  };
}

const MELDUNGEN = {
  "keine-zahl": MELDUNG_KEINE_ZAHL,
  "bezugsgroesse-verwechselt": "Das ist die Antwort auf die andere Frage. Die Bezugsgröße (100\u00a0%) ist die Zahl nach „als“.",
  "differenz-statt-prozent": "Das ist nur der Unterschied in der Einheit. Gefragt ist der Unterschied in Prozent der Bezugsgröße.",
  "verhaeltnis-statt-unterschied": "Das ist das Verhältnis der beiden Werte in Prozent. Gefragt ist, um wie viel Prozent mehr oder weniger – also die 100\u00a0% abziehen.",
  "falsch": "Das stimmt noch nicht. Rechne: Unterschied geteilt durch die Bezugsgröße, dann mal 100.",
};

/** Prüft die Eingabe nach der Rundungsregel und erkennt typische Fehler. */
export function pruefeAntwort(aufgabe, antworten) {
  const { a, b, bezug, vergleich, prozentsatz } = aufgabe;
  const feld = aufgabe.felder[0];
  const eingabe = antworten.prozentsatz;
  const ergebnis = pruefeZahlAntwort(eingabe, aufgabe.exakt, feld);
  const passt = (x) => passtZu(eingabe, x, { art: feld.art });
  const unterschied = subtrahiere(alsBruch(Math.max(a, b)), alsBruch(Math.min(a, b)));
  let fehler = ergebnis.fehler;
  if (fehler === "falsch") {
    if (passt(multipliziere(dividiere(unterschied, alsBruch(vergleich)), bruch(100)))) fehler = "bezugsgroesse-verwechselt";
    else if (passt(unterschied)) fehler = "differenz-statt-prozent";
    else if (passt(multipliziere(dividiere(alsBruch(vergleich), alsBruch(bezug)), bruch(100)))) fehler = "verhaeltnis-statt-unterschied";
  }
  return ergebnisFuer("prozentsatz", ergebnis, fehler, MELDUNGEN, `${formatZahl(prozentsatz)}\u00a0%.`);
}
