// Use Case: gemeinsame Bausteine der Formel-Kompetenzen 2–4 (js/aufgaben/binom.js).
// BR-B4 Binom aus URL-Vorgaben m, n, var, glied oder zufällig mit kleinen Zahlen; deterministisch je Aufgabennummer.
// BR-B5 Fehldiagnose: der erste passende Kandidat in fester Reihenfolge; Kandidaten, die dem richtigen Term gleichen, zählen nicht.
import { test } from "node:test";
import assert from "node:assert/strict";
import { erzeugeZufall } from "../../kern/js/zufall.js";
import { waehleBinom, nichtQuadriert, diagnose } from "../js/aufgaben/binom.js";
import { alsAnzeige, alsEingabe, glied } from "../js/aufgaben/terme.js";

test("BR-B4: Vorgaben ?m=3&n=2&var=a&glied=variable → 3a und 2b", () => {
  const b = waehleBinom(erzeugeZufall(1), { m: 3, n: 2, var: "a", glied: "variable" });
  assert.equal(alsAnzeige([b.u, b.v]), "3a + 2b");
  const c = waehleBinom(erzeugeZufall(1), { m: 1, n: 4 });
  assert.equal(alsAnzeige([c.u, c.v]), "x + 4", "nur Zahlen: Variable x, zweites Glied eine Zahl");
});

test("BR-B4: zufällige Binome sind klein, beide Arten kommen vor, gleiche Nummer → gleiches Binom", () => {
  const arten = new Set();
  for (let s = 1; s <= 80; s++) {
    const b = waehleBinom(erzeugeZufall(s), {});
    arten.add(`${b.variable}-${b.glied}`);
    assert.ok(b.m >= 1 && b.m <= 5 && b.n >= 1 && b.n <= 9, `${b.m} ${b.n}`);
    if (b.glied === "variable") assert.notEqual(b.m, b.n);
    assert.deepEqual(waehleBinom(erzeugeZufall(s), {}), b);
  }
  assert.deepEqual([...arten].sort(), ["a-variable", "a-zahl", "x-variable", "x-zahl"]);
});

test("BR-B5: nichtQuadriert liefert (3a)² als 3a² und 2b² statt 4b², mit Mittelglied", () => {
  const kandidaten = nichtQuadriert(glied(3, "a"), glied(2, "b"), glied(12, "a", "b")).map(alsEingabe);
  assert.deepEqual(kandidaten, ["3a^2+12ab+4b^2", "9a^2+12ab+2b^2", "3a^2+12ab+2b^2"]);
  assert.deepEqual(nichtQuadriert(glied(1, "x"), glied(1), glied(2, "x")), []);
});

test("BR-B5: diagnose nimmt den ersten passenden Kandidaten", () => {
  const regeln = [["binom-vergessen", ["x^2+9"]], ["faktor-2-vergessen", ["x^2+3x+9"]]];
  assert.equal(diagnose("x²+9", "x^2+6x+9", regeln), "binom-vergessen");
  assert.equal(diagnose("9+3x+x^2", "x^2+6x+9", regeln), "faktor-2-vergessen");
  assert.equal(diagnose("x^2+5", "x^2+6x+9", regeln), "falsch");
  assert.equal(diagnose("x^2+6x+9", "x^2+6x+9", [["egal", ["x^2+6x+9"]]]), "falsch", "gleich dem richtigen Term → kein Fehlerkandidat");
});
