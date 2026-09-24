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

test("L-030: „Ergebnis“ bleibt der Fachbegriff – Titel und Tipp sprechen von Wahrscheinlichkeiten und deiner Antwort", async () => {
  const fs = await import("node:fs");
  const k = KOMPETENZEN.find((x) => x.id === "ergebnisformen");
  assert.equal(k.titel, "Wahrscheinlichkeiten als Produkt, Summe oder Potenz angeben");
  assert.equal(k.seite, "ergebnisformen.html");
  jedeAufgabe((a, fall) => assert.doesNotMatch(texte(a), /Ergebnisse dürfen/, fall));
  const { TIPP_FORMEN } = await import("../js/aufgaben/pfade.js");
  assert.equal(TIPP_FORMEN, "Deine Antwort darf als Produkt, Summe oder Potenz stehen bleiben.");
  for (const p of ["src/zufall/llms.njk", "src/zufall/tutor.njk", "src/zufall/ergebnisformen.md", "src/zufall/pfadregel-2.md"]) {
    assert.doesNotMatch(fs.readFileSync(p, "utf8"), /Ergebnisse (als Produkt|dürfen)/, p);
  }
});

test("L-051: ob der Term als Endergebnis reicht, entscheidet die Lehrkraft", async () => {
  const fs = await import("node:fs");
  const md = fs.readFileSync("src/zufall/ergebnisformen.md", "utf8");
  assert.match(md, /Oft reicht der Term: 3\/6 · 2\/5\. Frag deine Lehrerin oder deinen Lehrer, ob du in der Klassenarbeit ausrechnen musst\./);
  assert.doesNotMatch(md, /ist schon die Antwort/);
});
