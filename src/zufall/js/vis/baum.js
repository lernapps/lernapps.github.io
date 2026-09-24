/*
 * Baumdiagramm aus modell/baum.js (Wurzel links, Blätter rechts). Bewusste Zeichenreihenfolge: erst alle Linien,
 * dann die Knoten, dann die Beschriftungen – so liegt kein Zweig über einem Bruch. Danach die Blätter (Pfad-
 * wahrscheinlichkeit, Klickfläche). zeichneBaumIn(g, baum, optionen) → { breite, hoehe }.
 * optionen: versteckt (Map knotenId → Buchstabe), geloest (versteckte Werte zeigen), hervorgehoben (Set Blatt-Ids),
 * zeigePfad (Pfadwahrscheinlichkeiten rechts), auswahl (Set Blatt-Ids; macht die Blätter anklickbar und wird beim
 * Klick verändert). Klicks hängen nur Listener an svgEl-Knoten – beim Build ist das ein No-op.
 */
import { svgEl } from "../../../kern/js/svg.js";
import { formatBruch } from "../../../kern/js/bruch.js";
import { blaetter, alleKnoten } from "../modell/baum.js";
import { BETONT, textFarbe } from "./rahmen.js";

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

/** Liegt der Zweig zu knotenId auf dem Pfad zum Blatt blattId? */
const liegtAufPfad = (knotenId, blattId) => blattId === knotenId || blattId.startsWith(`${knotenId}-`);

function faerbe(linie, an) {
  linie.setAttribute("stroke", an ? BETONT : "#90a4ae");
  linie.setAttribute("stroke-width", an ? "4" : "2");
  linie.classList.toggle("hervor", an);
}

const bez = (t, a, b, c, d) => (1 - t) ** 3 * a + 3 * (1 - t) ** 2 * t * b + 3 * (1 - t) * t ** 2 * c + t ** 3 * d;

export function zeichneBaumIn(ziel, baum, optionen = {}) {
  const { pos, hoehe } = positionen(baum);
  const versteckt = optionen.versteckt || new Map();
  const auswahl = optionen.auswahl;
  const markiert = () => new Set([...(optionen.hervorgehoben || []), ...(auswahl || [])]);
  const linien = new Map();
  const wp = pos.get(baum.wurzel.id);
  const ebeneLinien = svgEl("g", { class: "baum-ebene-linien", fill: "none" });
  const ebeneKnoten = svgEl("g", { class: "baum-ebene-knoten" });
  const ebeneLabels = svgEl("g", { class: "baum-ebene-labels", "font-size": 13 });
  ziel.append(svgEl("circle", { cx: wp.x, cy: wp.y, r: 6, fill: "#455a64" }), ebeneLinien, ebeneKnoten, ebeneLabels);

  const knoten = alleKnoten(baum);
  const eltern = new Map();
  const merke = (k) => k.kinder.forEach((c) => { eltern.set(c.id, k); merke(c); });
  merke(baum.wurzel);
  const faerbeAlle = () => { const m = markiert(); for (const [id, l] of linien) faerbe(l, [...m].some((b) => liegtAufPfad(id, b))); };

  for (const k of knoten) {
    const p = pos.get(eltern.get(k.id).id);
    const q = pos.get(k.id);
    const x = [p.x + 8, p.x + 50, q.x - 50, q.x - 14];
    const linie = svgEl("path", { d: `M${x[0]} ${p.y} C ${x[1]} ${p.y}, ${x[2]} ${q.y}, ${x[3]} ${q.y}`, class: "baum-zweig", "data-knoten": k.id });
    linien.set(k.id, linie);
    ebeneLinien.append(linie);
    ebeneKnoten.append(knotenGrafik(k, q));
    // Beschriftung bei t = 0,7 der Kurve: dort sind Geschwisterzweige schon auseinander.
    const buchstabe = versteckt.get(k.id);
    const wert = `${k.anzahl}/${k.gesamt}`;
    const text = buchstabe ? `${buchstabe}) ${optionen.geloest ? wert : "?"}` : wert;
    const label = svgEl("text", { x: bez(0.7, ...x), y: bez(0.7, p.y, p.y, q.y, q.y) - 5, "text-anchor": "middle", class: `baum-label${buchstabe ? " versteckt" : ""}`, fill: buchstabe ? "#b45309" : "#1a1a1a", "font-weight": buchstabe ? 700 : undefined }, text);
    label.append(svgEl("title", {}, buchstabe && !optionen.geloest ? `Zweig ${buchstabe}: fehlt` : `P(${k.name}) = ${formatBruch(k.wahrscheinlichkeit)}`));
    ebeneLabels.append(label);
  }
  faerbeAlle();

  for (const b of blaetter(baum)) {
    const q = pos.get(b.id);
    const g = svgEl("g", { class: "baum-blatt", "data-blatt": b.id });
    const links = b.name.length > 2 ? 38 : 16; // Rahmen um den ganzen Knoten (Pille oder Kreis)
    g.append(svgEl("rect", { x: q.x - links, y: q.y - 14, width: RECHTS - 6 + links, height: 28, rx: 6, class: "baum-treffer", fill: "transparent" }));
    if (optionen.zeigePfad) g.append(svgEl("text", { x: q.x + links + 2, y: q.y + 4, class: "pfad-w", "font-size": 13, fill: "#1a1a1a" }, `= ${formatBruch(b.pfadWahrscheinlichkeit)}`));
    if (auswahl) {
      const namen = b.pfad.map((id) => knoten.find((k) => k.ergebnis === id)?.name ?? id).join("-");
      g.setAttribute("role", "button");
      g.setAttribute("tabindex", "0");
      g.setAttribute("aria-pressed", auswahl.has(b.id) ? "true" : "false");
      g.append(svgEl("title", {}, `Pfad ${namen} auswählen`));
      const umschalten = () => {
        if (auswahl.has(b.id)) auswahl.delete(b.id); else auswahl.add(b.id);
        g.setAttribute("aria-pressed", auswahl.has(b.id) ? "true" : "false");
        faerbeAlle();
      };
      g.addEventListener("click", umschalten);
      g.addEventListener("keydown", (ev) => { if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); umschalten(); } });
    }
    ziel.append(g);
  }
  return { breite: LINKS + baum.zuege * STUFE_BREITE + RECHTS, hoehe };
}
