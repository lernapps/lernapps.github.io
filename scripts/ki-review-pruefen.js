/*
 * Check `ki-review` (#24, ADR-027): Ist der aktuelle Stand eines PRs von einem KI-Review freigegeben?
 * Ein Beitrag (PR-Kommentar oder Review-Text) zählt als KI-Review, wenn
 *   - ein Konto aus `konten` ihn geschrieben hat,
 *   - er mit der Überschrift `## KI-Review` beginnt,
 *   - er nach dem letzten Commit kam (`zeit` > `commitZeit`) und
 *   - seine Zeile `Stand: <sha>` (mindestens 7 Zeichen) den Kopf-Commit des PRs nennt.
 * Das neueste solche Review entscheidet: frei nur mit der Zeile `Ergebnis: freigegeben`.
 * Ändert der PR eine Datei unter ARCHITEKTUR_PFADE (ADR-030), braucht das Review zusätzlich den Abschnitt
 * `### Architektur (ATAM)`.
 *   node scripts/ki-review-pruefen.js <beitraege.json> [<dateien.txt>]
 *   Umgebung: KOPF_SHA, COMMIT_ZEIT, KI_REVIEW_KONTEN (Logins, durch Komma getrennt)
 * Die Datei hält ein JSON-Array aus { autor, zeit, text }; der Workflow holt es mit `gh api`.
 * `dateien.txt` nennt je Zeile eine geänderte Datei des PRs (`pulls/{n}/files`, auch alte Namen).
 */
import fs from "node:fs";
import { fileURLToPath } from "node:url";

const UEBERSCHRIFT = /^## KI-Review[ \t]*$/m;
const STAND = /^Stand:[ \t]*`?([0-9a-f]{7,40})`?[ \t]*$/im;
const ERGEBNIS = /^Ergebnis:[ \t]*(.+?)[ \t]*$/m;
const ATAM_ABSCHNITT = /^### Architektur \(ATAM\)[ \t]*$/m;

/**
 * Auslösepfade für das Architektur-Review nach ATAM (ADR-030): Entscheidungen (ADRs, Kapitel 9),
 * Qualitätsdefinitionen (Kapitel 1 und 10), Lösungsstrategie (Kapitel 4) und Bausteine (Kapitel 5).
 * Änderung nur per PR, zusammen mit ADR-030 und `werkzeuge/review/ki-review.md`.
 */
export const ARCHITEKTUR_PFADE = [
  /^src\/docs\/arc42\/chapters\/_adr-[^/]*\.adoc$/,
  /^src\/docs\/arc42\/chapters\/09_[^/]*\.adoc$/,
  /^src\/docs\/arc42\/chapters\/01_[^/]*\.adoc$/,
  /^src\/docs\/arc42\/chapters\/10_[^/]*\.adoc$/,
  /^src\/docs\/arc42\/chapters\/04_[^/]*\.adoc$/,
  /^src\/docs\/arc42\/chapters\/05_[^/]*\.adoc$/,
];

/** Die Dateien des PRs, die ein Architektur-Review nach ATAM auslösen. */
export function beruehrteArchitektur(dateien) {
  return dateien.filter((d) => ARCHITEKTUR_PFADE.some((muster) => muster.test(d)));
}

function alsReview(beitrag) {
  const text = String(beitrag.text ?? "").replace(/\r\n?/g, "\n").trimStart();
  if (!text.startsWith("## KI-Review") || !UEBERSCHRIFT.test(text.split("\n")[0])) return null;
  return {
    autor: beitrag.autor,
    zeit: Date.parse(beitrag.zeit),
    stand: STAND.exec(text)?.[1]?.toLowerCase() ?? "",
    ergebnis: ERGEBNIS.exec(text)?.[1] ?? "",
    atam: ATAM_ABSCHNITT.test(text),
  };
}

export function pruefeKiReview({ beitraege, kopfSha, commitZeit, konten, dateien = [] }) {
  const kopf = kopfSha.toLowerCase();
  const nachCommit = Date.parse(commitZeit);
  const gueltig = beitraege
    .map(alsReview)
    .filter((r) => r && konten.includes(r.autor) && r.zeit > nachCommit && r.stand && kopf.startsWith(r.stand))
    .sort((a, b) => a.zeit - b.zeit);
  const neuestes = gueltig.at(-1);
  if (!neuestes) {
    return {
      ok: false,
      grund: `Kein KI-Review für ${kopf.slice(0, 7)} nach dem letzten Commit (${commitZeit}) von ${konten.join(", ")}. ` +
        "Review in frischem Kontext laufen lassen (werkzeuge/review/ki-review.md) und das Ergebnis posten.",
    };
  }
  if (neuestes.ergebnis !== "freigegeben") {
    return { ok: false, grund: `Das neueste KI-Review für ${kopf.slice(0, 7)} sagt „Ergebnis: ${neuestes.ergebnis}“.` };
  }
  const architektur = beruehrteArchitektur(dateien);
  if (architektur.length > 0 && !neuestes.atam) {
    return {
      ok: false,
      grund: `Der PR ändert Architektur-Dateien (${architektur.join(", ")}), aber das KI-Review für ${kopf.slice(0, 7)} ` +
        "hat keinen Abschnitt „### Architektur (ATAM)“ (ADR-030, werkzeuge/review/ki-review.md).",
    };
  }
  return { ok: true, grund: `KI-Review für ${kopf.slice(0, 7)} von ${neuestes.autor}: freigegeben.` };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const beitraege = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));
  const dateien = process.argv[3]
    ? fs.readFileSync(process.argv[3], "utf8").split("\n").map((d) => d.trim()).filter(Boolean)
    : [];
  const konten = (process.env.KI_REVIEW_KONTEN ?? "").split(",").map((k) => k.trim()).filter(Boolean);
  const e = pruefeKiReview({ beitraege, kopfSha: process.env.KOPF_SHA ?? "", commitZeit: process.env.COMMIT_ZEIT ?? "", konten, dateien });
  console.log(e.ok ? `::notice title=KI-Review::${e.grund}` : `::error title=KI-Review::${e.grund}`);
  process.exit(e.ok ? 0 : 1);
}
