// Use Case: Bäume hochkant auf allen Baum-Seiten (ADR-024). Zweistufige Bäume passen in 279 px (Übungsbild bei
// 360 px), Geschwistergruppen haben eine sichtbare Lücke, nichts überlappt. Bäume, die hochkant nicht passen, liegen
// quer (Klasse baum-quer; zufall.css zeigt dann auf schmalen Hochkant-Bildschirmen den Dreh-Hinweis).
import { test } from "node:test";
import assert from "node:assert/strict";
import { leeresSvg, svgEl } from "../../kern/js/svg.js";
import { erzeugeZufall } from "../../kern/js/zufall.js";
import { baueBaum } from "../js/modell/baum.js";
import { urne, muenze, wuerfelSechs } from "../js/modell/experimente.js";
import { zeichneBaumIn } from "../js/vis/baum.js";
import { zeichneBaumdiagramm } from "../js/vis/baumdiagramm.js";
import { zeichnePfadregel2 } from "../js/vis/pfadregel-2.js";
import { URNEN_VORLAGEN } from "../js/aufgaben/gemeinsam.js";
import * as baumA from "../js/aufgaben/baumdiagramm.js";
import * as p1 from "../js/aufgaben/pfadregel-1.js";
import * as p2 from "../js/aufgaben/pfadregel-2.js";
import * as formen from "../js/aufgaben/ergebnisformen.js";
import * as uebersetzen from "../js/aufgaben/pfade-uebersetzen.js";
import * as gegen from "../js/aufgaben/gegenereignis.js";
import { alle, klasse, text, zahl, boxen, keineUeberlappung } from "./baum-boxen.js";

const MAX_BREITE = 279;
const z = (s) => erzeugeZufall(s);
const hat = (g, name) => g.classList.contains(name);

test("Lücke zwischen Geschwistergruppen: mindestens 6 px mehr als in der Gruppe, Breite ≤ 279 px, nichts überlappt", () => {
  for (const spec of URNEN_VORLAGEN) for (const mit of [true, false]) for (const zeigePfad of [true, false]) {
    const g = svgEl("g");
    const groesse = zeichneBaumIn(g, baueBaum(urne(spec), 2, mit), { richtung: "unten", zeigePfad });
    const fall = `${spec} ${mit ? "mit" : "ohne"}${zeigePfad ? " gelöst" : ""}`;
    assert.ok(groesse.breite <= MAX_BREITE, `${fall}: ${groesse.breite} px`);
    const blaetter = alle(g, klasse("baum-knoten")).filter(({ e }) => e.getAttribute("data-knoten").split("-").length === 3).sort((a, b) => a.x - b.x);
    const eltern = (b) => b.e.getAttribute("data-knoten").split("-").slice(0, 2).join("-");
    const innen = [];
    const zwischen = [];
    for (let i = 1; i < blaetter.length; i++) (eltern(blaetter[i]) === eltern(blaetter[i - 1]) ? innen : zwischen).push(blaetter[i].x - blaetter[i - 1].x);
    if (innen.length && zwischen.length) assert.ok(Math.min(...zwischen) - Math.max(...innen) >= 6, `${fall}: innen ${innen}, zwischen ${zwischen}`);
    keineUeberlappung(assert, boxen(g));
  }
});

test("ohne richtung wählt zeichneBaumIn: hochkant, wenn der Baum in 279 px passt, sonst quer", () => {
  const faelle = [[urne("3r2b1g"), 2, "baum-hochkant"], [urne("2r2b2g"), 2, "baum-hochkant"], [wuerfelSechs(), 2, "baum-hochkant"],
    [muenze(), 3, "baum-hochkant"], [urne("3r2b1g"), 3, "baum-quer"], [wuerfelSechs(), 3, "baum-quer"]];
  for (const [exp, zuege, erwartet] of faelle) {
    const g = svgEl("g");
    const groesse = zeichneBaumIn(g, baueBaum(exp, zuege, true), { zeigePfad: true });
    assert.ok(hat(g, erwartet), `${exp.spec || exp.typ} ${zuege} Züge: ${g.getAttribute("class")}`);
    if (erwartet === "baum-hochkant") assert.ok(groesse.breite <= MAX_BREITE, `${groesse.breite} px`);
    else assert.ok(!hat(g, "baum-hochkant"));
  }
});

test("jede Baum-Seite zeichnet zweistufige Urnenbäume hochkant in 279 px (Übung offen und gelöst)", () => {
  const seiten = [[baumA, zeichneBaumdiagramm, {}], [p1, null, {}], [p2, zeichnePfadregel2, { art: "pfade" }], [p2, zeichnePfadregel2, { art: "term" }],
    [formen, zeichnePfadregel2, {}], [uebersetzen, zeichnePfadregel2, {}], [gegen, null, { ereignis: "mind1r" }]];
  for (const [modul, zeichne, extra] of seiten) for (const spec of URNEN_VORLAGEN) for (const modus of ["mit", "ohne"]) for (const korrekt of [false, true]) {
    const a = modul.erzeugeAufgabe(z(4), { urne: spec, zuege: 2, modus, ...extra });
    const svg = leeresSvg();
    (zeichne || modul.zeichneBild)(svg, a, korrekt ? { korrekt } : undefined);
    const fall = `${modul.THEMA} ${spec} ${modus}${korrekt ? " gelöst" : ""}`;
    assert.ok(zahl(svg, "width") <= MAX_BREITE, `${fall}: ${svg.getAttribute("width")} px`);
    assert.equal(alle(svg, klasse("baum-hochkant")).length, 1, fall);
    keineUeberlappung(assert, boxen(svg));
  }
});

