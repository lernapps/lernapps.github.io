/*
 * Baumdiagramm aus modell/baum.js (Wurzel links, Blätter rechts). Bewusste Zeichenreihenfolge: erst alle Linien,
 * dann die Knoten, dann die Beschriftungen – so liegt kein Zweig über einem Bruch. Danach die Blätter (Pfad-
 * wahrscheinlichkeit, Klickfläche). zeichneBaumIn(g, baum, optionen) → { breite, hoehe }.
 * optionen: versteckt (Map knotenId → Buchstabe), geloest (versteckte Werte zeigen), hervorgehoben (Set Blatt-Ids),
 * zeigePfad (Pfadwahrscheinlichkeiten rechts), auswahl (Set Blatt-Ids; macht die Blätter anklickbar und wird beim
 * Klick verändert), richtung: "unten" (hochkant, Wurzel oben, siehe baum-unten.js), "quer" (Wurzel links) oder
 * nichts – dann hochkant, wenn der Baum so in MAX_BREITE (279 px) passt, sonst quer (ADR-024). Die Zielgruppe bekommt
 * die Klasse baum-hochkant bzw. baum-quer; zufall.css zeigt bei baum-quer auf schmalen Hochkant-Bildschirmen den
 * Dreh-Hinweis.
 * Klicks hängen nur Listener an svgEl-Knoten – beim Build ist das ein No-op.
 */
import { svgEl } from "../../../kern/js/svg.js";
import { formatBruch } from "../../../kern/js/bruch.js";
import { blaetter, alleKnoten } from "../modell/baum.js";
import { textFarbe } from "./rahmen.js";
import { zeichneBaumUntenIn, breiteUnten, MAX_BREITE } from "./baum-unten.js";
import { elternKarte, faerberFuer, zweigLabel, macheAuswaehlbar } from "./baum-gemeinsam.js";

const STUFE_BREITE = 150;
const ZEILE = 34;
const LINKS = 40;
const RECHTS = 110;

function positionen(baum) {
  const pos = new Map();
  let zeile = 0;
  const lege = (k) => {
    if (k.kinder.length === 0) { pos.set(k.id, { x: LINKS + k.stufe * STUFE_BREITE, y: 20 + zeile * ZEILE }); zeile++; return; }
    k.kinder.forEach(lege);
    const ys = k.kinder.map((c) => pos.get(c.id).y);
    pos.set(k.id, { x: LINKS + k.stufe * STUFE_BREITE, y: (Math.min(...ys) + Math.max(...ys)) / 2 });
  };
  lege(baum.wurzel);
  return { pos, hoehe: 24 + Math.max(zeile, 1) * ZEILE };
}

function knotenGrafik(k, q) {
  const g = svgEl("g", { class: "baum-knoten", transform: `translate(${q.x} ${q.y})` });
  const farbe = k.farbe || "#eceff1";
  if (k.name.length > 2) {
    g.append(svgEl("rect", { x: -34, y: -11, width: 68, height: 22, rx: 11, fill: farbe, stroke: "#455a64" }));
    g.append(svgEl("text", { x: 0, y: 4, "text-anchor": "middle", fill: textFarbe(farbe), "font-size": 12 }, k.name));
  } else {
    g.append(svgEl("circle", { r: 12, fill: farbe, stroke: "#455a64" }));
    g.append(svgEl("text", { x: 0, y: 4, "text-anchor": "middle", fill: textFarbe(farbe), "font-weight": 700, "font-size": 13 }, k.name));
  }
  return g;
}

const bez = (t, a, b, c, d) => (1 - t) ** 3 * a + 3 * (1 - t) ** 2 * t * b + 3 * (1 - t) * t ** 2 * c + t ** 3 * d;

/** Hochkant, wenn verlangt oder (ohne Vorgabe) wenn es in MAX_BREITE passt. */
const hochkant = (baum, optionen) => optionen.richtung === "unten" || (optionen.richtung !== "quer" && breiteUnten(baum, optionen) <= MAX_BREITE);

export function zeichneBaumIn(ziel, baum, optionen = {}) {
  const unten = hochkant(baum, optionen);
  ziel.classList.add(unten ? "baum-hochkant" : "baum-quer");
  if (unten) return zeichneBaumUntenIn(ziel, baum, optionen);
  const { pos, hoehe } = positionen(baum);
  const auswahl = optionen.auswahl;
  const linien = new Map();
  const wp = pos.get(baum.wurzel.id);
  const ebeneLinien = svgEl("g", { class: "baum-ebene-linien", fill: "none" });
  const ebeneKnoten = svgEl("g", { class: "baum-ebene-knoten" });
  const ebeneLabels = svgEl("g", { class: "baum-ebene-labels", "font-size": 13 });
  ziel.append(svgEl("circle", { cx: wp.x, cy: wp.y, r: 6, fill: "#455a64" }), ebeneLinien, ebeneKnoten, ebeneLabels);

  const knoten = alleKnoten(baum);
  const eltern = elternKarte(baum);
  const faerbeAlle = faerberFuer(linien, optionen);

  for (const k of knoten) {
    const p = pos.get(eltern.get(k.id).id);
    const q = pos.get(k.id);
    const x = [p.x + 8, p.x + 50, q.x - 50, q.x - 14];
    const linie = svgEl("path", { d: `M${x[0]} ${p.y} C ${x[1]} ${p.y}, ${x[2]} ${q.y}, ${x[3]} ${q.y}`, class: "baum-zweig", "data-knoten": k.id });
    linien.set(k.id, linie);
    ebeneLinien.append(linie);
    ebeneKnoten.append(knotenGrafik(k, q));
    // Beschriftung bei t = 0,7 der Kurve: dort sind Geschwisterzweige schon auseinander.
    ebeneLabels.append(zweigLabel(k, optionen, { x: bez(0.7, ...x), y: bez(0.7, p.y, p.y, q.y, q.y) - 5, "text-anchor": "middle" }));
  }
  faerbeAlle();

  for (const b of blaetter(baum)) {
    const q = pos.get(b.id);
    const g = svgEl("g", { class: "baum-blatt", "data-blatt": b.id });
    const links = b.name.length > 2 ? 38 : 16; // Rahmen um den ganzen Knoten (Pille oder Kreis)
    g.append(svgEl("rect", { x: q.x - links, y: q.y - 14, width: RECHTS - 6 + links, height: 28, rx: 6, class: "baum-treffer", fill: "transparent" }));
    if (optionen.zeigePfad) g.append(svgEl("text", { x: q.x + links + 2, y: q.y + 4, class: "pfad-w", "font-size": 13, fill: "#1a1a1a" }, `= ${formatBruch(b.pfadWahrscheinlichkeit)}`));
    if (auswahl) macheAuswaehlbar(g, b, knoten, auswahl, faerbeAlle);
    ziel.append(g);
  }
  return { breite: LINKS + baum.zuege * STUFE_BREITE + RECHTS, hoehe };
}
