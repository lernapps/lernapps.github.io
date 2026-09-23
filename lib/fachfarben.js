/*
 * Fachfarben: Jedes Fach hat eine Primärfarbe und eine dunkle Variante, beide mit weißer Schrift lesbar nach
 * WCAG AA (≥ 4,5:1, test/build/fachfarben.test.js). Die Farbe einer App folgt aus APP.fach; das Layout setzt sie
 * als CSS-Variablen und theme-color. Einzige Quelle der Tabelle.
 */
export const FACHFARBEN = {
  mathe: { name: "Mathematik", primaer: "#1d4ed8", dunkel: "#1e3a8a" },
  physik: { name: "Physik", primaer: "#c2410c", dunkel: "#7c2d12" },
  chemie: { name: "Chemie", primaer: "#6d28d9", dunkel: "#4c1d95" },
  biologie: { name: "Biologie", primaer: "#15803d", dunkel: "#14532d" },
  informatik: { name: "Informatik", primaer: "#0f766e", dunkel: "#134e4a" },
};

function relativeLeuchtdichte(hex) {
  const h = hex.replace("#", "");
  const voll = h.length === 3 ? [...h].map((c) => c + c).join("") : h;
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(voll.slice(i, i + 2), 16) / 255)
    .map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Kontrastverhältnis nach WCAG 2.x zwischen zwei Hex-Farben (1 bis 21). */
export function kontrast(a, b) {
  const [hell, dunkel] = [relativeLeuchtdichte(a), relativeLeuchtdichte(b)].sort((x, y) => y - x);
  return (hell + 0.05) / (dunkel + 0.05);
}

/** Farben eines Fachs; ein unbekanntes Fach bricht den Build ab. */
export function fachfarbe(fach) {
  const farbe = FACHFARBEN[fach];
  if (!farbe) throw new Error(`Fach "${fach}" hat keine Farbe in lib/fachfarben.js (${Object.keys(FACHFARBEN).join(", ")}).`);
  return farbe;
}
