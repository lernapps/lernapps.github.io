/*
 * Kennzahlen, Risikomatrix und Utility Tree für die Übersichtsseite der Architektur-Doku (src/docs/uebersicht/).
 * Liest nur das Repository (package.json, App-Konfigurationen, Tests, arc42-Kapitel), kein Netz. Die drei
 * AsciiDoc-Dateien in ZIELE sind git-ignoriert; scripts/dtc-v4.sh erzeugt sie vor jedem Doku-Build neu.
 *   node scripts/dashboard.js
 */
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { spawnSync } from "node:child_process";
import { ladeApps } from "../lib/apps.js";
import site from "../src/_data/site.js";
import { SCHICHTEN, abdeckung } from "./harness-rad.js";

const WURZEL = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const KAPITEL = "src/docs/arc42/chapters/";
const ORDNER = "src/docs/uebersicht/";

export const ZIELE = {
  kennzahlen: `${ORDNER}_kennzahlen.adoc`,
  risikomatrix: `${ORDNER}_risikomatrix.adoc`,
  utilityTree: `${ORDNER}_utility-tree.adoc`,
  risikothemen: `${ORDNER}_risikothemen.adoc`,
};

/** Verweis von der Übersicht auf ein arc42-Kapitel (xref wandelt .adoc in .html). */
const xref = (kapitel, anker, text) => `xref:../arc42/chapters/${kapitel}.adoc${anker ? `#${anker}` : ""}[${text}]`;
const RISIKO_KAPITEL = "11_technical_risks";

/** Zeilen der Risikotabelle in Kapitel 11: ID, Anker, Wahrscheinlichkeit, Auswirkung, Priorität. */
export function leseRisiken(adoc) {
  const risiken = [];
  for (const zeile of adoc.split("\n")) {
    const kopf = zeile.match(/^\| \[\[(r-\d+)\]\](R-\d+) \|/);
    if (!kopf) continue;
    const werte = zeile.match(/ \| (\d|–) \| (\d|–) \| (hoch|mittel|niedrig|erledigt)\b/);
    if (!werte) throw new Error(`Risiko ${kopf[2]}: Wahrscheinlichkeit, Auswirkung oder Priorität nicht lesbar`);
    const zahl = (w) => (w === "–" ? null : Number(w));
    risiken.push({ id: kopf[2], anker: kopf[1], w: zahl(werte[1]), a: zahl(werte[2]), prio: werte[3] });
  }
  return risiken;
}

/** Matrix Wahrscheinlichkeit (Zeilen, 3 oben) × Auswirkung (Spalten); erledigte Risiken fehlen. */
export function risikomatrix(risiken) {
  const zelle = (w, a) => risiken.filter((r) => r.w === w && r.a === a)
    .map((r) => xref(RISIKO_KAPITEL, r.anker, r.id)).join(" ");
  const z = [
    '[cols="1h,3,3,3",options="header",role="risikomatrix"]', "|===",
    "| W ↓ A → | A 1 | A 2 | A 3",
  ];
  for (const w of [3, 2, 1]) z.push(`h| ${w} | ${zelle(w, 1)} | ${zelle(w, 2)} | ${zelle(w, 3)}`.replace(/ +$/, ""));
  z.push("|===");
  return `${z.join("\n")}\n`;
}

/** ADRs je Status aus dem Index in Kapitel 9; alle „Superseded by …“ zählen als „Superseded“. */
export function leseAdrStatus(adoc) {
  const status = {};
  for (const [, s] of adoc.matchAll(/^\| <<adr-\d+,ADR-\d+>> \|.*\| ([^|]+?)\s*$/gm)) {
    const name = s.startsWith("Superseded") ? "Superseded" : s;
    status[name] = (status[name] ?? 0) + 1;
  }
  return status;
}

/** Technische Schulden aus Kapitel 11: offen = Tabellenzeile ohne „Erledigt“; erledigt = Tabelle + Absatz „Erledigt:“. */
export function leseSchulden(adoc) {
  const teil = adoc.slice(adoc.indexOf("=== Technische Schulden"));
  const offen = new Set();
  const erledigt = new Set();
  for (const [, id, rest] of teil.matchAll(/^\| (TD-\d+) \|(.*)$/gm)) {
    (/\| Erledigt\b[^|]*$/.test(rest) ? erledigt : offen).add(id);
  }
  const absatz = teil.match(/^Erledigt: [\s\S]*?(?:\n\n|$)/m)?.[0] ?? "";
  for (const [id] of absatz.matchAll(/TD-\d+/g)) if (!offen.has(id)) erledigt.add(id);
  return { offen: offen.size, erledigt: erledigt.size };
}

/** Risikothemen RT-n aus der ATAM-Baseline. */
export function leseRisikothemen(adoc) {
  return [...adoc.matchAll(/^\*(RT-\d+): ([^*]+)\*/gm)].map(([, id, titel]) => ({ id, titel }));
}

