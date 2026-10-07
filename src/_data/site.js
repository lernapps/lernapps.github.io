// Settings of the build. Pull request previews (pr-preview.yml) set SITE_PATH_PREFIX and SITE_PREVIEW:
// own links get the prefix (filter "own" in eleventy.config.js), pages show a banner and are not indexed.
export default {
  preview: Boolean(process.env.SITE_PREVIEW),
};
