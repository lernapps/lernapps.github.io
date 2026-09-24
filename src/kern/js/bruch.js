// Exakte Brüche {z, n}, Parsen von Eingaben (Bruch, Dezimalzahl, Prozent, Rechenterm)
// und Formatierung. Sicherer Term-Auswerter ohne eval. Generisch – nicht pro App ändern.

/** Gekürzter Bruch mit positivem Nenner. @typedef {{ z: number, n: number }} Bruch */

/** @param {number} a @param {number} b @returns {number} */
export function ggT(a, b) {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) [a, b] = [b, a % b];
  return a;
}

/** @param {number} z @param {number} [n] @returns {Bruch} */
export function bruch(z, n = 1) {
  if (!Number.isInteger(z) || !Number.isInteger(n)) throw new Error("Bruch braucht ganze Zahlen");
  if (n === 0) throw new Error("Nenner 0");
  if (n < 0) { z = -z; n = -n; }
  const t = ggT(z, n) || 1;
  return { z: z / t, n: n / t };
}

export const NULL = bruch(0, 1);
export const EINS = bruch(1, 1);

/** @typedef {(a: Bruch, b: Bruch) => Bruch} Bruchrechnung */

/** @type {Bruchrechnung} */
export function addiere(a, b) { return bruch(a.z * b.n + b.z * a.n, a.n * b.n); }
/** @type {Bruchrechnung} */
export function subtrahiere(a, b) { return bruch(a.z * b.n - b.z * a.n, a.n * b.n); }
/** @type {Bruchrechnung} */
export function multipliziere(a, b) { return bruch(a.z * b.z, a.n * b.n); }
/** @type {Bruchrechnung} */
export function dividiere(a, b) { return bruch(a.z * b.n, a.n * b.z); }
/** @param {Bruch} a @param {number} e Exponent, ganz und ≥ 0 @returns {Bruch} */
export function potenz(a, e) {
  let r = EINS;
  for (let i = 0; i < e; i++) r = multipliziere(r, a);
  return r;
}
/** @param {Bruch} a @param {Bruch} b @returns {-1 | 0 | 1} */
export function vergleiche(a, b) {
  const d = a.z * b.n - b.z * a.n;
  return d < 0 ? -1 : d > 0 ? 1 : 0;
}
/** @param {Bruch} a @param {Bruch} b */
export function istGleich(a, b) { return vergleiche(a, b) === 0; }
/** @param {Bruch} a */
export function zuDezimal(a) { return a.z / a.n; }
/** @param {Bruch[]} liste */
export function summe(liste) { return liste.reduce(addiere, NULL); }
/** @param {Bruch[]} liste */
export function produkt(liste) { return liste.reduce(multipliziere, EINS); }

// --- Formatierung ---------------------------------------------------------

/** @param {number} zahl */
function deutsch(zahl) { return String(zahl).replace(".", ","); }

/** @param {Bruch} a */
export function formatBruch(a) { return a.n === 1 ? String(a.z) : `${a.z}/${a.n}`; }

/** @param {Bruch} a @param {number} [stellen] */
export function formatDezimal(a, stellen = 3) {
  const d = zuDezimal(a);
  const gerundet = Math.round(d * 10 ** stellen) / 10 ** stellen;
  return deutsch(gerundet);
}

/** @param {Bruch} a @param {number} [stellen] */
export function formatProzent(a, stellen = 1) {
  const p = zuDezimal(a) * 100;
  const gerundet = Math.round(p * 10 ** stellen) / 10 ** stellen;
  return `${deutsch(gerundet)} %`;
}

/** Nachkommastellen, nach denen der Bruch als Dezimalzahl endet (1/4 → 2); null, wenn er periodisch ist (1/3).
 * @param {{ n: number }} a @returns {number | null} */
export function endStellen({ n }) {
  let zwei = 0;
  let fuenf = 0;
  while (n % 2 === 0) { n /= 2; zwei++; }
  while (n % 5 === 0) { n /= 5; fuenf++; }
  return n === 1 ? Math.max(zwei, fuenf) : null;
}

// "=", wenn die Anzeige mit `stellen` Nachkommastellen den Wert exakt trifft, sonst "≈" (TD-18, BR-5).
/** @param {Bruch} a @param {number} stellen */
function gleichheit(a, stellen) {
  const ende = endStellen(a);
  return ende !== null && ende <= stellen ? "=" : "≈";
}

/** "1/4 = 0,25 = 25 %", "1/3 ≈ 0,333 ≈ 33,3 %": "=" nur, wenn die jeweilige Anzeige exakt ist.
 * @param {Bruch} a @param {number} [dezimalStellen] @param {number} [prozentStellen] */
export function formatAlle(a, dezimalStellen = 3, prozentStellen = 1) {
  const dezimal = `${gleichheit(a, dezimalStellen)} ${formatDezimal(a, dezimalStellen)}`;
  const prozent = `${gleichheit(a, prozentStellen + 2)} ${formatProzent(a, prozentStellen)}`;
  return `${formatBruch(a)} ${dezimal} ${prozent}`;
}

