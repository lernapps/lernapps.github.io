/*
 * Regeln, die der Build prüft (früher scripts/pruefe.mjs). Reine Funktionen: liefern Fehlermeldungen,
 * eleventy.config.js bricht bei mindestens einer den Build ab.
 */
export const MAX_ZEILEN = 500;

/** Keine http(s)- oder //-Ressourcen in src/href/srcset/data von script, link (außer canonical), img, iframe, source, audio, video, embed, object. */
export function pruefeExterneRessourcen(datei, html) {
  const fehler = [];
  for (const [tag, name] of html.matchAll(/<(script|link|img|iframe|source|audio|video|embed|object)\b[^>]*>/gi)) {
    if (/\brel\s*=\s*["']?canonical/i.test(tag)) continue;
    const attr = tag.match(/\b(?:src|href|srcset|data)\s*=\s*["']?\s*((?:https?:)?\/\/[^"'\s>]+)/i);
    if (attr) fehler.push(`${datei}: externe Ressource in <${name.toLowerCase()}>: ${attr[1]}`);
  }
  return fehler;
}

/** Externe Imports in JS und CSS (import … from "https://…", @import, url(https://…)). */
export function pruefeExterneImporte(datei, text) {
  const muster = /(?:\bfrom\s*["']|\bimport\s*\(\s*["']|@import\s+(?:url\()?["']?|url\(\s*["']?)(?:https?:)?\/\//;
  return muster.test(text) ? [`${datei}: lädt eine externe Ressource (import/url)`] : [];
}

/** Höchstens `max` Zeilen je Datei. */
export function pruefeZeilen(datei, text, max = MAX_ZEILEN) {
  const zeilen = text.endsWith("\n") ? text.split("\n").length - 1 : text.split("\n").length;
  return zeilen > max ? [`${datei}: ${zeilen} Zeilen (höchstens ${max})`] : [];
}

/** llms.txt nennt jede Seite der App. */
export function pruefeLlms(datei, llms, seiten) {
  return seiten.filter((s) => !llms.includes(s)).map((s) => `${datei}: ${s} wird nicht erwähnt`);
}

/** Je Kompetenz: <seite>.md, Generator (relativ zu js/), test/<id>.test.js; ids eindeutig, nur a-z, 0-9, Bindestrich. */
export function pruefeKompetenzen(app, kompetenzen, existiert) {
  const fehler = [];
  const gesehen = new Set();
  for (const k of kompetenzen) {
    if (gesehen.has(k.id)) { fehler.push(`${app}: Kompetenz ${k.id} doppelt`); continue; }
    gesehen.add(k.id);
    if (!/^[a-z][a-z0-9-]*$/.test(k.id)) fehler.push(`${app}: id "${k.id}" nur aus a-z, 0-9 und Bindestrich`);
    const md = k.seite.replace(/\.html$/, ".md");
    const generator = `js/${k.generator.replace(/^\.\//, "")}`;
    if (!existiert(md)) fehler.push(`${app}/${k.id}: Seite ${md} fehlt`);
    if (!existiert(generator)) fehler.push(`${app}/${k.id}: Generator ${generator} fehlt`);
    if (!existiert(`test/${k.id}.test.js`)) fehler.push(`${app}/${k.id}: Test test/${k.id}.test.js fehlt`);
  }
  return fehler;
}

/** Jede Seite verlinkt die Rückmeldung als neues Issue im Repository (Fußzeile). */
export function pruefeMeldeLink(datei, html, repo) {
  return html.includes(`href="${repo}/issues/new?title=`) ? [] : [`${datei}: Melde-Link auf ${repo}/issues/new fehlt`];
}
