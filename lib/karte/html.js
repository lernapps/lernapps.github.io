/* HTML-Hilfen der Mathe-Karte für die statischen Seiten (Eleventy-Filter "absaetze"). Gleiche Regel wie absaetze()
 * in src/karte/js/karte.js: Absätze durch Leerzeilen, ein Block nur aus "- "-Zeilen wird eine Liste. */
export function escapeHtml(s) {
  return String(s).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
}

export function absaetzeHtml(text) {
  return String(text ?? '').split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean).map((block) => {
    const zeilen = block.split('\n');
    if (zeilen.every((z) => /^[-*] /.test(z))) return `<ul>${zeilen.map((z) => `<li>${escapeHtml(z.slice(2))}</li>`).join('')}</ul>`;
    return `<p>${escapeHtml(zeilen.join(' '))}</p>`;
  }).join('\n');
}
