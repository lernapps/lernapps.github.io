import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  indiziere,
  jahrgaengeAus,
  zuordnungenFuer,
  kompetenzenFuer,
  istErfasst,
  baumFuer,
  zusammenfassung,
  jahrgangBadges,
  AKTIV_LEVEL,
} from '../js/daten.js';
import { daten as roh } from './fixture-daten.js';

const d = indiziere(roh);

test('indiziere: Index-Maps für Kompetenzen, Einträge, Lehrpläne je Land', () => {
  assert.equal(d.kompetenzById.get('prozent-grundwert').titel, 'Grundwert berechnen');
  assert.equal(d.eintragById.get('zufall-trainer').dsgvo, 'green');
  assert.equal(d.lehrplanByLand.get('HE').erfasst, 'vollstaendig');
  assert.equal(d.lehrplanByLand.get('BY').erfasst, 'nein');
  assert.deepEqual(d.kinderVon.get('prozentrechnung').map((k) => k.id), ['prozent-grundwert', 'prozent-veraenderung']);
});

test('jahrgaengeAus: "7" → [7], "5/6" → [5, 6], Unsinn → []', () => {
  assert.deepEqual(jahrgaengeAus('7'), [7]);
  assert.deepEqual(jahrgaengeAus('5/6'), [5, 6]);
  assert.deepEqual(jahrgaengeAus('7/8'), [7, 8]);
  assert.deepEqual(jahrgaengeAus('-'), []);
});

test('zuordnungenFuer: Zeilen eines Landes für eine Kompetenz; nicht erfasstes Land → leer', () => {
  assert.deepEqual(zuordnungenFuer(d, 'HE', 'prozent-veraenderung').map((z) => z.einheit), ['7.1', '8.3']);
  assert.deepEqual(zuordnungenFuer(d, 'BY', 'prozent-veraenderung'), []);
});

test('kompetenzenFuer: ohne Filter alle Knoten', () => {
  assert.equal(kompetenzenFuer(d, { land: 'HE' }).length, 6);
});

test('kompetenzenFuer: Jahrgang 8 trifft Knoten mit Zeile 8, Jahrgang 5 und 6 treffen "5/6"', () => {
  const ids = (f) => kompetenzenFuer(d, f).map((k) => k.id);
  assert.deepEqual(ids({ land: 'HE', jahrgang: 8 }), ['prozentrechnung', 'prozent-veraenderung', 'boxplot']);
  assert.deepEqual(ids({ land: 'HE', jahrgang: 5 }), ['brueche-begriff']);
  assert.deepEqual(ids({ land: 'HE', jahrgang: 6 }), ['brueche-begriff']);
});

test('kompetenzenFuer: Leitidee- und Lücken-Filter', () => {
  const ids = (f) => kompetenzenFuer(d, f).map((k) => k.id);
  assert.deepEqual(ids({ land: 'HE', leitidee: 'daten-und-zufall' }), ['zufall-laplace', 'boxplot']);
  assert.deepEqual(ids({ land: 'HE', nurLuecken: true }), ['prozentrechnung', 'brueche-begriff', 'boxplot']);
  assert.deepEqual(ids({ land: 'HE', jahrgang: 8, leitidee: 'zahl-und-operation', nurLuecken: true }), ['prozentrechnung']);
});

test('kompetenzenFuer: nicht erfasstes Land ignoriert den Jahrgangsfilter (Karte weiß nichts)', () => {
  assert.equal(kompetenzenFuer(d, { land: 'BY', jahrgang: 8 }).length, 6);
  assert.equal(kompetenzenFuer(d, { land: 'BY', jahrgang: 8, nurLuecken: true }).length, 3);
  assert.equal(kompetenzenFuer(d, { land: 'BY' }).length, 6);
  assert.equal(istErfasst(d, 'BY'), false);
  assert.equal(istErfasst(d, 'HE'), true);
  assert.equal(istErfasst(d, 'XX'), false);
});

