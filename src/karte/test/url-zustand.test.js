import { test } from 'node:test';
import assert from 'node:assert/strict';
import { leseZustand, schreibeZustand, STANDARD } from '../js/url-zustand.js';

test('leseZustand: leer → Standard (HE, alle Jahrgänge, keine Leitidee, keine Lücken, kein Knoten)', () => {
  assert.deepEqual(leseZustand(''), STANDARD);
  assert.deepEqual(leseZustand('?'), STANDARD);
});

test('leseZustand: alle Parameter', () => {
  assert.deepEqual(leseZustand('?land=BY&jahrgang=8&leitidee=daten-und-zufall&luecken=1&knoten=prozent-grundwert'), {
    land: 'BY', jahrgang: 8, leitidee: 'daten-und-zufall', luecken: true, knoten: 'prozent-grundwert',
  });
});

test('leseZustand: ungültige Werte fallen auf Standard zurück', () => {
  assert.equal(leseZustand('?jahrgang=11').jahrgang, null);
  assert.equal(leseZustand('?jahrgang=abc').jahrgang, null);
  assert.equal(leseZustand('?land=xx').land, 'HE');
  assert.equal(leseZustand('?land=by').land, 'BY');
  assert.equal(leseZustand('?leitidee=Böse<Script>').leitidee, null);
  assert.equal(leseZustand('?luecken=0').luecken, false);
  assert.equal(leseZustand('?luecken=ja').luecken, true);
});

test('schreibeZustand: Land immer, Rest nur wenn gesetzt; Rundreise', () => {
  assert.equal(schreibeZustand(STANDARD), '?land=HE');
  const z = { land: 'HE', jahrgang: 8, leitidee: 'zahl-und-operation', luecken: true, knoten: 'prozent-grundwert' };
  assert.equal(schreibeZustand(z), '?land=HE&jahrgang=8&leitidee=zahl-und-operation&luecken=1&knoten=prozent-grundwert');
  assert.deepEqual(leseZustand(schreibeZustand(z)), z);
});
