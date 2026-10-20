// Eleventy plugin for the shared site frame. Usage in eleventy.config.js:
//
//   import siteFrame from "@lernapps/site/eleventy";
//   eleventyConfig.addPlugin(siteFrame, { site: "/apps/", source: "https://github.com/lernapps/apps" });
//
// Then in a layout: {% laHead page.url %} in <head>, {% laHeader page.url %} after <body>, {% laFooter page.url %}
// before </body>, and <main id="main-content">. The url decides the language of the page (below /en/ it is English)
// and where its language switch leads; a page that exists in one language only passes it as a second
// argument to laHead and laHeader: {% laHeader page.url, "de" %}, and gets no language switch. The build's prefix comes from SITE_PATH_PREFIX (pull request
// previews), the banner from SITE_PREVIEW. Adds the filter "own" for links (see link() in frame.js) and
// copies tokens.css and frame.css next to the site (STYLES).
import { relative, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { head, header, footer, link, STYLES } from "./frame.js";

const here = relative(process.cwd(), dirname(fileURLToPath(import.meta.url))) || ".";

export default function siteFrame(eleventyConfig, { site = "/", source } = {}) {
  const prefix = process.env.SITE_PATH_PREFIX ?? site;
  const preview = Boolean(process.env.SITE_PREVIEW);
  const opts = { site, prefix };

  eleventyConfig.addPassthroughCopy(Object.fromEntries(Object.entries(STYLES).map(([src, out]) => [`${here}/${src}`, out])));
  eleventyConfig.addFilter("own", (href) => link(href, opts));
  const pathOf = (url = "/") => site + String(url).replace(/^\//, "");
  const languagesOf = (only) => (only ? [only] : undefined);
  eleventyConfig.addShortcode("laHead", (url, only) =>
    head({ ...opts, preview, path: url && pathOf(url), languages: languagesOf(only) }),
  );
  eleventyConfig.addShortcode("laHeader", (url, only) =>
    header({ ...opts, preview, path: pathOf(url), ...(only && { languages: [only] }) }),
  );
  eleventyConfig.addShortcode("laFooter", (url) => footer({ ...opts, source, path: pathOf(url) }));
}
