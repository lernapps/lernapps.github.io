/*
 * Gemeinsames Prüfergebnis aller Generatoren: { korrekt, fehler, felder: { feldId: { korrekt, wert, fehler? } }, meldung }.
 * ui.js färbt damit die Felder, zeigt die Meldung und zählt; testseite.js liest nur `korrekt`.
 * Hinweise (zu grob gerundet, gemischte Zahl, Ausdruck statt Zahl, Term in falscher Form) sind kein Fehler: neutral anzeigen, nicht zählen.
 * Generisch – nicht pro App ändern. Fachliche Fehlercodes und Meldungen stehen im Generator.
 */
import { pruefeZahlAntwort, HINWEIS_FEHLER } from "./zahlantwort.js";
import { TERM_HINWEIS_FEHLER } from "./termantwort.js";

export const MELDUNG_KEINE_ZAHL = "Bitte gib eine Zahl ein, zum Beispiel 12,5.";
export const MELDUNG_KEIN_TERM = "Das konnte ich nicht lesen. Schreib einen Bruch wie 3/4, eine Dezimalzahl wie 0,75 oder einen Term wie 1/2*3/4.";

const HINWEISE = new Set([...HINWEIS_FEHLER, ...TERM_HINWEIS_FEHLER]);
/** Fehlercodes, bei denen nichts Lesbares eingegeben wurde oder nur ein Hinweis kam – das zählt nicht als Versuch. */
const NICHT_GEWERTET = new Set(["keine-zahl", "kein-term", "keine-eingabe", ...HINWEISE]);

function feldErgebnis({ korrekt, wert }, fehler) {
  return HINWEISE.has(fehler) ? { korrekt, wert, fehler } : { korrekt, wert };
}

/**
 * Ergebnis für eine Aufgabe mit einem Feld. Meldung: die eigene Meldung der Zahlprüfung (Hinweise, negative Wurzel),
 * sonst `meldungen[fehler]` oder `meldungen.falsch`. Setzt der Generator einen eigenen Fehlercode, gilt seine Meldung.
 */
export function ergebnisFuer(feldId, teil, fehler, meldungen, richtigText) {
  const { korrekt } = teil;
  const eigene = teil.fehler === fehler ? teil.meldung : undefined;
  return {
    korrekt,
    fehler,
    felder: { [feldId]: feldErgebnis(teil, fehler) },
    meldung: korrekt ? `Richtig! ${richtigText}`.trim() : eigene || meldungen[fehler] || meldungen.falsch,
  };
}

/**
 * Ergebnis für mehrere Felder: korrekt, wenn alle stimmen. meldungen: { richtig?, falsch?, "keine-eingabe"? }.
 * Ist kein Feld falsch, aber eines nur ein Hinweis (z. B. zu grob gerundet), wird das ganze Ergebnis dieser Hinweis.
 */
export function ergebnisAusFeldern(felder, meldungen = {}) {
  const teile = Object.values(felder);
  const korrekt = teile.length > 0 && teile.every((t) => t.korrekt === true);
  const leer = teile.every((t) => typeof t.wert === "number" && Number.isNaN(t.wert) && !HINWEISE.has(t.fehler));
  const hinweis = teile.find((t) => HINWEISE.has(t.fehler));
  const nurHinweise = hinweis && teile.every((t) => t.korrekt === true || HINWEISE.has(t.fehler));
  const felderAus = Object.fromEntries(Object.entries(felder).map(([id, t]) => [id, feldErgebnis(t, t.fehler)]));
  if (!korrekt && nurHinweise) return { korrekt, fehler: hinweis.fehler, felder: felderAus, meldung: hinweis.meldung };
  const fehler = korrekt ? undefined : leer ? "keine-eingabe" : "falsch";
  const standard = { "keine-eingabe": "Bitte füll die Felder aus.", falsch: "Noch nicht alles richtig. Die rot markierten Felder stimmen nicht." };
  return {
    korrekt,
    fehler,
    felder: felderAus,
    meldung: korrekt ? `Richtig! ${meldungen.richtig || ""}`.trim() : meldungen[fehler] || standard[fehler],
  };
}

/**
 * Prüft Bruch, Dezimalzahl, Prozent oder Rechenterm gegen einen Bruch {z, n} nach der Rundungsregel (zahlantwort.js).
 * feld: { art?, stellen?, nurZahl? }. wert ist der exakte Bruch der Eingabe oder NaN (unlesbar, Wurzel/pi, Hinweis ohne Bruch).
 */
export function pruefeBruchEingabe(eingabe, erwartet, feld = {}) {
  const r = pruefeZahlAntwort(eingabe, erwartet, feld);
  return { ...r, wert: r.bruch ?? NaN, zahl: r.wert, exakt: r.typ === "bruch" };
}

/** true, wenn das Ergebnis nur ein Hinweis ist (neutral anzeigen, nicht rot). */
export function istHinweis(ergebnis) {
  return ergebnis.korrekt !== true && HINWEISE.has(ergebnis.fehler);
}

/** true, wenn der Versuch im Zähler "Richtig: x von y" mitzählt. */
export function wirdGezaehlt(ergebnis) {
  return ergebnis.korrekt === true || !NICHT_GEWERTET.has(ergebnis.fehler);
}
