// Ohne JavaScript (#26, Projektregel "Text UND Bild"): Erklärung und statisches Bild sind sichtbar – je App eine Seite.
import { test, expect } from "@playwright/test";
import { eineJeApp } from "./seiten.js";

test.use({ javaScriptEnabled: false });

for (const { pfad } of eineJeApp) {
  test(`ohne JS: Erklärung und Bild sichtbar auf /${pfad}`, async ({ page }) => {
    await page.goto(pfad);
    await expect(page.locator("#erklaerung")).toHaveAttribute("open", "");
    await expect(page.locator("#warum p").first()).toBeVisible();
    await expect(page.locator("#regel")).toBeVisible();
    const bild = page.locator("#visualisierung svg");
    await expect(bild).toBeVisible();
    expect(await bild.locator("*").count()).toBeGreaterThan(0);
    const box = await bild.boundingBox();
    expect(box.width).toBeGreaterThan(20);
    expect(box.height).toBeGreaterThan(20);
  });
}
