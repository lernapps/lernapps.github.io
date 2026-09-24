// Kleiner statischer Server für die Browser-Tests (#26): liefert _site/ aus, ohne weitere Abhängigkeit.
// Ordner-URLs ("/binom/") liefern index.html, wie GitHub Pages. Nur für localhost, nie für die Auslieferung.
import http from "node:http";
import fs from "node:fs";
import path from "node:path";

const WURZEL = path.resolve(process.argv[2] || "_site");
const PORT = Number(process.env.PORT || 8813);
const TYPEN = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8",
  ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8", ".md": "text/markdown; charset=utf-8", ".webmanifest": "application/manifest+json",
};

function datei(url) {
  const pfad = decodeURIComponent(new URL(url, "http://localhost").pathname);
  let ziel = path.join(WURZEL, pfad);
  if (!ziel.startsWith(WURZEL)) return undefined;
  if (fs.existsSync(ziel) && fs.statSync(ziel).isDirectory()) ziel = path.join(ziel, "index.html");
  return fs.existsSync(ziel) ? ziel : undefined;
}

http.createServer((anfrage, antwort) => {
  const ziel = datei(anfrage.url);
  if (!ziel) {
    antwort.writeHead(404, { "content-type": "text/plain" }).end("Nicht gefunden");
    return;
  }
  antwort.writeHead(200, { "content-type": TYPEN[path.extname(ziel)] || "application/octet-stream" });
  fs.createReadStream(ziel).pipe(antwort);
}).listen(PORT, "127.0.0.1", () => console.log(`_site auf http://127.0.0.1:${PORT}/`));
