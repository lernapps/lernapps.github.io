/*
 * Terme mit Variablen lesen: Tokenizer und Parser (rekursiver Abstieg, kein eval) → Syntaxbaum, Auswerten an einer
 * Belegung, schön gesetzter Text. Reine Funktionen, kein DOM. Generisch – nicht pro App ändern.
 * Prüfen, Formprüfung und Vorschau stehen in termantwort.js.
 * - Variablen: Einzelbuchstaben a–z (klein). "pi"/"π" ist immer die Kreiszahl, "sqrt"/"wurzel"/"√" die Wurzel;
 *   Wörter werden gierig gelesen ("api" = a·π). p·i schreibt man "p*i", "p·i" oder "p i".
 * - Implizite Multiplikation (2x, 3ab, 2(x+1), (a+b)(a−b), x(x+1)) bindet wie "*" und "/", von links:
 *   1/2x = (1/2)·x, x/2y = (x/2)·y. Eine Zahl direkt hinter einem Faktor (x2) ist ein Fehler.
 * - Potenzen mit ^ (ganze Hochzahl 0–64, auch ^(3)) oder Hochzahlen ⁰–⁹; Vorzeichen binden schwächer: −x² = −(x²).
 *   (Anders als bruch.js, wo −2^2 = 4 gilt; beide Parser sind getrennt, bruch.js bleibt unverändert.)
 * - Malzeichen * · × ⋅, Geteilt / :, Minus - − –, Dezimalkomma oder -punkt.
 * Grammatik: ausdruck = term (('+'|'-') term)*
 *            term     = faktor (('*'|'/') faktor | faktor-ohne-Vorzeichen)*
 *            faktor   = ('-'|'+') faktor | basis hochzahl*
 *            basis    = zahl | variable | pi | '(' ausdruck ')' | ('sqrt'|'wurzel') '(' ausdruck ')' | '√' basis
 * Knoten: { art: "zahl", wert, text } | { art: "variable", name } | { art: "pi" } | { art: "klammer", arg }
 *   | { art: "negativ", arg } | { art: "plus" | "minus" | "mal" | "geteilt", links, rechts } | { art: "potenz", basis, exponent }
 *   | { art: "wurzel", arg }
 */

/**
 * Knoten des Syntaxbaums (siehe oben). Die Kindfelder der anderen Arten sind optional mitgetypt, damit Durchläufe über
 * alle Kinder ([k.arg, k.links, k.rechts, k.basis]) ohne switch gehen.
 * @typedef {{ arg?: Knoten, links?: Knoten, rechts?: Knoten, basis?: Knoten, name?: string }} Kinder
 * @typedef {Kinder & (
 *   { art: "zahl", wert: number, text: string }
 *   | { art: "variable", name: string }
 *   | { art: "pi" }
 *   | { art: "klammer" | "negativ" | "wurzel", arg: Knoten }
 *   | { art: "plus" | "minus" | "mal" | "geteilt", links: Knoten, rechts: Knoten }
 *   | { art: "potenz", basis: Knoten, exponent: number })} Knoten
 * @typedef {{ text?: string, name?: string, wert?: number }} Tokenfelder
 * @typedef {Tokenfelder & ({ typ: "zahl" | "wurzel" | "op", text: string } | { typ: "pi" }
 *   | { typ: "variable", name: string } | { typ: "hoch", wert: number })} Token
 * @typedef {"zeichen" | "grossbuchstabe" | "klammer-fehlt" | "klammer-zu-viel" | "unvollstaendig" | "zahl-dahinter"
 *   | "exponent" | "wurzel-klammer"} Syntaxcode
 * @typedef {{ baum: Knoten, variablen: string[], text: string, fehler?: undefined, meldung?: undefined }
 *   | { fehler: "leer" | Syntaxcode, meldung: string, baum?: undefined, variablen?: undefined, text?: undefined }} GelesenerTerm
 */

const MAX_EXPONENT = 64;
// Auch als Tabelle Ziffer → Hochzahl gelesen (HOCHZAHLEN["2"] = "²").
const HOCHZAHLEN = /** @type {string & Record<string, string>} */ ("⁰¹²³⁴⁵⁶⁷⁸⁹");
/** @type {Record<string, string>} */
const ERSATZ = { "−": "-", "–": "-", "·": "*", "×": "*", "⋅": "*", ":": "/" };
const TOKEN = /\s*(?:(\d+(?:[.,]\d+)?)|(sqrt|wurzel|√)|(pi|π)|([a-z])|([-+*/^()])|([⁰¹²³⁴⁵⁶⁷⁸⁹]+)|(\S))/iy;

export const SYNTAX_MELDUNGEN = Object.freeze({
  grossbuchstabe: "Schreib Variablen als kleine Buchstaben, z. B. x.",
  "klammer-fehlt": "Es fehlt eine schließende Klammer ).",
  "klammer-zu-viel": "Da ist eine Klammer ) zu viel.",
  unvollstaendig: "Der Term ist noch unvollständig.",
  "zahl-dahinter": "Schreib Potenzen mit ^ oder ², z. B. x^2, und Produkte mit *, z. B. x*2.",
  exponent: "Hochzahlen sind ganze Zahlen von 0 bis 64, z. B. x^2.",
  "wurzel-klammer": "Nach sqrt gehört eine Klammer, z. B. sqrt(2).",
});

