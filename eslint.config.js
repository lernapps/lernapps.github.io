// ESLint Flat Config (#21): Pflicht-Check gegen gefährliche Muster (Bedrohung T-003, XSS über DOM-Injektion).
// Nur Korrektheit und Sicherheit, keine Formatierung.
import js from "@eslint/js";
import nounsanitized from "eslint-plugin-no-unsanitized";
import globals from "globals";

export default [
  { ignores: ["_site/", "build/", "node_modules/", "src/kern/vendor/"] },
  js.configs.recommended,
  nounsanitized.configs.recommended,
  {
    rules: {
      "no-eval": "error",
      "no-implied-eval": "error",
      // Rest-Destructuring zum Weglassen eines Feldes ist Absicht, keine tote Variable.
      "no-unused-vars": ["error", { ignoreRestSiblings: true }],
    },
  },
  // Browser-Code: Kern und Apps (Generatoren und Bilder laufen zusätzlich im Build unter Node).
  {
    files: ["src/**/*.js"],
    languageOptions: { globals: { ...globals.browser } },
  },
  // Node-Code: Build, Tests, Skripte, Eleventy-Datendateien.
  {
    files: [
      "*.js",
      "lib/**/*.js",
      "test/**/*.js",
      "scripts/**/*.js",
      "src/*/test/**/*.js",
      "src/_data/**/*.js",
      "src/*/*.11tydata.js",
      "src/karte/daten/**/*.js",
    ],
    languageOptions: { globals: { ...globals.node } },
    // Kein DOM unter Node, T-003 betrifft nur den Browser. import() mit berechnetem Pfad lädt hier die eigenen
    // App-Konfigurationen und Generatoren aus dem Repository, keine fremden Eingaben.
    rules: { "no-unsanitized/method": "off", "no-unsanitized/property": "off" },
  },
];
