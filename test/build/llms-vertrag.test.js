// Use Case: KI-Tutor verlinkt eine konkrete Aufgabe (TD-3). Build bricht ab, wenn llms.txt oder tutor.md einen
// Deep Link, Parameter, Wert oder Anker nennen, den die App nicht annimmt – oder einen Parameter verschweigen.
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  findeLinks, pruefeLink, pruefeVorgaben, pruefeParameterDoku, pruefeUebersicht, dokumentierteWerte, erlaubeHerkunft, herkunftKollision,
} from "../../lib/llms-vertrag.js";
import { leseVorgaben } from "../../src/kern/js/aufgabenlink.js";
import { erzeugeZufall } from "../../src/kern/js/zufall.js";

const BASIS = "https://x.org/app/";

test("findet Deep Links im Fließtext und Abfragen in der Parameter-Übersicht", () => {
  const text = [
    `Beispiel: ${BASIS}a.html?m=2&n=3&seed=1#uebung (Lösung),`,
    `Test: ${BASIS}test.html?nr=<Nummer>&modus=schnell.`,
    `Start: ${BASIS}`,
    "| a.html | m, n, seed | ?m=1&n=4&seed=1 |",
  ].join("\n");
  const links = findeLinks(text, BASIS);
  assert.deepEqual(links.map((l) => l.seite), ["a.html", "test.html", "index.html", "a.html"]);
  assert.deepEqual(links[0].parameter, [["m", "2"], ["n", "3"], ["seed", "1"]]);
  assert.equal(links[0].anker, "uebung");
  assert.deepEqual(links[1].parameter, [["nr", "<Nummer>"], ["modus", "schnell"]]);
  assert.equal(links[3].anker, undefined);
});

const SEITEN = new Map([
  ["a.html", { parameter: ["m", "n", "seed", "nr"], anker: new Set(["uebung", "video"]) }],
  ["test.html", { parameter: ["nr", "seed", "modus"], werte: { modus: ["voll", "schnell"] }, anker: new Set() }],
  ["llms.txt", { parameter: [] }],
]);
const link = (seite, query = "", anker) => ({ roh: `${seite}?${query}`, seite, parameter: [...new URLSearchParams(query)], anker });

