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

/**
 * Waagerechte Balken zum Vergleich, z. B. vorher/nachher oder A/B.
 * balken: [{ label, wert, farbe? }]. Der längste Balken füllt die Breite. wert undefined = unbekannt (nur Label).
 */
export function zeichneBalken(svg, balken, { einheit = "", titel = "" } = {}) {
  leere(svg);
  const hoehe = 30;
  const abstand = 22;
  const breite = 320;
  const links = 8;
  const bekannt = (b) => typeof b.wert === "number";
  const max = Math.max(...balken.filter(bekannt).map((b) => b.wert), 1);
  const gesamtHoehe = 30 + balken.length * (hoehe + abstand);
  svg.setAttribute("viewBox", `0 0 ${breite + 16} ${gesamtHoehe}`);
  svg.setAttribute("role", "img");
  const beschriftung = (b) => (bekannt(b) ? `${b.label}: ${String(b.wert).replace(".", ",")} ${einheit}`.trim() : b.label);
  svg.setAttribute("aria-label", `${titel} ${balken.map(beschriftung).join(", ")}`);
  const kopf = svgEl("text", { x: links, y: 16, "font-size": 13, fill: "#1a1a1a", "font-weight": 600 });
  kopf.textContent = titel;
  svg.append(kopf);
  balken.forEach((b, i) => {
    const y = 28 + i * (hoehe + abstand);
    const w = bekannt(b) ? Math.max(2, (b.wert / max) * breite) : 0;
    svg.append(svgEl("rect", { x: links, y, width: breite, height: hoehe, fill: "#f3f4f6", stroke: "#d1d5db", rx: 4 }));
    svg.append(svgEl("rect", { x: links, y, width: w, height: hoehe, fill: b.farbe || "#1d4ed8", rx: 4 }));
    const label = svgEl("text", { x: links, y: y + hoehe + 15, "font-size": 12, fill: "#374151" });
    label.textContent = beschriftung(b);
    svg.append(label);
  });
}

/** Ein Prozentbalken: links 0 %, rechts 100 %, gefüllt bis `prozentsatz`. */
export function zeichneProzentbalken(svg, prozentsatz, { links = "0 %", rechts = "100 %", mitte = "" } = {}) {
  leere(svg);
  const p = Math.max(0, Math.min(100, prozentsatz));
  svg.setAttribute("viewBox", "0 0 340 70");
  svg.setAttribute("role", "img");
  svg.setAttribute("aria-label", `Prozentbalken: ${String(p).replace(".", ",")} % gefüllt`);
  svg.append(svgEl("rect", { x: 10, y: 10, width: 320, height: 30, fill: "#f3f4f6", stroke: "#9ca3af", rx: 4 }));
  svg.append(svgEl("rect", { x: 10, y: 10, width: 3.2 * p, height: 30, fill: "#1d4ed8", rx: 4 }));
  for (let i = 1; i < 10; i++) {
    svg.append(svgEl("line", { x1: 10 + 32 * i, y1: 10, x2: 10 + 32 * i, y2: 40, stroke: "#fff", "stroke-width": 1 }));
  }
  const l = svgEl("text", { x: 10, y: 60, "font-size": 12, fill: "#374151" });
  l.textContent = links;
  const r = svgEl("text", { x: 330, y: 60, "font-size": 12, fill: "#374151", "text-anchor": "end" });
  r.textContent = rechts;
  const m = svgEl("text", { x: 170, y: 60, "font-size": 12, fill: "#1d4ed8", "text-anchor": "middle", "font-weight": 600 });
  m.textContent = mitte;
  svg.append(l, r, m);
}
