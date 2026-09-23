// Use Case: Mathe-Karte – Markdown-Daten (src/karte/daten) lesen, Referenzen prüfen, Abdeckung berechnen.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  leseFrontmatter,
  leseTabelle,
  pruefeReferenzen,
  berechneAbdeckung,
} from '../../lib/karte/daten.js';

// --- Frontmatter-Parser -----------------------------------------------------

test('leseFrontmatter: Strings, Zahlen, Listen, Leerwerte, Kommentare, Body', () => {
  const src = [
    '---',
    'id: prozent-grundaufgaben',
    'titel: Grundaufgaben der Prozentrechnung (Prozentwert, Prozentsatz, Grundwert)',
    'parent: prozentrechnung          # optional',
    'kmk-standard: "verwenden Prozent- und Zinsrechnung: vorstellungsbasiert"',
    'leer: ""',
    'schluesselwoerter: [Prozentwert, Prozentsatz, Grundwert]',
    'jahrgaenge: [7, 8]',
    'aktiv-level: 2',
    'stand: 2026-09-23',
    '---',
    '',
    'Erster Absatz.',
    '',
    'Zweiter Absatz.',
  ].join('\n');
  const { data, body } = leseFrontmatter(src);
  assert.equal(data.id, 'prozent-grundaufgaben');
  assert.equal(data.titel, 'Grundaufgaben der Prozentrechnung (Prozentwert, Prozentsatz, Grundwert)');
  assert.equal(data.parent, 'prozentrechnung');
  assert.equal(data['kmk-standard'], 'verwenden Prozent- und Zinsrechnung: vorstellungsbasiert');
  assert.equal(data.leer, '');
  assert.deepEqual(data.schluesselwoerter, ['Prozentwert', 'Prozentsatz', 'Grundwert']);
  assert.deepEqual(data.jahrgaenge, [7, 8]);
  assert.equal(data['aktiv-level'], 2);
  assert.equal(data.stand, '2026-09-23');
  assert.equal(body, 'Erster Absatz.\n\nZweiter Absatz.');
});

test('leseFrontmatter: leere Liste und Liste mit Anführungszeichen', () => {
  const { data } = leseFrontmatter('---\na: []\nb: ["x, y", z]\n---\n');
  assert.deepEqual(data.a, []);
  assert.deepEqual(data.b, ['x, y', 'z']);
});

test('leseFrontmatter: fehlender Frontmatter-Block wirft Fehler', () => {
  assert.throws(() => leseFrontmatter('kein frontmatter'), /Frontmatter/);
});

// --- Tabellen-Parser ---------------------------------------------------------

test('leseTabelle: Kopfzeile, Trennzeile, Datenzeilen', () => {
  const body = [
    'Einleitung.',
    '',
    '| kompetenz | jahrgang | einheit | pflicht |',
    '|---|---|---|---|',
    '| prozent-grundwert | 7 | 7.1 | ja |',
    '| zufall-laplace | 7 | 7.4 | nein |',
    '',
    'Nachwort.',
  ].join('\n');
  const rows = leseTabelle(body);
  assert.deepEqual(rows, [
    { kompetenz: 'prozent-grundwert', jahrgang: '7', einheit: '7.1', pflicht: 'ja' },
    { kompetenz: 'zufall-laplace', jahrgang: '7', einheit: '7.4', pflicht: 'nein' },
  ]);
});

test('leseTabelle: Zeile mit falscher Spaltenzahl wirft Fehler', () => {
  const body = '| a | b |\n|---|---|\n| 1 |\n';
  assert.throws(() => leseTabelle(body), /Spalten/);
});

// --- Referenzprüfung ---------------------------------------------------------

function fixture() {
  return {
    leitideen: [{ id: 'zahl-und-operation', titel: 'Z', quelle: 'KMK', reihenfolge: 1 }],
    kompetenzen: [
      { id: 'prozentrechnung', titel: 'P', leitidee: 'zahl-und-operation', 'kmk-standard': '', schluesselwoerter: [] },
      { id: 'prozent-grundwert', titel: 'G', leitidee: 'zahl-und-operation', parent: 'prozentrechnung', 'kmk-standard': '', schluesselwoerter: [] },
    ],
    lehrplaene: [{ id: 'hessen-gymnasium', land: 'HE', landname: 'Hessen', schulform: 'Gymnasium', stufe: 'Sek I', dokument: 'KC', url: 'https://x', stand: 2011, erfasst: 'vollstaendig' }],
    zuordnungen: [{ lehrplan: 'hessen-gymnasium', zeilen: [{ kompetenz: 'prozent-grundwert', jahrgang: '7', einheit: '7.1', pflicht: 'ja' }] }],
    eintraege: [{
      id: 'prozent-trainer', titel: 'PT', url: 'https://x', quellcode: '', kompetenzen: ['prozent-grundwert'],
      'aktiv-level': 2, backend: 'none', 'external-requests': 'on-consent', dsgvo: 'amber', evidence: 'anecdotal',
      jahrgaenge: [7, 8], lizenz: '', stand: '2026-09-23',
    }],
  };
}

