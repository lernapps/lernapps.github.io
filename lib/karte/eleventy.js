/*
 * Einbindung der Mathe-Karte (src/karte/ → /karte/) in den Eleventy-Build: Markdown-Daten und Tests sind keine
 * Seiten, JS/CSS/Schemas werden kopiert. Die Daten selbst lädt src/karte/karte.11tydata.js (lib/karte/laden.js).
 */
import { absaetzeHtml } from './html.js';

export function richteKarteEin(eleventyConfig) {
  eleventyConfig.ignores.add('src/karte/daten/**');
  eleventyConfig.ignores.add('src/karte/test/**');
  eleventyConfig.addPassthroughCopy({ 'src/karte/js': 'karte/js', 'src/karte/css': 'karte/css', 'src/karte/schemas': 'karte/schemas' });
  eleventyConfig.addFilter('absaetze', absaetzeHtml);
}
