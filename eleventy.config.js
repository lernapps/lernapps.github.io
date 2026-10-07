// Builds src/ into _site/. Only Nunjucks files are templates; everything else (404.html, llms.txt,
// stil.css, .nojekyll, the tab script, CNAME) is copied unchanged.
export default function (eleventyConfig) {
  for (const path of [
    "src/CNAME", // custom domain; the gh-pages branch must carry it
    "src/.nojekyll",
    "src/404.html",
    "src/llms.txt",
    "src/stil.css",
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

  // Links to pages of this site get the path prefix: "/" in production, "/pr-preview/pr-<number>/" in a pull
  // request preview (pr-preview.yml). Paths served by other repos on the same origin stay as they are.
  const PREFIX = process.env.SITE_PATH_PREFIX ?? "/";
  const OTHER_REPOS = ["/apps/", "/docs/", "/mathe-karte/"];
  eleventyConfig.addFilter("own", (href) =>
    href.startsWith("/") && !OTHER_REPOS.some((p) => href.startsWith(p)) ? PREFIX + href.slice(1) : href,
  );

  // Texts in src/_data/de.js separate paragraphs with a blank line, as in the original.
  eleventyConfig.addFilter("paragraphs", (text) => String(text).split("\n\n"));

  return {
    dir: { input: "src", output: "_site" },
    templateFormats: ["njk"],
    htmlTemplateEngine: "njk",
  };
}
