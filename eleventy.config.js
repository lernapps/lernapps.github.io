/*
 * Build aller Lern-Apps: ein Kern (src/kern → /kern/), je App ein Ordner src/<app>/ mit Konfiguration, Markdown-Seiten,
 * Generatoren und Bildern. Nach dem Schreiben prüft der Build die Regeln (lib/pruefungen.js) und versieht jede
 * lokale JS/CSS-Referenz mit ?v=<Hash> (lib/versionierung.js).
 */
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { RenderPlugin } from "@11ty/eleventy";
import site from "./src/_data/site.js";
import { ladeApps } from "./lib/apps.js";
import { zeichneBild } from "./lib/bild.js";
import { versionsHash, versioniere } from "./lib/versionierung.js";
import { richteKarteEin } from "./lib/karte/eleventy.js";
import { pruefeZeilen, pruefeLlms, pruefeKompetenzen, pruefeMeldeLink, pruefeSerloLinks } from "./lib/pruefungen.js";
import { pruefeAusgabe } from "./lib/pruefe-ausgabe.js";
import { findeLinks, pruefeLink, pruefeVorgaben, pruefeParameterDoku, pruefeUebersicht, dokumentierteWerte } from "./lib/llms-vertrag.js";
import { leseVorgaben } from "./src/kern/js/aufgabenlink.js";
import { erzeugeZufall } from "./src/kern/js/zufall.js";
import { MODI } from "./src/kern/js/testablauf.js";

const QUELLE = "src";
// Gepatchte Kopien des docToolchain-Themes (Architektur-Doku, TD-10): fremder Code, von der Zeilengrenze ausgenommen.
const THEME_KOPIEN = /^src\/site\/assets\/css\/(asciidoctor|main\.min\.[0-9a-f]+)\.css$/;

function alleDateien(ordner, ausnahmen = new Set()) {
  const liste = [];
  for (const e of fs.readdirSync(ordner, { withFileTypes: true })) {
    const p = path.join(ordner, e.name);
    if (ausnahmen.has(e.name)) continue;
    if (e.isDirectory()) liste.push(...alleDateien(p, ausnahmen));
    else liste.push(p);
  }
  return liste;
}

/** Regeln über Quellen und Ausgabe; liefert Fehlermeldungen. */
function pruefe(apps, ausgabe) {
  const fehler = [];
  const textDateien = [
    ...alleDateien(".", new Set(["node_modules", ".git", "_site", ".playwright-mcp", "package-lock.json", "build", ".gradle"])),
  ].filter((p) => /\.(js|mjs|njk|md|css|txt|json|yml|svg)$/.test(p) && !THEME_KOPIEN.test(p));
  for (const p of textDateien) fehler.push(...pruefeZeilen(p, fs.readFileSync(p, "utf8")));
  const dateien = alleDateien(ausgabe);
  fehler.push(...pruefeAusgabe(dateien, (p) => fs.readFileSync(p, "utf8")));
  for (const p of dateien.filter((d) => d.endsWith(".html"))) {
    const html = fs.readFileSync(p, "utf8");
    fehler.push(...pruefeMeldeLink(p, html, site.repo), ...pruefeSerloLinks(p, html));
  }
  for (const app of apps) {
    const ordner = path.join(QUELLE, app.pfad);
    fehler.push(...pruefeKompetenzen(app.pfad, app.kompetenzen, (p) => fs.existsSync(path.join(ordner, p))));
    const llms = path.join(ausgabe, app.pfad, "llms.txt");
    const seiten = ["index.html", "test.html", ...app.kompetenzen.map((k) => k.seite)];
    fehler.push(...pruefeLlms(`${app.pfad}/llms.txt`, fs.existsSync(llms) ? fs.readFileSync(llms, "utf8") : "", seiten));
  }
  return fehler;
}

const lies = (p) => (fs.existsSync(p) ? fs.readFileSync(p, "utf8") : "");
const ankerIn = (html) => new Set([...html.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]));

