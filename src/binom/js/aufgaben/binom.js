/*
 * Gemeinsame Bausteine der Formel-Kompetenzen (1., 2. und 3. binomische Formel, Rückwärts):
 * ein Binom aus URL-Vorgaben oder Zufall wählen, typische Fehlterme bauen, die Eingabe gegen Fehlterme prüfen.
 * Reine Funktionen, kein DOM. URL-Parameter (öffentlicher Vertrag, llms.txt): m, n, var = x | a, glied = zahl | variable.
 */
import { passtZuTerm, sindGleichwertig } from "../../../kern/js/termantwort.js";
import { glied, multipliziere, alsEingabe, gliedAnzeige } from "./terme.js";

export const BINOM_URL_ZAHLEN = ["m", "n"];
export const BINOM_URL_TEXTE = ["var", "glied"];
const VARIABLEN = ["x", "a"];
const ZWEITE = { x: "y", a: "b" };
const ARTEN = ["zahl", "variable"];

export const ganz = (w, max) => (Number.isInteger(w) && w >= 1 && w <= max ? w : undefined);

/**
 * Wählt ein Binom m·var ± n (glied=zahl) oder m·var ± n·zweite (glied=variable; zweite = y zu x, b zu a).
 * Kommen m oder n aus der URL, sind var=x und glied=zahl die Voreinstellung. → { m, n, variable, glied, u, v }
 */
export function waehleBinom(zufall, vorgaben = {}) {
  const ausUrl = BINOM_URL_ZAHLEN.some((k) => vorgaben[k] !== undefined);
  const art = ARTEN.includes(vorgaben.glied) ? vorgaben.glied : ausUrl ? "zahl" : zufall.wahl(["zahl", "zahl", "variable"]);
  const variable = VARIABLEN.includes(vorgaben.var) ? vorgaben.var : ausUrl ? "x" : zufall.wahl(VARIABLEN);
  const m = ganz(vorgaben.m, 5) ?? (art === "zahl" ? zufall.wahl([1, 1, 2, 3]) : zufall.ganzzahl(1, 5));
  let n = ganz(vorgaben.n, 12) ?? zufall.ganzzahl(1, art === "zahl" && m === 1 ? 9 : 5);
  if (art === "variable" && n === m && vorgaben.n === undefined) n = (n % 5) + 1;
  const u = glied(m, variable);
  const v = art === "zahl" ? glied(n) : glied(n, ZWEITE[variable]);
  return { m, n, variable, glied: art, u, v };
}

const quadrat = (g) => multipliziere([g], [g])[0];
/** "Nicht quadriert": nur die Variable quadriert, die Zahl davor bleibt (3a statt (3a)² = 9a²; 2 statt 2² = 4). */
const nurVariableQuadriert = (g) => ({ k: Math.abs(g.k), e: Object.fromEntries(Object.entries(g.e).map(([v, e]) => [v, 2 * e])) });

/**
 * Fehlterme "Koeffizient nicht quadriert" zu u² + mitte ± v²: erstes, zweites oder beide Glieder falsch quadriert.
 * vorzeichenB: Vorzeichen von v² im richtigen Ergebnis (+1, bei der 3. Formel −1). mitte darf fehlen (3. Formel).
 */
export function nichtQuadriert(u, v, mitte, vorzeichenB = 1) {
  const mit = (g, s) => ({ ...g, k: g.k * s });
  const uRichtig = quadrat(u);
  const vRichtig = mit(quadrat(v), vorzeichenB);
  const uFalsch = Math.abs(u.k) > 1 ? nurVariableQuadriert(u) : undefined;
  const vFalsch = Math.abs(v.k) > 1 ? mit(nurVariableQuadriert(v), vorzeichenB) : undefined;
  const varianten = [[uFalsch, vRichtig], [uRichtig, vFalsch], [uFalsch, vFalsch]].filter(([a, b], i) => (i === 0 ? a : i === 1 ? b : a && b));
  return varianten.map(([a, b]) => (mitte ? [a, mitte, b] : [a, b]));
}

/**
 * Prüft die (falsche) Eingabe gegen Fehlterme. regeln: [[fehlercode, [Kandidat als Text oder Polynom, …]], …] in
 * Prüfreihenfolge. Kandidaten, die dem richtigen Term gleichwertig sind, werden übersprungen. → Fehlercode oder "falsch".
 */
export function diagnose(eingabe, richtig, regeln) {
  for (const [code, kandidaten] of regeln) {
    for (const k of kandidaten) {
      const text = typeof k === "string" ? k : alsEingabe(k);
      if (!sindGleichwertig(text, richtig) && passtZuTerm(eingabe, text)) return code;
    }
  }
  return "falsch";
}

/** Quadrat eines Glieds als Rechenschritt: x², 4², (3a)², (2b)². */
export function quadratAnzeige(g) {
  const betrag = { ...g, k: Math.abs(g.k) };
  const ohneZahl = betrag.k === 1 && Object.keys(g.e).length === 1;
  const text = Object.keys(g.e).length === 0 ? String(betrag.k) : ohneZahl ? Object.keys(g.e)[0] : `(${gliedAnzeige(betrag)})`;
  return `${text}²`;
}

/** Meldung zu "koeffizient-nicht-quadriert" mit den Zahlen der Aufgabe: (3a)² = 9a², 4² = 16. */
export function meldungNichtQuadriert(u, v) {
  const teile = [u, v].filter((g) => Math.abs(g.k) > 1).map((g) => `${quadratAnzeige(g)} = ${gliedAnzeige(quadrat(g))}`);
  return `Quadriere jedes Glied ganz – die Zahl davor auch: ${teile.join(", ")}.`;
}
