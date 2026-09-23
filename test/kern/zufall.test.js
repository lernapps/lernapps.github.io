import { test } from "node:test";
import assert from "node:assert/strict";
import { mulberry32, erzeugeZufall, leseSeed, zufaelligeAufgabennummer } from "../../src/kern/js/zufall.js";

test("mulberry32 ist deterministisch", () => {
  const a = mulberry32(42);
  const b = mulberry32(42);
  const werteA = [a(), a(), a()];
  const werteB = [b(), b(), b()];
  assert.deepEqual(werteA, werteB);
  werteA.forEach((w) => assert.ok(w >= 0 && w < 1));
  assert.notDeepEqual(werteA, [mulberry32(43)(), mulberry32(43)(), mulberry32(43)()]);
});

test("erzeugeZufall liefert Ganzzahlen im Bereich und Auswahl", () => {
  const z = erzeugeZufall(7);
  for (let i = 0; i < 200; i++) {
    const n = z.ganzzahl(3, 5);
    assert.ok(Number.isInteger(n) && n >= 3 && n <= 5);
  }
  const liste = ["a", "b", "c"];
  assert.ok(liste.includes(z.wahl(liste)));
  const gemischt = z.mischen([1, 2, 3, 4]);
  assert.deepEqual([...gemischt].sort(), [1, 2, 3, 4]);
  assert.equal(z.seed, 7);
});

test("erzeugeZufall ohne Seed ist zufaellig, mit Seed reproduzierbar", () => {
  const a = erzeugeZufall(99).ganzzahl(0, 1000000);
  const b = erzeugeZufall(99).ganzzahl(0, 1000000);
  assert.equal(a, b);
  const c = erzeugeZufall();
  assert.ok(Number.isInteger(c.seed) && c.seed >= 1 && c.seed <= 9999);
});

test("zufaelligeAufgabennummer ist eine Ganzzahl von 1 bis 9999 (vorlesbar)", () => {
  for (let i = 0; i < 2000; i++) {
    const n = zufaelligeAufgabennummer();
    assert.ok(Number.isInteger(n) && n >= 1 && n <= 9999, `n=${n}`);
  }
  assert.ok(new Set(Array.from({ length: 200 }, zufaelligeAufgabennummer)).size > 50);
});

test("leseSeed liest ?seed= aus einem Query-String", () => {
  assert.equal(leseSeed("?seed=42"), 42);
  assert.equal(leseSeed("?g=250&seed=7&p=12"), 7);
  assert.equal(leseSeed("?seed=abc"), undefined);
  assert.equal(leseSeed(""), undefined);
  assert.equal(leseSeed("?seed=123456789"), 123456789, "große Nummern aus der URL bleiben gültig");
});

test("leseSeed nimmt nr= als Alias; bei beiden gewinnt seed", () => {
  assert.equal(leseSeed("?nr=42"), 42);
  assert.equal(leseSeed("?g=250&nr=7&p=12"), 7);
  assert.equal(leseSeed("?nr=5&seed=7"), 7);
  assert.equal(leseSeed("?seed=7&nr=5"), 7);
  assert.equal(leseSeed("?nr=abc"), undefined);
});
