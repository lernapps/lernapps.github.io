// Use Case: Aufgaben erzeugen – schöne Zahlen, Kontexte und URL-Vorgaben für alle Prozent-Generatoren.
import { test } from "node:test";
import assert from "node:assert/strict";
import { erzeugeZufall } from "../../kern/js/zufall.js";
import { istSchoen } from "../../kern/js/zahlen.js";
import {
  basisFuer, waehleGrundwert, erzeugeTripel, KONTEXTE, PROZENTSAETZE, passenderKontext,
} from "../js/aufgaben/gemeinsam.js";
import { leseVorgaben } from "../../kern/js/aufgabenlink.js";

test("basisFuer liefert die kleinste Basis für glatte Prozentwerte", () => {
  assert.equal(basisFuer(25, 0), 4);
  assert.equal(basisFuer(20, 0), 5);
  assert.equal(basisFuer(12.5, 0), 8);
  assert.equal(basisFuer(12.5, 1), 4);
  assert.equal(basisFuer(3, 0), 100);
  assert.equal(basisFuer(50, 0), 2);
});

test("waehleGrundwert bleibt im Bereich und ist ein Vielfaches der Basis", () => {
  const z = erzeugeZufall(1);
  for (let i = 0; i < 100; i++) {
    const g = waehleGrundwert(z, 25, { min: 16, max: 32, nachkomma: 0 });
    assert.ok(g >= 16 && g <= 32 && g % 4 === 0, `g=${g}`);
  }
  assert.equal(waehleGrundwert(z, 3, { min: 16, max: 32, nachkomma: 0 }), undefined);
  for (let i = 0; i < 50; i++) {
    const g = waehleGrundwert(z, 50, { min: 20, max: 1500, nachkomma: 1, schritt: 5 });
    assert.equal(g % 5, 0, `g=${g}`);
  }
});

test("erzeugeTripel liefert schöne Zahlen in jedem Kontext", () => {
  const z = erzeugeZufall(5);
  for (const kontext of KONTEXTE) {
    for (let i = 0; i < 30; i++) {
      const t = erzeugeTripel(z, kontext);
      assert.ok(PROZENTSAETZE.includes(t.prozentsatz));
      assert.ok(t.grundwert >= kontext.min && t.grundwert <= kontext.max, `${kontext.id}: ${t.grundwert}`);
      assert.equal(t.grundwert % kontext.schritt, 0);
      assert.ok(istSchoen(t.prozentwert), `${kontext.id}: ${t.prozentwert}`);
      if (kontext.nachkomma === 0) assert.ok(Number.isInteger(t.prozentwert));
      assert.ok(Math.abs(t.grundwert * t.prozentsatz / 100 - t.prozentwert) < 1e-9);
    }
  }
});

test("erzeugeTripel ist mit Seed reproduzierbar", () => {
  const a = erzeugeTripel(erzeugeZufall(42), KONTEXTE[0]);
  const b = erzeugeTripel(erzeugeZufall(42), KONTEXTE[0]);
  assert.deepEqual(a, b);
});

test("leseVorgaben (Kern) liest die Prozent-Parameter wie die alte App", () => {
  assert.deepEqual(leseVorgaben("?g=250&p=12", ["g", "p"]), { g: 250, p: 12 });
  assert.deepEqual(leseVorgaben("?g=250&p=abc", ["g", "p"]), { g: 250 });
  assert.deepEqual(leseVorgaben("?g=-5&p=12,5", ["g", "p"]), { p: 12.5 });
  assert.deepEqual(leseVorgaben("?richtung=minus&p=12", ["p"], ["richtung"]), { p: 12, richtung: "minus" });
  assert.deepEqual(leseVorgaben("", ["g"]), {});
});

test("passenderKontext wählt einen Kontext, in dessen Bereich der Grundwert liegt", () => {
  const z = erzeugeZufall(2);
  assert.ok(["klasse", "sport", "preis"].includes(passenderKontext(z, 24).id));
  assert.equal(passenderKontext(z, 3000).id, "akku");
  assert.equal(passenderKontext(z, 99999).id, "neutral");
  assert.equal(passenderKontext(z, 99999).einheit, "");
});