class SyntaxFehler extends Error {
  /** @param {Syntaxcode} code @param {string} [zeichen] */
  constructor(code, zeichen) {
    super(code);
    this.code = code;
    /** @type {string} */
    this.meldung = code === "zeichen" ? `Das Zeichen „${zeichen}“ kenne ich hier nicht.` : SYNTAX_MELDUNGEN[/** @type {Exclude<Syntaxcode, "zeichen">} */ (code)];
  }
}

/** @param {unknown} text @returns {Token[]} */
function tokenisiere(text) {
  const s = String(text ?? "").replace(/[−–·×⋅:]/g, (z) => ERSATZ[z]).trim();
  /** @type {Token[]} */
  const tokens = [];
  let pos = 0;
  while (pos < s.length) {
    TOKEN.lastIndex = pos;
    const m = TOKEN.exec(s);
    if (!m) break; // nur noch Leerraum
    pos = TOKEN.lastIndex;
    if (m[1]) tokens.push({ typ: "zahl", text: m[1] });
    else if (m[2]) tokens.push({ typ: "wurzel", text: m[2] });
    else if (m[3]) tokens.push({ typ: "pi" });
    else if (m[4]) {
      if (m[4] !== m[4].toLowerCase()) throw new SyntaxFehler("grossbuchstabe");
      tokens.push({ typ: "variable", name: m[4] });
    } else if (m[5]) tokens.push({ typ: "op", text: m[5] });
    else if (m[6]) tokens.push({ typ: "hoch", wert: Number([...m[6]].map((z) => HOCHZAHLEN.indexOf(z)).join("")) });
    else throw new SyntaxFehler("zeichen", m[7]);
  }
  return tokens;
}

/** @param {Token[]} tokens @returns {Knoten} */
function parse(tokens) {
  let i = 0;
  const jetzt = () => tokens[i];
  /** @param {string} text */
  const istOp = (text) => jetzt()?.typ === "op" && jetzt().text === text;
  /** @param {Token | undefined} t */
  const beginntFaktor = (t) => t && (t.typ === "variable" || t.typ === "pi" || t.typ === "wurzel" || (t.typ === "op" && t.text === "("));

  /** @returns {Knoten} */
  function klammer() {
    i++; // "("
    const arg = ausdruck();
    if (!istOp(")")) throw new SyntaxFehler(jetzt() ? "unvollstaendig" : "klammer-fehlt");
    i++;
    return { art: "klammer", arg };
  }
  /** @returns {Knoten} */
  function basis() {
    const t = jetzt();
    if (!t) throw new SyntaxFehler("unvollstaendig");
    if (t.typ === "zahl") { i++; return { art: "zahl", wert: Number(t.text.replace(",", ".")), text: t.text }; }
    if (t.typ === "variable") { i++; return { art: "variable", name: t.name }; }
    if (t.typ === "pi") { i++; return { art: "pi" }; }
    if (t.typ === "wurzel") {
      i++;
      if (t.text === "√") return { art: "wurzel", arg: basis() };
      if (!istOp("(")) throw new SyntaxFehler("wurzel-klammer");
      return { art: "wurzel", arg: klammer() };
    }
    if (istOp("(")) return klammer();
    throw new SyntaxFehler("unvollstaendig");
  }
  /** @returns {number} */
  function exponent() {
    if (jetzt()?.typ === "hoch") return /** @type {number} */ (tokens[i++].wert);
    i++; // "^"
    const inKlammer = istOp("(");
    if (inKlammer) i++;
    const t = jetzt();
    if (!t || t.typ !== "zahl" || !/^\d+$/.test(t.text)) throw new SyntaxFehler("exponent");
    i++;
    if (inKlammer) {
      if (!istOp(")")) throw new SyntaxFehler("exponent");
      i++;
    }
    return Number(t.text);
  }
  /** @returns {Knoten} */
  function faktor() {
    if (istOp("-")) { i++; return { art: "negativ", arg: faktor() }; }
    if (istOp("+")) { i++; return faktor(); }
    let b = basis();
    while (jetzt()?.typ === "hoch" || istOp("^")) {
      const e = exponent();
      if (e > MAX_EXPONENT) throw new SyntaxFehler("exponent");
      b = { art: "potenz", basis: b, exponent: e };
    }
    return b;
  }
  /** @returns {Knoten} */
  function term() {
    let a = faktor();
    for (;;) {
      if (istOp("*") || istOp("/")) {
        const art = jetzt().text === "*" ? "mal" : "geteilt";
        i++;
        a = { art, links: a, rechts: faktor() };
      } else if (beginntFaktor(jetzt())) a = { art: "mal", links: a, rechts: faktor() };
      else if (jetzt()?.typ === "zahl") throw new SyntaxFehler("zahl-dahinter");
      else return a;
    }
  }
  /** @returns {Knoten} */
  function ausdruck() {
    let a = term();
    while (istOp("+") || istOp("-")) {
      const art = jetzt().text === "+" ? "plus" : "minus";
      i++;
      a = { art, links: a, rechts: term() };
    }
    return a;
  }
  const baum = ausdruck();
  if (i < tokens.length) throw new SyntaxFehler(istOp(")") ? "klammer-zu-viel" : "unvollstaendig");
  return baum;
}

