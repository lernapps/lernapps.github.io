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

/** serlo-Links im Abschnitt #serlo zeigen nur auf Artikel unter https://de.serlo.org/… (kein Netzabruf im Build). */
export function pruefeSerloLinks(datei, html) {
  const abschnitt = html.match(/<section id="serlo"[^>]*>([\s\S]*?)<\/section>/);
  if (!abschnitt) return [];
  const hrefs = [...abschnitt[1].matchAll(/<a\b[^>]*\bhref="([^"]*)"/g)].map((m) => m[1]);
  if (!hrefs.length) return [`${datei}: #serlo ohne Link`];
  return hrefs.filter((h) => !/^https:\/\/de\.serlo\.org\/[^\s"]+$/.test(h)).map((h) => `${datei}: serlo.url muss mit https://de.serlo.org/ beginnen: "${h}"`);
}

/** Tutor-Texte sprechen alle Lernenden an: kein Ziel einer einzelnen Lernenden wie ein Wettbewerb (Product Owner, 24.09.2026). */
export function pruefeTutorText(datei, text) {
  return /wettbewerb/i.test(text) ? [`${datei}: nennt einen Wettbewerb – Tutor-Texte richten sich an alle Lernenden`] : [];
}

/*
 * Allowlist für Links in tutor.md und llms.txt (ADR-023, T-015): Diese Dateien landen als Prompt im Chat eines Kindes.
 * Erlaubt sind die eigene Site, Dateien und Ordner auf `main` im eigenen Repository (keine Issues, die jeder nach dem
 * Review ändern kann, und keine fremden Commits, die GitHub aus Forks unter der eigenen Adresse zeigt), serlo-Artikel und YouTube-Videos (die llms.txt nennt die Videos der Kompetenzseiten); relative Links ohnehin. Jedes andere Ziel bricht den Build.
 */
export function erlaubteTutorZiele(site) {
  return [site.basis, `${site.repo}/blob/main/`, `${site.repo}/tree/main/`, "https://de.serlo.org/", "https://www.youtube.com/watch?v="];
}

// Absolute URLs (jedes Schema, auch mit nur einem / oder \\), protokoll-relative //host, www.host ohne Schema,
// javascript:/data:/vbscript:/mailto:, nackte Hosts mit Pfad, Port, Query oder Anker wie evil.com/x (ein bloßer Name wie
// serlo.org ist kein Link) und UNC-Pfade \\host. Dateien wie `test.html?nr=1` bleiben relative Links.
// Lieber zu streng: Auch `node.js/` im Fließtext bricht den Build.
const REST = String.raw`[^\s<>"'\`)\]]*`;
const LINK_MUSTER = new RegExp([
  String.raw`\b[a-z][a-z0-9+.-]*:[/\\]+` + REST,
  String.raw`(?<![\w:/\\])//[\w-]+\.` + REST,
  String.raw`(?<![\w./-])www\.[\w-]+\.` + REST,
  String.raw`\b(?:javascript|data|vbscript|mailto):[^\s<>"'\`\]]*`,
  String.raw`(?<![\w./@:-])[\w-]+(?:\.[\w-]+)*\.[a-z]{2,}(?<!\.(?:html?|md|txt|json|js|css|svg|png|xml))(?=/|:\d|\?|#)` + REST,
  String.raw`\\\\[\w-]+\.` + REST,
].join("|"), "gi");
// Pfad-Tricks, mit denen ein erlaubtes Präfix woanders hinführt: ../, kodierte Punkte und Schrägstriche, Backslash.
const PFAD_TRICK = /\.\.|%2e|%2f|%5c|\\/i;

/** Jeder Link in einer Tutor-Datei beginnt mit einem Präfix der Allowlist (relative Links sind immer erlaubt). */
export function pruefeTutorLinks(datei, text, erlaubt) {
  return [...text.matchAll(LINK_MUSTER)].map((m) => m[0])
    .filter((url) => PFAD_TRICK.test(url) || !erlaubt.some((praefix) => url.startsWith(praefix)))
    .map((url) => `${datei}: Link außerhalb der Allowlist (ADR-023): ${url}`);
}

/*
 * Herkunft (ADR-021, R-021): Den Knopf „Zurück zu Claude“ zeigt die App nur mit von=tutor. Jeder Link in tutor.md auf
 * eine App-Seite (.html) trägt den Parameter vor einem #-Anker; Platzhalter wie <Nummer> stören nicht.
 */
export function pruefeTutorHerkunft(datei, text, basis) {
  // Kein RegExp aus der Basis-URL bauen: startsWith vergleicht die Adresse wörtlich.
  return [...text.matchAll(/https?:\/\/[^\s"'`)\]]*/g)].map((m) => m[0])
    .filter((url) => url.startsWith(basis) && /\.html$/.test(url.split(/[?#]/)[0]))
    .filter((url) => !/[?&]von=tutor(?=&|#|$)/.test(url.split("#")[0]))
    .map((url) => `${datei}: App-Link ohne von=tutor (ADR-021): ${url}`);
}
