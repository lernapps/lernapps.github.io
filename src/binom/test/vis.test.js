// Use Case: Bild dazu – Maße der Flächenbilder (2. und 3. Formel, Geschickt rechnen) stehen lesbar außen an den Seiten.
// Lektorat L-003 (2. Formel, Geschickt rechnen) und L-004 (3. Formel).
import { test } from "node:test";
import assert from "node:assert/strict";
import { leeresSvg } from "../../kern/js/svg.js";
import { erzeugeZufall } from "../../kern/js/zufall.js";
import { erzeugeAufgabe as zweite } from "../js/aufgaben/zweite-binomische.js";
import { erzeugeAufgabe as dritte } from "../js/aufgaben/dritte-binomische.js";
import { erzeugeAufgabe as geschickt } from "../js/aufgaben/geschickt-rechnen.js";
import { zeichneZweiteBinomische } from "../js/vis/zweite-binomische.js";
import { zeichneDritteBinomische } from "../js/vis/dritte-binomische.js";
import { zeichneGeschicktRechnen } from "../js/vis/geschickt-rechnen.js";

const texte = (svg) => svg.children.filter((e) => e.tagName === "text").map((e) => ({
  text: e.textContent,
  x: Number(e.getAttribute("x")),
  y: Number(e.getAttribute("y")),
  anker: e.getAttribute("text-anchor"),
  groesse: Number(e.getAttribute("font-size")),
}));
const rechtecke = (svg) => svg.children.filter((e) => e.tagName === "rect").map((e) => ({
  x: Number(e.getAttribute("x")), y: Number(e.getAttribute("y")),
  w: Number(e.getAttribute("width")), h: Number(e.getAttribute("height")),
}));
const finde = (liste, text) => liste.filter((t) => t.text === text);
const zeichne = (fn, aufgabe) => { const svg = leeresSvg(); fn(svg, aufgabe, { korrekt: true }); return svg; };
/** Außen links: rechtsbündig vor der linken Kante. */
const linksAussen = (t, kante) => t.anker === "end" && t.x < kante;

test("L-003: 2. Formel (x − 5)² – Maße 5 und x − 5 links außen, so groß wie x; Ecke 25 größer", () => {
  const svg = zeichne(zeichneZweiteBinomische, zweite(erzeugeZufall(1), { m: 1, n: 5, var: "x" }));
  const t = texte(svg);
  const kante = Math.min(...rechtecke(svg).map((r) => r.x));
  const [x] = finde(t, "x");
  assert.ok(x, "Seite x ist beschriftet");
  for (const mass of ["5", "x − 5"]) {
    const treffer = finde(t, mass).filter((e) => linksAussen(e, kante));
    assert.equal(treffer.length, 1, `${mass} steht links außen`);
    assert.ok(treffer[0].groesse >= x.groesse, `${mass} mindestens so groß wie x`);
  }
  const ecke = finde(t, "25").filter((e) => !e.anker || e.anker === "middle");
  assert.equal(ecke.length, 1, "Ecke 25 im Quadrat");
  assert.ok(ecke[0].groesse >= x.groesse, "Ecke 25 mindestens so groß wie x");
});

test("L-003: Geschickt rechnen 49² – Maße 1 und 49 links außen, Ecke 1 lesbar", () => {
  const svg = zeichne(zeichneGeschicktRechnen, geschickt(erzeugeZufall(1), { formel: 2, basis: 50, abstand: 1 }));
  const t = texte(svg);
  const kante = Math.min(...rechtecke(svg).map((r) => r.x));
  const [seite] = finde(t, "50");
  for (const mass of ["1", "49"]) {
    const treffer = finde(t, mass).filter((e) => linksAussen(e, kante));
    assert.equal(treffer.length, 1, `${mass} steht links außen`);
    assert.ok(treffer[0].groesse >= seite.groesse, `${mass} mindestens so groß wie 50`);
  }
  for (const e of finde(t, "1")) assert.ok(e.groesse >= seite.groesse, "keine winzige 1");
});

test("L-003: Geschickt rechnen 21 · 19 – die fehlende Ecke − 1² ist so groß wie die Seite 20", () => {
  const svg = leeresSvg();
  zeichneGeschicktRechnen(svg, geschickt(erzeugeZufall(1), { formel: 3, basis: 20, abstand: 1 }));
  const t = texte(svg);
  const [seite] = finde(t, "20");
  const [ecke] = finde(t, "− 1²");
  assert.ok(ecke && ecke.groesse >= seite.groesse);
});

test("L-004: 3. Formel – oben tragen gelber Teil (x − 4 breit, 4 hoch) und blauer Teil (x − 4 hoch) Maße", () => {
  const svg = zeichne(zeichneDritteBinomische, dritte(erzeugeZufall(1), { m: 1, n: 4, var: "x" }));
  const t = texte(svg);
  const r = rechtecke(svg);
  const [blau, gelb] = r;
  const oben = (e) => e.y <= gelb.y + gelb.h + 24;
  const [x] = finde(t, "x");
  const gross = (e) => e.groesse >= x.groesse;
  const breiteGelb = finde(t, "x − 4").filter((e) => oben(e) && e.y > gelb.y + gelb.h && Math.abs(e.x - (gelb.x + gelb.w / 2)) < 1);
  assert.equal(breiteGelb.length, 1, "gelb: Breite x − 4 unter dem Teil");
  const hoeheBlau = finde(t, "x − 4").filter((e) => linksAussen(e, blau.x) && e.y > blau.y && e.y < blau.y + blau.h + 6);
  assert.equal(hoeheBlau.length, 1, "blau: Höhe x − 4 links");
  const hoeheGelb = finde(t, "4").filter((e) => linksAussen(e, gelb.x) && e.y > gelb.y && e.y < gelb.y + gelb.h + 6);
  assert.equal(hoeheGelb.length, 1, "gelb: Höhe 4 links");
  for (const e of [...breiteGelb, ...hoeheBlau, ...hoeheGelb]) assert.ok(gross(e), `${e.text} so groß wie x`);
});
