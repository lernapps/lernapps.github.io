/*
 * Baumdiagramm hochkant (optionen.richtung = "unten"): Wurzel oben, Zweige nach unten, alle Texte waagerecht.
 * Die Blätter stehen nebeneinander in gleich breiten Spalten; die Spalte ist so breit wie der längste Text unten
 * (Pfadwahrscheinlichkeit oder Zweigbruch), mindestens Kreis + Luft. Passt das bei zwei oder drei Stufen nicht in MAX_BREITE,
 * stehen die Pfadwahrscheinlichkeiten abwechselnd in zwei Zeilen. Beim Zeichnen werden die Spalten so verbreitert,
 * dass der Baum MAX_BREITE nutzt (alle Texte 13 px, auf dem Handy lesbar). Zwischen Geschwistergruppen (Blätter mit
 * verschiedenen Eltern) liegt eine Lücke, so groß, wie MAX_BREITE es zulässt (höchstens LUECKE_MAX).
 * Knoten sind Kreise mit Kürzel (R, B, G …); eine Legende darunter nennt die vollen Namen – die Farbe ist nie das
 * einzige Signal. Jeder Zweig endet senkrecht im Kind; sein Bruch sitzt genau dort auf der Linie (weißer Rand statt
 * Überdeckung). Fehlt ein Bruch (optionen.versteckt), steht dort „?“ und der Buchstabe auf der Mitte des Zweigs.
 * zeichneBaumUntenIn(g, baum, optionen) → { breite, hoehe }; breiteUnten(baum, optionen) rechnet nur die Breite.
 */
import { svgEl } from "../../../kern/js/svg.js";
import { formatBruch } from "../../../kern/js/bruch.js";
import { blaetter, alleKnoten } from "../modell/baum.js";
import { textFarbe } from "./rahmen.js";
import { elternKarte, faerberFuer, zweigLabel, buchstabenLabel, macheAuswaehlbar } from "./baum-gemeinsam.js";

/** Platz für das Bild bei 360 px Viewport: das Übungsbild hat 279 px („Bild dazu“ 313 px). */
export const MAX_BREITE = 279;

const R = 12; // Knotenradius: 24 px Durchmesser, tippbar
const RAND = 2;
const WURZEL_Y = 8;
const STUFE_HOEHE = 64;
const SCHRIFT_UNTEN = 13; // Blattbrüche, Pfadwahrscheinlichkeiten und Legende
const SCHRIFT_OBEN = 13;
const ZEICHEN = 0.6; // geschätzte Buchstabenbreite je px Schriftgröße (Legende)
const SPALTE_MIN = 26; // 24-px-Kreis (Tippziel) + 2 px; die Gruppen trennt die Lücke
const LUFT = 2; // zwischen zwei Texten in der Gruppe
const LUECKE_MAX = 14;
const LUECKE_MIN = 6; // sichtbarer Abstand zwischen Geschwistergruppen
const SPALTE_MAX = 90;

/** Breite eines Bruchs wie „1/36“: Ziffer 0,636, Schrägstrich 0,337 je px – so breit wie in DejaVu Sans, der breitesten
 *  der üblichen Systemschriften (Roboto, Segoe UI und San Francisco sind schmaler). */
const bruchBreite = (t, px) => [...t].reduce((s, c) => s + (c === "/" ? 0.337 : 0.636), 0) * px;

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

/**
 * Spaltenbreite, Lücke, versetzt (Pfadwahrscheinlichkeiten in zwei Zeilen) und Breite ohne Legende – ohne zu zeichnen.
 * fuellen: Spalten verbreitern, bis der Baum MAX_BREITE nutzt; ohne fuellen die kleinste Breite (für die Richtung).
 */
function masse(baum, optionen, fuellen = true) {
  const liste = blaetter(baum);
  const n = Math.max(liste.length, 1);
  const max = optionen.maxBreite ?? MAX_BREITE;
  const breiteVon = (t) => Math.ceil(bruchBreite(t, SCHRIFT_UNTEN)) + LUFT;
  const zweig = Math.max(SPALTE_MIN, ...liste.map((b) => breiteVon(zweigText(b))));
  const pfad = optionen.zeigePfad ? Math.max(...liste.map((b) => breiteVon(formatBruch(b.pfadWahrscheinlichkeit)))) : 0;
  const gruppen = new Set(liste.map((b) => b.pfad.slice(0, -1).join())).size;
  const einzeilig = Math.max(zweig, pfad);
  const passt = 2 * RAND + n * einzeilig + (gruppen - 1) * LUECKE_MIN <= max;
  const basis = passt || baum.zuege > 3 ? einzeilig : Math.max(zweig, Math.ceil(pfad / 2));
  const spalteBei = (rand) => (fuellen ? Math.max(basis, Math.min(SPALTE_MAX, Math.floor((max - 2 * rand - (gruppen - 1) * LUECKE_MAX) / n))) : basis);
  let rand = RAND;
  let spalte = spalteBei(rand);
  // Versetzte Pfadwahrscheinlichkeiten sind breiter als ihre Spalte: außen Platz, damit sie nicht aus dem Bild ragen.
  if (pfad > spalte) { rand = RAND + Math.ceil((pfad - spalte) / 2); spalte = spalteBei(rand); }
  const frei = max - 2 * rand - n * spalte;
  const luecke = gruppen > 1 ? Math.max(0, Math.min(LUECKE_MAX, Math.floor(frei / (gruppen - 1)))) : 0;
  return { spalte, luecke, rand, versetzt: pfad > spalte, breite: 2 * rand + n * spalte + (gruppen - 1) * luecke };
}

