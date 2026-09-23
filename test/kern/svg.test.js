// Use Case: Bild dazu – dieselbe Zeichenfunktion erzeugt beim Build statisches SVG (Mini-DOM) und im Browser echte Knoten.
import { test } from "node:test";
import assert from "node:assert/strict";
import { svgEl, leeresSvg, alsSvgText, NS } from "../../src/kern/js/svg.js";

test("ohne document entsteht ein Mini-DOM, das sich zu SVG-Markup serialisiert", () => {
  const svg = leeresSvg({ class: "vis", id: "vis" });
  svg.setAttribute("viewBox", "0 0 10 10");
  svg.append(svgEl("rect", { x: 1.26, y: 0, width: 3, fill: "#fff", weg: undefined }), svgEl("text", { x: 1 }, "a < b & \"c\""));
  assert.equal(alsSvgText(svg),
    `<svg xmlns="${NS}" class="vis" id="vis" viewBox="0 0 10 10"><rect x="1.3" y="0" width="3" fill="#fff"></rect><text x="1">a &lt; b &amp; &quot;c&quot;</text></svg>`);
});

test("replaceChildren, textContent, classList und children verhalten sich wie im DOM", () => {
  const g = svgEl("g");
  g.append(svgEl("rect"), "x");
  assert.equal(g.children.length, 1);
  g.replaceChildren(svgEl("circle"));
  assert.equal(g.children[0].tagName, "circle");
  g.classList.add("a", "b");
  g.classList.toggle("a");
  assert.equal(g.getAttribute("class"), "b");
  assert.ok(g.classList.contains("b"));
  g.textContent = "neu";
  assert.equal(g.textContent, "neu");
  g.removeAttribute("class");
  assert.equal(g.getAttribute("class"), null);
});
