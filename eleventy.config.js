// Builds src/ into _site/. Only Nunjucks files are templates; everything else (llms.txt, .nojekyll,
// the tab script, CNAME, brand) is copied unchanged.
// Header, footer and the filter "own" come from the shared chrome (chrome/, also used by apps and docs).
import chrome from "./chrome/eleventy.js";

export default function (eleventyConfig) {
  eleventyConfig.addPlugin(chrome, { site: "/", source: "https://github.com/lernapps/lernapps.github.io" });

  for (const path of [
    "src/CNAME", // custom domain; the gh-pages branch must carry it
    "src/.nojekyll",
    "src/llms.txt",
    "src/start.css",
    "src/start.js",
    "src/favicon.svg",
    "src/favicon.ico",
    "src/apple-touch-icon.png",
    "src/brand",
  ]) {
    eleventyConfig.addPassthroughCopy(path);
  }

  // npm run dev: UnoCSS rewrites _site/uno.css after each Eleventy build; reload the browser for that too.
  eleventyConfig.setServerOptions({ watch: ["_site/uno.css"] });

  // Texts in src/_data/de.js separate paragraphs with a blank line, as in the original.
  eleventyConfig.addFilter("paragraphs", (text) => String(text).split("\n\n"));

  return {
    dir: { input: "src", output: "_site" },
    templateFormats: ["njk"],
    htmlTemplateEngine: "njk",
  };
}
