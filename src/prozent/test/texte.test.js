// Use Case: Aufgabe lesen – Aufgabentexte, Tipps und Einheiten in Lehrerstimme (Lektorat L-016, L-018, L-024, L-025, L-029).
import { test } from "node:test";
import assert from "node:assert/strict";
import { erzeugeZufall } from "../../kern/js/zufall.js";
import * as prozentwert from "../js/aufgaben/prozentwert.js";
import * as prozentsatz from "../js/aufgaben/prozentsatz.js";
import * as vergleich from "../js/aufgaben/vergleich.js";
import * as veraenderung from "../js/aufgaben/veraenderung.js";
import * as sachaufgaben from "../js/aufgaben/sachaufgaben.js";
import * as grundwert from "../js/aufgaben/grundwert.js";
import * as grundbegriffe from "../js/aufgaben/grundbegriffe.js";

const alle = (modul, vorgaben = {}) => Array.from({ length: 300 }, (_, i) => modul.erzeugeAufgabe(erzeugeZufall(i + 1), vorgaben));
const MODULE = { prozentwert, prozentsatz, vergleich, veraenderung, sachaufgaben, grundwert, grundbegriffe };

test("L-016: Tom wirft …-mal und trifft …-mal – keine Treffer, die treffen", () => {
  const sport = alle(prozentsatz).filter((a) => a.kontext === "sport");
  assert.ok(sport.length > 10);
  for (const a of sport) {
    assert.match(a.text, /^Tom wirft \d+-mal auf den Korb und trifft \d+-mal\. Wie viel Prozent seiner Würfe sind Treffer\?$/, a.text);
  }
});

test("L-018: gefragt sind Treffer, also Einheit „Treffer“ an Feld und Lösung", () => {
  const sport = alle(prozentwert).filter((a) => a.kontext === "sport");
  assert.ok(sport.length > 10);
  for (const a of sport) {
    assert.equal(a.felder[0].einheit, "Treffer");
    assert.match(a.rechenweg.at(-1), /Treffer$/);
    assert.doesNotMatch(a.text + a.rechenweg.join(" "), /Würfe$/);
  }
});

test("L-024: keine Großbuchstaben-Wörter zum Hervorheben in Texten, Tipps und Meldungen", () => {
  for (const [name, modul] of Object.entries(MODULE)) {
    for (const a of alle(modul).slice(0, 80)) {
      const falsch = modul.pruefeAntwort(a, Object.fromEntries(a.felder.map((f) => [f.id, "999999"])));
      for (const t of [a.text, a.tipp, ...(a.rechenweg ?? []), falsch.meldung ?? ""]) {
        assert.doesNotMatch(t, /\b[A-ZÄÖÜ]{4,}\b/, `${name}: ${t}`);
      }
    }
  }
  const alt = veraenderung.erzeugeAufgabe(erzeugeZufall(1), { typ: "alt" });
  assert.match(alt.tipp, /auf den <strong>alten<\/strong> Wert/);
});

test("L-025: Preise im Laden sind „billiger“ oder „teurer“, nicht „kleiner“ oder „größer“", () => {
  const laeden = alle(vergleich).filter((a) => a.kontext === "laeden");
  assert.ok(laeden.length > 10);
  for (const a of laeden) {
    const wort = a.frage === "groesser" ? "teurer" : "billiger";
    assert.match(a.text, new RegExp(`Um wie viel Prozent ist der Rucksack in Laden [AB] ${wort} als in Laden [AB]\\?$`), a.text);
    assert.match(a.felder[0].label, new RegExp(wort));
  }
});

test("L-029: bei Personen heißt es „wie viele Personen“", () => {
  const umfrage = alle(sachaufgaben, { typ: "dreisatz" }).filter((a) => a.kontext === "umfrage");
  assert.ok(umfrage.length > 10);
  for (const a of umfrage) assert.match(a.text, /wie viele Personen [\d,]+\u00a0% davon sind\./, a.text);
});
