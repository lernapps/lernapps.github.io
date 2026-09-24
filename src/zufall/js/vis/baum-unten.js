/*
 * Baumdiagramm hochkant (optionen.richtung = "unten"): Wurzel oben, Zweige nach unten, alle Texte waagerecht.
 * Die Blätter stehen nebeneinander in gleich breiten Spalten; die Spalte ist so breit wie der längste Text unten
 * (Pfadwahrscheinlichkeit oder Zweigbruch), mindestens Kreis + Luft. Knoten sind Kreise mit Kürzel (R, B, G …);
 * eine Legende darunter nennt die vollen Namen – die Farbe ist nie das einzige Signal.
 * Jeder Zweig endet senkrecht im Kind; sein Bruch sitzt genau dort auf der Linie (weißer Rand statt Überdeckung).
 * zeichneBaumUntenIn(g, baum, optionen) → { breite, hoehe }; optionen wie in baum.js.
 */
import { svgEl } from "../../../kern/js/svg.js";
import { formatBruch } from "../../../kern/js/bruch.js";
import { blaetter, alleKnoten } from "../modell/baum.js";
import { textFarbe } from "./rahmen.js";
import { elternKarte, faerberFuer, zweigLabel, macheAuswaehlbar } from "./baum-gemeinsam.js";

const R = 12; // Knotenradius: 24 px Durchmesser, tippbar
const RAND = 2;
const WURZEL_Y = 8;
const STUFE_HOEHE = 64;
const SCHRIFT_UNTEN = 12; // Blattbrüche und Pfadwahrscheinlichkeiten
const SCHRIFT_OBEN = 13;
const ZEICHEN = 0.6; // geschätzte Zeichenbreite je px Schriftgröße
const SPALTE_MIN = 30; // 24-px-Kreis + 6 px Luft
const LUFT = 1; // zwischen zwei Texten; die Schätzung (0,6 je px, „1/15“ = 28,8 px) liegt real bei rund 25 px

/** Kürzel je Ergebnis: kurze Namen bleiben, sonst Anfangsbuchstabe; bei gleichem Anfang zwei Buchstaben. */
export function kuerzelKarte(ergebnisse) {
  const gross = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  const erster = (n) => gross(n.charAt(0));
  const karte = new Map();
  for (const e of ergebnisse) {
    const doppelt = ergebnisse.some((x) => x !== e && x.name.length > 2 && erster(x.name) === erster(e.name));
    karte.set(e.id, e.name.length <= 2 ? e.name : gross(e.name.slice(0, doppelt ? 2 : 1)));
  }
  return karte;
}

const zweigText = (k) => `${k.anzahl}/${k.gesamt}`;

function positionen(baum, spalte) {
  const pos = new Map();
  let i = 0;
  const lege = (k) => {
    const y = WURZEL_Y + k.stufe * STUFE_HOEHE;
    if (k.kinder.length === 0 && k !== baum.wurzel) { pos.set(k.id, { x: RAND + (i + 0.5) * spalte, y }); i++; return; }
    k.kinder.forEach(lege);
    const xs = k.kinder.map((c) => pos.get(c.id).x);
    pos.set(k.id, { x: xs.length ? (Math.min(...xs) + Math.max(...xs)) / 2 : RAND + spalte / 2, y });
  };
  lege(baum.wurzel);
  return { pos, spalten: Math.max(i, 1) };
}

function knotenGrafik(k, q, kuerzel) {
  const g = svgEl("g", { class: "baum-knoten", "data-knoten": k.id, transform: `translate(${q.x} ${q.y})` });
  const farbe = k.farbe || "#eceff1";
  g.append(svgEl("circle", { r: R, fill: farbe, stroke: "#455a64" }));
  g.append(svgEl("text", { x: 0, y: 4, "text-anchor": "middle", fill: textFarbe(farbe), "font-weight": 700, "font-size": kuerzel.length > 1 ? 11 : 13 }, kuerzel));
  g.append(svgEl("title", {}, k.name));
  return g;
}

