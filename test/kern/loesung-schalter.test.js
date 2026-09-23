// Use Case: Lösung ein- und ausblenden (Schalter "Lösung zeigen" / "Lösung verbergen").
import { test } from "node:test";
import assert from "node:assert/strict";
import { loesungZustand, LOESUNG_ZEIGEN, LOESUNG_VERBERGEN } from "../../src/kern/js/loesung-schalter.js";

test("verborgene Lösung: Knopf bietet Zeigen an, aria-expanded ist false", () => {
  assert.deepEqual(loesungZustand(false), { text: LOESUNG_ZEIGEN, expanded: "false", hidden: true });
  assert.equal(LOESUNG_ZEIGEN, "Lösung zeigen");
});

test("sichtbare Lösung: Knopf bietet Verbergen an, aria-expanded ist true", () => {
  assert.deepEqual(loesungZustand(true), { text: LOESUNG_VERBERGEN, expanded: "true", hidden: false });
  assert.equal(LOESUNG_VERBERGEN, "Lösung verbergen");
});

test("Zustand wechselt hin und zurück", () => {
  const an = loesungZustand(!loesungZustand(false).expanded.includes("true"));
  assert.equal(an.text, LOESUNG_VERBERGEN);
  assert.equal(loesungZustand(false).text, LOESUNG_ZEIGEN);
});
