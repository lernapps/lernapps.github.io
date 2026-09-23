/*
 * Flächenbilder für die binomischen Formeln: reines SVG, lokal gezeichnet, role="img" mit aria-label.
 * Gemeinsam für alle Bilder dieser App; die Dateien js/vis/<id>.js setzen nur Texte und Längen aus der Aufgabe ein.
 * - zeichneRaster: Rechteck aus Zeilen × Spalten (Klammer mal Klammer, 1. Formel, Rückwärts, Kopfrechnen)
 * - zeichneProdukt: zeichneRaster für zwei Klammern mit Gliedern aus terme.js
 * - zeichneQuadratMinus: Quadrat a², zwei Streifen a·b weg, b² zurück (2. Formel)
 * - zeichneUmlegen: a² − b² als Winkel, umgelegt zum Rechteck (a + b)(a − b) (3. Formel)
 */
import { multipliziere, gliedAnzeige } from "../aufgaben/terme.js";
import { svgEl } from "../../../kern/js/svg.js";

const X_LAENGE = 8; // gedachte Länge einer Variablen im Bild, damit x-Streifen breiter sind als kleine Zahlen

/** Füllfarbe und Rand je Flächenart; "a" in der App-Farbe (--farbe-primaer). */
export const FARBEN = {
  a: { fill: "#dbeafe", stroke: "#1d4ed8" },
  ab: { fill: "#fef3c7", stroke: "#b45309" },
  b: { fill: "#dcfce7", stroke: "#166534" },
  minus: { fill: "#fee2e2", stroke: "#b91c1c" },
  leer: { fill: "#ffffff", stroke: "#6b7280" },
};
const TEXT = "#1a1a1a";
const TEXT_LEISE = "#374151";

// Build (Node, Mini-DOM) und Browser (echtes DOM) zeichnen mit derselben Funktion.
export { svgEl };

/** Teilt `gesamt` Pixel im Verhältnis der Längen; kein Teil unter `min` (Anteil), damit kleine Zahlen sichtbar bleiben. */
export function teile(laengen, gesamt, min = 0.18) {
  const summe = laengen.reduce((s, l) => s + Math.abs(l), 0) || 1;
  let anteile = laengen.map((l) => Math.abs(l) / summe);
  if (anteile.length === 2) {
    const erster = Math.min(1 - min, Math.max(min, anteile[0]));
    anteile = [erster, 1 - erster];
  }
  return anteile.map((a) => a * gesamt);
}

function beschrifte(svg, x, y, text, { groesse = 14, anker = "middle", farbe = TEXT, fett = false } = {}) {
  const attrs = { x, y, "text-anchor": anker, "font-size": groesse, fill: farbe };
  if (fett) attrs["font-weight"] = 700;
  svg.append(svgEl("text", attrs, text));
}

function rechteck(svg, x, y, w, h, art, extra = {}) {
  const f = FARBEN[art] ?? FARBEN.leer;
  svg.append(svgEl("rect", { x, y, width: w, height: h, fill: f.fill, stroke: f.stroke, "stroke-width": 1.5, ...extra }));
}

function unterschriften(svg, y, titel, untertitel) {
  beschrifte(svg, 160, y, titel, { groesse: 16, fett: true });
  if (untertitel) beschrifte(svg, 160, y + 20, untertitel, { groesse: 12, farbe: TEXT_LEISE });
}

/**
 * Rechteck aus Zeilen × Spalten. spalten/zeilen: [{ text, laenge }], zellen[zeile][spalte]: { text, art }.
 * Die Längen bestimmen die Aufteilung (gerundet auf gut sichtbare Anteile), die Texte stehen außen und in den Feldern.
 */
