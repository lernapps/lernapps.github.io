// Seitenliste der Browser-Tests (#26), abgeleitet aus den App-Konfigurationen wie im Build: neue Apps laufen automatisch mit.
import fs from "node:fs";
import { ladeApps } from "../lib/apps.js";
import { leiteAdressenAb } from "../lib/adressen.js";

export const apps = await ladeApps({ quelle: "src", adressen: leiteAdressenAb("https://lernapps.github.io/") });

/** Jede Kompetenzseite: { app, pfad, id } mit pfad relativ zur Wurzel, z. B. "binom/erste-binomische.html". */
export const kompetenzSeiten = apps.flatMap((app) =>
  app.kompetenzen.map((k) => ({ app: app.pfad, id: k.id, pfad: `${app.pfad}/${k.seite}` })));

export const startSeiten = ["", ...apps.map((a) => `${a.pfad}/`)];
export const testSeiten = apps.map((a) => `${a.pfad}/test.html`);
// Die Architektur-Doku baut doku.yml mit docToolchain, nicht Eleventy: nur prüfen, wenn sie in _site liegt.
const docs = fs.existsSync("_site/docs/index.html") ? ["docs/"] : [];
const karte = fs.readdirSync("_site/karte").filter((d) => d.endsWith(".html")).map((d) => `karte/${d}`);

/** Alle App-Seiten: Start, Kompetenzen, Tests. */
export const appSeiten = [...startSeiten, ...kompetenzSeiten.map((k) => k.pfad), ...testSeiten];
export const alleSeiten = [...appSeiten, "karte/", ...karte.filter((k) => k !== "karte/index.html"), ...docs];

/** Erste Kompetenzseite je App (für Übungs-, axe- und Ohne-JS-Tests). */
export const eineJeApp = apps.map((app) => kompetenzSeiten.find((k) => k.app === app.pfad));

/** Sammelt Konsolenfehler und Skriptfehler einer Seite. */
export function sammleFehler(page) {
  const fehler = [];
  page.on("console", (m) => { if (m.type() === "error") fehler.push(`console: ${m.text()}`); });
  page.on("pageerror", (e) => fehler.push(`pageerror: ${e.message}`));
  return fehler;
}
