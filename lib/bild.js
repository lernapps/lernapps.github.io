/*
 * Bild zur Build-Zeit: Generator und Zeichenmodul einer Kompetenz laufen in Node und zeichnen in das Mini-DOM aus
 * src/kern/js/svg.js. So ist das Bild ohne JavaScript sichtbar, und im Browser zeichnet dieselbe Funktion es neu.
 * Front Matter `bild`: { text, funktion, seed?, geloest?, vorgaben?, modul?, uebung?, uebungFunktion? } – modul = js/vis/<modul|id>.js.
 * Dieses Bild zeigt fest das Beispiel; die Übung zeichnet ein eigenes Bild zur Aufgabe (uebung = Zusatz zur Beschriftung,
 * uebungFunktion = andere Zeichenfunktion aus demselben Modul für die Übung, etwa zum Markieren).
 */
import path from "node:path";
import { pathToFileURL } from "node:url";
import { erzeugeZufall } from "../src/kern/js/zufall.js";
import { leeresSvg, alsSvgText } from "../src/kern/js/svg.js";

const lade = (datei) => import(pathToFileURL(path.resolve(datei)).href);

/** ordner: src/<app>; kompetenz: Eintrag aus KOMPETENZEN; bild: Front Matter. Liefert SVG-Markup. */
export async function zeichneBild({ ordner, kompetenz, bild }) {
  const modulDatei = path.join(ordner, "js/vis", `${bild.modul ?? kompetenz.id}.js`);
  const vis = await lade(modulDatei);
  const zeichne = vis[bild.funktion];
  if (typeof zeichne !== "function") throw new Error(`Zeichenfunktion ${bild.funktion} fehlt in ${modulDatei}`);
  const generator = await lade(path.join(ordner, "js", kompetenz.generator));
  const zufall = erzeugeZufall(bild.seed ?? 1);
  const aufgabe = generator.erzeugeAufgabe(zufall, bild.vorgaben ?? {});
  aufgabe.seed = zufall.seed;
  const svg = leeresSvg({ class: "vis", id: "vis" });
  zeichne(svg, aufgabe, bild.geloest ? { korrekt: true } : undefined);
  return alsSvgText(svg);
}
