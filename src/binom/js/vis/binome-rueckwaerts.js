/*
 * Bild zu "Binome rückwärts": die Flächenbilder der drei Formeln, aber rückwärts gelesen.
 * Faktorisieren: Die Teilflächen sind gegeben, die Seiten sind gesucht ("?"). Lücke: Die Seiten sind bekannt,
 * die fehlende Teilfläche ist "?". Nach der richtigen Antwort stehen überall die Werte.
 */
import { zeichneRaster, zeichneQuadratMinus, zeichneUmlegen, laengeVon } from "./flaechen.js";
import { alsAnzeige, gliedAnzeige, negiere, multipliziere, binomAnzeige } from "../aufgaben/terme.js";

export function zeichneBinomeRueckwaerts(svg, aufgabe, ergebnis) {
  const geloest = Boolean(ergebnis && ergebnis.korrekt);
  const { u, v, uu, vv, formel, typ, luecke } = aufgabe;
  const streifen = multipliziere([u], [v])[0];
  const seite = (g) => (geloest || typ === "luecke" ? gliedAnzeige(g) : "?");
  const zeige = (g, gefragt) => (gefragt && !geloest ? "?" : gliedAnzeige(g));
  const mitteGefragt = typ === "luecke" && luecke === "mitte";
  const endeGefragt = typ === "luecke" && luecke === "ende";
  const titel = typ === "luecke"
    ? (geloest ? aufgabe.lueckenText.replace("□", String(aufgabe.loesung.antwort)) : aufgabe.lueckenText)
    : `${alsAnzeige(aufgabe.summe)} = ${geloest ? aufgabe.loesungAnzeige : "?"}`;
  if (formel === 1) {
    zeichneRaster(svg, {
      zeilen: [u, v].map((g) => ({ text: seite(g), laenge: laengeVon(g) })),
      spalten: [u, v].map((g) => ({ text: seite(g), laenge: laengeVon(g) })),
      zellen: [
        [{ art: "a", text: gliedAnzeige(uu) }, { art: "ab", text: zeige(streifen, mitteGefragt) }],
        [{ art: "ab", text: zeige(streifen, mitteGefragt) }, { art: "b", text: zeige(vv, endeGefragt) }],
      ],
      titel,
      untertitel: typ === "luecke" ? "Welche Teilfläche fehlt?" : "Teilflächen gegeben – welche Seite hat das Quadrat?",
    });
  } else if (formel === 2) {
    zeichneQuadratMinus(svg, {
      a: { text: seite(u), laenge: laengeVon(u) },
      b: { text: seite(v), laenge: laengeVon(v) },
      texte: {
        rest: geloest ? binomAnzeige([u, negiere([v])[0]]) + "²" : "?",
        streifen: zeige(streifen, mitteGefragt),
        ecke: zeige(vv, endeGefragt),
      },
      titel,
      untertitel: typ === "luecke" ? "Welche Teilfläche fehlt?" : "Welches Quadrat bleibt übrig?",
    });
  } else {
    zeichneUmlegen(svg, {
      a: { text: seite(u), laenge: laengeVon(u) },
      b: { text: seite(v), laenge: laengeVon(v) },
      texte: {
        ecke: `− ${gliedAnzeige(vv)}`,
        oben: `${gliedAnzeige(uu)} ohne die Ecke ${gliedAnzeige(vv)}`,
        unten: geloest ? `umgelegt: ${aufgabe.loesungAnzeige}` : "umgelegt: ein Rechteck – welche Seiten?",
        rest: geloest ? alsAnzeige([u, negiere([v])[0]]) : "?",
      },
      titel,
      untertitel: "Gleiche Teile, gleiche Fläche",
    });
  }
}
