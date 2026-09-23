/*
 * Bild zu Kompetenz 2: direkt – ein Streifen, aufgeteilt in P(E) und P(nicht E); einfach – die Ergebnismenge mit
 * umgedrehter Markierung (orange = nicht E); mindestens – der Baum, der eine Pfad des Gegenereignisses markiert.
 */
import { svgEl } from "../../../kern/js/svg.js";
import { formatBruch, zuDezimal } from "../../../kern/js/bruch.js";
import { ereignisPfade } from "../modell/baum.js";
import { gruppe, rahmen, BETONT } from "./rahmen.js";
import { zeichneMengeIn } from "./menge.js";
import { zeichneBaumIn } from "./baum.js";

function streifen(svg, aufgabe, geloest) {
  const breite = 320;
  const teil = Math.max(24, Math.min(breite - 24, breite * zuDezimal(aufgabe.p)));
  const g = gruppe(10, 10);
  g.append(
    svgEl("rect", { x: 0, y: 20, width: teil, height: 40, fill: "#90caf9", stroke: "#455a64" }),
    svgEl("rect", { x: teil, y: 20, width: breite - teil, height: 40, fill: "#ffe0b2", stroke: BETONT, "stroke-width": 2 }),
    svgEl("text", { x: teil / 2, y: 45, "text-anchor": "middle", "font-size": 13 }, formatBruch(aufgabe.p)),
    svgEl("text", { x: teil + (breite - teil) / 2, y: 45, "text-anchor": "middle", "font-size": 13, "font-weight": 700 }, geloest ? formatBruch(aufgabe.loesungBruch) : "?"),
    svgEl("text", { x: 0, y: 12, "font-size": 12 }, "E"),
    svgEl("text", { x: breite, y: 12, "font-size": 12, "text-anchor": "end" }, "nicht E"),
    svgEl("text", { x: breite / 2, y: 80, "font-size": 12, "text-anchor": "middle" }, "Zusammen: 1 (das ganze Rechteck)"),
  );
  rahmen(svg, breite + 20, 100, `Streifen: P(E) = ${formatBruch(aufgabe.p)}, der Rest ist P(nicht E)`, g);
}

export function zeichneGegenereignis(svg, aufgabe, ergebnis) {
  const geloest = Boolean(ergebnis && ergebnis.korrekt);
  if (aufgabe.art === "direkt") { streifen(svg, aufgabe, geloest); return; }
  const g = gruppe();
  if (aufgabe.art === "einfach") {
    const menge = { ...aufgabe.menge, elemente: aufgabe.menge.elemente.map((e) => ({ ...e, guenstig: !e.guenstig })) };
    const { breite, hoehe } = zeichneMengeIn(g, menge);
    rahmen(svg, breite, hoehe, "Orange umrandet: die Ergebnisse von „nicht E“", g);
    return;
  }
  const hervorgehoben = new Set(ereignisPfade(aufgabe.baum, aufgabe.gegen).map((k) => k.id));
  const { breite, hoehe } = zeichneBaumIn(g, aufgabe.baum, { hervorgehoben, zeigePfad: geloest });
  rahmen(svg, breite, hoehe, `Baumdiagramm; orange: der einzige Pfad des Gegenereignisses „${aufgabe.gegen.name}“`, g);
}
