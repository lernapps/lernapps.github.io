/*
 * Wrapper um asciidoc-linter (docToolchain, ADR-028) für die Architektur-Doku: prüft src/docs/**\/*.adoc.
 *   node scripts/doku-lint.js            (asciidoc-linter muss im PATH liegen, sonst ASCIIDOC_LINTER=<Pfad>)
 * Warum ein Wrapper:
 *  - Der Linter endet mit Exit-Code 1, sobald er irgendetwas findet, auch nur eine Warnung. Wir wollen: ERROR bricht
 *    den Doku-Job, WARNING und INFO erscheinen nur als Annotation. Dazu liest der Wrapper --format json.
 *  - IMG001 sucht Bilder relativ zum Arbeitsverzeichnis und kennt :imagesdir: nicht (Fehlalarm für das arc42-Logo).
 *    Abschalten ginge nur für die ganze Regel (config: rules.IMG001.enabled) und verlöre echte Funde. Der Wrapper
 *    unterdrückt „Image file not found“ nur, wenn das Bild relativ zur Datei bzw. ihrem :imagesdir: existiert
 *    (upstream docToolchain/asciidoc-linter#60, offen).
 *  - HEAD002 prüft den ersten Buchstaben des Überschriftentexts und hält darum ein Inline-Makro am Anfang
 *    (`= image:arc42-logo.png[arc42] Titel`, arc42-Vorlage) für eine kleingeschriebene Überschrift. Der Wrapper
 *    unterdrückt HEAD002 nur, wenn die Überschrift mit einem Inline-Makro `name:ziel[…]` beginnt; kleine
 *    Überschriften aus Wörtern meldet er weiter.
 * Gepinnt ist 911440a (nach docToolchain/asciidoc-linter#62, der die Überschriften-, Block- und Bildregeln im CLI
 * erst aktiviert). Offen upstream: #58 (Exit-Code/--fail-level, darum bewertet der Wrapper die Schwere selbst),
 * #59 (Konfigurationsfehler werden ignoriert), #60 (:imagesdir:).
 */
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { pathToFileURL } from "node:url";

/** Liegt `bild` relativ zur .adoc-Datei oder zu ihrem :imagesdir: (auch in ifndef::imagesdir[…])? */
export function bildDa(adoc, bild, lies = (p) => fs.readFileSync(p, "utf8"), gibt = fs.existsSync) {
  const ordner = path.posix.dirname(adoc);
  const imagesdir = lies(adoc).match(/:imagesdir:\s*([^\]\n]+)/)?.[1].trim();
  return [imagesdir && path.posix.join(ordner, imagesdir, bild), path.posix.join(ordner, bild)]
    .filter(Boolean).some((p) => gibt(p));
}

/** Überschrift, deren Text mit einem Inline-Makro wie image:logo.png[…] beginnt. */
export const MAKRO_AM_ANFANG = /^=+\s+[a-z]+:[^\s[]*\[/;

/** Teilt die Befunde des Linters in fehler (ERROR), warnungen (alles andere) und unterdrueckt (Fehlalarme). */
export function bewerte(befunde, istBildDa = bildDa) {
  const r = { fehler: [], warnungen: [], unterdrueckt: [] };
  for (const b of befunde) {
    const bild = b.rule_id === "IMG001" && b.message?.match(/^Image file not found: (.+)$/)?.[1];
    if (bild && istBildDa(b.file, bild)) r.unterdrueckt.push({ ...b, grund: "Bild über :imagesdir: vorhanden" });
    else if (b.rule_id === "HEAD002" && MAKRO_AM_ANFANG.test(b.context ?? "")) {
      r.unterdrueckt.push({ ...b, grund: "Überschrift beginnt mit Inline-Makro" });
    }
    else if (String(b.severity).toLowerCase() === "error") r.fehler.push(b);
    else r.warnungen.push(b);
  }
  return r;
}

const annotation = (art, b) => `::${art} file=${b.file},line=${b.line ?? 1}::[${b.rule_id ?? "?"}] ${b.message}`;

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const dateien = fs.readdirSync("src/docs", { recursive: true }).filter((d) => d.endsWith(".adoc"))
    .map((d) => path.posix.join("src/docs", d.split(path.sep).join("/"))).sort();
  const linter = process.env.ASCIIDOC_LINTER ?? "asciidoc-linter";
  const lauf = spawnSync(linter, ["--format", "json", ...dateien], { encoding: "utf8" });
  let befunde;
  try { befunde = JSON.parse(lauf.stdout).findings; } catch {
    console.error(`asciidoc-linter lieferte kein JSON (${lauf.error?.message ?? lauf.stderr}):\n${lauf.stdout}`);
    process.exit(2);
  }
  const r = bewerte(befunde);
  for (const b of r.fehler) console.log(annotation("error", b));
  for (const b of r.warnungen) console.log(annotation("warning", b));
  for (const b of r.unterdrueckt) console.log(`unterdrückt (${b.grund}): ${b.file}:${b.line} ${b.message}`);
  console.log(`asciidoc-linter: ${dateien.length} Dateien, ${r.fehler.length} Fehler, ${r.warnungen.length} Warnungen, ${r.unterdrueckt.length} unterdrückt`);
  process.exit(r.fehler.length ? 1 : 0);
}
