/*
 * Konfiguration der App "Binomische Formeln". Reine Daten, kein DOM: der Build (lib/apps.js), die Seiten und die
 * Tests lesen diese Datei. Der Kern importiert sie NIE – die Seite übergibt APP und KOMPETENZEN (Dependency Inversion).
 * Adresse, Quellcode-Link, Farbe und Version leitet der Build ab (src/_data/site.js, lib/fachfarben.js, package.json).
 */

export const APP = {
  // localStorage-Präfix. Nie ändern, sonst ist die gespeicherte Selbsteinschätzung weg. Getrennt vom URL-Pfad,
  // damit ein Umzug des Pfads die Daten nicht verliert.
  id: "binom-trainer",
  pfad: "binom", // Ordner unter src/ und Pfad der App: <Basis-URL>binom/
  titel: "Binomische Formeln",
  kurzname: "Binome", // Name unter dem App-Symbol (Manifest)
  fach: "mathe", // mathe | physik | chemie | biologie | informatik – bestimmt die Farbe (lib/fachfarben.js)
  klasse: 8,
  beschreibung: "Binomische Formeln üben, Klasse 8: Klammern multiplizieren, die drei Formeln, rückwärts faktorisieren und geschickt im Kopf rechnen. Mit Flächenbildern und Sofort-Feedback. Ohne Server, ohne Tracking.",
  intro: "Hier übst du die binomischen Formeln aus Klasse 8, vom Ausmultiplizieren zweier Klammern bis zum Kopfrechnen mit 49² – Schritt für Schritt, mit Erklärung, Beispiel, Bild und so vielen Aufgaben, wie du willst. Jede Aufgabe sagt dir sofort, ob dein Ergebnis stimmt, und zeigt dir auf Wunsch den Rechenweg.",
  // Eintrag auf der Mathe-Karte (/karte/, lib/karte/eintraege.js), Skalen nach edugo. id, Titel, Adresse und
  // Beschreibung kommen aus APP, die Knoten aus kartenKnoten der Kompetenzen; jahrgaenge fehlt → [klasse].
  kartenEintrag: {
    "aktiv-level": 2, // 1 Create, 2 Solve, 3 Collaborate, 4 Reflect, 5 Receive
    backend: "none", // none | optional | required
    "external-requests": "on-consent", // none | on-consent | always (Videos erst nach Klick)
    dsgvo: "amber", // green | amber | red | unknown – green vergibt erst eine Prüfung, nie die App selbst
    evidence: "anecdotal", // anecdotal | community-validated | research-backed
    jahrgaenge: [8],
    lizenz: "",
    stand: "2026-09-23",
  },
};

/**
 * Die Kompetenzen in Checklisten-Reihenfolge. Die Nummer (1, 2, …) ergibt sich aus der Position.
 * id: Schlüssel in localStorage und Testergebnis, Name von test/<id>.test.js
 * titel: Zeile in Checkliste und Testergebnis; kurz: Text im Navigationsmenü
 * seite: die Kompetenzseite (Quelle: <id>.md); generator: Modul relativ zu dieser Datei
 * kartenKnoten: ids der Knoten der Mathe-Karte, die diese Kompetenz übt (src/karte/daten/kompetenzen/<id>.md);
 *   ein unbekannter Knoten bricht den Build ab
 */
export const KOMPETENZEN = [
  {
    id: "klammern-multiplizieren",
    titel: "Zwei Klammern multiplizieren",
    kurz: "Klammer mal Klammer",
    seite: "klammern-multiplizieren.html",
    kartenKnoten: ["klammern-binome"],
    generator: "./aufgaben/klammern-multiplizieren.js",
  },
  {
    id: "erste-binomische",
    titel: "Erste binomische Formel",
    kurz: "(a+b)²",
    seite: "erste-binomische.html",
    kartenKnoten: ["klammern-binome"],
    generator: "./aufgaben/erste-binomische.js",
  },
  {
    id: "zweite-binomische",
    titel: "Zweite binomische Formel",
    kurz: "(a−b)²",
    seite: "zweite-binomische.html",
    kartenKnoten: ["klammern-binome"],
    generator: "./aufgaben/zweite-binomische.js",
  },
  {
    id: "dritte-binomische",
    titel: "Dritte binomische Formel",
    kurz: "(a+b)(a−b)",
    seite: "dritte-binomische.html",
    kartenKnoten: ["klammern-binome"],
    generator: "./aufgaben/dritte-binomische.js",
  },
  {
    id: "binome-rueckwaerts",
    titel: "Binome rückwärts",
    kurz: "Rückwärts",
    seite: "binome-rueckwaerts.html",
    kartenKnoten: ["klammern-binome"],
    generator: "./aufgaben/binome-rueckwaerts.js",
  },
  {
    id: "geschickt-rechnen",
    titel: "Geschickt rechnen",
    kurz: "Kopfrechnen",
    seite: "geschickt-rechnen.html",
    kartenKnoten: ["klammern-binome"],
    generator: "./aufgaben/geschickt-rechnen.js",
  },
];
