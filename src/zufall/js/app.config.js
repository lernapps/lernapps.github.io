/*
 * Konfiguration der App "Zufall-Trainer" (Wahrscheinlichkeitsrechnung, Klasse 8). Reine Daten, kein DOM: der Build
 * (lib/apps.js), die Seiten und die Tests lesen diese Datei. Der Kern importiert sie NIE (Dependency Inversion).
 */

export const APP = {
  // localStorage-Präfix. Nie ändern, sonst ist die gespeicherte Selbsteinschätzung weg.
  id: "zufall-trainer",
  pfad: "zufall", // Ordner unter src/ und Pfad der App: <Basis-URL>zufall/
  titel: "Zufall-Trainer",
  kurzname: "Zufall",
  fach: "mathe",
  klasse: 8,
  beschreibung: "Wahrscheinlichkeitsrechnung üben, Klasse 8: Laplace-Formel, Gegenereignis, Baumdiagramm, beide Pfadregeln und Ziehen ohne Zurücklegen. Mit Bildern und Sofort-Feedback. Ohne Server, ohne Tracking.",
  intro: "Hier übst du die Wahrscheinlichkeitsrechnung aus Klasse 8 – vom Würfel bis zum Baumdiagramm mit zwei Pfadregeln, mit Erklärung, Beispiel, Bild und so vielen Aufgaben, wie du willst. Jede Aufgabe sagt dir sofort, ob dein Ergebnis stimmt, und zeigt dir auf Wunsch den Rechenweg.",
};

/** Die acht Kompetenzen in Checklisten-Reihenfolge; die Nummer ergibt sich aus der Position. */
export const KOMPETENZEN = [
  { id: "laplace", titel: "Die Laplace-Formel anwenden: P(E) = günstige durch mögliche Ergebnisse", kurz: "Laplace", seite: "laplace.html", generator: "./aufgaben/laplace.js" },
  { id: "gegenereignis", titel: "Die Gegenwahrscheinlichkeit 1 − p berechnen (auch für „mindestens einmal“)", kurz: "Gegenereignis", seite: "gegenereignis.html", generator: "./aufgaben/gegenereignis.js" },
  { id: "baumdiagramm", titel: "Ein Baumdiagramm zu einem mehrstufigen Zufallsexperiment zeichnen", kurz: "Baumdiagramm", seite: "baumdiagramm.html", generator: "./aufgaben/baumdiagramm.js" },
  { id: "pfadregel-1", titel: "Die erste Pfadregel anwenden (entlang des Pfades multiplizieren)", kurz: "Pfadregel 1", seite: "pfadregel-1.html", generator: "./aufgaben/pfadregel-1.js" },
  { id: "ohne-zuruecklegen", titel: "Beim Ziehen ohne Zurücklegen die veränderten Wahrscheinlichkeiten bestimmen", kurz: "Ohne Zurücklegen", seite: "ohne-zuruecklegen.html", generator: "./aufgaben/ohne-zuruecklegen.js" },
  { id: "pfadregel-2", titel: "Die zweite Pfadregel anwenden (Pfade eines Ereignisses addieren)", kurz: "Pfadregel 2", seite: "pfadregel-2.html", generator: "./aufgaben/pfadregel-2.js" },
  { id: "ergebnisformen", titel: "Ergebnisse als Produkt, Summe oder Potenz angeben", kurz: "Produkt, Summe, Potenz", seite: "ergebnisformen.html", generator: "./aufgaben/ergebnisformen.js" },
  { id: "pfade-uebersetzen", titel: "„Genau einmal“, „beide gleich“ und „mindestens einmal“ in Pfade übersetzen", kurz: "In Pfade übersetzen", seite: "pfade-uebersetzen.html", generator: "./aufgaben/pfade-uebersetzen.js" },
];
