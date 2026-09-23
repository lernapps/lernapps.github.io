/*
 * Prüft eine gebaute Ausgabe auf fremde Ressourcen (lib/pruefungen.js): HTML ohne externe src/href in
 * script/link/img/…, JS und CSS ohne externe Importe. Links (<a href>) sind erlaubt – sie laden erst beim Klick.
 * Genutzt vom Eleventy-Build (_site) und als Kommando für die Architektur-Doku (TD-22/23):
 *   node lib/pruefe-ausgabe.js build/microsite/output
 */
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { pruefeExterneRessourcen, pruefeExterneImporte } from "./pruefungen.js";

/** dateien: Pfade; lies(pfad) liefert den Text. Liefert Fehlermeldungen. */
export function pruefeAusgabe(dateien, lies) {
  const fehler = [];
  for (const p of dateien) {
    if (p.endsWith(".html")) fehler.push(...pruefeExterneRessourcen(p, lies(p)));
    else if (/\.(js|css)$/.test(p)) fehler.push(...pruefeExterneImporte(p, lies(p)));
  }
  return fehler;
}

function alleDateien(ordner) {
  return fs.readdirSync(ordner, { withFileTypes: true, recursive: true })
    .filter((e) => e.isFile())
    .map((e) => path.join(e.parentPath, e.name));
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const ordner = process.argv[2];
  if (!ordner || !fs.existsSync(ordner)) {
    console.error(`Aufruf: node lib/pruefe-ausgabe.js <ordner> (${ordner ?? "kein Ordner"} fehlt)`);
    process.exit(2);
  }
  const dateien = alleDateien(ordner);
  const fehler = pruefeAusgabe(dateien, (p) => fs.readFileSync(p, "utf8"));
  if (fehler.length) {
    console.error(`Fremde Ressourcen: ${fehler.length} Fehler\n  ✗ ${fehler.join("\n  ✗ ")}`);
    process.exit(1);
  }
  console.log(`${ordner}: ${dateien.length} Dateien geprüft, keine fremden Ressourcen`);
}
