/*
 * Seitenstart einer Kompetenzseite: Zwei-Klick-Videos vorbereiten, URL lesen, Trainer starten. Generisch.
 * Öffnet ein Deep Link eine bestimmte Aufgabe, klappt die Erklärung (<details id="erklaerung">) zu und holt die Übung
 * nach vorn; ohne JavaScript bleibt die Erklärung offen.
 * Die Seite übergibt App-Konfiguration, Generator und Bild (Dependency Inversion); die Version steht statisch im Footer.
 */
import { leseSeed } from "./zufall.js";
import { leseVorgaben, aufgabeImFokus } from "./aufgabenlink.js";
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
  const zahlen = modul.URL_ZAHLEN || [];
  const texte = modul.URL_TEXTE || [];
  const trainer = starteTrainer({
    wurzel,
    modul,
    seed: leseSeed(query),
    vorgaben: leseVorgaben(query, zahlen, texte),
    zeichne,
    bildHinweis,
    seitenPfad: window.location.pathname.split("/").pop() || "",
  });
  if (aufgabeImFokus(query, window.location.hash, zahlen, texte)) holeUebungNachVorn();
  return trainer;
}

function holeUebungNachVorn() {
  const erklaerung = document.getElementById("erklaerung");
  if (erklaerung) erklaerung.open = false;
  // Die zugeklappte Zusammenfassung bleibt oben sichtbar, die Übung steht direkt darunter. Der Browser springt beim
  // Laden selbst noch zum Anker (#uebung) – deshalb nach "load" noch einmal.
  const hin = () => (erklaerung ?? document.getElementById("uebung"))?.scrollIntoView({ block: "start" });
  hin();
  if (document.readyState !== "complete") window.addEventListener("load", hin, { once: true });
}
