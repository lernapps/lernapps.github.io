/*
 * Bild zu Kompetenz 5: oben die Urne vor dem ersten Zug, die gezogene Kugel und die Urne danach; darunter die Bäume
 * mit und ohne Zurücklegen UNTEREINANDER (nebeneinander passt es auf kein Handy), der gefragte Pfad jeweils orange.
 * Die Bäume stehen hochkant (Wurzel oben): so passt das ganze Bild ohne Scrollen in 330 px.
 */
import { svgEl } from "../../../kern/js/svg.js";
import { gesamtAnzahl } from "../modell/experimente.js";
import { findeKnoten } from "../modell/baum.js";
import { gruppe, rahmen, kugel } from "./rahmen.js";
import { zeichneUrneIn } from "./urne.js";
import { zeichneBaumIn } from "./baum.js";

const LUECKE = 48; // Platz zwischen den Urnen für die gezogene Kugel
const RAND_URNE = 10; // zeichneUrneIn lässt rechts 10 px frei; die Kugel sitzt mittig zwischen den Wänden
const KOPF = 30; // zwei Zeilen Beschriftung über jeder Urne
const ABSTAND_BAEUME = 20;

function gezogeneKugel(x, y, aufgabe) {
  const g = gruppe(x, y, { class: "gezogen" });
  const e = aufgabe.experiment.ergebnisse.find((k) => k.id === aufgabe.erster) || { farbe: "#999" };
  const mitte = (LUECKE + RAND_URNE) / 2;
  g.append(svgEl("path", { d: `M4 0 L${LUECKE + RAND_URNE - 4} 0`, stroke: "#455a64", "stroke-width": 2 }));
  g.append(kugel(mitte, 0, 13, e.farbe, { betont: true }));
  g.append(svgEl("text", { x: mitte, y: 32, "text-anchor": "middle", "font-size": 12, fill: "#1a1a1a" }, "gezogen"));
  return g;
}

/** Zweizeilige Beschriftung über einer Urne („Vorher:“ / „6 Kugeln“) – einzeilig wäre sie breiter als die Urne. */
function kopf(x, wann, exp) {
  const g = gruppe(x + 10, 0, { class: "kopfzeile", "font-size": 12, fill: "#1a1a1a" });
  g.append(svgEl("text", { x: 0, y: 12, "font-weight": 600 }, wann), svgEl("text", { x: 0, y: 26 }, `${gesamtAnzahl(exp)} Kugeln`));
  return g;
}

export function zeichneOhneZuruecklegen(svg, aufgabe, ergebnis) {
  const geloest = Boolean(ergebnis && ergebnis.korrekt);
  const vorher = gruppe(0, KOPF, { class: "urne-vorher" });
  const a = zeichneUrneIn(vorher, aufgabe.experiment);
  const mitte = gezogeneKugel(a.breite - RAND_URNE, KOPF + 28, aufgabe);
  const xNachher = a.breite + LUECKE - RAND_URNE;
  const nachher = gruppe(xNachher, KOPF, { class: "urne-nachher" });
  const b = zeichneUrneIn(nachher, aufgabe.urneDanach);
  const koepfe = [kopf(0, "Vorher:", aufgabe.experiment), kopf(xNachher, "Nachher:", aufgabe.urneDanach)];
  const pfad = [aufgabe.erster, aufgabe.zweiter];
  let y = KOPF + Math.max(a.hoehe, b.hoehe) + 24;
  const baum = (titel, bm) => {
    const g = gruppe(0, y, { class: "baum" });
    g.append(svgEl("text", { x: 10, y: 0, "font-size": 13, "font-weight": 700 }, titel));
    const blatt = findeKnoten(bm, pfad);
    const inner = gruppe(0, 6);
    const groesse = zeichneBaumIn(inner, bm, { hervorgehoben: new Set(blatt ? [blatt.id] : []), zeigePfad: geloest, richtung: "unten" });
    g.append(inner);
    y += 6 + groesse.hoehe + ABSTAND_BAEUME;
    return { g, ...groesse };
  };
  const mit = baum("Mit Zurücklegen", aufgabe.baumMit);
  const ohne = baum("Ohne Zurücklegen", aufgabe.baumOhne);
  const breite = Math.max(xNachher + b.breite, mit.breite, ohne.breite);
  rahmen(svg, breite, y - ABSTAND_BAEUME, `Urne vor und nach dem ersten Zug (${aufgabe.nameE} gezogen), darunter die Bäume mit und ohne Zurücklegen`, ...koepfe, vorher, mitte, nachher, mit.g, ohne.g);
}
