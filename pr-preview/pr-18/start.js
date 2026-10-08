// Persona tabs of the home page (progressive enhancement, no framework).
//
// Without this script every persona's problem quote and solution card is shown, stacked, each with its
// role heading. With it they become tabs:
// - two tablists (problems in the hero, solutions further down) share one selected persona;
// - WAI-ARIA tabs pattern: tablist/tab/tabpanel, roving tabindex, ArrowLeft/ArrowRight, Home/End;
// - the problem tabs auto-advance every 5 s with a progress bar, like the original. Auto-advance stops
//   for good ("locked") on any click or focus in a tablist, as soon as the hero scrolls out of view,
//   and never starts with prefers-reduced-motion (WCAG 2.2.2).
// Markup hooks: data-tabs, data-persona, data-panel, data-role-heading, data-progress(-spacer); the tab
// classes come from data-active/data-inactive on the tablist, so UnoCSS finds them in the HTML.
(function () {
  "use strict";

  var ADVANCE_MS = 5000;

  var groups = Array.prototype.map.call(document.querySelectorAll("[data-tabs]"), function (root) {
    var list = root.querySelector('[role="tablist"]');
    var tabs = Array.prototype.slice.call(list.querySelectorAll('[role="tab"]'));
    return {
      list: list,
      tabs: tabs,
      panels: tabs.map(function (tab) {
        return document.getElementById(tab.getAttribute("aria-controls"));
      }),
      active: list.getAttribute("data-active").split(/\s+/),
      inactive: list.getAttribute("data-inactive").split(/\s+/),
    };
  });
  if (!groups.length) return;

  var keys = groups[0].tabs.map(function (tab) {
    return tab.getAttribute("data-persona");
  });
  var current = null;
  var locked = false;
  var timer = null;
  var progress = document.querySelector("[data-progress]");
  var progressBar = progress && progress.firstElementChild;
  var spacer = document.querySelector("[data-progress-spacer]");
  var hero = document.querySelector("[data-hero]");
  var observer = null;

  function show(key, animate) {
    var changed = key !== current;
    current = key;
    groups.forEach(function (g) {
      g.tabs.forEach(function (tab) {
        var on = tab.getAttribute("data-persona") === key;
        tab.setAttribute("aria-selected", on ? "true" : "false");
        tab.tabIndex = on ? 0 : -1;
        tab.classList.remove.apply(tab.classList, on ? g.inactive : g.active);
        tab.classList.add.apply(tab.classList, on ? g.active : g.inactive);
      });
      g.panels.forEach(function (panel) {
        var on = panel.getAttribute("data-panel") === key;
        panel.hidden = !on;
        if (on && animate && changed) {
          panel.classList.remove("panel-in");
          void panel.offsetWidth; // restart the animation
          panel.classList.add("panel-in");
        }
      });
    });
  }

  function lock() {
    if (locked) return;
    locked = true;
    clearTimeout(timer);
    if (progress) progress.hidden = true;
    if (spacer) spacer.hidden = false;
    if (observer) observer.disconnect();
  }

  function schedule() {
    if (progressBar) {
      progressBar.style.transition = "none";
      progressBar.style.width = "0%";
      void progressBar.offsetWidth;
      progressBar.style.transition = "width " + ADVANCE_MS + "ms linear";
      progressBar.style.width = "100%";
    }
    timer = setTimeout(function () {
      if (locked) return;
      show(keys[(keys.indexOf(current) + 1) % keys.length], true);
      schedule();
    }, ADVANCE_MS);
  }

  // ── Enhance the markup ───────────────────────────────────────────────────
  groups.forEach(function (g) {
    g.list.hidden = false;
    g.panels.forEach(function (panel, i) {
      panel.setAttribute("role", "tabpanel");
      panel.setAttribute("aria-labelledby", g.tabs[i].id);
      // The tab names the panel now; the role heading was only needed for the stacked view.
      var heading = panel.querySelector("[data-role-heading]");
      if (heading) heading.hidden = true;
      // APG: a panel without focusable content is itself focusable.
      if (!panel.querySelector("a[href], button, input, select, textarea, [tabindex]")) panel.tabIndex = 0;
    });

    g.list.addEventListener("focusin", lock);
    g.list.addEventListener("click", function (event) {
      var tab = event.target.closest('[role="tab"]');
      if (!tab) return;
      lock();
      show(tab.getAttribute("data-persona"), true);
    });
    g.list.addEventListener("keydown", function (event) {
      var i = keys.indexOf(current);
      var next;
      if (event.key === "ArrowRight") next = (i + 1) % keys.length;
      else if (event.key === "ArrowLeft") next = (i - 1 + keys.length) % keys.length;
      else if (event.key === "Home") next = 0;
      else if (event.key === "End") next = keys.length - 1;
      else return;
      event.preventDefault();
      lock();
      show(keys[next], true);
      g.tabs[next].focus();
    });
  });

  show(keys[0], false);

  // ── Auto-advance ─────────────────────────────────────────────────────────
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) {
    lock();
    return;
  }
  if (progress) progress.hidden = false;
  if (spacer) spacer.hidden = true;
  if (hero && "IntersectionObserver" in window) {
    observer = new IntersectionObserver(function (entries) {
      if (!entries[entries.length - 1].isIntersecting) lock();
    });
    observer.observe(hero);
  }
  schedule();
})();

