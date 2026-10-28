// Progressive enhancement for the home page (draft, placements a to d, see src/_data/cat.js): a click on the
// button "show me cat videos" or on the play button plays the cat video once; at the end an end card points to the
// catalog. Without this script the button stays hidden, the video has its native controls, and the page is complete.
// Markup hooks: data-cat (the place: a box, a section or a <dialog>), data-cat-open (button in the hero), data-cat-close
// (in the dialog), data-cat-player, data-cat-video, data-cat-play (overlay), data-cat-end, data-cat-again.
(function () {
  var root = document.querySelector("[data-cat]");
  if (!root) return;
  var open = document.querySelector("[data-cat-open]");
  var close = root.querySelector("[data-cat-close]");
  var player = root.querySelector("[data-cat-player]");
  var video = root.querySelector("[data-cat-video]");
  var overlay = root.querySelector("[data-cat-play]");
  var end = root.querySelector("[data-cat-end]");
  var again = root.querySelector("[data-cat-again]");
  var dialog = root.tagName === "DIALOG" ? root : null;
  var calm = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (open) open.hidden = false;
  if (overlay) { overlay.hidden = false; video.controls = false; }

  function reveal() {
    if (dialog) { if (!dialog.open) dialog.showModal(); return; }
    if (root.hidden) {
      root.hidden = false;
      root.scrollIntoView({ behavior: calm ? "auto" : "smooth", block: "center" });
    }
  }

  function start() {
    end.hidden = true;
    player.hidden = false;
    if (overlay) overlay.hidden = true;
    video.controls = true;
    video.focus({ preventScroll: true });
    if (calm) return; // reduced motion: show the player, the person presses play
    video.currentTime = 0;
    var started = video.play();
    if (started && started.catch) started.catch(function () {}); // blocked: the controls stay
  }

  if (open) open.addEventListener("click", function () { reveal(); start(); });
  if (overlay) overlay.addEventListener("click", start);
  again.addEventListener("click", start);
  video.addEventListener("ended", function () {
    player.hidden = true;
    end.hidden = false;
    end.focus({ preventScroll: true });
  });
  if (dialog) {
    close.addEventListener("click", function () { dialog.close(); });
    dialog.addEventListener("click", function (e) { if (e.target === dialog) dialog.close(); }); // the backdrop
    dialog.addEventListener("close", function () { video.pause(); if (open) open.focus(); });
  }
})();
