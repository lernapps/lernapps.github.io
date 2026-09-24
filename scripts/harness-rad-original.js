/*
 * Verbindung zum Original-Harness-Rad (arc42 8.16, ADR-025): baut die URL, die unseren Stand im
 * Harness Coverage Wheel von Semantic Anchors öffnet, und den AsciiDoc-Abschnitt mit Link und
 * Zwei-Klick-Einbettung. URL-Format seit LLM-Coding/Semantic-Anchors#748:
 *   harness-coverage-wheel.html?tier=2#on=<id>,<id>&na=<id>,<id>
 * Das Original kennt nur "abgedeckt" (on) und "nicht zutreffend" (na). Zuordnung:
 * vorhanden → on, entfällt → na; in Arbeit, geplant, verworfen und offen bleiben Lücken.
 */
export const ORIGINAL_SEITE = "https://llm-coding.github.io/Semantic-Anchors/harness-coverage-wheel.html";

// data-id der 69 Schichten im Original (website/public/harness-coverage-wheel.html, Stand PR #748).
// Unsere Schlüssel in ROH sind genau diese ids; die Zuordnung ist die Identität, aber geprüft.
export const ORIGINAL_IDS = Object.freeze([
  "compiler", "type-checker", "formatter", "import-sorter-dead-code", "linter", "unit-tests",
  "property-based-fuzz", "mutation-testing", "integration-tests", "contract-tests", "bdd-acceptance-tests",
  "end-to-end-ui", "snapshot-visual-regression", "performance-benchmark", "smoke-tests", "secret-scanning",
  "sca", "container-image-scanning", "iac-scanning", "supply-chain-sbom-slsa", "compliance-scanning",
  "license-compliance", "sast", "dast", "iast", "llm-security-review", "threat-modeling", "complexity-metrics",
  "api-contract-lint", "fagan-inspection", "code-review", "llm-code-review", "archunit-dependency-cruiser",
  "adr-enforcement", "spec-traceability", "atam", "schema-diff", "llm-design-review",
  "json-schema-openapi-validation", "db-migration-dry-run", "pii-scanner", "config-validation", "data-contract",
  "accessibility-automated", "contrast-checker", "cross-browser-tests", "ui-prose-lint", "accessibility-manual",
  "i18n-lint", "visual-regression", "distributed-tracing", "canary-progressive-delivery", "anomaly-detection",
  "runtime-assertions-invariants", "health-checks", "observability-gates", "chaos-engineering", "feature-flags",
  "symbolic-execution", "type-driven-design", "formal-verification", "model-checker", "markdown-asciidoc-lint",
  "link-checker", "code-in-docs-validation", "spell-check", "diagram-build", "prose-lint", "doc-code-drift",
]);
const BEKANNT = new Set(ORIGINAL_IDS);

/** Unsere Schicht-id als data-id des Originals; unbekannte ids brechen ab, statt still zu fehlen. */
export function zuOriginalId(id) {
  if (!BEKANNT.has(id)) throw new Error(`Harness-Rad: Schicht "${id}" gibt es im Original nicht (data-id)`);
  return id;
}

/** URL zum Original mit unserem Stand: Tier in der Query, Auswahl im Hash (erreicht keinen Server). */
export function baueOriginalUrl(schichten, tier = 2) {
  const ids = (status) => schichten.filter((s) => s.status === status).map((s) => zuOriginalId(s.id));
  schichten.forEach((s) => zuOriginalId(s.id));
  const hash = [["on", ids("vorhanden")], ["na", ids("entfällt")]]
    .filter(([, liste]) => liste.length).map(([k, liste]) => `${k}=${liste.join(",")}`).join("&");
  return `${ORIGINAL_SEITE}?tier=${tier}${hash ? `#${hash}` : ""}`;
}

/** Rechnet wie das Original (inScope: nicht n/a und Mindest-Tier ≤ Tier) aus einer URL. */
export function abdeckungImOriginal(url, schichten) {
  const u = new URL(url);
  const tier = Number(u.searchParams.get("tier"));
  const h = new URLSearchParams(u.hash.slice(1));
  const on = new Set((h.get("on") ?? "").split(",")), na = new Set((h.get("na") ?? "").split(","));
  const imTier = schichten.filter((s) => !na.has(s.id) && s.tier <= tier);
  return { abgedeckt: imTier.filter((s) => on.has(s.id)).length, imTier: imTier.length };
}

const prozent = (a, b) => `${a} von ${b} (${b ? Math.round((a / b) * 100) : 0} %)`;
const HTML_ESC = (t) => String(t).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

// Zwei-Klick-Einbettung wie bei den Videos (src/kern/js/video.js): Ohne JS bleibt der Kasten versteckt, es gibt
// nur SVG und Link. Mit JS erscheint ein lokaler Platzhalter; erst der Klick setzt das <iframe>.
const SKRIPT = `(function () {
  var kasten = document.querySelector(".harness-original");
  if (!kasten) return;
  var quelle = kasten.getAttribute("data-quelle") || "";
  if (quelle.indexOf("${ORIGINAL_SEITE}?") !== 0) return;
  kasten.hidden = false;
  kasten.querySelector("button").addEventListener("click", function () {
    var rahmen = document.createElement("iframe");
    rahmen.title = "Harness Coverage Wheel (Original, llm-coding.github.io) mit dem Stand von lernapps";
    rahmen.loading = "lazy";
    rahmen.referrerPolicy = "no-referrer";
    rahmen.setAttribute("sandbox", "allow-scripts allow-same-origin");
    rahmen.style.cssText = "display:block;width:100%;height:1100px;border:1px solid #dee2e6;border-radius:4px";
    rahmen.src = quelle;
    kasten.replaceChildren(rahmen);
  }, { once: true });
})();`;

/** AsciiDoc für arc42 8.16 unter dem Bild: Link, beide Prozentwerte, Zwei-Klick-Einbettung. */
export function schreibeOriginalAbschnitt(schichten, unser, tier = 2) {
  const url = baueOriginalUrl(schichten, tier);
  const orig = abdeckungImOriginal(url, schichten);
  const gleich = orig.abgedeckt === unser.vorhanden && orig.imTier === unser.relevant;
  const vergleich = `Das Original zählt ${prozent(orig.abgedeckt, orig.imTier)}, unser Rad ${prozent(unser.vorhanden, unser.relevant)}.`;
  return [
    "// Erzeugt von scripts/harness-rad.js (scripts/harness-rad-original.js) – nicht von Hand ändern.",
    `link:${url}[Unseren Stand im Original öffnen^]`, "",
    "Das Original kennt nur „abgedeckt“ und „nicht zutreffend“. Der Link setzt „vorhanden“ als abgedeckt und " +
      "„entfällt“ als nicht zutreffend; „in Arbeit“, „geplant“ und „verworfen“ bleiben dort Lücken. " + (gleich
      ? "Weil auch unser Rad nur Vorhandenes zählt und Entfallenes weglässt, ergibt das denselben Wert. " + vergleich +
        " Was das Original nicht zeigt: welche Lücken schon in Arbeit oder geplant sind."
      : "Deshalb weicht sein Prozentwert von unserem ab. " + vergleich), "",
    "++++",
    `<div class="harness-original" data-quelle="${HTML_ESC(url)}" hidden>`,
    "<p>Das Original-Rad lässt sich hier einbetten. Beim Laden wird die Seite llm-coding.github.io (GitHub Pages) aufgerufen.</p>",
    '<p><button type="button">Original-Rad hier laden</button></p>',
    "</div>",
    `<script>\n${SKRIPT}\n</script>`,
    "++++", "",
  ].join("\n");
}
