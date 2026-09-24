// Use Case: Architektur-Doku pflegen – arc42 8.16 verlinkt und bettet das Original-Harness-Rad mit unserem Stand ein (ADR-025).
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { SCHICHTEN, abdeckung, ZIELE } from "../../scripts/harness-rad.js";
import {
  ORIGINAL_SEITE, ORIGINAL_IDS, baueOriginalUrl, abdeckungImOriginal, schreibeOriginalAbschnitt,
} from "../../scripts/harness-rad-original.js";

const url = baueOriginalUrl(SCHICHTEN);
const teil = (u, name) => new URLSearchParams(new URL(u).hash.slice(1)).get(name)?.split(",") ?? [];

test("das Original kennt genau unsere 69 Schichten", () => {
  assert.equal(ORIGINAL_IDS.length, 69);
  assert.deepEqual([...ORIGINAL_IDS].sort(), SCHICHTEN.map((s) => s.id).sort());
});

test("die URL trägt Tier 2 in der Query und die Auswahl im Hash, wie das Original sie liest", () => {
  const u = new URL(url);
  assert.equal(`${u.origin}${u.pathname}`, ORIGINAL_SEITE);
  assert.equal(u.search, "?tier=2");
  assert.match(u.hash, /^#on=[a-z0-9,-]+&na=[a-z0-9,-]+$/);
});

test("vorhanden wird abgedeckt, entfällt wird nicht zutreffend, alles andere bleibt Lücke", () => {
  const on = teil(url, "on"), na = teil(url, "na");
  for (const s of SCHICHTEN) {
    assert.equal(on.includes(s.id), s.status === "vorhanden", `${s.id} (${s.status}) in on`);
    assert.equal(na.includes(s.id), s.status === "entfällt", `${s.id} (${s.status}) in na`);
  }
});

test("eine unbekannte Schicht bricht laut ab", () => {
  assert.throws(() => baueOriginalUrl([{ id: "gibt-es-nicht", status: "vorhanden", tier: 1 }]), /gibt-es-nicht/);
  assert.throws(() => baueOriginalUrl([{ id: "unit-test", status: "entfällt", tier: 2 }]), /unit-test/);
});

test("das Original rechnet aus der URL dieselbe Abdeckung wie unser Rad (Tier 2, n/a zählt nicht)", () => {
  const original = abdeckungImOriginal(url, SCHICHTEN);
  const unser = abdeckung(SCHICHTEN);
  assert.deepEqual(original, { abgedeckt: unser.vorhanden, imTier: unser.relevant });
});

test("der Abschnitt verlinkt die URL, lädt aber nichts: kein <iframe>, keine localStorage-Anleitung", () => {
  const adoc = schreibeOriginalAbschnitt(SCHICHTEN, abdeckung(SCHICHTEN));
  assert.ok(adoc.includes(`link:${url}[Unseren Stand im Original öffnen^]`));
  assert.ok(adoc.includes(`data-quelle="${url.replace(/&/g, "&amp;")}"`));
  assert.doesNotMatch(adoc, /<iframe/i);
  assert.doesNotMatch(adoc, /localStorage/);
  assert.match(adoc, /Beim Laden wird die Seite llm-coding\.github\.io \(GitHub Pages\) aufgerufen\./);
});

test("der eingecheckte Abschnitt entspricht dem Generator (node scripts/harness-rad.js)", () => {
  assert.equal(fs.readFileSync(ZIELE.original, "utf8"), schreibeOriginalAbschnitt(SCHICHTEN, abdeckung(SCHICHTEN)));
  assert.doesNotMatch(fs.readFileSync(ZIELE.adoc, "utf8"), /localStorage/);
});
