/*
 * Verzeichnisdaten der Mathe-Karte (/karte/): Layout, Seitenadressen und die Karten-Daten aus src/karte/daten/ plus
 * den Einträgen aus den App-Konfigurationen (lib/karte/laden.js). Ein unbekannter Knoten bricht den Build ab.
 */
import { ladeApps } from "../../lib/apps.js";
import { ladeKarte } from "../../lib/karte/laden.js";
import { AKTIV_LEVEL, DSGVO, EXTERNE_ANFRAGEN } from "./js/daten.js";
import externe from "./daten/externe-eintraege.js";
import site from "../_data/site.js";

export default async function () {
  const apps = await ladeApps({ quelle: "src", adressen: site });
  return {
    layout: "karte.njk",
    permalink: "{{ page.filePathStem }}.html",
    karte: await ladeKarte({ ordner: "src/karte/daten", apps, externe, version: site.version }),
    karteTexte: { aktivLevel: AKTIV_LEVEL, dsgvo: DSGVO, anfragen: EXTERNE_ANFRAGEN },
  };
}
