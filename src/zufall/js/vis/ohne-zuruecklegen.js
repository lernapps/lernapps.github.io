/*
 * Bild zu Kompetenz 5: oben die Urne vor dem ersten Zug, die gezogene Kugel und die Urne danach; darunter die Bäume
 * mit und ohne Zurücklegen UNTEREINANDER (nebeneinander passt es auf kein Handy), der gefragte Pfad jeweils orange.
 */
import { svgEl } from "../../../kern/js/svg.js";
import { gesamtAnzahl } from "../modell/experimente.js";
import { findeKnoten } from "../modell/baum.js";
import { gruppe, rahmen, kugel } from "./rahmen.js";
import { zeichneUrneIn } from "./urne.js";
import { zeichneBaumIn } from "./baum.js";

const LUECKE = 56; // Platz zwischen den Urnen für die gezogene Kugel
const ABSTAND_BAEUME = 20;

function gezogeneKugel(x, y, aufgabe) {
  const g = gruppe(x, y, { class: "gezogen" });
  const e = aufgabe.experiment.ergebnisse.find((k) => k.id === aufgabe.erster) || { farbe: "#999" };
  g.append(svgEl("path", { d: `M4 0 L${LUECKE - 4} 0`, stroke: "#455a64", "stroke-width": 2 }));
  g.append(kugel(LUECKE / 2, 0, 13, e.farbe, { betont: true }));
  g.append(svgEl("text", { x: LUECKE / 2, y: 32, "text-anchor": "middle", "font-size": 12, fill: "#1a1a1a" }, "gezogen"));
  return g;
}

export function zeichneOhneZuruecklegen(svg, aufgabe, ergebnis) {
  const geloest = Boolean(ergebnis && ergebnis.korrekt);
  const vorher = gruppe(0, 0, { class: "urne-vorher" });
  const a = zeichneUrneIn(vorher, aufgabe.experiment, { beschriftung: `Vorher: ${gesamtAnzahl(aufgabe.experiment)} Kugeln` });
  const mitte = gezogeneKugel(a.breite - 10, 42, aufgabe);
  const nachher = gruppe(a.breite + LUECKE - 10, 0, { class: "urne-nachher" });
  const b = zeichneUrneIn(nachher, aufgabe.urneDanach, { beschriftung: `Nachher: ${gesamtAnzahl(aufgabe.urneDanach)} Kugeln` });
  const pfad = [aufgabe.erster, aufgabe.zweiter];
  let y = Math.max(a.hoehe, b.hoehe) + 24;
  const baum = (titel, bm) => {
    const g = gruppe(0, y, { class: "baum" });
    g.append(svgEl("text", { x: 10, y: 0, "font-size": 13, "font-weight": 700 }, titel));
    const blatt = findeKnoten(bm, pfad);
    const inner = gruppe(0, 6);
    const groesse = zeichneBaumIn(inner, bm, { hervorgehoben: new Set(blatt ? [blatt.id] : []), zeigePfad: geloest });
    g.append(inner);
    y += 6 + groesse.hoehe + ABSTAND_BAEUME;
    return { g, ...groesse };
  };
  const mit = baum("Mit Zurücklegen", aufgabe.baumMit);
  const ohne = baum("Ohne Zurücklegen", aufgabe.baumOhne);
  const breite = Math.max(a.breite + LUECKE - 10 + b.breite, mit.breite, ohne.breite);
  rahmen(svg, breite, y - ABSTAND_BAEUME, `Urne vor und nach dem ersten Zug (${aufgabe.nameE} gezogen), darunter die Bäume mit und ohne Zurücklegen`, vorher, mitte, nachher, mit.g, ohne.g);
}
