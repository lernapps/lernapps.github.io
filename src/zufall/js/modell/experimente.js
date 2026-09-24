// Modelle der Zufallsversuche (reine Daten, kein DOM): Urne, Münze, Würfel, Glücksrad.
// Ein Zufallsversuch ist {typ, ergebnisse: [{id, name, anzahl}], ohneZuruecklegenMoeglich}.
// anzahl = Zahl der gleich wahrscheinlichen Elementarergebnisse hinter dem Ergebnis.

import { bruch } from "../../../kern/js/bruch.js";

export const FARBEN = {
  r: { name: "rot", hex: "#c62828" },
  b: { name: "blau", hex: "#1565c0" },
  g: { name: "gelb", hex: "#f9a825" },
  n: { name: "grün", hex: "#2e7d32" },
  s: { name: "schwarz", hex: "#212121" },
  w: { name: "weiß", hex: "#fafafa" },
  l: { name: "lila", hex: "#6a1b9a" },
};

// "3r2b1g" -> {r:3, b:2, g:1}
export function parseUrne(text) {
  const s = String(text ?? "").trim().toLowerCase();
  if (!/^(\d+[a-z])+$/.test(s)) return null;
  const inhalt = {};
  for (const [, zahl, farbe] of s.matchAll(/(\d+)([a-z])/g)) {
    if (!FARBEN[farbe]) return null;
    inhalt[farbe] = (inhalt[farbe] || 0) + Number(zahl);
  }
  return inhalt;
}

export function formatUrne(inhalt) {
  return Object.entries(inhalt).map(([f, z]) => `${z}${f}`).join("");
}

function farbErgebnisse(inhalt) {
  return Object.entries(inhalt).filter(([, z]) => z > 0)
    .map(([id, anzahl]) => ({ id, name: FARBEN[id].name, farbe: FARBEN[id].hex, anzahl }));
}

export function urne(spec) {
  const inhalt = typeof spec === "string" ? parseUrne(spec) : spec;
  if (!inhalt) return null;
  return { typ: "urne", ergebnisse: farbErgebnisse(inhalt), ohneZuruecklegenMoeglich: true, spec: formatUrne(inhalt) };
}

export function muenze() {
  return {
    typ: "muenze",
    ergebnisse: [{ id: "k", name: "Kopf", anzahl: 1 }, { id: "z", name: "Zahl", anzahl: 1 }],
    ohneZuruecklegenMoeglich: false,
  };
}

export function wuerfel() {
  return {
    typ: "wuerfel",
    ergebnisse: [1, 2, 3, 4, 5, 6].map((n) => ({ id: String(n), name: String(n), anzahl: 1 })),
    ohneZuruecklegenMoeglich: false,
  };
}

// Würfel, bei dem nur "6" oder "keine 6" zählt – der Klassiker im Baumdiagramm.
export function wuerfelSechs() {
  return {
    typ: "wuerfelSechs",
    ergebnisse: [{ id: "s", name: "6", anzahl: 1 }, { id: "k", name: "keine 6", anzahl: 5 }],
    ohneZuruecklegenMoeglich: false,
  };
}

export function gluecksrad(spec) {
  const inhalt = typeof spec === "string" ? parseUrne(spec) : spec;
  if (!inhalt) return null;
  return { typ: "gluecksrad", ergebnisse: farbErgebnisse(inhalt), ohneZuruecklegenMoeglich: false, spec: formatUrne(inhalt) };
}

// Baut einen Zufallsversuch aus den Vorgaben (URL-Parameter): experiment=urne|muenze|wuerfel|gluecksrad,
// Kurzformen urne=3r2b1g, muenze=<Züge>, wuerfel=<Züge>. null, wenn nichts passt.
export function experimentAusVorgaben(vorgaben = {}) {
  const v = vorgaben;
  const art = v.experiment || (v.urne ? "urne" : v.muenze ? "muenze" : v.wuerfel ? "wuerfel" : null);
  if (art === "urne") return urne(String(v.urne || "3r2b1g"));
  if (art === "muenze") return muenze();
  if (art === "wuerfel") return wuerfelSechs();
  if (art === "gluecksrad") return gluecksrad(String(v.rad || v.urne || "2r1b1g"));
  return null;
}

