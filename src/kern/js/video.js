/* Zwei-Klick-Einbettung für YouTube-Videos: keine Anfrage an YouTube/Google, bevor der Lernende klickt. Generisch.
 * Das localStorage-Präfix übergibt die Seite (APP.id); die Farbe kommt aus der CSS-Variablen der Fachfarbe. */
import { el } from "./aufgabe-eingabe.js";

export const schluesselDirekt = (praefix) => `${praefix}.video-direkt`;
const ID_MUSTER = /^[A-Za-z0-9_-]{11}$/;

export function istGueltigeId(id) {
  return typeof id === "string" && ID_MUSTER.test(id);
}

export function baueEmbedUrl(id, { autoplay = true } = {}) {
  if (!istGueltigeId(id)) throw new Error(`Ungültige YouTube-ID: ${id}`);
  return `https://www.youtube-nocookie.com/embed/${id}${autoplay ? "?autoplay=1" : ""}`;
}

export function baueWatchUrl(id) {
  if (!istGueltigeId(id)) throw new Error(`Ungültige YouTube-ID: ${id}`);
  return `https://www.youtube.com/watch?v=${id}`;
}

/** Liest data-youtube-id, data-titel und optional data-kanal (z. B. "Lehrerschmidt") aus einem dataset. */
export function leseVideoDaten(dataset) {
  const id = dataset?.youtubeId;
  const titel = dataset?.titel;
  if (!istGueltigeId(id) || typeof titel !== "string" || titel.trim() === "") return undefined;
  return { id, titel: titel.trim(), kanal: dataset.kanal || "" };
}

/** "Kanal · YouTube" oder nur "YouTube". */
export function kanalZeile(daten) {
  return daten.kanal ? `${daten.kanal} · YouTube` : "YouTube";
}

function speicher() {
  return typeof localStorage === "undefined" ? undefined : localStorage;
}

export function ladeDirektLaden(praefix) {
  try {
    return speicher()?.getItem(schluesselDirekt(praefix)) === "1";
  } catch {
    return false;
  }
}

export function speichereDirektLaden(praefix, an) {
  try {
    if (an) speicher().setItem(schluesselDirekt(praefix), "1");
    else speicher().removeItem(schluesselDirekt(praefix));
    return true;
  } catch {
    return false;
  }
}

// ─── DOM ────────────────────────────────────────────────────────────────────

const HINWEIS = "Beim Start werden Daten (u. a. deine IP-Adresse) an YouTube/Google übertragen.";

/** Lokal gezeichnetes Play-Symbol – kein Vorschaubild von ytimg. */
/** Neutrales Play-Symbol (Kreis in der Fachfarbe, weißes Dreieck) – bewusst nicht die Logo-Form von YouTube. */
export const PLAY_SYMBOL = Object.freeze({
  viewBox: "0 0 48 48",
  kreis: Object.freeze({ cx: 24, cy: 24, r: 22 }),
  dreieck: "M19 14v20l16-10z",
});

function playSymbol() {
  const ns = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(ns, "svg");
  svg.setAttribute("viewBox", PLAY_SYMBOL.viewBox);
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("class", "video-play");
  const kreis = document.createElementNS(ns, "circle");
  for (const [k, v] of Object.entries(PLAY_SYMBOL.kreis)) kreis.setAttribute(k, String(v));
  kreis.setAttribute("style", "fill: var(--farbe-primaer)");
  const dreieck = document.createElementNS(ns, "path");
  dreieck.setAttribute("d", PLAY_SYMBOL.dreieck);
  dreieck.setAttribute("fill", "#fff");
  svg.append(kreis, dreieck);
  return svg;
}

function zeigeIframe(section, daten, praefix, { mitAufheben = false } = {}) {
  const rahmen = el("div", { class: "video-rahmen" }, [
    el("iframe", {
      src: baueEmbedUrl(daten.id), title: daten.titel,
      allow: "autoplay; encrypted-media; picture-in-picture", allowfullscreen: true, loading: "lazy",
    }),
  ]);
  section.querySelectorAll(":scope > :not(h2, .video-notiz)").forEach((kind) => kind.remove());
  section.append(rahmen);
  if (mitAufheben) {
    const aufheben = el("button", { type: "button", class: "video-link", text: "Merken aufheben" });
    aufheben.addEventListener("click", () => {
      speichereDirektLaden(praefix, false);
      aufheben.replaceWith(el("span", { text: "Videos werden ab jetzt erst nach Klick geladen." }));
    });
    section.append(el("p", { class: "video-merken" }, [aufheben]));
  }
}

function zeigePlatzhalter(section, daten, praefix) {
  const knopf = el("button", { type: "button", class: "primaer video-start", text: "Video laden und abspielen" });
  const merkenId = `${section.id || "video"}-merken-${daten.id}`;
  const merken = el("input", { type: "checkbox", id: merkenId });
  const karte = el("div", { class: "video-platzhalter" }, [
    el("div", { class: "video-bild" }, [playSymbol()]),
    el("p", { class: "video-titel", text: daten.titel }),
    el("p", { class: "video-kanal", text: kanalZeile(daten) }),
    el("p", { class: "video-hinweis", text: HINWEIS }),
    el("div", { class: "aktionen" }, [knopf]),
    el("p", { class: "video-merken" }, [merken, el("label", { for: merkenId, text: " Merken: Videos immer direkt laden" })]),
  ]);
  knopf.addEventListener("click", () => {
    if (merken.checked) speichereDirektLaden(praefix, true);
    zeigeIframe(section, daten, praefix);
  });
  section.querySelectorAll(":scope > :not(h2, .video-notiz)").forEach((kind) => kind.remove());
  section.append(karte);
}

/** praefix: APP.id. Wandelt alle <section class="video-karte" data-youtube-id data-titel> in Zwei-Klick-Karten um. */
export function initVideos(praefix, wurzel = document) {
  const direkt = ladeDirektLaden(praefix);
  for (const section of wurzel.querySelectorAll("section.video-karte[data-youtube-id]")) {
    const daten = leseVideoDaten(section.dataset);
    if (!daten) continue;
    if (direkt) zeigeIframe(section, daten, praefix, { mitAufheben: true });
    else zeigePlatzhalter(section, daten, praefix);
  }
}
