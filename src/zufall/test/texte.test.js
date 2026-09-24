// Use Case: alle Kompetenzen – Aufgabentexte, Tipps und Lösungswege sind sauberes Deutsch in Schulschreibweise
// (Lektorat Runde 2: L-032 Kugel-Aufzählungen, L-033 Gleichungen ohne gleiche Seiten und ohne „^“).
import { test } from "node:test";
import assert from "node:assert/strict";
import { erzeugeZufall } from "../../kern/js/zufall.js";
import { KOMPETENZEN } from "../js/app.config.js";
import { kugelListe } from "../js/modell/experimente.js";

const module = await Promise.all(KOMPETENZEN.map((k) => import(`../js/aufgaben/${k.id}.js`)));
const SEEDS = 300;

/** Alle Texte einer Aufgabe, die das Kind liest. */
const texte = (a) => [a.text, a.tipp, ...(a.rechenweg || []), ...(a.felder || []).map((f) => f.label ?? "")].join("\n");

function jedeAufgabe(pruefe) {
  for (const m of module) for (let s = 0; s < SEEDS; s++) pruefe(m.erzeugeAufgabe(erzeugeZufall(s), {}), `${m.THEMA} Seed ${s}`);
}

test("L-032: Kugel-Aufzählungen mit „und“ vor dem letzten Glied, nach „1“ die Einzahl", () => {
  assert.equal(kugelListe([{ name: "rot", anzahl: 3 }, { name: "blau", anzahl: 2 }, { name: "gelb", anzahl: 1 }]), "3 rote, 2 blaue und 1 gelbe Kugel");
  assert.equal(kugelListe([{ name: "rot", anzahl: 4 }, { name: "blau", anzahl: 1 }]), "4 rote Kugeln und 1 blaue Kugel");
  assert.equal(kugelListe([{ name: "rot", anzahl: 1 }, { name: "blau", anzahl: 2 }, { name: "gelb", anzahl: 3 }]), "1 rote, 2 blaue und 3 gelbe Kugeln");
  assert.equal(kugelListe([{ name: "rot", anzahl: 2 }, { name: "blau", anzahl: 3 }]), "2 rote und 3 blaue Kugeln");
  assert.equal(kugelListe([{ name: "lila", anzahl: 2 }, { name: "rot", anzahl: 2 }]), "2 lila und 2 rote Kugeln");
  jedeAufgabe((a, fall) => {
    const t = texte(a);
    assert.doesNotMatch(t, /\b1 \p{L}+ Kugeln\b/u, fall);
    assert.doesNotMatch(t, /\d+ \p{L}+, \d+ \p{L}+ Kugel/u, `${fall}: „und“ fehlt`);
  });
});

test("L-033: keine Gleichung mit gleichen Seiten wie „3/5 = 3/5“, Potenzen als Hochzahl statt „^“", () => {
  jedeAufgabe((a, fall) => {
    const rechenweg = (a.rechenweg || []).join("\n").replace(/<\/?strong>/g, "");
    assert.doesNotMatch(rechenweg, /(?<![\d/])(?<![−+·] )(\d+\/\d+) = \1(?![\d/])/, fall);
    assert.doesNotMatch(rechenweg, /\^/, fall);
  });
});

test("L-042: kein „NICHT“ in Großbuchstaben in Aufgaben, Tipps und Lösungswegen", () => {
  jedeAufgabe((a, fall) => assert.doesNotMatch(texte(a), /\bNICHT\b/, fall));
});
