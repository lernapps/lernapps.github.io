// Use Case: Kompetenzseite ohne eigenes Video – entweder gar kein Abschnitt „Video dazu“ oder ein Satz für die
// Lernenden mit einem echten Link auf das Video einer verwandten Seite (videoVerweis). Keine internen Notizen.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const layout = fs.readFileSync("src/_includes/kompetenz.njk", "utf8");
const seiten = fs.readdirSync("src").filter((d) => fs.existsSync(path.join("src", d, "js", "app.config.js")))
  .flatMap((d) => fs.readdirSync(path.join("src", d)).filter((f) => f.endsWith(".md")).map((f) => path.join("src", d, f)))
  .map((p) => ({ p, text: fs.readFileSync(p, "utf8") }))
  .filter((s) => /^kompetenz:/m.test(s.text));

const METAFLOSKELN = [/Erklärung oben reicht/, /kein Lehrerschmidt-Video/, /kein passendes Video/];

test("kein Kompetenz-Front-Matter nutzt noch ohneVideo", () => {
  assert.ok(seiten.length > 10);
  for (const s of seiten) assert.doesNotMatch(s.text, /^ohneVideo:/m, s.p);
});

test("keine Seite und kein Layout enthält Meta-Floskeln zum fehlenden Video", () => {
  for (const p of [...seiten.map((s) => s.p), "src/_includes/kompetenz.njk"]) {
    for (const f of METAFLOSKELN) assert.doesNotMatch(fs.readFileSync(p, "utf8"), f, p);
  }
});

test("der Skill schreibt kein ohneVideo mehr vor, sondern videoVerweis oder nichts", () => {
  for (const p of ["werkzeuge/skill/lern-app/references/videos.md", "werkzeuge/skill/lern-app/SKILL.md", "werkzeuge/skill/lern-app/references/agent-auftrag.md"]) {
    const text = fs.readFileSync(p, "utf8");
    assert.doesNotMatch(text, /ohneVideo/, p);
    assert.match(text, /videoVerweis/, p);
  }
});

test("videoVerweis ist ein Satz mit Link auf #video einer Seite derselben App, die ein Video hat", () => {
  let gefunden = 0;
  for (const s of seiten) {
    const m = s.text.match(/^videoVerweis:\s*'(.*)'\s*$/m);
    if (!m) continue;
    gefunden++;
    assert.doesNotMatch(s.text, /^video:/m, `${s.p}: video und videoVerweis zugleich`);
    const links = [...m[1].matchAll(/<a href="([a-z0-9-]+)\.html#video">[^<]+<\/a>/g)];
    assert.ok(links.length > 0, `${s.p}: kein Link auf <seite>.html#video`);
    for (const [, ziel] of links) {
      const zielDatei = path.join(path.dirname(s.p), `${ziel}.md`);
      assert.ok(fs.existsSync(zielDatei), `${s.p}: ${ziel}.md fehlt`);
      assert.match(fs.readFileSync(zielDatei, "utf8"), /^video:/m, `${s.p}: ${ziel} hat kein Video`);
    }
    assert.equal((m[1].replace(/[<>]/g, " ").match(/[.!?](\s|$)/g) || []).length, 1, `${s.p}: genau ein Satz`);
  }
  assert.ok(gefunden > 0);
});

test("Layout: ohne video und ohne videoVerweis gibt es keinen Abschnitt #video", () => {
  assert.match(layout, /\{% elif videoVerweis %\}/);
  assert.doesNotMatch(layout, /ohneVideo/);
  const block = layout.slice(layout.indexOf("{% elif videoVerweis %}"), layout.indexOf("{% endif %}", layout.indexOf("{% elif videoVerweis %}")));
  assert.doesNotMatch(block, /\{% else %\}/);
});