// --- Parsen ---------------------------------------------------------------

const DEZIMAL = /^(\d+)(?:[.,](\d+))?$/;
const MAX_EXPONENT = 64;

// Wandelt "0,25" oder "3" in einen Bruch um; liefert auch die Anzahl der
// Nachkommastellen, damit gerundete Eingaben tolerant geprüft werden können.
/** @param {string} text */
function dezimalZuBruch(text) {
  const m = DEZIMAL.exec(text);
  if (!m) return null;
  const nachkomma = m[2] || "";
  const n = 10 ** nachkomma.length;
  return { wert: bruch(Number(m[1] + nachkomma), n), stellen: nachkomma.length };
}

/** @param {string} text @returns {Bruch | null} */
export function parseBruch(text) {
  const ergebnis = auswertenMitInfo(text);
  return ergebnis ? ergebnis.wert : null;
}

// Tokenizer: Zahlen, Prozent, Operatoren, Klammern, Wurzel (sqrt, wurzel, √) und pi/π. Kein eval.
/** @typedef {{ typ: "zahl" | "prozent" | "op" | "wurzel" | "pi", text?: string }} Token */
/** @param {unknown} text @returns {Token[] | null} */
function tokenisiere(text) {
  /** @type {Token[]} */
  const tokens = [];
  const re = /\s*(?:(\d+(?:[.,]\d+)?)|(%)|([-+*/:·×^()])|(sqrt|wurzel|√)|(pi|π))/iy;
  const s = String(text ?? "").trim();
  let pos = 0;
  while (pos < s.length) {
    re.lastIndex = pos;
    const m = re.exec(s);
    if (!m) return null;
    pos = re.lastIndex;
    if (m[1]) tokens.push({ typ: "zahl", text: m[1] });
    else if (m[2]) tokens.push({ typ: "prozent" });
    else if (m[3]) tokens.push({ typ: "op", text: m[3] });
    else if (m[4]) tokens.push({ typ: "wurzel", text: m[4] });
    else tokens.push({ typ: "pi" });
  }
  return tokens;
}

// Werte im Parser: ein Bruch {z, n} (exakt) oder eine Kommazahl (number), sobald Wurzel oder pi mitspielen.
/** @typedef {Bruch | number} Wert */
class TermFehler extends Error {}
/** @param {Wert} x @returns {x is number} */
const istKomma = (x) => typeof x === "number";
/** @param {Wert} x @returns {number} */
const alsZahl = (x) => (istKomma(x) ? x : zuDezimal(x));
/** @param {Bruch} b */
function sicher(b) {
  if (!Number.isSafeInteger(b.z) || !Number.isSafeInteger(b.n)) throw new TermFehler("ungueltig");
  return b;
}
/**
 * @param {Wert} a @param {Wert} b @param {Bruchrechnung} mitBruch @param {(x: number, y: number) => number} mitZahl
 * @returns {Wert}
 */
function rechne(a, b, mitBruch, mitZahl) {
  const r = istKomma(a) || istKomma(b) ? mitZahl(alsZahl(a), alsZahl(b)) : sicher(mitBruch(a, b));
  if (istKomma(r) && !Number.isFinite(r)) throw new TermFehler("ungueltig");
  return r;
}
/** @param {Wert} x @returns {Wert} */
function wurzel(x) {
  if (alsZahl(x) < 0) throw new TermFehler("wurzel-negativ");
  if (!istKomma(x)) {
    const z = Math.round(Math.sqrt(x.z));
    const n = Math.round(Math.sqrt(x.n));
    if (z * z === x.z && n * n === x.n) return bruch(z, n);
  }
  return Math.sqrt(alsZahl(x));
}

