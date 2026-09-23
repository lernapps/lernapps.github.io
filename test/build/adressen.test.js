// Use Case: Umzug des Repos (z. B. in eine GitHub-Organisation) – alle Adressen folgen aus EINER Basis-URL.
import { test } from "node:test";
import assert from "node:assert/strict";
import { leiteAdressenAb } from "../../lib/adressen.js";

test("aus der Basis-URL folgen Pfad-Präfix, Repository und App-Adressen", () => {
  const a = leiteAdressenAb("https://raifdmueller.github.io/lern-apps/");
  assert.equal(a.basis, "https://raifdmueller.github.io/lern-apps/");
  assert.equal(a.pfadPraefix, "/lern-apps/");
  assert.equal(a.repo, "https://github.com/raifdmueller/lern-apps");
  assert.equal(a.appUrl("binom"), "https://raifdmueller.github.io/lern-apps/binom/");
  assert.equal(a.quellcode("binom"), "https://github.com/raifdmueller/lern-apps/tree/main/src/binom");
});

test("eine Organisation als Besitzer ändert nur die Basis-URL", () => {
  const a = leiteAdressenAb("https://lern-apps-org.github.io/apps");
  assert.equal(a.basis, "https://lern-apps-org.github.io/apps/", "Schrägstrich wird ergänzt");
  assert.equal(a.repo, "https://github.com/lern-apps-org/apps");
  assert.equal(a.appUrl("binom"), "https://lern-apps-org.github.io/apps/binom/");
});

test("eine eigene Domain ohne github.io braucht die Repo-Adresse ausdrücklich", () => {
  assert.throws(() => leiteAdressenAb("https://lernen.example.org/"), /repo/);
  const a = leiteAdressenAb("https://lernen.example.org/", "https://github.com/x/y");
  assert.equal(a.pfadPraefix, "/");
  assert.equal(a.quellcode("binom"), "https://github.com/x/y/tree/main/src/binom");
});

test("die Site einer Organisation an der Wurzel: Repository <org>.github.io, kein Pfad-Präfix", () => {
  const a = leiteAdressenAb("https://lernapps.github.io/");
  assert.equal(a.pfadPraefix, "/");
  assert.equal(a.repo, "https://github.com/lernapps/lernapps.github.io");
  assert.equal(a.appUrl("binom"), "https://lernapps.github.io/binom/");
  assert.equal(a.quellcode("binom"), "https://github.com/lernapps/lernapps.github.io/tree/main/src/binom");
});

// Use Case: Rückmeldung – jede Seite verlinkt ein neues GitHub-Issue, der Titel nennt die Seite (statisch, ohne JS).
test("Melde-Link: neues Issue im Repository, Titel mit dem Seitenpfad", () => {
  const a = leiteAdressenAb("https://lernapps.github.io/");
  assert.equal(
    a.meldeUrl("/binom/erste-binomische.html"),
    "https://github.com/lernapps/lernapps.github.io/issues/new?title=R%C3%BCckmeldung%20zu%20%2Fbinom%2Ferste-binomische.html%3A%20",
  );
});
