/*
 * Kompetenz 1: Laplace-Formel – P(E) = günstige / mögliche Ergebnisse.
 * Modell: eine Ergebnismenge { art, elemente: [{ id, label, name, guenstig, farbe }], ereignisName }; name = Vorlesename. Reine Funktionen, kein DOM.
 * URL-Parameter (öffentlicher Vertrag, llms.txt): experiment=wuerfel|urne|gluecksrad|karten|lose|zweiwuerfel, ereignis,
 * urne, rad, lose, gewinne, schwer, Kurzform wuerfel=<Ereignis>, seed/nr.
 */
import { bruch, formatBruch } from "../../../kern/js/bruch.js";
import { FARBEN, parseUrne, elementarErgebnisse, urne, gluecksrad } from "../modell/experimente.js";
import { pruefeEinFeld, wahrscheinlichkeitsFeld, vorgabeOder, URNEN_VORLAGEN, trifft } from "./gemeinsam.js";

// Testseite: neutrales Bild – eine Vorab-Markierung würde die Antwort verraten.
export { zeichneLaplaceNeutral as zeichneBild } from "../vis/laplace.js";

export const THEMA = "laplace";
export const URL_ZAHLEN = ["lose", "gewinne", "schwer"];
export const URL_TEXTE = ["experiment", "ereignis", "urne", "rad", "wuerfel", "schwer"];

const PRIM = [2, 3, 5];

// gegen: das Gegenereignis als positiver Satzteil (frage) und als Kurzname (kurz); fehlt es, wird aus „ein…“ „kein…“.
export const LAPLACE_EREIGNISSE = {
  wuerfel: {
    gerade: { name: "eine gerade Zahl", test: (n) => n % 2 === 0, gegen: { frage: "eine ungerade Zahl", kurz: "ungerade Zahl" } },
    ungerade: { name: "eine ungerade Zahl", test: (n) => n % 2 === 1, gegen: { frage: "eine gerade Zahl", kurz: "gerade Zahl" } },
    mind5: { name: "mindestens eine 5", test: (n) => n >= 5, gegen: { frage: "höchstens eine 4", kurz: "Zahl höchstens 4" } },
    hoechstens2: { name: "höchstens eine 2", test: (n) => n <= 2, gegen: { frage: "mindestens eine 3", kurz: "Zahl mindestens 3" } },
    sechs: { name: "eine 6", test: (n) => n === 6 },
    keine6: { name: "keine 6", test: (n) => n !== 6, gegen: { frage: "eine 6", kurz: "eine 6" } },
    prim: { name: "eine Primzahl", test: (n) => PRIM.includes(n) },
    groesser3: { name: "eine Zahl größer als 3", test: (n) => n > 3, gegen: { frage: "höchstens eine 3", kurz: "Zahl höchstens 3" } },
  },
  karten: {
    herz: { name: "eine Herz-Karte", test: (k) => k.farbe === "Herz" },
    pik: { name: "eine Pik-Karte", test: (k) => k.farbe === "Pik" },
    bube: { name: "einen Buben", test: (k) => k.wert === "B", gegen: { frage: "keinen Buben", kurz: "kein Bube" } },
    ass: { name: "ein Ass", test: (k) => k.wert === "A" },
    bild: { name: "eine Bildkarte (Bube, Dame oder König)", test: (k) => "BDK".includes(k.wert) },
    rot: { name: "eine rote Karte (Herz oder Karo)", test: (k) => k.farbe === "Herz" || k.farbe === "Karo" },
  },
  zweiwuerfel: {
    pasch: { name: "einen Pasch (beide Zahlen gleich)", test: (a, b) => a === b },
    ...Object.fromEntries([4, 5, 6, 7, 8, 9, 10].map((s) => [`summe${s}`, {
      name: `die Augensumme ${s}`, test: (a, b) => a + b === s, gegen: { frage: `eine andere Augensumme als ${s}`, kurz: `andere Augensumme als ${s}` },
    }])),
  },
};

const KARTEN_FARBEN = [["Kreuz", "♣", "#212121"], ["Pik", "♠", "#212121"], ["Herz", "♥", "#c62828"], ["Karo", "♦", "#c62828"]];
const KARTEN_WERTE = ["7", "8", "9", "10", "B", "D", "K", "A"];
const WERT_NAMEN = { B: "Bube", D: "Dame", K: "König", A: "Ass" };

