// Usage counter of the platform pages of lernapps.net (home, catalog, docs, tooling), never of an app.
// Purpose: to see whether the apps are used at all. Sends to GoatCounter:
// - a visit: the path of the page (data-path of the script tag, else the address without query), and the website
//   the visitor came from, only its origin ("https://www.google.com", no path or query) and only when it is another
//   website (not lernapps.net, so nothing about an app); nothing else (no query, title or screen size)
// - a click on a link marked data-la-count="<name>" (e.g. "app/mathe-karte" on the catalog's "open app" links):
//   the name as an event
// It sets nothing in the browser (no cookies, no localStorage) and reads nothing from it. It does not count when
// the browser asks not to be tracked (Global Privacy Control, Do Not Track), outside https (npm run dev) or in a
// pull request preview, and it waits while a page is only prerendered.
(function () {
  var endpoint = "https://lernapps.goatcounter.com/count";
  var script = document.currentScript;
  var path = (script && script.dataset.path) || location.pathname;
  if (!endpoint || !navigator.sendBeacon) return;
  if (/\/pr-preview\//.test(location.pathname)) return; // a pull request preview
  if (navigator.globalPrivacyControl || navigator.doNotTrack === "1" || navigator.webdriver) return;
  if (location.protocol !== "https:") return; // npm run dev, a file

  // r is always sent, empty when there is nothing to tell: else GoatCounter might take the request's own referrer.
  function send(params) {
    var q = Object.keys(params).map(function (k) { return k + "=" + encodeURIComponent(params[k]); });
    navigator.sendBeacon(endpoint + "?" + q.join("&") + "&rnd=" + Math.random().toString(36).slice(2, 7));
  }

  // The website the visitor came from: its origin only, and only another website's.
  function from() {
    try {
      var origin = new URL(document.referrer).origin;
      return origin === location.origin || origin === "null" ? "" : origin;
    } catch (e) {
      return ""; // no referrer
    }
  }

  function visit() {
    send({ p: path, r: from() });
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
      if (a) send({ p: a.dataset.laCount, r: "", e: "true" });
    });
  });
})();
