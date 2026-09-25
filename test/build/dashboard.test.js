// Use Case: Architektur-Doku pflegen – die Übersichtsseite (/docs/uebersicht/) zeigt Kennzahlen, die der Doku-Build
// aus dem Repository erzeugt; keine Zahl wird von Hand gepflegt.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import {
  leseRisiken, risikomatrix, leseAdrStatus, leseSchulden, leseRisikothemen, schreibeRisikothemen, leseUtilityTree, utilityTreeDiagramm,
  leseNodeTestSumme, lesePlaywrightListe, leseTestGlobs, lesePflichtChecks, leseDatum, neuesteBewertung, sammleKennzahlen, schreibeKennzahlen, ZIELE,
} from "../../scripts/dashboard.js";
import { SCHICHTEN, abdeckung } from "../../scripts/harness-rad.js";

const KAPITEL = "src/docs/arc42/chapters/";
const lies = (datei) => fs.readFileSync(datei, "utf8");

const RISIKEN = [
  "| [[r-002]]R-002 | *Tutor.* Text | 2 | 3 | hoch (6) | Maßnahme",
  "| [[r-019]]R-019 | *Mini-DOM.* a | b | 1 | 1 | niedrig (1) | Maßnahme | mit Strich",
  "| [[r-016]]R-016 | *Alt.* | – | – | erledigt | Erledigt am 23.09.2026",
].join("\n");

test("leseRisiken liest ID, Anker, Wahrscheinlichkeit, Auswirkung und Priorität; erledigte ohne Zahlen", () => {
  assert.deepEqual(leseRisiken(RISIKEN), [
    { id: "R-002", anker: "r-002", w: 2, a: 3, prio: "hoch" },
    { id: "R-019", anker: "r-019", w: 1, a: 1, prio: "niedrig" },
    { id: "R-016", anker: "r-016", w: null, a: null, prio: "erledigt" },
  ]);
});

