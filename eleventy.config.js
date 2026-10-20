// Builds src/ into _site/. Only Nunjucks files are templates; everything else (llms.txt, .nojekyll,
// CNAME, brand, the copy script of /join/) is copied unchanged.
// Header, footer and the filter "own" come from the shared site frame (site-frame/, also used by apps and docs).
import siteFrame from "./site-frame/eleventy.js";
import { COUNT_SCRIPT } from "./site-frame/frame.js";

export default function (eleventyConfig) {
  eleventyConfig.addPlugin(siteFrame, { site: "/", source: "https://github.com/lernapps/lernapps.github.io" });

  for (const path of [
    "src/CNAME", // custom domain; the gh-pages branch must carry it
    "src/.nojekyll",
    "src/llms.txt",
    "src/join.js", // copy buttons of the prompts on /join/
    "src/favicon.svg",
    "src/favicon.ico",
    "src/apple-touch-icon.png",
    "src/brand",
  ]) {
    eleventyConfig.addPassthroughCopy(path);
  }
  // The usage counter of the platform sites (site-frame/count.js), served for all of them from here.
  eleventyConfig.addPassthroughCopy({ "site-frame/count.js": COUNT_SCRIPT.slice(1) });

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