test('pruefeReferenzen: gültige Daten liefern keine Fehler', () => {
  assert.deepEqual(pruefeReferenzen(fixture()), []);
});

test('pruefeReferenzen: unbekannte Leitidee, Parent, Kompetenz und Lehrplan werden gemeldet', () => {
  const d = fixture();
  d.kompetenzen[0].leitidee = 'gibt-es-nicht';
  d.kompetenzen[1].parent = 'nirgends';
  d.eintraege[0].kompetenzen.push('fehlt');
  d.zuordnungen[0].zeilen.push({ kompetenz: 'fehlt-auch', jahrgang: '8', einheit: '8.1', pflicht: 'ja' });
  d.zuordnungen.push({ lehrplan: 'bayern-gymnasium', zeilen: [] });
  const errors = pruefeReferenzen(d);
  assert.ok(errors.some((e) => e.includes('gibt-es-nicht')));
  assert.ok(errors.some((e) => e.includes('nirgends')));
  assert.ok(errors.some((e) => e.includes('fehlt') && e.includes('prozent-trainer')));
  assert.ok(errors.some((e) => e.includes('fehlt-auch')));
  assert.ok(errors.some((e) => e.includes('bayern-gymnasium')));
});

test('pruefeReferenzen: nur eine Hierarchieebene erlaubt', () => {
  const d = fixture();
  d.kompetenzen.push({ id: 'enkel', titel: 'E', leitidee: 'zahl-und-operation', parent: 'prozent-grundwert', 'kmk-standard': '', schluesselwoerter: [] });
  const errors = pruefeReferenzen(d);
  assert.ok(errors.some((e) => e.includes('enkel') && /Ebene/.test(e)));
});

test('pruefeReferenzen: ungültige Enum-Werte und fehlende Pflichtfelder werden gemeldet', () => {
  const d = fixture();
  d.eintraege[0].dsgvo = 'blau';
  d.eintraege[0]['external-requests'] = 'manchmal';
  d.lehrplaene[0].erfasst = 'vielleicht';
  d.zuordnungen[0].zeilen[0].pflicht = 'jein';
  delete d.kompetenzen[0].titel;
  const errors = pruefeReferenzen(d);
  assert.ok(errors.some((e) => e.includes('dsgvo') && e.includes('blau')));
  assert.ok(errors.some((e) => e.includes('external-requests')));
  assert.ok(errors.some((e) => e.includes('erfasst')));
  assert.ok(errors.some((e) => e.includes('pflicht')));
  assert.ok(errors.some((e) => e.includes('titel') && e.includes('prozentrechnung')));
});

test('pruefeReferenzen: doppelte ids werden gemeldet', () => {
  const d = fixture();
  d.kompetenzen.push({ ...d.kompetenzen[1] });
  const errors = pruefeReferenzen(d);
  assert.ok(errors.some((e) => /doppelt/i.test(e) && e.includes('prozent-grundwert')));
});

// --- Abdeckung ---------------------------------------------------------------

test('berechneAbdeckung: keine / ungeprueft / gruen', () => {
  const kompetenzen = [{ id: 'a' }, { id: 'b' }, { id: 'c' }];
  const eintraege = [
    { id: 'e1', kompetenzen: ['a', 'b'], dsgvo: 'amber' },
    { id: 'e2', kompetenzen: ['b'], dsgvo: 'green' },
  ];
  const result = berechneAbdeckung(kompetenzen, eintraege);
  assert.deepEqual(result.a, { abdeckung: ['e1'], status: 'ungeprueft' });
  assert.deepEqual(result.b, { abdeckung: ['e1', 'e2'], status: 'gruen' });
  assert.deepEqual(result.c, { abdeckung: [], status: 'keine' });
});

