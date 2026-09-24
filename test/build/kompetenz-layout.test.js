// Use Case: Kompetenzseite – die Erklärung steht vollständig im HTML, aufgeklappt; die Übung liegt außerhalb.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import fs from "node:fs";
import path from "node:path";

const layout = await readFile("src/_includes/kompetenz.njk", "utf8");

test("Warum, Regel, Beispiel, Bild und Video stehen in einem offenen <details id=\"erklaerung\">", () => {
  const start = layout.indexOf('<details id="erklaerung"');
  const ende = layout.indexOf("</details>");
  assert.ok(start > 0 && ende > start);
  assert.match(layout.slice(start, layout.indexOf(">", start)), /\sopen\b/);
  const innen = layout.slice(start, ende);
  for (const id of ["warum", "regel", "beispiel", "visualisierung", "video"]) assert.ok(innen.includes(`id="${id}"`), id);
  assert.ok(layout.indexOf('id="uebung"') > ende);
});

test("die Übung zeichnet mit bild.uebungFunktion, wenn es eine gibt, sonst mit bild.funktion", () => {
  assert.match(layout, /zeichne: \{\{ bild\.uebungFunktion or bild\.funktion \}\}/);
});

test("das Bild steht vor dem Video, die Summary nennt Bild vor Video", () => {
  const bild = layout.indexOf('id="visualisierung"');
  assert.ok(bild > 0);
  for (let i = layout.indexOf('id="video"'); i >= 0; i = layout.indexOf('id="video"', i + 1)) assert.ok(bild < i, "Bild vor Video");
  assert.match(layout, /<summary>Erklärung: Warum, Regel, Beispiel, Bild, Video<\/summary>/);
});

// Prüft zusätzlich die gebaute Ausgabe, wenn _site schon da ist (lokal nach npm run build; in CI läuft der Test vor dem Build).
const gebaut = fs.existsSync("_site") ? fs.readdirSync("_site", { recursive: true }).filter((p) => p.endsWith(".html")) : [];
test("gebaute Kompetenzseiten: #visualisierung vor #video", { skip: gebaut.length === 0 && "kein _site" }, () => {
  let geprueft = 0;
  for (const p of gebaut) {
    const html = fs.readFileSync(path.join("_site", p), "utf8");
    const bild = html.indexOf('id="visualisierung"');
    const video = html.indexOf('id="video"');
    if (bild < 0 || video < 0) continue;
    assert.ok(bild < video, p);
    geprueft++;
  }
  assert.ok(geprueft > 0);
});

test("serlo-Link: optional, nach dem Video, in der Erklärung, reiner Link mit rel=noopener", () => {
  const serlo = layout.indexOf('id="serlo"');
  assert.ok(serlo > 0, "Abschnitt #serlo fehlt");
  assert.ok(serlo < layout.indexOf("</details>"), "in <details>");
  assert.ok(serlo > layout.lastIndexOf('id="video"'), "nach dem Video");
  const block = layout.slice(layout.lastIndexOf("{% if serlo", serlo), layout.indexOf("{% endif %}", serlo));
  assert.match(block, /^\{% if serlo %\}/);
  assert.match(block, /<a href="\{\{ serlo\.url \}\}" rel="noopener">\{\{ serlo\.titel \}\}<\/a>/);
  assert.match(block, /bei serlo\.org/);
  assert.doesNotMatch(block, /<(iframe|img|script)\b/);
});

test("die Seite übergibt Nummer und Titel der Kompetenz für die Ergebniszeile an den Tutor (ADR-021)", () => {
  assert.match(layout, /const kompetenz = \{ nr: \{\{ k\.nr \}\}, titel: \{\{ k\.titel \| dump \| safe \}\} \};/);
  const aufrufe = [...layout.matchAll(/starteSeite\(\{[^\n]*\}\);/g)].map((m) => m[0]);
  assert.equal(aufrufe.length, 2);
  for (const a of aufrufe) assert.match(a, /\bkompetenz \}\);$/);
});

test("L-036: der Videokasten zeigt einen optionalen Hinweis aus video.hinweis", () => {
  const start = layout.indexOf('<section id="video" class="video-karte"');
  const kasten = layout.slice(start, layout.indexOf("</section>", start));
  assert.match(kasten, /\{% if video\.hinweis %\}[\s\S]*\{\{ video\.hinweis \}\}[\s\S]*\{% endif %\}/);
});

test("TD-17/L-023: videos-Liste – ein Abschnitt #video, je Video eine Karte mit h3, video: bleibt gültig", () => {
  assert.match(layout, /\{% for v in videos %\}/);
  const block = layout.slice(layout.indexOf("{% for v in videos %}"), layout.indexOf("{% endfor %}", layout.indexOf("{% for v in videos %}")));
  assert.match(block, /class="video-karte" id="video-\{\{ loop\.index \}\}" data-youtube-id="\{\{ v\.id \}\}"/);
  assert.match(block, /<h3>\{\{ v\.ueberschrift \}\}<\/h3>/);
  assert.match(layout, /\{% if videos %\}[\s\S]*<h2>Video dazu<\/h2>[\s\S]*\{% elif video %\}/);
});

test("L-023: veraenderung zeigt Senkung und Erhöhung gemeinsam unter „Video dazu“, kein Videokasten im Beispiel", () => {
  const md = fs.readFileSync("src/prozent/veraenderung.md", "utf8");
  const beispiel = md.slice(md.indexOf("beispiel: |"), md.search(/^videos?:/m));
  assert.doesNotMatch(beispiel, /video/i);
  assert.doesNotMatch(md, /^video:/m);
  const liste = md.slice(md.indexOf("videos:"), md.indexOf("bild:"));
  assert.deepEqual([...liste.matchAll(/ueberschrift: (\S+)/g)].map((m) => m[1]), ["Senkung", "Erhöhung"]);
  assert.deepEqual([...liste.matchAll(/id: (\S+)/g)].map((m) => m[1]), ["7qPr-ik4wp8", "hyKgJKGCjHc"]);
});

const veraenderung = path.join("_site", "prozent", "veraenderung.html");
test("gebaut: veraenderung.html – beide Karten in #video, #video-2 bleibt als Anker", { skip: !fs.existsSync(veraenderung) && "kein _site" }, () => {
  const html = fs.readFileSync(veraenderung, "utf8");
  const video = html.slice(html.indexOf('<section id="video"'), html.indexOf("</section>", html.lastIndexOf('class="video-karte"')));
  assert.equal((video.match(/class="video-karte"/g) || []).length, 2);
  assert.match(video, /id="video-2"/);
  assert.equal((html.match(/<h2>Video/g) || []).length, 1);
  assert.ok(html.indexOf('id="beispiel"') < html.indexOf('id="visualisierung"'));
  assert.ok(html.indexOf('class="video-karte"') > html.indexOf('id="visualisierung"'));
});
