/*
 * Bild zu den Kompetenzen 6–8: der Baum. Bei art=pfade sind die Blätter anklickbar; die Auswahl liegt in
 * aufgabe.auswahl und überlebt das Neuzeichnen nach "Prüfen". Gelöst: die Pfade von E orange, mit Pfadwahrscheinlichkeiten.
 */
import { gruppe, rahmen } from "./rahmen.js";
import { zeichneBaumIn } from "./baum.js";

export function zeichnePfadregel2(svg, aufgabe, ergebnis) {
  const geloest = Boolean(ergebnis && ergebnis.korrekt);
  const g = gruppe();
  const optionen = { zeigePfad: geloest };
  if (geloest) optionen.hervorgehoben = new Set(aufgabe.pfade.map((p) => p.id));
  else if (aufgabe.art === "pfade") {
    if (!aufgabe.auswahl) aufgabe.auswahl = new Set();
    optionen.auswahl = aufgabe.auswahl;
  }
  const { breite, hoehe } = zeichneBaumIn(g, aufgabe.baum, optionen);
  const titel = geloest ? `Baumdiagramm; orange: die Pfade von „${aufgabe.ereignis.name}“`
    : aufgabe.art === "pfade" ? "Baumdiagramm – klick auf das Ende eines Pfades, um ihn auszuwählen" : "Baumdiagramm zur Aufgabe";
  rahmen(svg, breite, hoehe, titel, g);
}

/** Dasselbe Bild für die Kompetenzen 7 und 8 (eigene Namen für das Front Matter der Seiten). */
export const zeichneErgebnisformen = zeichnePfadregel2;
export const zeichnePfadeUebersetzen = zeichnePfadregel2;
