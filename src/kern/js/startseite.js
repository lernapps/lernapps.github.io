/* Startseite einer App: Selbsteinschätzung laden und speichern, letztes Testergebnis zeigen. Generisch; app kommt von der Seite. */
import { erzeugeSpeicher } from "./storage.js";
import { SYMBOLE, STUFEN_NAMEN, MODUS_NAMEN, formatDatum, testLink } from "./testablauf.js";

/** @param {import("./storage.js").Testergebnis} letzterTest */
function zeigeLetztenTest(letzterTest) {
  for (const zelle of /** @type {NodeListOf<HTMLElement>} */ (document.querySelectorAll("[data-test]"))) {
    const stufe = letzterTest.ergebnis[/** @type {string} */ (zelle.dataset.test)];
    if (!stufe || !SYMBOLE[stufe]) continue;
    zelle.textContent = SYMBOLE[stufe];
    zelle.setAttribute("title", `Test: ${STUFEN_NAMEN[stufe]}`);
    zelle.classList.add(`stufe-${stufe}`);
  }
  const link = document.createElement("a");
  link.href = testLink(letzterTest.nr, letzterTest.modus);
  link.textContent = `Nr. ${letzterTest.nr}, ${MODUS_NAMEN[letzterTest.modus] || "Test"}, ${formatDatum(letzterTest.datum)}`;
  document.querySelector("[data-letzter-test]")?.replaceChildren("Letzter Test: ", link);
}

/** app: APP aus js/app.config.js (id = localStorage-Präfix). @param {{ app: import("./seite.js").App }} seite */
export function starteStartseite({ app }) {
  const speicher = erzeugeSpeicher(app.id);
  const letzterTest = speicher.ladeLetztenTest();
  if (letzterTest) zeigeLetztenTest(letzterTest);

  const gespeichert = speicher.ladeSelbsteinschaetzung();
  const hinweis = document.querySelector("[data-speicherhinweis]");
  for (const radio of /** @type {NodeListOf<HTMLInputElement>} */ (document.querySelectorAll("input[type=radio][data-kompetenz]"))) {
    // Der Selektor verlangt data-kompetenz, dataset.kompetenz ist also immer gesetzt.
    if (gespeichert[/** @type {string} */ (radio.dataset.kompetenz)] === radio.value) radio.checked = true;
    radio.addEventListener("change", () => {
      const ok = speicher.speichereSelbsteinschaetzung(/** @type {string} */ (radio.dataset.kompetenz), radio.value);
      if (hinweis) hinweis.textContent = ok ? "Gespeichert – nur in diesem Browser." : "Konnte nicht speichern (Browser-Speicher gesperrt). Die Auswahl gilt nur bis zum Neuladen.";
    });
  }
}