function legendeText(baum, kuerzel) {
  return baum.experiment.ergebnisse.filter((e) => kuerzel.get(e.id) !== e.name).map((e) => `${kuerzel.get(e.id)} = ${e.name}`).join(" · ");
}
const legendeBreite = (t) => (t ? 2 * RAND + Math.ceil(t.length * SCHRIFT_UNTEN * ZEICHEN) : 0);

/** Breite des hochkant gezeichneten Baums (mit Legende); baum.js entscheidet damit über die Richtung. */
export function breiteUnten(baum, optionen = {}) {
  return Math.max(masse(baum, optionen, false).breite, legendeBreite(legendeText(baum, kuerzelKarte(baum.experiment.ergebnisse))));
}

function positionen(baum, spalte, luecke, rand) {
  const pos = new Map();
  let x = rand;
  let letzte = null;
  const lege = (k, eltern) => {
    const y = WURZEL_Y + k.stufe * STUFE_HOEHE;
    if (k.kinder.length === 0 && k !== baum.wurzel) {
      if (letzte && letzte !== eltern) x += luecke;
      pos.set(k.id, { x: x + spalte / 2, y });
      x += spalte;
      letzte = eltern;
      return;
    }
    k.kinder.forEach((c) => lege(c, k));
    const xs = k.kinder.map((c) => pos.get(c.id).x);
    pos.set(k.id, { x: xs.length ? (Math.min(...xs) + Math.max(...xs)) / 2 : rand + spalte / 2, y });
  };
  lege(baum.wurzel, null);
  return pos;
}

function knotenGrafik(k, q, kuerzel) {
  const g = svgEl("g", { class: "baum-knoten", "data-knoten": k.id, transform: `translate(${q.x} ${q.y})` });
  const farbe = k.farbe || "#eceff1";
  g.append(svgEl("circle", { r: R, fill: farbe, stroke: "#455a64" }));
  g.append(svgEl("text", { x: 0, y: 4, "text-anchor": "middle", fill: textFarbe(farbe), "font-weight": 700, "font-size": 13 }, kuerzel));
  g.append(svgEl("title", {}, k.name));
  return g;
}

export function zeichneBaumUntenIn(ziel, baum, optionen = {}) {
  const knoten = alleKnoten(baum);
  const liste = blaetter(baum);
  const { spalte, luecke, rand, versetzt, breite: baumBreite } = masse(baum, optionen);
  const pos = positionen(baum, spalte, luecke, rand);
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
    ebeneLabels.append(zweigLabel(k, optionen, { x: q.x, y: q.y - R - 6, "text-anchor": "middle", "font-size": blatt ? SCHRIFT_UNTEN : SCHRIFT_OBEN }, { kurz: true }));
    const buchstabe = buchstabenLabel(k, optionen, { x: (p.x + q.x) / 2, y: mitte, "text-anchor": "middle", "font-size": SCHRIFT_OBEN });
    if (buchstabe) ebeneLabels.append(buchstabe);
  }
  faerbeAlle();

  let tiefste = WURZEL_Y + R;
  liste.forEach((b, i) => {
    const q = pos.get(b.id);
    const g = svgEl("g", { class: "baum-blatt", "data-blatt": b.id });
    const pfadY = q.y + R + SCHRIFT_UNTEN + 2 + (versetzt && i % 2 ? SCHRIFT_UNTEN + 2 : 0);
    g.append(svgEl("rect", { x: q.x - spalte / 2 + 1, y: q.y - R - 2, width: spalte - 2, height: (optionen.zeigePfad ? pfadY + 4 : q.y + R + 2) - (q.y - R - 2), rx: 6, class: "baum-treffer", fill: "transparent" }));
    if (optionen.zeigePfad) g.append(svgEl("text", { x: q.x, y: pfadY, "text-anchor": "middle", class: "pfad-w", "font-size": SCHRIFT_UNTEN, fill: "#1a1a1a" }, formatBruch(b.pfadWahrscheinlichkeit)));
    if (optionen.auswahl) macheAuswaehlbar(g, b, knoten, optionen.auswahl, faerbeAlle);
    ziel.append(g);
    tiefste = Math.max(tiefste, optionen.zeigePfad ? pfadY + 4 : q.y + R + 2);
  });

  const legende = legendeText(baum, kuerzel);
  if (legende) {
    tiefste += 18;
    ziel.append(svgEl("text", { x: RAND, y: tiefste, class: "baum-legende", "font-size": SCHRIFT_UNTEN, fill: "#1a1a1a" }, legende));
  }
  return { breite: Math.max(baumBreite, legendeBreite(legende)), hoehe: tiefste + 4 };
}
