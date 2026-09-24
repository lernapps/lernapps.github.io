// "Zurück zu Claude" (#26, ADR-021): Mit von=tutor zeigt die Seite den Knopf. Hat ein Link mit target="_blank" den Tab
// geöffnet (wie der Tutor), schließt der Klick den Tab; direkt geöffnet bleibt er offen und zeigt die Ersatzmeldung.
import { test, expect } from "@playwright/test";
import { eineJeApp } from "./seiten.js";
import { KNOPF_TEXT, MELDUNG_KOPIERT } from "../src/kern/js/zurueck.js";

const seite = `${eineJeApp[0].pfad}?nr=3&von=tutor`;

test.beforeEach(async ({ context, baseURL }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"], { origin: new URL(baseURL).origin });
});

test("ohne von=tutor kein Knopf", async ({ page }) => {
  await page.goto(`${eineJeApp[0].pfad}?nr=3`);
  await expect(page.locator("#trainer .aufgabenlink")).toBeVisible();
  await expect(page.getByRole("button", { name: KNOPF_TEXT })).toHaveCount(0);
});

test("aus einem Link mit target=_blank geöffnet: Klick schließt den Tab", async ({ page, context }) => {
  await page.goto("");
  await page.evaluate((href) => {
    const a = document.createElement("a");
    a.href = href;
    a.target = "_blank";
    a.id = "zum-tutor-link";
    a.textContent = "Übung öffnen";
    document.body.prepend(a);
  }, seite);
  const [tab] = await Promise.all([context.waitForEvent("page"), page.click("#zum-tutor-link")]);
  await tab.waitForLoadState();
  const zu = tab.waitForEvent("close");
  await tab.getByRole("button", { name: KNOPF_TEXT }).click();
  await zu;
  expect(tab.isClosed()).toBe(true);
});

test("direkt geöffnet: der Tab bleibt offen und zeigt die Ersatzmeldung", async ({ page }) => {
  await page.goto(seite);
  await page.getByRole("button", { name: KNOPF_TEXT }).click();
  await expect(page.locator(".zurueck-meldung")).toHaveText(MELDUNG_KOPIERT);
  expect(page.isClosed()).toBe(false);
  expect(await page.evaluate(() => navigator.clipboard.readText())).toContain("Aufgabe Nr. 3: noch nicht gelöst");
});
