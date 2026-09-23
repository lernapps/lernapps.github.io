import { test, beforeEach } from "node:test";
import assert from "node:assert/strict";
import {
  erzeugeSpeicher, STUFEN,
} from "../../src/kern/js/storage.js";
// Dependency Inversion: der Kern kennt keine App; die Seite übergibt das Präfix (APP.id).
const SPEICHER_PRAEFIX = "binom-trainer";
const { ladeSelbsteinschaetzung, speichereSelbsteinschaetzung, SCHLUESSEL, ladeLetztenTest, speichereTest, SCHLUESSEL_TEST } = erzeugeSpeicher(SPEICHER_PRAEFIX);

function fakeStorage() {
  const daten = new Map();
  return {
    getItem: (k) => (daten.has(k) ? daten.get(k) : null),
    setItem: (k, v) => daten.set(k, String(v)),
    removeItem: (k) => daten.delete(k),
  };
}

beforeEach(() => {
  globalThis.localStorage = fakeStorage();
});

test("Selbsteinschätzung wird gespeichert und geladen", () => {
  assert.deepEqual(ladeSelbsteinschaetzung(), {});
  speichereSelbsteinschaetzung("kompetenz-a", "S");
  speichereSelbsteinschaetzung("kompetenz-b", "Ü");
  assert.deepEqual(ladeSelbsteinschaetzung(), { "kompetenz-a": "S", "kompetenz-b": "Ü" });
  assert.ok(STUFEN.includes("T"));
  assert.ok(localStorage.getItem(SCHLUESSEL).includes("kompetenz-a"));
});

test("ungültige Stufen werden abgelehnt", () => {
  assert.equal(speichereSelbsteinschaetzung("kompetenz-a", "X"), false);
  assert.deepEqual(ladeSelbsteinschaetzung(), {});
});

test("kaputter Speicher wirft nicht", () => {
  globalThis.localStorage = { getItem: () => "{kaputt", setItem: () => { throw new Error("voll"); } };
  assert.deepEqual(ladeSelbsteinschaetzung(), {});
  assert.equal(speichereSelbsteinschaetzung("kompetenz-a", "S"), false);
  delete globalThis.localStorage;
  assert.deepEqual(ladeSelbsteinschaetzung(), {});
});

test("letzter Test wird gespeichert und geladen", () => {
  assert.equal(ladeLetztenTest(), undefined);
  const daten = { nr: 4711, modus: "schnell", datum: "2026-09-23T10:00:00.000Z", ergebnis: { beispiel: "S" } };
  assert.equal(speichereTest(daten), true);
  assert.deepEqual(ladeLetztenTest(), daten);
  assert.ok(localStorage.getItem(SCHLUESSEL_TEST).includes("4711"));
});

test("unvollständiger oder kaputter Testdatensatz wird ignoriert", () => {
  assert.equal(speichereTest({ nr: 1 }), false);
  assert.equal(ladeLetztenTest(), undefined);
  localStorage.setItem(SCHLUESSEL_TEST, "{kaputt");
  assert.equal(ladeLetztenTest(), undefined);
  localStorage.setItem(SCHLUESSEL_TEST, JSON.stringify({ nr: "x", modus: "voll", datum: "d", ergebnis: {} }));
  assert.equal(ladeLetztenTest(), undefined);
  globalThis.localStorage = { getItem: () => null, setItem: () => { throw new Error("voll"); } };
  assert.equal(speichereTest({ nr: 1, modus: "voll", datum: "2026-09-23T10:00:00.000Z", ergebnis: {} }), false);
});

test("Schlüssel tragen das übergebene Präfix (bestehende Einschätzungen bleiben lesbar)", () => {
  assert.equal(SCHLUESSEL, `${SPEICHER_PRAEFIX}.selbsteinschaetzung`);
  assert.equal(SCHLUESSEL_TEST, `${SPEICHER_PRAEFIX}.test`);
});

test("zwei Apps mit verschiedenem Präfix teilen sich keine Daten", () => {
  const a = erzeugeSpeicher("app-a");
  const b = erzeugeSpeicher("app-b");
  a.speichereSelbsteinschaetzung("k", "S");
  assert.deepEqual(b.ladeSelbsteinschaetzung(), {});
  assert.throws(() => erzeugeSpeicher(""), /Präfix/);
});