export function zeichneBaumUntenIn(ziel, baum, optionen = {}) {
  const knoten = alleKnoten(baum);
  const liste = blaetter(baum);
  const unten = liste.flatMap((b) => [zweigText(b), optionen.zeigePfad ? formatBruch(b.pfadWahrscheinlichkeit) : ""]);
  const spalte = Math.max(SPALTE_MIN, Math.ceil(Math.max(...unten.map((t) => t.length)) * SCHRIFT_UNTEN * ZEICHEN) + LUFT);
  const { pos, spalten } = positionen(baum, spalte);
  const kuerzel = kuerzelKarte(baum.experiment.ergebnisse);
  const linien = new Map();
  const eltern = elternKarte(baum);
  const faerbeAlle = faerberFuer(linien, optionen);
  const wp = pos.get(baum.wurzel.id);
  const ebeneLinien = svgEl("g", { class: "baum-ebene-linien", fill: "none" });
  const ebeneKnoten = svgEl("g", { class: "baum-ebene-knoten" });
  const ebeneLabels = svgEl("g", { class: "baum-ebene-labels", stroke: "#fff", "stroke-width": 4, "stroke-linejoin": "round", "paint-order": "stroke" });
  ziel.append(svgEl("circle", { cx: wp.x, cy: wp.y, r: 6, fill: "#455a64" }), ebeneLinien, ebeneKnoten, ebeneLabels);

  for (const k of knoten) {
    const p = pos.get(eltern.get(k.id).id);
    const q = pos.get(k.id);
    const start = p.y + (eltern.get(k.id) === baum.wurzel ? 6 : R);
    const mitte = (start + q.y - R) / 2;
    const linie = svgEl("path", { d: `M${p.x} ${start} C ${p.x} ${mitte}, ${q.x} ${mitte}, ${q.x} ${q.y - R}`, class: "baum-zweig", "data-knoten": k.id });
    linien.set(k.id, linie);
    ebeneLinien.append(linie);
    ebeneKnoten.append(knotenGrafik(k, q, kuerzel.get(k.ergebnis) ?? k.name));
    const blatt = k.kinder.length === 0;
    ebeneLabels.append(zweigLabel(k, optionen, { x: q.x, y: q.y - R - 6, "text-anchor": "middle", "font-size": blatt ? SCHRIFT_UNTEN : SCHRIFT_OBEN }));
  }
  faerbeAlle();

  let tiefste = WURZEL_Y + R;
  for (const b of liste) {
    const q = pos.get(b.id);
    const g = svgEl("g", { class: "baum-blatt", "data-blatt": b.id });
    const pfadY = q.y + R + SCHRIFT_UNTEN + 2;
    g.append(svgEl("rect", { x: q.x - spalte / 2 + 1, y: q.y - R - 2, width: spalte - 2, height: (optionen.zeigePfad ? pfadY + 4 : q.y + R + 2) - (q.y - R - 2), rx: 6, class: "baum-treffer", fill: "transparent" }));
    if (optionen.zeigePfad) g.append(svgEl("text", { x: q.x, y: pfadY, "text-anchor": "middle", class: "pfad-w", "font-size": SCHRIFT_UNTEN, fill: "#1a1a1a" }, formatBruch(b.pfadWahrscheinlichkeit)));
    if (optionen.auswahl) macheAuswaehlbar(g, b, knoten, optionen.auswahl, faerbeAlle);
    ziel.append(g);
    tiefste = Math.max(tiefste, optionen.zeigePfad ? pfadY + 4 : q.y + R + 2);
  }

  let breite = 2 * RAND + spalten * spalte;
  const legende = baum.experiment.ergebnisse.filter((e) => kuerzel.get(e.id) !== e.name).map((e) => `${kuerzel.get(e.id)} = ${e.name}`).join(" · ");
  if (legende) {
    tiefste += 18;
    ziel.append(svgEl("text", { x: RAND, y: tiefste, class: "baum-legende", "font-size": SCHRIFT_UNTEN, fill: "#1a1a1a" }, legende));
    breite = Math.max(breite, RAND + Math.ceil(legende.length * SCHRIFT_UNTEN * ZEICHEN) + RAND);
  }
  return { breite, hoehe: tiefste + 4 };
}
