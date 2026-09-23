/*
 * Seitenstart einer Kompetenzseite: Zwei-Klick-Videos vorbereiten, URL lesen, Trainer starten. Generisch.
 * Die Seite übergibt App-Konfiguration, Generator und Bild (Dependency Inversion); die Version steht statisch im Footer.
 */
import { leseSeed } from "./zufall.js";
import { leseVorgaben } from "./aufgabenlink.js";
import { starteTrainer } from "./ui.js";
import { initVideos } from "./video.js";

/**
 * app: APP aus js/app.config.js (id = localStorage-Präfix). modul: der Generator (js/aufgaben/<id>.js); welche
 * URL-Parameter er annimmt, sagen seine Exporte URL_ZAHLEN und URL_TEXTE. zeichne(svg, aufgabe, ergebnis|undefined)
 * zeichnet das Bild zur Aufgabe in der Übung (optional), bildHinweis ergänzt dessen Beschriftung.
 */
export function starteSeite({ app, modul, zeichne, bildHinweis }) {
  initVideos(app.id);
  const wurzel = document.getElementById("trainer");
  if (!wurzel) return undefined;
  const query = window.location.search;
  return starteTrainer({
    wurzel,
    modul,
    seed: leseSeed(query),
    vorgaben: leseVorgaben(query, modul.URL_ZAHLEN || [], modul.URL_TEXTE || []),
    zeichne,
    bildHinweis,
    seitenPfad: window.location.pathname.split("/").pop() || "",
  });
}