// Rekursiver Abstieg: ausdruck = term (('+'|'-') term)*
//                     term     = faktor (('*'|'/'|':'|'·'|'×') faktor)*
//                     faktor   = basis ('^' zahl)?
//                     basis    = zahl ['%'] | '(' ausdruck ')' | '-' basis | 'pi' | 'π'
//                              | ('sqrt'|'wurzel') '(' ausdruck ')' | '√' basis
/** @param {Token[]} tokens @returns {{ wert: Wert, stellen: number } | null} */
function parser(tokens) {
  let i = 0;
  let stellen = -1; // größte Nachkommastellen-Zahl aller Dezimal-/Prozentangaben
  /** @param {number} s */
  const merkeStellen = (s) => { stellen = Math.max(stellen, s); };
  /** @param {Token["typ"]} typ @param {string} [text] */
  const ist = (typ, text) => tokens[i] && tokens[i].typ === typ && (text === undefined || tokens[i].text === text);

  /** @returns {Wert | null} */
  function klammer() {
    if (!ist("op", "(")) return null;
    i++;
    const a = ausdruck();
    if (a === null || !ist("op", ")")) return null;
    i++;
    return a;
  }
  /** @returns {Wert | null} */
  function basis() {
    if (ist("op", "-")) { i++; const b = basis(); return b === null ? null : istKomma(b) ? -b : bruch(-b.z, b.n); }
    if (ist("op", "(")) return klammer();
    if (ist("pi")) { i++; return Math.PI; }
    if (ist("wurzel")) {
      const zeichen = tokens[i].text === "√";
      i++;
      const r = zeichen ? basis() : klammer();
      return r === null ? null : wurzel(r);
    }
    if (ist("zahl")) {
      const d = dezimalZuBruch(/** @type {string} */ (tokens[i].text));
      i++;
      if (!d) return null;
      let wert = d.wert;
      if (ist("prozent")) {
        i++;
        wert = bruch(wert.z, wert.n * 100);
        merkeStellen(d.stellen + 2);
      } else if (d.stellen > 0) merkeStellen(d.stellen);
      return wert;
    }
    return null;
  }
  /** @returns {Wert | null} */
  function faktor() {
    const b = basis();
    if (b === null) return null;
    if (ist("op", "^")) {
      i++;
      if (!ist("zahl") || !/^\d+$/.test(/** @type {string} */ (tokens[i].text))) return null;
      const e = Number(tokens[i].text);
      i++;
      if (e > MAX_EXPONENT) throw new TermFehler("ungueltig");
      return istKomma(b) ? b ** e : sicher(potenz(b, e));
    }
    return b;
  }
  /** @returns {Wert | null} */
  function term() {
    let a = faktor();
    if (a === null) return null;
    while (tokens[i] && tokens[i].typ === "op" && "*/:·×".includes(/** @type {string} */ (tokens[i].text))) {
      const op = tokens[i].text;
      i++;
      const b = faktor();
      if (b === null) return null;
      if (op === "/" || op === ":") {
        if (alsZahl(b) === 0) return null;
        a = rechne(a, b, dividiere, (x, y) => x / y);
      } else a = rechne(a, b, multipliziere, (x, y) => x * y);
    }
    return a;
  }
  /** @returns {Wert | null} */
  function ausdruck() {
    let a = term();
    if (a === null) return null;
    while (ist("op", "+") || ist("op", "-")) {
      const op = tokens[i].text;
      i++;
      const b = term();
      if (b === null) return null;
      a = op === "+" ? rechne(a, b, addiere, (x, y) => x + y) : rechne(a, b, subtrahiere, (x, y) => x - y);
    }
    return a;
  }
  const wert = ausdruck();
  if (wert === null || i !== tokens.length) return null;
  return { wert, stellen };
}

/**
 * Wertet einen Term aus. Ergebnis: { wert: Bruch oder null, zahl, exakt, stellen } oder { fehler: "ungueltig" | "wurzel-negativ" }.
 * exakt = false (und wert = null), sobald Wurzeln oder pi eine Kommazahl liefern. stellen = -1, wenn nur Brüche/Ganzzahlen
 * vorkamen (dann ist die Eingabe exakt gemeint), sonst die größte Zahl getippter Nachkommastellen.
 * @typedef {{ wert: Bruch, zahl: number, exakt: true, stellen: number, fehler?: undefined }
 *   | { wert: null, zahl: number, exakt: false, stellen: number, fehler?: undefined }
 *   | { fehler: "ungueltig" | "wurzel-negativ", wert?: undefined, zahl?: undefined, exakt?: undefined, stellen?: undefined }} TermErgebnis
 * @param {unknown} text
 * @returns {TermErgebnis}
 */
export function leseTerm(text) {
  const tokens = tokenisiere(text);
  if (!tokens || tokens.length === 0) return { fehler: "ungueltig" };
  try {
    const r = parser(tokens);
    if (!r) return { fehler: "ungueltig" };
    const exakt = !istKomma(r.wert);
    // exakt heißt: r.wert ist ein Bruch – tsc verfolgt das über die Hilfsvariable nicht, daher die Zusicherung.
    return /** @type {TermErgebnis} */ ({ wert: exakt ? r.wert : null, zahl: alsZahl(r.wert), exakt, stellen: r.stellen });
  } catch (e) {
    // TermFehler trägt nur diese beiden Codes als message.
    return { fehler: e instanceof TermFehler ? /** @type {"ungueltig" | "wurzel-negativ"} */ (e.message) : "ungueltig" };
  }
}

// Liefert {wert, stellen} (wert als Bruch) oder null – auch null, wenn das Ergebnis keine Bruchzahl ist (Wurzel, pi).
/** @param {unknown} text @returns {{ wert: Bruch, stellen: number } | null} */
export function auswertenMitInfo(text) {
  const r = leseTerm(text);
  return r.fehler || !r.exakt ? null : { wert: r.wert, stellen: r.stellen };
}

/** @param {unknown} text @returns {Bruch | null} */
export function auswerten(text) {
  const r = auswertenMitInfo(text);
  return r ? r.wert : null;
}