export function zeichneRaster(svg, { spalten, zeilen, zellen, titel = "", untertitel = "", label }) {
  const x0 = 64;
  const y0 = 30;
  const breiten = teile(spalten.map((s) => s.laenge), 220);
  const hoehen = teile(zeilen.map((z) => z.laenge), 190);
  svg.replaceChildren();
  svg.setAttribute("viewBox", "0 0 320 290");
  svg.setAttribute("role", "img");
  svg.setAttribute("aria-label", label ?? `${titel}. ${untertitel}`.trim());
  let y = y0;
  zeilen.forEach((zeile, i) => {
    let x = x0;
    spalten.forEach((spalte, j) => {
      const zelle = zellen[i][j];
      rechteck(svg, x, y, breiten[j], hoehen[i], zelle.art);
      const klein = Math.min(breiten[j], hoehen[i]) < 40;
      beschrifte(svg, x + breiten[j] / 2, y + hoehen[i] / 2 + 5, zelle.text, { groesse: klein ? 11 : 15 });
      x += breiten[j];
    });
    beschrifte(svg, x0 - 8, y + hoehen[i] / 2 + 5, zeile.text, { anker: "end", fett: true });
    y += hoehen[i];
  });
  let x = x0;
  spalten.forEach((spalte, j) => {
    beschrifte(svg, x + breiten[j] / 2, y0 - 10, spalte.text, { fett: true });
    x += breiten[j];
  });
  unterschriften(svg, y0 + 190 + 32, titel, untertitel);
}

/**
 * 2. Formel: Quadrat mit Seite a; rechts und unten je ein Streifen a·b (wird abgezogen), die Ecke b² ist dabei
 * doppelt weg und kommt einmal zurück. a, b: { text, laenge }; texte: { rest, streifen, ecke }.
 */
export function zeichneQuadratMinus(svg, { a, b, texte, titel = "", untertitel = "", label }) {
  const x0 = 40;
  const y0 = 34;
  const seite = 190;
  const bw = Math.max(26, Math.min(seite * 0.45, (seite * b.laenge) / a.laenge));
  svg.replaceChildren();
  svg.setAttribute("viewBox", "0 0 320 300");
  svg.setAttribute("role", "img");
  svg.setAttribute("aria-label", label ?? `${titel}. ${untertitel}`.trim());
  rechteck(svg, x0, y0, seite - bw, seite - bw, "a");
  beschrifte(svg, x0 + (seite - bw) / 2, y0 + (seite - bw) / 2 + 5, texte.rest, { fett: true });
  rechteck(svg, x0 + seite - bw, y0, bw, seite, "minus", { "fill-opacity": 0.8 });
  rechteck(svg, x0, y0 + seite - bw, seite, bw, "minus", { "fill-opacity": 0.8 });
  rechteck(svg, x0 + seite - bw, y0 + seite - bw, bw, bw, "b", { "stroke-dasharray": "4 3" });
  beschrifte(svg, x0 + seite - bw / 2, y0 + seite - bw / 2 + 4, texte.ecke, { groesse: 11 });
  beschrifte(svg, x0 + seite + 6, y0 + (seite - bw) / 2, `− ${texte.streifen}`, { anker: "start", farbe: FARBEN.minus.stroke, fett: true });
  beschrifte(svg, x0 + (seite - bw) / 2, y0 + seite + 18, `− ${texte.streifen}`, { farbe: FARBEN.minus.stroke, fett: true });
  beschrifte(svg, x0 + seite + 6, y0 + seite - bw / 2 + 4, `+ ${texte.ecke}`, { anker: "start", farbe: FARBEN.b.stroke, fett: true });
  svg.append(svgEl("line", { x1: x0, y1: y0 - 14, x2: x0 + seite, y2: y0 - 14, stroke: TEXT_LEISE }));
  beschrifte(svg, x0 + seite / 2, y0 - 19, a.text, { fett: true });
  beschrifte(svg, x0 + seite - bw / 2, y0 - 2 + 14, b.text, { groesse: 11 });
  unterschriften(svg, y0 + seite + 46, titel, untertitel);
}

