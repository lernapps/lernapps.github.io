// Use Case: Übung im Prozent-Trainer – das Bild zur Aufgabe verrät die gesuchte Zahl nicht, bevor das Kind rechnet (L-026).
// Die gesuchte Größe steht als „?“ im Bild; die Zahl erscheint erst mit „Lösung zeigen“ oder nach richtiger Antwort.
import { test } from "node:test";
import assert from "node:assert/strict";
import { leeresSvg } from "../../kern/js/svg.js";
import { erzeugeZufall } from "../../kern/js/zufall.js";
import { formatZahl, formatWert } from "../../kern/js/zahlen.js";
import * as sach from "../js/aufgaben/sachaufgaben.js";
import * as satz from "../js/aufgaben/prozentsatz.js";
import { zeichneSachaufgaben } from "../js/vis/sachaufgaben.js";
import { zeichneProzentsatz } from "../js/vis/prozentsatz.js";

const BLAU = "#1d4ed8";
const texte = (svg) => [svg.getAttribute("aria-label"), ...svg.children.filter((e) => e.tagName === "text").map((e) => e.textContent)].join(" | ");
const zahlen = (t) => (t.match(/\d+(,\d+)?/g) || []);
const gefuellt = (svg) => svg.children.filter((e) => e.tagName === "rect" && e.getAttribute("fill") === BLAU)
  .reduce((s, e) => s + Number(e.getAttribute("width")), 0);
const wertVon = (a) => ({ W: a.prozentwert, G: a.grundwert, p: a.prozentsatz })[a.gesucht];
const gegeben = (a) => ["W", "G", "p"].filter((g) => g !== a.gesucht)
  .flatMap((g) => [({ W: a.prozentwert, G: a.grundwert, p: a.prozentsatz })[g]]).map((z) => formatZahl(z));

function pruefeOffen(zeichne, a, name) {
  const svg = leeresSvg();
  zeichne(svg, a);
  const t = texte(svg);
  const gesucht = a.gesucht === "p" ? formatZahl(wertVon(a)) : formatWert(wertVon(a), a.einheit);
  if (!gegeben(a).includes(gesucht) && gesucht !== "100") assert.ok(!zahlen(t).includes(gesucht), `${name} gesucht ${a.gesucht}=${gesucht} verraten: ${t}`);
  assert.match(t, /\?/, `${name}: kein „?“ im Bild: ${t}`);
  if (a.gesucht === "p") assert.equal(gefuellt(svg), 0, `${name}: die Füllung verrät p`);
  const geloest = leeresSvg();
  zeichne(geloest, a, { korrekt: true, loesungGezeigt: true });
  assert.ok(zahlen(texte(geloest)).includes(gesucht), `${name}: gelöst fehlt ${gesucht}: ${texte(geloest)}`);
}

test("L-026: Sachaufgaben – alle Typen und gesuchten Größen zeigen vor dem Prüfen „?“ statt der Zahl", () => {
  const faelle = [{ typ: "dreisatz" }, ...["g", "w", "p"].map((gesucht) => ({ typ: "gleichung", gesucht }))];
  for (const vorgaben of faelle) {
    for (let seed = 1; seed <= 40; seed++) pruefeOffen(zeichneSachaufgaben, sach.erzeugeAufgabe(erzeugeZufall(seed), vorgaben), JSON.stringify(vorgaben));
  }
});

test("L-026: Beispiel aus dem Lektorat – 18 % = 259,20 €, 100 % = ?", () => {
  const a = { typ: "gleichung", gesucht: "G", grundwert: 1440, prozentsatz: 18, prozentwert: 259.2, einheit: "€" };
  const svg = leeresSvg();
  zeichneSachaufgaben(svg, a);
  const t = texte(svg);
  assert.match(t, /18 % = 259,20 €/);
  assert.match(t, /100 % = \?/);
  assert.doesNotMatch(t, /1440/);
});

test("L-026: Prozentsatz – der Balken ist vor dem Prüfen leer, sonst läse man p an der Skala ab", () => {
  for (let seed = 1; seed <= 40; seed++) {
    const a = { ...satz.erzeugeAufgabe(erzeugeZufall(seed)), gesucht: "p" };
    pruefeOffen(zeichneProzentsatz, a, "prozentsatz");
  }
});
