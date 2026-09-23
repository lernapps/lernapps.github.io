// Use Case: Mathe-Karte – App-Einträge kommen aus den App-Konfigurationen (APP.kartenEintrag, KOMPETENZEN[].kartenKnoten),
// noch nicht migrierte Apps aus der Übergangsdatei src/karte/daten/externe-eintraege.js.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { eintragAusApp, pruefeAppEintrag, eintraegeFuerKarte } from '../../lib/karte/eintraege.js';

const FELDER = {
  'aktiv-level': 2, backend: 'none', 'external-requests': 'on-consent', dsgvo: 'amber', evidence: 'anecdotal',
  jahrgaenge: [8], lizenz: '', stand: '2026-09-23',
};

function app(ueberschreiben = {}) {
  return {
    id: 'binom-trainer', pfad: 'binom', titel: 'Binomische Formeln', klasse: 8, beschreibung: 'Binome üben.',
    basisUrl: 'https://lernapps.github.io/binom/', quellcode: 'https://github.com/lernapps/lernapps.github.io/tree/main/src/binom',
    kartenEintrag: { ...FELDER },
    kompetenzen: [
      { id: 'erste-binomische', kartenKnoten: ['klammern-binome'] },
      { id: 'geschickt-rechnen', kartenKnoten: ['klammern-binome', 'terme-variable'] },
    ],
    ...ueberschreiben,
  };
}

const extern = {
  pfad: 'prozent', id: 'prozent-trainer', titel: 'Prozent-Trainer', url: 'https://raifdmueller.github.io/prozent-trainer/',
  quellcode: 'https://github.com/raifdmueller/prozent-trainer', kompetenzen: ['prozent-grundwert'], ...FELDER,
  jahrgaenge: [7, 8], beschreibung: 'Prozent üben.',
};

test('eintragAusApp: id, Titel, Adressen und Beschreibung aus APP, Knoten eindeutig aus den Kompetenzen', () => {
  assert.deepEqual(eintragAusApp(app()), {
    id: 'binom-trainer', titel: 'Binomische Formeln', url: 'https://lernapps.github.io/binom/',
    quellcode: 'https://github.com/lernapps/lernapps.github.io/tree/main/src/binom',
    kompetenzen: ['klammern-binome', 'terme-variable'], ...FELDER, beschreibung: 'Binome üben.',
  });
});

test('eintragAusApp: ohne kartenEintrag keine App der Karte; jahrgaenge fehlt → [APP.klasse]', () => {
  assert.equal(eintragAusApp(app({ kartenEintrag: undefined })), null);
  const { jahrgaenge, ...ohne } = FELDER;
  assert.deepEqual(eintragAusApp(app({ kartenEintrag: ohne })).jahrgaenge, [8]);
});

test('pruefeAppEintrag: unbekannter Knoten nennt App-Konfiguration und Kompetenz', () => {
  const fehler = pruefeAppEintrag(app(), new Set(['klammern-binome']));
  assert.equal(fehler.length, 1);
  assert.match(fehler[0], /src\/binom\/js\/app\.config\.js/);
  assert.match(fehler[0], /terme-variable/);
  assert.match(fehler[0], /geschickt-rechnen/);
  assert.deepEqual(pruefeAppEintrag(app(), new Set(['klammern-binome', 'terme-variable'])), []);
});

test('pruefeAppEintrag: halbe Konfiguration (nur Knoten oder nur kartenEintrag) ist ein Fehler', () => {
  const knoten = new Set(['klammern-binome', 'terme-variable']);
  assert.match(pruefeAppEintrag(app({ kartenEintrag: undefined }), knoten)[0], /kartenEintrag fehlt/);
  const ohneKnoten = app({ kompetenzen: [{ id: 'a' }] });
  assert.match(pruefeAppEintrag(ohneKnoten, knoten)[0], /kartenKnoten/);
  assert.deepEqual(pruefeAppEintrag({ pfad: 'physik', kompetenzen: [{ id: 'a' }] }, knoten), []);
});

test('eintraegeFuerKarte: Apps und Übergangseinträge, sortiert nach id; Apps ohne kartenEintrag fehlen', () => {
  const eintraege = eintraegeFuerKarte([app(), app({ pfad: 'optik', id: 'optik', kartenEintrag: undefined })], [extern]);
  assert.deepEqual(eintraege.map((e) => e.id), ['binom-trainer', 'prozent-trainer']);
  assert.equal(eintraege[1].url, 'https://raifdmueller.github.io/prozent-trainer/');
  assert.equal('pfad' in eintraege[1], false);
});

test('eintraegeFuerKarte: migrierte App ohne kartenEintrag → Übergangseintrag mit Adressen aus dem Monorepo', () => {
  const prozent = app({ id: 'prozent-trainer', pfad: 'prozent', titel: 'Prozentrechnung', basisUrl: 'https://lernapps.github.io/prozent/',
    quellcode: 'https://github.com/lernapps/lernapps.github.io/tree/main/src/prozent', kartenEintrag: undefined, kompetenzen: [] });
  const [e] = eintraegeFuerKarte([prozent], [extern]);
  assert.equal(e.url, 'https://lernapps.github.io/prozent/');
  assert.equal(e.quellcode, 'https://github.com/lernapps/lernapps.github.io/tree/main/src/prozent');
  assert.deepEqual(e.kompetenzen, ['prozent-grundwert']);
});

test('eintraegeFuerKarte: App mit kartenEintrag UND Übergangseintrag → Fehler (Übergangseintrag löschen)', () => {
  const prozent = app({ id: 'prozent-trainer', pfad: 'prozent' });
  assert.throws(() => eintraegeFuerKarte([prozent], [extern]), /externe-eintraege\.js.*prozent-trainer/s);
});
