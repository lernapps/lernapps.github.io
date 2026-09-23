/*
 * Alle Apps = alle Ordner unter src/ mit js/app.config.js. Liefert je App die Konfiguration, ergänzt um das, was
 * der Build ableitet: Adressen (aus der Basis-URL), Fachfarbe, nummerierte Kompetenzen. Für Layout, Übersicht,
 * Start- und Testseiten, llms.txt und die Vertragstests.
 */
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { fachfarbe } from "./fachfarben.js";

/** Fehler in der App-Konfiguration (Ordner `ordner`), leer wenn alles passt. */
export function pruefeAppKonfig(ordner, app) {
  const fehler = [];
  if (!app.id) fehler.push(`${ordner}: APP.id fehlt (localStorage-Präfix)`);
  if (app.pfad !== ordner) fehler.push(`${ordner}: APP.pfad "${app.pfad}" muss dem Ordnernamen entsprechen`);
  if (!app.titel) fehler.push(`${ordner}: APP.titel fehlt`);
  return fehler;
}

/** quelle: Quellordner (src); adressen: Ergebnis von leiteAdressenAb. Wirft bei fehlerhafter Konfiguration. */
export async function ladeApps({ quelle, adressen }) {
  const apps = [];
  for (const ordner of fs.readdirSync(quelle).sort()) {
    const datei = path.resolve(quelle, ordner, "js/app.config.js");
    if (!fs.existsSync(datei)) continue;
    const { APP, KOMPETENZEN } = await import(pathToFileURL(datei).href);
    const fehler = pruefeAppKonfig(ordner, APP);
    if (fehler.length) throw new Error(fehler.join("\n"));
    apps.push({
      ...APP,
      farbe: fachfarbe(APP.fach),
      basisUrl: adressen.appUrl(APP.pfad),
      quellcode: adressen.quellcode(APP.pfad),
      css: fs.existsSync(path.resolve(quelle, ordner, "css", `${ordner}.css`)),
      kompetenzen: KOMPETENZEN.map((k, i) => ({ ...k, nr: i + 1 })),
    });
  }
  return apps;
}
