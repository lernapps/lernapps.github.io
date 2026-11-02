// Progressive enhancement for the home page: the button "show me cat videos" opens the cat video in a dialog and
// plays it once; at the end an end card points to the catalog. Without this script the button stays hidden and the
// poster links to the video file (<noscript> in index.njk). Markup hooks: data-cat (the <dialog>), data-cat-open
// (button in the hero), data-cat-close, data-cat-player, data-cat-video, data-cat-end, data-cat-leave (a link of
// the end card that leaves the dialog for the page).
(function () {
  var dialog = document.querySelector("[data-cat]");
  var open = document.querySelector("[data-cat-open]");
  if (!dialog || !open || !dialog.showModal) return;
  var video = dialog.querySelector("[data-cat-video]");
  var player = dialog.querySelector("[data-cat-player]");
  var end = dialog.querySelector("[data-cat-end]");
  var calm = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  open.hidden = false;

  function start() {
    if (!video.poster) video.poster = video.dataset.poster; // the poster loads only now, not with the page
    end.hidden = true;
    player.hidden = false;
    video.focus({ preventScroll: true });
    if (calm) return; // reduced motion: the person presses play
    video.currentTime = 0;
    var started = video.play();
    if (started && started.catch) started.catch(function () {}); // blocked: the controls stay
  }

  open.addEventListener("click", function () { dialog.showModal(); start(); });
  var leaving = false;
  dialog.querySelector("[data-cat-leave]").addEventListener("click", function () { leaving = true; dialog.close(); });
  dialog.querySelector("[data-cat-close]").addEventListener("click", function () { dialog.close(); });
  dialog.addEventListener("click", function (e) { if (e.target === dialog) dialog.close(); }); // the backdrop
  dialog.addEventListener("close", function () { video.pause(); if (!leaving) open.focus(); leaving = false; });
  video.addEventListener("ended", function () {
    player.hidden = true;
    end.hidden = false;
    end.focus({ preventScroll: true });
  });
})();
