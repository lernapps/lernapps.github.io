/*
 * Alle Adressen folgen aus EINER Basis-URL (src/_data/site.js): Pfad-Präfix für Eleventy, Repository,
 * App-Adressen, Quellcode-Links. Zieht das Repo um (z. B. in eine GitHub-Organisation), ändert sich nur die Basis.
 */

/** Leitet aus der Basis-URL alle Adressen ab; `repo` nur nötig, wenn die Basis keine <owner>.github.io/<repo>/-Adresse ist. */
export function leiteAdressenAb(basisUrl, repo) {
  const url = new URL(basisUrl);
  if (!url.pathname.endsWith("/")) url.pathname += "/";
  const basis = url.href;
  const pfadPraefix = url.pathname;
  const owner = url.hostname.match(/^([^.]+)\.github\.io$/)?.[1];
  const repoName = pfadPraefix.split("/").filter(Boolean)[0];
  const repoUrl = repo ?? (owner && repoName ? `https://github.com/${owner}/${repoName}` : undefined);
  if (!repoUrl) throw new Error(`Aus ${basis} lässt sich kein GitHub-Repository ableiten – repo angeben.`);
  return {
    basis,
    pfadPraefix,
    repo: repoUrl,
    appUrl: (pfad) => `${basis}${pfad}/`,
    quellcode: (pfad) => `${repoUrl}/tree/main/src/${pfad}`,
  };
}