function mengeWuerfel(code) {
  const ev = LAPLACE_EREIGNISSE.wuerfel[code] || LAPLACE_EREIGNISSE.wuerfel.gerade;
  return {
    art: "wuerfel", kontext: "Du würfelst einmal mit einem normalen Würfel.", ereignisName: ev.name, code,
    elemente: [1, 2, 3, 4, 5, 6].map((n) => ({ id: String(n), label: String(n), name: `Würfelseite ${n}`, guenstig: ev.test(n) })),
  };
}

// "blaue Kugel 2", "rotes Feld 1"; lila bleibt ungebeugt.
function vorlesename(e, art) {
  const endung = e.name === "lila" ? "" : art === "urne" ? "e" : "es";
  return `${e.name}${endung} ${art === "urne" ? "Kugel" : "Feld"} ${e.nummer}`;
}

function mengeFarben(exp, code, art) {
  const ev = exp.ergebnisse.find((e) => e.id === code) ? code : exp.ergebnisse[0].id;
  const name = FARBEN[ev].name;
  const kontext = art === "urne"
    ? `In einer Urne liegen ${exp.ergebnisse.map((e) => `${e.anzahl} ${e.name}e`).join(", ")} Kugeln. Du ziehst blind eine Kugel.`
    : `Ein Glücksrad hat ${exp.ergebnisse.reduce((s, e) => s + e.anzahl, 0)} gleich große Felder: ${exp.ergebnisse.map((e) => `${e.anzahl} ${e.name}`).join(", ")}. Du drehst einmal.`;
  return {
    art, kontext, code: ev, spec: exp.spec,
    ereignisName: art === "urne" ? `eine ${name}e Kugel` : `ein ${name}es Feld`,
    elemente: elementarErgebnisse(exp).map((e, i) => ({ id: `${e.id}${i}`, label: e.name, name: vorlesename(e, art), farbe: e.farbe, guenstig: e.id === ev })),
  };
}

function mengeKarten(code) {
  const ev = LAPLACE_EREIGNISSE.karten[code] || LAPLACE_EREIGNISSE.karten.herz;
  const elemente = [];
  for (const [farbe, symbol, hex] of KARTEN_FARBEN) for (const wert of KARTEN_WERTE) {
    elemente.push({ id: `${farbe}${wert}`, label: `${symbol}${wert}`, name: `${farbe} ${WERT_NAMEN[wert] ?? wert}`, farbe: hex, guenstig: ev.test({ farbe, wert }) });
  }
  return { art: "karten", kontext: "Ein Skatspiel hat 32 Karten: je 8 Karten in Kreuz, Pik, Herz und Karo (7, 8, 9, 10, Bube, Dame, König, Ass). Du ziehst eine Karte.", ereignisName: ev.name, code, elemente };
}

function mengeLose(lose, gewinne) {
  const elemente = [];
  for (let i = 1; i <= lose; i++) elemente.push({ id: `l${i}`, label: String(i), name: `Los ${i}`, guenstig: i <= gewinne });
  return { art: "lose", kontext: `Beim Klassenfest gibt es ${lose} Lose, davon sind ${gewinne} Gewinne. Du kaufst ein Los.`, ereignisName: "einen Gewinn", code: "gewinn", lose, gewinne, elemente };
}

function mengeZweiWuerfel(code) {
  const ev = LAPLACE_EREIGNISSE.zweiwuerfel[code] || LAPLACE_EREIGNISSE.zweiwuerfel.summe7;
  const elemente = [];
  for (let a = 1; a <= 6; a++) for (let b = 1; b <= 6; b++) elemente.push({ id: `${a}${b}`, label: `${a}|${b}`, name: `rot ${a}, blau ${b}`, guenstig: ev.test(a, b) });
  return { art: "zweiwuerfel", kontext: "Du würfelst mit zwei Würfeln (einem roten und einem blauen). Jedes Paar ist ein eigenes Ergebnis – es gibt 36.", ereignisName: ev.name, code, elemente };
}

const ARTEN = ["wuerfel", "urne", "gluecksrad", "karten", "lose", "zweiwuerfel"];