/** Liste der Risikothemen, jedes mit Link auf die ATAM-Ergebnisse in Kapitel 11. */
export function schreibeRisikothemen(themen) {
  return `${themen.map((t) => `* ${xref(RISIKO_KAPITEL, "section-atam-themen", t.id)}: ${t.titel}`).join("\n")}\n`;
}

/** Blätter des Utility Tree (Tabelle nach [[section-utility-tree]] in Kapitel 10). */
export function leseUtilityTree(adoc) {
  const ab = adoc.indexOf("[[section-utility-tree]]");
  if (ab < 0) throw new Error("Utility Tree nicht gefunden");
  const tabelle = adoc.slice(ab).split("|===")[1] ?? "";
  return [...tabelle.matchAll(/^\| (QZ-\d[^|]*?) \| ([^|]+?) \| (QS-\d+) \| ([HML]) \| ([HML])\s*$/gm)]
    .map(([, ziel, verfeinerung, szenario, wichtigkeit, schwierigkeit]) =>
      ({ ziel, verfeinerung, szenario, wichtigkeit, schwierigkeit }));
}

/** PlantUML-Mindmap: Qualität → Ziel → Verfeinerung → Szenarien mit (Wichtigkeit, Schwierigkeit). */
export function utilityTreeDiagramm(blaetter) {
  const z = ["[plantuml, target=uebersicht-utility-tree, format=svg]", "....", "@startmindmap", "* Qualität"];
  const ziele = [...new Set(blaetter.map((b) => b.ziel))];
  for (const ziel of ziele) {
    z.push(`** ${ziel}`);
    const eigene = blaetter.filter((b) => b.ziel === ziel);
    for (const v of [...new Set(eigene.map((b) => b.verfeinerung))]) {
      z.push(`*** ${v}`);
      z.push(`**** ${eigene.filter((b) => b.verfeinerung === v)
        .map((b) => `${b.szenario} (${b.wichtigkeit},${b.schwierigkeit})`).join(" · ")}`);
    }
  }
  z.push("@endmindmap", "....");
  return `${z.join("\n")}\n`;
}

/** Summe eines `node --test`-Laufs im TAP-Format. Zählt auch Tests, die Schleifen erzeugen. */
export function leseNodeTestSumme(tap) {
  const zahl = (name) => Number(tap.match(new RegExp(`^# ${name} (\\d+)$`, "m"))?.[1]);
  const summe = { tests: zahl("tests"), pass: zahl("pass"), fail: zahl("fail"), skipped: zahl("skipped") };
  if (Object.values(summe).some(Number.isNaN)) throw new Error("node --test lieferte keine TAP-Summe");
  return summe;
}

/** Tests und Specs aus `playwright test --list` (zählt, ohne einen Browser zu starten). */
export function lesePlaywrightListe(ausgabe) {
  const t = ausgabe.match(/^Total: (\d+) tests? in (\d+) files?$/m);
  if (!t || t[1] === "0") {
    throw new Error("playwright test --list fand keine Tests; die Specs lesen _site/, also erst npm ci und npm run build");
  }
  return { tests: Number(t[1]), dateien: Number(t[2]) };
}

/** Echter Lauf der Unit-Tests mit denselben Globs wie `npm test` (rund 2 Sekunden). */
function zaehleUnitTests() {
  const globs = [...JSON.parse(lies("package.json")).scripts.test.matchAll(/"([^"]+)"/g)].map((m) => m[1]);
  const lauf = spawnSync(process.execPath, ["--test", "--test-reporter=tap", ...globs], { cwd: WURZEL, encoding: "utf8" });
  return leseNodeTestSumme(lauf.stdout ?? "");
}

function zaehleBrowserTests() {
  const cli = path.join(WURZEL, "node_modules/@playwright/test/cli.js");
  const lauf = spawnSync(process.execPath, [cli, "test", "--list"], { cwd: WURZEL, encoding: "utf8" });
  return lesePlaywrightListe(`${lauf.stdout ?? ""}${lauf.stderr ?? ""}`);
}

/** Namen der Pflicht-Checks, wie CLAUDE.md und die Doku sie nennen (Branch Protection braucht Admin-Rechte). */
export function lesePflichtChecks(texte) {
  const namen = new Set();
  for (const t of texte) {
    for (const [, n] of t.matchAll(/(?:required check|Pflicht-Check) `([\w-]+)`/g)) namen.add(n);
  }
  return [...namen].sort();
}

export function leseDatum(text, muster) {
  const treffer = text.match(muster);
  if (!treffer) throw new Error(`Datum nicht gefunden: ${muster}`);
  return treffer[1];
}

const lies = (datei) => fs.readFileSync(path.join(WURZEL, datei), "utf8");

function dateienUnter(ordner, endung) {
  const voll = path.join(WURZEL, ordner);
  if (!fs.existsSync(voll)) return [];
  return fs.readdirSync(voll, { recursive: true }).filter((d) => d.endsWith(endung))
    .map((d) => path.join(ordner, d)).sort();
}

