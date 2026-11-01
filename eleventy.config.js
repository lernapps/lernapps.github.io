// Builds src/ into _site/. Only Nunjucks files are templates; everything else (llms.txt, .nojekyll,
// CNAME, brand, the copy script of /join/) is copied unchanged.
// Header, footer and the filter "own" come from the shared site frame (site-frame/, also used by apps and docs).
import siteFrame from "./site-frame/eleventy.js";
import icons from "./src/_data/icons.js";

export default function (eleventyConfig) {
  eleventyConfig.addPlugin(siteFrame, { site: "/", source: "https://github.com/lernapps/lernapps.github.io" });

  for (const path of [
    "src/CNAME", // custom domain; the gh-pages branch must carry it
    "src/.nojekyll",
    "src/llms.txt",
    "src/join.js", // copy buttons of the prompts on /join/
    "src/home.css", // gallery, highlighter and red ticks of the home page
    "src/media", // screenshots of the apps and the founder's photo
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

  // Icons instead of emoji: {% icon "lock", "size-8" %} draws an inline SVG (Lucide, see src/_data/icons.js). The lines
  // wobble a little, like drawn by hand: the filter "rough" is defined once per page with {% iconDefs %} and set on the
  // group inside the SVG (not in the stylesheet, so that it finds the filter in the page in every browser).
  eleventyConfig.addShortcode("icon", (name, cls = "") => {
    if (!icons[name]) throw new Error(`icon "${name}" is not in src/_data/icons.js`);
    return `<svg class="icon ${cls}" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><g filter="url(#rough)">${icons[name]}</g></svg>`;
  });
  eleventyConfig.addShortcode(
    "iconDefs",
    () =>
      '<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false"><defs><filter id="rough" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.08" numOctaves="2" seed="4" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="1.2" xChannelSelector="R" yChannelSelector="G"/></filter></defs></svg>',
  );

  // A word in [[double brackets]] gets the highlighter (home.css). The text is escaped first; use with "safe".
  eleventyConfig.addFilter("marked", (text) =>
    String(text)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\[\[(.+?)\]\]/g, '<mark class="mark">$1</mark>'),
  );

  return {
    dir: { input: "src", output: "_site" },
    templateFormats: ["njk"],
    htmlTemplateEngine: "njk",
  };
}
