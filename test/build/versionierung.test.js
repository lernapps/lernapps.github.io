// Use Case: Auslieferung ohne Cache-Mischmasch – jede lokale JS/CSS-Referenz trägt dasselbe ?v=<Hash>.
import { test } from "node:test";
import assert from "node:assert/strict";
import { versionsHash, versioniere } from "../../lib/versionierung.js";

test("versionsHash: 8 Hex-Zeichen, hängt vom Inhalt ab, nicht von der Reihenfolge der Übergabe", () => {
  const h = versionsHash([["b.js", "x"], ["a.css", "y"]]);
  assert.match(h, /^[0-9a-f]{8}$/);
  assert.equal(h, versionsHash([["a.css", "y"], ["b.js", "x"]]));
  assert.notEqual(h, versionsHash([["a.css", "y"], ["b.js", "z"]]));
});

test("versioniere hängt ?v an relative Importe in JS an – statisch, dynamisch, Re-Export, Nebenwirkung", () => {
  const js = `import { a } from "./a.js";\nimport {\n  b,\n} from '../kern/b.js';\nimport "./n.js";\nexport { c } from "./c.js";\nconst d = await import("./d.js");\nimport { f } from "node:fs";\n`;
  assert.equal(versioniere(js, "abc", "js"),
    `import { a } from "./a.js?v=abc";\nimport {\n  b,\n} from '../kern/b.js?v=abc';\nimport "./n.js?v=abc";\nexport { c } from "./c.js?v=abc";\nconst d = await import("./d.js?v=abc");\nimport { f } from "node:fs";\n`);
});

test("versioniere in HTML: lokale script/link-Referenzen und Inline-Importe, keine externen, keine Anker", () => {
  const html = `<link rel="stylesheet" href="../kern/css/stil.css">\n<link rel="canonical" href="https://x.org/">\n<a href="seite.html">x</a>\n<script src="../kern/vendor/talkitover.js"></script>\n<script type="module">import { s } from "../kern/js/seite.js";</script>\n<p>import x from "./text.js"</p>`;
  assert.equal(versioniere(html, "abc", "html"),
    `<link rel="stylesheet" href="../kern/css/stil.css?v=abc">\n<link rel="canonical" href="https://x.org/">\n<a href="seite.html">x</a>\n<script src="../kern/vendor/talkitover.js?v=abc"></script>\n<script type="module">import { s } from "../kern/js/seite.js?v=abc";</script>\n<p>import x from "./text.js"</p>`);
});

test("versioniere ist idempotent: vorhandenes ?v= wird ersetzt, nicht verdoppelt", () => {
  assert.equal(versioniere(`import "./a.js?v=alt";`, "neu", "js"), `import "./a.js?v=neu";`);
});
