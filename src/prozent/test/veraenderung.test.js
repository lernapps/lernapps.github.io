// Use Case: Prozentuale Zunahme und Abnahme – Generator und Prüfer.
import { test } from "node:test";
import assert from "node:assert/strict";
import { erzeugeZufall } from "../../kern/js/zufall.js";
import { istSchoen } from "../../kern/js/zahlen.js";
import { erzeugeAufgabe, pruefeAntwort } from "../js/aufgaben/veraenderung.js";

test("erzeugeAufgabe liefert beide Typen mit schönen Zahlen", () => {
  const z = erzeugeZufall(21);
  const typen = new Set();
  for (let i = 0; i < 80; i++) {
    const a = erzeugeAufgabe(z);
    typen.add(a.typ);
    assert.equal(a.thema, "veraenderung");
    assert.ok(["plus", "minus"].includes(a.richtung));
    assert.ok(istSchoen(a.alt) && istSchoen(a.neu), `${a.alt} → ${a.neu}`);
    assert.ok(a.richtung === "plus" ? a.neu > a.alt : a.neu < a.alt);
    assert.equal(a.felder.length, 1);
    assert.equal(a.felder[0].id, a.typ);
    assert.ok(a.rechenweg.length >= 3);
  }
  assert.deepEqual([...typen].sort(), ["alt", "neu"]);
});

test("Vorgaben ?alt=&p=&richtung= erzeugen die Aufgabe 'neu'", () => {
  const a = erzeugeAufgabe(erzeugeZufall(1), { alt: 80, p: 25, richtung: "minus" });
  assert.equal(a.typ, "neu");
  assert.deepEqual([a.alt, a.prozentsatz, a.neu], [80, 25, 60]);
  const b = erzeugeAufgabe(erzeugeZufall(1), { alt: 80, p: 25, richtung: "plus" });
  assert.equal(b.neu, 100);
});

test("Vorgaben ?neu=&p=&richtung= erzeugen die Aufgabe 'alt'", () => {
  const a = erzeugeAufgabe(erzeugeZufall(1), { neu: 60, p: 25, richtung: "minus" });
  assert.equal(a.typ, "alt");
  assert.equal(a.alt, 80);
  assert.equal(erzeugeAufgabe(erzeugeZufall(1), { typ: "alt" }).typ, "alt");
  assert.equal(erzeugeAufgabe(erzeugeZufall(1), { typ: "neu" }).typ, "neu");
});

test("pruefeAntwort (neu) erkennt Richtung und reinen Prozentwert", () => {
  const a = erzeugeAufgabe(erzeugeZufall(1), { alt: 80, p: 25, richtung: "minus" });
  assert.equal(pruefeAntwort(a, { neu: "60" }).korrekt, true);
  assert.equal(pruefeAntwort(a, { neu: "100" }).fehler, "richtung-verwechselt");
  assert.equal(pruefeAntwort(a, { neu: "20" }).fehler, "nur-prozentwert");
  assert.equal(pruefeAntwort(a, { neu: "" }).fehler, "keine-zahl");
});

test("pruefeAntwort (alt) erkennt 'Grundwert = neuer Wert'", () => {
  const a = erzeugeAufgabe(erzeugeZufall(1), { neu: 60, p: 25, richtung: "minus" });
  assert.equal(pruefeAntwort(a, { alt: "80" }).korrekt, true);
  assert.equal(pruefeAntwort(a, { alt: "75" }).fehler, "grundwert-neuer-wert");
  const b = erzeugeAufgabe(erzeugeZufall(1), { neu: 100, p: 25, richtung: "plus" });
  assert.equal(pruefeAntwort(b, { alt: "80" }).korrekt, true);
  assert.equal(pruefeAntwort(b, { alt: "75" }).fehler, "grundwert-neuer-wert");
});

test("L-021: Faktor 1,125 steht ungerundet in Lösungsweg und Tipp", () => {
  for (const richtung of ["plus", "minus"]) {
    const a = erzeugeAufgabe(erzeugeZufall(1), { neu: richtung === "plus" ? 495 : 385, p: 12.5, richtung });
    const f = richtung === "plus" ? "1,125" : "0,875";
    assert.equal(a.alt, 440);
    assert.ok(a.rechenweg.some((z) => z.includes(`= ${f}`)), a.rechenweg.join(" | "));
    assert.ok(a.rechenweg.some((z) => z.includes(`: ${f} = `)), a.rechenweg.join(" | "));
    assert.ok(a.tipp.includes(f), a.tipp);
    assert.ok(!a.tipp.includes("1,13") && !a.tipp.includes("0,88"), a.tipp);
  }
});

test("L-021: gerundeter alter Wert aus URL-Vorgaben steht mit „≈“", () => {
  const a = erzeugeAufgabe(erzeugeZufall(1), { neu: 100, p: 3, richtung: "plus" });
  assert.match(a.rechenweg.at(-1), /≈ 97,09/);
});
