/*
 * Verzeichnisdaten einer App (src/<app>/<app>.11tydata.js ruft appDaten("<app>") auf): Layout und Adresse der
 * Kompetenzseiten, dazu die App und die Kompetenz der Seite aus den globalen Daten `apps`.
 */
export function appDaten(pfad) {
  return {
    layout: "kompetenz.njk",
    permalink: "{{ page.filePathStem }}.html",
    eleventyComputed: {
      app: (d) => d.apps.find((a) => a.pfad === pfad),
      kompetenzDaten: (d) => d.apps.find((a) => a.pfad === pfad)?.kompetenzen.find((k) => k.id === d.kompetenz),
      seite: (d) => d.page.fileSlug + ".html",
      seitenTitel: (d) => d.apps.find((a) => a.pfad === pfad)?.kompetenzen.find((k) => k.id === d.kompetenz)?.titel,
    },
  };
}