// Baut die Ergebnismenge aus den Vorgaben; fehlende Angaben wählt der Zufall.
export function ergebnismengeAus(vorgaben, zufall) {
  const alias = vorgaben.wuerfel ? String(vorgaben.wuerfel) : "";
  let art = vorgaben.experiment || (alias ? "wuerfel" : null) || (vorgaben.urne ? "urne" : null) || (vorgaben.lose ? "lose" : null);
  if (!ARTEN.includes(art)) art = zufall.wahl(vorgaben.schwer ? ARTEN : ARTEN.slice(0, 5));
  const code = String(vorgaben.ereignis || alias || "");
  if (art === "wuerfel") return mengeWuerfel(code in LAPLACE_EREIGNISSE.wuerfel ? code : zufall.wahl(Object.keys(LAPLACE_EREIGNISSE.wuerfel)));
  if (art === "karten") return mengeKarten(code in LAPLACE_EREIGNISSE.karten ? code : zufall.wahl(Object.keys(LAPLACE_EREIGNISSE.karten)));
  if (art === "zweiwuerfel") return mengeZweiWuerfel(code in LAPLACE_EREIGNISSE.zweiwuerfel ? code : zufall.wahl(Object.keys(LAPLACE_EREIGNISSE.zweiwuerfel)));
  if (art === "lose") {
    const lose = Number(vorgabeOder(vorgaben, "lose", zufall.wahl([10, 20, 25, 50]))) || 20;
    const gewinne = Number(vorgabeOder(vorgaben, "gewinne", zufall.ganzzahl(1, Math.floor(lose / 2)))) || 1;
    return mengeLose(lose, Math.min(gewinne, lose - 1));
  }
  const roh = String(vorgaben[art === "urne" ? "urne" : "rad"] ?? "");
  const spec = parseUrne(roh) ? roh : zufall.wahl(URNEN_VORLAGEN);
  const exp = art === "urne" ? urne(spec) : gluecksrad(spec);
  const ev = code && exp.ergebnisse.some((e) => e.id === code) ? code : zufall.wahl(exp.ergebnisse).id;
  return mengeFarben(exp, ev, art);
}

export function verbFuer(art) {
  return art === "wuerfel" || art === "zweiwuerfel" ? "würfelst" : art === "gluecksrad" ? "drehst" : "ziehst";
}

export function frageText(menge) {
  return `Wie groß ist die Wahrscheinlichkeit, dass du ${menge.ereignisName} ${verbFuer(menge.art)}?`;
}

export function erzeugeAufgabe(zufall, vorgaben = {}) {
  const menge = ergebnismengeAus(vorgaben, zufall);
  const guenstig = menge.elemente.filter((e) => e.guenstig).length;
  const moeglich = menge.elemente.length;
  const p = bruch(guenstig, moeglich);
  return {
    thema: THEMA, menge, guenstig, moeglich, p, loesungBruch: p,
    text: `${menge.kontext} ${frageText(menge)}`,
    felder: [wahrscheinlichkeitsFeld("antwort", "P(E) =", p)],
    loesung: { antwort: formatBruch(p) },
    tipp: `Zähle zuerst alle möglichen Ergebnisse (hier ${moeglich}). Zähle dann, wie viele davon zum Ereignis „${menge.ereignisName}“ passen. Teile günstig durch möglich.`,
    rechenweg: [
      `Mögliche Ergebnisse: ${moeglich}`,
      `Günstige Ergebnisse (${menge.ereignisName}): ${guenstig}`,
      `P(E) = günstig / möglich = ${guenstig}/${moeglich}${p.n !== moeglich ? ` = <strong>${formatBruch(p)}</strong>` : ""}`,
    ],
  };
}

export function pruefeAntwort(aufgabe, antworten) {
  const farben = aufgabe.menge.art === "urne" ? new Set(aufgabe.menge.elemente.map((e) => e.label)).size : 0;
  return pruefeEinFeld(antworten, aufgabe.p, [{
    fehler: "farben-gezaehlt",
    passt: (teil) => farben > 1 && trifft(teil, bruch(1, farben)),
    meldung: `Du hast Farben gezählt. Jede einzelne Kugel ist ein Ergebnis: Es gibt ${aufgabe.moeglich} Kugeln, nicht ${farben} Farben.`,
  }]);
}
