// Settings of the build. Pull request previews (pr-preview.yml) set SITE_PATH_PREFIX and SITE_PREVIEW:
// own links get the prefix (filter "own" in eleventy.config.js), pages show a banner and are not indexed.
// counter: the usage counter of the platform sites is on (COUNTER in site-frame/nav.js); the privacy notice says so.
import { COUNTER } from "../../site-frame/nav.js";

export default {
  preview: Boolean(process.env.SITE_PREVIEW),
  counter: Boolean(COUNTER),
};
