// Kleines Datenobjekt in der Struktur von data.json für Tests.
export const daten = {
  version: '0.1.0',
  leitideen: [
    { id: 'zahl-und-operation', titel: 'Zahl und Operation', quelle: 'KMK', reihenfolge: 1, beschreibung: 'Zahlen.' },
    { id: 'daten-und-zufall', titel: 'Daten und Zufall', quelle: 'KMK', reihenfolge: 5, beschreibung: 'Zufall.' },
  ],
  kompetenzen: [
    { id: 'prozentrechnung', titel: 'Prozentrechnung', leitidee: 'zahl-und-operation', 'kmk-standard': 'verwenden Prozentrechnung', schluesselwoerter: ['Prozent'], beschreibung: 'Überbegriff.', abdeckung: [], status: 'keine' },
    { id: 'prozent-grundwert', titel: 'Grundwert berechnen', leitidee: 'zahl-und-operation', parent: 'prozentrechnung', 'kmk-standard': 'verwenden Prozentrechnung', schluesselwoerter: ['Grundwert'], beschreibung: 'Das Ganze bestimmen.', abdeckung: ['prozent-trainer'], status: 'ungeprueft' },
    { id: 'prozent-veraenderung', titel: 'Prozentuale Veränderung', leitidee: 'zahl-und-operation', parent: 'prozentrechnung', 'kmk-standard': '', schluesselwoerter: ['Zunahme', 'Abnahme'], beschreibung: 'Zunahme und Abnahme.', abdeckung: ['prozent-trainer'], status: 'ungeprueft' },
    { id: 'brueche-begriff', titel: 'Bruchbegriff', leitidee: 'zahl-und-operation', 'kmk-standard': 'stellen Brüche dar', schluesselwoerter: ['Bruch'], beschreibung: 'Anteile.', abdeckung: [], status: 'keine' },
    { id: 'zufall-laplace', titel: 'Laplace', leitidee: 'daten-und-zufall', 'kmk-standard': 'bestimmen Wahrscheinlichkeiten', schluesselwoerter: ['Laplace'], beschreibung: 'Günstige durch mögliche.', abdeckung: ['zufall-trainer'], status: 'gruen' },
    { id: 'boxplot', titel: 'Boxplot', leitidee: 'daten-und-zufall', 'kmk-standard': '', schluesselwoerter: ['Boxplot'], beschreibung: 'Fakultativ.', abdeckung: [], status: 'keine' },
  ],
  lehrplaene: [
    { id: 'hessen-gymnasium', land: 'HE', landname: 'Hessen', schulform: 'Gymnasium', stufe: 'Sek I', dokument: 'KC', url: 'https://example.invalid/he', stand: 2011, erfasst: 'vollstaendig', beschreibung: '' },
    { id: 'bayern-gymnasium', land: 'BY', landname: 'Bayern', schulform: 'Gymnasium', stufe: 'Sek I', dokument: 'LehrplanPLUS', url: 'https://example.invalid/by', stand: '', erfasst: 'nein', beschreibung: '' },
  ],
  zuordnungen: [
    { lehrplan: 'hessen-gymnasium', zeilen: [
      { kompetenz: 'prozentrechnung', jahrgang: '7', einheit: '7.1', pflicht: 'ja' },
      { kompetenz: 'prozentrechnung', jahrgang: '8', einheit: '8.3', pflicht: 'ja' },
      { kompetenz: 'prozent-grundwert', jahrgang: '7', einheit: '7.1', pflicht: 'ja' },
      { kompetenz: 'prozent-veraenderung', jahrgang: '7', einheit: '7.1', pflicht: 'ja' },
      { kompetenz: 'prozent-veraenderung', jahrgang: '8', einheit: '8.3', pflicht: 'ja' },
      { kompetenz: 'brueche-begriff', jahrgang: '5/6', einheit: '-', pflicht: 'ja' },
      { kompetenz: 'zufall-laplace', jahrgang: '7', einheit: '7.4', pflicht: 'ja' },
      { kompetenz: 'boxplot', jahrgang: '8', einheit: '8.4', pflicht: 'nein' },
    ] },
  ],
  eintraege: [
    { id: 'prozent-trainer', titel: 'Prozent-Trainer', url: 'https://example.invalid/pt/', quellcode: 'https://example.invalid/pt-src', kompetenzen: ['prozent-grundwert', 'prozent-veraenderung'], 'aktiv-level': 2, backend: 'none', 'external-requests': 'on-consent', dsgvo: 'amber', evidence: 'anecdotal', jahrgaenge: [7, 8], lizenz: '', stand: '2026-09-23', beschreibung: 'Trainer.' },
    { id: 'zufall-trainer', titel: 'Zufall-Trainer', url: 'https://example.invalid/zt/', quellcode: 'https://example.invalid/zt-src', kompetenzen: ['zufall-laplace'], 'aktiv-level': 2, backend: 'none', 'external-requests': 'none', dsgvo: 'green', evidence: 'anecdotal', jahrgaenge: [7, 8], lizenz: 'MIT', stand: '2026-09-23', beschreibung: 'Trainer.' },
  ],
};
