/*
 * Seiten-Skript für baumdiagramm.html: der Abschnitt #bauen ("Baum bauen"). Er braucht JavaScript und entsteht
 * deshalb erst hier, vor #uebung. Die Einstellung zeichnet sofort den vollständigen Baum; "Übung mit diesem Baum"
 * schickt das Formular per GET – die Seite lädt mit denselben URL-Parametern (experiment, urne, zuege, modus),
 * und der Kern-Trainer liest sie wie jeden anderen Aufgabenlink.
 */
import { svgEl } from "../../../kern/js/svg.js";
import { el } from "../../../kern/js/aufgabe-eingabe.js";
import { parseUrne, urne, muenze, wuerfelSechs } from "../modell/experimente.js";
import { baueBaum } from "../modell/baum.js";
import { zeichneBaumIn } from "../vis/baum.js";
import { gruppe, rahmen } from "../vis/rahmen.js";

const option = (wert, text) => el("option", { value: wert, text });
const radio = (wert, text, checked) => el("label", {}, [el("span", {}, [el("input", { type: "radio", name: "modus", value: wert, checked }), ` ${text}`])]);

/** Der Abschnitt #bauen als DOM (kein HTML-String, T-003): Überschrift, Einleitung, Formular, Platz für den Baum. */
function baueAbschnitt() {
  const formular = el("form", { class: "konfig", method: "get", action: "baumdiagramm.html#uebung" }, [
    el("label", {}, ["Zufallsversuch ", el("select", { name: "experiment" }, [
      option("urne", "Urne mit Kugeln"), option("muenze", "Münze"), option("wuerfel", "Würfel: 6 / keine 6"),
    ])]),
    el("label", {}, ["Urne (z. B. 3r2b1g) ", el("input", {
      type: "text", name: "urne", value: "3r2b1g", size: "9", autocomplete: "off", spellcheck: "false",
      title: "Anzahl und Farbe: r rot, b blau, g gelb, n grün, s schwarz, w weiß, l lila",
    })]),
    el("label", {}, ["Züge ", el("select", { name: "zuege" }, [option("2", "2"), option("3", "3")])]),
    el("fieldset", {}, [el("legend", { text: "Zurücklegen" }), radio("mit", "mit", true), radio("ohne", "ohne", false)]),
    el("button", { type: "submit", class: "primaer", text: "Übung mit diesem Baum" }),
  ]);
  return el("section", { id: "bauen" }, [
    el("h2", { text: "Baum bauen" }),
    el("p", { text: "Stell dir einen Zufallsversuch zusammen. Der Baum wird sofort gezeichnet, mit allen Zweig- und Pfadwahrscheinlichkeiten." }),
    formular,
    el("div", { class: "bauer" }),
  ]);
}

function setzeAusUrl(form, params) {
  const kurz = ["muenze", "wuerfel"].find((k) => /^\d+$/.test(params.get(k) || ""));
  const experiment = params.get("experiment") || kurz || (params.get("urne") ? "urne" : null);
  if (["urne", "muenze", "wuerfel"].includes(experiment)) form.elements.experiment.value = experiment;
  if (parseUrne(params.get("urne"))) form.elements.urne.value = params.get("urne");
  const zuege = params.get("zuege") || (kurz ? params.get(kurz) : null);
  if (["2", "3"].includes(zuege)) form.elements.zuege.value = zuege;
  if (["mit", "ohne"].includes(params.get("modus"))) form.elements.modus.value = params.get("modus");
}

function zeichne(form, svg) {
  const art = form.elements.experiment.value;
  const istUrne = art === "urne";
  form.elements.urne.disabled = !istUrne;
  for (const r of form.querySelectorAll('input[name="modus"]')) r.disabled = !istUrne;
  const text = form.elements.urne.value.trim().toLowerCase();
  const exp = art === "muenze" ? muenze() : art === "wuerfel" ? wuerfelSechs() : urne(parseUrne(text) ? text : "3r2b1g");
  const baum = baueBaum(exp, Number(form.elements.zuege.value), form.elements.modus.value !== "ohne");
  const g = gruppe();
  const { breite, hoehe } = zeichneBaumIn(g, baum, { zeigePfad: true });
  rahmen(svg, breite, hoehe, "Vollständiges Baumdiagramm mit allen Zweig- und Pfadwahrscheinlichkeiten", g);
}

const uebung = document.getElementById("uebung");
if (uebung) {
  const abschnitt = baueAbschnitt();
  uebung.before(abschnitt);
  const form = abschnitt.querySelector("form");
  const svg = svgEl("svg", { class: "vis" });
  abschnitt.querySelector(".bauer").append(svg);
  setzeAusUrl(form, new URLSearchParams(window.location.search));
  form.addEventListener("input", () => zeichne(form, svg));
  form.addEventListener("change", () => zeichne(form, svg));
  zeichne(form, svg);
  if (window.location.hash === "#bauen") abschnitt.scrollIntoView();
}
