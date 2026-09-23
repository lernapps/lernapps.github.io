// Use Case: Aufgabe über ihre Nummer und URL-Parameter wieder öffnen (öffentlicher Vertrag für den Tutor, siehe llms.txt).
import { test } from "node:test";
import assert from "node:assert/strict";
import { leseVorgaben, aufgabenHref } from "../../src/kern/js/aufgabenlink.js";

test("leseVorgaben liest nur gültige positive Zahlen", () => {
  assert.deepEqual(leseVorgaben("?g=250&p=12", ["g", "p"]), { g: 250, p: 12 });
  assert.deepEqual(leseVorgaben("?g=250&p=abc", ["g", "p"]), { g: 250 });
  assert.deepEqual(leseVorgaben("?g=-5&p=12,5", ["g", "p"]), { p: 12.5 });
  assert.deepEqual(leseVorgaben("", ["g"]), {});
});

test("leseVorgaben liest Texte nur aus Kleinbuchstaben, Ziffern und Bindestrich", () => {
  assert.deepEqual(leseVorgaben("?richtung=minus&p=12", ["p"], ["richtung"]), { p: 12, richtung: "minus" });
  assert.deepEqual(leseVorgaben("?von=CM", [], ["von"]), { von: "cm" });
  assert.deepEqual(leseVorgaben("?typ=cm-m", [], ["typ"]), { typ: "cm-m" });
  assert.deepEqual(leseVorgaben("?typ=<b>", [], ["typ"]), {});
});

test("aufgabenHref: Parameter mit Komma, Aufgabennummer als seed am Ende", () => {
  assert.equal(aufgabenHref("beispiel.html", { wert: 2.5, von: "m" }, 42), "beispiel.html?wert=2%2C5&von=m&seed=42");
  assert.equal(aufgabenHref("beispiel.html", {}, 7), "beispiel.html?seed=7");
});

test("leseVorgaben liest Texte, die mit einer Ziffer beginnen (Urneninhalt 3r2b1g)", () => {
  assert.deepEqual(leseVorgaben("?urne=3r2b1g&modus=ohne", [], ["urne", "modus"]), { urne: "3r2b1g", modus: "ohne" });
  assert.deepEqual(leseVorgaben("?urne=-3r", [], ["urne"]), {});
});
