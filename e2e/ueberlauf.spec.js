// Mobile-first (#26): Bei 360 px Breite scrollt keine Kompetenzseite waagerecht – ohne JS (nur Erklärung und Bild)
// und mit geladener Übung samt aufgeklappter Lösung (die breitesten Zeilen).
import { test, expect } from "@playwright/test";
import { kompetenzSeiten } from "./seiten.js";

const BREITE = { width: 360, height: 800 };
const ueberlauf = (page) => page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);

test.describe("ohne Übung (ohne JS)", () => {
  test.use({ viewport: BREITE, javaScriptEnabled: false });
  for (const { pfad } of kompetenzSeiten) {
    test(`kein waagerechter Überlauf bei 360 px: /${pfad}`, async ({ page }) => {
      await page.goto(pfad);
      expect(await ueberlauf(page)).toBeLessThanOrEqual(0);
    });
  }
});

test.describe("mit Übung und Lösung", () => {
  test.use({ viewport: BREITE });
  for (const { pfad } of kompetenzSeiten) {
    test(`kein waagerechter Überlauf bei 360 px: /${pfad}?nr=1`, async ({ page }) => {
      await page.goto(`${pfad}?nr=1`);
      await page.getByRole("button", { name: "Lösung zeigen" }).click();
      await expect(page.locator(".loesung-text")).toBeVisible();
      expect(await ueberlauf(page)).toBeLessThanOrEqual(0);
    });
  }
});
