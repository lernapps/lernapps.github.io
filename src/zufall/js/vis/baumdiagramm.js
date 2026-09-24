/* Bild zu Kompetenz 2: der Baum, die gesuchten Zweige als a), b) … mit "?"; nach der richtigen Antwort mit Wert. */
import { gruppe, rahmen } from "./rahmen.js";
import { zeichneBaumIn } from "./baum.js";

export function zeichneBaumdiagramm(svg, aufgabe, ergebnis) {
  const geloest = Boolean(ergebnis && ergebnis.korrekt);
  const versteckt = new Map(aufgabe.versteckt.map((v) => [v.knotenId, v.buchstabe]));
  const g = gruppe();
  const { breite, hoehe } = zeichneBaumIn(g, aufgabe.baum, { versteckt, geloest, zeigePfad: geloest });
  rahmen(svg, breite, hoehe, `Baumdiagramm mit ${geloest ? "allen" : "fehlenden"} Zweigwahrscheinlichkeiten`, g);
}
