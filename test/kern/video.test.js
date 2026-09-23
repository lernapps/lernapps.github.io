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
