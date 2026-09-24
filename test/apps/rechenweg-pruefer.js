// Testhilfe (kein Test): findet Rechnungen „Term = Zahl“ bzw. „Term ≈ Zahl“ in Lösungszeilen und rechnet sie nach.
// Zeilen mit demselben Anfang („W = …“, „W = …“) und Zeilen, die mit „=“ beginnen, gelten als eine Kette. Nur rein zahlenmäßige Teile werden geprüft;
// Formeln mit Buchstaben (W = G · p / 100) und Beschriftungen („1 %“) ohne Rechenzeichen bleiben außen vor.
import { leseTerm } from "../../src/kern/js/bruch.js";

const EINHEIT_AM_ENDE = /\s*(?:€|%|[A-Za-zÄÖÜäöüß]+\.?)$/;
const LABEL_VORNE = /^.*?[A-Za-zÄÖÜäöüß)]:\s+/;

/** Wert eines rein zahlenmäßigen Teils oder null. */
function wert(teil) {
  let s = teil.replace(/<\/?strong>/g, "").replace(LABEL_VORNE, "").trim().replace(EINHEIT_AM_ENDE, "").trim();
  s = s.replace(/\u00a0|\u202f/g, " ").replace(/·|×/g, "*").replace(/:/g, "/").replace(/−/g, "-").replace(/²/g, "^2").replace(/³/g, "^3");
  if (!/^[\d\s,.+\-*/()^]+$/.test(s) || !/\d/.test(s)) return null;
  const r = leseTerm(s);
  if (r.fehler) return null;
  return { zahl: r.zahl, rechnet: /[+\-*/^]/.test(s.replace(/^-/, "")), text: s };
}

const nachkomma = (text) => (text.match(/,(\d+)\s*$/)?.[1].length ?? 0);

function kettenAus(zeilen) {
  const ketten = [];
  let vorher = null;
  for (const roh of zeilen) {
    const zeile = String(roh).replace(/<\/?strong>/g, "");
    const anfang = zeile.match(/^([^=≈]+?)\s[=≈]\s/)?.[1];
    if (/^[=≈]\s/.test(zeile) && vorher) vorher.text += ` ${zeile}`;
    else if (anfang && vorher && anfang === vorher.anfang) vorher.text += zeile.slice(anfang.length);
    else {
      vorher = { anfang, text: zeile };
      ketten.push(vorher);
    }
  }
  return ketten.map((k) => k.text);
}

/** Alle geprüften Paare einer Lösung: { links, zeichen, rechts, wertLinks, wertRechts, stimmt }. */
export function rechnungenIn(zeilen) {
  const ergebnis = [];
  for (const kette of kettenAus(zeilen)) {
    const teile = kette.split(/\s([=≈])\s/);
    for (let i = 0; i + 2 < teile.length; i += 2) {
      const [links, zeichen, rechts] = [teile[i], teile[i + 1], teile[i + 2]];
      const l = wert(links);
      const r = wert(rechts);
      if (!l || !r || !l.rechnet) continue;
      const toleranz = zeichen === "=" ? 1e-9 * Math.max(1, Math.abs(r.zahl)) : 0.5 * 10 ** -nachkomma(rechts.replace(EINHEIT_AM_ENDE, "")) + 1e-9;
      ergebnis.push({ links, zeichen, rechts, wertLinks: l.zahl, wertRechts: r.zahl, stimmt: Math.abs(l.zahl - r.zahl) <= toleranz });
    }
  }
  return ergebnis;
}
