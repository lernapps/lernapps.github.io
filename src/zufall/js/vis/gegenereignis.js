/*
 * Bild zu Kompetenz 2: direkt – ein Streifen, aufgeteilt in P(E) und P(nicht E); einfach – die Ergebnismenge mit
 * umgedrehter Markierung (orange = nicht E); mindestens – der Baum, der eine Pfad des Gegenereignisses markiert.
 * Übung (zeichneGegenereignisMarkierbar): bei "einfach" markiert das Kind E selbst, wie auf der Laplace-Seite.
 * Testseite (zeichneGegenereignisTest): bei "einfach" neutral.
 */
import { svgEl } from "../../../kern/js/svg.js";
import { formatBruch, zuDezimal } from "../../../kern/js/bruch.js";
import { ereignisPfade } from "../modell/baum.js";
import { gruppe, rahmen, BETONT } from "./rahmen.js";
import { zeichneMengeIn, MENGEN_TITEL, platzFuer } from "./menge.js";
import { zeichneMengeMarkierbar } from "./laplace.js";
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

export function zeichneGegenereignisMarkierbar(svg, aufgabe, ergebnis, status = () => {}) {
  if (aufgabe.art !== "einfach") { zeichneGegenereignis(svg, aufgabe, ergebnis); return; }
  const n = aufgabe.menge.elemente.length;
  const e = aufgabe.menge.elemente.filter((x) => x.guenstig).length;
  if (!ergebnis?.korrekt) {
    zeichneMengeMarkierbar(svg, aufgabe, status, `klick die Ergebnisse von E an: ${aufgabe.menge.ereignisName}`);
    return;
  }
  const g = gruppe();
  const { breite, hoehe } = zeichneMengeIn(g, aufgabe.menge, { maxBreite: platzFuer(svg) });
  rahmen(svg, breite, hoehe, `Orange umrandet: die Ergebnisse von E; die übrigen gehören zu „nicht E“`, g);
  status(`Lösung: E hat ${e} von ${n} Ergebnissen, „nicht E“ die übrigen ${n - e}`);
}

export function zeichneGegenereignisTest(svg, aufgabe, ergebnis) {
  if (aufgabe.art !== "einfach") { zeichneGegenereignis(svg, aufgabe, ergebnis); return; }
  const g = gruppe();
  const { breite, hoehe } = zeichneMengeIn(g, aufgabe.menge, { neutral: true, maxBreite: platzFuer(svg) });
  rahmen(svg, breite, hoehe, MENGEN_TITEL[aufgabe.menge.art], g);
}
