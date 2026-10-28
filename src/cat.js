// Progressive enhancement for the home page: the button "show me cat videos" opens the player below the hero and
// plays the video once; at the end it is replaced by a pointer to the catalog. Without this script the button stays
// hidden and the page is complete. Markup hooks: data-cat-open (button), data-cat (box), data-cat-player,
// data-cat-video, data-cat-end, data-cat-again.
(function () {
  var open = document.querySelector("[data-cat-open]");
  var box = document.querySelector("[data-cat]");
  if (!open || !box) return;
  var player = box.querySelector("[data-cat-player]");
  var video = box.querySelector("[data-cat-video]");
  var end = box.querySelector("[data-cat-end]");
  var again = box.querySelector("[data-cat-again]");
  var calm = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  open.hidden = false;

  function play() {
    end.hidden = true;
    player.hidden = false;
    box.hidden = false;
    open.setAttribute("aria-expanded", "true");
    box.scrollIntoView({ behavior: calm ? "auto" : "smooth", block: "center" });
    video.focus({ preventScroll: true });
    // Reduced motion: show the player, but let the person press play.
    if (calm) return;
    video.currentTime = 0;
    var started = video.play();
    if (started && started.catch) started.catch(function () {}); // blocked: the controls stay
  }

  open.addEventListener("click", play);
  again.addEventListener("click", play);
  video.addEventListener("ended", function () {
    player.hidden = true;
    end.hidden = false;
    end.focus({ preventScroll: true });
  });
})();
