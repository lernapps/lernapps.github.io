/*
 * Konfiguration der App "Prozent-Trainer". Reine Daten, kein DOM: der Build (lib/apps.js), die Seiten und die
 * Tests lesen diese Datei. Der Kern importiert sie NIE – die Seite übergibt APP und KOMPETENZEN (Dependency Inversion).
 */

export const APP = {
  // localStorage-Präfix aus der alten Einzel-App. Nie ändern, sonst ist die gespeicherte Selbsteinschätzung weg.
  id: "prozent-trainer",
  pfad: "prozent", // Ordner unter src/ und Pfad der App: <Basis-URL>prozent/
  titel: "Prozent-Trainer",
  kurzname: "Prozente", // Name unter dem App-Symbol (Manifest)
  fach: "mathe",
  klasse: 8,
  beschreibung: "Interaktiver Trainer für die Prozentrechnung in Klasse 8: sieben Kompetenzen mit Erklärung, Beispiel, Bild und Übungsaufgaben. Ohne Server, ohne Tracking.",
  intro: "Hier übst du die Prozentrechnung aus Klasse 8 – Schritt für Schritt, mit Erklärung, Beispiel, Bild und so vielen Aufgaben, wie du willst. Jede Aufgabe sagt dir sofort, ob dein Ergebnis stimmt, und zeigt dir auf Wunsch den Rechenweg.",
  // Eintrag auf der Mathe-Karte (/karte/, lib/karte/eintraege.js), Skalen nach edugo; Muster und Erklärung: src/binom/.
  kartenEintrag: {
    "aktiv-level": 2,
    backend: "none",
    "external-requests": "on-consent",
    dsgvo: "amber",
    evidence: "anecdotal",
    jahrgaenge: [7, 8],
    lizenz: "",
    stand: "2026-09-23",
  },
};

/** Die Kompetenzen in Checklisten-Reihenfolge (wie in der alten App); die Nummer ergibt sich aus der Position. */
export const KOMPETENZEN = [
  { id: "grundbegriffe", titel: "Grundwert, Prozentwert und Prozentsatz erkennen", kurz: "Grundbegriffe", seite: "grundbegriffe.html", generator: "./aufgaben/grundbegriffe.js", kartenKnoten: ["prozent-grundbegriffe"] },
  { id: "prozentsatz", titel: "Prozentsatz berechnen", kurz: "Prozentsatz", seite: "prozentsatz.html", generator: "./aufgaben/prozentsatz.js", kartenKnoten: ["prozent-prozentsatz"] },
  { id: "prozentwert", titel: "Prozentwert berechnen", kurz: "Prozentwert", seite: "prozentwert.html", generator: "./aufgaben/prozentwert.js", kartenKnoten: ["prozent-prozentwert"] },
  { id: "grundwert", titel: "Grundwert berechnen", kurz: "Grundwert", seite: "grundwert.html", generator: "./aufgaben/grundwert.js", kartenKnoten: ["prozent-grundwert"] },
  { id: "veraenderung", titel: "Prozentuale Zunahme und Abnahme", kurz: "Veränderung", seite: "veraenderung.html", generator: "./aufgaben/veraenderung.js", kartenKnoten: ["prozent-veraenderung"] },
  { id: "vergleich", titel: "Zwei Werte vergleichen", kurz: "Vergleich", seite: "vergleich.html", generator: "./aufgaben/vergleich.js", kartenKnoten: ["prozent-vergleich"] },
  { id: "sachaufgaben", titel: "Sachaufgaben übersetzen", kurz: "Sachaufgaben", seite: "sachaufgaben.html", generator: "./aufgaben/sachaufgaben.js", kartenKnoten: ["prozent-sachaufgaben"] },
];