function alleDokuTexte() {
  return ["CLAUDE.md", ...dateienUnter("src/docs", ".adoc")].map(lies);
}

/** zaehler: für Tests austauschbar; ein echter node --test-Lauf aus einem Test heraus riefe sich selbst auf. */
export async function sammleKennzahlen(zaehler = { unit: zaehleUnitTests, browser: zaehleBrowserTests }) {
  const paket = JSON.parse(lies("package.json"));
  const apps = await ladeApps({ quelle: path.join(WURZEL, "src"), adressen: site });
  const kap11 = lies(`${KAPITEL}11_technical_risks.adoc`);
  const risiken = {};
  for (const r of leseRisiken(kap11)) risiken[r.prio] = (risiken[r.prio] ?? 0) + 1;
  const rad = abdeckung(SCHICHTEN);
  return {
    version: paket.version,
    apps: apps.length,
    kompetenzen: apps.reduce((s, a) => s + a.kompetenzen.length, 0),
    unitTests: zaehler.unit(),
    browserTests: zaehler.browser(),
    pflichtChecks: lesePflichtChecks(alleDokuTexte()),
    adrs: leseAdrStatus(lies(`${KAPITEL}09_architecture_decisions.adoc`)),
    risiken,
    schulden: leseSchulden(kap11),
    rad: { vorhanden: rad.vorhanden, relevant: rad.relevant },
    atam: leseDatum(lies(`${KAPITEL}_atam-baseline.adoc`), /ATAM-Bewertung vom (\d\d\.\d\d\.\d{4})/),
    audit: leseDatum(lies(`${KAPITEL}08_concepts.adoc`), /am (\d\d\.\d\d\.\d{4}) ein Audit/),
  };
}

const liste = (objekt) => Object.entries(objekt).map(([k, n]) => `${n} ${k}`).join(", ");

export function schreibeKennzahlen(k) {
  const zeilen = [
    ["Version der Site", `${k.version} (\`package.json\`)`],
    ["Apps und Kompetenzen", `link:../../[${k.apps} Apps] mit ${k.kompetenzen} Kompetenzen`],
    ["Unit-Tests", `${k.unitTests.tests} Tests, ${k.unitTests.pass} grün${k.unitTests.fail ? `, ${k.unitTests.fail} rot` : ""}${
      k.unitTests.skipped ? `, ${k.unitTests.skipped} übersprungen` : ""} (Lauf beim Doku-Build; ${xref("08_concepts", "section-test-concept", "8.3")})`],
    ["Browser-Tests", `${k.browserTests.tests} Tests in ${k.browserTests.dateien} Specs (Playwright und axe-core, gezählt mit \`--list\`)`],
    ["Pflicht-Checks laut Doku", `${k.pflichtChecks.map((c) => `\`${c}\``).join(", ")} (${xref("08_concepts", "section-security", "8.2")})`],
    ["ADRs", `${liste(k.adrs)} (${xref("09_architecture_decisions", "", "Kapitel 9")})`],
    ["Risiken", `${liste(k.risiken)} (${xref(RISIKO_KAPITEL, "", "Kapitel 11")})`],
    ["Technische Schulden", `${k.schulden.offen} offen, ${k.schulden.erledigt} erledigt (${xref(RISIKO_KAPITEL, "", "Kapitel 11")})`],
    ["Harness-Rad bis Tier 2", `${k.rad.vorhanden} von ${k.rad.relevant} Schichten (${xref("08_concepts", "section-harness", "8.16")})`],
    ["Letzte ATAM-Bewertung", `${k.atam} (${xref(RISIKO_KAPITEL, "section-atam", "Kapitel 11")})`],
    ["Letztes Harness-Audit", `${k.audit} (${xref("08_concepts", "section-harness", "8.16")})`],
  ];
  return ['[cols="2,3",role="kennzahlen"]', "|===", ...zeilen.map(([a, b]) => `| ${a} | ${b}`), "|===", ""].join("\n");
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  const k = await sammleKennzahlen();
  fs.writeFileSync(path.join(WURZEL, ZIELE.kennzahlen), schreibeKennzahlen(k));
  fs.writeFileSync(path.join(WURZEL, ZIELE.risikomatrix), risikomatrix(leseRisiken(lies(`${KAPITEL}11_technical_risks.adoc`))));
  fs.writeFileSync(path.join(WURZEL, ZIELE.utilityTree),
    utilityTreeDiagramm(leseUtilityTree(lies(`${KAPITEL}10_quality_requirements.adoc`))));
  fs.writeFileSync(path.join(WURZEL, ZIELE.risikothemen),
    schreibeRisikothemen(leseRisikothemen(lies(`${KAPITEL}_atam-baseline.adoc`))));
  console.log(`Übersicht: ${k.apps} Apps, ${k.unitTests.tests} Unit-Tests, Rad ${k.rad.vorhanden}/${k.rad.relevant}`);
}