/** TD-3: Deep Links, Parameter, Werte und Anker in llms.txt und tutor.md passen zu Seiten und Generatoren. */
async function pruefeTutorVertrag(apps, ausgabe) {
  const fehler = [];
  for (const app of apps) {
    const ordner = path.join(ausgabe, app.pfad);
    const seiten = new Map([
      ["index.html", { parameter: [], anker: ankerIn(lies(path.join(ordner, "index.html"))) }],
      ["test.html", { parameter: ["nr", "seed", "modus"], werte: { modus: Object.keys(MODI) }, anker: ankerIn(lies(path.join(ordner, "test.html"))) }],
      ["llms.txt", { parameter: [] }],
      ["tutor.md", { parameter: [] }],
    ]);
    const module = new Map();
    for (const k of app.kompetenzen) {
      const modul = await import(pathToFileURL(path.resolve(QUELLE, app.pfad, k.modulPfad)).href);
      module.set(k.seite, modul);
      const parameter = [...(modul.URL_ZAHLEN || []), ...(modul.URL_TEXTE || [])];
      seiten.set(k.seite, { parameter: [...parameter, "seed", "nr"], eigene: parameter, anker: ankerIn(lies(path.join(ordner, k.seite))) });
    }
    const texte = ["llms.txt", "tutor.md"].map((name) => [`${app.pfad}/${name}`, lies(path.join(ordner, name))]);
    const links = texte.flatMap(([datei, text]) => findeLinks(text, app.basisUrl).map((link) => ({ datei, link })));
    const listen = dokumentierteWerte(texte.map(([, text]) => text).join("\n"));
    const alternativen = new Map(); // seite → name → dokumentierte Werte (aus Links und Listen wie `zuege=2|3`)
    for (const { link } of links) {
      const jeName = alternativen.get(link.seite) || alternativen.set(link.seite, new Map()).get(link.seite);
      for (const [name, wert] of link.parameter) {
        if (!jeName.has(name)) jeName.set(name, new Set(listen.get(name)));
        jeName.get(name).add(wert);
      }
    }
    for (const { datei, link } of links) {
      const linkFehler = pruefeLink(datei, link, seiten);
      fehler.push(...linkFehler);
      const modul = module.get(link.seite);
      if (modul && !linkFehler.length) fehler.push(...pruefeVorgaben(datei, link, modul, { leseVorgaben, erzeugeZufall }, alternativen.get(link.seite)));
    }
    const [llmsDatei, llms] = texte[0];
    fehler.push(...pruefeUebersicht(llmsDatei, llms, seiten));
    for (const seite of module.keys()) fehler.push(...pruefeParameterDoku(llmsDatei, llms, app.basisUrl, seite, seiten.get(seite).eigene));
  }
  return [...new Set(fehler)];
}

/** ?v=<Hash über alle ausgelieferten JS/CSS/JSON> an jede lokale Referenz in JS und HTML (JSON: data.json der Karte). */
function versioniereAusgabe(ausgabe) {
  const dateien = alleDateien(ausgabe);
  const v = versionsHash(dateien.filter((p) => /\.(js|css|json)$/.test(p)).map((p) => [path.relative(ausgabe, p), fs.readFileSync(p)]));
  for (const p of dateien) {
    const art = p.endsWith(".js") ? "js" : p.endsWith(".html") ? "html" : undefined;
    if (art) fs.writeFileSync(p, versioniere(fs.readFileSync(p, "utf8"), v, art));
  }
  return v;
}

export default async function (eleventyConfig) {
  const apps = await ladeApps({ quelle: QUELLE, adressen: site });
  eleventyConfig.addPlugin(RenderPlugin);
  eleventyConfig.addFilter("urlkodiert", (s) => encodeURIComponent(s));
  eleventyConfig.addAsyncShortcode("bild", (pfad, kompetenz, bild) => zeichneBild({ ordner: path.join(QUELLE, pfad), kompetenz, bild }));
  eleventyConfig.addPassthroughCopy({ "src/kern": "kern", "src/favicon.svg": "favicon.svg", "src/favicon.ico": "favicon.ico" });
  for (const a of apps) {
    eleventyConfig.addPassthroughCopy({ [`src/${a.pfad}/js`]: `${a.pfad}/js`, [`src/${a.pfad}/*.{png,svg}`]: a.pfad });
    if (a.css) eleventyConfig.addPassthroughCopy({ [`src/${a.pfad}/css`]: `${a.pfad}/css` });
    eleventyConfig.ignores.add(`src/${a.pfad}/test/**`);
  }
  eleventyConfig.ignores.add("src/kern/**");
  // Architektur-Doku (arc42) und ihre Theme-Overrides baut docToolchain, nicht Eleventy (scripts/dtc-v4.sh).
  eleventyConfig.ignores.add("src/docs/**");
  eleventyConfig.ignores.add("src/site/**");
  richteKarteEin(eleventyConfig);
  eleventyConfig.on("eleventy.after", async ({ dir }) => {
    const fehler = [...pruefe(apps, dir.output), ...(await pruefeTutorVertrag(apps, dir.output))];
    if (fehler.length) throw new Error(`Build-Prüfung: ${fehler.length} Fehler\n  ✗ ${fehler.join("\n  ✗ ")}`);
    console.log(`[lern-apps] ${apps.length} App(s) geprüft, ?v=${versioniereAusgabe(dir.output)}`);
  });
  return {
    dir: { input: QUELLE, output: "_site", includes: "_includes", data: "_data" },
    pathPrefix: site.pfadPraefix,
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
}
