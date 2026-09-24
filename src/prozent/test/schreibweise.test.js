// Use Case: Aufgaben lesen und Lösung zeigen – Geld mit zwei Nachkommastellen (L-009), Zahl und Zeichen bleiben
// zusammen (L-010). BR-2/BR-5 (Rundungsregel) bleiben: „780,5“ ist als Eingabe weiter richtig.
import { test } from "node:test";
import assert from "node:assert/strict";
import { erzeugeZufall } from "../../kern/js/zufall.js";
import { mitEinheit, formatWert } from "../../kern/js/zahlen.js";
import * as grundbegriffe from "../js/aufgaben/grundbegriffe.js";
import * as prozentwert from "../js/aufgaben/prozentwert.js";
import * as grundwert from "../js/aufgaben/grundwert.js";
import * as prozentsatz from "../js/aufgaben/prozentsatz.js";
import * as vergleich from "../js/aufgaben/vergleich.js";
import * as veraenderung from "../js/aufgaben/veraenderung.js";
import * as sachaufgaben from "../js/aufgaben/sachaufgaben.js";

const MODULE = { grundbegriffe, prozentwert, grundwert, prozentsatz, vergleich, veraenderung, sachaufgaben };
const NBSP = "\u00a0";

/** Alle Texte, die ein Kind zu einer Aufgabe sieht: Aufgabe, Tipp, Lösungsweg, Feldbeschriftungen, Rückmeldung. */
function texte(modul, a) {
  const richtig = Object.fromEntries(Object.entries(a.loesung).map(([id, w]) => [id, String(w).replace(".", ",")]));
  return [a.text, a.tipp, ...(a.rechenweg ?? []), ...a.felder.map((f) => f.label ?? ""), ...(a.tabelle ?? []).map((z) => `${z.links} ${z.rechts ?? ""}`),
    modul.pruefeAntwort(a, richtig).meldung ?? ""];
}

test("L-009: mitEinheit schreibt Geld mit zwei Nachkommastellen, ganze Beträge ohne Komma", () => {
  assert.equal(mitEinheit(780.5, "€"), `780,50${NBSP}€`);
  assert.equal(mitEinheit(14.4, "€"), `14,40${NBSP}€`);
  assert.equal(mitEinheit(250, "€"), `250${NBSP}€`);
  assert.equal(mitEinheit(12.5, "%"), `12,5${NBSP}%`);
  assert.equal(formatWert(780.5, "€"), "780,50");
  assert.equal(formatWert(12.5, "Schüler"), "12,5");
});

test("L-009/L-010: kein Geldbetrag mit einer Nachkommastelle, kein normales Leerzeichen vor % oder €", () => {
  for (const [name, modul] of Object.entries(MODULE)) {
    for (let s = 1; s <= 150; s++) {
      const a = modul.erzeugeAufgabe(erzeugeZufall(s));
      for (const t of texte(modul, a)) {
        assert.doesNotMatch(t, /\d,\d(?!\d)\s*€/, `${name} Seed ${s}: ${t}`);
        assert.doesNotMatch(t, /[\dp] [%€]/, `${name} Seed ${s}: normales Leerzeichen in „${t}“`);
      }
    }
  }
});

test("L-009: Geldbeträge im Lösungsweg haben zwei Nachkommastellen", () => {
  const a = prozentwert.erzeugeAufgabe(erzeugeZufall(1), { g: 780.5, p: 10 });
  assert.equal(a.einheit, "€");
  assert.ok(a.rechenweg.some((z) => z.includes("780,50 · 10 / 100")), a.rechenweg.join(" | "));
  assert.ok(a.rechenweg.at(-1).endsWith(`78,05${NBSP}€`), a.rechenweg.at(-1));
});

test("BR-2/BR-5 bleiben: „…,5“ und „…,50“ sind bei einem Betrag wie 780,50 € beide richtig", () => {
  let geprueft = 0;
  for (let s = 1; s <= 300; s++) {
    const a = veraenderung.erzeugeAufgabe(erzeugeZufall(s), { typ: "neu" });
    if (a.einheit !== "€" || Number.isInteger(a.neu * 10) === false || Number.isInteger(a.neu)) continue;
    const kurz = String(a.neu).replace(".", ",");
    assert.equal(veraenderung.pruefeAntwort(a, { neu: kurz }).korrekt, true, kurz);
    assert.equal(veraenderung.pruefeAntwort(a, { neu: `${kurz}0` }).korrekt, true, kurz);
    assert.match(veraenderung.pruefeAntwort(a, { neu: kurz }).meldung, new RegExp(`${kurz}0${NBSP}€`));
    geprueft++;
  }
  assert.ok(geprueft > 5, `nur ${geprueft} Aufgaben mit Cent-Betrag`);
});
