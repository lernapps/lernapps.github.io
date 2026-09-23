// Use Case: Modell der Zufallsversuche und Baumdiagramme (Grundlage aller Kompetenzen).
import { test } from "node:test";
import assert from "node:assert/strict";
import { baueBaum, blaetter, pfadWahrscheinlichkeit, ereignisPfade, ereignisWahrscheinlichkeit, alleKnoten } from "../js/modell/baum.js";
import { parseEreignis } from "../js/modell/ereignis.js";
import { urne, muenze, wuerfelSechs } from "../js/modell/experimente.js";
import { bruch } from "../../kern/js/bruch.js";

test("Baum mit Zurücklegen: Wahrscheinlichkeiten bleiben gleich", () => {
  const b = baueBaum(urne("3r2b1g"), 2, true);
  assert.equal(b.zuege, 2);
  assert.equal(b.wurzel.kinder.length, 3);
  const bl = blaetter(b);
  assert.equal(bl.length, 9);
  const rr = bl.find((k) => k.pfad.join("") === "rr");
  assert.deepEqual(rr.wahrscheinlichkeit, bruch(1, 2));
  assert.deepEqual(rr.pfadWahrscheinlichkeit, bruch(1, 4));
  const summe = bl.reduce((s, k) => s.z * k.pfadWahrscheinlichkeit.n + k.pfadWahrscheinlichkeit.z * s.n === 0 ? s : { z: s.z * k.pfadWahrscheinlichkeit.n + k.pfadWahrscheinlichkeit.z * s.n, n: s.n * k.pfadWahrscheinlichkeit.n }, { z: 0, n: 1 });
  assert.equal(summe.z / summe.n, 1);
});

test("Baum ohne Zurücklegen: Nenner werden kleiner, leere Zweige entfallen", () => {
  const b = baueBaum(urne("3r2b1g"), 3, false);
  const gr = b.wurzel.kinder.find((k) => k.ergebnis === "g");
  assert.deepEqual(gr.wahrscheinlichkeit, bruch(1, 6));
  assert.equal(gr.kinder.length, 2, "kein gelb mehr in der Urne");
  const grr = gr.kinder.find((k) => k.ergebnis === "r");
  assert.deepEqual(grr.wahrscheinlichkeit, bruch(3, 5));
  assert.equal(grr.kinder[0].gesamt, 4, "unverkürzter Nenner");
  assert.equal(grr.kinder[0].anzahl, 2);
  assert.equal(blaetter(b).every((k) => k.stufe === 3), true);
  assert.deepEqual(pfadWahrscheinlichkeit(b, ["g", "r", "r"]), bruch(1, 20));
  assert.equal(pfadWahrscheinlichkeit(b, ["g", "g"]), null);
});

test("Münze und Würfel-Baum", () => {
  const m = baueBaum(muenze(), 3, true);
  assert.equal(blaetter(m).length, 8);
  assert.deepEqual(blaetter(m)[0].pfadWahrscheinlichkeit, bruch(1, 8));
  const w = baueBaum(wuerfelSechs(), 2, true);
  assert.deepEqual(pfadWahrscheinlichkeit(w, ["k", "k"]), bruch(25, 36));
  assert.equal(alleKnoten(w).length, 2 + 4, "ohne Wurzel");
  assert.ok(alleKnoten(w).every((k) => typeof k.id === "string"));
});

test("Ereignisse werden in Pfade übersetzt", () => {
  const exp = urne("3r2b1g");
  const b = baueBaum(exp, 2, false);
  const genau1r = parseEreignis("genau1r", exp, 2);
  assert.equal(genau1r.gueltig, true);
  assert.equal(genau1r.name, "genau einmal rot");
  const pf = ereignisPfade(b, genau1r);
  assert.deepEqual(pf.map((k) => k.pfad.join("")).sort(), ["br", "gr", "rb", "rg"]);
  assert.deepEqual(ereignisWahrscheinlichkeit(b, genau1r), bruch(3, 5));
  assert.deepEqual(ereignisWahrscheinlichkeit(b, parseEreignis("mind1r", exp, 2)), bruch(4, 5));
  assert.deepEqual(ereignisWahrscheinlichkeit(b, parseEreignis("keinr", exp, 2)), bruch(1, 5));
  assert.deepEqual(ereignisWahrscheinlichkeit(b, parseEreignis("beidegleich", exp, 2)), bruch(4, 15));
  assert.deepEqual(ereignisWahrscheinlichkeit(b, parseEreignis("rr", exp, 2)), bruch(1, 5));
  assert.deepEqual(ereignisWahrscheinlichkeit(b, parseEreignis("verschieden", exp, 2)), bruch(11, 15));
  assert.equal(parseEreignis("rrr", exp, 2).gueltig, false, "Pfadlänge passt nicht");
  assert.equal(parseEreignis("xx", exp, 2).gueltig, false);
  assert.equal(parseEreignis("hoechstens1r", exp, 2).name, "höchstens einmal rot");
  assert.equal(parseEreignis("kz", muenze(), 2).name, "erst Kopf, dann Zahl");
});
