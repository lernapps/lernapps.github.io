// Ereignis-Grammatik für URL-Parameter und Aufgaben:
//   rr, rb, kz        genaue Reihenfolge der Ergebnisse
//   genau1r           genau n-mal Ergebnis
//   mind1r            mindestens n-mal
//   hoechstens1r      höchstens n-mal
//   keinr             kein einziges Mal
//   allegleich        alle Züge gleich (Alias: beidegleich)
//   verschieden       alle Züge verschieden
// Ergebnis: {gueltig, code, name, praedikat(pfad)}

import { ergebnisName } from "./experimente.js";

const ZAHLWORT = ["null", "ein", "zwei", "drei", "vier"];

function malWort(n) {
  if (n === 1) return "einmal";
  return `${ZAHLWORT[n] ?? n}mal`;
}

function reihenfolgeName(exp, ids) {
  const namen = ids.map((id) => ergebnisName(exp, id));
  if (namen.length === 2) return `erst ${namen[0]}, dann ${namen[1]}`;
  return namen.map((n, i) => (i === 0 ? `erst ${n}` : i === namen.length - 1 ? `zuletzt ${n}` : `dann ${n}`)).join(", ");
}

// „kein einziges Mal keine 6“ wäre eine doppelte Verneinung; positiv heißt es „jedes Mal eine 6“.
function keinMalName(exp, id) {
  const name = ergebnisName(exp, id);
  const andere = exp.ergebnisse.filter((e) => e.id !== id);
  if (!name.startsWith("keine ") || andere.length !== 1) return `kein einziges Mal ${name}`;
  return `jedes Mal ${/^\d+$/.test(andere[0].name) ? `eine ${andere[0].name}` : andere[0].name}`;
}

export function parseEreignis(code, exp, zuege) {
  const s = String(code ?? "").trim().toLowerCase();
  const ids = exp.ergebnisse.map((e) => e.id);
  const ungueltig = { gueltig: false, code: s, name: "", praedikat: () => false };
  const zaehle = (pfad, id) => pfad.filter((x) => x === id).length;

  if (s === "allegleich" || s === "beidegleich") {
    return { gueltig: true, code: s, name: zuege === 2 ? "beide gleich" : "alle gleich", praedikat: (p) => p.every((x) => x === p[0]) };
  }
  if (s === "verschieden") {
    return { gueltig: true, code: s, name: zuege === 2 ? "beide verschieden" : "alle verschieden", praedikat: (p) => new Set(p).size === p.length };
  }
  let m = /^(genau|mind|hoechstens)(\d+)([a-z0-9])$/.exec(s);
  if (m) {
    const [, art, nText, id] = m;
    const n = Number(nText);
    if (!ids.includes(id) || n > zuege) return ungueltig;
    const name = ergebnisName(exp, id);
    if (art === "genau") return { gueltig: true, code: s, name: `genau ${malWort(n)} ${name}`, praedikat: (p) => zaehle(p, id) === n };
    if (art === "mind") return { gueltig: true, code: s, name: `mindestens ${malWort(n)} ${name}`, praedikat: (p) => zaehle(p, id) >= n };
    return { gueltig: true, code: s, name: `höchstens ${malWort(n)} ${name}`, praedikat: (p) => zaehle(p, id) <= n };
  }
  m = /^kein([a-z0-9])$/.exec(s);
  if (m && ids.includes(m[1])) {
    const id = m[1];
    return { gueltig: true, code: s, name: keinMalName(exp, id), praedikat: (p) => zaehle(p, id) === 0 };
  }
  const folge = s.split("");
  if (folge.length === zuege && folge.every((id) => ids.includes(id))) {
    return { gueltig: true, code: s, name: reihenfolgeName(exp, folge), praedikat: (p) => p.join("") === s, pfad: folge };
  }
  return ungueltig;
}

// Die Ereignisse, die ein Generator für einen Versuch anbieten kann.
export function moeglicheEreignisse(exp, zuege) {
  const codes = [];
  for (const e of exp.ergebnisse) {
    codes.push(`genau1${e.id}`, `mind1${e.id}`, `kein${e.id}`);
    if (zuege >= 2) codes.push(`genau2${e.id}`);
  }
  codes.push("allegleich", "verschieden");
  return codes.map((c) => parseEreignis(c, exp, zuege)).filter((e) => e.gueltig);
}
