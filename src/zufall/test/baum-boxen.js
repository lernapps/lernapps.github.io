// Testhilfe (kein Test): Elemente eines gezeichneten Baums mit absoluter Lage und ihre Bounding-Boxen.
// Textbreite bewusst grob: 0,6 · Schriftgröße je Zeichen, unabhängig von der Schätzung im Zeichencode.

const verschiebung = (g) => (g.getAttribute("transform") || "translate(0 0)").match(/translate\(([-\d.]+) ([-\d.]+)\)/).slice(1).map(Number);

/** Alle Nachfahren von e, für die pruefe(e) gilt, mit summierter Verschiebung { e, x, y }. */
export const alle = (e, pruefe, x = 0, y = 0, out = []) => {
  const [dx, dy] = e.tagName === "g" ? verschiebung(e) : [0, 0];
  if (pruefe(e)) out.push({ e, x: x + dx, y: y + dy });
  for (const c of e.children || []) alle(c, pruefe, x + dx, y + dy, out);
  return out;
};
export const klasse = (name) => (e) => (e.getAttribute?.("class") || "").split(" ").includes(name);
export const text = (e) => e.childNodes[0].textContent; // ohne <title>
export const zahl = (e, a) => Number(e.getAttribute(a));
const TEXT_KLASSEN = ["baum-label", "baum-buchstabe", "pfad-w", "baum-legende"];

/** Bounding-Boxen aller Knoten (Kreis oder Pille) und Texte (Höhe = Schriftgröße). */
export function boxen(g) {
  const knoten = alle(g, klasse("baum-knoten")).map(({ e, x, y }) => {
    const f = e.children[0];
    if (f.tagName === "rect") return { t: `Knoten ${x},${y}`, x1: x + zahl(f, "x"), y1: y + zahl(f, "y"), x2: x + zahl(f, "x") + zahl(f, "width"), y2: y + zahl(f, "y") + zahl(f, "height") };
    const r = zahl(f, "r");
    return { t: `Knoten ${x},${y}`, x1: x - r, y1: y - r, x2: x + r, y2: y + r };
  });
  const texte = alle(g, (e) => e.tagName === "text" && TEXT_KLASSEN.some((c) => klasse(c)(e))).map(({ e, x, y }) => {
    const groesse = zahl(e, "font-size") || 13;
    const breite = text(e).length * groesse * 0.6;
    const tx = x + zahl(e, "x");
    const ty = y + zahl(e, "y");
    const x1 = e.getAttribute("text-anchor") === "middle" ? tx - breite / 2 : tx;
    return { t: text(e), x1, y1: ty - groesse * 0.8, x2: x1 + breite, y2: ty + 2 };
  });
  return [...knoten, ...texte];
}

/** Wirft, wenn sich zwei Boxen überschneiden. */
export function keineUeberlappung(assert, b) {
  for (let i = 0; i < b.length; i++) for (let j = i + 1; j < b.length; j++) {
    const [s, t] = [b[i], b[j]];
    assert.ok(!(s.x1 < t.x2 && t.x1 < s.x2 && s.y1 < t.y2 && t.y1 < s.y2), `„${s.t}“ überlappt „${t.t}“`);
  }
}
