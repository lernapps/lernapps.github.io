// Use Case: Architektur-Doku pflegen – asciidoc-linter (ADR-028) prüft src/docs; ERRORs brechen den Doku-Job,
// WARNINGs nicht. Der Wrapper scripts/doku-lint.js bewertet die JSON-Ausgabe (Harness-Rad: markdown-asciidoc-lint).
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { bewerte, bildDa } from "../../scripts/doku-lint.js";

const befund = (severity, rule_id, message, file = "src/docs/a.adoc") => ({ file, line: 3, severity, rule_id, message });

test("ERROR zählt als Fehler, WARNING und INFO nur als Warnung", () => {
  const r = bewerte([befund("error", "HEAD002", "skip"), befund("warning", "WS001", "ws"), befund("info", "IMG001", "alt")], () => false);
  assert.equal(r.fehler.length, 1);
  assert.equal(r.warnungen.length, 2);
  assert.deepEqual(r.unterdrueckt, []);
});

test("IMG001 'Image file not found' entfällt, wenn das Bild über :imagesdir: der Datei existiert", () => {
  const b = befund("warning", "IMG001", "Image file not found: arc42-logo.png");
  assert.equal(bewerte([b], () => true).unterdrueckt.length, 1);
  assert.equal(bewerte([b], () => false).warnungen.length, 1);
});

test("bildDa sucht relativ zur .adoc-Datei und ihrem :imagesdir:", () => {
  const dateien = new Set(["src/docs/images/logo.png"]);
  const lies = () => "= Titel\n:imagesdir: ../images\n";
  assert.equal(bildDa("src/docs/arc42/arc42.adoc", "logo.png", lies, (p) => dateien.has(p)), true);
  assert.equal(bildDa("src/docs/arc42/arc42.adoc", "fehlt.png", lies, (p) => dateien.has(p)), false);
  const ohne = () => "= Titel\n";
  assert.equal(bildDa("src/docs/images/x.adoc", "logo.png", ohne, (p) => dateien.has(p)), true);
});

test("doku.yml installiert den Linter und setup-python je an einem vollen Commit-SHA (ADR-028)", () => {
  const yml = fs.readFileSync(".github/workflows/doku.yml", "utf8");
  assert.match(yml, /ASCIIDOC_LINTER_SHA: [0-9a-f]{40}\n/);
  assert.match(yml, /asciidoc-linter@\$\{ASCIIDOC_LINTER_SHA\}/);
  assert.match(yml, /uses: actions\/setup-python@[0-9a-f]{40} /);
  assert.match(yml, /node scripts\/doku-lint\.js/);
});