/** @param {Knoten} k @param {Set<string>} [menge] @returns {Set<string>} */
function sammleVariablen(k, menge = new Set()) {
  if (k.art === "variable") menge.add(k.name);
  for (const kind of [k.arg, k.links, k.rechts, k.basis]) if (kind) sammleVariablen(kind, menge);
  return menge;
}

/**
 * Liest einen Term. → { baum, variablen: ["a", "b", …] (sortiert), text: schön gesetzt }
 * oder { fehler: "leer" | "zeichen" | "grossbuchstabe" | "klammer-fehlt" | "klammer-zu-viel" | "unvollstaendig"
 *        | "zahl-dahinter" | "exponent" | "wurzel-klammer", meldung }.
 * @param {unknown} text @returns {GelesenerTerm}
 */
export function leseVariablenterm(text) {
  try {
    const tokens = tokenisiere(text);
    if (tokens.length === 0) return { fehler: "leer", meldung: "" };
    const baum = parse(tokens);
    return { baum, variablen: [...sammleVariablen(baum)].sort(), text: formatTerm(baum) };
  } catch (e) {
    if (e instanceof SyntaxFehler) return { fehler: e.code, meldung: e.meldung };
    throw e;
  }
}

/** Wert des Baums für eine Belegung { x: 2, … }; NaN oder ±Infinity, wo der Term nicht definiert ist.
 * @param {Knoten} k @param {Record<string, number>} [belegung] @returns {number} */
export function auswerten(k, belegung = {}) {
  /** @param {Knoten} kind */
  const w = (kind) => auswerten(kind, belegung);
  switch (k.art) {
    case "zahl": return k.wert;
    case "variable": return belegung[k.name] ?? NaN;
    case "pi": return Math.PI;
    case "klammer": return w(k.arg);
    case "negativ": return -w(k.arg);
    case "plus": return w(k.links) + w(k.rechts);
    case "minus": return w(k.links) - w(k.rechts);
    case "mal": return w(k.links) * w(k.rechts);
    case "geteilt": return w(k.links) / w(k.rechts);
    case "potenz": return w(k.basis) ** k.exponent;
    case "wurzel": return Math.sqrt(w(k.arg));
    default: return NaN;
  }
}

/** @param {number} n */
const hoch = (n) => [...String(n)].map((d) => HOCHZAHLEN[d]).join("");
const ATOMAR = new Set(["zahl", "variable", "pi", "klammer"]);
/** @param {Knoten} k */
const mitVorzeichenInKlammer = (k) => (k.art === "negativ" ? `(${formatTerm(k)})` : formatTerm(k));

// Produkt ohne Malpunkt, wo das eindeutig ist (3x, ab, 2(x + 1)); sonst "·" (x·3, √2·x, p·i statt "pi").
/** @param {Knoten & { links: Knoten, rechts: Knoten }} k Produkt ("mal") */
function setzeProdukt(k) {
  const links = k.links.art === "geteilt" ? `(${formatTerm(k.links)})` : formatTerm(k.links);
  const rechts = mitVorzeichenInKlammer(k.rechts);
  const offeneWurzel = k.links.art === "wurzel" && k.links.arg.art !== "klammer";
  const wiePi = /p$/.test(links) && /^i/.test(rechts);
  const ohnePunkt = /^[a-zπ√(]/.test(rechts) && !rechts.startsWith("(−") && !offeneWurzel && !wiePi;
  return ohnePunkt ? `${links}${rechts}` : `${links}·${rechts}`;
}

/** Setzt einen Baum schön: x^2 → x², 3*x → 3x, - → −, Dezimalpunkt → Komma. Klammern der Eingabe bleiben stehen.
 * @param {Knoten} k @returns {string} */
export function formatTerm(k) {
  switch (k.art) {
    case "zahl": return k.text.replace(".", ",");
    case "variable": return k.name;
    case "pi": return "π";
    case "klammer": return `(${formatTerm(k.arg)})`;
    case "negativ": return `−${k.arg.art === "negativ" ? `(${formatTerm(k.arg)})` : formatTerm(k.arg)}`;
    case "plus": return `${formatTerm(k.links)} + ${mitVorzeichenInKlammer(k.rechts)}`;
    case "minus": return `${formatTerm(k.links)} − ${mitVorzeichenInKlammer(k.rechts)}`;
    case "mal": return setzeProdukt(k);
    case "geteilt": return `${formatTerm(k.links)}/${mitVorzeichenInKlammer(k.rechts)}`;
    case "potenz": {
      const b = formatTerm(k.basis);
      return `${ATOMAR.has(k.basis.art) && !b.includes(",") ? b : `(${b})`}${hoch(k.exponent)}`;
    }
    case "wurzel": return `√${formatTerm(k.arg)}`;
    default: return "";
  }
}