test("die Risikomatrix setzt jedes offene Risiko in seine Zelle und verlinkt seinen Anker", () => {
  const adoc = risikomatrix(leseRisiken(RISIKEN));
  const zeilen = adoc.split("\n");
  const w2 = zeilen.find((z) => z.startsWith("h| 2"));
  assert.match(w2, /\| +\| +\| xref:\.\.\/arc42\/chapters\/11_technical_risks\.adoc#r-002\[R-002\]$/);
  assert.match(zeilen.find((z) => z.startsWith("h| 1")), /^h\| 1[^|]*\| xref:[^\]]*#r-019\[R-019\]/);
  assert.doesNotMatch(adoc, /R-016/);
});

test("leseAdrStatus zählt die ADRs je Status; Superseded zählt zusammen", () => {
  const index = [
    "| <<adr-001,ADR-001>> | Statisch | Accepted",
    "| <<adr-002,ADR-002>> | Vanilla | Superseded by ADR-012",
    "| <<adr-003,ADR-003>> | Kern | Superseded by ADR-012",
    "| <<adr-026,ADR-026>> | Browser | Accepted (inferred)",
  ].join("\n");
  assert.deepEqual(leseAdrStatus(index), { Accepted: 1, Superseded: 2, "Accepted (inferred)": 1 });
});

test("leseSchulden trennt offene und erledigte Schulden, auch die nur im Absatz „Erledigt:“ genannten", () => {
  const kap = [
    "=== Technische Schulden", "|===", "| ID | Schuld | Baustein | Maßnahme",
    "| TD-3 | a | b | Entschieden, Umsetzung läuft.",
    "| TD-5 | a | b | Erledigt am 24.09.2026 (#26).",
    "|===", "", "Erledigt: TD-1 (Kern kopiert) und TD-2 durch ADR-012; TD-5 mit #26.",
  ].join("\n");
  assert.deepEqual(leseSchulden(kap), { offen: 1, erledigt: 3 });
});

test("leseRisikothemen liest RT-Nummer und Titel aus den Risikothemen in Kapitel 11", () => {
  const atam = "*RT-1: Ein Fehler trifft alle Apps zugleich* (AR-1). Text\n\n*RT-2: Der Vertrag bewegt sich* (AR-4).";
  assert.deepEqual(leseRisikothemen(atam), [
    { id: "RT-1", titel: "Ein Fehler trifft alle Apps zugleich" },
    { id: "RT-2", titel: "Der Vertrag bewegt sich" },
  ]);
  assert.match(schreibeRisikothemen(leseRisikothemen(atam)),
    /^\* xref:\.\.\/arc42\/chapters\/11_technical_risks\.adoc#section-atam-themen\[RT-1\]: Ein Fehler/);
});

test("der Utility Tree wird zur Mindmap: Ziel, Verfeinerung, Szenarien mit Noten", () => {
  const kap = [
    "[[section-utility-tree]]", "|===", "| Qualitätsziel (Prio) | Verfeinerung | Szenario | Wichtigkeit | Schwierigkeit",
    "| QZ-1 Datenschutz (1) | Kein fremder Host | QS-1 | H | M",
    "| QZ-1 Datenschutz (1) | Kein fremder Host | QS-2 | H | L",
    "| QZ-5 Zugänglich (5) | Bedienbar | QS-27 | M | H", "|===",
  ].join("\n");
  const baum = leseUtilityTree(kap);
  assert.equal(baum.length, 3);
  const puml = utilityTreeDiagramm(baum);
  assert.match(puml, /@startmindmap/);
  assert.match(puml, /\n\*\* QZ-1 Datenschutz \(1\)\n\*\*\* Kein fremder Host\n\*\*\*\* QS-1 \(H,M\) · QS-2 \(H,L\)\n/);
  assert.match(puml, /\n\*\*\*\* QS-27 \(M,H\)\n/);
});

test("leseNodeTestSumme liest die Summe eines echten node --test-Laufs (TAP), Schleifen-Tests eingeschlossen", () => {
  const tap = "ok 1 - a\n1..571\n# tests 571\n# suites 0\n# pass 568\n# fail 1\n# cancelled 0\n# skipped 2\n# todo 0\n";
  assert.deepEqual(leseNodeTestSumme(tap), { tests: 571, pass: 568, fail: 1, skipped: 2 });
  assert.throws(() => leseNodeTestSumme("kaputt"), /node --test/);
});

test("leseTestGlobs übernimmt die Globs aus package.json, damit der Zähl-Lauf genau npm test entspricht", () => {
  assert.deepEqual(leseTestGlobs(JSON.parse(lies("package.json"))), ["test/**/*.test.js", "src/*/test/*.test.js"]);
  assert.throws(() => leseTestGlobs({ scripts: { test: "vitest" } }), /node --test/);
});

test("lesePlaywrightListe liest Tests und Specs aus playwright test --list", () => {
  const liste = "Listing tests:\n  [chromium] › a.spec.js:3:1 › x\nTotal: 166 tests in 7 files\n";
  assert.deepEqual(lesePlaywrightListe(liste), { tests: 166, dateien: 7 });
  assert.throws(() => lesePlaywrightListe("Error: No tests found\nTotal: 0 tests in 0 files"), /npm run build/);
});

test("lesePflichtChecks sammelt die Namen aus CLAUDE.md und der Doku, ohne Doppelte", () => {
  const texte = ["The required check `test-und-build` (`pruefen.yml`)", "Pflicht-Check `browser` und Pflicht-Check `test-und-build`"];
  assert.deepEqual(lesePflichtChecks(texte), ["browser", "test-und-build"]);
});

test("leseDatum findet das Datum hinter einem Muster", () => {
  assert.equal(leseDatum("Ergebnisse der ATAM-Bewertung vom 25.09.2026: X", /ATAM-Bewertung vom (\d\d\.\d\d\.\d{4})/), "25.09.2026");
  assert.throws(() => leseDatum("nichts", /vom (\d\d\.\d\d\.\d{4})/), /nicht gefunden/);
});

test("die Kennzahlen aus dem echten Repository stimmen mit ihren Quellen überein", async () => {
  // Zähler als Stubs: ein echter node --test-Lauf aus diesem Test heraus riefe diesen Test wieder auf.
  const k = await sammleKennzahlen({ unit: () => ({ tests: 9, pass: 9, fail: 0, skipped: 0 }),
    browser: () => ({ tests: 8, dateien: 7 }) });
  assert.equal(k.version, JSON.parse(lies("package.json")).version);
  assert.ok(k.apps >= 3 && k.kompetenzen > k.apps);
  assert.deepEqual(k.unitTests, { tests: 9, pass: 9, fail: 0, skipped: 0 });
  assert.deepEqual(k.browserTests, { tests: 8, dateien: 7 });
  assert.ok(k.pflichtChecks.includes("test-und-build") && k.pflichtChecks.includes("browser"));
  const a = abdeckung(SCHICHTEN);
  assert.deepEqual(k.rad, { vorhanden: a.vorhanden, relevant: a.relevant });
  const adrs = lies(KAPITEL + "09_architecture_decisions.adoc").match(/^\| <<adr-\d+,ADR-\d+>>/gm).length;
  assert.equal(Object.values(k.adrs).reduce((s, n) => s + n, 0), adrs);
  assert.match(k.atam, /^\d\d\.\d\d\.\d{4}$/);
  assert.match(k.audit, /^\d\d\.\d\d\.\d{4}$/);
  // Die Links der Kennzahlen treffen den neuesten Bericht im Anhang Bewertungen.
  const anhang = lies(KAPITEL + "13_bewertungen.adoc");
  for (const art of ["atam", "harness-audit"]) {
    const datei = neuesteBewertung(fs.readdirSync(KAPITEL), art);
    assert.ok(anhang.includes(`include::${datei}[`), datei);
    assert.equal(k.anker[art], lies(KAPITEL + datei).match(/^\[\[([\w-]+)\]\]/)[1]);
  }
});

test("neuesteBewertung wählt je Art den jüngsten datierten Bericht", () => {
  const dateien = ["_atam-2026-09-25.adoc", "_atam-2026-12-10.adoc", "_atam-vorlage.adoc", "_security-2027-01-01.adoc",
    "_harness-audit-2026-09-24.adoc", "13_bewertungen.adoc"];
  assert.equal(neuesteBewertung(dateien, "atam"), "_atam-2026-12-10.adoc");
  assert.equal(neuesteBewertung(dateien, "harness-audit"), "_harness-audit-2026-09-24.adoc");
  assert.throws(() => neuesteBewertung(dateien, "fehlt"), /fehlt/);
});

test("jedes offene Risiko aus Kapitel 11 steht in der Matrix, und jeder Link trifft einen Anker", () => {
  const kap = lies(KAPITEL + "11_technical_risks.adoc");
  const matrix = risikomatrix(leseRisiken(kap));
  for (const r of leseRisiken(kap).filter((r) => r.w)) assert.ok(matrix.includes(`[${r.id}]`), r.id);
  for (const [, anker] of matrix.matchAll(/#(r-\d+)\[/g)) assert.ok(kap.includes(`[[${anker}]]`), anker);
});

test("die Übersichtsseite bindet die erzeugten Dateien ein, und Git ignoriert sie", () => {
  const seite = lies("src/docs/uebersicht/index.adoc");
  const ignoriert = lies(".gitignore");
  for (const ziel of Object.values(ZIELE)) {
    const name = ziel.split("/").pop();
    assert.ok(seite.includes(`include::${name}[]`), name);
    assert.ok(ignoriert.includes(`/${ziel}`), ziel);
  }
  assert.match(schreibeKennzahlen({ version: "1.2.3", apps: 3, kompetenzen: 20, unitTests: { tests: 2, pass: 2, fail: 0, skipped: 0 },
    browserTests: { dateien: 1, tests: 2 }, pflichtChecks: ["a"], adrs: { Accepted: 1 }, risiken: { hoch: 1 },
    schulden: { offen: 1, erledigt: 2 }, rad: { vorhanden: 21, relevant: 29 }, atam: "25.09.2026", audit: "24.09.2026",
    anker: { atam: "bewertung-atam-2026-09-25", "harness-audit": "bewertung-harness-audit-2026-09-24" } }),
  /1\.2\.3/);
});

test("jedes Diagramm der Übersicht verlinkt sein SVG in voller Größe (auf 360 px sonst unlesbar)", () => {
  const seite = lies("src/docs/uebersicht/index.adoc");
  for (const ziel of ["kontext-fachlich", "bausteine-ebene-1", "uebersicht-utility-tree", "harness-rad"]) {
    assert.ok(seite.includes(`link:../images/${ziel}.svg[`), ziel);
  }
});

test("der Doku-Build in doku.yml und pages.yml baut die Site vor scripts/dtc-v4.sh (playwright --list braucht _site)", () => {
  for (const wf of ["doku.yml", "pages.yml"]) {
    const text = lies(`.github/workflows/${wf}`);
    const dtc = text.indexOf("scripts/dtc-v4.sh generateSite");
    assert.ok(!text.includes("node scripts/dashboard.js"), `${wf}: der Generator läuft nur über scripts/dtc-v4.sh`);
    for (const schritt of ["npm ci", "npm run build"]) {
      const pos = text.indexOf(`run: ${schritt}`);
      assert.ok(pos > 0 && pos < dtc, `${wf}: ${schritt} vor dem Doku-Build`);
    }
  }
});
