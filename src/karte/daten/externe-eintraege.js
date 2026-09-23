/*
 * ÜBERGANG: Einträge der Karte für Apps, die noch nicht aus ihrem eigenen Repository ins Monorepo gezogen sind.
 * Werte aus mathe-karte/data/eintraege/*.md (Stand 0.2.1). Sobald src/<pfad>/ existiert, zeigt der Eintrag
 * automatisch auf die Monorepo-Adresse. Trägt die App dann selbst APP.kartenEintrag und kartenKnoten, bricht der
 * Build ab, bis der Eintrag hier gelöscht ist (lib/karte/eintraege.js). Einträge ohne pfad sind Apps, die nie ins
 * Monorepo kommen (fremde Community-Apps); für sie bleibt diese Datei der Ort.
 */
export default [
  {
    pfad: "prozent",
    id: "prozent-trainer",
    titel: "Prozent-Trainer",
    url: "https://raifdmueller.github.io/prozent-trainer/",
    quellcode: "https://github.com/raifdmueller/prozent-trainer",
    kompetenzen: ["prozent-grundbegriffe", "prozent-prozentsatz", "prozent-prozentwert", "prozent-grundwert",
      "prozent-veraenderung", "prozent-vergleich", "prozent-sachaufgaben"],
    "aktiv-level": 2,
    backend: "none",
    "external-requests": "on-consent",
    dsgvo: "amber",
    evidence: "anecdotal",
    jahrgaenge: [7, 8],
    lizenz: "",
    stand: "2026-09-23",
    beschreibung: "Statischer, interaktiver Trainer für die Prozentrechnung (Klasse 7/8, Gymnasium Hessen) mit sieben Kompetenzseiten: Grundbegriffe erkennen, Prozentsatz, Prozentwert und Grundwert berechnen, prozentuale Zunahme und Abnahme, zwei Werte vergleichen, Sachaufgaben in Gleichung oder Dreisatz übersetzen.",
  },
  {
    pfad: "zufall",
    id: "zufall-trainer",
    titel: "Zufall-Trainer",
    url: "https://raifdmueller.github.io/zufall-trainer/",
    quellcode: "https://github.com/raifdmueller/zufall-trainer",
    kompetenzen: ["zufall-laplace", "zufall-gegenereignis", "zufall-baumdiagramm", "zufall-pfadregel-1",
      "zufall-ohne-zuruecklegen", "zufall-pfadregel-2", "zufall-ergebnisform", "zufall-ereignis-uebersetzen"],
    "aktiv-level": 2,
    backend: "none",
    "external-requests": "on-consent",
    dsgvo: "amber",
    evidence: "anecdotal",
    jahrgaenge: [7, 8],
    lizenz: "",
    stand: "2026-09-23",
    beschreibung: "Statischer, interaktiver Trainer für die Wahrscheinlichkeitsrechnung (Klasse 7/8, Gymnasium Hessen): Laplace-Formel, Gegenereignis, Baumdiagramm, erste und zweite Pfadregel, Ziehen ohne Zurücklegen, Ergebnisse als Produkt, Summe oder Potenz stehen lassen und Ereignisse wie „mindestens einmal“ in Pfade übersetzen.",
  },
];
