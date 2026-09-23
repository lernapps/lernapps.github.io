/*
 * SVG-Elemente für Bilder – im Browser echte DOM-Knoten, beim Build (Node, kein document) ein Mini-DOM,
 * das sich mit `alsSvgText` zu Markup serialisiert. So zeichnet dieselbe Quelle das statische Start-Bild
 * zur Build-Zeit und das interaktive Bild im Browser. Generisch.
 */
export const NS = "http://www.w3.org/2000/svg";

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

class MiniElement {
  constructor(tag) { this.tagName = tag; this.attrs = new Map(); this.childNodes = []; }
  setAttribute(k, v) { this.attrs.set(k, String(v)); }
  getAttribute(k) { return this.attrs.has(k) ? this.attrs.get(k) : null; }
  removeAttribute(k) { this.attrs.delete(k); }
  append(...knoten) { for (const k of knoten) this.childNodes.push(typeof k === "string" ? new MiniText(k) : k); }
  replaceChildren(...knoten) { this.childNodes = []; this.append(...knoten); }
  set textContent(t) { this.childNodes = [new MiniText(t)]; }
  get textContent() { return this.childNodes.map((c) => c.textContent).join(""); }
  get children() { return this.childNodes.filter((c) => c instanceof MiniElement); }
  get classList() {
    const liste = () => (this.getAttribute("class") || "").split(/\s+/).filter(Boolean);
    const setze = (l) => this.setAttribute("class", l.join(" "));
    return {
      add: (...n) => setze([...new Set([...liste(), ...n])]),
      remove: (...n) => setze(liste().filter((c) => !n.includes(c))),
      contains: (n) => liste().includes(n),
      toggle: (n, an = !liste().includes(n)) => { if (an) setze([...new Set([...liste(), n])]); else setze(liste().filter((c) => c !== n)); return an; },
    };
  }
  addEventListener() {}
  get outerHTML() {
    const a = [...this.attrs].map(([k, v]) => ` ${k}="${esc(v)}"`).join("");
    return `<${this.tagName}${a}>${this.childNodes.map((c) => c.outerHTML).join("")}</${this.tagName}>`;
  }
}
class MiniText {
  constructor(t) { this.textContent = String(t); }
  get outerHTML() { return esc(this.textContent); }
}

const miniDokument = { createElementNS: (_ns, tag) => new MiniElement(tag) };
const dokument = () => globalThis.document ?? miniDokument;

/** Erzeugt ein SVG-Element; Zahlen auf eine Nachkommastelle, undefined/null-Attribute entfallen. */
export function svgEl(tag, attrs = {}, text) {
  const e = dokument().createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v === undefined || v === null) continue;
    e.setAttribute(k, typeof v === "number" ? Math.round(v * 10) / 10 : v);
  }
  if (text !== undefined) e.textContent = text;
  return e;
}

/** Leeres <svg> für ein Bild (Build: Mini-DOM). */
export const leeresSvg = (attrs = {}) => svgEl("svg", { xmlns: NS, ...attrs });

/** Markup eines Mini-DOM- oder DOM-Elements. */
export const alsSvgText = (e) => e.outerHTML;
