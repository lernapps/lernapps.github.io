// Use Case: Kompetenz 3 – ein Baumdiagramm zeichnen (baumdiagramm.html).
import { test } from "node:test";
import assert from "node:assert/strict";
import { erzeugeAufgabe, pruefeAntwort, zeichneBild } from "../js/aufgaben/baumdiagramm.js";
import { erzeugeZufall } from "../../kern/js/zufall.js";
import { leeresSvg, alsSvgText } from "../../kern/js/svg.js";

const z = (s) => erzeugeZufall(s);

test("Baumaufgabe aus Vorgaben: versteckte Zweige a, b, c, d", () => {
  const a = erzeugeAufgabe(z(5), { urne: "3r2b1g", zuege: 2, modus: "ohne" });
  assert.equal(a.thema, "baumdiagramm");
  assert.equal(a.experiment.typ, "urne");
  assert.equal(a.zuege, 2);
  assert.equal(a.mitZuruecklegen, false);
  assert.ok(a.versteckt.length >= 2 && a.versteckt.length <= 4);
  assert.deepEqual(a.felder.map((f) => f.id), ["a", "b", "c", "d"].slice(0, a.versteckt.length));
  assert.ok(a.versteckt.some((v) => v.stufe === 2), "mindestens ein Zweig der 2. Stufe");
});

test("Prüfung aller Eingaben einzeln", () => {
  const a = erzeugeAufgabe(z(5), { urne: "3r2b1g", zuege: 2, modus: "mit" });
  const richtig = Object.fromEntries(a.versteckt.map((v) => [v.buchstabe, `${v.anzahl}/${v.gesamt}`]));
  assert.equal(pruefeAntwort(a, richtig).korrekt, true);
  const f = pruefeAntwort(a, { ...richtig, a: "7/8" });
  assert.equal(f.korrekt, false);
  assert.equal(f.felder.a.korrekt, false);
  assert.equal(f.felder.b.korrekt, true);
  assert.equal(pruefeAntwort(a, {}).korrekt, false);
});

test("Münze, Würfel, Kurzformen und Zufall", () => {
  const m = erzeugeAufgabe(z(1), { experiment: "muenze", zuege: 3 });
  assert.equal(m.baum.zuege, 3);
  assert.ok(m.versteckt.every((v) => v.loesung.n === 2));
  const w = erzeugeAufgabe(z(1), { wuerfel: 2 });
  assert.equal(w.experiment.typ, "wuerfelSechs");
  assert.equal(w.zuege, 2);
  assert.equal(erzeugeAufgabe(z(1), { muenze: 2 }).experiment.typ, "muenze");
  for (let s = 0; s < 30; s++) {
    const x = erzeugeAufgabe(z(s));
    assert.ok([2, 3].includes(x.zuege));
    assert.ok(x.versteckt.length >= 2);
  }
});

test("Bild im Test: versteckte Zweige als Buchstaben, ohne Lösung", () => {
  const a = erzeugeAufgabe(z(5), { urne: "3r2b1g", zuege: 2, modus: "mit" });
  const svg = leeresSvg();
  zeichneBild(svg, a);
  const text = alsSvgText(svg);
  assert.match(text, /class="baum-buchstabe"[^>]*>a</);
  assert.doesNotMatch(text, new RegExp(`versteckt"[^>]*>${a.versteckt[0].anzahl}/${a.versteckt[0].gesamt}<`));
  assert.match(text, /versteckt"[^>]*>\?</);
});

test("L-045: Münze und Würfel haben Würfe, kein Ziehen und kein Zurücklegen; die Urne hat Züge", () => {
  for (const experiment of ["muenze", "wuerfel"]) for (let s = 0; s < 10; s++) {
    const a = erzeugeAufgabe(z(s), { experiment, zuege: 2 });
    const texte = [a.text, a.tipp, ...a.felder.map((f) => f.label), ...a.rechenweg].join(" ");
    assert.doesNotMatch(texte, /Zug|Zurücklegen|Kugel/, `${experiment} Seed ${s}`);
    assert.match(a.felder[0].label, /\d\. Wurf:/);
    assert.match(a.tipp, /Jeder Wurf ist wie der erste/);
  }
  const u = erzeugeAufgabe(z(1), { urne: "3r2b", zuege: 2, modus: "mit" });
  assert.match(u.felder[0].label, /\d\. Zug:/);
  assert.doesNotMatch(u.tipp, /Seiten/);
});
