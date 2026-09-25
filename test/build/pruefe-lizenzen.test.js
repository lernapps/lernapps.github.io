// Use Case: Abhängigkeit aufnehmen – jede Abhängigkeit in package-lock.json trägt eine Lizenz aus der Allowlist
// (ausgeliefert: nur permissiv; dev: zusätzlich MPL-2.0), jede Datei unter src/**/vendor/ einen Lizenzkopf
// (Harness-Rad: license-compliance, ADR-029). Läuft in `npm test`, also im Pflicht-Check test-und-build.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  lizenzErlaubt, pruefeLizenzen, pruefeVendorKoepfe, vendorDateien, ERLAUBT_AUSGELIEFERT, ERLAUBT_DEV,
} from "../../lib/pruefe-lizenzen.js";

const WURZEL = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

const lock = (pakete) => ({ lockfileVersion: 3, packages: { "": { name: "lern-apps" }, ...pakete } });

test("die Allowlists: ausgeliefert nur permissiv, dev zusätzlich MPL-2.0", () => {
  assert.ok(ERLAUBT_AUSGELIEFERT.has("MIT") && ERLAUBT_AUSGELIEFERT.has("Python-2.0"));
  assert.ok(!ERLAUBT_AUSGELIEFERT.has("MPL-2.0"));
  assert.ok(ERLAUBT_DEV.has("MPL-2.0") && ERLAUBT_DEV.has("Apache-2.0"));
  assert.ok(!ERLAUBT_DEV.has("GPL-3.0"));
});

test("SPDX-Ausdrücke: OR reicht ein erlaubter Teil, AND braucht alle, Klammern zählen", () => {
  assert.equal(lizenzErlaubt("MIT", ERLAUBT_AUSGELIEFERT), true);
  assert.equal(lizenzErlaubt("(MIT OR GPL-3.0)", ERLAUBT_AUSGELIEFERT), true);
  assert.equal(lizenzErlaubt("(MIT AND GPL-3.0)", ERLAUBT_AUSGELIEFERT), false);
  assert.equal(lizenzErlaubt("(MIT AND Apache-2.0)", ERLAUBT_AUSGELIEFERT), true);
  assert.equal(lizenzErlaubt("GPL-3.0 OR (MIT AND ISC)", ERLAUBT_AUSGELIEFERT), true);
  assert.equal(lizenzErlaubt("(GPL-3.0 OR LGPL-2.1) AND MIT", ERLAUBT_AUSGELIEFERT), false);
  assert.equal(lizenzErlaubt("MPL-2.0", ERLAUBT_AUSGELIEFERT), false);
  assert.equal(lizenzErlaubt("MPL-2.0", ERLAUBT_DEV), true);
  assert.equal(lizenzErlaubt("", ERLAUBT_DEV), false);
});

test("ein heiles Lockfile hat keine Befunde, dev darf MPL-2.0", () => {
  const fehler = pruefeLizenzen(lock({
    "node_modules/a": { version: "1.0.0", license: "MIT" },
    "node_modules/axe-core": { version: "4.0.0", license: "MPL-2.0", dev: true },
    "node_modules/b": { version: "1.0.0", license: "(MIT OR Apache-2.0)", dev: true, optional: true },
  }));
  assert.deepEqual(fehler, []);
});

test("GPL-3.0 fällt durch – mit Paket, Lizenz und Hinweis auf ein ADR", () => {
  const fehler = pruefeLizenzen(lock({ "node_modules/boese": { version: "2.0.0", license: "GPL-3.0", dev: true } }));
  assert.equal(fehler.length, 1);
  assert.match(fehler[0], /boese@2\.0\.0/);
  assert.match(fehler[0], /GPL-3\.0/);
  assert.match(fehler[0], /ADR/);
});

test("eine fehlende Lizenz fällt durch", () => {
  const fehler = pruefeLizenzen(lock({ "node_modules/@x/ohne": { version: "0.1.0", dev: true } }));
  assert.equal(fehler.length, 1);
  assert.match(fehler[0], /@x\/ohne@0\.1\.0: keine Lizenz/);
});

test("MPL-2.0 in einem ausgelieferten (Nicht-dev-)Paket fällt durch", () => {
  const fehler = pruefeLizenzen(lock({ "node_modules/c": { version: "1.0.0", license: "MPL-2.0" } }));
  assert.equal(fehler.length, 1);
  assert.match(fehler[0], /ausgeliefert/);
});

test("verschachtelte Pakete und Workspace-Links: Name aus dem letzten node_modules-Segment, Links übersprungen", () => {
  const fehler = pruefeLizenzen(lock({
    "node_modules/a/node_modules/@s/b": { version: "1.0.0", license: "WTFPL", dev: true },
    "pakete/lokal": { link: true, resolved: "pakete/lokal" },
  }));
  assert.deepEqual(fehler.map((f) => f.split(":")[0]), ["@s/b@1.0.0"]);
});

test("ein Lockfile ohne packages (v1) ist ein Fehler, keine stille Freigabe", () => {
  assert.equal(pruefeLizenzen({ lockfileVersion: 1 }).length, 1);
});

test("Vendor-Dateien brauchen einen Lizenzkopf in den ersten 10 Zeilen", () => {
  const fehler = pruefeVendorKoepfe({
    "src/kern/vendor/a.js": "/*! A v1\n *\n * MIT License · Copyright (c) 2026 X\n */",
    "src/kern/vendor/b.js": "// SPDX-License-Identifier: Apache-2.0\nexport {};",
    "src/x/vendor/c.js": "export const c = 1;\n".repeat(20) + "// License: MIT",
  });
  assert.equal(fehler.length, 1);
  assert.match(fehler[0], /src\/x\/vendor\/c\.js/);
});

test("das echte Repo: package-lock.json und alle src/**/vendor/-Dateien bestehen", () => {
  const lockfile = JSON.parse(fs.readFileSync(path.join(WURZEL, "package-lock.json"), "utf8"));
  assert.deepEqual(pruefeLizenzen(lockfile), []);
  const dateien = vendorDateien(path.join(WURZEL, "src"));
  assert.ok(Object.keys(dateien).some((d) => d.endsWith("vendor/talkitover.js")));
  assert.deepEqual(pruefeVendorKoepfe(dateien), []);
});
