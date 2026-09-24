/*
 * Link-Checker für die gebaute Site (Harness-Rad: link-checker). Jedes href/src in einer HTML-Seite, das auf die
 * eigene Site zeigt (relativ, wurzelrelativ oder absolut auf die Basis-URL), muss auf eine Datei der Ausgabe führen;
 * ein #anker muss als id (oder name) in der Zielseite stehen. Externe Links, mailto:, tel:, javascript:, data: und
 * ein nacktes # bleiben ungeprüft – der Build ruft kein Netz ab. eleventy.config.js bricht bei einem Fund den Build.
 */
import path from "node:path";

const FREMD = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i;
const ATTRIBUT = /\s(?:href|src)\s*=\s*(["'])(.*?)\1/gi;
const entschluessele = (s) => { try { return decodeURIComponent(s.replace(/&amp;/g, "&")); } catch { return s; } };

/**
 * Wohin führt `link` aus der Seite `seite` (Pfad relativ zur Ausgabe)? Liefert { datei, anker } oder null für
 * alles, was nicht zur Site gehört.
 */
export function zielVon(seite, link, basis) {
  let rest = link.trim();
  const praefix = new URL(basis).pathname;
  if (rest.startsWith(basis)) rest = praefix + rest.slice(basis.length);
  else if (FREMD.test(rest)) return null;
  const hash = rest.indexOf("#");
  const anker = hash < 0 ? "" : entschluessele(rest.slice(hash + 1));
  const pfad = entschluessele((hash < 0 ? rest : rest.slice(0, hash)).split("?")[0]);
  let datei;
  if (!pfad) datei = seite;
  else if (pfad.startsWith("/")) datei = pfad.startsWith(praefix) ? pfad.slice(praefix.length) : pfad.slice(1);
  else datei = path.posix.join(path.posix.dirname(seite), pfad);
  datei = path.posix.normalize(datei).replace(/^\.\/?/, "");
  if (datei === "" || datei.endsWith("/")) datei += "index.html";
  return { datei, anker };
}

const ankerVon = (html) => new Set([...html.matchAll(/\s(?:id|name)\s*=\s*["']([^"']+)["']/gi)].map((m) => m[1]));

/**
 * seiten: { <Pfad relativ zur Ausgabe>: <Inhalt> } für ALLE Dateien der Ausgabe (Inhalt nur bei .html nötig).
 * optionen.ausser: Pfad-Präfixe, die ein anderer Build liefert (z. B. "docs/"). Liefert Fehlermeldungen.
 */
export function pruefeLinks(seiten, basis, { ausser = [] } = {}) {
  const fehler = [];
  const anker = new Map();
  const ankerIn = (datei) => anker.get(datei) ?? anker.set(datei, ankerVon(seiten[datei])).get(datei);
  for (const [seite, html] of Object.entries(seiten)) {
    if (!seite.endsWith(".html")) continue;
    for (const [, , link] of html.matchAll(ATTRIBUT)) {
      if (link === "#" || link === "") continue;
      const ziel = zielVon(seite, link, basis);
      if (!ziel || ausser.some((p) => ziel.datei.startsWith(p))) continue;
      let datei = ziel.datei;
      if (!(datei in seiten) && `${datei}/index.html` in seiten) datei = `${datei}/index.html`;
      if (!(datei in seiten)) fehler.push(`${seite}: toter Link ${link} (${datei} fehlt)`);
      else if (ziel.anker && datei.endsWith(".html") && !ankerIn(datei).has(ziel.anker)) {
        fehler.push(`${seite}: toter Anker ${link} (#${ziel.anker} fehlt in ${datei})`);
      }
    }
  }
  return fehler;
}
