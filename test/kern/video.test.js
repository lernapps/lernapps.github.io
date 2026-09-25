import { test, beforeEach } from "node:test";
import assert from "node:assert/strict";
import {
  baueEmbedUrl, baueWatchUrl, istGueltigeId, leseVideoDaten, kanalZeile, ladeDirektLaden, speichereDirektLaden, schluesselDirekt,
} from "../../src/kern/js/video.js";
const P = "binom-trainer";

test("istGueltigeId akzeptiert nur YouTube-IDs", () => {
  assert.ok(istGueltigeId("XDvDfzdP_Fc"));
  assert.ok(istGueltigeId("gtEAmp8-K-8"));
  assert.ok(!istGueltigeId(""));
  assert.ok(!istGueltigeId("abc"));
  assert.ok(!istGueltigeId("XDvDfzdP_Fc?x=1"));
  assert.ok(!istGueltigeId(undefined));
});

test("baueEmbedUrl nutzt youtube-nocookie mit Autoplay", () => {
  assert.equal(baueEmbedUrl("XDvDfzdP_Fc"), "https://www.youtube-nocookie.com/embed/XDvDfzdP_Fc?autoplay=1");
  assert.equal(baueEmbedUrl("XDvDfzdP_Fc", { autoplay: false }), "https://www.youtube-nocookie.com/embed/XDvDfzdP_Fc");
  assert.throws(() => baueEmbedUrl("böse<id>"));
});

test("baueWatchUrl liefert den Watch-Link", () => {
  assert.equal(baueWatchUrl("XDvDfzdP_Fc"), "https://www.youtube.com/watch?v=XDvDfzdP_Fc");
});

test("leseVideoDaten liest dataset und lehnt Unsinn ab", () => {
  assert.deepEqual(leseVideoDaten({ youtubeId: "XDvDfzdP_Fc", titel: "Prozentwert | Lehrerschmidt" }),
    { id: "XDvDfzdP_Fc", titel: "Prozentwert | Lehrerschmidt", kanal: "" });
  assert.equal(leseVideoDaten({ youtubeId: "XDvDfzdP_Fc", titel: "Prozentwert | Lehrerschmidt", kanal: "Anderer" }).kanal, "Anderer");
  assert.equal(leseVideoDaten({ youtubeId: "nope", titel: "x" }), undefined);
  assert.equal(leseVideoDaten({ youtubeId: "XDvDfzdP_Fc" }), undefined);
  assert.equal(leseVideoDaten({}), undefined);
});

function fakeStorage() {
  const daten = new Map();
  return { getItem: (k) => (daten.has(k) ? daten.get(k) : null), setItem: (k, v) => daten.set(k, String(v)), removeItem: (k) => daten.delete(k) };
}

beforeEach(() => { globalThis.localStorage = fakeStorage(); });

test("Direktladen-Merker wird gespeichert, gelesen und gelöscht", () => {
  assert.equal(ladeDirektLaden(P), false);
  assert.equal(speichereDirektLaden(P, true), true);
  assert.equal(ladeDirektLaden(P), true);
  assert.equal(localStorage.getItem(schluesselDirekt(P)), "1");
  speichereDirektLaden(P, false);
  assert.equal(ladeDirektLaden(P), false);
  assert.equal(localStorage.getItem(schluesselDirekt(P)), null);
});

test("kaputter Speicher wirft nicht", () => {
  globalThis.localStorage = { getItem: () => { throw new Error("x"); }, setItem: () => { throw new Error("x"); } };
  assert.equal(ladeDirektLaden(P), false);
  assert.equal(speichereDirektLaden(P, true), false);
  delete globalThis.localStorage;
  assert.equal(ladeDirektLaden(P), false);
});

test("kanalZeile nennt den Kanal nur, wenn die Seite ihn angibt", () => {
  assert.equal(kanalZeile({ kanal: "Lehrerschmidt" }), "Lehrerschmidt · YouTube");
  assert.equal(kanalZeile({ kanal: "" }), "YouTube");
});

test("Schlüssel für den Merker trägt das übergebene Präfix", () => {
  assert.equal(schluesselDirekt(P), "binom-trainer.video-direkt");
});

test("das Play-Symbol ist neutral: Kreis mit Dreieck, keine Form des YouTube-Logos (Markenrichtlinien)", async () => {
  const { PLAY_SYMBOL } = await import("../../src/kern/js/video.js");
  assert.equal(PLAY_SYMBOL.viewBox, "0 0 48 48");
  assert.deepEqual(PLAY_SYMBOL.kreis, { cx: 24, cy: 24, r: 22 });
  assert.doesNotMatch(PLAY_SYMBOL.dreieck, /M27 34l18-10-18-10z/);
  assert.doesNotMatch(JSON.stringify(PLAY_SYMBOL), /M66\.5/);
});

