/*
 * Check `ki-review` (#24, ADR-027): Ist der aktuelle Stand eines PRs von einem KI-Review freigegeben?
 * Ein Beitrag (PR-Kommentar oder Review-Text) zählt als KI-Review, wenn
 *   - ein Konto aus `konten` ihn geschrieben hat,
 *   - er mit der Überschrift `## KI-Review` beginnt,
 *   - er nach dem letzten Commit kam (`zeit` > `commitZeit`) und
 *   - seine Zeile `Stand: <sha>` (mindestens 7 Zeichen) den Kopf-Commit des PRs nennt.
 * Das neueste solche Review entscheidet: frei nur mit der Zeile `Ergebnis: freigegeben`.
 *   node scripts/ki-review-pruefen.js <beitraege.json>
 *   Umgebung: KOPF_SHA, COMMIT_ZEIT, KI_REVIEW_KONTEN (Logins, durch Komma getrennt)
 * Die Datei hält ein JSON-Array aus { autor, zeit, text }; der Workflow holt es mit `gh api`.
 */
import fs from "node:fs";
import { fileURLToPath } from "node:url";

const UEBERSCHRIFT = /^## KI-Review[ \t]*$/m;
const STAND = /^Stand:[ \t]*`?([0-9a-f]{7,40})`?[ \t]*$/im;
const ERGEBNIS = /^Ergebnis:[ \t]*(.+?)[ \t]*$/m;

function alsReview(beitrag) {
  const text = String(beitrag.text ?? "").replace(/\r\n?/g, "\n").trimStart();
  if (!text.startsWith("## KI-Review") || !UEBERSCHRIFT.test(text.split("\n")[0])) return null;
  return {
    autor: beitrag.autor,
    zeit: Date.parse(beitrag.zeit),
    stand: STAND.exec(text)?.[1]?.toLowerCase() ?? "",
    ergebnis: ERGEBNIS.exec(text)?.[1] ?? "",
  };
}

export function pruefeKiReview({ beitraege, kopfSha, commitZeit, konten }) {
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
  return { ok: true, grund: `KI-Review für ${kopf.slice(0, 7)} von ${neuestes.autor}: freigegeben.` };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const beitraege = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));
  const konten = (process.env.KI_REVIEW_KONTEN ?? "").split(",").map((k) => k.trim()).filter(Boolean);
  const e = pruefeKiReview({ beitraege, kopfSha: process.env.KOPF_SHA ?? "", commitZeit: process.env.COMMIT_ZEIT ?? "", konten });
  console.log(e.ok ? `::notice title=KI-Review::${e.grund}` : `::error title=KI-Review::${e.grund}`);
  process.exit(e.ok ? 0 : 1);
}