export function gesamtAnzahl(exp) {
  return exp.ergebnisse.reduce((s, e) => s + e.anzahl, 0);
}

export function ergebnis(exp, id) {
  return exp.ergebnisse.find((e) => e.id === id) || null;
}

export function ergebnisName(exp, id) {
  const e = ergebnis(exp, id);
  return e ? e.name : id;
}

export function wahrscheinlichkeit(exp, id) {
  const e = ergebnis(exp, id);
  return bruch(e ? e.anzahl : 0, gesamtAnzahl(exp));
}

// Ein Elementarergebnis je Kugel/Seite/Sektor – für die Laplace-Darstellung.
export function elementarErgebnisse(exp) {
  const liste = [];
  for (const e of exp.ergebnisse) for (let i = 0; i < e.anzahl; i++) liste.push({ ...e, nummer: i + 1 });
  return liste;
}

/**
 * Vereinfachter Versuch mit zwei Ergebnissen: das Ergebnis `id` und „nicht …“ (alle übrigen zusammen), z. B. „gelb /
 * nicht gelb“. Für „mindestens einmal“ reicht diese Unterscheidung; der Baum hat zwei Zweige je Stufe (L-040).
 * Ohne Zurücklegen stimmt die Rechnung weiter: Jede gezogene „nicht gelb“-Kugel verringert den Rest um 1.
 */
export function nurErgebnisUndRest(exp, id) {
  const e = ergebnis(exp, id);
  const rest = gesamtAnzahl(exp) - (e ? e.anzahl : 0);
  if (!e || exp.ergebnisse.length <= 2 || rest === 0) return exp;
  return { ...exp, ergebnisse: [{ ...e }, { id: "x", name: `nicht ${e.name}`, farbe: "#cfd8dc", anzahl: rest }] };
}

// Ziehen ohne Zurücklegen: neuer Versuch mit einem Ergebnis weniger.
export function entferne(exp, id) {
  if (!exp.ohneZuruecklegenMoeglich) return null;
  const e = ergebnis(exp, id);
  if (!e || e.anzahl === 0) return null;
  const ergebnisse = exp.ergebnisse
    .map((x) => (x.id === id ? { ...x, anzahl: x.anzahl - 1 } : { ...x }))
    .filter((x) => x.anzahl > 0);
  return { ...exp, ergebnisse };
}

/**
 * Inhalt einer Urne als Aufzählung: „3 rote, 2 blaue und 1 gelbe Kugel“. Das Nomen richtet sich nach der letzten
 * Zahl; bei zwei Farben mit Einzahl und Mehrzahl steht es zweimal („4 rote Kugeln und 1 blaue Kugel“). lila bleibt ungebeugt.
 */
export function kugelListe(ergebnisse) {
  const adjektiv = (e) => `${e.anzahl} ${e.name}${e.name === "lila" ? "" : "e"}`;
  const nomen = (e) => (e.anzahl === 1 ? "Kugel" : "Kugeln");
  const liste = ergebnisse.filter((e) => e.anzahl > 0);
  const letzte = liste[liste.length - 1];
  if (liste.length === 2 && (liste[0].anzahl === 1) !== (letzte.anzahl === 1)) return liste.map((e) => `${adjektiv(e)} ${nomen(e)}`).join(" und ");
  const vorne = liste.slice(0, -1).map(adjektiv).join(", ");
  return `${vorne ? `${vorne} und ` : ""}${adjektiv(letzte)} ${nomen(letzte)}`;
}

export function beschreibung(exp) {
  if (exp.typ === "urne" || exp.typ === "gluecksrad") {
    const teile = exp.ergebnisse.map((e) => `${e.anzahl} ${e.name}${e.anzahl === 1 ? "e" : "e"}`);
    const objekt = exp.typ === "urne" ? "Kugeln" : "gleich große Felder";
    return `${exp.typ === "urne" ? "Eine Urne" : "Ein Glücksrad"} mit ${gesamtAnzahl(exp)} ${objekt}: ${teile.join(", ")}`;
  }
  if (exp.typ === "muenze") return "Eine faire Münze (Kopf oder Zahl)";
  if (exp.typ === "wuerfelSechs") return "Ein Würfel – es zählt nur: 6 oder keine 6";
  return "Ein Würfel mit den Zahlen 1 bis 6";
}