test('baumFuer: Leitideen in Reihenfolge, Eltern mit Kindern; Eltern ohne Treffer nur als Kontext', () => {
  const baum = baumFuer(d, kompetenzenFuer(d, { land: 'HE', jahrgang: 7 }));
  assert.deepEqual(baum.map((b) => b.leitidee.id), ['zahl-und-operation', 'daten-und-zufall']);
  const zahl = baum[0].knoten;
  assert.equal(zahl[0].kompetenz.id, 'prozentrechnung');
  assert.equal(zahl[0].kontext, false);
  assert.deepEqual(zahl[0].kinder.map((k) => k.kompetenz.id), ['prozent-grundwert', 'prozent-veraenderung']);
  const nur8 = baumFuer(d, kompetenzenFuer(d, { land: 'HE', jahrgang: 8, nurLuecken: false }));
  assert.deepEqual(nur8[0].knoten[0].kinder.map((k) => k.kompetenz.id), ['prozent-veraenderung']);
  const luecken = baumFuer(d, kompetenzenFuer(d, { land: 'HE', jahrgang: 7, nurLuecken: true }));
  assert.equal(luecken.length, 1);
  assert.deepEqual(luecken[0].knoten.map((k) => [k.kompetenz.id, k.kinder.length]), [['prozentrechnung', 0]]);
  const kindOhneEltern = baumFuer(d, [d.kompetenzById.get('prozent-grundwert')]);
  assert.equal(kindOhneEltern[0].knoten[0].kompetenz.id, 'prozentrechnung');
  assert.equal(kindOhneEltern[0].knoten[0].kontext, true);
});

test('zusammenfassung: Zahlen und Text', () => {
  const z = zusammenfassung(d, { land: 'HE', jahrgang: 8 });
  assert.deepEqual([z.gesamt, z.mitApp, z.ohne], [3, 1, 2]);
  assert.equal(z.text, 'Hessen · Gymnasium · Jahrgang 8: 3 Kompetenzen, 1 mit App, 2 ohne');
  assert.equal(zusammenfassung(d, { land: 'HE' }).text, 'Hessen · Gymnasium · alle Jahrgänge: 6 Kompetenzen, 3 mit App, 3 ohne');
  assert.equal(zusammenfassung(d, { land: 'HE', jahrgang: 7, leitidee: 'daten-und-zufall' }).text,
    'Hessen · Gymnasium · Jahrgang 7 · Daten und Zufall: 1 Kompetenz, 1 mit App, 0 ohne');
  assert.equal(zusammenfassung(d, { land: 'BY' }).text, 'Bayern · Gymnasium · noch nicht erfasst: 6 Kompetenzen, 3 mit App, 3 ohne');
});

test('jahrgangBadges: eindeutig, sortiert, fakultativ markiert', () => {
  assert.deepEqual(jahrgangBadges(zuordnungenFuer(d, 'HE', 'prozent-veraenderung')), [
    { text: '7', einheit: '7.1', pflicht: true },
    { text: '8', einheit: '8.3', pflicht: true },
  ]);
  assert.deepEqual(jahrgangBadges(zuordnungenFuer(d, 'HE', 'boxplot')), [{ text: '8', einheit: '8.4', pflicht: false }]);
  assert.deepEqual(jahrgangBadges([]), []);
});

test('AKTIV_LEVEL: 1 Create … 5 Receive', () => {
  assert.equal(AKTIV_LEVEL[1], 'Create');
  assert.equal(AKTIV_LEVEL[5], 'Receive');
});

test('datenUrl: data.json neben js/, mit dem ?v= des Moduls (Cache-Schutz ohne Version im Quellcode)', async () => {
  const { datenUrl } = await import('../js/daten.js');
  assert.equal(datenUrl('https://lernapps.github.io/karte/js/daten.js?v=ab12cd34'), 'https://lernapps.github.io/karte/data.json?v=ab12cd34');
  assert.equal(datenUrl('http://localhost:8803/karte/js/daten.js'), 'http://localhost:8803/karte/data.json');
});
