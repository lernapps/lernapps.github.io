/*
 * Gemeinsame Einstellungen der Property-Based Tests (fast-check, Issue #22).
 * Fester Seed: CI läuft deterministisch, ein roter Lauf lässt sich lokal wiederholen. Wer neue Eingaben
 * erkunden will, setzt einen anderen Seed: FC_SEED=4711 npm test. fast-check nennt bei einem Fehlschlag
 * Seed, Pfad und das geschrumpfte (minimale) Gegenbeispiel.
 * Läufe: 300 je Eigenschaft (fast-check-Standard 100). Alle Property-Tests zusammen brauchen damit unter einer Sekunde.
 * Kein *.test.js: der Test-Runner lädt diese Datei nur über die Importe.
 */
const seed = Number.parseInt(process.env.FC_SEED ?? "", 10);

export const LAEUFE = 300;
export const OPTIONEN = Object.freeze({ seed: Number.isNaN(seed) ? 22 : seed, numRuns: LAEUFE });