test("Baumdiagramm hochkant: fehlender Zweig zeigt „?“ am Ende, der Buchstabe steht auf dem Zweig; gelöst der Wert", () => {
  for (let s = 0; s < 20; s++) {
    const a = baumA.erzeugeAufgabe(z(s), { urne: URNEN_VORLAGEN[s % URNEN_VORLAGEN.length], zuege: 2, modus: s % 2 ? "mit" : "ohne" });
    for (const korrekt of [false, true]) {
      const svg = leeresSvg();
      zeichneBaumdiagramm(svg, a, korrekt ? { korrekt } : undefined);
      const buchstaben = alle(svg, klasse("baum-buchstabe")).map(({ e }) => text(e));
      assert.deepEqual(buchstaben.sort(), a.versteckt.map((v) => v.buchstabe).sort());
      const versteckt = alle(svg, klasse("versteckt")).map(({ e }) => text(e));
      assert.deepEqual(versteckt.sort(), a.versteckt.map((v) => (korrekt ? `${v.anzahl}/${v.gesamt}` : "?")).sort());
    }
  }
});

test("Pfade anklicken hochkant: jedes Blatt ist ein Knopf mit aria-pressed, Trefferfläche ≥ 24 × 24 px, ohne Überschneidung", () => {
  for (const spec of URNEN_VORLAGEN) {
    const a = p2.erzeugeAufgabe(z(1), { art: "pfade", urne: spec, zuege: 2, modus: "mit" });
    const svg = leeresSvg();
    zeichnePfadregel2(svg, a);
    const knoepfe = alle(svg, klasse("baum-blatt"));
    assert.ok(knoepfe.length >= 4);
    const flaechen = knoepfe.map(({ e }) => {
      assert.equal(e.getAttribute("role"), "button");
      assert.equal(e.getAttribute("tabindex"), "0");
      assert.equal(e.getAttribute("aria-pressed"), "false");
      const r = alle(e, klasse("baum-treffer"))[0].e;
      assert.ok(zahl(r, "width") >= 24 && zahl(r, "height") >= 24, `${spec}: ${r.getAttribute("width")} × ${r.getAttribute("height")}`);
      return { x1: zahl(r, "x"), x2: zahl(r, "x") + zahl(r, "width") };
    }).sort((p, q) => p.x1 - q.x1);
    for (let i = 1; i < flaechen.length; i++) assert.ok(flaechen[i].x1 >= flaechen[i - 1].x2, `${spec}: Trefferflächen überschneiden sich`);
  }
});

// L-034: Auf dem Handy (360 px) sind Brüche und Buchstaben im Baum mindestens 13 px groß; zweistufige Bäume nutzen
// die Breite des Übungsbilds, statt schmal links zu stehen. Die Bilder zeigen ihre natürliche Größe (1 Einheit = 1 px).
const BAUM_TEXTE = ["baum-label", "baum-buchstabe", "pfad-w", "baum-legende"];
const hochkantFaelle = [...URNEN_VORLAGEN.flatMap((spec) => [[urne(spec), 2, true], [urne(spec), 2, false]]),
  [muenze(), 2, true], [wuerfelSechs(), 2, true], [muenze(), 3, true], [urne("3r2b"), 3, false]];

test("L-034: alle Texte im Hochkant-Baum sind mindestens 13 px groß, auch die Kürzel in den Knoten", () => {
  for (const [exp, zuege, mit] of hochkantFaelle) for (const zeigePfad of [true, false]) {
    const g = svgEl("g");
    zeichneBaumIn(g, baueBaum(exp, zuege, mit), { richtung: "unten", zeigePfad, versteckt: new Map([[`w-${exp.ergebnisse[0].id}`, "a"]]) });
    const kuerzel = alle(g, klasse("baum-knoten")).flatMap(({ e }) => e.children.filter((c) => c.tagName === "text")).map((e) => ({ e }));
    const texte = [...alle(g, (e) => e.tagName === "text" && BAUM_TEXTE.some((c) => klasse(c)(e))), ...kuerzel];
    assert.ok(kuerzel.length > 4 && texte.length > kuerzel.length);
    for (const { e } of texte) assert.ok(zahl(e, "font-size") >= 13, `${exp.spec || exp.typ} ${zuege}: „${text(e)}“ ${e.getAttribute("font-size")} px`);
  }
});

test("L-034: zweistufige Bäume nutzen die Breite des Übungsbilds (mindestens 90 % von 279 px), nichts überlappt", () => {
  for (const [exp, zuege, mit] of hochkantFaelle.filter(([, zuege]) => zuege === 2)) for (const zeigePfad of [true, false]) {
    const g = svgEl("g");
    const groesse = zeichneBaumIn(g, baueBaum(exp, zuege, mit), { zeigePfad });
    const fall = `${exp.spec || exp.typ} ${mit ? "mit" : "ohne"}${zeigePfad ? " gelöst" : ""}`;
    assert.ok(hat(g, "baum-hochkant"), fall);
    assert.ok(groesse.breite >= 0.9 * MAX_BREITE && groesse.breite <= MAX_BREITE, `${fall}: ${groesse.breite} px`);
    keineUeberlappung(assert, boxen(g));
  }
});
