// #24, ADR-027: Der Check `ki-review` gibt einen PR nur frei, wenn nach dem letzten Commit ein KI-Review
// eines berechtigten Kontos mit „Ergebnis: freigegeben“ für genau diesen Stand vorliegt.
import { test } from "node:test";
import assert from "node:assert/strict";
import { pruefeKiReview, beruehrteArchitektur, ARCHITEKTUR_PFADE } from "../../scripts/ki-review-pruefen.js";

const KOPF = "0123456789abcdef0123456789abcdef01234567";
const COMMIT_ZEIT = "2026-09-24T10:00:00Z";
const KONTEN = ["raifdmueller"];

const review = (felder = {}) => ({
  autor: "raifdmueller",
  zeit: "2026-09-24T10:05:00Z",
  text: `## KI-Review\n\nStand: ${KOPF.slice(0, 7)}\nErgebnis: freigegeben\n\n### Befunde\n- keine`,
  ...felder,
});
const pruefe = (beitraege) => pruefeKiReview({ beitraege, kopfSha: KOPF, commitZeit: COMMIT_ZEIT, konten: KONTEN });

test("ohne KI-Review ist der PR nicht freigegeben", () => {
  const e = pruefe([{ autor: "raifdmueller", zeit: "2026-09-24T10:05:00Z", text: "Sieht gut aus" }]);
  assert.equal(e.ok, false);
  assert.match(e.grund, /Kein KI-Review/);
});

test("ein freigegebenes KI-Review nach dem letzten Commit gibt den PR frei", () => {
  const e = pruefe([review()]);
  assert.equal(e.ok, true);
});

test("ein KI-Review vor dem letzten Commit zählt nicht", () => {
  assert.equal(pruefe([review({ zeit: "2026-09-24T09:59:59Z" })]).ok, false);
});

test("ein KI-Review für einen anderen Stand zählt nicht, auch wenn es später kam", () => {
  const e = pruefe([review({ text: "## KI-Review\nStand: fedcba9\nErgebnis: freigegeben" })]);
  assert.equal(e.ok, false);
});

test("ohne Zeile „Stand: <sha>“ zählt das KI-Review nicht", () => {
  assert.equal(pruefe([review({ text: "## KI-Review\nErgebnis: freigegeben" })]).ok, false);
});

test("ein KI-Review von einem fremden Konto zählt nicht", () => {
  assert.equal(pruefe([review({ autor: "jemand-anderes" })]).ok, false);
});

test("die Überschrift muss am Anfang stehen", () => {
  const text = `Zitat:\n## KI-Review\nStand: ${KOPF}\nErgebnis: freigegeben`;
  assert.equal(pruefe([review({ text })]).ok, false);
});

test("„Änderungen nötig“ gibt nicht frei", () => {
  const e = pruefe([review({ text: `## KI-Review\nStand: ${KOPF}\nErgebnis: Änderungen nötig\n- Befund` })]);
  assert.equal(e.ok, false);
  assert.match(e.grund, /Änderungen nötig/);
});

test("das neueste KI-Review entscheidet", () => {
  const nötig = review({ zeit: "2026-09-24T10:10:00Z", text: `## KI-Review\nStand: ${KOPF}\nErgebnis: Änderungen nötig` });
  assert.equal(pruefe([review(), nötig]).ok, false);
  const wieder = review({ zeit: "2026-09-24T10:20:00Z" });
  assert.equal(pruefe([review(), nötig, wieder]).ok, true);
});

test("Windows-Zeilenenden und Leerraum am Anfang stören nicht", () => {
  const text = `\r\n## KI-Review\r\nStand: ${KOPF}\r\nErgebnis: freigegeben\r\n`;
  assert.equal(pruefe([review({ text })]).ok, true);
});

test("ein Präfix unter sieben Zeichen reicht nicht als Stand", () => {
  assert.equal(pruefe([review({ text: "## KI-Review\nStand: 012345\nErgebnis: freigegeben" })]).ok, false);
});

// ADR-030: PRs, die Entscheidungen oder Qualitätsdefinitionen ändern, brauchen im Review einen Abschnitt
// „### Architektur (ATAM)“, der die Änderung gegen den Utility Tree (arc42 10) bewertet.
const ATAM = `## KI-Review\n\nStand: ${KOPF}\nErgebnis: freigegeben\n\n### Befunde\n- keine\n\n` +
  "### Architektur (ATAM)\n- Szenarien: QS-3\n- Neue Risiken: keine";
const pruefeMit = (beitraege, dateien) =>
  pruefeKiReview({ beitraege, kopfSha: KOPF, commitZeit: COMMIT_ZEIT, konten: KONTEN, dateien });

test("Architekturänderung mit Abschnitt „Architektur (ATAM)“ ist freigegeben", () => {
  const e = pruefeMit([review({ text: ATAM })], ["src/docs/arc42/chapters/_adr-prozess.adoc", "README.md"]);
  assert.equal(e.ok, true);
});

test("Architekturänderung ohne Abschnitt „Architektur (ATAM)“ fällt durch und nennt die Dateien", () => {
  const e = pruefeMit([review()], ["src/docs/arc42/chapters/10_quality_requirements.adoc"]);
  assert.equal(e.ok, false);
  assert.match(e.grund, /### Architektur \(ATAM\)/);
  assert.match(e.grund, /10_quality_requirements\.adoc/);
});

test("ohne Architekturänderung braucht das Review keinen ATAM-Abschnitt", () => {
  assert.equal(pruefeMit([review()], ["src/kern/js/zahlantwort.js", "src/docs/arc42/chapters/11_technical_risks.adoc"]).ok, true);
  assert.equal(pruefeMit([review()], []).ok, true);
});

test("die Auslösepfade: ADRs, ATAM-Baseline, Kapitel 1, 4, 5, 9 und 10", () => {
  const kapitel = "src/docs/arc42/chapters/";
  const treffer = ["_adr-vorlage.adoc", "_atam-baseline.adoc", "01_introduction_and_goals.adoc", "04_solution_strategy.adoc",
    "05_building_block_view.adoc", "09_architecture_decisions.adoc", "10_quality_requirements.adoc"].map((d) => kapitel + d);
  assert.deepEqual(beruehrteArchitektur([...treffer, `${kapitel}08_concepts.adoc`, "docs/_adr-x.adoc"]), treffer);
  assert.equal(ARCHITEKTUR_PFADE.length, 7);
});

test("ein Abschnitt nur im Fließtext oder mit anderer Ebene zählt nicht", () => {
  const text = `## KI-Review\nStand: ${KOPF}\nErgebnis: freigegeben\nSiehe ### Architektur (ATAM) später\n#### Architektur (ATAM)`;
  assert.equal(pruefeMit([review({ text })], ["src/docs/arc42/chapters/_adr-risiko.adoc"]).ok, false);
});
