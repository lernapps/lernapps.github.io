/*
 * SVG-Elemente für Bilder – im Browser echte DOM-Knoten, beim Build (Node, kein document) ein Mini-DOM,
 * das sich mit `alsSvgText` zu Markup serialisiert. So zeichnet dieselbe Quelle das statische Start-Bild
 * zur Build-Zeit und das interaktive Bild im Browser. Generisch.
 */
export const NS = "http://www.w3.org/2000/svg";

/** @param {unknown} s */
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

class MiniElement {
  /** @param {string} tag */
  constructor(tag) {
    this.tagName = tag;
    /** @type {Map<string, string>} */
    this.attrs = new Map();
    /** @type {(MiniElement | MiniText)[]} */
    this.childNodes = [];
  }
  /** @param {string} k @param {unknown} v */
  setAttribute(k, v) { this.attrs.set(k, String(v)); }
  /** @param {string} k @returns {string | null} */
  getAttribute(k) { return this.attrs.has(k) ? /** @type {string} */ (this.attrs.get(k)) : null; }
  /** @param {string} k */
  removeAttribute(k) { this.attrs.delete(k); }
  /** @param {...(MiniElement | MiniText | string)} knoten */
  append(...knoten) { for (const k of knoten) this.childNodes.push(typeof k === "string" ? new MiniText(k) : k); }
  /** @param {...(MiniElement | MiniText | string)} knoten */
  replaceChildren(...knoten) { this.childNodes = []; this.append(...knoten); }
  /** @param {unknown} t */
  set textContent(t) { this.childNodes = [new MiniText(t)]; }
  /** @returns {string} */
  get textContent() { return this.childNodes.map((c) => c.textContent).join(""); }
  /** @returns {MiniElement[]} */
  get children() { return this.childNodes.filter((c) => c instanceof MiniElement); }
  get classList() {
    const liste = () => (this.getAttribute("class") || "").split(/\s+/).filter(Boolean);
    /** @param {string[]} l */
    const setze = (l) => this.setAttribute("class", l.join(" "));
    return {
      add: (/** @type {string[]} */ ...n) => setze([...new Set([...liste(), ...n])]),
      remove: (/** @type {string[]} */ ...n) => setze(liste().filter((c) => !n.includes(c))),
      contains: (/** @type {string} */ n) => liste().includes(n),
      toggle: (/** @type {string} */ n, an = !liste().includes(n)) => { if (an) setze([...new Set([...liste(), n])]); else setze(liste().filter((c) => c !== n)); return an; },
    };
  }
  addEventListener() {}
  /** @returns {string} */
  get outerHTML() {
    const a = [...this.attrs].map(([k, v]) => ` ${k}="${esc(v)}"`).join("");
    return `<${this.tagName}${a}>${this.childNodes.map((c) => c.outerHTML).join("")}</${this.tagName}>`;
  }
}
class MiniText {
  /** @param {unknown} t */
  constructor(t) { this.textContent = String(t); }
  get outerHTML() { return esc(this.textContent); }
}

const miniDokument = { createElementNS: (/** @type {string} */ _ns, /** @type {string} */ tag) => new MiniElement(tag) };
// Für den Kern im Browser zählt das echte SVGElement; das Mini-DOM ahmt davon nur den benutzten Teil nach.
const dokument = () => /** @type {{ createElementNS(ns: string, tag: string): SVGElement }} */ (globalThis.document ?? miniDokument);

/** Erzeugt ein SVG-Element; Zahlen auf eine Nachkommastelle, undefined/null-Attribute entfallen.
 * @param {string} tag @param {Record<string, string | number | null | undefined>} [attrs] @param {string} [text]
 * @returns {SVGElement} */
export function svgEl(tag, attrs = {}, text) {
  const e = dokument().createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v === undefined || v === null) continue;
    // setAttribute macht aus der Zahl selbst Text (DOM wie Mini-DOM).
    e.setAttribute(k, /** @type {string} */ (typeof v === "number" ? Math.round(v * 10) / 10 : v));
  }
  if (text !== undefined) e.textContent = text;
  return e;
}

/** Leeres <svg> für ein Bild (Build: Mini-DOM). @param {Record<string, string | number | null | undefined>} [attrs] */
export const leeresSvg = (attrs = {}) => svgEl("svg", { xmlns: NS, ...attrs });

/** Markup eines Mini-DOM- oder DOM-Elements. @param {{ outerHTML: string }} e */
export const alsSvgText = (e) => e.outerHTML;
