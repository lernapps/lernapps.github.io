// Builds src/ into _site/. Only Nunjucks files are templates; everything else (404.html with its
// forwarding script, the "moved" stubs *.md/*.txt, llms.txt, stil.css, .nojekyll, the tab script)
// is copied unchanged. Markdown stubs must NOT be rendered: AI tutors fetch them as plain files.
export default function (eleventyConfig) {
  for (const path of [
    "src/.nojekyll",
    "src/404.html",
    "src/llms.txt",
    "src/stil.css",
    "src/start.css",
    "src/start.js",
    "src/binom",
    "src/prozent",
    "src/zufall",
    "src/karte",
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
