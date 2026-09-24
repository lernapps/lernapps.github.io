// Smoke (#26, TD-5): Jede Seite lädt mit HTTP 200 und ohne Konsolenfehler. Use Case: jede App lädt.
import { test, expect } from "@playwright/test";
import { alleSeiten, sammleFehler } from "./seiten.js";

for (const pfad of alleSeiten) {
  test(`lädt ohne Fehler: /${pfad}`, async ({ page }) => {
    const fehler = sammleFehler(page);
    const antwort = await page.goto(pfad, { waitUntil: "networkidle" });
    expect(antwort.status()).toBe(200);
    expect(fehler).toEqual([]);
  });
}
