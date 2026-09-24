// Übungsrunde (#26, Use Case "Aufgabe üben"): neue Aufgabe, falsche Antwort mit Rückmeldung, Lösung zeigen, richtige
// Antwort wird angenommen – je App auf der ersten Kompetenzseite. Deep Link mit nr= macht die Aufgabe bestimmbar; die
// richtige Antwort liefert derselbe Generator unter Node (gleicher Seed, gleiche Aufgabe).
import path from "node:path";
import { pathToFileURL } from "node:url";
import { test, expect } from "@playwright/test";
import { apps, eineJeApp } from "./seiten.js";
import { erzeugeZufall } from "../src/kern/js/zufall.js";

const NR = 42;

async function aufgabeZu({ app, id }) {
  const k = apps.find((a) => a.pfad === app).kompetenzen.find((x) => x.id === id);
  const modul = await import(pathToFileURL(path.resolve("src", app, "js", k.generator)).href);
  return modul.erzeugeAufgabe(erzeugeZufall(NR), {});
}

/** Füllt jedes Feld: wert(feld) liefert den Text bzw. den Optionswert. */
async function fuelle(page, felder, wert) {
  for (const feld of felder) {
    const w = String(wert(feld));
    const ziel = page.locator(`#trainer [name="${feld.id}"]`);
    if (feld.typ === "radio") await ziel.and(page.locator(`[value="${w}"]`)).check();
    else if (feld.typ === "auswahl") await ziel.selectOption(w);
    else await ziel.fill(w);
  }
  await page.getByRole("button", { name: "Prüfen" }).click();
}

const falsch = (feld) => (feld.optionen ? feld.optionen.find((o) => o.wert !== feld.richtig).wert : "999999");

for (const seite of eineJeApp) {
  test(`Übungsrunde: /${seite.pfad}`, async ({ page }) => {
    const aufgabe = await aufgabeZu(seite);
    const felder = aufgabe.felder.map((f) => ({ ...f, richtig: String(aufgabe.loesung[f.id]) }));
    const feedback = page.locator("#trainer .feedback");
    const nummer = page.locator("#trainer .aufgabenlink");

    await page.goto(`${seite.pfad}?nr=${NR}`);
    await expect(nummer).toContainText(`Aufgabe Nr. ${NR} `);
    await page.getByRole("button", { name: "Neue Aufgabe" }).click();
    await expect(nummer).not.toContainText(`Aufgabe Nr. ${NR} `);

    await page.goto(`${seite.pfad}?nr=${NR}`);
    await fuelle(page, felder, falsch);
    await expect(feedback).toHaveClass(/falsch/);
    await expect(feedback).not.toBeEmpty();

    await page.getByRole("button", { name: "Lösung zeigen" }).click();
    await expect(page.locator("#trainer .loesung-text")).toBeVisible();
    await expect(page.locator("#trainer .loesung-text li").first()).toBeVisible();

    await fuelle(page, felder, (f) => f.richtig.replace(".", ","));
    await expect(feedback).toHaveClass(/richtig/);
  });
}
