// The roles in the hero of the home page change slowly while the page stands still: every 10 seconds the next role,
// while the edge to its corner fills up as a progress bar (home.css, class "running"). It only opens a new perspective
// to a reader who has stopped. Scrolling, or a click or tap anywhere in the square, ends it for good; a click on a
// corner keeps that role. Hovering or focusing the square pauses it. With "reduce motion" nothing changes by itself.
// Without this script the corners still switch the roles (radio inputs, no JavaScript needed).
(() => {
  const roles = document.querySelector(".roles");
  if (!roles || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const STEP = 10000;
  const inputs = [...roles.querySelectorAll(":scope > input")];
  const square = roles.querySelector(".roles-square");
  const bar = (name) => roles.querySelector(".pg-" + name);
  const wide = matchMedia("(min-width: 720px)");
  let start = performance.now();
  let pausedAt = null;
  let running = true;
  roles.classList.add("running");

  const current = () => Math.max(0, inputs.findIndex((i) => i.checked));
  const scale = (el, axis, f) => (el.style.transform = `scale${axis}(${f})`);

  function draw(f) {
    for (const name of ["top", "right", "bottom", "left", "string"]) scale(bar(name), "X", 0);
    if (!running) return;
    const i = current();
    if (wide.matches) {
      if (i === 0) scale(bar("top"), "X", f);
      if (i === 1) scale(bar("right"), "Y", f);
      if (i === 2) {
        scale(bar("bottom"), "X", Math.min(1, 2 * f));
        scale(bar("left"), "Y", Math.max(0, 2 * f - 1));
      }
    } else {
      // The beads sit at 16 %, 50 % and 84 % of the top edge; from the last one the bar runs back to the first.
      const [left, width, origin] = [[16, 34, "left"], [50, 34, "left"], [16, 68, "right"]][i];
      const s = bar("string");
      s.style.left = left + "%";
      s.style.width = width + "%";
      s.style.transformOrigin = origin;
      scale(s, "X", f);
    }
  }

  function stop() {
    if (!running) return;
    running = false;
    roles.classList.remove("running");
    draw(0);
  }

  function frame(now) {
    if (!running) return;
    if (pausedAt === null) {
      let f = (now - start) / STEP;
      if (f >= 1) {
        inputs[(current() + 1) % inputs.length].checked = true;
        start = now;
        f = 0;
      }
      draw(f);
    }
    requestAnimationFrame(frame);
  }

  const pause = () => { if (pausedAt === null) pausedAt = performance.now(); };
  const resume = () => {
    if (pausedAt === null || square.matches(":hover") || roles.contains(document.activeElement)) return;
    start += performance.now() - pausedAt;
    pausedAt = null;
  };
  square.addEventListener("pointerenter", pause);
  square.addEventListener("pointerleave", resume);
  roles.addEventListener("focusin", pause);
  roles.addEventListener("focusout", () => setTimeout(resume));
  square.addEventListener("pointerdown", stop);
  inputs.forEach((i) => i.addEventListener("change", stop));
  addEventListener("scroll", stop, { passive: true, once: true });
  requestAnimationFrame(frame);
})();