// Kleiner Fake-DOM: gerade genug für initVideos, Platzhalter, Klick und iframe.
function fakeDom() {
  const knoten = (tag) => {
    const n = {
      tag, attrs: {}, kinder: [], eltern: undefined, hoerer: {}, _text: "", checked: false,
      setAttribute(k, v) { this.attrs[k] = String(v); },
      append(...ks) { for (const k of ks) { const x = typeof k === "string" ? Object.assign(knoten("#text"), { _text: k }) : k; x.eltern = this; this.kinder.push(x); } },
      remove() { if (this.eltern) this.eltern.kinder = this.eltern.kinder.filter((k) => k !== this); },
      replaceWith(neu) { const i = this.eltern.kinder.indexOf(this); neu.eltern = this.eltern; this.eltern.kinder[i] = neu; },
      addEventListener(typ, f) { this.hoerer[typ] = f; },
      click() { this.hoerer.click?.(); },
      querySelectorAll(sel) {
        if (sel === ":scope > :not(h2, h3, .video-notiz)") return [...this.kinder.filter((k) => !["h2", "h3"].includes(k.tag) && k.attrs.class !== "video-notiz")];
        const alle = []; const lauf = (x) => { for (const k of x.kinder) { alle.push(k); lauf(k); } }; lauf(this);
        if (sel === "button" || sel === "iframe") return alle.filter((k) => k.tag === sel);
        if (sel === ".video-karte[data-youtube-id]") return alle.filter((k) => k.dataset?.youtubeId);
        return [];
      },
      set textContent(t) { this._text = t; },
      get textContent() { return this._text + this.kinder.map((k) => k.textContent).join(""); },
    };
    return n;
  };
  globalThis.document = { createElement: knoten, createElementNS: (_, tag) => knoten(tag) };
  const wurzel = knoten("body");
  const section = knoten("section");
  section.id = "video";
  section.dataset = { youtubeId: "XDvDfzdP_Fc", titel: "Prozentwert | Lehrerschmidt", kanal: "Lehrerschmidt" };
  section.append(knoten("h2"));
  wurzel.append(section);
  return { wurzel, section };
}

test("vor dem Klick steht der Hinweis, nach dem Klick kein Text über übertragene Daten", async () => {
  const { initVideos } = await import("../../src/kern/js/video.js");
  const { wurzel, section } = fakeDom();
  try {
    initVideos(P, wurzel);
    assert.match(section.textContent, /Beim Start werden Daten \(u\. a\. deine IP-Adresse\) an YouTube\/Google übertragen\./);
    section.querySelectorAll("button")[0].click();
    assert.equal(section.querySelectorAll("iframe").length, 1);
    assert.doesNotMatch(section.textContent, /übertragen|Google|geladen/);
  } finally {
    delete globalThis.document;
  }
});

test("mit Merker lädt das Video direkt, bietet \"Merken aufheben\" und keinen Text über übertragene Daten", async () => {
  const { initVideos } = await import("../../src/kern/js/video.js");
  const { wurzel, section } = fakeDom();
  try {
    speichereDirektLaden(P, true);
    initVideos(P, wurzel);
    assert.match(section.textContent, /Merken aufheben/);
    assert.doesNotMatch(section.textContent, /übertragen|Google|geladen/);
    section.querySelectorAll("button")[0].click();
    assert.equal(ladeDirektLaden(P), false);
    assert.match(section.textContent, /Videos werden ab jetzt erst nach Klick geladen\./);
  } finally {
    delete globalThis.document;
  }
});

test("L-036: ein Hinweis zum Video (p.video-notiz aus video.hinweis) bleibt vor und nach dem Klick stehen", async () => {
  const { initVideos } = await import("../../src/kern/js/video.js");
  const { wurzel, section } = fakeDom();
  const notiz = globalThis.document.createElement("p");
  notiz.setAttribute("class", "video-notiz");
  notiz.textContent = "Im Video heißt das anders.";
  section.append(notiz);
  try {
    initVideos(P, wurzel);
    assert.match(section.textContent, /Im Video heißt das anders\./);
    section.querySelectorAll("button")[0].click();
    assert.equal(section.querySelectorAll("iframe").length, 1);
    assert.match(section.textContent, /Im Video heißt das anders\./);
  } finally {
    delete globalThis.document;
  }
});

test("TD-17/L-023: mehrere Videokarten (div.video-karte mit h3) in einem Abschnitt #video", async () => {
  const { initVideos } = await import("../../src/kern/js/video.js");
  const { wurzel, section } = fakeDom();
  delete section.dataset;
  const karten = [["video-1", "7qPr-ik4wp8", "Senkung"], ["video-2", "hyKgJKGCjHc", "Erhöhung"]].map(([id, youtubeId, teil]) => {
    const karte = globalThis.document.createElement("div");
    karte.id = id;
    karte.dataset = { youtubeId, titel: `Video ${teil}`, kanal: "Lehrerschmidt" };
    const h3 = globalThis.document.createElement("h3");
    h3.textContent = teil;
    karte.append(h3);
    section.append(karte);
    return karte;
  });
  try {
    initVideos(P, wurzel);
    for (const k of karten) {
      assert.equal(k.querySelectorAll("button").length, 1, k.id);
      assert.equal(k.kinder[0].tag, "h3", "die Unterüberschrift bleibt");
    }
    karten[1].querySelectorAll("button")[0].click();
    assert.equal(karten[1].querySelectorAll("iframe").length, 1);
    assert.equal(karten[0].querySelectorAll("iframe").length, 0, "nur das angeklickte Video lädt");
    assert.match(karten[1].textContent, /Erhöhung/);
  } finally {
    delete globalThis.document;
  }
});

test("das iframe schickt YouTube nur die Herkunft, nie Pfad oder Aufgabennummer (S-004)", async () => {
  const { initVideos } = await import("../../src/kern/js/video.js");
  const { wurzel, section } = fakeDom();
  try {
    initVideos(P, wurzel);
    section.querySelectorAll("button")[0].click();
    assert.equal(section.querySelectorAll("iframe")[0].attrs.referrerpolicy, "strict-origin-when-cross-origin");
  } finally {
    delete globalThis.document;
  }
});