test("unbekannte Seite, unbekannter Parameter, fehlender Anker und falscher Wert sind Fehler", () => {
  assert.deepEqual(pruefeLink("llms.txt", link("a.html", "m=1&seed=2", "uebung"), SEITEN), []);
  assert.deepEqual(pruefeLink("llms.txt", link("test.html", "nr=<Nummer>&modus=schnell"), SEITEN), []);
  assert.match(pruefeLink("llms.txt", link("b.html"), SEITEN)[0], /Seite b\.html gibt es nicht/);
  assert.match(pruefeLink("llms.txt", link("a.html", "q=1"), SEITEN)[0], /Parameter q/);
  assert.match(pruefeLink("llms.txt", link("a.html", "", "regel"), SEITEN)[0], /Anker #regel/);
  assert.match(pruefeLink("llms.txt", link("test.html", "modus=kurz"), SEITEN)[0], /modus=kurz/);
  assert.match(pruefeLink("llms.txt", link("a.html", "seed=abc"), SEITEN)[0], /seed=abc/);
});

// Generator: m (1–5) wählt den Faktor, var=x|a die Variable; alles andere zufällig.
const MODUL = {
  URL_ZAHLEN: ["m"],
  URL_TEXTE: ["var"],
  erzeugeAufgabe(zufall, v = {}) {
    const m = Number.isInteger(v.m) && v.m >= 1 && v.m <= 5 ? v.m : zufall.ganzzahl(1, 5);
    const x = ["x", "a"].includes(v.var) ? v.var : zufall.wahl(["x", "a"]);
    return { text: `${m}${x}` };
  },
};
const HILFEN = { leseVorgaben, erzeugeZufall };

test("dokumentierte Werte muss der Generator annehmen und verwenden", () => {
  assert.deepEqual(pruefeVorgaben("llms.txt", link("a.html", "m=2&var=a&seed=3"), MODUL, HILFEN), []);
  assert.deepEqual(pruefeVorgaben("llms.txt", link("a.html", "m=2,5"), MODUL, HILFEN).length, 1, "2,5 liest die App, der Generator verwirft es");
  assert.match(pruefeVorgaben("llms.txt", link("a.html", "m=-1"), MODUL, HILFEN)[0], /m=-1 verwirft die App/);
  assert.match(pruefeVorgaben("llms.txt", link("a.html", "var=z"), MODUL, HILFEN)[0], /var=z ändert die Aufgabe nicht/);
  assert.match(pruefeVorgaben("llms.txt", link("a.html", "m=9"), MODUL, HILFEN)[0], /m=9 ändert die Aufgabe nicht/);
});

test("ein Standardwert ist kein Fehler, wenn ein anderer dokumentierter Wert die Aufgabe ändert", () => {
  // var=x ohne m: der Generator nimmt x als Standard, sobald m in der URL steht.
  const mitStandard = { ...MODUL, erzeugeAufgabe: (z, v = {}) => MODUL.erzeugeAufgabe(z, v.m && !v.var ? { ...v, var: "x" } : v) };
  const l = link("a.html", "m=2&var=x");
  assert.match(pruefeVorgaben("llms.txt", l, mitStandard, HILFEN)[0], /var=x ändert die Aufgabe nicht/);
  assert.deepEqual(pruefeVorgaben("llms.txt", l, mitStandard, HILFEN, new Map([["var", new Set(["x", "a"])]])), []);
});

test("Alternativen entschuldigen keinen Wert, den der Generator verwirft und durch Zufall ersetzt", () => {
  const alternativen = new Map([["var", new Set(["x", "a"])]]);
  assert.match(pruefeVorgaben("llms.txt", link("a.html", "m=2&var=z"), MODUL, HILFEN, alternativen)[0], /var=z ändert die Aufgabe nicht/);
});

test("ein Generator, der wirft, ist ein Fehler", () => {
  const kaputt = { ...MODUL, erzeugeAufgabe() { throw new Error("kaputt"); } };
  assert.match(pruefeVorgaben("llms.txt", link("a.html", "m=2"), kaputt, HILFEN)[0], /kaputt/);
});

test("jeder Parameter des Generators steht im Abschnitt seiner Seite", () => {
  const text = [
    `### 1 Eins – ${BASIS}a.html`,
    "Parameter: `m` (Faktor), `var=x|a`, `seed`.",
    `### 2 Zwei – ${BASIS}b.html`,
    "Parameter: `k`.",
    "## Parameter-Übersicht",
  ].join("\n");
  assert.deepEqual(pruefeParameterDoku("llms.txt", text, BASIS, "a.html", ["m", "var"]), []);
  assert.match(pruefeParameterDoku("llms.txt", text, BASIS, "b.html", ["k", "var"])[0], /b\.html: Parameter var nimmt/);
  assert.match(pruefeParameterDoku("llms.txt", text, BASIS, "c.html", ["m"])[0], /Abschnitt .*c\.html/);
});

test("die Parameter-Übersicht nennt nur Parameter, die die Seite annimmt; sie zählt als Doku", () => {
  const text = [
    "| Seite | Parameter | Beispiel |",
    "|-------|-----------|----------|",
    "| test.html | nr (oder seed), modus=voll/schnell | ?nr=4711&modus=schnell |",
    "| a.html | m oder n, var=x/a, seed | ?m=1&seed=1 |",
  ].join("\n");
  const seiten = new Map([...SEITEN, ["a.html", { parameter: ["m", "n", "var", "seed", "nr"] }]]);
  assert.deepEqual(pruefeUebersicht("llms.txt", text, seiten), []);
  const falsch = text.replace("var=x/a", "var=x/a, schwer");
  assert.match(pruefeUebersicht("llms.txt", falsch, seiten)[0], /a\.html: Parameter schwer/);
  assert.deepEqual(pruefeParameterDoku("llms.txt", `### 1 A – ${BASIS}a.html\n\n${text}`, BASIS, "a.html", ["m", "var"]), []);
});

test("Parameter aus dem Abschnitt für alle Seiten zählen als Doku", () => {
  const text = `## URL-Parameter und Anker (alle Seiten)\n- \`wuerfel=2\` Kurzform\n## Seiten\n### 1 A – ${BASIS}a.html\nParameter: \`m\`.`;
  assert.deepEqual(pruefeParameterDoku("llms.txt", text, BASIS, "a.html", ["m", "wuerfel"]), []);
});

test("dokumentierte Wertelisten wie `zuege=2|3` liefern Alternativen", () => {
  const werte = dokumentierteWerte("- `zuege=2|3` Züge, `experiment=urne|muenze`, `urne=3r2b1g`, `ereignis=<Code>`");
  assert.deepEqual([...werte.get("zuege")], ["2", "3"]);
  assert.deepEqual([...werte.get("experiment")], ["urne", "muenze"]);
  assert.deepEqual([...werte.get("urne")], ["3r2b1g"]);
  assert.equal(werte.has("ereignis"), false);
});

test("von=tutor ist auf jeder Seite erlaubt, aber nur mit dem Wert tutor (ADR-021)", () => {
  const seiten = erlaubeHerkunft(SEITEN);
  assert.deepEqual(pruefeLink("tutor.md", link("a.html", "m=1&seed=2&von=tutor", "uebung"), seiten), []);
  assert.deepEqual(pruefeLink("tutor.md", link("test.html", "nr=<Nummer>&modus=schnell&von=tutor"), seiten), []);
  assert.match(pruefeLink("tutor.md", link("a.html", "von=claude"), seiten)[0], /von=claude \(erlaubt: tutor\)/);
  assert.match(pruefeLink("tutor.md", link("a.html", "von=<Quelle>"), seiten)[0], /von=<Quelle> \(erlaubt: tutor\)/);
  assert.match(pruefeLink("llms.txt", link("llms.txt", "von=tutor"), seiten)[0], /Parameter von/, "nur HTML-Seiten");
  assert.deepEqual(SEITEN.get("a.html").parameter, ["m", "n", "seed", "nr"], "die Eingabe bleibt unverändert");
});

test("von=tutor ist kein Aufgabenparameter: er muss die Aufgabe nicht ändern", () => {
  assert.deepEqual(pruefeVorgaben("tutor.md", link("a.html", "m=2&seed=3&von=tutor"), MODUL, HILFEN), []);
  assert.deepEqual(pruefeVorgaben("tutor.md", link("a.html", "von=tutor"), MODUL, HILFEN), []);
});

test("ein Generator darf den Parameter von nicht selbst belegen", () => {
  assert.deepEqual(herkunftKollision("a.html", ["m", "n"]), []);
  assert.match(herkunftKollision("a.html", ["von"])[0], /a\.html: der Generator belegt den Parameter von/);
});
