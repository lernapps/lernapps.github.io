/*
 * Lizenzprüfung ohne neue Abhängigkeit (Harness-Rad: license-compliance, ADR-029). Liest package-lock.json
 * (lockfileVersion 3, Einträge unter `packages` mit `license`, `dev`, `optional`) und meldet jedes Paket ohne Lizenz
 * oder mit einer Lizenz außerhalb der Allowlist. Die Allowlist hängt von der Verwendung ab: ausgelieferte
 * (Nicht-dev-)Pakete nur permissiv, dev-Pakete zusätzlich MPL-2.0 (Datei-Copyleft, nur im Build). Außerdem braucht
 * jede Datei unter einem vendor/-Ordner in src/ einen Lizenzkopf. Läuft über test/build/pruefe-lizenzen.test.js
 * in `npm test` (Pflicht-Check test-und-build).
 */
import fs from "node:fs";
import path from "node:path";

export const ERLAUBT_AUSGELIEFERT = new Set(["MIT", "ISC", "Apache-2.0", "BSD-2-Clause", "BSD-3-Clause", "0BSD",
  "BlueOak-1.0.0", "CC0-1.0", "Unlicense", "Python-2.0"]);
export const ERLAUBT_DEV = new Set([...ERLAUBT_AUSGELIEFERT, "MPL-2.0"]);

const WEITER = "Nicht aufnehmen; eine Änderung der Allowlist in lib/pruefe-lizenzen.js braucht ein ADR (arc42 Kap. 9).";

/**
 * Ist der SPDX-Ausdruck mit dieser Allowlist erlaubt? OR: ein erlaubter Teil reicht; AND: alle Teile müssen
 * erlaubt sein (AND bindet stärker als OR); Klammern gruppieren; `X WITH Ausnahme` zählt wie X.
 */
export function lizenzErlaubt(ausdruck, erlaubt) {
  const tokens = String(ausdruck ?? "").match(/\(|\)|[^\s()]+/g) ?? [];
  let i = 0;
  const oder = () => {
    let wert = und();
    while (tokens[i] === "OR") { i++; wert = und() || wert; }
    return wert;
  };
  const und = () => {
    let wert = eins();
    while (tokens[i] === "AND") { i++; wert = eins() && wert; }
    return wert;
  };
  const eins = () => {
    const t = tokens[i++];
    if (t === "(") { const wert = oder(); if (tokens[i++] !== ")") throw new Error("Klammer"); return wert; }
    if (t === undefined || t === ")" || t === "AND" || t === "OR") throw new Error("Ausdruck");
    if (tokens[i] === "WITH") i += 2;
    return erlaubt.has(t);
  };
  try {
    const wert = oder();
    return i === tokens.length && tokens.length > 0 && wert;
  } catch {
    return false;
  }
}

const paketName = (schluessel) => schluessel.slice(schluessel.lastIndexOf("node_modules/") + "node_modules/".length);

/** Liefert Fehlermeldungen für ein geparstes package-lock.json (leer = alles erlaubt). */
export function pruefeLizenzen(lockfile) {
  const pakete = lockfile?.packages;
  if (!pakete || typeof pakete !== "object") {
    return ["package-lock.json hat keine `packages` (lockfileVersion 3 nötig): `npm install --lockfile-version 3`."];
  }
  const fehler = [];
  for (const [schluessel, paket] of Object.entries(pakete)) {
    if (schluessel === "" || paket.link) continue;
    const name = `${paketName(schluessel)}@${paket.version ?? "?"}`;
    const lizenz = typeof paket.license === "string" ? paket.license.trim() : "";
    if (!lizenz) { fehler.push(`${name}: keine Lizenz im Lockfile. ${WEITER}`); continue; }
    const dev = paket.dev === true;
    if (!lizenzErlaubt(lizenz, dev ? ERLAUBT_DEV : ERLAUBT_AUSGELIEFERT)) {
      const art = dev ? "dev-Paket" : "ausgeliefertes Paket (nur permissive Lizenzen)";
      fehler.push(`${name}: Lizenz „${lizenz}“ ist für ${art} nicht in der Allowlist. ${WEITER}`);
    }
  }
  return fehler;
}

const KOPF = /SPDX-License-Identifier:|\bLicen[cs]e\b/i;

/** dateien: { <Pfad>: <Inhalt> }. Jede Datei braucht in den ersten 10 Zeilen eine SPDX-Kennung oder „License“. */
export function pruefeVendorKoepfe(dateien) {
  return Object.entries(dateien)
    .filter(([, inhalt]) => !KOPF.test(inhalt.split("\n").slice(0, 10).join("\n")))
    .map(([datei]) => `${datei}: fremder Code ohne Lizenzkopf (SPDX-License-Identifier oder „License“ in den ersten `
      + "10 Zeilen). Lizenz der Quelle ergänzen; eine neue Lizenzart braucht ein ADR.");
}

/** Alle Dateien unter einem vendor/-Ordner in `wurzel` (rekursiv), als { <Pfad relativ zum Repo>: <Inhalt> }. */
export function vendorDateien(wurzel) {
  const ergebnis = {};
  const basis = path.dirname(wurzel);
  const lauf = (ordner, imVendor) => {
    for (const eintrag of fs.readdirSync(ordner, { withFileTypes: true })) {
      const voll = path.join(ordner, eintrag.name);
      if (eintrag.isDirectory()) lauf(voll, imVendor || eintrag.name === "vendor");
      else if (imVendor) ergebnis[path.relative(basis, voll).split(path.sep).join("/")] = fs.readFileSync(voll, "utf8");
    }
  };
  lauf(wurzel, false);
  return ergebnis;
}
