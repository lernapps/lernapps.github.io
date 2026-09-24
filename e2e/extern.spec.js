// Datensparsamkeit (#26, T-001/ADR Zwei-Klick-Video): Vor jeder Nutzeraktion fragt keine App-Seite einen fremden Server an.
import { test, expect } from "@playwright/test";
import { appSeiten } from "./seiten.js";

for (const pfad of appSeiten) {
  test(`keine externe Anfrage vor dem Klick: /${pfad}`, async ({ page, baseURL }) => {
    const eigene = new URL(baseURL).origin;
    const fremde = [];
    page.on("request", (r) => {
      const url = r.url();
      if (/^(data|blob|about):/.test(url)) return;
      if (new URL(url).origin !== eigene) fremde.push(url);
    });
    await page.goto(pfad, { waitUntil: "networkidle" });
    expect(fremde).toEqual([]);
  });
}
