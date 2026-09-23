// Use Case: Grundwert, Prozentwert und Prozentsatz erkennen – Generator und Prüfer.
import { test } from "node:test";
import assert from "node:assert/strict";
import { erzeugeZufall } from "../../kern/js/zufall.js";
import { erzeugeAufgabe, pruefeAntwort, ROLLEN } from "../js/aufgaben/grundbegriffe.js";

test("erzeugeAufgabe liefert drei Zuordnungsfelder, eines davon 'gesucht'", () => {
  const z = erzeugeZufall(41);
  const gesuchte = new Set();
  for (let i = 0; i < 60; i++) {
    const a = erzeugeAufgabe(z);
    gesuchte.add(a.gesucht);
    assert.equal(a.thema, "grundbegriffe");
    assert.equal(a.felder.length, 3);
    assert.ok(a.felder.every((f) => f.typ === "auswahl" && f.optionen.length === 3));
    assert.equal(a.felder[2].id, "gesucht");
    assert.ok(a.felder[2].label.startsWith("Gesucht"));
    const rollen = a.felder.map((f) => a.loesung[f.id]).sort();
    assert.deepEqual(rollen, ["G", "W", "p"]);
    assert.ok(a.text.length > 30);
  }
  assert.deepEqual([...gesuchte].sort(), ["G", "W", "p"]);
  assert.deepEqual(ROLLEN.map((r) => r.wert), ["G", "W", "p"]);
});

test("Vorgabe ?gesucht= legt die gesuchte Größe fest", () => {
  assert.equal(erzeugeAufgabe(erzeugeZufall(1), { gesucht: "g" }).gesucht, "G");
  assert.equal(erzeugeAufgabe(erzeugeZufall(1), { gesucht: "p" }).gesucht, "p");
  assert.equal(erzeugeAufgabe(erzeugeZufall(1), { gesucht: "w" }).gesucht, "W");
});

test("pruefeAntwort bewertet jedes Feld und erkennt G/W vertauscht", () => {
  const a = erzeugeAufgabe(erzeugeZufall(1), { gesucht: "p" });
  const richtig = { ...a.loesung };
  assert.equal(pruefeAntwort(a, richtig).korrekt, true);
  const vertauscht = { ...richtig };
  const gId = a.felder.find((f) => richtig[f.id] === "G").id;
  const wId = a.felder.find((f) => richtig[f.id] === "W").id;
  vertauscht[gId] = "W";
  vertauscht[wId] = "G";
  const e = pruefeAntwort(a, vertauscht);
  assert.equal(e.korrekt, false);
  assert.equal(e.fehler, "g-w-vertauscht");
  assert.equal(e.felder[gId].korrekt, false);
  assert.equal(e.felder.gesucht.korrekt, true);
  assert.equal(pruefeAntwort(a, { ...richtig, gesucht: "" }).fehler, "unvollstaendig");
});
