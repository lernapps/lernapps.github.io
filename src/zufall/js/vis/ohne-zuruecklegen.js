/*
 * Bild zu Kompetenz 5: oben die Urne vor und nach dem ersten Zug, darunter die Bäume mit und ohne Zurücklegen,
 * der gefragte Pfad jeweils orange.
 */
import { svgEl } from "../../../kern/js/svg.js";
import { gesamtAnzahl } from "../modell/experimente.js";
import { findeKnoten } from "../modell/baum.js";
import { gruppe, rahmen } from "./rahmen.js";
import { zeichneUrneIn } from "./urne.js";
import { zeichneBaumIn } from "./baum.js";

export function zeichneOhneZuruecklegen(svg, aufgabe, ergebnis) {
  const geloest = Boolean(ergebnis && ergebnis.korrekt);
  const vorher = gruppe(0, 0);
  const a = zeichneUrneIn(vorher, aufgabe.experiment, { beschriftung: `Vor dem 1. Zug: ${gesamtAnzahl(aufgabe.experiment)} Kugeln`, entfernt: aufgabe.erster });
  const nachher = gruppe(a.breite + 20, 0);
  const b = zeichneUrneIn(nachher, aufgabe.urneDanach, { beschriftung: `Nach dem 1. Zug: ${gesamtAnzahl(aufgabe.urneDanach)} Kugeln` });
  const oben = Math.max(a.hoehe, b.hoehe) + 24;
  const pfad = [aufgabe.erster, aufgabe.zweiter];
  const baum = (x, titel, bm) => {
    const g = gruppe(x, oben);
    g.append(svgEl("text", { x: 10, y: 0, "font-size": 13, "font-weight": 700 }, titel));
    const blatt = findeKnoten(bm, pfad);
    const inner = gruppe(0, 6);
    const groesse = zeichneBaumIn(inner, bm, { hervorgehoben: new Set(blatt ? [blatt.id] : []), zeigePfad: geloest });
    g.append(inner);
    return { g, ...groesse };
  };
  const mit = baum(0, "Mit Zurücklegen", aufgabe.baumMit);
  const ohne = baum(mit.breite, "Ohne Zurücklegen", aufgabe.baumOhne);
  const breite = Math.max(a.breite + 20 + b.breite, mit.breite + ohne.breite);
  const hoehe = oben + 6 + Math.max(mit.hoehe, ohne.hoehe);
  rahmen(svg, breite, hoehe, `Urne vor und nach dem ersten Zug (${aufgabe.nameE} gezogen), darunter die Bäume mit und ohne Zurücklegen`, vorher, nachher, mit.g, ohne.g);
}
