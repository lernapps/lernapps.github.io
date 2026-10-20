// Usage counter of the platform pages (home, catalog, docs, tooling), never of an app: frame.js adds it only to
// the sites in COUNTED_SITES (nav.js), and only when COUNTER is set. Purpose: to see whether the apps are used at all.
// Served by the home site as /lernapps-count.js; written for lernapps.net instead of GoatCounter's count.js, so that
// it sends as little as possible and is easy to read.
//
// Sends to GoatCounter (data-endpoint of the script tag, the /count endpoint):
// - a visit: the canonical path of the page (data-path, set at build time), nothing else (no query, title, referrer
//   or screen size)
// - a click on a link marked data-la-count="<name>" (e.g. "app/mathe-karte" on the catalog's "open app" links):
//   the name as an event
// It sets nothing in the browser (no cookies, no localStorage) and reads nothing from it. It does not count when
// the browser asks not to be tracked (Global Privacy Control, Do Not Track) or outside https (npm run dev), and it
// waits while a page is only prerendered.
(function () {
  var script = document.currentScript;
  var endpoint = script && script.dataset.endpoint;
  var path = script && script.dataset.path;
  if (!endpoint || !path || !navigator.sendBeacon) return;
  if (navigator.globalPrivacyControl || navigator.doNotTrack === "1" || navigator.webdriver) return;
  if (location.protocol !== "https:") return; // npm run dev, a file

  function send(name, event) {
    var q = "?p=" + encodeURIComponent(name) + (event ? "&e=true" : "") + "&rnd=" + Math.random().toString(36).slice(2, 7);
    navigator.sendBeacon(endpoint + q);
  }

  function visit() {
    send(path, false);
  }
  if (document.visibilityState === "prerender") {
    document.addEventListener("visibilitychange", function once() {
      if (document.visibilityState !== "visible") return;
      document.removeEventListener("visibilitychange", once);
      visit();
    });
  } else {
    visit();
  }

  // auxclick: a link opened with the middle button.
  ["click", "auxclick"].forEach(function (type) {
    document.addEventListener(type, function (e) {
      var a = e.target instanceof Element && e.target.closest("[data-la-count]");
      if (a) send(a.dataset.laCount, true);
    });
  });
})();
