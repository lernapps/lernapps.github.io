// Use Case: Tutor-Deep-Link → Übung → "Zurück zu Claude" (ADR-021). Der Knopf erscheint nur mit ?von=tutor, kopiert
// eine Ergebniszeile, schließt den Tab und meldet sich, wenn der Browser den Tab nicht schließen durfte.
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  vomTutor, uebungsStatus, uebungsZeile, zurueckZuClaude, MELDUNG_KOPIERT, MELDUNG_NICHT_KOPIERT, WARTEZEIT_MS, PAUSE_VOR_SCHLIESSEN_MS,
} from "../../src/kern/js/zurueck.js";

test("vomTutor: nur von=tutor zeigt den Knopf", () => {
  assert.equal(vomTutor("?nr=4&von=tutor"), true);
  assert.equal(vomTutor("von=tutor"), true);
  assert.equal(vomTutor("?nr=4"), false);
  assert.equal(vomTutor(""), false);
  assert.equal(vomTutor(undefined), false);
  assert.equal(vomTutor("?von=Tutor"), false);
  assert.equal(vomTutor("?von=claude"), false);
});

test("uebungsStatus: richtig im n. Versuch, Lösung angesehen, noch nicht gelöst", () => {
  assert.equal(uebungsStatus({ versuche: 0 }), "noch nicht gelöst");
  assert.equal(uebungsStatus({ versuche: 1 }), "noch nicht gelöst (1 Versuch)");
  assert.equal(uebungsStatus({ versuche: 3 }), "noch nicht gelöst (3 Versuche)");
  assert.equal(uebungsStatus({ versuche: 1, richtigImVersuch: 1 }), "richtig im 1. Versuch");
  assert.equal(uebungsStatus({ versuche: 2, richtigImVersuch: 2 }), "richtig im 2. Versuch");
  assert.equal(uebungsStatus({ versuche: 1, loesungGezeigt: true }), "Lösung angesehen");
  // Erst richtig, dann Lösung zum Vergleich angesehen: das Kind hat es selbst geschafft.
  assert.equal(uebungsStatus({ versuche: 2, richtigImVersuch: 2, loesungGezeigt: true }), "richtig im 2. Versuch");
});

test("uebungsZeile: App, Kompetenz, Aufgabennummer, Status und Sitzung", () => {
  const zeile = uebungsZeile({
    appTitel: "Binomische Formeln",
    kompetenz: { nr: 2, titel: "(a+b)²" },
    nummer: 4,
    status: "richtig im 2. Versuch",
    sitzung: { richtig: 3, gesamt: 4 },
  });
  assert.equal(zeile, "Binomische Formeln, Kompetenz 2 „(a+b)²“, Aufgabe Nr. 4: richtig im 2. Versuch (Sitzung: 3 von 4 richtig)");
  assert.equal(
    uebungsZeile({ appTitel: "Prozent", kompetenz: { nr: 1, titel: "Grundwert" }, nummer: 7, status: "noch nicht gelöst", sitzung: { richtig: 0, gesamt: 0 } }),
    "Prozent, Kompetenz 1 „Grundwert“, Aufgabe Nr. 7: noch nicht gelöst",
  );
});

/** Browserfenster-Attrappe: close() setzt closed nur, wenn der Browser es erlaubt. */
function fenster(schliessbar) {
  return { closed: false, geschlossen: 0, close() { this.geschlossen += 1; if (schliessbar) this.closed = true; } };
}
const sofort = (fn) => fn(); // Timer-Attrappe: prüft ohne echte Wartezeit
function protokoll() {
  const p = { meldungen: [], feld: 0 };
  p.zeigeMeldung = (t) => p.meldungen.push(t);
  p.zeigeFeld = () => { p.feld += 1; };
  return p;
}

test("kopiert, schließt den Tab und bleibt still, wenn der Tab zu ist", async () => {
  const f = fenster(true);
  const p = protokoll();
  const kopiert = [];
  const ergebnis = await zurueckZuClaude({ text: "Zeile", kopiere: async (t) => { kopiert.push(t); return true; }, fenster: f, timer: sofort, ...p });
  assert.equal(ergebnis, "geschlossen");
  assert.deepEqual(kopiert, ["Zeile"]);
  assert.equal(f.geschlossen, 1);
  assert.deepEqual(p.meldungen, []);
});

test("Tab direkt geöffnet: close() wirkt nicht, nach 300 ms kommt die Meldung", async () => {
  const f = fenster(false);
  const p = protokoll();
  const ablauf = [];
  const zu = f.close.bind(f);
  f.close = () => { ablauf.push("close"); zu(); };
  const ergebnis = await zurueckZuClaude({ text: "Zeile", kopiere: async () => true, fenster: f, timer: (fn, ms) => { ablauf.push(ms); fn(); }, ...p });
  assert.equal(ergebnis, "offen");
  // Kurze Pause zwischen Kopieren und Schließen: Headless-Chromium verlor sonst 6 von 20 Zeilen (Playwright, 23.09.2026).
  assert.deepEqual(ablauf, [PAUSE_VOR_SCHLIESSEN_MS, "close", WARTEZEIT_MS]);
  assert.equal(PAUSE_VOR_SCHLIESSEN_MS, 100);
  assert.equal(WARTEZEIT_MS, 300);
  assert.deepEqual(p.meldungen, [MELDUNG_KOPIERT]);
  assert.equal(MELDUNG_KOPIERT, "Ergebnis kopiert. Schließ diesen Tab und füge es bei Claude ein.");
  assert.equal(p.feld, 0);
});

test("Zwischenablage gesperrt: Tab bleibt offen, die Zeile steht markiert im Feld", async () => {
  const f = fenster(true);
  const p = protokoll();
  const ergebnis = await zurueckZuClaude({ text: "Zeile", kopiere: async () => false, fenster: f, timer: sofort, ...p });
  assert.equal(ergebnis, "feld");
  assert.equal(f.geschlossen, 0, "ohne kopierte Zeile schließt der Tab nicht – sonst wäre das Ergebnis weg");
  assert.equal(p.feld, 1);
  assert.deepEqual(p.meldungen, [MELDUNG_NICHT_KOPIERT]);
});

test("nachVersuch zählt gewertete Versuche bis zum ersten richtigen; nach der Lösung zählt richtig nicht mehr", async () => {
  const { nachVersuch } = await import("../../src/kern/js/zurueck.js");
  let s = { versuche: 0 };
  s = nachVersuch(s, false);
  s = nachVersuch(s, true);
  assert.deepEqual(s, { versuche: 2, richtigImVersuch: 2 });
  assert.deepEqual(nachVersuch(s, false), s, "nach dem richtigen Versuch ändert sich nichts mehr");
  const gezeigt = nachVersuch({ versuche: 1, loesungGezeigt: true }, true);
  assert.equal(uebungsStatus(gezeigt), "Lösung angesehen");
});
