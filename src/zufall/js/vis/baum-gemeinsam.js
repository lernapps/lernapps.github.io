/*
 * Gemeinsame Teile beider Baum-Layouts (waagerecht in baum.js, hochkant in baum-unten.js): Pfad-Test, Zweigfarbe,
 * Elternkarte, Zweigbeschriftung und anklickbare Blätter. Nur svgEl – kein document.
 */
import { svgEl } from "../../../kern/js/svg.js";
import { formatBruch } from "../../../kern/js/bruch.js";
import { BETONT } from "./rahmen.js";

/** Liegt der Zweig zu knotenId auf dem Pfad zum Blatt blattId? */
export const liegtAufPfad = (knotenId, blattId) => blattId === knotenId || blattId.startsWith(`${knotenId}-`);

export function faerbe(linie, an) {
  linie.setAttribute("stroke", an ? BETONT : "#90a4ae");
  linie.setAttribute("stroke-width", an ? "4" : "2");
  linie.classList.toggle("hervor", an);
}

/** Map knotenId → Elternknoten. */
export function elternKarte(baum) {
  const eltern = new Map();
  const merke = (k) => k.kinder.forEach((c) => { eltern.set(c.id, k); merke(c); });
  merke(baum.wurzel);
  return eltern;
}

/** Färbt alle Zweige nach den markierten Blättern (hervorgehoben ∪ auswahl); gibt die Funktion zurück. */
export function faerberFuer(linien, optionen) {
  const markiert = () => new Set([...(optionen.hervorgehoben || []), ...(optionen.auswahl || [])]);
  return () => { const m = markiert(); for (const [id, l] of linien) faerbe(l, [...m].some((b) => liegtAufPfad(id, b))); };
}

/**
 * Beschriftung eines Zweigs als <text> mit <title>; attrs setzen Lage und Schrift. Fehlende Zweige (optionen.versteckt)
 * heißen „a) ?“, gelöst „a) 3/5“; mit kurz: true nur „?“ bzw. „3/5“ – der Buchstabe steht dann als buchstabenLabel.
 */
export function zweigLabel(k, optionen, attrs, { kurz = false } = {}) {
  const buchstabe = (optionen.versteckt || new Map()).get(k.id);
  const wert = `${k.anzahl}/${k.gesamt}`;
  const inhalt = optionen.geloest ? wert : "?";
  const text = buchstabe ? (kurz ? inhalt : `${buchstabe}) ${inhalt}`) : wert;
  const label = svgEl("text", { ...attrs, class: `baum-label${buchstabe ? " versteckt" : ""}`, fill: buchstabe ? "#b45309" : "#1a1a1a", "font-weight": buchstabe ? 700 : undefined }, text);
  label.append(svgEl("title", {}, buchstabe && !optionen.geloest ? `Zweig ${buchstabe}: fehlt` : `P(${k.name}) = ${formatBruch(k.wahrscheinlichkeit)}`));
  return label;
}

/** Buchstabe eines fehlenden Zweigs (fett, orange-braun) oder null, wenn der Zweig nicht fehlt. */
export function buchstabenLabel(k, optionen, attrs) {
  const buchstabe = (optionen.versteckt || new Map()).get(k.id);
  if (!buchstabe) return null;
  const label = svgEl("text", { ...attrs, class: "baum-buchstabe", fill: "#b45309", "font-weight": 700 }, buchstabe);
  label.append(svgEl("title", {}, `Zweig ${buchstabe}`));
  return label;
}

/** Macht die Blatt-Gruppe g zum Umschalter in optionen.auswahl (Klick und Tastatur). */
export function macheAuswaehlbar(g, b, knoten, auswahl, faerbeAlle) {
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
