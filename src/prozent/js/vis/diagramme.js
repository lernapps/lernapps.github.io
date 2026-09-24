/*
 * Diagramme des Prozent-Trainers: Hunderterfeld, Prozentbalken und Vergleichsbalken. Kein Fachwissen, nur Zeichnen.
 * svgEl aus dem Kern: dieselben Funktionen zeichnen beim Build (Mini-DOM, Bild ohne JS) und im Browser.
 */
import { svgEl } from "../../../kern/js/svg.js";

function leere(svg) {
  svg.replaceChildren();
}

/**
 * Hunderterfeld: 10 × 10 Kästchen = Grundwert = 100 %. `prozentsatz` Kästchen werden gefüllt
 * (halbe Kästchen bei einer Nachkommastelle). Werte über 100 werden bei 100 gekappt.
 */
export function zeichneRaster(svg, prozentsatz, { titel = "", untertitel = "" } = {}) {
  leere(svg);
  const p = Math.max(0, Math.min(100, prozentsatz));
  svg.setAttribute("viewBox", "0 0 260 300");
  svg.setAttribute("role", "img");
  svg.setAttribute("aria-label", `Hunderterfeld: ${p} von 100 Kästchen sind markiert. ${titel}`);
  const groesse = 24;
  const rand = 10;
  for (let i = 0; i < 100; i++) {
    const zeile = Math.floor(i / 10);
    const spalte = i % 10;
    const x = rand + spalte * groesse;
    const y = rand + zeile * groesse;
    const voll = i < Math.floor(p);
    const teil = i === Math.floor(p) ? p - Math.floor(p) : 0;
    svg.append(svgEl("rect", {
      x, y, width: groesse - 2, height: groesse - 2, rx: 2,
      fill: voll ? "#1d4ed8" : "#e5e7eb", stroke: "#9ca3af", "stroke-width": 0.5,
    }));
    if (teil > 0) {
      svg.append(svgEl("rect", { x, y, width: (groesse - 2) * teil, height: groesse - 2, rx: 2, fill: "#1d4ed8" }));
    }
  }
  const t1 = svgEl("text", { x: 130, y: 268, "text-anchor": "middle", "font-size": 14, fill: "#1a1a1a" });
  t1.textContent = titel || `${String(p).replace(".", ",")} von 100 Kästchen`;
  const t2 = svgEl("text", { x: 130, y: 288, "text-anchor": "middle", "font-size": 12, fill: "#374151" });
  t2.textContent = untertitel;
  svg.append(t1, t2);
}

// Beschriftungen der Balkenbilder: so groß wie die Bildunterschrift auf dem Handy (L-013), 0,6 · Größe je Zeichen geschätzt.
const SCHRIFT = 15;
const ZEILE = 19;
const textBreite = (text) => text.length * SCHRIFT * 0.6;

/** Bricht eine zu lange Beschriftung um: bevorzugt nach „:“, vor „–“ oder „=“, sonst am letzten passenden Leerzeichen. */
export function umbrechen(text, max) {
  if (textBreite(text) <= max) return [text];
  for (const [trenner, links] of [[": ", ":"], [" – ", ""], [" = ", ""]]) {
    const i = text.indexOf(trenner);
    if (i > 0) {
      const erste = text.slice(0, i) + links;
      const zweite = links ? text.slice(i + trenner.length) : text.slice(i + 1);
      if (textBreite(erste) <= max && textBreite(zweite) <= max) return [erste, zweite];
    }
  }
  const woerter = text.split(" ");
  let erste = woerter.shift();
  while (woerter.length && textBreite(`${erste} ${woerter[0]}`) <= max) erste += ` ${woerter.shift()}`;
  return [erste, woerter.join(" ")];
}

/**
 * Waagerechte Balken zum Vergleich, z. B. vorher/nachher oder A/B.
 * balken: [{ label, wert, farbe?, text? }]. Der längste Balken füllt die Breite. wert undefined = unbekannt (nur Label).
 * text ersetzt die Beschriftung „label: wert einheit“ ganz (etwa für Geld mit Cent). Lange Beschriftungen brechen um.
 */
export function zeichneBalken(svg, balken, { einheit = "", titel = "" } = {}) {
  leere(svg);
  const hoehe = 30;
  const breite = 320;
  const links = 8;
  const bekannt = (b) => typeof b.wert === "number";
  const max = Math.max(...balken.filter(bekannt).map((b) => b.wert), 1);
  const beschriftung = (b) => b.text ?? (bekannt(b) ? `${b.label}: ${String(b.wert).replace(".", ",")} ${einheit}`.trim() : b.label);
  svg.setAttribute("role", "img");
  svg.setAttribute("aria-label", `${titel} ${balken.map(beschriftung).join(", ")}`);
  svg.append(svgEl("text", { x: links, y: 18, "font-size": SCHRIFT, fill: "#1a1a1a", "font-weight": 600 }, titel));
  let y = 28;
  for (const b of balken) {
    const w = bekannt(b) ? Math.max(2, (b.wert / max) * breite) : 0;
    svg.append(svgEl("rect", { x: links, y, width: breite, height: hoehe, fill: "#f3f4f6", stroke: "#d1d5db", rx: 4 }));
    svg.append(svgEl("rect", { x: links, y, width: w, height: hoehe, fill: b.farbe || "#1d4ed8", rx: 4 }));
    y += hoehe;
    for (const zeile of umbrechen(beschriftung(b), breite)) {
      y += ZEILE;
      svg.append(svgEl("text", { x: links, y, "font-size": SCHRIFT, fill: "#374151" }, zeile));
    }
    y += 14;
  }
  svg.setAttribute("viewBox", `0 0 ${breite + 16} ${y}`);
}

/**
 * Ein Prozentbalken: links 0 %, rechts 100 %, gefüllt bis `prozentsatz`. `mitte` (der Teil) steht ÜBER dem Balken am
 * Ende der Füllung, links und rechts stehen darunter – so berühren sich die Beschriftungen nie (L-013).
 */
export function zeichneProzentbalken(svg, prozentsatz, { links = "0 %", rechts = "100 %", mitte = "" } = {}) {
  leere(svg);
  const p = Math.max(0, Math.min(100, prozentsatz));
  svg.setAttribute("viewBox", "0 0 340 92");
  svg.setAttribute("role", "img");
  svg.setAttribute("aria-label", `Prozentbalken: ${String(p).replace(".", ",")} % gefüllt. ${mitte}. ${links} bis ${rechts}`);
  svg.append(svgEl("rect", { x: 10, y: 28, width: 320, height: 30, fill: "#f3f4f6", stroke: "#9ca3af", rx: 4 }));
  svg.append(svgEl("rect", { x: 10, y: 28, width: 3.2 * p, height: 30, fill: "#1d4ed8", rx: 4 }));
  for (let i = 1; i < 10; i++) {
    svg.append(svgEl("line", { x1: 10 + 32 * i, y1: 28, x2: 10 + 32 * i, y2: 58, stroke: "#fff", "stroke-width": 1 }));
  }
  const halb = textBreite(mitte) / 2;
  const xMitte = Math.min(Math.max(10 + 3.2 * p, 10 + halb), 330 - halb);
  svg.append(
    svgEl("text", { x: xMitte, y: 20, "font-size": SCHRIFT, fill: "#1d4ed8", "text-anchor": "middle", "font-weight": 600 }, mitte),
    svgEl("text", { x: 10, y: 80, "font-size": SCHRIFT, fill: "#374151" }, links),
    svgEl("text", { x: 330, y: 80, "font-size": SCHRIFT, fill: "#374151", "text-anchor": "end" }, rechts),
  );
}