/**
 * 3. Formel: oben das Quadrat a² ohne die Ecke b² (Winkel aus zwei Teilen), unten dieselben Teile umgelegt zum
 * Rechteck (a + b) × (a − b). a, b: { text, laenge }; texte: { oben, unten, rest }.
 */
export function zeichneUmlegen(svg, { a, b, texte, titel = "", untertitel = "", label }) {
  const s = 130 / a.laenge;
  const bl = Math.max(18, Math.min(a.laenge * s * 0.45, b.laenge * s));
  const al = a.laenge * s;
  const rest = al - bl;
  svg.replaceChildren();
  svg.setAttribute("viewBox", "0 0 320 390");
  svg.setAttribute("role", "img");
  svg.setAttribute("aria-label", label ?? `${titel}. ${untertitel}`.trim());
  // oben: Quadrat a × a, Ecke b × b rechts unten fehlt
  const xo = (320 - al) / 2;
  const yo = 26;
  rechteck(svg, xo, yo, al, rest, "a");
  rechteck(svg, xo, yo + rest, rest, bl, "ab");
  rechteck(svg, xo + rest, yo + rest, bl, bl, "leer", { "stroke-dasharray": "4 3", fill: "none" });
  beschrifte(svg, xo + al + 6, yo + rest + bl / 2 + 4, texte.ecke, { anker: "start", groesse: 12, farbe: FARBEN.minus.stroke, fett: true });
  beschrifte(svg, xo + al / 2, yo - 8, a.text, { fett: true });
  beschrifte(svg, xo - 6, yo + al / 2 + 5, a.text, { anker: "end", fett: true });
  beschrifte(svg, 160, yo + al + 22, texte.oben, { groesse: 13, farbe: TEXT_LEISE });
  // unten: Rechteck (a + b) × (a − b)
  const xu = (320 - al - bl) / 2;
  const yu = yo + al + 64;
  rechteck(svg, xu, yu, al, rest, "a");
  rechteck(svg, xu + al, yu, bl, rest, "ab");
  beschrifte(svg, xu + al / 2, yu - 8, a.text, { fett: true });
  beschrifte(svg, xu + al + bl / 2, yu - 8, b.text, { fett: true });
  beschrifte(svg, xu - 6, yu + rest / 2 + 5, texte.rest, { anker: "end", fett: true });
  beschrifte(svg, 160, yu + rest + 22, texte.unten, { groesse: 13, farbe: TEXT_LEISE });
  unterschriften(svg, yu + rest + 50, titel, untertitel);
}

export const laengeVon = (g) => Math.abs(g.k) * (Object.keys(g.e).length ? X_LAENGE : 1);
const betrag = (g) => gliedAnzeige({ ...g, k: Math.abs(g.k) });

/**
 * Klammer mal Klammer als Rechteck: Zeilen = Glieder von p, Spalten = Glieder von q. Vor der Lösung stehen in den
 * Feldern die Produkte ("2x · 4"), danach die Ergebnisse ("8x"). Felder mit Minus sind rot (werden abgezogen).
 */
export function zeichneProdukt(svg, { p, q, geloest, titel, untertitel }) {
  const zellen = p.map((g, i) => q.map((h, j) => {
    const produkt = multipliziere([g], [h])[0];
    const minus = produkt.k < 0;
    const art = minus ? "minus" : i === 0 && j === 0 ? "a" : i === 1 && j === 1 ? "b" : "ab";
    return { art, text: geloest ? gliedAnzeige(produkt) : `${minus ? "−" : ""}${betrag(g)} · ${betrag(h)}` };
  }));
  zeichneRaster(svg, {
    zeilen: p.map((g) => ({ text: gliedAnzeige(g), laenge: laengeVon(g) })),
    spalten: q.map((h) => ({ text: gliedAnzeige(h), laenge: laengeVon(h) })),
    zellen,
    titel,
    untertitel,
  });
}
