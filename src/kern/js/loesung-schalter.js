// Schalter "Lösung zeigen" / "Lösung verbergen": reiner Zustand ohne DOM, damit er testbar bleibt.

export const LOESUNG_ZEIGEN = "Lösung zeigen";
export const LOESUNG_VERBERGEN = "Lösung verbergen";

/** Liefert Knopftext, aria-expanded und hidden-Flag für den gewünschten Zustand. @param {boolean} sichtbar */
export function loesungZustand(sichtbar) {
  return {
    text: sichtbar ? LOESUNG_VERBERGEN : LOESUNG_ZEIGEN,
    expanded: sichtbar ? "true" : "false",
    hidden: !sichtbar,
  };
}

/** Wendet den Zustand auf Knopf und Lösungsbox an. @param {HTMLElement} knopf @param {HTMLElement} box @param {boolean} sichtbar */
export function schalteLoesung(knopf, box, sichtbar) {
  const z = loesungZustand(sichtbar);
  knopf.textContent = z.text;
  knopf.setAttribute("aria-expanded", z.expanded);
  box.hidden = z.hidden;
}
