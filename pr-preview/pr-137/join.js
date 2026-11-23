// Progressive enhancement for /join/: a copy button for each prompt. Without it, the prompt is plain text in a
// <pre> and can be selected by hand. Markup hooks: data-ask (the box), data-ask-text, data-ask-copy (with
// data-copied, the label after copying).
document.querySelectorAll("[data-ask]").forEach(function (box) {
  var text = box.querySelector("[data-ask-text]");
  var button = box.querySelector("[data-ask-copy]");
  if (!text || !button || !navigator.clipboard) return;
  var label = button.textContent;
  button.hidden = false;
  button.addEventListener("click", function () {
    navigator.clipboard.writeText(text.textContent).then(function () {
      button.textContent = button.dataset.copied;
      setTimeout(function () { button.textContent = label; }, 2000);
    });
  });
});
