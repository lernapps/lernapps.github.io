/*
 * Die EINZIGE Stelle mit der Adresse der Site. Alles andere – pathPrefix, Canonicals, App-Adressen, llms.txt,
 * tutor.md, claude.ai-Link, Quellcode-Links – leitet lib/adressen.js daraus ab. Zieht das Repo um, nur hier ändern.
 */
import fs from "node:fs";
import { leiteAdressenAb } from "../../lib/adressen.js";

// Nur ein default-Export: Mit zusätzlichen benannten Exporten liest Eleventy die Datendatei anders.
const BASIS_URL = "https://raifdmueller.github.io/lern-apps/";

const paket = JSON.parse(fs.readFileSync(new URL("../../package.json", import.meta.url), "utf8"));

export default {
  ...leiteAdressenAb(BASIS_URL),
  titel: "Lern-Apps",
  version: paket.version,
  // Farbe der Übersicht (fachübergreifend); weiße Schrift erreicht WCAG AA.
  farbe: { primaer: "#374151", dunkel: "#1f2937" },
};
