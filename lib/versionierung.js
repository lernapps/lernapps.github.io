/*
 * Cache-Schutz: Jede lokale JS/CSS-Referenz trägt ?v=<Hash über alle ausgelieferten JS/CSS>. Der Build setzt das
 * nach dem Schreiben von _site; im Quellcode steht nie ein ?v=. Überall exakt derselbe Wert, sonst lädt der Browser
 * ein Modul zweimal (zwei Instanzen ohne geteilten Zustand) oder mischt alte und neue Module aus dem Cache.
 */
import crypto from "node:crypto";

/** Hash (8 Hex-Zeichen) über [[pfad, inhalt], …], unabhängig von der Übergabe-Reihenfolge. */
export function versionsHash(dateien) {
  const hash = crypto.createHash("sha256");
  for (const [pfad, inhalt] of [...dateien].sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))) hash.update(pfad).update("\0").update(inhalt);
  return hash.digest("hex").slice(0, 8);
}

/** Relative Modul-Spezifizierer hinter from, import oder import( – mit optional schon vorhandenem ?v=. */
const JS_IMPORT = /(\bfrom\s*|\bimport\s*\(\s*|\bimport\s+)(["'])(\.{1,2}\/[^"'?\n]+?)(?:\?v=[^"']*)?\2/g;
const HTML_ATTR = /(<(?:script|link)\b[^>]*?\s(?:src|href)=")((?![a-z][a-z0-9+.-]*:|\/\/|#)[^"?#]+\.(?:js|css))(?:\?v=[^"]*)?"/gi;
const INLINE_SCRIPT = /(<script\b[^>]*>)([\s\S]*?)(<\/script>)/gi;

const jsVersionieren = (text, v) => text.replace(JS_IMPORT, (_, vor, q, pfad) => `${vor}${q}${pfad}?v=${v}${q}`);

/** Hängt ?v=<v> an alle lokalen Referenzen; art "js" (Importe) oder "html" (script/link + Inline-Module). */
export function versioniere(text, v, art) {
  if (art === "js") return jsVersionieren(text, v);
  return text
    .replace(HTML_ATTR, (_, vor, pfad) => `${vor}${pfad}?v=${v}"`)
    .replace(INLINE_SCRIPT, (_, auf, rumpf, zu) => `${auf}${jsVersionieren(rumpf, v)}${zu}`);
}
