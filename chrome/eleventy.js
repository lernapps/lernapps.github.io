// Eleventy plugin for the shared chrome. Usage in eleventy.config.js:
//
//   import chrome from "@lernapps/site/eleventy";
//   eleventyConfig.addPlugin(chrome, { site: "/apps/", source: "https://github.com/lernapps/apps" });
//
// Then in a layout: {% laHead %} in <head>, {% laHeader page.url %} after <body>, {% laFooter %} before
// </body>, and <main id="main-content">. The build's prefix comes from SITE_PATH_PREFIX (pull request
// previews), the banner from SITE_PREVIEW. Adds the filter "own" for links (see link() in chrome.js) and
// copies tokens.css and chrome.css next to the site (STYLES).
import { relative, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { head, header, footer, link, STYLES } from "./chrome.js";

const here = relative(process.cwd(), dirname(fileURLToPath(import.meta.url))) || ".";

export default function chrome(eleventyConfig, { site = "/", source } = {}) {
  const prefix = process.env.SITE_PATH_PREFIX ?? site;
  const preview = Boolean(process.env.SITE_PREVIEW);
  const opts = { site, prefix };

  eleventyConfig.addPassthroughCopy(Object.fromEntries(Object.entries(STYLES).map(([src, out]) => [`${here}/${src}`, out])));
  eleventyConfig.addFilter("own", (href) => link(href, opts));
  eleventyConfig.addShortcode("laHead", () => head(opts));
  eleventyConfig.addShortcode("laHeader", (url = "/") =>
    header({ ...opts, preview, path: site + String(url).replace(/^\//, "") }),
  );
  eleventyConfig.addShortcode("laFooter", () => footer({ ...opts, source }));
}
