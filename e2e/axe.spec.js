// Barrierefreiheit (#26, R-030): axe-core findet keine schweren oder kritischen Verstöße gegen WCAG 2.2 AA – auf jeder
// Kompetenzseite jeder App (im Ausgangszustand und mit geladener Übung), den Start- und Testseiten, der Übersicht und
// der Mathe-Karte. Die Liste kommt aus seiten.js: neue Apps und Kompetenzen laufen automatisch mit.
import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { alleSeiten, kompetenzSeiten } from "./seiten.js";

const TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];
// Bekannte Verstöße, je Regel ein Issue (Teil von #18). Leer halten; ein Eintrag braucht die Issue-Nummer.
const BEKANNT = [];

// Die Architektur-Doku (docs/) kommt von docToolchain, nicht aus unseren Vorlagen: nicht Teil dieser Prüfung.
const seiten = [...alleSeiten.filter((p) => !p.startsWith("docs/")), ...kompetenzSeiten.map((k) => `${k.pfad}?nr=1`)];

for (const pfad of seiten) {
  test(`axe WCAG 2.2 AA: /${pfad}`, async ({ page }) => {
    await page.goto(pfad, { waitUntil: "networkidle" });
    const { violations, passes } = await new AxeBuilder({ page }).withTags(TAGS).disableRules(BEKANNT).analyze();
    const schwer = violations
      .filter((v) => ["serious", "critical"].includes(v.impact))
      .map((v) => `${v.id} (${v.impact}): ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`);
    expect(passes.length).toBeGreaterThan(0);
    expect(schwer).toEqual([]);
  });
}
